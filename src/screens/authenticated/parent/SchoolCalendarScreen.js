import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme } from "../../../styles/theme";
import Header from "../../../components/common/Header";
import BottomNavigation from "../../../components/common/BottomNavigation";

const SchoolCalendarScreen = ({ navigation }) => {
  const handleTabPress = (tabId) => {
    console.log("Tab pressed:", tabId);
    // Handle navigation to different screens
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.placeholderContainer}>
          <Text style={styles.placeholderTitle}>🗓 School Calendar</Text>
          <Text style={styles.placeholderSubtitle}>
            Stay updated with school events and schedules
          </Text>
          
          <View style={styles.comingSoonCard}>
            <Text style={styles.comingSoonTitle}>Coming Soon</Text>
            <Text style={styles.comingSoonText}>
              • Monthly and yearly calendar views{"\n"}
              • School events and holidays{"\n"}
              • Exam schedules and deadlines{"\n"}
              • Parent-teacher meeting dates{"\n"}
              • Sports and extracurricular events
            </Text>
          </View>
        </View>
      </ScrollView>

      <BottomNavigation 
        activeTab="calendar" 
        onTabPress={handleTabPress}
      />
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
    paddingBottom: 100,
  },
  placeholderContainer: {
    flex: 1,
    padding: theme.spacing.lg,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 400,
  },
  placeholderTitle: {
    fontFamily: theme.fonts.bold,
    fontSize: 32,
    color: theme.colors.primary,
    textAlign: "center",
    marginBottom: theme.spacing.sm,
  },
  placeholderSubtitle: {
    fontFamily: theme.fonts.medium,
    fontSize: 18,
    color: theme.colors.text,
    textAlign: "center",
    marginBottom: theme.spacing.lg,
  },
  comingSoonCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: theme.spacing.lg,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    width: "100%",
    maxWidth: 300,
  },
  comingSoonTitle: {
    fontFamily: theme.fonts.bold,
    fontSize: 18,
    color: theme.colors.primary,
    textAlign: "center",
    marginBottom: theme.spacing.sm,
  },
  comingSoonText: {
    fontFamily: theme.fonts.regular,
    fontSize: 14,
    color: theme.colors.text,
    lineHeight: 22,
  },
});

export default SchoolCalendarScreen;
