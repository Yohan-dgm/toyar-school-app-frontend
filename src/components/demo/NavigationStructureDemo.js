import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { theme } from "../../styles/theme";
import { handleNavigationPress } from "../../utils/navigationFix";
import Header from "../common/Header";
// import BottomNavigation from "../common/BottomNavigation";

const NavigationStructureDemo = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState("schoolLife");

  const handleTabPress = (tabId) => {
    console.log("Tab pressed:", tabId);
    setActiveTab(tabId);

    // Test navigation using the navigation fix utility
    handleNavigationPress(tabId, "NavigationStructureDemo");
  };

  const folderStructure = [
    {
      id: 1,
      name: "school-life",
      icon: "folder",
      color: "#4CAF50",
      description:
        "School Life section with announcements, events, and activities",
      files: [
        "SchoolLifeMain.js",
        "AnnouncementDetail.js (future)",
        "EventDetail.js (future)",
        "SchoolEvents.js (future)",
        "StudentDirectory.js (future)",
        "SchoolGallery.js (future)",
        "SchoolNews.js (future)",
      ],
    },
    {
      id: 2,
      name: "educator-feedback",
      icon: "folder",
      color: "#2196F3",
      description: "Communication with teachers and educators",
      files: [
        "EducatorFeedbackMain.js",
        "ChatDetail.js (future)",
        "ScheduleMeeting.js (future)",
        "ViewReports.js (future)",
        "SendFeedback.js (future)",
        "ParentPortal.js (future)",
      ],
    },
    {
      id: 3,
      name: "calendar",
      icon: "folder",
      color: "#FF9800",
      description: "School calendar and attendance tracking",
      files: [
        "CalendarMain.js",
        "AttendanceDetail.js (future)",
        "AddEvent.js (future)",
        "ViewCalendar.js (future)",
        "AttendanceReport.js (future)",
        "EventReminders.js (future)",
      ],
    },
    {
      id: 4,
      name: "academic",
      icon: "folder",
      color: "#9C27B0",
      description: "Academic performance and grade tracking",
      files: [
        "AcademicMain.js",
        "SubjectDetail.js (future)",
        "ReportDetail.js (future)",
        "GradeBook.js (future)",
        "AssignmentTracker.js (future)",
        "TestSchedule.js (future)",
        "ProgressAnalytics.js (future)",
      ],
    },
    {
      id: 5,
      name: "performance",
      icon: "folder",
      color: "#FF5722",
      description: "Overall student performance metrics and analytics",
      files: [
        "PerformanceMain.js",
        "MetricDetail.js (future)",
        "SkillDetail.js (future)",
        "DetailedReport.js (future)",
        "ProgressChart.js (future)",
        "GoalSetting.js (future)",
        "ComparePerformance.js (future)",
      ],
    },
  ];

  const navigationFeatures = [
    {
      id: 1,
      title: "Scalable Folder Structure",
      description:
        "Each navigation section has its own folder with main file and expandable sub-pages",
      icon: "account-tree",
      color: "#4CAF50",
    },
    {
      id: 2,
      title: "Proper Navigation Flow",
      description:
        "Seamless navigation between sections with active state management",
      icon: "navigation",
      color: "#2196F3",
    },
    {
      id: 3,
      title: "Future-Ready Architecture",
      description:
        "Easy to add new pages within each section without restructuring",
      icon: "extension",
      color: "#FF9800",
    },
    {
      id: 4,
      title: "Consistent UI/UX",
      description:
        "All sections follow the same design patterns and user experience",
      icon: "design-services",
      color: "#9C27B0",
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <Header />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={styles.headerSection}>
          <Text style={styles.headerTitle}>🏗️ Navigation Structure</Text>
          <Text style={styles.headerSubtitle}>
            Scalable folder structure with proper navigation system
          </Text>
        </View>

        {/* Current Active Section */}
        <View style={styles.activeSection}>
          <Text style={styles.sectionTitle}>Currently Active Section</Text>
          <View style={styles.activeSectionCard}>
            <MaterialIcons
              name="radio-button-checked"
              size={24}
              color={theme.colors.primary}
            />
            <Text style={styles.activeSectionText}>
              {activeTab.charAt(0).toUpperCase() +
                activeTab.slice(1).replace(/([A-Z])/g, " $1")}
            </Text>
          </View>
        </View>

        {/* Folder Structure */}
        <View style={styles.structureContainer}>
          <Text style={styles.sectionTitle}>Folder Structure</Text>
          <Text style={styles.structureSubtitle}>
            src/screens/authenticated/parent/
          </Text>

          {folderStructure.map((folder) => (
            <View key={folder.id} style={styles.folderCard}>
              <View style={styles.folderHeader}>
                <View style={styles.folderIconContainer}>
                  <MaterialIcons
                    name={folder.icon}
                    size={24}
                    color={folder.color}
                  />
                  <Text style={styles.folderName}>{folder.name}/</Text>
                </View>
              </View>

              <Text style={styles.folderDescription}>{folder.description}</Text>

              <View style={styles.filesContainer}>
                <Text style={styles.filesTitle}>Files:</Text>
                {folder.files.map((file, index) => (
                  <View key={index} style={styles.fileItem}>
                    <MaterialIcons
                      name={
                        file.includes("(future)") ? "schedule" : "description"
                      }
                      size={16}
                      color={
                        file.includes("(future)")
                          ? "#9E9E9E"
                          : theme.colors.primary
                      }
                    />
                    <Text
                      style={[
                        styles.fileName,
                        file.includes("(future)") && styles.futureFile,
                      ]}
                    >
                      {file}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>

        {/* Navigation Features */}
        <View style={styles.featuresContainer}>
          <Text style={styles.sectionTitle}>Navigation Features</Text>

          {navigationFeatures.map((feature) => (
            <View key={feature.id} style={styles.featureCard}>
              <View
                style={[styles.featureIcon, { backgroundColor: feature.color }]}
              >
                <MaterialIcons name={feature.icon} size={24} color="#FFFFFF" />
              </View>

              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>
                  {feature.description}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Test Navigation */}
        <View style={styles.testContainer}>
          <Text style={styles.sectionTitle}>Test Navigation</Text>
          <Text style={styles.testDescription}>
            Tap the navigation tabs below to test the new navigation system!
          </Text>

          <View style={styles.testGrid}>
            {[
              { id: "schoolLife", title: "School Life", icon: "home" },
              { id: "feedback", title: "Educator Feedback", icon: "chat" },
              { id: "calendar", title: "Calendar", icon: "calendar-today" },
              { id: "academic", title: "Academic", icon: "school" },
              { id: "performance", title: "Performance", icon: "trending-up" },
            ].map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.testButton,
                  activeTab === item.id && styles.activeTestButton,
                ]}
                onPress={() => handleTabPress(item.id)}
              >
                <MaterialIcons
                  name={item.icon}
                  size={20}
                  color={
                    activeTab === item.id ? "#FFFFFF" : theme.colors.primary
                  }
                />
                <Text
                  style={[
                    styles.testButtonText,
                    activeTab === item.id && styles.activeTestButtonText,
                  ]}
                >
                  {item.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* BottomNavigation temporarily disabled during migration */}
    </SafeAreaView>
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
  activeSection: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontFamily: theme.fonts.bold,
    fontSize: 20,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  activeSectionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: theme.spacing.md,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  activeSectionText: {
    fontFamily: theme.fonts.bold,
    fontSize: 18,
    color: theme.colors.text,
    marginLeft: theme.spacing.md,
  },
  structureContainer: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  structureSubtitle: {
    fontFamily: theme.fonts.medium,
    fontSize: 14,
    color: "#666666",
    marginBottom: theme.spacing.md,
    fontStyle: "italic",
  },
  folderCard: {
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
  folderHeader: {
    marginBottom: theme.spacing.sm,
  },
  folderIconContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  folderName: {
    fontFamily: theme.fonts.bold,
    fontSize: 16,
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
  },
  folderDescription: {
    fontFamily: theme.fonts.regular,
    fontSize: 14,
    color: "#666666",
    marginBottom: theme.spacing.sm,
    lineHeight: 20,
  },
  filesContainer: {
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    paddingTop: theme.spacing.sm,
  },
  filesTitle: {
    fontFamily: theme.fonts.medium,
    fontSize: 12,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  fileItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  fileName: {
    fontFamily: theme.fonts.regular,
    fontSize: 12,
    color: theme.colors.text,
    marginLeft: 6,
  },
  futureFile: {
    color: "#9E9E9E",
    fontStyle: "italic",
  },
  featuresContainer: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  featureCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginRight: theme.spacing.md,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontFamily: theme.fonts.bold,
    fontSize: 16,
    color: theme.colors.text,
    marginBottom: 4,
  },
  featureDescription: {
    fontFamily: theme.fonts.regular,
    fontSize: 14,
    color: "#666666",
    lineHeight: 20,
  },
  testContainer: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  testDescription: {
    fontFamily: theme.fonts.regular,
    fontSize: 14,
    color: "#666666",
    marginBottom: theme.spacing.md,
    lineHeight: 20,
  },
  testGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  testButton: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: theme.spacing.md,
    alignItems: "center",
    marginBottom: theme.spacing.sm,
    borderWidth: 2,
    borderColor: "transparent",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  activeTestButton: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  testButtonText: {
    fontFamily: theme.fonts.medium,
    fontSize: 12,
    color: theme.colors.text,
    textAlign: "center",
    marginTop: theme.spacing.xs,
  },
  activeTestButtonText: {
    color: "#FFFFFF",
  },
});

export default NavigationStructureDemo;
