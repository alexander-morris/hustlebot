import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { colors } from '../../utils/colors';

export default function AboutScreen() {
  const navigate = useNavigate();

  const handleProveIt = () => {
    navigate('/chat');
  };

  return (
    <View style={styles.container}>
      <Navbar />
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.title}>About HustleBot</Text>
          <Text style={styles.paragraph}>
            Welcome to the place where big visions become bigger realities—where everyday hustlers transform into tomorrow's success stories by harnessing the power of AI. Think of HustleBot as a community-driven launchpad for people who refuse to sit on the sidelines while a few AI monopolies define the future.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.subtitle}>We Believe AI Should Work for You</Text>
          <Text style={styles.paragraph}>
            We're here because we see AI as more than another buzzword; it's a tool to amplify your creativity, multiply your results, and accelerate your path to success. HustleBot helps you channel next-gen technology into practical workflows, personal growth, and game-changing collaborations.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.subtitle}>A Club for the Driven</Text>
          <Text style={styles.paragraph}>
            Call it an exclusive community—because it is. We welcome anyone hungry enough to step up, bring ideas to life, and support others doing the same. The only membership requirement? Curiosity, grit, and an unwavering belief in your power to shape what's next.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.subtitle}>How It Works</Text>
          <View style={styles.steps}>
            <Text style={styles.step}>1. Join the Conversation: Engage with fellow HustleBot members who share their strategies, insights, and breakthroughs.</Text>
            <Text style={styles.step}>2. Level Up with AI: Learn how to set up your personal AI "hustlers" that automate tasks, mine opportunities, and help you move faster than you thought possible.</Text>
            <Text style={styles.step}>3. Earn Your Reputation: Bring your unique perspective—technical chops, network connections, or simply unstoppable ambition—and watch your influence in the community grow.</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.subtitle}>The Future Needs You</Text>
          <Text style={styles.paragraph}>
            This isn't about waiting for change. It's about making it. If you've got the hunger to learn, to innovate, and to hustle, we have a spot for you. It doesn't matter what your background is—only that you're ready to dive in, share what you know, and grab hold of tomorrow.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.subtitle}>Ready to Take Your Shot?</Text>
          <Text style={styles.paragraph}>
            The door is open. Step in and see if you've got what it takes to join a community of builders, dreamers, and doers who aren't just talking about the future—they're busy creating it.
          </Text>
        </View>

        <View style={styles.ctaSection}>
          <Text style={styles.ctaText}>Do you have the hustle?</Text>
          <TouchableOpacity style={styles.ctaButton} onPress={handleProveIt}>
            <Text style={styles.ctaButtonText}>Prove It</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  content: {
    flex: 1,
    padding: 24,
    maxWidth: 800,
    alignSelf: 'center',
    width: '100%',
  },
  section: {
    marginBottom: 32,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 16,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.text.secondary,
    marginBottom: 16,
  },
  steps: {
    marginTop: 16,
  },
  step: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.text.secondary,
    marginBottom: 12,
    paddingLeft: 16,
  },
  ctaSection: {
    alignItems: 'center',
    marginTop: 48,
    marginBottom: 64,
    backgroundColor: colors.background.secondary,
    padding: 32,
    borderRadius: 16,
  },
  ctaText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 24,
    textAlign: 'center',
  },
  ctaButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  ctaButtonText: {
    color: colors.text.inverse,
    fontSize: 20,
    fontWeight: 'bold',
  },
}); 