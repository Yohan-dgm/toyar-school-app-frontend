import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

interface Grade {
  id: number;
  name: string;
  student_list_count?: number;
  students_count?: number;
  active: boolean;
}

interface GradeSelectionComponentProps {
  availableGrades: Grade[];
  selectedGrade: string | null;
  onGradeSelect: (gradeName: string) => void;
  isLoading?: boolean;
  error?: any;
  isRequired?: boolean;
}

/**
 * GradeSelectionComponent - Reusable component for selecting grades
 *
 * Features:
 * - Displays available grades in a horizontal scrollable list
 * - Shows loading state while fetching grades
 * - Handles error states gracefully
 * - Supports required field validation styling
 * - Responsive card-based UI with selection indicators
 */
const GradeSelectionComponent: React.FC<GradeSelectionComponentProps> = ({
  availableGrades,
  selectedGrade,
  onGradeSelect,
  isLoading = false,
  error = null,
  isRequired = true,
}) => {
  // Filter valid grades
  const validGrades = React.useMemo(() => {
    return (availableGrades || []).filter((grade) => grade && grade.name);
  }, [availableGrades]);

  return (
    <View style={styles.container}>
      <Text
        style={[
          styles.sectionTitle,
          isRequired && !selectedGrade && styles.requiredFieldTitle,
        ]}
      >
        Select Grade
        {isRequired && <Text style={styles.requiredAsterisk}> *</Text>}
      </Text>

      <Text style={styles.helpText}>
        First select the grade to view students from that grade.
      </Text>

      {/* Loading State */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#920734" />
          <Text style={styles.loadingText}>Loading grades...</Text>
        </View>
      ) : error && validGrades.length === 0 ? (
        /* Error State */
        <View style={styles.errorContainer}>
          <MaterialIcons name="error-outline" size={24} color="#F44336" />
          <Text style={styles.errorText}>
            Failed to load grades. Please check your connection and try again.
          </Text>
        </View>
      ) : (
        /* Grades List */
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.gradesList}
          contentContainerStyle={styles.gradesListContent}
        >
          {validGrades.map((grade) => (
            <TouchableOpacity
              key={grade.id || grade.name}
              style={[
                styles.gradeCard,
                selectedGrade === grade.name && styles.selectedGradeCard,
              ]}
              onPress={() => onGradeSelect(grade.name)}
              activeOpacity={0.7}
            >
              <MaterialIcons
                name="school"
                size={24}
                color={selectedGrade === grade.name ? "#FFFFFF" : "#920734"}
              />
              <Text
                style={[
                  styles.gradeCardName,
                  selectedGrade === grade.name && styles.selectedGradeCardName,
                ]}
              >
                {grade.name || "Unknown Grade"}
              </Text>
              {(grade.student_list_count || grade.students_count) && (
                <Text
                  style={[
                    styles.gradeCardStudents,
                    selectedGrade === grade.name &&
                      styles.selectedGradeCardStudents,
                  ]}
                >
                  {grade.student_list_count || grade.students_count} students
                </Text>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* No Grades State */}
      {!isLoading && !error && validGrades.length === 0 && (
        <View style={styles.noGradesContainer}>
          <MaterialIcons name="info" size={24} color="#999" />
          <Text style={styles.noGradesText}>
            No grades available at the moment.
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  requiredFieldTitle: {
    color: "#920734",
  },
  requiredAsterisk: {
    color: "#F44336",
    fontSize: 18,
    fontWeight: "bold",
  },
  helpText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
    lineHeight: 20,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#666",
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
    paddingHorizontal: 16,
    backgroundColor: "#FFF5F5",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#FED7D7",
  },
  errorText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#E53E3E",
    textAlign: "center",
    flex: 1,
  },
  gradesList: {
    marginTop: 8,
  },
  gradesListContent: {
    paddingRight: 16,
  },
  gradeCard: {
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    alignItems: "center",
    minWidth: 120,
    borderWidth: 2,
    borderColor: "#920734",
  },
  selectedGradeCard: {
    backgroundColor: "#920734",
    borderColor: "#920734",
  },
  gradeCardName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#920734",
    textAlign: "center",
    marginTop: 8,
    marginBottom: 4,
  },
  selectedGradeCardName: {
    color: "#FFFFFF",
  },
  gradeCardStudents: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
  selectedGradeCardStudents: {
    color: "#E0E0E0",
  },
  noGradesContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
    paddingHorizontal: 16,
    backgroundColor: "#F9F9F9",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  noGradesText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#999",
    textAlign: "center",
  },
});

export default GradeSelectionComponent;
