import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useSelector } from "react-redux";
import { MaterialIcons } from "@expo/vector-icons";
import { BarChart, PieChart } from "react-native-chart-kit";
import { theme } from "../../../../../styles/theme";
import { USER_CATEGORIES } from "../../../../../constants/userCategories";

const { width } = Dimensions.get("window");
const chartWidth = width - theme.spacing.md * 4;

const StudentAnalysisDrawer = () => {
  const [selectedView, setSelectedView] = useState("overview");
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Get global state
  const { sessionData } = useSelector((state) => state.app);

  // Mock student data for educator's class
  const classStudents = [
    {
      id: 1,
      student_calling_name: "John Doe",
      academic_score: 85,
      behavior_score: 90,
      social_score: 78,
      creative_score: 82,
      sports_score: 88,
    },
    {
      id: 2,
      student_calling_name: "Jane Smith",
      academic_score: 92,
      behavior_score: 85,
      social_score: 90,
      creative_score: 95,
      sports_score: 75,
    },
    {
      id: 3,
      student_calling_name: "Mike Johnson",
      academic_score: 78,
      behavior_score: 82,
      social_score: 85,
      creative_score: 70,
      sports_score: 92,
    },
  ];

  // Analysis categories
  const analysisCategories = [
    { id: "academic", label: "Academic", color: "#4CAF50", icon: "school" },
    { id: "behavior", label: "Behavior", color: "#2196F3", icon: "psychology" },
    { id: "social", label: "Social", color: "#FF9800", icon: "people" },
    { id: "creative", label: "Creative", color: "#9C27B0", icon: "palette" },
    { id: "sports", label: "Sports", color: "#F44336", icon: "sports" },
  ];

  // View options
  const viewOptions = [
    { id: "overview", label: "Class Overview", icon: "dashboard" },
    { id: "individual", label: "Individual Analysis", icon: "person" },
    { id: "comparison", label: "Comparison", icon: "compare" },
  ];

  // Generate class overview data
  const getClassOverviewData = () => {
    const categoryAverages = analysisCategories.map((category) => {
      const scores = classStudents.map(
        (student) => student[`${category.id}_score`],
      );
      const average =
        scores.reduce((sum, score) => sum + score, 0) / scores.length;
      return {
        ...category,
        average: Math.round(average),
      };
    });

    return categoryAverages;
  };

  // Generate individual student data
  const getIndividualData = (student) => {
    return analysisCategories.map((category) => ({
      ...category,
      score: student[`${category.id}_score`],
    }));
  };

  // Chart configuration
  const chartConfig = {
    backgroundColor: theme.colors.card,
    backgroundGradientFrom: theme.colors.card,
    backgroundGradientTo: theme.colors.card,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(146, 7, 52, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: theme.borderRadius.md,
    },
    propsForDots: {
      r: "6",
      strokeWidth: "2",
      stroke: theme.colors.primary,
    },
  };

  const renderViewSelector = () => (
    <View style={styles.viewSelector}>
      {viewOptions.map((option) => (
        <TouchableOpacity
          key={option.id}
          style={[
            styles.viewOption,
            selectedView === option.id && styles.selectedViewOption,
          ]}
          onPress={() => setSelectedView(option.id)}
        >
          <MaterialIcons
            name={option.icon}
            size={20}
            color={
              selectedView === option.id ? "white" : theme.colors.textSecondary
            }
          />
          <Text
            style={[
              styles.viewOptionText,
              selectedView === option.id && styles.selectedViewOptionText,
            ]}
          >
            {option.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderClassOverview = () => {
    const overviewData = getClassOverviewData();

    const barData = {
      labels: overviewData.map((item) => item.label),
      datasets: [
        {
          data: overviewData.map((item) => item.average),
        },
      ],
    };

    const pieData = overviewData.map((item, index) => ({
      name: item.label,
      population: item.average,
      color: item.color,
      legendFontColor: theme.colors.text,
      legendFontSize: 12,
    }));

    return (
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.chartTitle}>Class Performance Overview</Text>

        <View style={styles.chartContainer}>
          <BarChart
            data={barData}
            width={chartWidth}
            height={220}
            chartConfig={chartConfig}
            verticalLabelRotation={30}
            showValuesOnTopOfBars={true}
          />
        </View>

        <Text style={styles.chartTitle}>Performance Distribution</Text>

        <View style={styles.chartContainer}>
          <PieChart
            data={pieData}
            width={chartWidth}
            height={220}
            chartConfig={chartConfig}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
          />
        </View>

        <View style={styles.statsGrid}>
          {overviewData.map((item) => (
            <View key={item.id} style={styles.statCard}>
              <MaterialIcons name={item.icon} size={24} color={item.color} />
              <Text style={styles.statValue}>{item.average}%</Text>
              <Text style={styles.statLabel}>{item.label}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    );
  };

  const renderIndividualAnalysis = () => (
    <ScrollView showsVerticalScrollIndicator={false}>
      <Text style={styles.sectionTitle}>Select Student</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.studentSelector}
      >
        {classStudents.map((student) => (
          <TouchableOpacity
            key={student.id}
            style={[
              styles.studentChip,
              selectedStudent?.id === student.id && styles.selectedStudentChip,
            ]}
            onPress={() => setSelectedStudent(student)}
          >
            <Text
              style={[
                styles.studentChipText,
                selectedStudent?.id === student.id &&
                  styles.selectedStudentChipText,
              ]}
            >
              {student.student_calling_name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {selectedStudent && (
        <>
          <Text style={styles.chartTitle}>
            {selectedStudent.student_calling_name}'s Performance
          </Text>

          <View style={styles.individualStats}>
            {getIndividualData(selectedStudent).map((item) => (
              <View key={item.id} style={styles.individualStatCard}>
                <View style={styles.statHeader}>
                  <MaterialIcons
                    name={item.icon}
                    size={20}
                    color={item.color}
                  />
                  <Text style={styles.statTitle}>{item.label}</Text>
                  <Text style={[styles.statScore, { color: item.color }]}>
                    {item.score}%
                  </Text>
                </View>
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      { width: `${item.score}%`, backgroundColor: item.color },
                    ]}
                  />
                </View>
              </View>
            ))}
          </View>
        </>
      )}
    </ScrollView>
  );

  const renderComparison = () => (
    <ScrollView showsVerticalScrollIndicator={false}>
      <Text style={styles.sectionTitle}>Student Comparison</Text>

      {analysisCategories.map((category) => (
        <View key={category.id} style={styles.comparisonSection}>
          <View style={styles.comparisonHeader}>
            <MaterialIcons
              name={category.icon}
              size={20}
              color={category.color}
            />
            <Text style={styles.comparisonTitle}>{category.label}</Text>
          </View>

          {classStudents.map((student) => (
            <View key={student.id} style={styles.comparisonRow}>
              <Text style={styles.comparisonStudentName}>
                {student.student_calling_name}
              </Text>
              <View style={styles.comparisonBar}>
                <View
                  style={[
                    styles.comparisonFill,
                    {
                      width: `${student[`${category.id}_score`]}%`,
                      backgroundColor: category.color,
                    },
                  ]}
                />
              </View>
              <Text style={styles.comparisonScore}>
                {student[`${category.id}_score`]}%
              </Text>
            </View>
          ))}
        </View>
      ))}
    </ScrollView>
  );

  const renderContent = () => {
    switch (selectedView) {
      case "overview":
        return renderClassOverview();
      case "individual":
        return renderIndividualAnalysis();
      case "comparison":
        return renderComparison();
      default:
        return renderClassOverview();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Student Analysis</Text>
        <Text style={styles.subtitle}>Performance analytics and insights</Text>
      </View>

      {renderViewSelector()}

      <View style={styles.content}>{renderContent()}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    backgroundColor: theme.colors.card,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.colors.text,
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  viewSelector: {
    flexDirection: "row",
    backgroundColor: theme.colors.card,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  viewOption: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: theme.spacing.sm,
    marginHorizontal: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.background,
  },
  selectedViewOption: {
    backgroundColor: theme.colors.primary,
  },
  viewOptionText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginLeft: theme.spacing.xs,
  },
  selectedViewOptionText: {
    color: "white",
    fontWeight: "600",
  },
  content: {
    flex: 1,
    padding: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    textAlign: "center",
  },
  chartContainer: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
    alignItems: "center",
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  statCard: {
    backgroundColor: theme.colors.card,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: "center",
    width: "48%",
    marginBottom: theme.spacing.md,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.colors.text,
    marginTop: theme.spacing.sm,
  },
  statLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  studentSelector: {
    marginBottom: theme.spacing.lg,
  },
  studentChip: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.card,
    marginRight: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  selectedStudentChip: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  studentChipText: {
    fontSize: 14,
    color: theme.colors.text,
  },
  selectedStudentChipText: {
    color: "white",
    fontWeight: "600",
  },
  individualStats: {
    marginTop: theme.spacing.md,
  },
  individualStatCard: {
    backgroundColor: theme.colors.card,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
  },
  statHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.sm,
  },
  statTitle: {
    fontSize: 14,
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
    flex: 1,
  },
  statScore: {
    fontSize: 16,
    fontWeight: "bold",
  },
  progressBar: {
    height: 8,
    backgroundColor: theme.colors.background,
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
  comparisonSection: {
    backgroundColor: theme.colors.card,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
  },
  comparisonHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },
  comparisonTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
  },
  comparisonRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.sm,
  },
  comparisonStudentName: {
    fontSize: 14,
    color: theme.colors.text,
    width: 100,
  },
  comparisonBar: {
    flex: 1,
    height: 20,
    backgroundColor: theme.colors.background,
    borderRadius: 10,
    marginHorizontal: theme.spacing.sm,
    overflow: "hidden",
  },
  comparisonFill: {
    height: "100%",
    borderRadius: 10,
  },
  comparisonScore: {
    fontSize: 12,
    color: theme.colors.text,
    width: 40,
    textAlign: "right",
  },
});

export default StudentAnalysisDrawer;
