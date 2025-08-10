import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

// Import filter utilities
import {
  transformFiltersForAPI,
  extractCategoriesFromPosts,
  extractHashtagsFromPosts,
} from "../activity-feed/FilterBar";

const FilterIntegrationTest = () => {
  const dispatch = useDispatch();
  const [testResults, setTestResults] = useState([]);

  // Redux state
  const { posts: schoolPosts } = useSelector((state) => state.schoolPosts);

  // Test data
  const sampleFilterBarFilters = {
    searchTerm: "science fair",
    dateRange: {
      start: new Date("2024-01-01"),
      end: new Date("2024-12-31"),
    },
    category: "academic",
    hashtags: ["ScienceFair", "Achievement"],
  };

  const samplePostsData = [
    {
      id: 1,
      category: "academic",
      hashtags: ["ScienceFair", "Achievement", "Grade9"],
      title: "Science Fair Winners",
      content: "Congratulations to our science fair winners!",
    },
    {
      id: 2,
      category: "sports",
      hashtags: ["Football", "Victory", "TeamSpirit"],
      title: "Football Team Victory",
      content: "Our football team won the championship!",
    },
    {
      id: 3,
      category: "announcement",
      hashtags: ["Exam", "MathTest"],
      title: "Math Test Schedule",
      content: "Math test scheduled for next week.",
    },
  ];

  const addTestResult = (testName, result, details = "") => {
    const newResult = {
      id: Date.now() + Math.random(),
      testName,
      result,
      details,
      timestamp: new Date().toLocaleTimeString(),
    };
    setTestResults((prev) => [newResult, ...prev]);
  };

  // Test 1: Filter Transformation
  const testFilterTransformation = () => {
    try {
      const transformed = transformFiltersForAPI(sampleFilterBarFilters);

      const expected = {
        search: "science fair",
        dateFrom: "2024-01-01",
        dateTo: "2024-12-31",
        category: "academic",
        hashtags: ["ScienceFair", "Achievement"],
        searchFilterList: [],
      };

      const isCorrect =
        transformed.search === expected.search &&
        transformed.dateFrom === expected.dateFrom &&
        transformed.dateTo === expected.dateTo &&
        transformed.category === expected.category &&
        JSON.stringify(transformed.hashtags) ===
          JSON.stringify(expected.hashtags);

      addTestResult(
        "Filter Transformation",
        isCorrect ? "✅ PASS" : "❌ FAIL",
        `Expected: ${JSON.stringify(expected, null, 2)}\nActual: ${JSON.stringify(transformed, null, 2)}`,
      );
    } catch (error) {
      addTestResult("Filter Transformation", "❌ ERROR", error.message);
    }
  };

  // Test 2: Category Extraction
  const testCategoryExtraction = () => {
    try {
      const categories = extractCategoriesFromPosts(samplePostsData);

      const expectedCategories = ["academic", "sports", "announcement"];
      const extractedValues = categories.map((cat) => cat.value);

      const isCorrect = expectedCategories.every((cat) =>
        extractedValues.includes(cat),
      );

      addTestResult(
        "Category Extraction",
        isCorrect ? "✅ PASS" : "❌ FAIL",
        `Expected categories: ${expectedCategories.join(", ")}\nExtracted: ${extractedValues.join(", ")}`,
      );
    } catch (error) {
      addTestResult("Category Extraction", "❌ ERROR", error.message);
    }
  };

  // Test 3: Hashtag Extraction
  const testHashtagExtraction = () => {
    try {
      const hashtags = extractHashtagsFromPosts(samplePostsData);

      const expectedHashtags = [
        "sciencefair",
        "achievement",
        "grade9",
        "football",
        "victory",
        "teamspirit",
        "exam",
        "mathtest",
      ];
      const extractedValues = hashtags.map((tag) => tag.value);

      const isCorrect = expectedHashtags.every((tag) =>
        extractedValues.includes(tag),
      );

      addTestResult(
        "Hashtag Extraction",
        isCorrect ? "✅ PASS" : "❌ FAIL",
        `Expected hashtags: ${expectedHashtags.join(", ")}\nExtracted: ${extractedValues.join(", ")}`,
      );
    } catch (error) {
      addTestResult("Hashtag Extraction", "❌ ERROR", error.message);
    }
  };

  // Test 4: Edge Cases
  const testEdgeCases = () => {
    try {
      // Test with "all" category
      const allCategoryFilter = { ...sampleFilterBarFilters, category: "all" };
      const transformed = transformFiltersForAPI(allCategoryFilter);

      const isAllCategoryCorrect = transformed.category === "";

      // Test with empty date range
      const emptyDateFilter = {
        ...sampleFilterBarFilters,
        dateRange: { start: null, end: null },
      };
      const transformedEmpty = transformFiltersForAPI(emptyDateFilter);

      const isEmptyDateCorrect =
        transformedEmpty.dateFrom === "" && transformedEmpty.dateTo === "";

      const overallResult = isAllCategoryCorrect && isEmptyDateCorrect;

      addTestResult(
        "Edge Cases",
        overallResult ? "✅ PASS" : "❌ FAIL",
        `All category -> empty string: ${isAllCategoryCorrect}\nEmpty dates -> empty strings: ${isEmptyDateCorrect}`,
      );
    } catch (error) {
      addTestResult("Edge Cases", "❌ ERROR", error.message);
    }
  };

  // Test 5: Real Redux Data
  const testRealReduxData = () => {
    try {
      if (schoolPosts && schoolPosts.length > 0) {
        const categories = extractCategoriesFromPosts(schoolPosts);
        const hashtags = extractHashtagsFromPosts(schoolPosts);

        addTestResult(
          "Real Redux Data",
          "✅ PASS",
          `Found ${categories.length} categories and ${hashtags.length} hashtags from ${schoolPosts.length} posts`,
        );
      } else {
        addTestResult(
          "Real Redux Data",
          "⚠️ NO DATA",
          "No posts found in Redux state. Load some posts first.",
        );
      }
    } catch (error) {
      addTestResult("Real Redux Data", "❌ ERROR", error.message);
    }
  };

  const runAllTests = () => {
    setTestResults([]);
    setTimeout(() => testFilterTransformation(), 100);
    setTimeout(() => testCategoryExtraction(), 200);
    setTimeout(() => testHashtagExtraction(), 300);
    setTimeout(() => testEdgeCases(), 400);
    setTimeout(() => testRealReduxData(), 500);
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🧪 Filter Integration Test</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.runButton} onPress={runAllTests}>
          <Text style={styles.buttonText}>Run All Tests</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.clearButton} onPress={clearResults}>
          <Text style={styles.buttonText}>Clear Results</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.resultsContainer}>
        {testResults.map((result) => (
          <View key={result.id} style={styles.resultItem}>
            <View style={styles.resultHeader}>
              <Text style={styles.testName}>{result.testName}</Text>
              <Text style={styles.result}>{result.result}</Text>
              <Text style={styles.timestamp}>{result.timestamp}</Text>
            </View>
            {result.details && (
              <Text style={styles.details}>{result.details}</Text>
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  runButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  clearButton: {
    backgroundColor: "#FF3B30",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  resultsContainer: {
    flex: 1,
  },
  resultItem: {
    backgroundColor: "white",
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  resultHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  testName: {
    fontSize: 16,
    fontWeight: "bold",
    flex: 1,
    color: "#333",
  },
  result: {
    fontSize: 14,
    fontWeight: "bold",
    marginHorizontal: 10,
  },
  timestamp: {
    fontSize: 12,
    color: "#666",
  },
  details: {
    fontSize: 12,
    color: "#666",
    fontFamily: "monospace",
    backgroundColor: "#f8f8f8",
    padding: 8,
    borderRadius: 4,
    marginTop: 5,
  },
});

export default FilterIntegrationTest;
