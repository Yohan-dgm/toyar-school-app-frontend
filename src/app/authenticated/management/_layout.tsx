import React from "react";
import { Stack } from "expo-router";
import DynamicUserLayout from "../../../components/layouts/DynamicUserLayout";
import { USER_CATEGORIES } from "../../../constants/userCategories";

export default function ManagementLayout() {
  return (
    <DynamicUserLayout userCategory={USER_CATEGORIES.MANAGEMENT}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="departments" />
        <Stack.Screen name="staff" />
        <Stack.Screen name="finance" />
      </Stack>
    </DynamicUserLayout>
  );
}
