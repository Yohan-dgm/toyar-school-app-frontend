import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { theme } from "../../../../styles/theme";
import { USER_CATEGORIES } from "../../../../constants/userCategories";
import { setSelectedStudent } from "../../../../state-store/slices/app-slice";
import { transformStudentWithProfilePicture } from "../../../../utils/studentProfileUtils";

// House color mapping and validation
const getHouseInfo = (houseName) => {
  if (!houseName || houseName === "Unknown House") {
    return { isValid: false, color: "#999999" }; // Gray for no house
  }

  const lowerHouseName = houseName.toLowerCase();

  if (lowerHouseName.includes("vulcan")) {
    return { isValid: true, color: "#FF8C00" }; // Orange
  } else if (lowerHouseName.includes("tellus")) {
    return { isValid: true, color: "#FFD700" }; // Yellow
  } else if (lowerHouseName.includes("eurus")) {
    return { isValid: true, color: "#87CEEB" }; // Light blue
  } else if (lowerHouseName.includes("calypso")) {
    return { isValid: true, color: "#32CD32" }; // Green
  }

  return { isValid: false, color: "#999999" }; // Gray for unrecognized house
};

const StudentProfileMain = () => {
  const dispatch = useDispatch();

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
        `👤 StudentProfileMain - Auto-selecting first student: ${students[0]?.student_calling_name}`,
      );
      dispatch(setSelectedStudent(students[0]));
    }
  }, [students.length, selectedStudent, dispatch]);

  // Debug logging
  console.log(
    "👤 StudentProfileMain - User category:",
    userCategory,
    "Is parent:",
    isParent,
  );
  console.log("👤 StudentProfileMain - Students count:", students.length);
  console.log(
    "👤 StudentProfileMain - Selected student:",
    selectedStudent?.student_calling_name,
  );

  if (!selectedStudent) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyState}>
          <MaterialIcons name="person-outline" size={64} color="#CCCCCC" />
          <Text style={styles.emptyStateText}>No student selected</Text>
          <Text style={styles.emptyStateSubtext}>
            Please select a student to view profile
          </Text>
        </View>
      </View>
    );
  }

  const renderTimelineItem = (item, index) => (
    <View key={index} style={styles.timelineItem}>
      <View style={styles.timelineLeft}>
        <View style={styles.timelineYear}>
          <Text style={styles.timelineYearText}>{item.year}</Text>
        </View>
        {index < selectedStudent.timeline.length - 1 && (
          <View style={styles.timelineLine} />
        )}
      </View>

      <View style={styles.timelineContent}>
        <View style={styles.timelineCard}>
          <View style={styles.timelineHeader}>
            <Image
              source={selectedStudent.profileImage}
              style={styles.timelineAvatar}
            />
            <View style={styles.timelineInfo}>
              <Text style={styles.timelineGrade}>{item.grade}</Text>
              <Text style={styles.timelineGPA}>GPA: {item.gpa}</Text>
            </View>
          </View>

          {/* Badges */}
          <View style={styles.badgesContainer}>
            {item.badges.map((badge, badgeIndex) => (
              <View key={badgeIndex} style={styles.badge}>
                <Text style={styles.badgeText}>{badge}</Text>
              </View>
            ))}
          </View>

          {/* Achievements */}
          <View style={styles.achievementsContainer}>
            <Text style={styles.achievementsTitle}>Achievements:</Text>
            {item.achievements.map((achievement, achIndex) => (
              <Text key={achIndex} style={styles.achievementText}>
                • {achievement}
              </Text>
            ))}
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        {/* Modern Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileImageWrapper}>
            <Image
              source={selectedStudent.profileImage}
              style={styles.profileImage}
            />
            <View style={styles.verifiedBadge}>
              <MaterialIcons name="verified" size={18} color="#FFFFFF" />
            </View>
          </View>

          <View style={styles.profileInfo}>
            <Text style={styles.studentName}>{selectedStudent.name}</Text>
            <Text style={styles.studentDetails}>
              {selectedStudent.studentId} • Class {selectedStudent.grade}
            </Text>
            <Text style={styles.campusName}>{selectedStudent.campus}</Text>

            {(() => {
              const houseInfo = getHouseInfo(selectedStudent.schoolHouse);

              if (!houseInfo.isValid) {
                // Show small gray circle for no house or unrecognized house
                return (
                  <View
                    style={[
                      styles.houseCircle,
                      { backgroundColor: houseInfo.color },
                    ]}
                  />
                );
              }

              // Show house name with color
              return (
                <View
                  style={[
                    styles.houseChip,
                    { backgroundColor: houseInfo.color },
                  ]}
                >
                  <Text style={styles.houseText}>
                    {selectedStudent.schoolHouse}
                  </Text>
                </View>
              );
            })()}
          </View>
        </View>

        {/* Modern Stats Cards */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <Ionicons name="calendar-outline" size={24} color="#920734" />
            </View>
            <Text style={styles.statNumber}>
              {selectedStudent.timeline.length}
            </Text>
            <Text style={styles.statTitle}>Years</Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <Ionicons name="trophy-outline" size={24} color="#920734" />
            </View>
            <Text style={styles.statNumber}>
              {selectedStudent.timeline.reduce(
                (sum, item) => sum + item.achievements.length,
                0,
              )}
            </Text>
            <Text style={styles.statTitle}>Awards</Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <Ionicons
                name="checkmark-circle-outline"
                size={24}
                color="#920734"
              />
            </View>
            <Text style={styles.statNumber}>95%</Text>
            <Text style={styles.statTitle}>Attendance</Text>
          </View>
        </View>

        {/* Student Information Section */}
        <View style={styles.infoSection}>
          <View style={styles.sectionHeader}>
            <Ionicons name="person-outline" size={20} color="#920734" />
            <Text style={styles.sectionTitle}>Student Information</Text>
          </View>

          <View style={styles.infoList}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Admission Number</Text>
              <Text style={styles.infoValue}>
                {selectedStudent.admissionNumber || "ADM/2024/001"}
              </Text>
            </View>

            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Full Name</Text>
              <Text style={styles.infoValue}>{selectedStudent.name}</Text>
            </View>

            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Date of Birth</Text>
              <Text style={styles.infoValue}>
                {selectedStudent.dateOfBirth || "12 Mar 2010"}
              </Text>
            </View>

            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Gender</Text>
              <Text style={styles.infoValue}>
                {selectedStudent.gender || "Male"}
              </Text>
            </View>

            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>School House</Text>
              <Text style={styles.infoValue}>
                {selectedStudent.schoolHouse}
              </Text>
            </View>
          </View>
        </View>

        {/* Academic Timeline Section */}
        <View style={styles.timelineSection}>
          <View style={styles.sectionHeader}>
            <Ionicons name="school-outline" size={20} color="#920734" />
            <Text style={styles.sectionTitle}>Academic Timeline</Text>
          </View>

          <View style={styles.timelineContainer}>
            {selectedStudent.timeline.map((item, index) =>
              renderTimelineItem(item, index),
            )}
          </View>
        </View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: theme.spacing.lg,
  },
  emptyStateText: {
    fontFamily: theme.fonts.bold,
    fontSize: 18,
    color: "#666666",
    marginTop: theme.spacing.md,
  },
  emptyStateSubtext: {
    fontFamily: theme.fonts.regular,
    fontSize: 14,
    color: "#999999",
    marginTop: theme.spacing.sm,
    textAlign: "center",
  },
  profileCard: {
    backgroundColor: "#FFFFFF",
    margin: theme.spacing.lg,
    borderRadius: 20,
    padding: theme.spacing.lg,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  profileImageWrapper: {
    position: "relative",
    marginBottom: theme.spacing.md,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: "#920734",
  },
  verifiedBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#4CAF50",
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  profileInfo: {
    alignItems: "center",
  },
  studentName: {
    fontFamily: theme.fonts.bold,
    fontSize: 24,
    color: "#000000",
    marginBottom: 4,
  },
  studentDetails: {
    fontFamily: theme.fonts.regular,
    fontSize: 16,
    color: "#666666",
    marginBottom: 4,
  },
  campusName: {
    fontFamily: theme.fonts.regular,
    fontSize: 14,
    color: "#999999",
    marginBottom: theme.spacing.md,
  },
  houseChip: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  houseText: {
    fontFamily: theme.fonts.bold,
    fontSize: 14,
    color: "#FFFFFF",
  },
  houseCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: 4,
  },
  statsGrid: {
    flexDirection: "row",
    paddingHorizontal: theme.spacing.lg,
    gap: 12,
    marginBottom: theme.spacing.lg,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: theme.spacing.md,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statIcon: {
    marginBottom: theme.spacing.sm,
  },
  statNumber: {
    fontFamily: theme.fonts.bold,
    fontSize: 24,
    color: "#000000",
    marginBottom: 4,
  },
  statTitle: {
    fontFamily: theme.fonts.regular,
    fontSize: 12,
    color: "#666666",
    textAlign: "center",
  },
  infoSection: {
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.md,
    gap: 8,
  },
  sectionTitle: {
    fontFamily: theme.fonts.bold,
    fontSize: 18,
    color: "#000000",
  },
  infoList: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: theme.spacing.md,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  infoItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  infoLabel: {
    fontFamily: theme.fonts.medium,
    fontSize: 14,
    color: "#666666",
    flex: 1,
  },
  infoValue: {
    fontFamily: theme.fonts.regular,
    fontSize: 14,
    color: "#000000",
    flex: 1,
    textAlign: "right",
  },
  timelineSection: {
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  timelineContainer: {
    paddingLeft: 20,
  },
  timelineItem: {
    flexDirection: "row",
    marginBottom: 24,
  },
  timelineLeft: {
    alignItems: "center",
    marginRight: 20,
  },
  timelineYear: {
    backgroundColor: "#920734",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    minWidth: 60,
    alignItems: "center",
  },
  timelineYearText: {
    fontFamily: theme.fonts.bold,
    fontSize: 12,
    color: "#FFFFFF",
  },
  timelineLine: {
    width: 2,
    height: 60,
    backgroundColor: "#E0E0E0",
    marginTop: 8,
  },
  timelineContent: {
    flex: 1,
  },
  timelineCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  timelineHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  timelineAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  timelineInfo: {
    flex: 1,
  },
  timelineGrade: {
    fontFamily: theme.fonts.bold,
    fontSize: 18,
    color: "#000000",
  },
  timelineGPA: {
    fontFamily: theme.fonts.regular,
    fontSize: 14,
    color: "#666666",
    marginTop: 2,
  },
  badgesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
  },
  badge: {
    backgroundColor: "#E3F2FD",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  badgeText: {
    fontFamily: theme.fonts.medium,
    fontSize: 12,
    color: "#1976D2",
  },
  achievementsContainer: {
    marginTop: 8,
  },
  achievementsTitle: {
    fontFamily: theme.fonts.bold,
    fontSize: 14,
    color: "#000000",
    marginBottom: 6,
  },
  achievementText: {
    fontFamily: theme.fonts.regular,
    fontSize: 13,
    color: "#666666",
    lineHeight: 18,
    marginBottom: 2,
  },
  bottomSpacing: {
    height: 40,
  },
});

export default StudentProfileMain;
