import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { colors } from '../../utils/colors';
import { auth, signInWithGoogle, signOut } from '../../services/auth';

// Add Space Grotesk font
const spaceGrotesk = {
  fontFamily: "'Space Grotesk', sans-serif",
  fontDisplay: 'swap'
};

export default function Navbar({ onGetStarted, onLogin }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const windowWidth = Dimensions.get('window').width;
  const isMobile = windowWidth < 768;

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsAuthenticated(!!user);
    });
    return () => unsubscribe();
  }, []);

  const handleGetStarted = () => {
    if (onGetStarted) {
      onGetStarted();
    }
    setIsMenuOpen(false);
  };

  const handleLogin = async () => {
    try {
      await signInWithGoogle();
      if (onLogin) {
        onLogin();
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
    setIsMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Logout failed:', error);
    }
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <View style={styles.navbar}>
      <View style={styles.leftSection}>
        <TouchableOpacity style={styles.logoContainer}>
          <Text style={styles.logo}>HustleBot</Text>
        </TouchableOpacity>
      </View>

      {isMobile && (
        <TouchableOpacity 
          style={styles.menuButton} 
          onPress={toggleMenu}
        >
          <Text style={styles.menuIcon}>
            {isMenuOpen ? '✕' : '☰'}
          </Text>
        </TouchableOpacity>
      )}

      <View style={[
        styles.rightSection,
        isMobile && styles.mobileRightSection,
        isMobile && !isMenuOpen && styles.hiddenMobile
      ]}>
        {isAuthenticated ? (
          <TouchableOpacity 
            style={[styles.navLink, styles.authButton]}
            onPress={handleLogout}
          >
            <Text style={styles.authButtonText}>Logout</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            style={[styles.navLink, styles.authButton]}
            onPress={handleLogin}
          >
            <Text style={styles.authButtonText}>Login</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity 
          style={[styles.navLink, styles.primaryButton, styles.getStartedButton]}
          onPress={handleGetStarted}
        >
          <Text style={styles.primaryButtonText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: colors.background.tertiary,
    height: 64,
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 999
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  logoContainer: {
    marginRight: 24
  },
  logo: {
    ...spaceGrotesk,
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
    letterSpacing: '-0.5px'
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  mobileRightSection: {
    position: 'absolute',
    top: 64,
    left: 0,
    right: 0,
    backgroundColor: colors.background.primary,
    flexDirection: 'column',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.background.tertiary
  },
  hiddenMobile: {
    display: 'none'
  },
  navLink: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginRight: 16
  },
  getStartedButton: {
    marginRight: 0
  },
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16
  },
  primaryButtonText: {
    ...spaceGrotesk,
    color: colors.text.inverse,
    fontWeight: '600',
    fontSize: 16,
    letterSpacing: '-0.2px'
  },
  menuButton: {
    padding: 8
  },
  menuIcon: {
    ...spaceGrotesk,
    color: colors.text.primary,
    fontSize: 24
  },
  authButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16
  },
  authButtonText: {
    ...spaceGrotesk,
    color: colors.primary,
    fontWeight: '600',
    fontSize: 16,
    letterSpacing: '-0.2px'
  }
}); 