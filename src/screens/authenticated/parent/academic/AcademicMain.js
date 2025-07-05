import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { LineChart, BarChart } from "react-native-gifted-charts";
import { theme } from "../../../../styles/theme";
// Header and BottomNavigation now handled by parent layout

const AcademicMain = () => {
  const [selectedChart, setSelectedChart] = useState("marks");
  // Tab press handling now done by layout

  const handleSubjectPress = (subject) => {
    console.log("Navigate to subject detail:", subject.name);
  };

  const handleReportPress = (report) => {
    console.log("Navigate to report detail:", report.title);
  };

  // Term-wise performance data
  const termPerformanceData = {
    marks: [
      {
        value: 450,
        label: "Term 1",
        frontColor: "#4CAF50",
        gradientColor: "#81C784",
      },
      {
        value: 275,
        label: "Term 2",
        frontColor: "#2196F3",
        gradientColor: "#64B5F6",
      },
      {
        value: 185,
        label: "Term 3",
        frontColor: "#FF9800",
        gradientColor: "#FFB74D",
      },
      {
        value: 492,
        label: "Current",
        frontColor: theme.colors.primary,
        gradientColor: "#E91E63",
      },
    ],
    position: [
      {
        value: 10,
        label: "Term 1",
        frontColor: "#FF5722",
        gradientColor: "#FF8A65",
      },
      {
        value: 12,
        label: "Term 2",
        frontColor: "#9C27B0",
        gradientColor: "#BA68C8",
      },
      {
        value: 8,
        label: "Term 3",
        frontColor: "#3F51B5",
        gradientColor: "#7986CB",
      },
      {
        value: 1,
        label: "Current",
        frontColor: "#4CAF50",
        gradientColor: "#81C784",
      },
    ],
  };

  // Line chart data for trend analysis
  const marksLineData = [
    { value: 450, label: "T1" },
    { value: 475, label: "T2" },
    { value: 485, label: "T3" },
    { value: 492, label: "Current" },
  ];

  const positionLineData = [
    { value: 15, label: "T1" },
    { value: 12, label: "T2" },
    { value: 8, label: "T3" },
    { value: 5, label: "Current" },
  ];

  // Sample academic data
  const subjects = [
    {
      id: 1,
      name: "Mathematics",
      teacher: "Mrs. Sarah Perera",
      currentGrade: "A",
      percentage: 92,
      assignments: 8,
      completedAssignments: 7,
      nextTest: "March 25, 2024",
      color: "#4CAF50",
    },
    {
      id: 2,
      name: "Science",
      teacher: "Mr. David Wilson",
      currentGrade: "B+",
      percentage: 87,
      assignments: 6,
      completedAssignments: 6,
      nextTest: "March 28, 2024",
      color: "#2196F3",
    },
    {
      id: 3,
      name: "English Literature",
      teacher: "Ms. Emily Davis",
      currentGrade: "A-",
      percentage: 89,
      assignments: 5,
      completedAssignments: 4,
      nextTest: "April 2, 2024",
      color: "#FF9800",
    },
    {
      id: 4,
      name: "History",
      teacher: "Mr. Robert Smith",
      currentGrade: "B",
      percentage: 84,
      assignments: 4,
      completedAssignments: 4,
      nextTest: "April 5, 2024",
      color: "#9C27B0",
    },
    {
      id: 5,
      name: "Physical Education",
      teacher: "Mr. Michael Brown",
      currentGrade: "A",
      percentage: 95,
      assignments: 3,
      completedAssignments: 3,
      nextTest: "Practical Assessment",
      color: "#FF5722",
    },
  ];

  const academicReports = [
    {
      id: 1,
      title: "Mid-Term Report Card",
      date: "March 15, 2024",
      type: "report_card",
      status: "available",
      overallGrade: "A-",
      gpa: 3.7,
    },
    {
      id: 2,
      title: "Monthly Progress Report",
      date: "March 1, 2024",
      type: "progress",
      status: "available",
      overallGrade: "B+",
      gpa: 3.5,
    },
    {
      id: 3,
      title: "Quarter Assessment",
      date: "February 28, 2024",
      type: "assessment",
      status: "available",
      overallGrade: "A",
      gpa: 3.8,
    },
  ];

  const upcomingAssignments = [
    {
      id: 1,
      title: "Algebra Problem Set",
      subject: "Mathematics",
      dueDate: "March 22, 2024",
      priority: "high",
      status: "pending",
    },
    {
      id: 2,
      title: "Science Project Presentation",
      subject: "Science",
      dueDate: "March 25, 2024",
      priority: "high",
      status: "in_progress",
    },
    {
      id: 3,
      title: "Essay on Shakespeare",
      subject: "English Literature",
      dueDate: "March 30, 2024",
      priority: "medium",
      status: "pending",
    },
  ];

  const getGradeColor = (grade) => {
    if (grade.includes("A")) return "#4CAF50";
    if (grade.includes("B")) return "#FF9800";
    if (grade.includes("C")) return "#FFC107";
    if (grade.includes("D")) return "#FF5722";
    return "#9E9E9E";
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "#FF5722";
      case "medium":
        return "#FF9800";
      case "low":
        return "#4CAF50";
      default:
        return theme.colors.text;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "#4CAF50";
      case "in_progress":
        return "#FF9800";
      case "pending":
        return "#9E9E9E";
      default:
        return theme.colors.text;
    }
  };

  const calculateOverallGPA = () => {
    const totalPercentage = subjects.reduce(
      (sum, subject) => sum + subject.percentage,
      0
    );
    return ((totalPercentage / subjects.length / 100) * 4).toFixed(1);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={styles.headerSection}>
          <Text style={styles.headerTitle}>🎓 Academic Performance</Text>
          <Text style={styles.headerSubtitle}>
            Track academic progress, grades, and assignments
          </Text>
        </View>

        {/* Overall Performance Summary */}
        <View style={styles.summaryContainer}>
          <Text style={styles.sectionTitle}>Overall Performance</Text>
          <View style={styles.summaryCard}>
            <View style={styles.summaryStats}>
              <View style={styles.summaryStat}>
                <Text style={styles.summaryNumber}>
                  {calculateOverallGPA()}
                </Text>
                <Text style={styles.summaryLabel}>GPA</Text>
              </View>

              <View style={styles.summaryStat}>
                <Text style={styles.summaryNumber}>{subjects.length}</Text>
                <Text style={styles.summaryLabel}>Subjects</Text>
              </View>

              <View style={styles.summaryStat}>
                <Text style={styles.summaryNumber}>
                  {subjects.reduce((sum, s) => sum + s.completedAssignments, 0)}
                </Text>
                <Text style={styles.summaryLabel}>Completed</Text>
              </View>

              <View style={styles.summaryStat}>
                <Text style={styles.summaryNumber}>
                  {subjects.reduce((sum, s) => sum + s.assignments, 0)}
                </Text>
                <Text style={styles.summaryLabel}>Total Tasks</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Academic Performance Charts */}
        <View style={styles.chartsContainer}>
          <Text style={styles.sectionTitle}>Academic Performance Trends</Text>

          {/* Chart Toggle Buttons */}
          <View style={styles.chartToggleContainer}>
            <TouchableOpacity
              style={[
                styles.chartToggleButton,
                selectedChart === "marks" && styles.chartToggleButtonActive,
              ]}
              onPress={() => setSelectedChart("marks")}
            >
              <MaterialIcons
                name="trending-up"
                size={20}
                color={
                  selectedChart === "marks" ? "#FFFFFF" : theme.colors.primary
                }
              />
              <Text
                style={[
                  styles.chartToggleText,
                  selectedChart === "marks" && styles.chartToggleTextActive,
                ]}
              >
                Total Marks
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.chartToggleButton,
                selectedChart === "position" && styles.chartToggleButtonActive,
              ]}
              onPress={() => setSelectedChart("position")}
            >
              <MaterialIcons
                name="emoji-events"
                size={20}
                color={
                  selectedChart === "position"
                    ? "#FFFFFF"
                    : theme.colors.primary
                }
              />
              <Text
                style={[
                  styles.chartToggleText,
                  selectedChart === "position" && styles.chartToggleTextActive,
                ]}
              >
                Class Position
              </Text>
            </TouchableOpacity>
          </View>

          {/* Chart Display */}
          <View style={styles.chartCard}>
            <View style={styles.chartHeader}>
              <Text style={styles.chartTitle}>
                {selectedChart === "marks"
                  ? "Term-wise Total Marks"
                  : "Term-wise Class Position"}
              </Text>
              <Text style={styles.chartSubtitle}>
                {selectedChart === "marks"
                  ? "Track your academic progress across terms"
                  : "Monitor your ranking improvement"}
              </Text>
            </View>

            {/* Bar Chart */}
            <View style={styles.chartWrapper}>
              <BarChart
                data={
                  selectedChart === "marks"
                    ? termPerformanceData.marks
                    : termPerformanceData.position
                }
                width={280}
                height={200}
                barWidth={35}
                spacing={25}
                roundedTop
                roundedBottom
                hideRules
                xAxisThickness={0}
                yAxisThickness={0}
                yAxisTextStyle={{ color: "#666666", fontSize: 12 }}
                xAxisLabelTextStyle={{
                  color: "#666666",
                  fontSize: 12,
                  textAlign: "center",
                }}
                noOfSections={4}
                maxValue={selectedChart === "marks" ? 500 : 20}
                isAnimated
                animationDuration={1000}
                showGradient
                gradientColor={theme.colors.primary + "40"}
                frontColor={theme.colors.primary}
              />
            </View>

            {/* Line Chart for Trend */}
            <View style={styles.trendChartWrapper}>
              <Text style={styles.trendTitle}>Trend Analysis</Text>
              <LineChart
                data={
                  selectedChart === "marks" ? marksLineData : positionLineData
                }
                width={280}
                height={120}
                spacing={70}
                color={theme.colors.primary}
                thickness={3}
                dataPointsColor={theme.colors.primary}
                dataPointsRadius={6}
                hideRules
                hideYAxisText
                xAxisThickness={0}
                yAxisThickness={0}
                curved
                isAnimated
                animationDuration={1200}
                areaChart
                startFillColor={theme.colors.primary + "40"}
                endFillColor={theme.colors.primary + "10"}
                startOpacity={0.8}
                endOpacity={0.3}
              />
            </View>

            {/* Performance Insights */}
            <View style={styles.insightsContainer}>
              <View style={styles.insightItem}>
                <MaterialIcons
                  name={
                    selectedChart === "marks" ? "trending-up" : "arrow-upward"
                  }
                  size={16}
                  color="#4CAF50"
                />
                <Text style={styles.insightText}>
                  {selectedChart === "marks"
                    ? `+${termPerformanceData.marks[3].value - termPerformanceData.marks[0].value} marks improvement`
                    : `Improved by ${termPerformanceData.position[0].value - termPerformanceData.position[3].value} positions`}
                </Text>
              </View>

              <View style={styles.insightItem}>
                <MaterialIcons name="star" size={16} color="#FF9800" />
                <Text style={styles.insightText}>
                  {selectedChart === "marks"
                    ? "Consistent upward trend"
                    : "Best position: 5th in class"}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Subjects Performance */}
        <View style={styles.subjectsContainer}>
          <Text style={styles.sectionTitle}>Subject Performance</Text>

          {subjects.map((subject) => (
            <TouchableOpacity
              key={subject.id}
              style={styles.subjectCard}
              onPress={() => handleSubjectPress(subject)}
            >
              <View style={styles.subjectHeader}>
                <View
                  style={[
                    styles.subjectIcon,
                    { backgroundColor: subject.color },
                  ]}
                >
                  <MaterialIcons name="book" size={20} color="#FFFFFF" />
                </View>

                <View style={styles.subjectInfo}>
                  <Text style={styles.subjectName}>{subject.name}</Text>
                  <Text style={styles.subjectTeacher}>{subject.teacher}</Text>
                </View>

                <View style={styles.subjectGrade}>
                  <Text
                    style={[
                      styles.gradeText,
                      { color: getGradeColor(subject.currentGrade) },
                    ]}
                  >
                    {subject.currentGrade}
                  </Text>
                  <Text style={styles.percentageText}>
                    {subject.percentage}%
                  </Text>
                </View>
              </View>

              <View style={styles.subjectProgress}>
                <View style={styles.progressInfo}>
                  <Text style={styles.progressText}>
                    Assignments: {subject.completedAssignments}/
                    {subject.assignments}
                  </Text>
                  <Text style={styles.nextTestText}>
                    Next Test: {subject.nextTest}
                  </Text>
                </View>

                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      {
                        width: `${(subject.completedAssignments / subject.assignments) * 100}%`,
                        backgroundColor: subject.color,
                      },
                    ]}
                  />
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Upcoming Assignments */}
        <View style={styles.assignmentsContainer}>
          <Text style={styles.sectionTitle}>Upcoming Assignments</Text>

          {upcomingAssignments.map((assignment) => (
            <View key={assignment.id} style={styles.assignmentCard}>
              <View style={styles.assignmentHeader}>
                <View style={styles.assignmentInfo}>
                  <Text style={styles.assignmentTitle}>{assignment.title}</Text>
                  <Text style={styles.assignmentSubject}>
                    {assignment.subject}
                  </Text>
                </View>

                <View style={styles.assignmentMeta}>
                  <View
                    style={[
                      styles.priorityBadge,
                      {
                        backgroundColor: getPriorityColor(assignment.priority),
                      },
                    ]}
                  >
                    <Text style={styles.priorityText}>
                      {assignment.priority.toUpperCase()}
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.statusBadge,
                      {
                        backgroundColor:
                          getStatusColor(assignment.status) + "20",
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusText,
                        { color: getStatusColor(assignment.status) },
                      ]}
                    >
                      {assignment.status.replace("_", " ").toUpperCase()}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.assignmentFooter}>
                <View style={styles.dueDateContainer}>
                  <MaterialIcons name="schedule" size={16} color="#666666" />
                  <Text style={styles.dueDateText}>
                    Due: {assignment.dueDate}
                  </Text>
                </View>

                <TouchableOpacity style={styles.viewAssignmentButton}>
                  <Text style={styles.viewAssignmentText}>View Details</Text>
                  <MaterialIcons
                    name="arrow-forward"
                    size={16}
                    color={theme.colors.primary}
                  />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* Academic Reports */}
        <View style={styles.reportsContainer}>
          <Text style={styles.sectionTitle}>Academic Reports</Text>

          {academicReports.map((report) => (
            <TouchableOpacity
              key={report.id}
              style={styles.reportCard}
              onPress={() => handleReportPress(report)}
            >
              <View style={styles.reportHeader}>
                <View style={styles.reportIcon}>
                  <MaterialIcons
                    name="description"
                    size={24}
                    color={theme.colors.primary}
                  />
                </View>

                <View style={styles.reportInfo}>
                  <Text style={styles.reportTitle}>{report.title}</Text>
                  <Text style={styles.reportDate}>{report.date}</Text>
                </View>

                <View style={styles.reportGrade}>
                  <Text
                    style={[
                      styles.reportGradeText,
                      { color: getGradeColor(report.overallGrade) },
                    ]}
                  >
                    {report.overallGrade}
                  </Text>
                  <Text style={styles.reportGpaText}>GPA: {report.gpa}</Text>
                </View>
              </View>

              <View style={styles.reportFooter}>
                <View style={styles.reportTypeBadge}>
                  <Text style={styles.reportTypeText}>
                    {report.type.replace("_", " ").toUpperCase()}
                  </Text>
                </View>

                <MaterialIcons
                  name="download"
                  size={20}
                  color={theme.colors.primary}
                />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsContainer}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity
              style={styles.quickActionCard}
              onPress={() => console.log("Grade Book")}
            >
              <MaterialIcons
                name="grade"
                size={32}
                color={theme.colors.primary}
              />
              <Text style={styles.quickActionText}>Grade Book</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickActionCard}
              onPress={() => console.log("Assignment Tracker")}
            >
              <MaterialIcons
                name="assignment"
                size={32}
                color={theme.colors.primary}
              />
              <Text style={styles.quickActionText}>Assignments</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickActionCard}
              onPress={() => console.log("Test Schedule")}
            >
              <MaterialIcons
                name="quiz"
                size={32}
                color={theme.colors.primary}
              />
              <Text style={styles.quickActionText}>Test Schedule</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickActionCard}
              onPress={() => console.log("Progress Analytics")}
            >
              <MaterialIcons
                name="analytics"
                size={32}
                color={theme.colors.primary}
              />
              <Text style={styles.quickActionText}>Analytics</Text>
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
  summaryContainer: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontFamily: theme.fonts.bold,
    fontSize: 20,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  summaryCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: theme.spacing.md,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryStats: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  summaryStat: {
    alignItems: "center",
  },
  summaryNumber: {
    fontFamily: theme.fonts.bold,
    fontSize: 24,
    color: theme.colors.primary,
  },
  summaryLabel: {
    fontFamily: theme.fonts.regular,
    fontSize: 12,
    color: "#666666",
    marginTop: 4,
  },
  subjectsContainer: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  subjectCard: {
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
  subjectHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.sm,
  },
  subjectIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: theme.spacing.md,
  },
  subjectInfo: {
    flex: 1,
  },
  subjectName: {
    fontFamily: theme.fonts.bold,
    fontSize: 16,
    color: theme.colors.text,
  },
  subjectTeacher: {
    fontFamily: theme.fonts.regular,
    fontSize: 12,
    color: "#666666",
    marginTop: 2,
  },
  subjectGrade: {
    alignItems: "flex-end",
  },
  gradeText: {
    fontFamily: theme.fonts.bold,
    fontSize: 20,
  },
  percentageText: {
    fontFamily: theme.fonts.regular,
    fontSize: 12,
    color: "#666666",
    marginTop: 2,
  },
  subjectProgress: {
    marginTop: theme.spacing.sm,
  },
  progressInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: theme.spacing.xs,
  },
  progressText: {
    fontFamily: theme.fonts.medium,
    fontSize: 12,
    color: theme.colors.text,
  },
  nextTestText: {
    fontFamily: theme.fonts.regular,
    fontSize: 12,
    color: "#666666",
  },
  progressBar: {
    height: 4,
    backgroundColor: "#F0F0F0",
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 2,
  },
  assignmentsContainer: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  assignmentCard: {
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
  assignmentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: theme.spacing.sm,
  },
  assignmentInfo: {
    flex: 1,
  },
  assignmentTitle: {
    fontFamily: theme.fonts.bold,
    fontSize: 16,
    color: theme.colors.text,
  },
  assignmentSubject: {
    fontFamily: theme.fonts.regular,
    fontSize: 12,
    color: theme.colors.primary,
    marginTop: 2,
  },
  assignmentMeta: {
    alignItems: "flex-end",
    gap: 4,
  },
  priorityBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  priorityText: {
    fontFamily: theme.fonts.bold,
    fontSize: 8,
    color: "#FFFFFF",
  },
  statusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  statusText: {
    fontFamily: theme.fonts.medium,
    fontSize: 8,
  },
  assignmentFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dueDateContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  dueDateText: {
    fontFamily: theme.fonts.regular,
    fontSize: 12,
    color: "#666666",
    marginLeft: 4,
  },
  viewAssignmentButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  viewAssignmentText: {
    fontFamily: theme.fonts.medium,
    fontSize: 12,
    color: theme.colors.primary,
    marginRight: 4,
  },
  reportsContainer: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  reportCard: {
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
  reportHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.sm,
  },
  reportIcon: {
    marginRight: theme.spacing.md,
  },
  reportInfo: {
    flex: 1,
  },
  reportTitle: {
    fontFamily: theme.fonts.bold,
    fontSize: 16,
    color: theme.colors.text,
  },
  reportDate: {
    fontFamily: theme.fonts.regular,
    fontSize: 12,
    color: "#666666",
    marginTop: 2,
  },
  reportGrade: {
    alignItems: "flex-end",
  },
  reportGradeText: {
    fontFamily: theme.fonts.bold,
    fontSize: 18,
  },
  reportGpaText: {
    fontFamily: theme.fonts.regular,
    fontSize: 12,
    color: "#666666",
    marginTop: 2,
  },
  reportFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  reportTypeBadge: {
    backgroundColor: theme.colors.primary + "20",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  reportTypeText: {
    fontFamily: theme.fonts.medium,
    fontSize: 10,
    color: theme.colors.primary,
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
  // Charts styles
  chartsContainer: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  chartToggleContainer: {
    flexDirection: "row",
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    padding: 4,
    marginBottom: theme.spacing.md,
  },
  chartToggleButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  chartToggleButtonActive: {
    backgroundColor: theme.colors.primary,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  chartToggleText: {
    fontFamily: theme.fonts.medium,
    fontSize: 14,
    color: theme.colors.primary,
  },
  chartToggleTextActive: {
    color: "#FFFFFF",
    fontFamily: theme.fonts.bold,
  },
  chartCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: theme.spacing.lg,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  chartHeader: {
    marginBottom: theme.spacing.lg,
    alignItems: "center",
  },
  chartTitle: {
    fontFamily: theme.fonts.bold,
    fontSize: 18,
    color: theme.colors.text,
    marginBottom: 4,
  },
  chartSubtitle: {
    fontFamily: theme.fonts.regular,
    fontSize: 14,
    color: "#666666",
    textAlign: "center",
  },
  chartWrapper: {
    alignItems: "center",
    marginBottom: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  trendChartWrapper: {
    alignItems: "center",
    marginBottom: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  trendTitle: {
    fontFamily: theme.fonts.bold,
    fontSize: 16,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  insightsContainer: {
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    paddingTop: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  insightItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  insightText: {
    fontFamily: theme.fonts.medium,
    fontSize: 14,
    color: theme.colors.text,
    flex: 1,
  },
});

export default AcademicMain;
