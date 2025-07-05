import { Stack } from "expo-router";
import React from "react";

export default function AuthenticatedLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="parent" />
      <Stack.Screen name="educator" />
      <Stack.Screen name="student" />
    </Stack>
  );
}
