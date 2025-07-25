import React from "react";
import { Stack } from "expo-router";
import DynamicUserLayout from "../../../components/layouts/DynamicUserLayout";
import { USER_CATEGORIES } from "../../../constants/userCategories";

export default function EducatorLayout() {
  return (
    <DynamicUserLayout userCategory={USER_CATEGORIES.EDUCATOR}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="school-calendar" />
        <Stack.Screen name="user-actions" />
        <Stack.Screen name="notifications" />

        {/* Legacy routes for backward compatibility */}
        <Stack.Screen name="students" />
        <Stack.Screen name="classes" />
        <Stack.Screen name="assignments" />
        <Stack.Screen name="reports" />
        <Stack.Screen name="user-management" />
      </Stack>
    </DynamicUserLayout>
  );
}
