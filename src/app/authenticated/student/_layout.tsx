import React from "react";
import { Stack } from "expo-router";
import { useSelector } from "react-redux";
import { RootState } from "@/state-store/store";
import DynamicUserLayout from "@/components/layouts/DynamicUserLayout";
import { USER_CATEGORIES } from "@/constants/userCategories";

export default function StudentLayout() {
  const user = useSelector((state: RootState) => state.app.user);
  const userCategory = user?.user_category || USER_CATEGORIES.STUDENT;

  return (
    <DynamicUserLayout userCategory={userCategory}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="school-calendar" />
        <Stack.Screen name="assignments" />
        <Stack.Screen name="user-actions" />
      </Stack>
    </DynamicUserLayout>
  );
}
