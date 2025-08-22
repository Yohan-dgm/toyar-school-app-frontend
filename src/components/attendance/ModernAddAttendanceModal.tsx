import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  ActivityIndicator,
  Modal,
  Dimensions,
  FlatList,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from "react-native-reanimated";
import { Calendar } from "react-native-calendars";
import FullScreenModal from "../../screens/authenticated/principal/dashboard/components/FullScreenModal";
import {
  formatAttendanceDate,
  useCreateStudentAttendanceMutation,
  transformStudentsToAttendanceData,
  validateAttendanceData,
} from "../../api/attendance-api";
import {
  useGetStudentsByGradeWithPaginationQuery,
  useLazyGetStudentsByGradeWithPaginationQuery,
} from "../../api/educator-feedback-api";
import { GRADE_LEVELS } from "../../constants/gradeLevels";

// Import new modern components
import ModernStudentAttendanceCard from "./ModernStudentAttendanceCard";
import ModernStudentAttendanceListItem from "./ModernStudentAttendanceListItem";
import AttendanceEditModal from "./AttendanceEditModal";
import CompactAttendanceChart from "./CompactAttendanceChart";
import BulkAttendanceActions from "./BulkAttendanceActions";

const { width, height } = Dimensions.get("window");

interface Student {
  id: number;
  name: string;
  full_name: string;
  admission_number: string;
  profile_image?: string;
  attachment?: any;
  attachments?: any[];
  student_attachment_list?: any[];
  grade: string;
  class: string;
  // house?: string;
  attendance: "present" | "absent" | "late";
  grade_level_id?: number;
  grade_level?: any;
  grade_level_class_id?: number;
}

interface AddAttendanceModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const ModernAddAttendanceModal: React.FC<AddAttendanceModalProps> = ({
  visible,
  onClose,
  onSuccess,
}) => {
  // State management
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedGrade, setSelectedGrade] = useState<any>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isLoadingStudents, setIsLoadingStudents] = useState(false);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Attendance details state - tracks reason, notes, and times for each student
  const [attendanceDetails, setAttendanceDetails] = useState<{
    [studentId: number]: {
      reason?: string;
      notes?: string;
      inTime?: string;
      outTime?: string;
    };
  }>({});

  // Debug logging for bulk actions visibility
  useEffect(() => {
    console.log("📊 showBulkActions changed:", showBulkActions);
  }, [showBulkActions]);
  const [selectedStudentForEdit, setSelectedStudentForEdit] =
    useState<Student | null>(null);
  const [lateAttendanceMode, setLateAttendanceMode] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("list"); // Default to list view

  // Animation values
  const fadeValue = useSharedValue(0);
  const slideValue = useSharedValue(50);

  // API hooks
  const [createStudentAttendance, { isLoading: isCreatingAttendance }] =
    useCreateStudentAttendanceMutation();

  const {
    data: studentsData,
    error: studentsError,
    isLoading: studentsLoading,
  } = useGetStudentsByGradeWithPaginationQuery(
    {
      grade_level_id: selectedGrade?.id,
      page: 1,
      page_size: 10000,
      search_phrase: "",
      search_filter_list: [],
    },
    { skip: !selectedGrade?.id },
  );

  const [fetchAdditionalPages] = useLazyGetStudentsByGradeWithPaginationQuery();

  // School houses are now fetched from API via student.school_house.name

  // Reset all states to default values
  const resetToDefaultState = () => {
    console.log("🔄 Resetting Add Attendance Modal to default state...");
    console.log("   📅 Selected date: Reset to today");
    console.log("   🏫 Selected grade: Reset to null");
    console.log("   👥 Students: Clear all data");
    console.log("   🔍 Search query: Clear search");
    console.log("   💾 Attendance details: Clear all details");
    console.log("   🎨 View mode: Reset to list view");

    setSelectedDate(new Date());
    setSelectedGrade(null);
    setStudents([]);
    setFilteredStudents([]);
    setSearchQuery("");
    setIsLoading(false);
    setShowDatePicker(false);
    setIsLoadingStudents(false);
    setShowBulkActions(false);
    setIsSaving(false);
    setAttendanceDetails({});
    setSelectedStudentForEdit(null);
    setLateAttendanceMode(false);
    setViewMode("list");

    console.log("✅ Add Attendance Modal reset completed");
  };

  // Entry animation and state reset
  useEffect(() => {
    if (visible) {
      // Reset to default state when modal opens
      resetToDefaultState();

      // Start entry animation
      fadeValue.value = withTiming(1, { duration: 300 });
      slideValue.value = withSpring(0, { damping: 15, stiffness: 150 });
    } else {
      // Reset animation values when modal closes
      fadeValue.value = 0;
      slideValue.value = 50;
    }
  }, [visible]);

  // Process API students data
  useEffect(() => {
    if (selectedGrade) {
      if (studentsLoading) {
        setIsLoadingStudents(true);
        return;
      }

      if (
        studentsData?.data?.students &&
        studentsData.data.students.length > 0
      ) {
        let apiStudents = studentsData.data.students.map((student, index) => ({
          id: student.id || index + 1,
          name:
            student.name || student.student_calling_name || "Unknown Student",
          full_name:
            student.full_name ||
            student.student_full_name ||
            student.name ||
            "Unknown Student",
          admission_number:
            student.admission_number ||
            student.student_admission_number ||
            `ADM${String(index + 1).padStart(3, "0")}`,
          profile_image: student.profile_image || student.profile_picture,
          attachment: student.attachment || null,
          attachments: student.attachments || [],
          student_attachment_list: student.student_attachment_list || [],
          grade: selectedGrade.display_name,
          class: student.class || "A",
          // house: student.school_house?.name || student.house || "No House",
          attendance: "present" as const,
          grade_level_id: student.grade_level_id,
          grade_level: student.grade_level,
          // Add grade_level_class_id from student data if available
          grade_level_class_id:
            student.grade_level_class_id || student.grade_level_id,
        }));

        // Frontend filtering as backup
        const filteredByGrade = apiStudents.filter((student) => {
          if (student.grade_level_id) {
            return student.grade_level_id === selectedGrade.id;
          }
          if (student.grade_level?.id) {
            return student.grade_level.id === selectedGrade.id;
          }
          return true;
        });

        setStudents(filteredByGrade);
      } else {
        setStudents([]);
      }
      setIsLoadingStudents(false);
    } else {
      setStudents([]);
      setIsLoadingStudents(false);
    }
  }, [selectedGrade, studentsData, studentsLoading, studentsError]);

  // Filter students based on search
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredStudents(students);
    } else {
      const filtered = students.filter(
        (student) =>
          student.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          student.admission_number
            .toLowerCase()
            .includes(searchQuery.toLowerCase()),
        // ||
        // student.house?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredStudents(filtered);
    }
  }, [students, searchQuery]);

  // Attendance statistics
  const attendanceStats = useMemo(() => {
    const present = students.filter((s) => s.attendance === "present").length;
    const absent = students.filter((s) => s.attendance === "absent").length;
    const late = students.filter((s) => s.attendance === "late").length;
    return { present, absent, late, total: students.length };
  }, [students]);

  // Handle attendance change
  const handleAttendanceChange = (
    studentId: number,
    attendance: "present" | "absent" | "late",
  ) => {
    setStudents((prev) =>
      prev.map((student) =>
        student.id === studentId ? { ...student, attendance } : student,
      ),
    );
  };

  // Handle opening student edit modal (regular)
  const handleStudentPress = (student: Student) => {
    setSelectedStudentForEdit(student);
    setLateAttendanceMode(false);
  };

  // Handle opening student edit modal for late attendance
  const handleStudentPressForLate = (student: Student) => {
    setSelectedStudentForEdit(student);
    setLateAttendanceMode(true);
  };

  // Handle student edit
  const handleStudentEdit = (
    studentId: number,
    attendance: "present" | "absent" | "late",
    reason?: string,
    notes?: string,
    inTime?: string,
    outTime?: string,
  ) => {
    setStudents((prev) =>
      prev.map((student) =>
        student.id === studentId ? { ...student, attendance } : student,
      ),
    );

    // Save attendance details
    setAttendanceDetails((prev) => ({
      ...prev,
      [studentId]: {
        reason,
        notes,
        inTime,
        outTime,
      },
    }));

    // Reset late attendance mode after saving
    setLateAttendanceMode(false);
  };

  // Bulk actions
  const handleMarkAllPresent = () => {
    setStudents((prev) =>
      prev.map((student) => ({ ...student, attendance: "present" as const })),
    );
  };

  const handleMarkAllAbsent = () => {
    setStudents((prev) =>
      prev.map((student) => ({ ...student, attendance: "absent" as const })),
    );
  };

  const handleMarkAllLate = () => {
    setStudents((prev) =>
      prev.map((student) => ({ ...student, attendance: "late" as const })),
    );
  };

  const handleResetAll = () => {
    setStudents((prev) =>
      prev.map((student) => ({ ...student, attendance: "present" as const })),
    );
  };

  // Save attendance data to backend
  const handleSaveAttendance = async () => {
    if (!selectedGrade || students.length === 0) {
      Alert.alert(
        "Error",
        "Please select a grade and ensure students are loaded.",
      );
      return;
    }

    setIsSaving(true);

    try {
      // Create attendance states mapping
      const attendanceStates: {
        [studentId: number]: {
          status: "present" | "absent" | "late";
          reason?: string;
          notes?: string;
          inTime?: string;
          outTime?: string;
        };
      } = {};

      students.forEach((student) => {
        const details = attendanceDetails[student.id] || {};
        attendanceStates[student.id] = {
          status: student.attendance,
          reason: details.reason,
          notes: details.notes,
          inTime: details.inTime,
          outTime: details.outTime,
        };
      });

      // Transform data for API - use student's actual grade_level_id instead of selectedGrade.id
      const attendanceData = transformStudentsToAttendanceData(
        students,
        formatDateForCalendar(selectedDate), // YYYY-MM-DD format in local timezone
        students[0]?.grade_level_id || selectedGrade.id, // Use actual student grade_level_id
        attendanceStates,
      );

      console.log("📊 Attendance data being sent:", {
        selectedDate: selectedDate,
        selectedDateString: formatDateForCalendar(selectedDate),
        selectedDateDisplay: formatAttendanceDate(
          formatDateForCalendar(selectedDate),
        ),
        selectedGradeId: selectedGrade.id,
        studentGradeLevelId: students[0]?.grade_level_id,
        studentsCount: students.length,
        sampleStudentData: students[0],
        attendanceData: attendanceData.slice(0, 2), // Log first 2 records
      });

      // Validate data
      const validation = validateAttendanceData(attendanceData);
      if (!validation.isValid) {
        Alert.alert("Validation Error", validation.errors.join("\n"));
        setIsSaving(false);
        return;
      }

      // Call API
      const response = await createStudentAttendance({
        attendance_data: attendanceData,
      }).unwrap();

      console.log("✅ Attendance saved successfully:", response);

      Alert.alert("Success", `Attendance saved successfully!`, [
        {
          text: "OK",
          onPress: () => {
            onSuccess?.(); // Call success callback
            onClose(); // Close the modal
          },
        },
      ]);
    } catch (error: any) {
      console.error("❌ Error saving attendance:", error);

      const errorMessage =
        error?.data?.message ||
        error?.message ||
        "Failed to save attendance. Please try again.";

      Alert.alert("Error", errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!selectedGrade) {
      Alert.alert("Error", "Please select a grade");
      return;
    }
    if (students.length === 0) {
      Alert.alert("Error", "No students found for selected grade");
      return;
    }

    setIsLoading(true);
    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      Alert.alert("Success", "Attendance has been recorded successfully!", [
        {
          text: "OK",
          onPress: () => {
            onSuccess?.();
            onClose();
          },
        },
      ]);
    } catch {
      Alert.alert("Error", "Failed to save attendance. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle modal close - Simple direct close without unsaved changes alert
  const handleClose = () => {
    onClose();
  };

  // Format date for calendar
  const formatDateForCalendar = (date: Date): string => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  };

  // Custom handler for attendance changes that includes late attendance logic
  const handleAttendanceChangeWithLateModal = (
    studentId: number,
    attendance: "present" | "absent" | "late",
  ) => {
    if (attendance === "late") {
      // Find the student and open modal for late attendance
      const student = students.find((s) => s.id === studentId);
      if (student) {
        handleStudentPressForLate(student);
      }
    } else {
      // For present/absent, directly change attendance
      handleAttendanceChange(studentId, attendance);
    }
  };

  // Render student item based on view mode
  const renderStudentItem = ({ item }: { item: Student }) => {
    if (viewMode === "list") {
      return (
        <ModernStudentAttendanceListItem
          student={item}
          onAttendanceChange={handleAttendanceChangeWithLateModal}
          onStudentPress={handleStudentPress}
        />
      );
    } else {
      return (
        <ModernStudentAttendanceCard
          student={item}
          onAttendanceChange={handleAttendanceChangeWithLateModal}
          onStudentPress={handleStudentPress}
        />
      );
    }
  };

  // Animated styles
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: fadeValue.value,
    transform: [{ translateY: slideValue.value }],
  }));

  return (
    <FullScreenModal
      visible={visible}
      onClose={handleClose}
      title="Mark Attendance"
      backgroundColor="#F8F9FA"
    >
      <Animated.View style={[styles.container, animatedStyle]}>
        {/* Main Content with Single FlatList */}
        {selectedGrade && filteredStudents.length > 0 ? (
          viewMode === "list" ? (
            <FlatList
              key="attendance-list-view"
              data={filteredStudents}
              renderItem={renderStudentItem}
              keyExtractor={(item) => `list-${item.id}`}
              numColumns={1}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={[
                styles.studentsGrid,
                styles.studentsGridList,
              ]}
              ListHeaderComponent={
                <View>
                  {/* Compact Date Selection */}
                  <View style={styles.dateSection}>
                    <LinearGradient
                      colors={["#920734", "#A91D47"]}
                      style={styles.dateCard}
                    >
                      <TouchableOpacity
                        style={styles.dateButton}
                        onPress={() => setShowDatePicker(true)}
                      >
                        <MaterialIcons
                          name="calendar-today"
                          size={20}
                          color="#FFFFFF"
                        />
                        <Text style={styles.dateText}>
                          {formatAttendanceDate(
                            formatDateForCalendar(selectedDate),
                          )}
                        </Text>
                        <MaterialIcons
                          name="expand-more"
                          size={20}
                          color="#FFFFFF"
                        />
                      </TouchableOpacity>
                    </LinearGradient>
                  </View>

                  {/* Modern Grade Selection */}
                  <View style={styles.gradeSection}>
                    <Text style={styles.sectionTitle}>Select Grade Level</Text>
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      style={styles.gradeScroll}
                      contentContainerStyle={styles.gradeScrollContent}
                    >
                      {GRADE_LEVELS.map((grade) => (
                        <TouchableOpacity
                          key={grade.id}
                          style={[
                            styles.gradeCard,
                            selectedGrade?.id === grade.id &&
                              styles.selectedGradeCard,
                          ]}
                          onPress={() => {
                            setSelectedGrade(grade);
                            setStudents([]);
                          }}
                        >
                          <LinearGradient
                            colors={
                              selectedGrade?.id === grade.id
                                ? ["#920734", "#A91D47"]
                                : ["#FFFFFF", "#F8F9FA"]
                            }
                            style={styles.gradeCardGradient}
                          >
                            <Text
                              style={[
                                styles.gradeName,
                                selectedGrade?.id === grade.id &&
                                  styles.selectedGradeName,
                              ]}
                            >
                              {grade.display_name}
                            </Text>
                            <Text
                              style={[
                                styles.gradeCount,
                                selectedGrade?.id === grade.id &&
                                  styles.selectedGradeCount,
                              ]}
                            >
                              {selectedGrade?.id === grade.id
                                ? `${students.length} students`
                                : "Select to view"}
                            </Text>
                          </LinearGradient>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>

                  {/* Search and Controls */}
                  <View style={styles.controlsSection}>
                    <View style={styles.searchRow}>
                      <View style={styles.searchContainer}>
                        <MaterialIcons name="search" size={20} color="#666" />
                        <TextInput
                          style={styles.searchInput}
                          placeholder="Search students..."
                          value={searchQuery}
                          onChangeText={setSearchQuery}
                          placeholderTextColor="#999"
                        />
                        {searchQuery.length > 0 && (
                          <TouchableOpacity onPress={() => setSearchQuery("")}>
                            <MaterialIcons
                              name="clear"
                              size={20}
                              color="#666"
                            />
                          </TouchableOpacity>
                        )}
                      </View>

                      <View style={styles.controlButtons}>
                        <TouchableOpacity
                          style={[
                            styles.viewModeButton,
                            viewMode === "grid" && styles.activeViewMode,
                          ]}
                          onPress={() => setViewMode("grid")}
                        >
                          <MaterialIcons
                            name="grid-view"
                            size={16}
                            color={viewMode === "grid" ? "#FFFFFF" : "#666"}
                          />
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[
                            styles.viewModeButton,
                            viewMode === "list" && styles.activeViewMode,
                          ]}
                          onPress={() => setViewMode("list")}
                        >
                          <MaterialIcons
                            name="list"
                            size={16}
                            color={viewMode === "list" ? "#FFFFFF" : "#666"}
                          />
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.bulkActionButton}
                          onPress={() => {
                            console.log("🔥 Bulk Actions button pressed!");
                            setShowBulkActions(true);
                          }}
                        >
                          <MaterialIcons
                            name="more-vert"
                            size={16}
                            color="#FFFFFF"
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>
              }
            />
          ) : (
            <FlatList
              key="attendance-grid-view"
              data={filteredStudents}
              renderItem={renderStudentItem}
              keyExtractor={(item) => `grid-${item.id}`}
              numColumns={2}
              columnWrapperStyle={styles.gridRow}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={[
                styles.studentsGrid,
                styles.studentsGridGrid,
              ]}
              ListHeaderComponent={
                <View>
                  {/* Compact Date Selection */}
                  <View style={styles.dateSection}>
                    <LinearGradient
                      colors={["#920734", "#A91D47"]}
                      style={styles.dateCard}
                    >
                      <TouchableOpacity
                        style={styles.dateButton}
                        onPress={() => setShowDatePicker(true)}
                      >
                        <MaterialIcons
                          name="calendar-today"
                          size={20}
                          color="#FFFFFF"
                        />
                        <Text style={styles.dateText}>
                          {formatAttendanceDate(
                            formatDateForCalendar(selectedDate),
                          )}
                        </Text>
                        <MaterialIcons
                          name="expand-more"
                          size={20}
                          color="#FFFFFF"
                        />
                      </TouchableOpacity>
                    </LinearGradient>
                  </View>

                  {/* Modern Grade Selection */}
                  <View style={styles.gradeSection}>
                    <Text style={styles.sectionTitle}>Select Grade Level</Text>
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      style={styles.gradeScroll}
                      contentContainerStyle={styles.gradeScrollContent}
                    >
                      {GRADE_LEVELS.map((grade) => (
                        <TouchableOpacity
                          key={grade.id}
                          style={[
                            styles.gradeCard,
                            selectedGrade?.id === grade.id &&
                              styles.selectedGradeCard,
                          ]}
                          onPress={() => {
                            setSelectedGrade(grade);
                            setStudents([]);
                          }}
                        >
                          <LinearGradient
                            colors={
                              selectedGrade?.id === grade.id
                                ? ["#920734", "#A91D47"]
                                : ["#FFFFFF", "#F8F9FA"]
                            }
                            style={styles.gradeCardGradient}
                          >
                            <Text
                              style={[
                                styles.gradeName,
                                selectedGrade?.id === grade.id &&
                                  styles.selectedGradeName,
                              ]}
                            >
                              {grade.display_name}
                            </Text>
                            <Text
                              style={[
                                styles.gradeCount,
                                selectedGrade?.id === grade.id &&
                                  styles.selectedGradeCount,
                              ]}
                            >
                              {selectedGrade?.id === grade.id
                                ? `${students.length} students`
                                : "Select to view"}
                            </Text>
                          </LinearGradient>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>

                  {/* Search and Controls */}
                  <View style={styles.controlsSection}>
                    <View style={styles.searchRow}>
                      <View style={styles.searchContainer}>
                        <MaterialIcons name="search" size={20} color="#666" />
                        <TextInput
                          style={styles.searchInput}
                          placeholder="Search students..."
                          value={searchQuery}
                          onChangeText={setSearchQuery}
                          placeholderTextColor="#999"
                        />
                        {searchQuery.length > 0 && (
                          <TouchableOpacity onPress={() => setSearchQuery("")}>
                            <MaterialIcons
                              name="clear"
                              size={20}
                              color="#666"
                            />
                          </TouchableOpacity>
                        )}
                      </View>

                      <View style={styles.controlButtons}>
                        <TouchableOpacity
                          style={[
                            styles.viewModeButton,
                            viewMode === "grid" && styles.activeViewMode,
                          ]}
                          onPress={() => setViewMode("grid")}
                        >
                          <MaterialIcons
                            name="grid-view"
                            size={16}
                            color={viewMode === "grid" ? "#FFFFFF" : "#666"}
                          />
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[
                            styles.viewModeButton,
                            viewMode === "list" && styles.activeViewMode,
                          ]}
                          onPress={() => setViewMode("list")}
                        >
                          <MaterialIcons
                            name="list"
                            size={16}
                            color={viewMode === "list" ? "#FFFFFF" : "#666"}
                          />
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.bulkActionButton}
                          onPress={() => {
                            console.log("🔥 Bulk Actions button pressed!");
                            setShowBulkActions(true);
                          }}
                        >
                          <MaterialIcons
                            name="more-vert"
                            size={16}
                            color="#FFFFFF"
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>
              }
            />
          )
        ) : (
          <View style={styles.mainContent}>
            {/* Compact Date Selection */}
            <View style={styles.dateSection}>
              <LinearGradient
                colors={["#920734", "#A91D47"]}
                style={styles.dateCard}
              >
                <TouchableOpacity
                  style={styles.dateButton}
                  onPress={() => setShowDatePicker(true)}
                >
                  <MaterialIcons
                    name="calendar-today"
                    size={20}
                    color="#FFFFFF"
                  />
                  <Text style={styles.dateText}>
                    {formatAttendanceDate(formatDateForCalendar(selectedDate))}
                  </Text>
                  <MaterialIcons name="expand-more" size={20} color="#FFFFFF" />
                </TouchableOpacity>
              </LinearGradient>
            </View>

            {/* Modern Grade Selection */}
            <View style={styles.gradeSection}>
              <Text style={styles.sectionTitle}>Select Grade Level</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.gradeScroll}
                contentContainerStyle={styles.gradeScrollContent}
              >
                {GRADE_LEVELS.map((grade) => (
                  <TouchableOpacity
                    key={grade.id}
                    style={[
                      styles.gradeCard,
                      selectedGrade?.id === grade.id &&
                        styles.selectedGradeCard,
                    ]}
                    onPress={() => {
                      setSelectedGrade(grade);
                      setStudents([]);
                    }}
                  >
                    <LinearGradient
                      colors={
                        selectedGrade?.id === grade.id
                          ? ["#920734", "#A91D47"]
                          : ["#FFFFFF", "#F8F9FA"]
                      }
                      style={styles.gradeCardGradient}
                    >
                      <Text
                        style={[
                          styles.gradeName,
                          selectedGrade?.id === grade.id &&
                            styles.selectedGradeName,
                        ]}
                      >
                        {grade.display_name}
                      </Text>
                      <Text
                        style={[
                          styles.gradeCount,
                          selectedGrade?.id === grade.id &&
                            styles.selectedGradeCount,
                        ]}
                      >
                        {selectedGrade?.id === grade.id
                          ? `${students.length} students`
                          : "Select to view"}
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Loading/Error/No Students States */}
            {selectedGrade && (
              <>
                {isLoadingStudents || studentsLoading ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#920734" />
                    <Text style={styles.loadingText}>Loading students...</Text>
                  </View>
                ) : studentsError ? (
                  <View style={styles.errorContainer}>
                    <MaterialIcons name="error" size={48} color="#F44336" />
                    <Text style={styles.errorText}>
                      Failed to load students
                    </Text>
                  </View>
                ) : (
                  <View style={styles.noStudentsContainer}>
                    <MaterialIcons name="person-off" size={48} color="#999" />
                    <Text style={styles.noStudentsText}>
                      {searchQuery
                        ? "No students match your search"
                        : "No students found"}
                    </Text>
                  </View>
                )}
              </>
            )}

            {!selectedGrade && (
              <View style={styles.selectPromptContainer}>
                <MaterialIcons name="school" size={64} color="#920734" />
                <Text style={styles.selectPromptText}>
                  Select a grade to get started
                </Text>
                <Text style={styles.selectPromptSubtext}>
                  Choose a grade level to view and mark attendance for students
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Floating Action Buttons */}
        {selectedGrade && students.length > 0 && (
          <View style={styles.floatingActions}>
            <TouchableOpacity
              style={styles.floatingButton}
              onPress={() => {
                console.log("🔥 Floating Bulk Actions button pressed!");
                setShowBulkActions(true);
              }}
            >
              <LinearGradient
                colors={["#FF9800", "#FB8C00"]}
                style={styles.fabGradient}
              >
                <MaterialIcons name="groups" size={24} color="#FFFFFF" />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}

        {/* Save Button */}
        {selectedGrade && students.length > 0 && (
          <View style={styles.saveContainer}>
            <TouchableOpacity
              style={[
                styles.saveButton,
                (isSaving || isCreatingAttendance) && styles.disabledButton,
              ]}
              onPress={handleSaveAttendance}
              disabled={isSaving || isCreatingAttendance}
            >
              <LinearGradient
                colors={
                  isSaving || isCreatingAttendance
                    ? ["#CCCCCC", "#BBBBBB"]
                    : ["#920734", "#A91D47"]
                }
                style={styles.saveGradient}
              >
                <MaterialIcons
                  name={
                    isSaving || isCreatingAttendance
                      ? "hourglass-empty"
                      : "save"
                  }
                  size={20}
                  color="#FFFFFF"
                />
                <Text style={styles.saveButtonText}>
                  {isSaving || isCreatingAttendance
                    ? "Saving..."
                    : `Save Attendance (${students.length})`}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}

        {/* Bulk Actions Modal - Using BulkAttendanceActions Component */}
        <BulkAttendanceActions
          visible={showBulkActions}
          onClose={() => setShowBulkActions(false)}
          onMarkAllPresent={handleMarkAllPresent}
          onMarkAllAbsent={handleMarkAllAbsent}
          onMarkAllLate={handleMarkAllLate}
          onResetAll={handleResetAll}
          studentCount={students.length}
          presentCount={attendanceStats.present}
          absentCount={attendanceStats.absent}
          lateCount={attendanceStats.late}
        />

        {/* Calendar Modal - Inside FullScreenModal */}
        <Modal
          visible={showDatePicker}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowDatePicker(false)}
        >
          <TouchableOpacity
            style={styles.calendarOverlay}
            activeOpacity={1}
            onPress={() => setShowDatePicker(false)}
          >
            <View style={styles.calendarContainer}>
              <View style={styles.calendarHeader}>
                <Text style={styles.calendarTitle}>Select Date</Text>
                <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                  <MaterialIcons name="close" size={24} color="#666" />
                </TouchableOpacity>
              </View>
              <Calendar
                current={formatDateForCalendar(selectedDate)}
                onDayPress={(day) => {
                  const [year, month, dayNum] = day.dateString
                    .split("-")
                    .map(Number);
                  setSelectedDate(new Date(year, month - 1, dayNum));
                  setShowDatePicker(false);
                }}
                markedDates={{
                  [formatDateForCalendar(selectedDate)]: {
                    selected: true,
                    selectedColor: "#920734",
                  },
                }}
                theme={{
                  selectedDayBackgroundColor: "#920734",
                  todayTextColor: "#920734",
                  arrowColor: "#920734",
                }}
              />
            </View>
          </TouchableOpacity>
        </Modal>

        {/* Student Edit Modal - Inside FullScreenModal */}
        <AttendanceEditModal
          visible={!!selectedStudentForEdit}
          student={selectedStudentForEdit}
          onClose={() => {
            setSelectedStudentForEdit(null);
            setLateAttendanceMode(false);
          }}
          onSave={handleStudentEdit}
          attendanceDate={formatDateForCalendar(selectedDate)}
          preSelectedStatus={lateAttendanceMode ? "late" : undefined}
        />
      </Animated.View>
    </FullScreenModal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 14,
    paddingBottom: 50,
  },
  mainContent: {
    flex: 1,
    padding: 16,
    paddingBottom: 100,
  },
  dateSection: {
    marginBottom: 20,
  },
  dateCard: {
    borderRadius: 16,
    padding: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  dateButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 12,
  },
  dateText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    flex: 1,
    textAlign: "center",
  },
  gradeSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 16,
  },
  gradeScroll: {
    flexGrow: 0,
  },
  gradeScrollContent: {
    paddingRight: 16,
  },
  gradeCard: {
    marginRight: 12,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  gradeCardGradient: {
    padding: 16,
    borderRadius: 16,
    minWidth: 140,
    alignItems: "center",
  },
  selectedGradeCard: {
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  gradeName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 4,
  },
  selectedGradeName: {
    color: "#FFFFFF",
  },
  gradeCount: {
    fontSize: 12,
    color: "#666",
  },
  selectedGradeCount: {
    color: "rgba(255,255,255,0.9)",
  },
  controlsSection: {
    marginBottom: 16,
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    marginLeft: 12,
  },
  controlButtons: {
    flexDirection: "row",
    gap: 8,
  },
  viewModeButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F5F5F5",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  activeViewMode: {
    backgroundColor: "#920734",
    borderColor: "#920734",
  },
  bulkActionButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FF9800",
  },
  studentsSection: {
    flex: 1,
    minHeight: 300,
  },
  studentsGrid: {
    paddingBottom: 20,
  },
  studentsGridList: {
    paddingHorizontal: 0,
  },
  studentsGridGrid: {
    paddingHorizontal: 8,
  },
  gridRow: {
    justifyContent: "space-between",
  },
  loadingContainer: {
    alignItems: "center",
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
  },
  errorContainer: {
    alignItems: "center",
    paddingVertical: 40,
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: "600",
    color: "#F44336",
  },
  noStudentsContainer: {
    alignItems: "center",
    paddingVertical: 40,
    backgroundColor: "#F9F9F9",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  noStudentsText: {
    marginTop: 16,
    fontSize: 16,
    color: "#999",
    textAlign: "center",
  },
  selectPromptContainer: {
    alignItems: "center",
    paddingVertical: 80,
    backgroundColor: "rgba(146, 7, 52, 0.05)",
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "rgba(146, 7, 52, 0.1)",
    borderStyle: "dashed",
  },
  selectPromptText: {
    marginTop: 20,
    fontSize: 20,
    fontWeight: "700",
    color: "#920734",
    textAlign: "center",
  },
  selectPromptSubtext: {
    marginTop: 8,
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  floatingActions: {
    position: "absolute",
    bottom: 100,
    right: 20,
  },
  floatingButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  fabGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  saveContainer: {
    position: "absolute",
    bottom: 20,
    left: 16,
    right: 16,
  },
  saveButton: {
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  saveGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  disabledButton: {
    shadowOpacity: 0.05,
  },
  calendarOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  calendarContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    width: "100%",
    maxWidth: 350,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 20,
  },
  calendarHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  calendarTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1a1a1a",
  },

  // Simple Popup Modal Styles
  popupOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  popupContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    width: "100%",
    maxWidth: 350,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 25,
  },
  popupHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  popupTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#920734",
  },
  popupCloseButton: {
    padding: 4,
  },
  popupSubtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 15,
  },
  popupStats: {
    backgroundColor: "#F8F9FA",
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
  },
  popupStatsText: {
    fontSize: 13,
    color: "#333",
    textAlign: "center",
  },
  popupActions: {
    gap: 12,
  },
  popupActionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 8,
  },
  popupActionText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  presentButton: {
    backgroundColor: "#4CAF50",
  },
  absentButton: {
    backgroundColor: "#F44336",
  },
  lateButton: {
    backgroundColor: "#FF9800",
  },
  resetButton: {
    backgroundColor: "#666",
  },
});

export default ModernAddAttendanceModal;
