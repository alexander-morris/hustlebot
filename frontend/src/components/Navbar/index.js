import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../../utils/colors';
import GoogleSignIn from '../Auth/GoogleSignIn';

const Navbar = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.navigate('Landing')}>
        <Text style={styles.logo}>HustleBot</Text>
      </TouchableOpacity>
      <View style={styles.navLinks}>
        <TouchableOpacity onPress={() => navigation.navigate('About')}>
          <Text style={styles.link}>About</Text>
        </TouchableOpacity>
        <GoogleSignIn />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.primary,
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.white,
  },
  navLinks: {
    flexDirection: 'row',
    gap: 20,
    alignItems: 'center',
  },
  link: {
    color: colors.white,
    fontSize: 16,
  },
});

export default Navbar; 