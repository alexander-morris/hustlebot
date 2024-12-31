import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { colors } from '../../utils/colors';
import ChatUI from '../../components/Chat/ChatUI';
import Navbar from '../../components/Navbar';
import { getUrlParams } from '../../utils/urlUtils';
import { logUserResponse } from '../../services/analytics';
import { isValidReferralCode } from '../../utils/referralUtils';

const WELCOME_MESSAGE = {
  type: 'bot',
  content: "Hi! I'm HustleBot, your AI companion for turning dreams into reality. I'm here to help you discover your passions, set meaningful goals, and take action towards achieving them. Let's start with a question to get to know you better."
};

// Daily questions and updates pool with specific responses
const DAILY_QUESTIONS_WITH_RESPONSES = [
  {
    question: "What's your biggest dream for your future career?",
    response: "That's an inspiring career goal! Let's break it down into actionable steps. First, let's identify the key skills and experiences you'll need. Would you like to explore specific opportunities in this field?"
  },
  {
    question: "What skills would you like to develop this month?",
    response: "Learning new skills is a great way to grow! I can help you create a learning plan and find resources to master these skills. What's your preferred learning style - hands-on projects, courses, or mentorship?"
  },
  {
    question: "What's one small step you could take today towards your goals?",
    response: "Taking action is powerful, no matter how small! This step could create momentum for bigger changes. Would you like to explore more ways to build on this progress?"
  },
  {
    question: "What's the biggest challenge you're facing right now?",
    response: "Challenges often lead to our greatest growth. Let's break this down into smaller, manageable parts. Which aspect feels most urgent to address first?"
  },
  {
    question: "If you could start any business today, what would it be?",
    response: "That's an interesting business idea! Let's explore its potential. Have you thought about the target market and what unique value you could offer them?"
  },
  {
    question: "What motivates you to keep pushing forward?",
    response: "Understanding our motivations is key to staying focused. Let's explore how we can use this motivation to create sustainable progress. What specific aspects of this motivation drive you the most?"
  },
  {
    question: "Where do you see yourself in 3 years?",
    response: "Having a clear vision helps guide our actions today. Let's work backwards from this goal - what milestones would you need to hit along the way?"
  },
  {
    question: "What's a skill you've always wanted to master?",
    response: "That's a fascinating area to explore! Breaking down complex skills into manageable chunks makes learning more effective. What's the first aspect of this skill you'd like to tackle?"
  }
];

const UPDATES = [
  {
    title: "New Feature",
    message: "You can now share your progress with friends!"
  },
  {
    title: "Weekly Tip",
    message: "Try breaking down your big goals into smaller, manageable tasks."
  },
  {
    title: "Community Update",
    message: "Join our growing community of dreamers and achievers!"
  }
];

// Add Space Grotesk font
const spaceGrotesk = {
  fontFamily: "'Space Grotesk', sans-serif",
  fontDisplay: 'swap'
};

// Add font import to head
if (typeof document !== 'undefined') {
  const link = document.createElement('link');
  link.href = 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap';
  link.rel = 'stylesheet';
  document.head.appendChild(link);
}

export default function LandingPage() {
  const { ref, questions, refOffer, pwa, showChat: showChatParam } = getUrlParams();
  const [showChat, setShowChat] = useState(false);
  const [referralCode, setReferralCode] = useState('');
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [dailyQuestionData, setDailyQuestionData] = useState(null);
  const [update, setUpdate] = useState(null);
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    // Register service worker
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
          .then(registration => {
            console.log('ServiceWorker registration successful');
          })
          .catch(err => {
            console.log('ServiceWorker registration failed: ', err);
          });
      });
    }

    // Handle PWA install prompt
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallPrompt(true);
    });

    // Set random question and update for PWA mode
    if (pwa === 'true') {
      const randomQuestionData = DAILY_QUESTIONS_WITH_RESPONSES[
        Math.floor(Math.random() * DAILY_QUESTIONS_WITH_RESPONSES.length)
      ];
      setDailyQuestionData(randomQuestionData);

      // 30% chance to show an update
      if (Math.random() < 0.3) {
        const randomUpdate = UPDATES[Math.floor(Math.random() * UPDATES.length)];
        setUpdate(randomUpdate);
      }
    }
  }, [pwa]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    
    setShowInstallPrompt(false);
    deferredPrompt.prompt();
    
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User ${outcome} the PWA installation`);
    setDeferredPrompt(null);
  };

  const handleUserResponse = async (question, response, questionIndex, isLoggedIn = false, userId = null) => {
    await logUserResponse({
      question,
      response,
      questionIndex,
      isLoggedIn,
      userId
    });
  };

  const handleStartChat = async () => {
    if (!referralCode) {
      setValidationError('Please enter a referral code');
      return;
    }

    setIsValidating(true);
    setValidationError('');
    
    try {
      const isValid = await isValidReferralCode(referralCode);
      if (isValid) {
        // Log successful validation
        console.log('Valid referral code:', referralCode);
        
        // Store the referral code in session storage for persistence
        sessionStorage.setItem('referralCode', referralCode);
        
        // Update URL with referral code
        const newUrl = new URL(window.location);
        newUrl.searchParams.set('ref', referralCode);
        window.history.pushState({}, '', newUrl);
        
        // Show chat interface
        setShowChat(true);
      } else {
        setValidationError('Invalid referral code. Please check and try again.');
      }
    } catch (error) {
      console.error('Error validating referral code:', error);
      setValidationError(
        process.env.NODE_ENV === 'development' 
          ? `Error: ${error.message}`
          : 'Error validating code. Please try again.'
      );
    } finally {
      setIsValidating(false);
    }
  };

  // If in PWA mode or already showing chat, render chat UI
  if (pwa === 'true' || showChat) {
    return (
      <View style={styles.container}>
        <Navbar onGetStarted={() => {}} />
        <View style={styles.content}>
          {update && (
            <View style={styles.updateBanner}>
              <Text style={styles.updateTitle}>{update.title}</Text>
              <Text style={styles.updateMessage}>{update.message}</Text>
            </View>
          )}
          <ChatUI 
            questionsBeforeLogin={5}
            showRefOffer={refOffer}
            waitForAnswer={true}
            onUserResponse={handleUserResponse}
            welcomeMessage={WELCOME_MESSAGE}
          />
        </View>
      </View>
    );
  }

  // Remove captcha verification UI for now
  return (
    <View style={styles.container}>
      <Navbar onGetStarted={handleStartChat} />
      <View style={styles.content}>
        {showChat ? (
          <ChatUI 
            questionsBeforeLogin={5}
            showRefOffer={refOffer}
            waitForAnswer={true}
            onUserResponse={handleUserResponse}
            welcomeMessage={WELCOME_MESSAGE}
          />
        ) : (
          <>
            {/* Banner Section */}
            <View style={styles.banner}>
              <View style={styles.bannerContent}>
                <Text style={styles.bannerTitle}>
                  Turn Your Dreams into Reality with AI
                </Text>
                <Text style={styles.bannerSubtitle}>
                  Join thousands of dreamers and doers who are using AI to discover their path
                </Text>
                <View style={styles.referralInput}>
                  <View style={styles.inputContainer}>
                    <TextInput
                      style={[styles.input, validationError && styles.inputError]}
                      placeholder="Enter referral code"
                      placeholderTextColor={colors.text.tertiary}
                      value={referralCode}
                      onChangeText={(text) => {
                        setReferralCode(text);
                        setValidationError('');
                      }}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleStartChat();
                        }
                      }}
                      editable={!isValidating}
                    />
                    {isValidating && (
                      <View style={styles.loadingOverlay}>
                        <ActivityIndicator size="small" color={colors.primary} />
                      </View>
                    )}
                  </View>
                  {validationError && (
                    <Text style={styles.errorText}>{validationError}</Text>
                  )}
                  <TouchableOpacity 
                    style={[
                      styles.tryNowButton,
                      isValidating && styles.tryNowButtonDisabled,
                      !referralCode && styles.tryNowButtonDisabled
                    ]}
                    onPress={handleStartChat}
                    disabled={isValidating || !referralCode}
                  >
                    <Text style={styles.tryNowButtonText}>
                      {isValidating ? 'Validating...' : 'Try Now'}
                    </Text>
                  </TouchableOpacity>
                </View>
                {showInstallPrompt && (
                  <TouchableOpacity 
                    style={styles.installButton}
                    onPress={handleInstallClick}
                  >
                    <Text style={styles.installButtonText}>📱 Add to Home Screen</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* Info Section */}
            <View style={styles.infoSection}>
              <View style={styles.infoContainer}>
                <Text style={styles.sectionTitle}>What are HustleBots?</Text>
                <Text style={styles.infoText}>
                  HustleBots are AI-powered companions designed to help you discover and pursue your passions. 
                  Through meaningful conversations and personalized guidance, they help you unlock your potential 
                  and connect with like-minded individuals who share your ambitions.
                </Text>
              </View>
            </View>

            {/* Logos Section */}
            <View style={styles.logosSection}>
              <Text style={styles.logosSectionTitle}>Powered By</Text>
              <View style={styles.logosGrid}>
                <Text style={styles.logo}>OpenAI</Text>
                <Text style={styles.logo}>Google Cloud</Text>
                <Text style={styles.logo}>Firebase</Text>
              </View>
            </View>

            {/* Read More Section */}
            <View style={styles.readMoreSection}>
              <Text style={styles.readMoreTitle}>Want to Learn More?</Text>
              <View style={styles.readMoreLinks}>
                <TouchableOpacity 
                  style={styles.readMoreButton}
                  onPress={() => window.open('https://github.com/yourusername/hustlebot', '_blank')}
                >
                  <Text style={styles.readMoreButtonText}>GitHub</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.readMoreButton}
                  onPress={() => window.open('/whitepaper.pdf', '_blank')}
                >
                  <Text style={styles.readMoreButtonText}>Whitepaper</Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
    minHeight: '100vh',
    width: '100%',
    overflow: 'hidden' // Prevent horizontal scroll
  },
  content: {
    flex: 1,
    marginTop: 64, // Height of navbar
    width: '100%',
    overflow: 'auto'
  },
  banner: {
    padding: 64,
    backgroundColor: colors.background.secondary,
    width: '100%',
    '@media (max-width: 768px)': {
      padding: 32
    },
    '@media (max-width: 480px)': {
      padding: 24
    }
  },
  bannerContent: {
    maxWidth: 1200,
    width: '90%',
    marginHorizontal: 'auto',
    alignItems: 'center',
    '@media (max-width: 480px)': {
      width: '95%'
    }
  },
  bannerTitle: {
    ...spaceGrotesk,
    fontSize: 56,
    fontWeight: '700',
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: 24,
    letterSpacing: '-1px',
    '@media (max-width: 768px)': {
      fontSize: 36
    },
    '@media (max-width: 480px)': {
      fontSize: 28,
      marginBottom: 16
    }
  },
  bannerSubtitle: {
    ...spaceGrotesk,
    fontSize: 24,
    fontWeight: '400',
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: 48,
    maxWidth: 800,
    letterSpacing: '-0.5px',
    '@media (max-width: 768px)': {
      fontSize: 18,
      marginBottom: 32
    },
    '@media (max-width: 480px)': {
      fontSize: 16,
      marginBottom: 24
    }
  },
  referralInput: {
    flexDirection: 'column',
    gap: 16,
    width: '100%',
    maxWidth: 600,
    '@media (max-width: 768px)': {
      gap: 12
    }
  },
  input: {
    ...spaceGrotesk,
    backgroundColor: colors.background.primary,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 8,
    fontSize: 18,
    color: colors.text.primary,
    borderWidth: 1,
    borderColor: colors.background.tertiary,
    width: '100%',
    '@media (max-width: 480px)': {
      fontSize: 16,
      paddingVertical: 12
    }
  },
  tryNowButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    '@media (max-width: 480px)': {
      paddingVertical: 12
    }
  },
  tryNowButtonText: {
    ...spaceGrotesk,
    color: colors.text.inverse,
    fontSize: 18,
    fontWeight: '600',
    '@media (max-width: 480px)': {
      fontSize: 16
    }
  },
  infoSection: {
    paddingVertical: 64,
    backgroundColor: colors.background.primary,
    width: '100%',
    alignItems: 'center',
    '@media (max-width: 768px)': {
      paddingVertical: 48
    },
    '@media (max-width: 480px)': {
      paddingVertical: 32
    }
  },
  infoContainer: {
    maxWidth: 1200,
    width: '90%',
    alignItems: 'center',
    '@media (max-width: 480px)': {
      width: '95%'
    }
  },
  sectionTitle: {
    ...spaceGrotesk,
    fontSize: 36,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 24,
    textAlign: 'center',
    letterSpacing: '-0.5px',
    '@media (max-width: 768px)': {
      fontSize: 28,
      marginBottom: 20
    },
    '@media (max-width: 480px)': {
      fontSize: 24,
      marginBottom: 16
    }
  },
  infoText: {
    ...spaceGrotesk,
    fontSize: 18,
    fontWeight: '400',
    color: colors.text.secondary,
    textAlign: 'center',
    maxWidth: 800,
    lineHeight: 28,
    letterSpacing: '-0.2px',
    '@media (max-width: 768px)': {
      fontSize: 16,
      lineHeight: 24,
      maxWidth: '100%'
    },
    '@media (max-width: 480px)': {
      fontSize: 15,
      lineHeight: 22
    }
  },
  logosSection: {
    paddingVertical: 64,
    paddingHorizontal: 32,
    backgroundColor: colors.background.secondary,
    width: '100%',
    alignItems: 'center',
    '@media (max-width: 768px)': {
      paddingVertical: 48,
      paddingHorizontal: 24
    },
    '@media (max-width: 480px)': {
      paddingVertical: 32,
      paddingHorizontal: 16
    }
  },
  logosSectionTitle: {
    ...spaceGrotesk,
    fontSize: 24,
    fontWeight: '500',
    color: colors.text.secondary,
    marginBottom: 32,
    textAlign: 'center',
    letterSpacing: '-0.3px',
    '@media (max-width: 480px)': {
      fontSize: 20,
      marginBottom: 24
    }
  },
  logosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 48,
    maxWidth: 1200,
    width: '100%',
    '@media (max-width: 768px)': {
      gap: 32
    },
    '@media (max-width: 480px)': {
      gap: 24,
      flexDirection: 'column'
    }
  },
  logo: {
    ...spaceGrotesk,
    fontSize: 24,
    fontWeight: '500',
    color: colors.text.primary,
    opacity: 0.7,
    letterSpacing: '-0.3px',
    '@media (max-width: 480px)': {
      fontSize: 20
    }
  },
  readMoreSection: {
    paddingVertical: 64,
    paddingHorizontal: 32,
    backgroundColor: colors.background.primary,
    width: '100%',
    alignItems: 'center',
    '@media (max-width: 768px)': {
      paddingVertical: 48,
      paddingHorizontal: 24
    },
    '@media (max-width: 480px)': {
      paddingVertical: 32,
      paddingHorizontal: 16
    }
  },
  readMoreTitle: {
    ...spaceGrotesk,
    fontSize: 24,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 32,
    textAlign: 'center',
    letterSpacing: '-0.3px',
    '@media (max-width: 480px)': {
      fontSize: 20,
      marginBottom: 24
    }
  },
  readMoreLinks: {
    flexDirection: 'row',
    gap: 24,
    '@media (max-width: 768px)': {
      flexDirection: 'column',
      gap: 16,
      width: '100%',
      alignItems: 'stretch'
    }
  },
  readMoreButton: {
    backgroundColor: colors.background.secondary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.primary,
    alignItems: 'center',
    '@media (max-width: 768px)': {
      paddingVertical: 16
    }
  },
  readMoreButtonText: {
    ...spaceGrotesk,
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: '-0.2px',
    '@media (max-width: 480px)': {
      fontSize: 15
    }
  },
  installButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginTop: 24,
    alignItems: 'center',
    width: '100%',
    maxWidth: 600
  },
  installButtonText: {
    ...spaceGrotesk,
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
    '@media (max-width: 480px)': {
      fontSize: 15
    }
  },
  updateBanner: {
    backgroundColor: colors.background.secondary,
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
    width: '100%',
    maxWidth: 800,
    marginHorizontal: 'auto',
    marginTop: 16
  },
  updateTitle: {
    ...spaceGrotesk,
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 8
  },
  updateMessage: {
    ...spaceGrotesk,
    fontSize: 16,
    color: colors.text.secondary
  },
  captchaContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: colors.background.primary
  },
  captchaTitle: {
    ...spaceGrotesk,
    fontSize: 24,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 24,
    textAlign: 'center'
  },
  captchaWrapper: {
    marginBottom: 16
  },
  verifyingText: {
    ...spaceGrotesk,
    fontSize: 16,
    color: colors.text.secondary,
    marginTop: 12
  },
  inputError: {
    borderColor: colors.error,
  },
  errorText: {
    color: colors.error,
    fontSize: 14,
    marginTop: 8,
    textAlign: 'left',
    width: '100%',
  },
  tryNowButtonDisabled: {
    opacity: 0.7,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  inputContainer: {
    position: 'relative',
    width: '100%',
  },
});
