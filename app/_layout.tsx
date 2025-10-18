import { Stack } from 'expo-router';
import { Provider } from 'react-redux';
import { store } from '../src/store';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { ThemeProvider, DefaultTheme } from '@react-navigation/native';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#2563EB',
    background: '#F9FAFB',
    card: '#FFFFFF',
    text: '#1F2937',
    border: '#E5E7EB',
  },
};

export default function RootLayout() {
  return (
    <Provider store={store}>
      <ThemeProvider value={theme}>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="quiz/[category]" options={{ presentation: 'card' }} />
          <Stack.Screen name="quiz/test" options={{ presentation: 'card' }} />
          <Stack.Screen name="courses/[id]" options={{ presentation: 'card' }} />
        </Stack>
      </ThemeProvider>
    </Provider>
  );
}