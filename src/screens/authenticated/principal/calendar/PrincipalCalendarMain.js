import React, { useEffect } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { MaterialIcons } from "@expo/vector-icons";
import { theme } from "../../../../styles/theme";
import { USER_CATEGORIES } from "../../../../constants/userCategories";
import CalendarMain from "../../parent/calendar/CalendarMain";

const PrincipalCalendarMain = () => {
  const dispatch = useDispatch();

  // Get global state
  const { sessionData } = useSelector((state) => state.app);

  // Get user category from session data
  const userCategory =
    sessionData?.user_category || sessionData?.data?.user_category;
  const isPrincipal = userCategory === USER_CATEGORIES.PRINCIPAL;

  // Debug logging
  console.log(
    "📅 PrincipalCalendarMain - User category:",
    userCategory,
    "Is principal:",
    isPrincipal
  );

  return (
    <View style={styles.container}>
      {/* Header Section */}
      {/* <View style={styles.headerSection}>
        <View style={styles.headerContent}>
          <MaterialIcons
            name="calendar-today"
            size={24}
            color={theme.colors.primary}
          />
          <Text style={styles.headerTitle}>School Calendar</Text>
        </View>
        <Text style={styles.headerSubtitle}>
          View school events, exam schedules, and important dates
        </Text>
      </View> */}

      {/* Calendar Component */}
      <View style={styles.calendarContainer}>
        <CalendarMain />
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
    borderBottomColor: "#e0e0e0",
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
    color: "#666666",
    marginTop: theme.spacing.xs,
  },
  calendarContainer: {
    flex: 1,
  },
});

export default PrincipalCalendarMain;