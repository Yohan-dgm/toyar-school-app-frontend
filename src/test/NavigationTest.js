import React from "react";
import { View, Text, StyleSheet } from "react-native";

// Test imports to verify navigation files are working
try {
  const SchoolLifeMain = require("../screens/authenticated/parent/school-life/SchoolLifeMain").default;
  const EducatorFeedbackMain = require("../screens/authenticated/parent/educator-feedback/EducatorFeedbackMain").default;
  const CalendarMain = require("../screens/authenticated/parent/calendar/CalendarMain").default;
  const AcademicMain = require("../screens/authenticated/parent/academic/AcademicMain").default;
  const PerformanceMain = require("../screens/authenticated/parent/performance/PerformanceMain").default;
  const ParentNavigator = require("../navigation/ParentNavigator").default;
  
  console.log("✅ All navigation files imported successfully!");
  console.log("✅ SchoolLifeMain:", typeof SchoolLifeMain);
  console.log("✅ EducatorFeedbackMain:", typeof EducatorFeedbackMain);
  console.log("✅ CalendarMain:", typeof CalendarMain);
  console.log("✅ AcademicMain:", typeof AcademicMain);
  console.log("✅ PerformanceMain:", typeof PerformanceMain);
  console.log("✅ ParentNavigator:", typeof ParentNavigator);
  
} catch (error) {
  console.error("❌ Navigation import error:", error.message);
}

const NavigationTest = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Navigation Test</Text>
      <Text style={styles.subtitle}>Check console for import results</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#920734",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#666666",
  },
});

export default NavigationTest;
