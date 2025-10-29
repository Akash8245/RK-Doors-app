import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import LoginScreen from '../components/auth/LoginScreen';
import SignUpScreen from '../components/auth/SignUpScreen';

export default function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <View style={styles.container}>
      {isLogin ? (
        <LoginScreen onSwitchToSignUp={() => setIsLogin(false)} />
      ) : (
        <SignUpScreen onSwitchToLogin={() => setIsLogin(true)} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
}); 