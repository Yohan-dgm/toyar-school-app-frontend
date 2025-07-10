import React from "react";
import { Stack } from "expo-router";
import DynamicUserLayout from "../../../components/layouts/DynamicUserLayout";
import { USER_CATEGORIES } from "../../../constants/userCategories";

export default function ParentLayout() {
  return (
    <DynamicUserLayout userCategory={USER_CATEGORIES.PARENT}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="school-life" />
        <Stack.Screen name="educator-feedback" />
        <Stack.Screen name="calendar" />
        <Stack.Screen name="academic" />
        <Stack.Screen name="performance" />
      </Stack>
    </DynamicUserLayout>
  );
}
