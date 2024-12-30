import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Navbar from '../../components/Navbar';
import ChatUI from '../../components/Chat/ChatUI';
import { colors } from '../../utils/colors';

const Landing = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Navbar />
      <View style={styles.content}>
        <ChatUI />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: 20,
  },
});

export default Landing;
