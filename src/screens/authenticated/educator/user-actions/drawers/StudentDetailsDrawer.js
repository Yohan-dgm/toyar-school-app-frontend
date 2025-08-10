import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Dimensions,
} from "react-native";
import { useSelector } from "react-redux";
import { MaterialIcons } from "@expo/vector-icons";
import { Modalize } from "react-native-modalize";
import { theme } from "../../../../../styles/theme";
import { USER_CATEGORIES } from "../../../../../constants/userCategories";

const { height } = Dimensions.get("window");

const StudentDetailsDrawer = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const studentProfileModalRef = useRef(null);

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
      guardian_contact: "+1234567890",
      guardian_name: "Robert Doe",
      email: "john.doe@school.com",
      date_of_birth: "2014-05-15",
      address: "123 Main St, City",
      emergency_contact: "+1234567891",
      medical_info: "No known allergies",
      academic_performance: "Excellent",
      behavior_rating: 4.5,
    },
    {
      id: 2,
      student_calling_name: "Jane Smith",
      admission_number: "2024002",
      grade: "Grade 5",
      profile_picture: null,
      guardian_contact: "+1234567892",
      guardian_name: "Mary Smith",
      email: "jane.smith@school.com",
      date_of_birth: "2014-03-22",
      address: "456 Oak Ave, City",
      emergency_contact: "+1234567893",
      medical_info: "Asthma - inhaler required",
      academic_performance: "Good",
      behavior_rating: 4.2,
    },
    {
      id: 3,
      student_calling_name: "Mike Johnson",
      admission_number: "2024003",
      grade: "Grade 5",
      profile_picture: null,
      guardian_contact: "+1234567894",
      guardian_name: "David Johnson",
      email: "mike.johnson@school.com",
      date_of_birth: "2014-07-10",
      address: "789 Pine Rd, City",
      emergency_contact: "+1234567895",
      medical_info: "No medical conditions",
      academic_performance: "Average",
      behavior_rating: 3.8,
    },
  ];

  // Filter options
  const filterOptions = [
    { id: "all", label: "All Students" },
    { id: "excellent", label: "Excellent Performance" },
    { id: "good", label: "Good Performance" },
    { id: "needs_attention", label: "Needs Attention" },
  ];

  // Filter students based on search and filter
  const filteredStudents = classStudents.filter((student) => {
    const matchesSearch =
      student.student_calling_name
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      student.admission_number
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

    const matchesFilter =
      selectedFilter === "all" ||
      (selectedFilter === "excellent" &&
        student.academic_performance === "Excellent") ||
      (selectedFilter === "good" && student.academic_performance === "Good") ||
      (selectedFilter === "needs_attention" &&
        student.academic_performance === "Average");

    return matchesSearch && matchesFilter;
  });

  const openStudentProfile = (student) => {
    setSelectedStudent(student);
    studentProfileModalRef.current?.open();
  };

  const renderFilterChips = () => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.filtersContainer}
    >
      {filterOptions.map((filter) => (
        <TouchableOpacity
          key={filter.id}
          style={[
            styles.filterChip,
            selectedFilter === filter.id && styles.selectedFilterChip,
          ]}
          onPress={() => setSelectedFilter(filter.id)}
        >
          <Text
            style={[
              styles.filterText,
              selectedFilter === filter.id && styles.selectedFilterText,
            ]}
          >
            {filter.label}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const renderStudentCard = (student) => (
    <TouchableOpacity
      key={student.id}
      style={styles.studentCard}
      onPress={() => openStudentProfile(student)}
    >
      <View style={styles.studentCardHeader}>
        <View style={styles.studentAvatar}>
          {student.profile_picture ? (
            <Image
              source={{ uri: student.profile_picture }}
              style={styles.avatarImage}
            />
          ) : (
            <MaterialIcons
              name="person"
              size={32}
              color={theme.colors.textSecondary}
            />
          )}
        </View>
        <View style={styles.studentInfo}>
          <Text style={styles.studentName}>{student.student_calling_name}</Text>
          <Text style={styles.studentMeta}>
            {student.admission_number} • {student.grade}
          </Text>
          <Text style={styles.guardianInfo}>
            Guardian: {student.guardian_name}
          </Text>
        </View>
        <MaterialIcons
          name="chevron-right"
          size={24}
          color={theme.colors.textSecondary}
        />
      </View>

      <View style={styles.studentCardFooter}>
        <View style={styles.performanceTag}>
          <MaterialIcons
            name="school"
            size={16}
            color={
              student.academic_performance === "Excellent"
                ? "#4CAF50"
                : student.academic_performance === "Good"
                  ? "#FF9800"
                  : "#F44336"
            }
          />
          <Text style={styles.performanceText}>
            {student.academic_performance}
          </Text>
        </View>
        <TouchableOpacity style={styles.contactButton}>
          <MaterialIcons name="phone" size={16} color={theme.colors.primary} />
          <Text style={styles.contactText}>{student.guardian_contact}</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderStudentProfile = () => {
    if (!selectedStudent) return null;

    return (
      <ScrollView
        style={styles.profileContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileHeader}>
          <View style={styles.profileAvatar}>
            {selectedStudent.profile_picture ? (
              <Image
                source={{ uri: selectedStudent.profile_picture }}
                style={styles.profileAvatarImage}
              />
            ) : (
              <MaterialIcons
                name="person"
                size={48}
                color={theme.colors.textSecondary}
              />
            )}
          </View>
          <Text style={styles.profileName}>
            {selectedStudent.student_calling_name}
          </Text>
          <Text style={styles.profileMeta}>
            {selectedStudent.admission_number} • {selectedStudent.grade}
          </Text>
        </View>

        <View style={styles.profileSection}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          <View style={styles.infoRow}>
            <MaterialIcons
              name="person"
              size={20}
              color={theme.colors.textSecondary}
            />
            <Text style={styles.infoLabel}>Guardian:</Text>
            <Text style={styles.infoValue}>
              {selectedStudent.guardian_name}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <MaterialIcons
              name="phone"
              size={20}
              color={theme.colors.textSecondary}
            />
            <Text style={styles.infoLabel}>Phone:</Text>
            <Text style={styles.infoValue}>
              {selectedStudent.guardian_contact}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <MaterialIcons
              name="email"
              size={20}
              color={theme.colors.textSecondary}
            />
            <Text style={styles.infoLabel}>Email:</Text>
            <Text style={styles.infoValue}>{selectedStudent.email}</Text>
          </View>
        </View>

        <View style={styles.profileSection}>
          <Text style={styles.sectionTitle}>Academic Information</Text>
          <View style={styles.infoRow}>
            <MaterialIcons
              name="school"
              size={20}
              color={theme.colors.textSecondary}
            />
            <Text style={styles.infoLabel}>Performance:</Text>
            <Text style={styles.infoValue}>
              {selectedStudent.academic_performance}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <MaterialIcons
              name="star"
              size={20}
              color={theme.colors.textSecondary}
            />
            <Text style={styles.infoLabel}>Behavior Rating:</Text>
            <Text style={styles.infoValue}>
              {selectedStudent.behavior_rating}/5.0
            </Text>
          </View>
        </View>

        <View style={styles.profileSection}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          <View style={styles.infoRow}>
            <MaterialIcons
              name="cake"
              size={20}
              color={theme.colors.textSecondary}
            />
            <Text style={styles.infoLabel}>Date of Birth:</Text>
            <Text style={styles.infoValue}>
              {selectedStudent.date_of_birth}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <MaterialIcons
              name="home"
              size={20}
              color={theme.colors.textSecondary}
            />
            <Text style={styles.infoLabel}>Address:</Text>
            <Text style={styles.infoValue}>{selectedStudent.address}</Text>
          </View>
          <View style={styles.infoRow}>
            <MaterialIcons
              name="medical-services"
              size={20}
              color={theme.colors.textSecondary}
            />
            <Text style={styles.infoLabel}>Medical Info:</Text>
            <Text style={styles.infoValue}>{selectedStudent.medical_info}</Text>
          </View>
        </View>
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Classroom Student Details</Text>
        <Text style={styles.subtitle}>View and manage student information</Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <MaterialIcons
            name="search"
            size={20}
            color={theme.colors.textSecondary}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search students..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {renderFilterChips()}

      <ScrollView
        style={styles.studentsList}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.resultsText}>
          {filteredStudents.length} student
          {filteredStudents.length !== 1 ? "s" : ""} found
        </Text>
        {filteredStudents.map(renderStudentCard)}
      </ScrollView>

      {/* Student Profile Modal */}
      <Modalize
        ref={studentProfileModalRef}
        modalHeight={height * 0.9}
        modalStyle={styles.modalStyle}
        handleStyle={styles.handleStyle}
        overlayStyle={styles.overlayStyle}
        closeOnOverlayTap={true}
        panGestureEnabled={true}
      >
        {renderStudentProfile()}
      </Modalize>
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
  searchContainer: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.card,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
  },
  filtersContainer: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.card,
  },
  filterChip: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.background,
    marginRight: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  selectedFilterChip: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  filterText: {
    fontSize: 14,
    color: theme.colors.text,
  },
  selectedFilterText: {
    color: "white",
    fontWeight: "600",
  },
  studentsList: {
    flex: 1,
    paddingHorizontal: theme.spacing.md,
  },
  resultsText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginVertical: theme.spacing.md,
  },
  studentCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  studentCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },
  studentAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.background,
    justifyContent: "center",
    alignItems: "center",
    marginRight: theme.spacing.md,
  },
  avatarImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  studentInfo: {
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
  guardianInfo: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  studentCardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  performanceTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
  },
  performanceText: {
    fontSize: 12,
    color: theme.colors.text,
    marginLeft: theme.spacing.xs,
  },
  contactButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  contactText: {
    fontSize: 12,
    color: theme.colors.primary,
    marginLeft: theme.spacing.xs,
  },
  modalStyle: {
    backgroundColor: theme.colors.card,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  handleStyle: {
    backgroundColor: theme.colors.border,
    width: 40,
    height: 4,
    borderRadius: 2,
  },
  overlayStyle: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  profileContainer: {
    flex: 1,
    padding: theme.spacing.md,
  },
  profileHeader: {
    alignItems: "center",
    marginBottom: theme.spacing.lg,
  },
  profileAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.background,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },
  profileAvatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  profileName: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.colors.text,
  },
  profileMeta: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  profileSection: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },
  infoLabel: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginLeft: theme.spacing.sm,
    minWidth: 80,
  },
  infoValue: {
    fontSize: 14,
    color: theme.colors.text,
    flex: 1,
    marginLeft: theme.spacing.sm,
  },
});

export default StudentDetailsDrawer;
