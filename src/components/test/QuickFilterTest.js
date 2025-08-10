import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { transformFiltersForAPI } from "../activity-feed/FilterBar";

const QuickFilterTest = () => {
  const testFilterTransformation = () => {
    // Test case 1: Basic filter transformation
    const testFilter1 = {
      searchTerm: "science",
      dateRange: {
        start: new Date("2024-01-01"),
        end: new Date("2024-12-31"),
      },
      category: "academic",
      hashtags: ["ScienceFair", "Achievement"],
    };

    const result1 = transformFiltersForAPI(testFilter1);
    console.log("🧪 Test 1 - Basic transformation:", result1);

    // Test case 2: "All" category should become empty string
    const testFilter2 = {
      searchTerm: "",
      dateRange: { start: null, end: null },
      category: "all",
      hashtags: [],
    };

    const result2 = transformFiltersForAPI(testFilter2);
    console.log("🧪 Test 2 - All category:", result2);

    // Test case 3: Empty/null values
    const testFilter3 = {
      searchTerm: null,
      dateRange: { start: null, end: null },
      category: null,
      hashtags: null,
    };

    const result3 = transformFiltersForAPI(testFilter3);
    console.log("🧪 Test 3 - Null values:", result3);

    // Verify results
    const test1Pass =
      result1.search === "science" &&
      result1.dateFrom === "2024-01-01" &&
      result1.dateTo === "2024-12-31" &&
      result1.category === "academic" &&
      Array.isArray(result1.hashtags) &&
      result1.hashtags.length === 2;

    const test2Pass =
      result2.search === "" &&
      result2.dateFrom === "" &&
      result2.dateTo === "" &&
      result2.category === "" &&
      Array.isArray(result2.hashtags) &&
      result2.hashtags.length === 0;

    const test3Pass =
      result3.search === "" &&
      result3.dateFrom === "" &&
      result3.dateTo === "" &&
      result3.category === "" &&
      Array.isArray(result3.hashtags) &&
      result3.hashtags.length === 0;

    const allTestsPass = test1Pass && test2Pass && test3Pass;

    Alert.alert(
      "Filter Test Results",
      `Test 1 (Basic): ${test1Pass ? "✅ PASS" : "❌ FAIL"}\n` +
        `Test 2 (All category): ${test2Pass ? "✅ PASS" : "❌ FAIL"}\n` +
        `Test 3 (Null values): ${test3Pass ? "✅ PASS" : "❌ FAIL"}\n\n` +
        `Overall: ${allTestsPass ? "✅ ALL TESTS PASSED" : "❌ SOME TESTS FAILED"}\n\n` +
        `Check console for detailed results.`,
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🚀 Quick Filter Test</Text>
      <Text style={styles.description}>
        Test the filter transformation function to ensure it converts FilterBar
        filters to API format correctly.
      </Text>

      <TouchableOpacity
        style={styles.testButton}
        onPress={testFilterTransformation}
      >
        <Text style={styles.buttonText}>Run Filter Tests</Text>
      </TouchableOpacity>

      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>What this tests:</Text>
        <Text style={styles.infoText}>• searchTerm → search</Text>
        <Text style={styles.infoText}>
          • dateRange.start → dateFrom (ISO format)
        </Text>
        <Text style={styles.infoText}>
          • dateRange.end → dateTo (ISO format)
        </Text>
        <Text style={styles.infoText}>• category "all" → empty string</Text>
        <Text style={styles.infoText}>• hashtags array preservation</Text>
        <Text style={styles.infoText}>• null/undefined value handling</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: "#333",
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 30,
    color: "#666",
    lineHeight: 22,
  },
  testButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 10,
    alignSelf: "center",
    marginBottom: 30,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
  infoContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  infoText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
    paddingLeft: 10,
  },
});

export default QuickFilterTest;
