import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme } from "../../styles/theme";
import Header from "../common/Header";
import BottomNavigation from "../common/BottomNavigation";

const NavigationDemo = () => {
  const [activeTab, setActiveTab] = useState("schoolLife");

  const handleTabPress = (tabId) => {
    console.log("Tab pressed:", tabId);
    setActiveTab(tabId);
  };

  const getTabDescription = (tabId) => {
    switch (tabId) {
      case "schoolLife":
        return {
          title: "🏫 School Life",
          description:
            "Home-like interface showing school activities, announcements, and daily school life updates.",
          features: [
            "School announcements",
            "Daily activities",
            "School events",
            "Student community",
          ],
        };
      case "feedback":
        return {
          title: "💬 Educator Feedback",
          description:
            "Chat interface for communication between parents and educators.",
          features: [
            "Direct messaging",
            "Teacher feedback",
            "Progress discussions",
            "Parent-teacher communication",
          ],
        };
      case "calendar":
        return {
          title: "📅 School Calendar & Attendance",
          description:
            "Calendar view showing school events and student attendance tracking.",
          features: [
            "School calendar",
            "Attendance tracking",
            "Event schedules",
            "Important dates",
          ],
        };
      case "academic":
        return {
          title: "🎓 Academic Performance",
          description: "Academic performance tracking and grade reports.",
          features: [
            "Grade reports",
            "Subject performance",
            "Academic analytics",
            "Progress tracking",
          ],
        };
      case "performance":
        return {
          title: "📊 Student Performance",
          description: "Overall student performance metrics and achievements.",
          features: [
            "Performance metrics",
            "Achievement tracking",
            "Progress charts",
            "Skill development",
          ],
        };
      default:
        return {
          title: "Navigation Demo",
          description: "Select a tab to see its description",
          features: [],
        };
    }
  };

  const currentTab = getTabDescription(activeTab);

  return (
    <SafeAreaView style={styles.container}>
      <Header />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.demoContainer}>
          <Text style={styles.demoTitle}>🎨 New Navigation Bar Demo</Text>
          <Text style={styles.demoSubtitle}>
            Modern iOS/Android compatible design with school primary color hover
            effects
          </Text>

          <View style={styles.currentTabCard}>
            <Text style={styles.currentTabTitle}>{currentTab.title}</Text>
            <Text style={styles.currentTabDescription}>
              {currentTab.description}
            </Text>

            {currentTab.features.length > 0 && (
              <View style={styles.featuresContainer}>
                <Text style={styles.featuresTitle}>Key Features:</Text>
                {currentTab.features.map((feature, index) => (
                  <Text key={index} style={styles.featureItem}>
                    • {feature}
                  </Text>
                ))}
              </View>
            )}
          </View>

          <View style={styles.designFeaturesCard}>
            <Text style={styles.designTitle}>🎯 Design Features</Text>
            <View style={styles.featuresList}>
              <Text style={styles.designFeature}>
                ✨ Apple liquid glass effect with blur background
              </Text>
              <Text style={styles.designFeature}>
                🎨 Smooth hover animations with school primary color (#920734)
              </Text>
              <Text style={styles.designFeature}>
                📱 iOS & Android compatible design
              </Text>
              <Text style={styles.designFeature}>
                ⚫ Black circle background on press for better feedback
              </Text>
              <Text style={styles.designFeature}>
                🔄 Modern circular tab design (48x48px)
              </Text>
              <Text style={styles.designFeature}>
                🎯 Larger icon size (24px) for better visibility
              </Text>
              <Text style={styles.designFeature}>
                🏠 Home icon shows initially as "School Life"
              </Text>
              <Text style={styles.designFeature}>
                💫 Clear active state visibility with primary color
              </Text>
              <Text style={styles.designFeature}>
                🌟 Enhanced shadows and depth effects
              </Text>
            </View>
          </View>

          <Text style={styles.instructionText}>
            👆 Tap the navigation tabs below to see the hover effects and
            transitions!
          </Text>
        </View>
      </ScrollView>

      <BottomNavigation activeTab={activeTab} onTabPress={handleTabPress} />
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
  demoContainer: {
    padding: theme.spacing.lg,
  },
  demoTitle: {
    fontFamily: theme.fonts.bold,
    fontSize: 28,
    color: theme.colors.primary,
    textAlign: "center",
    marginBottom: theme.spacing.sm,
  },
  demoSubtitle: {
    fontFamily: theme.fonts.medium,
    fontSize: 16,
    color: theme.colors.text,
    textAlign: "center",
    marginBottom: theme.spacing.lg,
    lineHeight: 22,
  },
  currentTabCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  currentTabTitle: {
    fontFamily: theme.fonts.bold,
    fontSize: 24,
    color: theme.colors.primary,
    marginBottom: theme.spacing.sm,
  },
  currentTabDescription: {
    fontFamily: theme.fonts.regular,
    fontSize: 16,
    color: theme.colors.text,
    lineHeight: 22,
    marginBottom: theme.spacing.md,
  },
  featuresContainer: {
    marginTop: theme.spacing.sm,
  },
  featuresTitle: {
    fontFamily: theme.fonts.medium,
    fontSize: 16,
    color: theme.colors.primary,
    marginBottom: theme.spacing.sm,
  },
  featureItem: {
    fontFamily: theme.fonts.regular,
    fontSize: 14,
    color: theme.colors.text,
    marginBottom: 4,
    paddingLeft: theme.spacing.sm,
  },
  designFeaturesCard: {
    backgroundColor: "#F8F9FA",
    borderRadius: 16,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  designTitle: {
    fontFamily: theme.fonts.bold,
    fontSize: 20,
    color: theme.colors.primary,
    marginBottom: theme.spacing.md,
  },
  featuresList: {
    gap: theme.spacing.sm,
  },
  designFeature: {
    fontFamily: theme.fonts.regular,
    fontSize: 14,
    color: theme.colors.text,
    lineHeight: 20,
  },
  instructionText: {
    fontFamily: theme.fonts.medium,
    fontSize: 16,
    color: theme.colors.primary,
    textAlign: "center",
    backgroundColor: "#FFF3F4",
    padding: theme.spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(146, 7, 52, 0.2)",
  },
});

export default NavigationDemo;
