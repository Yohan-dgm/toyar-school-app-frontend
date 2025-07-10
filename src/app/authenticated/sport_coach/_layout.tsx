import React from "react";
import { Stack } from "expo-router";
import DynamicUserLayout from "../../../components/layouts/DynamicUserLayout";
import { USER_CATEGORIES } from "../../../constants/userCategories";

export default function SportCoachLayout() {
  return (
    <DynamicUserLayout userCategory={USER_CATEGORIES.SPORT_COACH}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="training" />
        <Stack.Screen name="matches" />
        <Stack.Screen name="players" />
      </Stack>
    </DynamicUserLayout>
  );
}
