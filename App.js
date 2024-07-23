import React from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import Navigation from './src/screens/navigation/navigation';
export default function App() {
  return (
    <SafeAreaView style={styles.root}>
      <Navigation />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F9FBFC',
  }
});