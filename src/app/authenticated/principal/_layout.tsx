import React from "react";
import { Stack } from "expo-router";
import { useSelector } from "react-redux";
import { RootState } from "@/state-store/store";
import DynamicUserLayout from "@/components/layouts/DynamicUserLayout";
import { USER_CATEGORIES } from "@/constants/userCategories";

export default function PrincipalLayout() {
  const user = useSelector((state: RootState) => state.app.user);
  const userCategory = user?.user_category || USER_CATEGORIES.PRINCIPAL;

  return (
    <DynamicUserLayout userCategory={userCategory}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="school-calendar" />
        <Stack.Screen name="dashboard" />
        <Stack.Screen name="school-analysis" />
        <Stack.Screen name="notifications" />
        <Stack.Screen name="academic-oversight" />
        <Stack.Screen name="student-affairs" />
        <Stack.Screen name="staff-management" />
        <Stack.Screen name="school-operations" />
        <Stack.Screen name="user-actions" />
      </Stack>
    </DynamicUserLayout>
  );
}