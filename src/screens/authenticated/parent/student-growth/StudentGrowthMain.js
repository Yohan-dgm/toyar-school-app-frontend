import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { MaterialIcons } from "@expo/vector-icons";
import { theme } from "../../../../styles/theme";
import { transformStudentWithProfilePicture } from "../../../../utils/studentProfileUtils";
import { USER_CATEGORIES } from "../../../../constants/userCategories";
import { setSelectedStudent } from "../../../../state-store/slices/app-slice";
import BeeHiveMetrics from "../../../../components/student-growth/BeeHiveMetrics";
import DynamicGrowthChart from "../../../../components/student-growth/DynamicGrowthChart";
import { studentGrowthMetrics } from "../../../../data/studentGrowthData";

const StudentGrowthMain = () => {
  const dispatch = useDispatch();
  const [selectedMetric, setSelectedMetric] = useState(null);

  // Get global state
  const { sessionData, selectedStudent } = useSelector((state) => state.app);

  // Get user category from session data
  const userCategory =
    sessionData?.user_category || sessionData?.data?.user_category;
  const isParent = userCategory === USER_CATEGORIES.PARENT;

  // Get student data from backend API response
  const backendStudentList = sessionData?.data?.student_list || [];

  // Transform backend student data to match UI requirements
  const students = backendStudentList.map((student) => {
    return transformStudentWithProfilePicture(student, sessionData);
  });

  // Auto-select first student if none selected and students are available
  useEffect(() => {
    if (students.length > 0 && !selectedStudent) {
      console.log(
        `📈 StudentGrowthMain - Auto-selecting first student: ${students[0]?.student_calling_name}`
      );
      dispatch(setSelectedStudent(students[0]));
    }
  }, [students.length, selectedStudent, dispatch]);

  // Auto-select Overall metric on component mount
  useEffect(() => {
    if (!selectedMetric && studentGrowthMetrics.length > 0) {
      setSelectedMetric(studentGrowthMetrics[0]); // Overall metric
    }
  }, [selectedMetric]);

  const handleMetricSelect = (metric) => {
    setSelectedMetric(metric);
  };

  // Debug logging
  console.log(
    "📈 StudentGrowthMain - User category:",
    userCategory,
    "Is parent:",
    isParent
  );
  console.log("📈 StudentGrowthMain - Students count:", students.length);
  console.log(
    "📈 StudentGrowthMain - Selected student:",
    selectedStudent?.student_calling_name
  );

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Bee Hive Metrics Grid */}
        <BeeHiveMetrics
          selectedMetric={selectedMetric}
          onMetricSelect={handleMetricSelect}
        />

        {/* Dynamic Growth Chart */}
        <DynamicGrowthChart selectedMetric={selectedMetric} />

        {/* Action Buttons */}
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => alert("Educator Feedback feature coming soon!")}
          >
            <MaterialIcons name="feedback" size={24} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>View Educator Feedback</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.secondaryActionButton]}
            onPress={() => alert("Attendance feature coming soon!")}
          >
            <MaterialIcons
              name="event-available"
              size={24}
              color={theme.colors.primary}
            />
            <Text
              style={[
                styles.actionButtonText,
                styles.secondaryActionButtonText,
              ]}
            >
              View Attendance
            </Text>
          </TouchableOpacity>
        </View>

        {/* Performance Summary */}
        {selectedMetric && (
          <View style={styles.summaryContainer}>
            <Text style={styles.summaryTitle}>Performance Summary</Text>
            <Text style={styles.summaryText}>
              {selectedStudent?.student_calling_name} is performing{" "}
              <Text
                style={[
                  styles.summaryHighlight,
                  { color: selectedMetric.color },
                ]}
              >
                {selectedMetric.rating >= 4.5
                  ? "excellently"
                  : selectedMetric.rating >= 3.5
                    ? "well"
                    : selectedMetric.rating >= 2.5
                      ? "adequately"
                      : "below expectations"}
              </Text>{" "}
              in {selectedMetric.title.toLowerCase()}. Current rating is{" "}
              <Text
                style={[
                  styles.summaryHighlight,
                  { color: selectedMetric.color },
                ]}
              >
                {selectedMetric.rating.toFixed(1)}/5.0
              </Text>
              {selectedMetric.rating < 3 && (
                <Text style={styles.warningText}>
                  {" "}
                  ⚠️ This area needs attention and improvement.
                </Text>
              )}
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  scrollContainer: {
    flex: 1,
  },
  chartPlaceholder: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    margin: 20,
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  chartTitle: {
    fontSize: 18,
    fontFamily: theme.fonts.bold,
    color: "#000000",
    marginBottom: 8,
  },
  chartSubtitle: {
    fontSize: 16,
    fontFamily: theme.fonts.medium,
    color: theme.colors.primary,
    marginBottom: 12,
  },
  chartDescription: {
    fontSize: 14,
    fontFamily: theme.fonts.regular,
    color: "#666666",
    textAlign: "center",
  },
  actionButtonsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  secondaryActionButton: {
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  actionButtonText: {
    fontSize: 16,
    fontFamily: theme.fonts.bold,
    color: "#FFFFFF",
  },
  secondaryActionButtonText: {
    color: theme.colors.primary,
  },
  summaryContainer: {
    margin: 20,
    padding: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  summaryTitle: {
    fontSize: 18,
    fontFamily: theme.fonts.bold,
    color: "#000000",
    marginBottom: 12,
  },
  summaryText: {
    fontSize: 15,
    fontFamily: theme.fonts.regular,
    color: "#333333",
    lineHeight: 22,
  },
  summaryHighlight: {
    fontFamily: theme.fonts.bold,
  },
  warningText: {
    color: "#FF3B30",
    fontFamily: theme.fonts.medium,
  },
});

export default StudentGrowthMain;
