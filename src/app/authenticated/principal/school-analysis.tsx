import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import UnderDevelopmentOverlay from "../../../components/development/UnderDevelopmentOverlay";

interface AnalysisCard {
  id: string;
  title: string;
  subtitle: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  color: string;
  value?: string;
  trend?: "up" | "down" | "stable";
  onPress: () => void;
}

export default function PrincipalSchoolAnalysis() {
  const analysisCards: AnalysisCard[] = [
    {
      id: "academic_performance",
      title: "Academic Performance",
      subtitle: "Student grades and achievement trends",
      icon: "trending-up",
      color: "#4CAF50",
      value: "87%",
      trend: "up",
      onPress: () => console.log("Academic Performance pressed"),
    },
    {
      id: "attendance_rates",
      title: "Attendance Rates",
      subtitle: "Daily attendance tracking and patterns",
      icon: "people",
      color: "#2196F3",
      value: "94%",
      trend: "stable",
      onPress: () => console.log("Attendance Rates pressed"),
    },
    {
      id: "teacher_performance",
      title: "Teacher Performance",
      subtitle: "Staff evaluation and feedback metrics",
      icon: "school",
      color: "#FF9800",
      value: "92%",
      trend: "up",
      onPress: () => console.log("Teacher Performance pressed"),
    },
    {
      id: "financial_analysis",
      title: "Financial Analysis",
      subtitle: "Budget utilization and cost analysis",
      icon: "account-balance",
      color: "#9C27B0",
      value: "78%",
      trend: "down",
      onPress: () => console.log("Financial Analysis pressed"),
    },
    {
      id: "resource_utilization",
      title: "Resource Utilization",
      subtitle: "Facilities and equipment usage",
      icon: "business",
      color: "#795548",
      value: "85%",
      trend: "stable",
      onPress: () => console.log("Resource Utilization pressed"),
    },
    {
      id: "student_wellbeing",
      title: "Student Wellbeing",
      subtitle: "Mental health and counseling metrics",
      icon: "favorite",
      color: "#E91E63",
      value: "91%",
      trend: "up",
      onPress: () => console.log("Student Wellbeing pressed"),
    },
    {
      id: "parent_engagement",
      title: "Parent Engagement",
      subtitle: "Parent participation and communication",
      icon: "family-restroom",
      color: "#607D8B",
      value: "76%",
      trend: "stable",
      onPress: () => console.log("Parent Engagement pressed"),
    },
    {
      id: "disciplinary_trends",
      title: "Disciplinary Trends",
      subtitle: "Behavior incidents and patterns",
      icon: "gavel",
      color: "#FF5722",
      value: "12",
      trend: "down",
      onPress: () => console.log("Disciplinary Trends pressed"),
    },
  ];

  const getTrendIcon = (trend?: string) => {
    switch (trend) {
      case "up":
        return { icon: "trending-up", color: "#4CAF50" };
      case "down":
        return { icon: "trending-down", color: "#F44336" };
      case "stable":
        return { icon: "trending-flat", color: "#FF9800" };
      default:
        return { icon: "trending-flat", color: "#999" };
    }
  };

  const renderAnalysisCard = (card: AnalysisCard) => {
    const trendInfo = getTrendIcon(card.trend);

    return (
      <TouchableOpacity
        key={card.id}
        style={[styles.analysisCard, { borderLeftColor: card.color }]}
        onPress={card.onPress}
        activeOpacity={0.7}
      >
        <View
          style={[styles.iconContainer, { backgroundColor: card.color + "15" }]}
        >
          <MaterialIcons name={card.icon} size={28} color={card.color} />
        </View>

        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>{card.title}</Text>
            {card.value && (
              <View style={styles.valueContainer}>
                <Text style={[styles.cardValue, { color: card.color }]}>
                  {card.value}
                </Text>
                <MaterialIcons
                  name={trendInfo.icon}
                  size={16}
                  color={trendInfo.color}
                  style={styles.trendIcon}
                />
              </View>
            )}
          </View>
          <Text style={styles.cardSubtitle}>{card.subtitle}</Text>
        </View>

        <MaterialIcons name="chevron-right" size={24} color="#ccc" />
      </TouchableOpacity>
    );
  };

  return (
    <UnderDevelopmentOverlay
      featureName="School Analysis"
      comingSoonFeatures={[
        "Academic performance analytics",
        "Attendance tracking & insights",
        "Teacher performance metrics",
        "Budget analysis & forecasting",
        "Resource utilization reports",
        "Student behavior analytics",
      ]}
    >
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>School Analysis</Text>
            <Text style={styles.headerSubtitle}>
              Comprehensive analytics and performance insights
            </Text>
          </View>

          <View style={styles.analysisContainer}>
            {analysisCards.map((card) => renderAnalysisCard(card))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </UnderDevelopmentOverlay>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    paddingVertical: 30,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 8,
    textAlign: "center",
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#666666",
    textAlign: "center",
  },
  analysisContainer: {
    gap: 16,
    paddingBottom: 20,
  },
  analysisCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  cardContent: {
    flex: 1,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a1a",
    flex: 1,
  },
  valueContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardValue: {
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 4,
  },
  trendIcon: {
    marginLeft: 2,
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#666666",
    lineHeight: 18,
  },
});
