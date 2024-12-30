import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { colors } from '../../utils/colors';

// Add Space Grotesk font
const spaceGrotesk = {
  fontFamily: "'Space Grotesk', sans-serif",
  fontDisplay: 'swap'
};

export default function About({ onGetStarted }) {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.mainTitle}>About HustleBot</Text>
          <Text style={styles.mainText}>
            Welcome to the place where big visions become bigger realities—where everyday hustlers transform into tomorrow's success stories by harnessing the power of AI. Think of HustleBot as a community-driven launchpad for people who refuse to sit on the sidelines while everyone else defines the future.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.title}>We Believe AI Should Work for You</Text>
          <Text style={styles.text}>
            We're here because we see AI as more than another buzzword; it's a tool to amplify your creativity, multiply your results, and accelerate your path to success. HustleBot helps you channel next-gen technology into practical workflows, personal growth, and game-changing collaborations.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.title}>A Club for the Driven</Text>
          <Text style={styles.text}>
            Call it an exclusive community—because it is. We welcome anyone hungry enough to step up, bring ideas to life, and support others doing the same. The only membership requirement? Curiosity, grit, and an unwavering belief in your power to shape what's next.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.title}>How It Works</Text>
          <View style={styles.stepContainer}>
            <View style={styles.step}>
              <Text style={styles.stepNumber}>1</Text>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Join the Conversation</Text>
                <Text style={styles.stepText}>
                  Engage with fellow HustleBot members who share their strategies, insights, and breakthroughs.
                </Text>
              </View>
            </View>

            <View style={styles.step}>
              <Text style={styles.stepNumber}>2</Text>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Level Up with AI</Text>
                <Text style={styles.stepText}>
                  Learn how to set up your personal AI "hustlers" that automate tasks, mine opportunities, and help you move faster than you thought possible.
                </Text>
              </View>
            </View>

            <View style={styles.step}>
              <Text style={styles.stepNumber}>3</Text>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Earn Your Reputation</Text>
                <Text style={styles.stepText}>
                  Bring your unique perspective—technical chops, network connections, or simply unstoppable ambition—and watch your influence in the community grow.
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.title}>The Future Needs You</Text>
          <Text style={styles.text}>
            This isn't about waiting for change. It's about making it. If you've got the hunger to learn, to innovate, and to hustle, we have a spot for you. It doesn't matter what your background is—only that you're ready to dive in, share what you know, and grab hold of tomorrow.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.title}>Ready to Take Your Shot?</Text>
          <Text style={styles.text}>
            The door is open. Step in and see if you've got what it takes to join a community of builders, dreamers, and doers who aren't just talking about the future—they're busy creating it.
          </Text>
          <TouchableOpacity 
            style={styles.ctaButton}
            onPress={onGetStarted}
          >
            <Text style={styles.ctaButtonText}>
              Chat with HustleBot
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary
  },
  content: {
    padding: 24,
    maxWidth: 800,
    width: '100%',
    marginHorizontal: 'auto',
    paddingTop: 80 // Account for navbar
  },
  section: {
    marginBottom: 48,
    '@media (max-width: 768px)': {
      marginBottom: 32
    }
  },
  mainTitle: {
    ...spaceGrotesk,
    fontSize: 48,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 24,
    letterSpacing: '-1px',
    '@media (max-width: 768px)': {
      fontSize: 36,
      marginBottom: 16
    }
  },
  mainText: {
    ...spaceGrotesk,
    fontSize: 20,
    lineHeight: 32,
    color: colors.text.secondary,
    '@media (max-width: 768px)': {
      fontSize: 18,
      lineHeight: 28
    }
  },
  title: {
    ...spaceGrotesk,
    fontSize: 32,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 16,
    letterSpacing: '-0.5px',
    '@media (max-width: 768px)': {
      fontSize: 24,
      marginBottom: 12
    }
  },
  text: {
    ...spaceGrotesk,
    fontSize: 18,
    lineHeight: 28,
    color: colors.text.secondary,
    '@media (max-width: 768px)': {
      fontSize: 16,
      lineHeight: 24
    }
  },
  stepContainer: {
    marginTop: 32,
    gap: 32,
    '@media (max-width: 768px)': {
      marginTop: 24,
      gap: 24
    }
  },
  step: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'flex-start'
  },
  stepNumber: {
    ...spaceGrotesk,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    color: colors.text.inverse,
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 40,
    '@media (max-width: 768px)': {
      width: 32,
      height: 32,
      fontSize: 16,
      lineHeight: 32
    }
  },
  stepContent: {
    flex: 1
  },
  stepTitle: {
    ...spaceGrotesk,
    fontSize: 20,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 8,
    '@media (max-width: 768px)': {
      fontSize: 18,
      marginBottom: 6
    }
  },
  stepText: {
    ...spaceGrotesk,
    fontSize: 16,
    lineHeight: 24,
    color: colors.text.secondary,
    '@media (max-width: 768px)': {
      fontSize: 15,
      lineHeight: 22
    }
  },
  ctaButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: 24,
    '@media (max-width: 768px)': {
      paddingVertical: 12,
      paddingHorizontal: 24,
      marginTop: 16
    }
  },
  ctaButtonText: {
    ...spaceGrotesk,
    color: colors.text.inverse,
    fontSize: 18,
    fontWeight: '600',
    '@media (max-width: 768px)': {
      fontSize: 16
    }
  }
}); 