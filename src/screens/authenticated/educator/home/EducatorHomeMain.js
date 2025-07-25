import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { MaterialIcons } from "@expo/vector-icons";
import { theme } from "../../../../styles/theme";
import { USER_CATEGORIES } from "../../../../constants/userCategories";
import ActivityFeed from "../../../../components/activity-feed/ActivityFeed";

const EducatorHomeMain = () => {
  const dispatch = useDispatch();

  // Get global state
  const { sessionData } = useSelector((state) => state.app);

  // Get user category from session data
  const userCategory =
    sessionData?.user_category || sessionData?.data?.user_category;
  const isEducator = userCategory === USER_CATEGORIES.EDUCATOR;

  // Debug logging
  console.log(
    "🏫 EducatorHomeMain - User category:",
    userCategory,
    "Is Educator:",
    isEducator
  );
  console.log("🏫 EducatorHomeMain - Component loaded successfully!");
  console.log(
    "🏫 EducatorHomeMain - Current route should be /authenticated/educator"
  );

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.headerSection}>
        <View style={styles.headerContent}>
          <MaterialIcons name="school" size={24} color={theme.colors.primary} />
          <Text style={styles.headerTitle}>Educator Dashboard</Text>
        </View>
        <Text style={styles.headerSubtitle}>
          Manage your classroom activities and student interactions
        </Text>
      </View>

      {/* Activity Feed with Educator Context */}
      <View style={styles.activityFeedContainer}>
        <ActivityFeed userCategory={USER_CATEGORIES.EDUCATOR} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  headerSection: {
    backgroundColor: theme.colors.card,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.xs,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
  },
  headerSubtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  activityFeedContainer: {
    flex: 1,
  },
});

export default EducatorHomeMain;
