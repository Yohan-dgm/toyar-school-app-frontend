import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { MaterialIcons } from "@expo/vector-icons";
import { theme } from "../../../../styles/theme";
import { USER_CATEGORIES } from "../../../../constants/userCategories";
import { setSelectedStudent } from "../../../../state-store/slices/app-slice";
import { transformStudentWithProfilePicture } from "../../../../utils/studentProfileUtils";

// House logo and color mapping
const getHouseInfo = (houseName) => {
  if (!houseName || houseName === "Unknown House") {
    return { isValid: false, color: "#999999", logo: null };
  }

  const lowerHouseName = houseName.toLowerCase();

  if (lowerHouseName.includes("vulcan")) {
    return {
      isValid: true,
      color: "#FF8C00",
      logo: require("../../../../assets/nexis-college/Houses/Vulcan.png"),
    };
  } else if (lowerHouseName.includes("tellus")) {
    return {
      isValid: true,
      color: "#FFD700",
      logo: require("../../../../assets/nexis-college/Houses/Tellus.png"),
    };
  } else if (lowerHouseName.includes("eurus")) {
    return {
      isValid: true,
      color: "#87CEEB",
      logo: require("../../../../assets/nexis-college/Houses/Eurus.png"),
    };
  } else if (lowerHouseName.includes("calypso")) {
    return {
      isValid: true,
      color: "#32CD32",
      logo: require("../../../../assets/nexis-college/Houses/Calypso.png"),
    };
  }

  return { isValid: false, color: "#999999", logo: null };
};

// Sample badges data
const sampleBadges = [
  { id: 1, name: "Honor Roll", icon: "🏆", color: "#FFD700" },
  { id: 2, name: "Perfect Attendance", icon: "📅", color: "#4CAF50" },
  { id: 3, name: "Sports Excellence", icon: "⚽", color: "#FF5722" },
  { id: 4, name: "Leadership", icon: "👑", color: "#9C27B0" },
  { id: 5, name: "Academic Star", icon: "⭐", color: "#2196F3" },
];

const StudentProfileMain = () => {
  const dispatch = useDispatch();
  const [isExpanded, setIsExpanded] = useState(false);

  // Enable LayoutAnimation on Android
  if (
    Platform.OS === "android" &&
    UIManager.setLayoutAnimationEnabledExperimental
  ) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }

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
        `👤 StudentProfileMain - Auto-selecting first student: ${students[0]?.student_calling_name}`
      );
      dispatch(setSelectedStudent(students[0]));
    }
  }, [students.length, selectedStudent, dispatch]);

  // Debug logging
  console.log(
    "👤 StudentProfileMain - User category:",
    userCategory,
    "Is parent:",
    isParent
  );
  console.log("👤 StudentProfileMain - Students count:", students.length);
  console.log(
    "👤 StudentProfileMain - Selected student:",
    selectedStudent?.student_calling_name
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

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        {/* Expandable Academic Information Header */}
        <TouchableOpacity
          style={styles.academicHeader}
          onPress={() => {
            LayoutAnimation.configureNext(
              LayoutAnimation.Presets.easeInEaseOut
            );
            setIsExpanded(!isExpanded);
          }}
          activeOpacity={0.9}
        >
          <View style={styles.headerMainContent}>
            <View style={styles.studentPhotoSection}>
              <View style={styles.photoContainer}>
                <Image
                  source={selectedStudent.profileImage}
                  style={styles.academicProfileImage}
                />
                {(() => {
                  const houseInfo = getHouseInfo(selectedStudent.schoolHouse);
                  if (houseInfo.isValid && houseInfo.logo) {
                    return (
                      <View style={styles.houseLogoContainer}>
                        <Image
                          source={houseInfo.logo}
                          style={styles.houseLogo}
                        />
                      </View>
                    );
                  }
                  return null;
                })()}
              </View>
            </View>

            <View style={styles.academicInfo}>
              <Text style={styles.academicStudentName}>
                {selectedStudent.name}
              </Text>
              <Text style={styles.academicStudentId}>
                ID: {selectedStudent.studentId}
              </Text>
              <Text style={styles.academicClass}>
                Class {selectedStudent.grade}
              </Text>
              <Text style={styles.academicHouse}>
                {selectedStudent.schoolHouse}
              </Text>
            </View>

            <View style={styles.expandIcon}>
              <MaterialIcons
                name={isExpanded ? "keyboard-arrow-up" : "keyboard-arrow-down"}
                size={24}
                color="#920734"
              />
            </View>
          </View>

          {/* Expanded Student Details */}
          {isExpanded && (
            <View style={styles.expandedContent}>
              <View style={styles.divider} />
              <View style={styles.detailsGrid}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Admission Number</Text>
                  <Text style={styles.detailValue}>
                    {selectedStudent.admissionNumber || "ADM/2024/001"}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Full Name</Text>
                  <Text style={styles.detailValue}>{selectedStudent.name}</Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Date of Birth</Text>
                  <Text style={styles.detailValue}>
                    {selectedStudent.dateOfBirth || "12 Mar 2010"}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Gender</Text>
                  <Text style={styles.detailValue}>
                    {selectedStudent.gender || "Male"}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>School House</Text>
                  <Text style={styles.detailValue}>
                    {selectedStudent.schoolHouse}
                  </Text>
                </View>
              </View>
            </View>
          )}
        </TouchableOpacity>

        {/* Premium Badges Section */}
        <View style={styles.badgesSection}>
          <Text style={styles.badgesSectionTitle}>Achievements & Badges</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.badgesScrollContainer}
          >
            {sampleBadges.map((badge) => (
              <View
                key={badge.id}
                style={[styles.premiumBadge, { borderColor: badge.color }]}
              >
                <Text style={styles.badgeIcon}>{badge.icon}</Text>
                <Text style={styles.badgeName}>{badge.name}</Text>
                <View
                  style={[
                    styles.badgeColorBar,
                    { backgroundColor: badge.color },
                  ]}
                />
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Academic Cards */}
        <View style={styles.academicCardsSection}>
          <TouchableOpacity style={styles.academicCard}>
            <View style={styles.cardIcon}>
              <MaterialIcons name="quiz" size={32} color="#6366F1" />
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Exams</Text>
              <Text style={styles.cardSubtitle}>
                View exam schedules & results
              </Text>
            </View>
            <MaterialIcons name="arrow-forward-ios" size={16} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.academicCard}>
            <View style={styles.cardIcon}>
              <MaterialIcons name="assignment" size={32} color="#10B981" />
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Report Cards</Text>
              <Text style={styles.cardSubtitle}>
                Academic performance reports
              </Text>
            </View>
            <MaterialIcons name="arrow-forward-ios" size={16} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        {/* Modern Stats Cards */}
        {/* <View style={styles.statsGrid}>
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
                0
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
        </View> */}

        {/* Academic Timeline Section */}
        {/* <View style={styles.timelineSection}>
          <View style={styles.sectionHeader}>
            <Ionicons name="school-outline" size={20} color="#920734" />
            <Text style={styles.sectionTitle}>Academic Timeline</Text>
          </View>

          <View style={styles.timelineContainer}>
            {selectedStudent.timeline.map((item, index) =>
              renderTimelineItem(item, index)
            )}
          </View>
        </View> */}

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
    paddingBottom: 30,
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
    justifyContent: "space-between",
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
  // New Academic Header Styles
  academicHeader: {
    backgroundColor: "#F4E5E8",
    margin: theme.spacing.md,
    borderRadius: 16,
    border: 2,
    borderColor: "red",
    padding: theme.spacing.md,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    overflow: "hidden",
  },
  headerMainContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  expandIcon: {
    marginLeft: "auto",
    paddingLeft: theme.spacing.sm,
  },
  expandedContent: {
    marginTop: theme.spacing.sm,
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginBottom: theme.spacing.sm,
  },
  detailsGrid: {
    gap: theme.spacing.xs,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 6,
  },
  detailLabel: {
    fontFamily: theme.fonts.medium,
    fontSize: 13,
    color: "#6B7280",
    flex: 1,
  },
  detailValue: {
    fontFamily: theme.fonts.regular,
    fontSize: 13,
    color: "#111827",
    flex: 1,
    textAlign: "right",
  },
  studentPhotoSection: {
    marginRight: theme.spacing.md,
  },
  photoContainer: {
    position: "relative",
  },
  academicProfileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "#920734",
  },
  houseLogoContainer: {
    position: "absolute",
    bottom: -3,
    right: -3,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  houseLogo: {
    width: 18,
    height: 18,
    borderRadius: 9,
  },
  academicInfo: {
    flex: 1,
  },
  academicStudentName: {
    fontFamily: theme.fonts.bold,
    fontSize: 15,
    color: "#000000",
    marginBottom: 3,
  },
  academicStudentId: {
    fontFamily: theme.fonts.regular,
    fontSize: 13,
    color: "#666666",
    marginBottom: 2,
  },
  academicClass: {
    fontFamily: theme.fonts.medium,
    fontSize: 14,
    color: "#920734",
    marginBottom: 2,
  },
  academicHouse: {
    fontFamily: theme.fonts.regular,
    fontSize: 13,
    color: "#888888",
  },
  // Premium Badges Styles
  badgesSection: {
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  badgesSectionTitle: {
    fontFamily: theme.fonts.bold,
    fontSize: 18,
    color: "#000000",
    marginBottom: theme.spacing.md,
  },
  badgesScrollContainer: {
    paddingHorizontal: 4,
  },
  premiumBadge: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginRight: 12,
    alignItems: "center",
    minWidth: 100,
    borderWidth: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  badgeIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  badgeName: {
    fontFamily: theme.fonts.bold,
    fontSize: 12,
    color: "#000000",
    textAlign: "center",
    marginBottom: 8,
  },
  badgeColorBar: {
    width: "100%",
    height: 3,
    borderRadius: 2,
  },
  // Academic Cards Styles
  academicCardsSection: {
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    gap: 12,
  },
  academicCard: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: theme.spacing.lg,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  cardIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#F8FAFC",
    justifyContent: "center",
    alignItems: "center",
    marginRight: theme.spacing.md,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontFamily: theme.fonts.bold,
    fontSize: 16,
    color: "#000000",
    marginBottom: 4,
  },
  cardSubtitle: {
    fontFamily: theme.fonts.regular,
    fontSize: 14,
    color: "#6B7280",
  },
});

export default StudentProfileMain;
