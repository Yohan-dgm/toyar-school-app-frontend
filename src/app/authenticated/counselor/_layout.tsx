import React from "react";
import { Stack } from "expo-router";
import DynamicUserLayout from "../../../components/layouts/DynamicUserLayout";
import { USER_CATEGORIES } from "../../../constants/userCategories";

export default function CounselorLayout() {
  return (
    <DynamicUserLayout userCategory={USER_CATEGORIES.COUNSELOR}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="students" />
        <Stack.Screen name="appointments" />
        <Stack.Screen name="resources" />
      </Stack>
    </DynamicUserLayout>
  );
}
