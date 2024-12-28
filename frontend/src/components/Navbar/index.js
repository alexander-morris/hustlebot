import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { colors } from '../../utils/colors';

// Add Space Grotesk font
const spaceGrotesk = {
  fontFamily: "'Space Grotesk', sans-serif",
  fontDisplay: 'swap'
};

export default function Navbar({ onGetStarted }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const windowWidth = Dimensions.get('window').width;
  const isMobile = windowWidth < 768;

  const handleGetStarted = () => {
    if (onGetStarted) {
      onGetStarted();
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
        <TouchableOpacity 
          style={[styles.navLink, styles.primaryButton]}
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
    zIndex: 999,
    '@media (max-width: 768px)': {
      padding: 12
    }
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
    letterSpacing: '-0.5px',
    '@media (max-width: 768px)': {
      fontSize: 20
    }
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
    '@media (max-width: 768px)': {
      gap: 16
    }
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
    borderBottomColor: colors.background.tertiary,
    gap: 16
  },
  hiddenMobile: {
    display: 'none'
  },
  navLink: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    '@media (max-width: 768px)': {
      width: '100%',
      textAlign: 'center'
    }
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
    letterSpacing: '-0.2px',
    '@media (max-width: 768px)': {
      fontSize: 14
    }
  },
  menuButton: {
    padding: 8
  },
  menuIcon: {
    ...spaceGrotesk,
    color: colors.text.primary,
    fontSize: 24
  }
}); 