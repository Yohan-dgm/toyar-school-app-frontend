import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { MaterialIcons } from "@expo/vector-icons";
import { theme } from "../../../../../styles/theme";
import { USER_CATEGORIES } from "../../../../../constants/userCategories";
import { getCurrentDateString } from "../../../../../utils/dateUtils";

const MarkAttendanceDrawer = () => {
  const dispatch = useDispatch();
  const [attendanceData, setAttendanceData] = useState({});
  const [selectedDate, setSelectedDate] = useState(
    getCurrentDateString(),
  );

  // Get global state
  const { sessionData } = useSelector((state) => state.app);

  // Mock student data for educator's class
  const classStudents = [
    {
      id: 1,
      student_calling_name: "John Doe",
      admission_number: "2024001",
      grade: "Grade 5",
      profile_picture: null,
    },
    {
      id: 2,
      student_calling_name: "Jane Smith",
      admission_number: "2024002",
      grade: "Grade 5",
      profile_picture: null,
    },
    {
      id: 3,
      student_calling_name: "Mike Johnson",
      admission_number: "2024003",
      grade: "Grade 5",
      profile_picture: null,
    },
    {
      id: 4,
      student_calling_name: "Sarah Wilson",
      admission_number: "2024004",
      grade: "Grade 5",
      profile_picture: null,
    },
    {
      id: 5,
      student_calling_name: "David Brown",
      admission_number: "2024005",
      grade: "Grade 5",
      profile_picture: null,
    },
  ];

  // Attendance status options
  const attendanceOptions = [
    { id: "present", label: "Present", color: "#4CAF50", icon: "check-circle" },
    { id: "absent", label: "Absent", color: "#F44336", icon: "cancel" },
    { id: "late", label: "Late", color: "#FF9800", icon: "schedule" },
  ];

  // Initialize attendance data
  useEffect(() => {
    const initialData = {};
    classStudents.forEach((student) => {
      initialData[student.id] = "present"; // Default to present
    });
    setAttendanceData(initialData);
  }, []);

  const updateAttendance = (studentId, status) => {
    setAttendanceData((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };

  const handleSubmitAttendance = () => {
    // Check if all students have attendance marked
    const unmarkedStudents = classStudents.filter(
      (student) => !attendanceData[student.id],
    );

    if (unmarkedStudents.length > 0) {
      Alert.alert(
        "Incomplete Attendance",
        "Please mark attendance for all students before submitting.",
      );
      return;
    }

    // TODO: Implement API call to submit attendance
    Alert.alert("Success", "Attendance submitted successfully");
    console.log("Attendance data:", attendanceData);
  };

  const getAttendanceSummary = () => {
    const summary = { present: 0, absent: 0, late: 0 };
    Object.values(attendanceData).forEach((status) => {
      if (summary[status] !== undefined) {
        summary[status]++;
      }
    });
    return summary;
  };

  const renderAttendanceOption = (student, option) => {
    const isSelected = attendanceData[student.id] === option.id;

    return (
      <TouchableOpacity
        key={option.id}
        style={[
          styles.attendanceOption,
          isSelected && {
            backgroundColor: option.color + "20",
            borderColor: option.color,
          },
        ]}
        onPress={() => updateAttendance(student.id, option.id)}
      >
        <MaterialIcons
          name={option.icon}
          size={20}
          color={isSelected ? option.color : theme.colors.textSecondary}
        />
        <Text
          style={[
            styles.optionText,
            isSelected && { color: option.color, fontWeight: "600" },
          ]}
        >
          {option.label}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderStudentRow = (student) => (
    <View key={student.id} style={styles.studentRow}>
      <View style={styles.studentInfo}>
        <View style={styles.studentAvatar}>
          {student.profile_picture ? (
            <Image
              source={{ uri: student.profile_picture }}
              style={styles.avatarImage}
            />
          ) : (
            <MaterialIcons
              name="person"
              size={24}
              color={theme.colors.textSecondary}
            />
          )}
        </View>
        <View style={styles.studentDetails}>
          <Text style={styles.studentName}>{student.student_calling_name}</Text>
          <Text style={styles.studentMeta}>
            {student.admission_number} • {student.grade}
          </Text>
        </View>
      </View>

      <View style={styles.attendanceOptions}>
        {attendanceOptions.map((option) =>
          renderAttendanceOption(student, option),
        )}
      </View>
    </View>
  );

  const renderSummary = () => {
    const summary = getAttendanceSummary();

    return (
      <View style={styles.summaryContainer}>
        <Text style={styles.summaryTitle}>Attendance Summary</Text>
        <View style={styles.summaryRow}>
          {attendanceOptions.map((option) => (
            <View key={option.id} style={styles.summaryItem}>
              <MaterialIcons
                name={option.icon}
                size={20}
                color={option.color}
              />
              <Text style={[styles.summaryText, { color: option.color }]}>
                {summary[option.id] || 0}
              </Text>
              <Text style={styles.summaryLabel}>{option.label}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mark Classroom Attendance</Text>
        <Text style={styles.dateText}>Date: {selectedDate}</Text>
      </View>

      {renderSummary()}

      <ScrollView
        style={styles.studentsList}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>
          Students ({classStudents.length})
        </Text>
        {classStudents.map(renderStudentRow)}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmitAttendance}
        >
          <MaterialIcons name="check" size={20} color="white" />
          <Text style={styles.submitButtonText}>Submit Attendance</Text>
        </TouchableOpacity>
      </View>
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
    marginBottom: theme.spacing.xs,
  },
  dateText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  summaryContainer: {
    backgroundColor: theme.colors.card,
    margin: theme.spacing.md,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  summaryItem: {
    alignItems: "center",
  },
  summaryText: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: theme.spacing.xs,
  },
  summaryLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  studentsList: {
    flex: 1,
    paddingHorizontal: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  studentRow: {
    backgroundColor: theme.colors.card,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  studentInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },
  studentAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.background,
    justifyContent: "center",
    alignItems: "center",
    marginRight: theme.spacing.md,
  },
  avatarImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  studentDetails: {
    flex: 1,
  },
  studentName: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
  },
  studentMeta: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  attendanceOptions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  attendanceOption: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: theme.spacing.sm,
    marginHorizontal: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  optionText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginLeft: theme.spacing.xs,
  },
  footer: {
    padding: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    backgroundColor: theme.colors.card,
  },
  submitButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: theme.spacing.sm,
  },
});

export default MarkAttendanceDrawer;
