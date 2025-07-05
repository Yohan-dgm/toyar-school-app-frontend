import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { theme } from "../../../../styles/theme";
// Header and BottomNavigation now handled by parent layout

const { width } = Dimensions.get("window");

const PerformanceMain = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  // Tab press handling now done by layout

  const handleMetricPress = (metric) => {
    console.log("Navigate to metric detail:", metric.title);
  };

  const handleSkillPress = (skill) => {
    console.log("Navigate to skill detail:", skill.name);
  };

  // Sample performance data
  const performanceMetrics = [
    {
      id: 1,
      title: "Academic Excellence",
      value: 92,
      change: +5,
      trend: "up",
      color: "#4CAF50",
      icon: "school",
    },
    {
      id: 2,
      title: "Attendance Rate",
      value: 96,
      change: +2,
      trend: "up",
      color: "#2196F3",
      icon: "event-available",
    },
    {
      id: 3,
      title: "Behavior and Discipline",
      value: 89,
      change: -3,
      trend: "down",
      color: "#FF9800",
      icon: "assignment-turned-in",
    },
    {
      id: 4,
      title: "Attendance and punctuality",
      value: 94,
      change: +7,
      trend: "up",
      color: "#9C27B0",
      icon: "record-voice-over",
    },
  ];

  const skillsAssessment = [
    {
      id: 1,
      name: "Extracurricular Activity",
      level: "Advanced",
      progress: 85,
      color: "#4CAF50",
      description: "Extracurricular Activity",
    },
    {
      id: 2,
      name: "Communication",
      level: "Proficient",
      progress: 78,
      color: "#2196F3",
      description: "Good verbal and written communication skills",
    },
    {
      id: 3,
      name: "Collaboration",
      level: "Advanced",
      progress: 92,
      color: "#FF9800",
      description: "Outstanding teamwork and cooperation",
    },
    {
      id: 4,
      name: "Creativity",
      level: "Developing",
      progress: 65,
      color: "#9C27B0",
      description: "Shows potential for creative thinking",
    },
    {
      id: 5,
      name: "Leadership",
      level: "Proficient",
      progress: 74,
      color: "#FF5722",
      description: "Demonstrates good leadership qualities",
    },
  ];

  const achievements = [
    {
      id: 1,
      title: "Honor Roll Student",
      date: "March 2024",
      type: "academic",
      icon: "emoji-events",
      color: "#FFD700",
    },
    {
      id: 2,
      title: "Perfect Attendance",
      date: "February 2024",
      type: "attendance",
      icon: "star",
      color: "#4CAF50",
    },
    {
      id: 3,
      title: "Science Fair Winner",
      date: "January 2024",
      type: "competition",
      icon: "science",
      color: "#2196F3",
    },
    {
      id: 4,
      title: "Class Representative",
      date: "December 2023",
      type: "leadership",
      icon: "how-to-vote",
      color: "#9C27B0",
    },
  ];

  const getSkillLevelColor = (level) => {
    switch (level) {
      case "Advanced":
        return "#4CAF50";
      case "Proficient":
        return "#2196F3";
      case "Developing":
        return "#FF9800";
      case "Beginner":
        return "#FF5722";
      default:
        return "#9E9E9E";
    }
  };

  const getTrendIcon = (trend) => {
    return trend === "up" ? "trending-up" : "trending-down";
  };

  const getTrendColor = (trend) => {
    return trend === "up" ? "#4CAF50" : "#FF5722";
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={styles.headerSection}>
          <Text style={styles.headerTitle}>📊 Student Performance</Text>
          <Text style={styles.headerSubtitle}>
            Comprehensive performance tracking and skill development analysis
          </Text>
        </View>

        {/* Period Selection */}
        <View style={styles.periodContainer}>
          <Text style={styles.sectionTitle}>Performance Period</Text>
          <View style={styles.periodButtons}>
            {["week", "month", "term", "year"].map((period) => (
              <TouchableOpacity
                key={period}
                style={[
                  styles.periodButton,
                  selectedPeriod === period && styles.activePeriodButton,
                ]}
                onPress={() => setSelectedPeriod(period)}
              >
                <Text
                  style={[
                    styles.periodText,
                    selectedPeriod === period && styles.activePeriodText,
                  ]}
                >
                  {period.charAt(0).toUpperCase() + period.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Performance Metrics */}
        <View style={styles.metricsContainer}>
          <Text style={styles.sectionTitle}>Key Performance Metrics</Text>
          <View style={styles.metricsGrid}>
            {performanceMetrics.map((metric) => (
              <TouchableOpacity
                key={metric.id}
                style={styles.metricCard}
                onPress={() => handleMetricPress(metric)}
              >
                <View style={styles.metricHeader}>
                  <View
                    style={[
                      styles.metricIcon,
                      { backgroundColor: metric.color },
                    ]}
                  >
                    <MaterialIcons
                      name={metric.icon}
                      size={20}
                      color="#FFFFFF"
                    />
                  </View>

                  <View style={styles.metricTrend}>
                    <MaterialIcons
                      name={getTrendIcon(metric.trend)}
                      size={16}
                      color={getTrendColor(metric.trend)}
                    />
                    <Text
                      style={[
                        styles.metricChange,
                        { color: getTrendColor(metric.trend) },
                      ]}
                    >
                      {metric.change > 0 ? "+" : ""}
                      {metric.change}%
                    </Text>
                  </View>
                </View>

                <Text style={styles.metricValue}>{metric.value}%</Text>
                <Text style={styles.metricTitle}>{metric.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Skills Assessment */}
        <View style={styles.skillsContainer}>
          <Text style={styles.sectionTitle}>Skills Assessment</Text>

          {skillsAssessment.map((skill) => (
            <TouchableOpacity
              key={skill.id}
              style={styles.skillCard}
              onPress={() => handleSkillPress(skill)}
            >
              <View style={styles.skillHeader}>
                <View style={styles.skillInfo}>
                  <Text style={styles.skillName}>{skill.name}</Text>
                  <Text style={styles.skillDescription}>
                    {skill.description}
                  </Text>
                </View>

                <View style={styles.skillLevel}>
                  <Text
                    style={[
                      styles.skillLevelText,
                      { color: getSkillLevelColor(skill.level) },
                    ]}
                  >
                    {skill.level}
                  </Text>
                  <Text style={styles.skillProgress}>{skill.progress}%</Text>
                </View>
              </View>

              <View style={styles.skillProgressContainer}>
                <View style={styles.skillProgressBar}>
                  <View
                    style={[
                      styles.skillProgressFill,
                      {
                        width: `${skill.progress}%`,
                        backgroundColor: skill.color,
                      },
                    ]}
                  />
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Achievements */}
        <View style={styles.achievementsContainer}>
          <Text style={styles.sectionTitle}>Recent Achievements</Text>

          <View style={styles.achievementsGrid}>
            {achievements.map((achievement) => (
              <View key={achievement.id} style={styles.achievementCard}>
                <View
                  style={[
                    styles.achievementIcon,
                    { backgroundColor: achievement.color },
                  ]}
                >
                  <MaterialIcons
                    name={achievement.icon}
                    size={24}
                    color="#FFFFFF"
                  />
                </View>

                <Text style={styles.achievementTitle}>{achievement.title}</Text>
                <Text style={styles.achievementDate}>{achievement.date}</Text>

                <View style={styles.achievementTypeBadge}>
                  <Text style={styles.achievementTypeText}>
                    {achievement.type.toUpperCase()}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Performance Summary */}
        <View style={styles.summaryContainer}>
          <Text style={styles.sectionTitle}>Performance Summary</Text>

          <View style={styles.summaryCard}>
            <View style={styles.summaryHeader}>
              <Text style={styles.summaryTitle}>
                Overall Performance Rating
              </Text>
              <Text style={styles.summaryRating}>Excellent</Text>
            </View>

            <View style={styles.summaryStats}>
              <View style={styles.summaryStat}>
                <Text style={styles.summaryStatValue}>4.2</Text>
                <Text style={styles.summaryStatLabel}>GPA</Text>
              </View>

              <View style={styles.summaryStat}>
                <Text style={styles.summaryStatValue}>92%</Text>
                <Text style={styles.summaryStatLabel}>Average</Text>
              </View>

              <View style={styles.summaryStat}>
                <Text style={styles.summaryStatValue}>15</Text>
                <Text style={styles.summaryStatLabel}>Rank</Text>
              </View>
            </View>

            <Text style={styles.summaryDescription}>
              Your child is performing exceptionally well across all areas.
              Continue to encourage their efforts and celebrate their
              achievements!
            </Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsContainer}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity
              style={styles.quickActionCard}
              onPress={() => console.log("Detailed Report")}
            >
              <MaterialIcons
                name="assessment"
                size={32}
                color={theme.colors.primary}
              />
              <Text style={styles.quickActionText}>Detailed Report</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickActionCard}
              onPress={() => console.log("Progress Chart")}
            >
              <MaterialIcons
                name="show-chart"
                size={32}
                color={theme.colors.primary}
              />
              <Text style={styles.quickActionText}>Progress Chart</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickActionCard}
              onPress={() => console.log("Goal Setting")}
            >
              <MaterialIcons
                name="flag"
                size={32}
                color={theme.colors.primary}
              />
              <Text style={styles.quickActionText}>Set Goals</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickActionCard}
              onPress={() => console.log("Compare Performance")}
            >
              <MaterialIcons
                name="compare-arrows"
                size={32}
                color={theme.colors.primary}
              />
              <Text style={styles.quickActionText}>Compare</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    paddingBottom: 120,
  },
  headerSection: {
    padding: theme.spacing.lg,
    backgroundColor: "#FFFFFF",
    marginBottom: theme.spacing.md,
  },
  headerTitle: {
    fontFamily: theme.fonts.bold,
    fontSize: 28,
    color: theme.colors.primary,
    marginBottom: theme.spacing.sm,
  },
  headerSubtitle: {
    fontFamily: theme.fonts.regular,
    fontSize: 16,
    color: theme.colors.text,
    lineHeight: 22,
  },
  periodContainer: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontFamily: theme.fonts.bold,
    fontSize: 20,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  periodButtons: {
    flexDirection: "row",
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    padding: 4,
  },
  periodButton: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    alignItems: "center",
    borderRadius: 6,
  },
  activePeriodButton: {
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  periodText: {
    fontFamily: theme.fonts.medium,
    fontSize: 14,
    color: "#666666",
  },
  activePeriodText: {
    color: theme.colors.primary,
  },
  metricsContainer: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  metricsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  metricCard: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  metricHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.sm,
  },
  metricIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  metricTrend: {
    flexDirection: "row",
    alignItems: "center",
  },
  metricChange: {
    fontFamily: theme.fonts.bold,
    fontSize: 12,
    marginLeft: 2,
  },
  metricValue: {
    fontFamily: theme.fonts.bold,
    fontSize: 24,
    color: theme.colors.text,
    marginBottom: 4,
  },
  metricTitle: {
    fontFamily: theme.fonts.medium,
    fontSize: 12,
    color: "#666666",
  },
  skillsContainer: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  skillCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  skillHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: theme.spacing.sm,
  },
  skillInfo: {
    flex: 1,
    marginRight: theme.spacing.md,
  },
  skillName: {
    fontFamily: theme.fonts.bold,
    fontSize: 16,
    color: theme.colors.text,
  },
  skillDescription: {
    fontFamily: theme.fonts.regular,
    fontSize: 12,
    color: "#666666",
    marginTop: 2,
  },
  skillLevel: {
    alignItems: "flex-end",
  },
  skillLevelText: {
    fontFamily: theme.fonts.bold,
    fontSize: 14,
  },
  skillProgress: {
    fontFamily: theme.fonts.regular,
    fontSize: 12,
    color: "#666666",
    marginTop: 2,
  },
  skillProgressContainer: {
    marginTop: theme.spacing.sm,
  },
  skillProgressBar: {
    height: 6,
    backgroundColor: "#F0F0F0",
    borderRadius: 3,
    overflow: "hidden",
  },
  skillProgressFill: {
    height: "100%",
    borderRadius: 3,
  },
  achievementsContainer: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  achievementsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  achievementCard: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: theme.spacing.md,
    alignItems: "center",
    marginBottom: theme.spacing.md,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  achievementIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: theme.spacing.sm,
  },
  achievementTitle: {
    fontFamily: theme.fonts.bold,
    fontSize: 14,
    color: theme.colors.text,
    textAlign: "center",
    marginBottom: 4,
  },
  achievementDate: {
    fontFamily: theme.fonts.regular,
    fontSize: 12,
    color: "#666666",
    marginBottom: theme.spacing.sm,
  },
  achievementTypeBadge: {
    backgroundColor: theme.colors.primary + "20",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  achievementTypeText: {
    fontFamily: theme.fonts.bold,
    fontSize: 8,
    color: theme.colors.primary,
  },
  summaryContainer: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  summaryCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: theme.spacing.lg,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },
  summaryTitle: {
    fontFamily: theme.fonts.bold,
    fontSize: 18,
    color: theme.colors.text,
  },
  summaryRating: {
    fontFamily: theme.fonts.bold,
    fontSize: 18,
    color: "#4CAF50",
  },
  summaryStats: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: theme.spacing.md,
  },
  summaryStat: {
    alignItems: "center",
  },
  summaryStatValue: {
    fontFamily: theme.fonts.bold,
    fontSize: 20,
    color: theme.colors.primary,
  },
  summaryStatLabel: {
    fontFamily: theme.fonts.regular,
    fontSize: 12,
    color: "#666666",
    marginTop: 2,
  },
  summaryDescription: {
    fontFamily: theme.fonts.regular,
    fontSize: 14,
    color: theme.colors.text,
    lineHeight: 20,
    textAlign: "center",
  },
  quickActionsContainer: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  quickActionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  quickActionCard: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: theme.spacing.md,
    alignItems: "center",
    marginBottom: theme.spacing.md,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickActionText: {
    fontFamily: theme.fonts.medium,
    fontSize: 12,
    color: theme.colors.text,
    textAlign: "center",
    marginTop: theme.spacing.xs,
  },
});

export default PerformanceMain;
