import React from "react";
import { Stack } from "expo-router";
import { useSelector } from "react-redux";
import { RootState } from "@/state-store/store";
import DynamicUserLayout from "@/components/layouts/DynamicUserLayout";
import { USER_CATEGORIES } from "@/constants/userCategories";

export default function SeniorManagementLayout() {
  const user = useSelector((state: RootState) => state.app.user);
  const userCategory = user?.user_category || USER_CATEGORIES.SENIOR_MANAGEMENT;

  return (
    <DynamicUserLayout userCategory={userCategory}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="strategic-planning" />
        <Stack.Screen name="financial-overview" />
        <Stack.Screen name="performance-metrics" />
        <Stack.Screen name="board-meetings" />
        <Stack.Screen name="user-actions" />
      </Stack>
    </DynamicUserLayout>
  );
}