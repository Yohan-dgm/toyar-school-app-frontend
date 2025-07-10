import React from "react";
import { Stack } from "expo-router";
import DynamicUserLayout from "../../../components/layouts/DynamicUserLayout";
import { USER_CATEGORIES } from "../../../constants/userCategories";

export default function TopManagementLayout() {
  return (
    <DynamicUserLayout userCategory={USER_CATEGORIES.TOP_MANAGEMENT}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="strategy" />
        <Stack.Screen name="governance" />
      </Stack>
    </DynamicUserLayout>
  );
}
