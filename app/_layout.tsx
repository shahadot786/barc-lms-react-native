import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { Provider } from "react-redux";
import { store } from "../src/store";

export default function RootLayout() {
  return (
    <Provider store={store}>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="quiz/[category]"
          options={{ presentation: "card" }}
        />
        <Stack.Screen name="quiz/test" options={{ presentation: "card" }} />
        <Stack.Screen name="courses/[id]" options={{ presentation: "card" }} />
      </Stack>
    </Provider>
  );
}
