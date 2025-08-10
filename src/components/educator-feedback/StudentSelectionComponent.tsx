import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Image,
  StyleSheet,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

interface Student {
  id: number;
  name: string;
  full_name?: string;
  student_calling_name?: string;
  admission_number: string;
  grade?: string;
  grade_level_id?: number;
  profile_image?: string | null;
  profileImage?: string;
  active?: boolean;
}

interface StudentSelectionComponentProps {
  students: Student[];
  selectedStudent: Student | null;
  onStudentSelect: (student: Student) => void;
  selectedGrade: string | null;
  isLoading?: boolean;
  error?: any;
  isRequired?: boolean;
  showGradeIndicator?: boolean;
}

/**
 * StudentSelectionComponent - Reusable component for selecting students
 *
 * Features:
 * - Displays students in a horizontal scrollable list with photos
 * - Shows loading state while fetching students
 * - Handles error states and empty states gracefully
 * - Supports required field validation styling
 * - Shows grade context when available
 * - Responsive card-based UI with selection indicators
 */
const StudentSelectionComponent: React.FC<StudentSelectionComponentProps> = ({
  students,
  selectedStudent,
  onStudentSelect,
  selectedGrade,
  isLoading = false,
  error = null,
  isRequired = true,
  showGradeIndicator = true,
}) => {
  // Filter valid students
  const validStudents = React.useMemo(() => {
    return (students || []).filter((student) => student && student.id);
  }, [students]);

  // Get student display name
  const getStudentDisplayName = (student: Student): string => {
    return student.full_name || student.name || `Student ${student.id}`;
  };

  // Get student profile image
  const getStudentProfileImage = (student: Student): string => {
    return (
      student.profile_image ||
      student.profileImage ||
      "https://via.placeholder.com/50?text=👤"
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text
          style={[
            styles.sectionTitle,
            isRequired && !selectedStudent && styles.requiredFieldTitle,
          ]}
        >
          Select Student
          {isRequired && <Text style={styles.requiredAsterisk}> *</Text>}
        </Text>

        {showGradeIndicator && selectedGrade && (
          <View style={styles.gradeIndicator}>
            <MaterialIcons name="school" size={14} color="#920734" />
            <Text style={styles.gradeIndicatorText}>{selectedGrade}</Text>
          </View>
        )}
      </View>

      {/* Loading State */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#920734" />
          <Text style={styles.loadingText}>Loading students...</Text>
        </View>
      ) : error ? (
        /* Error State */
        <View style={styles.errorContainer}>
          <MaterialIcons name="error-outline" size={24} color="#F44336" />
          <Text style={styles.errorText}>
            Failed to load students. Please check your connection and try again.
          </Text>
        </View>
      ) : validStudents.length > 0 ? (
        /* Students List */
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.studentsList}
          contentContainerStyle={styles.studentsListContent}
        >
          {validStudents.map((student) => (
            <TouchableOpacity
              key={student.id}
              style={[
                styles.studentCard,
                selectedStudent?.id === student.id &&
                  styles.selectedStudentCard,
              ]}
              onPress={() => onStudentSelect(student)}
              activeOpacity={0.7}
            >
              <View style={styles.studentImageContainer}>
                <Image
                  source={{ uri: getStudentProfileImage(student) }}
                  style={styles.studentCardImage}
                  defaultSource={{
                    uri: "https://via.placeholder.com/50?text=👤",
                  }}
                />
                {selectedStudent?.id === student.id && (
                  <View style={styles.selectedIndicator}>
                    <MaterialIcons name="check" size={16} color="#FFFFFF" />
                  </View>
                )}
              </View>

              <Text style={styles.studentCardName} numberOfLines={2}>
                {getStudentDisplayName(student)}
              </Text>

              <Text style={styles.studentCardDetails} numberOfLines={1}>
                {student.admission_number}
              </Text>

              {student.grade && (
                <Text style={styles.studentCardGrade} numberOfLines={1}>
                  {student.grade}
                </Text>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      ) : selectedGrade ? (
        /* No Students in Grade */
        <View style={styles.noStudentsContainer}>
          <MaterialIcons name="info" size={24} color="#999" />
          <Text style={styles.noStudentsText}>
            No students found in {selectedGrade}
          </Text>
        </View>
      ) : (
        /* Select Grade First */
        <View style={styles.selectGradeFirstContainer}>
          <MaterialIcons name="arrow-upward" size={24} color="#999" />
          <Text style={styles.selectGradeFirstText}>
            Please select a grade first to view students
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  requiredFieldTitle: {
    color: "#920734",
  },
  requiredAsterisk: {
    color: "#F44336",
    fontSize: 18,
    fontWeight: "bold",
  },
  gradeIndicator: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F8FF",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#920734",
  },
  gradeIndicatorText: {
    marginLeft: 4,
    fontSize: 12,
    color: "#920734",
    fontWeight: "500",
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
  studentsList: {
    marginTop: 8,
  },
  studentsListContent: {
    paddingRight: 16,
  },
  studentCard: {
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    padding: 12,
    marginRight: 12,
    alignItems: "center",
    width: 120,
    borderWidth: 2,
    borderColor: "#E0E0E0",
  },
  selectedStudentCard: {
    backgroundColor: "#F0F8FF",
    borderColor: "#920734",
  },
  studentImageContainer: {
    position: "relative",
    marginBottom: 8,
  },
  studentCardImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#E0E0E0",
  },
  selectedIndicator: {
    position: "absolute",
    top: -2,
    right: -2,
    backgroundColor: "#920734",
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  studentCardName: {
    fontSize: 13,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
    marginBottom: 4,
    minHeight: 32,
  },
  studentCardDetails: {
    fontSize: 11,
    color: "#666",
    textAlign: "center",
    marginBottom: 2,
  },
  studentCardGrade: {
    fontSize: 10,
    color: "#920734",
    textAlign: "center",
    fontWeight: "500",
  },
  noStudentsContainer: {
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
  noStudentsText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#999",
    textAlign: "center",
  },
  selectGradeFirstContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
    paddingHorizontal: 16,
    backgroundColor: "#FFFAF0",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#FFE4B5",
  },
  selectGradeFirstText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#D69E2E",
    textAlign: "center",
  },
});

export default StudentSelectionComponent;
