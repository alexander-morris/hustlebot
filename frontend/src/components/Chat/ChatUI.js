import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { colors } from '../../utils/colors';
import { sendMessage } from '../../services/ai';
import GoogleSignIn from '../Auth/GoogleSignIn';
import { generateReferralCode, generateUniqueCode } from '../../utils/referralUtils';
import { FALLBACK_QUESTIONS } from '../../utils/chatQuestions';

export default function ChatUI({ questionsBeforeLogin, showRefOffer }) {
  console.log('ChatUI initialized with:', { questionsBeforeLogin, showRefOffer });
  const isDev = process.env.NODE_ENV === 'development';
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [connectionError, setConnectionError] = useState(false);
  const [questionCount, setQuestionCount] = useState(0);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [user, setUser] = useState(null);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [referralCode, setReferralCode] = useState(null);
  const [showRefModal, setShowRefModal] = useState(false);
  const listRef = useRef(null);
  const usedQuestionIndicesRef = useRef(new Set());
  const [error, setError] = useState(null);

  // Cleanup used questions on unmount
  useEffect(() => {
    return () => {
      usedQuestionIndicesRef.current = new Set();
    };
  }, []);

  const getRandomFallbackQuestion = () => {
    console.log('Getting random question. Used indices:', 
      Array.from(usedQuestionIndicesRef.current));
    
    // If all questions have been used, reset the tracking
    if (usedQuestionIndicesRef.current.size >= FALLBACK_QUESTIONS.length) {
      console.log('All questions used, resetting tracking');
      usedQuestionIndicesRef.current = new Set();
    }
    
    // Get an unused random question
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * FALLBACK_QUESTIONS.length);
    } while (usedQuestionIndicesRef.current.has(randomIndex));
    
    console.log('Selected question index:', randomIndex);
    usedQuestionIndicesRef.current.add(randomIndex);
    
    return FALLBACK_QUESTIONS[randomIndex];
  };

  // If showRefOffer is true, show the referral code interface immediately
  useEffect(() => {
    console.log('Processing showRefOffer:', showRefOffer);
    if (showRefOffer) {
      const generateInitialReferral = async () => {
        try {
          const tempUserId = 'temp-' + Date.now();
          const code = await generateReferralCode(tempUserId);
          console.log('Generated initial referral code:', code);
          setReferralCode(code);
          setShowRefModal(true);
        } catch (error) {
          console.error('Error generating initial referral code:', error);
        }
      };
      generateInitialReferral();
    }
  }, [showRefOffer]);

  // Debug logging for state changes
  useEffect(() => {
    console.log('State updated:', {
      user: user ? { ...user, uid: user.uid } : null,
      referralCode,
      showLoginPrompt,
      questionCount,
      showExitConfirm,
      showRefModal
    });
  }, [user, referralCode, showLoginPrompt, questionCount, showExitConfirm, showRefModal]);

  // Configure when to show login prompt based on environment and URL params
  const LOGIN_PROMPT_THRESHOLD = isDev ? 
    (questionsBeforeLogin || 5) : 
    5;

  useEffect(() => {
    const initialQuestion = getRandomFallbackQuestion();
    const welcomeMessage = {
      id: Date.now(),
      text: `Welcome! I'm here to help you achieve your goals. ${initialQuestion.text}`,
      sender: 'bot',
      isQuestion: true,
      options: initialQuestion.options
    };
    setMessages([welcomeMessage]);
  }, []);

  useEffect(() => {
    if (isDev) {
      console.log('Development mode: Chat initialized');
    }
  }, []);

  // Watch question count and show login prompt at threshold
  useEffect(() => {
    if (questionCount >= LOGIN_PROMPT_THRESHOLD && !showLoginPrompt && !user) {
      console.log(`Showing login prompt after ${questionCount} questions`);
      setShowLoginPrompt(true);
    }
  }, [questionCount, showLoginPrompt, user]);

  useEffect(() => {
    // Check backend connection
    const checkConnection = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/health');
        if (!response.ok) throw new Error('Backend unavailable');
        setConnectionError(false);
      } catch (error) {
        console.error('Connection check failed:', error);
        setConnectionError(true);
      }
    };
    
    checkConnection();
    const interval = setInterval(checkConnection, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSendMessage = async () => {
    if (!input.trim() || loading) return;
    
    try {
      if (connectionError) {
        throw new Error('Cannot connect to chat service');
      }

      setLoading(true);
      const userMessage = { id: Date.now(), text: input, sender: 'user' };
      setMessages(prev => [...prev, userMessage]);
      setInput('');
      
      const result = await sendMessage(input);
      
      // Handle various error cases
      if (!result) {
        throw new Error('No response received from server');
      }
      
      if (!result.text && !result.options) {
        const fallbackQuestion = getRandomFallbackQuestion();
        result.text = fallbackQuestion.text;
        result.options = fallbackQuestion.options;
      }
      
      const botMessage = {
        id: Date.now(),
        text: result.text || "I'm having trouble understanding. Could you rephrase that?",
        sender: 'bot',
        isQuestion: typeof result.text === 'string' && 
          (result.text.includes('?') || result.text.includes("I'd like to understand")),
        options: result.options || []
      };
      
      setMessages(prev => [...prev, botMessage]);
      
      // Increment question count if this was a question
      if (botMessage.isQuestion) {
        const newCount = questionCount + 1;
        setQuestionCount(newCount);
      }
    } catch (error) {
      console.error('Chat error:', error);
      const fallbackQuestion = getRandomFallbackQuestion();
      console.log('Using fallback question:', fallbackQuestion);
      
      let errorMessage;
      if (connectionError) {
        errorMessage = 'Cannot connect to chat service. Please check your connection.';
      } else if (error.message.includes('Empty response') || error.message.includes('No response')) {
        errorMessage = fallbackQuestion.text;
      } else {
        errorMessage = `I apologize for the confusion. ${fallbackQuestion.text}`;
      }
      
      setMessages(prev => [...prev, {
        id: Date.now(),
        text: errorMessage,
        sender: 'bot',
        isQuestion: true,
        options: fallbackQuestion.options
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickResponse = async (response) => {
    if (loading) return;
    
    try {
      setLoading(true);
      const userMessage = { id: Date.now(), text: response, sender: 'user' };
      setMessages(prev => [...prev, userMessage]);
      
      const result = await sendMessage(response);
      
      // Handle various error cases
      if (!result) {
        throw new Error('No response received from server');
      }
      
      if (!result.text && !result.options) {
        const fallbackQuestion = getRandomFallbackQuestion();
        result.text = fallbackQuestion.text;
        result.options = fallbackQuestion.options;
      }
      
      const botMessage = {
        id: Date.now(),
        text: result.text || "I understand. Tell me more about that.",
        sender: 'bot',
        isQuestion: typeof result.text === 'string' && 
          (result.text.includes('?') || result.text.includes("I'd like to understand")),
        options: result.options || []
      };
      
      setMessages(prev => [...prev, botMessage]);
      
      // Increment question count and check for login prompt
      if (botMessage.isQuestion) {
        const newCount = questionCount + 1;
        setQuestionCount(newCount);
      }
    } catch (error) {
      console.error('Quick response error:', error);
      // Handle specific error types with engaging fallback questions
      let errorMessage;
      let errorOptions;
      const fallbackQuestion = getRandomFallbackQuestion();
      
      if (connectionError) {
        errorMessage = 'Cannot connect to chat service. Please check your connection.';
        errorOptions = [];
      } else if (error.message.includes('Empty response') || error.message.includes('No response')) {
        errorMessage = fallbackQuestion.text;
        errorOptions = fallbackQuestion.options;
      } else {
        errorMessage = `That's an interesting perspective. ${fallbackQuestion.text}`;
        errorOptions = fallbackQuestion.options;
      }
      
      setMessages(prev => [...prev, {
        id: Date.now(),
        text: errorMessage,
        sender: 'bot',
        isQuestion: true,
        options: errorOptions
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // TODO: Implement Google OAuth
    console.log('Google login clicked');
  };

  const handleGoogleSignIn = async (userData) => {
    if (!userData?.uid) {
      console.error('Invalid user data received:', userData);
      return;
    }

    console.log('Starting Google sign in process...', userData);
    
    try {
      // First set the user to ensure we have the uid
      setUser(userData);
      console.log('User set:', userData);
      
      // Generate and show referral code
      let code;
      try {
        code = await generateReferralCode(userData.uid);
        console.log('Generated referral code:', code);
      } catch (error) {
        console.error('Failed to generate referral code:', error);
        code = generateUniqueCode();
        console.log('Using temporary code:', code);
      }
      
      setReferralCode(code);
      setShowLoginPrompt(false);
      setShowRefModal(true);
      
      console.log('Updated state:', {
        user: userData,
        referralCode: code,
        showLoginPrompt: false,
        showRefModal: true
      });
    } catch (error) {
      console.error('Error in sign-in process:', error);
      setUser(null);
      setShowLoginPrompt(false);
      alert(
        'Sign-in process failed. Please try again later. ' +
        'If the problem persists, please contact support.'
      );
    }
  };

  const handleSkipSignIn = () => {
    setShowLoginPrompt(false);
    console.log('User skipped sign in');
  };

  const handleExit = () => {
    setShowExitConfirm(true);
  };

  const handleExitWithReferral = () => {
    console.log('Exiting with referral code:', referralCode);
    setShowExitConfirm(true);
  };

  const handleConfirmExit = () => {
    console.log('Confirmed exit, navigating to homepage');
    // Reset states
    setShowRefModal(false);
    setShowExitConfirm(false);
    setMessages([]);
    setInput('');
    // Navigate to root/landing page
    window.location.href = '/';
  };

  const handleCancelExit = () => {
    console.log('Cancelled exit');
    setShowExitConfirm(false);
  };

  const renderReferralModal = () => {
    if (referralCode && (user?.uid || showRefModal)) {
      console.log('Rendering referral code interface:', { 
        user: user || 'no user', 
        referralCode: referralCode || 'no code',
        userExists: !!user,
        codeExists: !!referralCode,
        showRefModal,
        showRefOffer
      });
      return (
        <View style={styles.modalOverlay}>
          <View style={styles.referralContainer}>
            <Text style={styles.referralTitle}>
              Congratulations! 🎉
            </Text>
            <View style={styles.referralCodeBox}>
              <Text style={styles.referralCodeLabel}>
                Your Referral Code:
              </Text>
              <TouchableOpacity 
                style={styles.copyContainer}
                onPress={() => {
                  navigator.clipboard.writeText(referralCode);
                  // Show temporary feedback
                  const element = document.getElementById('copyFeedback');
                  if (element) {
                    element.style.opacity = '1';
                    setTimeout(() => {
                      element.style.opacity = '0';
                    }, 2000);
                  }
                }}
              >
                <Text style={styles.referralCodeText}>
                  {referralCode}
                </Text>
                <View style={styles.copyButton}>
                  <Text style={styles.copyIcon}>📋</Text>
                </View>
              </TouchableOpacity>
              <Text id="copyFeedback" style={styles.copyFeedback}>
                Copied to clipboard!
              </Text>
              <Text style={styles.referralExpiry}>
                Valid for 48 hours
              </Text>
            </View>
            <Text style={styles.referralMessage}>
              Share this code with friends to give them access to our AI assistant!
            </Text>
            <TouchableOpacity
              style={styles.exitButton}
              onPress={handleExitWithReferral}
            >
              <Text style={styles.exitButtonText}>
                Return to Home
              </Text>
            </TouchableOpacity>
          </View>
          
          {showExitConfirm && (
            <View style={styles.confirmModal}>
              <Text style={styles.confirmTitle}>
                Are you sure?
              </Text>
              <Text style={styles.confirmText}>
                Make sure you've saved your referral code before leaving.
              </Text>
              <View style={styles.confirmButtons}>
                <TouchableOpacity 
                  style={[styles.confirmButton, styles.cancelButton]}
                  onPress={handleCancelExit}
                >
                  <Text style={[styles.confirmButtonText, { color: colors.text.primary }]}>
                    Back
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.confirmButton, styles.confirmExitButton]}
                  onPress={handleConfirmExit}
                >
                  <Text style={styles.confirmButtonText}>
                    Yes, Exit
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      );
    }
    return null;
  };

  // Add debug logging for render conditions
  useEffect(() => {
    console.log('Render state:', {
      user: !!user,
      referralCode: !!referralCode,
      showLoginPrompt,
      questionCount
    });
  }, [user, referralCode, showLoginPrompt, questionCount]);

  useEffect(() => {
    console.log('Referral display conditions updated:', {
      user: user?.uid,
      referralCode,
      showRefModal,
      showRefOffer,
      shouldShow: (user?.uid && referralCode) || (showRefModal && referralCode)
    });
  }, [user, referralCode, showRefModal, showRefOffer]);

  // Monitor state transitions for referral display
  useEffect(() => {
    if (user?.uid && !referralCode && !showRefModal) {
      console.log('User signed in but no referral code yet, generating...');
      generateReferralCode(user.uid)
        .then(code => {
          console.log('Generated referral code after state check:', code);
          setReferralCode(code);
          setShowRefModal(true);
        })
        .catch(error => {
          console.error('Failed to generate referral code:', error);
          alert('Failed to generate referral code. Please try again.');
        });
    }
  }, [user, referralCode, showRefModal]);

  useEffect(() => {
    if (error) {
      console.error('ChatUI error:', error);
      alert('An error occurred. Please try again.');
      setError(null);
    }
  }, [error]);

  const handleError = (error) => {
    console.error('Handling error:', error);
    setError(error);
  };

  return (
    <View style={styles.container}>
      {error && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>
            An error occurred. Please try again.
          </Text>
        </View>
      )}
      {isDev && (
        <View style={styles.devBanner}>
          <Text style={styles.devBannerText}>
            Development Mode
          </Text>
        </View>
      )}
      <FlatList
        ref={listRef}
        style={styles.messageList}
        data={messages}
        renderItem={({ item }) => (
          <View style={[
            styles.message,
            item.sender === 'user' ? styles.userMessage : styles.botMessage,
            item.isQuestion && styles.questionMessage,
            item.isReferralCode && styles.referralMessage
          ]}>
            <Text style={[
              styles.messageText,
              item.sender === 'user' ? styles.userMessageText : styles.botMessageText,
              item.isQuestion && styles.questionText,
              item.isReferralCode && styles.referralText
            ]}>
              {item.text}
            </Text>
            {item.options && item.sender === 'bot' && (
              <View style={styles.optionsContainer}>
                {item.options.map((option, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.optionButton}
                    onPress={() => handleQuickResponse(option)}
                    disabled={loading}
                  >
                    <Text style={styles.optionText}>{option}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        )}
        keyExtractor={item => item.id.toString()}
        onContentSizeChange={() => listRef.current?.scrollToEnd()}
      />
      
      {showLoginPrompt && (
        <GoogleSignIn
          onSignIn={handleGoogleSignIn}
          onClose={handleSkipSignIn}
        />
      )}

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Type a message..."
          placeholderTextColor={colors.text.tertiary}
          onSubmitEditing={handleSendMessage}
          editable={!loading}
        />
        {loading && (
          <ActivityIndicator 
            style={styles.loader} 
            color={colors.primary} 
          />
        )}
      </View>

      {referralCode && (user?.uid || showRefModal) && (
        <View style={[styles.modalOverlay, showExitConfirm && { pointerEvents: 'none' }]}>
          <View style={styles.referralContainer}>
            <Text style={styles.referralTitle}>
              Congratulations! 🎉
            </Text>
            <View style={styles.referralCodeBox}>
              <Text style={styles.referralCodeLabel}>
                Your Referral Code:
              </Text>
              <TouchableOpacity 
                style={styles.copyContainer}
                onPress={() => {
                  navigator.clipboard.writeText(referralCode);
                  // Show temporary feedback
                  const element = document.getElementById('copyFeedback');
                  if (element) {
                    element.style.opacity = '1';
                    setTimeout(() => {
                      element.style.opacity = '0';
                    }, 2000);
                  }
                }}
              >
                <Text style={styles.referralCodeText}>
                  {referralCode}
                </Text>
                <View style={styles.copyButton}>
                  <Text style={styles.copyIcon}>📋</Text>
                </View>
              </TouchableOpacity>
              <Text id="copyFeedback" style={styles.copyFeedback}>
                Copied to clipboard!
              </Text>
              <Text style={styles.referralExpiry}>
                Valid for 48 hours
              </Text>
            </View>
            <Text style={styles.referralMessage}>
              Share this code with friends to give them access to our AI assistant!
            </Text>
            <TouchableOpacity
              style={styles.exitButton}
              onPress={handleExitWithReferral}
            >
              <Text style={styles.exitButtonText}>
                Return to Home
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {showExitConfirm && (
        <View style={styles.confirmOverlay}>
          <View style={styles.confirmModal}>
            <Text style={styles.confirmTitle}>
              Are you sure?
            </Text>
            <Text style={styles.confirmText}>
              Make sure you've saved your referral code before leaving.
            </Text>
            <View style={styles.confirmButtons}>
              <TouchableOpacity 
                style={[styles.confirmButton, styles.cancelButton]}
                onPress={handleCancelExit}
              >
                <Text style={[styles.confirmButtonText, { color: colors.text.primary }]}>
                  Back
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.confirmButton, styles.confirmExitButton]}
                onPress={handleConfirmExit}
              >
                <Text style={styles.confirmButtonText}>
                  Yes, Exit
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
    height: '100vh',
    display: 'flex',
    flexDirection: 'column'
  },
  message: {
    margin: 10,
    padding: 10,
    borderRadius: 20,
    maxWidth: '80%'
  },
  userMessage: {
    backgroundColor: colors.chatBubble.user,
    alignSelf: 'flex-end',
    marginLeft: '20%'
  },
  botMessage: {
    backgroundColor: colors.chatBubble.bot,
    alignSelf: 'flex-start',
    marginRight: '20%',
    borderWidth: 1,
    borderColor: colors.background.tertiary
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20
  },
  userMessageText: {
    color: colors.text.inverse
  },
  botMessageText: {
    color: colors.text.secondary
  },
  inputContainer: {
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: colors.background.tertiary,
    flexDirection: 'row',
    alignItems: 'center'
  },
  input: {
    flex: 1,
    backgroundColor: colors.background.secondary,
    padding: 12,
    borderRadius: 20,
    fontSize: 16,
    color: colors.text.primary
  },
  loader: {
    marginLeft: 10
  },
  devBanner: {
    backgroundColor: colors.background.tertiary,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  devBannerText: {
    color: colors.text.secondary,
    fontWeight: 'bold'
  },
  questionMessage: {
    backgroundColor: colors.chatBubble.system,
    borderWidth: 1,
    borderColor: colors.info
  },
  questionText: {
    fontWeight: '500',
    color: colors.text.secondary
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    marginTop: 10,
    gap: 8
  },
  optionButton: {
    backgroundColor: colors.background.secondary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.primary
  },
  optionText: {
    color: colors.text.primary,
    fontSize: 14
  },
  loginPrompt: {
    backgroundColor: colors.background.secondary,
    padding: 16,
    margin: 16,
    borderRadius: 8,
    alignItems: 'center'
  },
  loginText: {
    color: colors.text.primary,
    marginBottom: 12,
    textAlign: 'center'
  },
  googleButton: {
    backgroundColor: '#4285F4',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4
  },
  googleButtonText: {
    color: colors.text.inverse,
    fontWeight: 'bold'
  },
  messageList: {
    flex: 1,
    width: '100%',
    overflow: 'auto'
  },
  referralMessage: {
    backgroundColor: colors.success,
    borderWidth: 0,
    padding: 20
  },
  referralText: {
    color: colors.text.inverse,
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center'
  },
  referralContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: colors.background.primary,
    zIndex: 1001
  },
  referralTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 32,
    textAlign: 'center',
    textShadow: `0 0 10px ${colors.primary}40`
  },
  referralCodeBox: {
    backgroundColor: colors.background.tertiary,
    padding: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.info,
    marginBottom: 24,
    width: '100%',
    maxWidth: 400,
    boxShadow: `0 0 20px ${colors.primary}40`
  },
  referralCodeLabel: {
    fontSize: 16,
    color: colors.text.secondary,
    marginBottom: 12
  },
  referralCodeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text.primary,
    letterSpacing: 2,
    marginRight: 12
  },
  copyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background.secondary,
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    ':hover': {
      backgroundColor: colors.background.primary
    }
  },
  copyButton: {
    padding: 8,
    borderRadius: 4,
    backgroundColor: colors.background.tertiary
  },
  copyIcon: {
    fontSize: 20
  },
  copyFeedback: {
    color: colors.success,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 12,
    opacity: 0,
    transition: 'opacity 0.2s ease'
  },
  referralExpiry: {
    fontSize: 14,
    color: colors.text.tertiary,
    textAlign: 'center'
  },
  referralMessage: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: 32,
    maxWidth: 400,
    lineHeight: 24
  },
  exitButton: {
    backgroundColor: colors.background.secondary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.primary
  },
  exitButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: 'bold'
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
  },
  confirmOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1002
  },
  confirmModal: {
    backgroundColor: colors.background.primary,
    padding: 24,
    borderRadius: 12,
    width: '90%',
    maxWidth: 400,
    zIndex: 1003
  },
  confirmTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 16
  },
  confirmText: {
    fontSize: 16,
    color: colors.text.secondary,
    marginBottom: 24
  },
  confirmButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12
  },
  confirmButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6
  },
  cancelButton: {
    backgroundColor: colors.background.secondary
  },
  confirmExitButton: {
    backgroundColor: colors.primary
  },
  confirmButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text.inverse
  },
  errorBanner: {
    backgroundColor: colors.error,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  errorText: {
    color: colors.text.inverse,
    fontWeight: 'bold'
  }
});
