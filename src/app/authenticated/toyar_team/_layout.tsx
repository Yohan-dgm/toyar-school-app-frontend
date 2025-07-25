import React from "react";
import { Stack } from "expo-router";
import { useSelector } from "react-redux";
import { RootState } from "@/state-store/store";
import DynamicUserLayout from "@/components/layouts/DynamicUserLayout";
import { USER_CATEGORIES } from "@/constants/userCategories";

export default function ToyarTeamLayout() {
  const user = useSelector((state: RootState) => state.app.user);
  const userCategory = user?.user_category || USER_CATEGORIES.TOYAR_TEAM;

  return (
    <DynamicUserLayout userCategory={userCategory}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="project-management" />
        <Stack.Screen name="development-tools" />
        <Stack.Screen name="system-monitoring" />
        <Stack.Screen name="user-actions" />
      </Stack>
    </DynamicUserLayout>
  );
}