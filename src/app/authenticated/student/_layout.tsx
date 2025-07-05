import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function StudentLayout() {
  return (
    <>
      <StatusBar style="dark" translucent={false} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
      </Stack>
    </>
  );
}
