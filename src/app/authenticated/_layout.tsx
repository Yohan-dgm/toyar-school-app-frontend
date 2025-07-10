import { Stack } from "expo-router";
import React from "react";

export default function AuthenticatedLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="parent" />
      <Stack.Screen name="educator" />
      <Stack.Screen name="student" />
      <Stack.Screen name="sport_coach" />
      <Stack.Screen name="counselor" />
      <Stack.Screen name="admin" />
      <Stack.Screen name="management" />
      <Stack.Screen name="top_management" />
    </Stack>
  );
}
