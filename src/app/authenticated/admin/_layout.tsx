import React from "react";
import { Stack } from "expo-router";
import DynamicUserLayout from "../../../components/layouts/DynamicUserLayout";
import { USER_CATEGORIES } from "../../../constants/userCategories";

export default function AdminLayout() {
  return (
    <DynamicUserLayout userCategory={USER_CATEGORIES.ADMIN}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="users" />
        <Stack.Screen name="settings" />
        <Stack.Screen name="reports" />
      </Stack>
    </DynamicUserLayout>
  );
}
