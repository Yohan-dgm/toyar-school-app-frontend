import React, { useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import StatCard from "./StatCard";
import { useGetAllTeachersWithPaginationQuery } from "../../../../../api/teacher-api";
import { useGetStudentListDataQuery } from "../../../../../api/educator-feedback-api";

interface StatisticsBarProps {
  onRefresh?: () => void;
  refreshing?: boolean;
}

const StatisticsBar: React.FC<StatisticsBarProps> = ({
  onRefresh,
  refreshing = false,
}) => {
  // Fetch teachers data
  const {
    data: teachersResponse,
    isLoading: teachersLoading,
    error: teachersError,
  } = useGetAllTeachersWithPaginationQuery({
    page: 1,
    page_size: 10000, // Get all teachers to count them
    search_phrase: "",
    search_filter_list: [],
  });

  // Fetch students data
  const {
    data: studentsResponse,
    isLoading: studentsLoading,
    error: studentsError,
  } = useGetStudentListDataQuery({});

  // Calculate statistics from API responses
  const statistics = useMemo(() => {
    // Teachers count
    const teachersData = teachersResponse?.data || teachersResponse;
    const allTeachers = teachersData?.teachers || teachersData?.data || [];
    const totalTeachers = allTeachers.length;

    // Students count
    const studentsData = studentsResponse?.data;
    const grades = studentsData?.grades || [];
    const totalStudents = grades.reduce(
      (sum: number, grade: any) => sum + (grade.student_list_count || 0),
      0,
    );

    // Active grades count
    const activeGrades = grades.filter((grade: any) => grade.active).length;

    // Feedback count (placeholder - can be extended with actual feedback API)
    const totalFeedback = 0; // TODO: Implement with feedback API

    return {
      totalStudents,
      totalTeachers,
      activeGrades,
      totalFeedback,
    };
  }, [teachersResponse, studentsResponse]);

  // Loading state
  const isLoading = teachersLoading || studentsLoading;

  // Error state
  const hasError = teachersError || studentsError;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <MaterialIcons name="dashboard" size={20} color="#920734" />
          <Text style={styles.headerTitle}>School Overview</Text>
        </View>
        {hasError && (
          <Text style={styles.errorText}>Some data may be unavailable</Text>
        )}
      </View>

      {/* Statistics Cards */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollView}
        refreshControl={
          onRefresh ? (
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          ) : undefined
        }
      >
        {/* Total Students */}
        <StatCard
          title="Total Students"
          count={statistics.totalStudents}
          icon="school"
          color="#2196F3"
          gradient={["#ffffff", "#f8faff"]}
          isLoading={isLoading}
          subtitle="Enrolled"
          delay={0}
        />

        {/* Total Teachers */}
        <StatCard
          title="Total Teachers"
          count={statistics.totalTeachers}
          icon="people"
          color="#920734"
          gradient={["#ffffff", "#fdf8f9"]}
          isLoading={isLoading}
          subtitle="Active Staff"
          delay={200}
        />

        {/* Active Grades */}
        <StatCard
          title="Grade Levels"
          count={statistics.activeGrades}
          icon="grade"
          color="#4CAF50"
          gradient={["#ffffff", "#f8fff8"]}
          isLoading={isLoading}
          subtitle="Active"
          delay={400}
        />

        {/* Total Feedback */}
        <StatCard
          title="Feedback"
          count={statistics.totalFeedback}
          icon="rate-review"
          color="#FF9800"
          gradient={["#ffffff", "#fffbf7"]}
          isLoading={isLoading}
          subtitle="This Month"
          delay={600}
        />

        {/* Performance Indicator */}
        <StatCard
          title="Performance"
          count={statistics.totalStudents > 0 ? 87 : 0}
          icon="trending-up"
          color="#9C27B0"
          gradient={["#ffffff", "#fdf8ff"]}
          isLoading={isLoading}
          subtitle="Average %"
          delay={800}
        />

        {/* Attendance Rate */}
        <StatCard
          title="Attendance"
          count={statistics.totalStudents > 0 ? 94 : 0}
          icon="event-available"
          color="#00BCD4"
          gradient={["#ffffff", "#f7feff"]}
          isLoading={isLoading}
          subtitle="Today %"
          delay={1000}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f8f9fa",
    paddingVertical: 16,
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1a1a1a",
    marginLeft: 8,
  },
  errorText: {
    fontSize: 12,
    color: "#F44336",
    fontWeight: "500",
  },
  scrollView: {
    paddingLeft: 20,
  },
  scrollContent: {
    paddingRight: 20,
  },
});

export default StatisticsBar;
