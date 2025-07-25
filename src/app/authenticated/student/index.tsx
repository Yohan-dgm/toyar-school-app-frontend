import React from "react";
import { View, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "@/state-store/store";
import UniversalActivityFeed from "@/components/common/activity-feed/UniversalActivityFeed";
import { USER_CATEGORIES } from "@/constants/userCategories";

export default function StudentHome() {
  // Get user data from Redux store
  const user = useSelector((state: RootState) => state.app.user);
  const userCategory = user?.user_category || USER_CATEGORIES.STUDENT;

  console.log("🎒 Student Home - User category:", userCategory);

  return (
    <View style={styles.container}>
      <UniversalActivityFeed userCategory={userCategory} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
