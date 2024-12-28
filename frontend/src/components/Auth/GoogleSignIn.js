import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../../utils/colors';
import { signInWithGoogle, handleRedirectResult } from '../../services/auth';

export default function GoogleSignIn({ onSignIn, onClose }) {
  const [error, setError] = useState(null);
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    // Check for redirect result when component mounts
    handleRedirectResult().then(result => {
      if (result) {
        onSignIn(result);
      }
    });
  }, []);

  const handleSignIn = async () => {
    try {
      setError(null);
      setIsRedirecting(false);
      console.log('Initiating Google sign in...');
      const userData = await signInWithGoogle();
      console.log('Google sign-in successful:', userData);
      if (userData) {
        console.log('Calling onSignIn callback with:', userData);
        onSignIn(userData);
      } else {
        setIsRedirecting(true);
      }
    } catch (error) {
      console.error('Sign in error:', error);
      setError(error.message);
      setIsRedirecting(false);
    }
  };

  return (
    <View style={styles.overlay}>
      <View style={styles.modal}>
        <Text style={styles.title}>Save Your Progress</Text>
        <Text style={styles.description}>
          Sign in with Google to save your conversation history and continue your journey.
        </Text>
        
        {error && (
          <Text style={styles.errorText}>{error}</Text>
        )}
        
        {isRedirecting && (
          <Text style={styles.redirectText}>
            Redirecting to Google Sign In...
          </Text>
        )}
        
        <TouchableOpacity 
          style={styles.googleButton}
          onPress={handleSignIn}
          disabled={isRedirecting}
        >
          <Text style={styles.googleButtonText}>Sign in with Google</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.skipButton}
          onPress={onClose}
          disabled={isRedirecting}
        >
          <Text style={styles.skipButtonText}>Continue without signing in</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
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
  modal: {
    backgroundColor: colors.background.secondary,
    padding: 24,
    borderRadius: 12,
    width: '90%',
    maxWidth: 400,
    alignItems: 'center'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 16
  },
  description: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: 24
  },
  googleButton: {
    backgroundColor: '#4285F4',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 6,
    width: '100%',
    alignItems: 'center',
    marginBottom: 16
  },
  googleButtonText: {
    color: colors.text.inverse,
    fontSize: 16,
    fontWeight: 'bold'
  },
  skipButton: {
    paddingVertical: 12
  },
  skipButtonText: {
    color: colors.text.tertiary,
    fontSize: 14
  },
  errorText: {
    color: colors.error,
    marginBottom: 16,
    textAlign: 'center'
  },
  redirectText: {
    color: colors.text.secondary,
    marginBottom: 16,
    textAlign: 'center'
  }
}); 