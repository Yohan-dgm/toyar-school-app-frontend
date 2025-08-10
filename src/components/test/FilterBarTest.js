import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import FilterBar from "../activity-feed/FilterBar";

const FilterBarTest = () => {
  const [filters, setFilters] = useState({
    searchTerm: "",
    dateRange: { start: null, end: null },
    category: "all",
    hashtags: [],
  });

  // Sample posts data for testing
  const samplePosts = [
    {
      id: 1,
      title: "Science Fair Results",
      category: "academic",
      hashtags: ["ScienceFair", "Achievement"],
      created_at: "2024-01-15",
    },
    {
      id: 2,
      title: "Football Victory",
      category: "sports",
      hashtags: ["Football", "Victory"],
      created_at: "2024-01-20",
    },
    {
      id: 3,
      title: "School Announcement",
      category: "announcement",
      hashtags: ["Important", "School"],
      created_at: "2024-01-25",
    },
  ];

  const handleFilterChange = (newFilters) => {
    console.log("🔄 Filter changed:", newFilters);
    setFilters(newFilters);
  };

  const clearFilters = () => {
    console.log("🧹 Clearing all filters");
    setFilters({
      searchTerm: "",
      dateRange: { start: null, end: null },
      category: "all",
      hashtags: [],
    });
  };

  const testDateRangeFilter = () => {
    const testFilters = {
      ...filters,
      dateRange: {
        start: new Date("2024-01-01").toISOString(),
        end: new Date("2024-01-31").toISOString(),
      },
    };
    setFilters(testFilters);
    Alert.alert("Test", "Date range filter applied programmatically");
  };

  const testCategoryFilter = () => {
    const testFilters = {
      ...filters,
      category: "academic",
    };
    setFilters(testFilters);
    Alert.alert("Test", "Academic category filter applied");
  };

  const testHashtagFilter = () => {
    const testFilters = {
      ...filters,
      hashtags: ["ScienceFair", "Achievement"],
    };
    setFilters(testFilters);
    Alert.alert("Test", "Hashtag filters applied");
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not set";
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🧪 FilterBar Test</Text>

      {/* FilterBar Component */}
      <FilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={clearFilters}
        postsData={samplePosts}
      />

      {/* Test Buttons */}
      <View style={styles.testSection}>
        <Text style={styles.sectionTitle}>Quick Tests</Text>
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.testButton}
            onPress={testDateRangeFilter}
          >
            <Text style={styles.buttonText}>Test Date Range</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.testButton}
            onPress={testCategoryFilter}
          >
            <Text style={styles.buttonText}>Test Category</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.testButton}
            onPress={testHashtagFilter}
          >
            <Text style={styles.buttonText}>Test Hashtags</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Current Filter State Display */}
      <View style={styles.stateSection}>
        <Text style={styles.sectionTitle}>Current Filter State</Text>
        <ScrollView style={styles.stateDisplay}>
          <Text style={styles.stateText}>
            Search Term: "{filters.searchTerm || "None"}"
          </Text>
          <Text style={styles.stateText}>
            Date Range: {formatDate(filters.dateRange.start)} -{" "}
            {formatDate(filters.dateRange.end)}
          </Text>
          <Text style={styles.stateText}>Category: {filters.category}</Text>
          <Text style={styles.stateText}>
            Hashtags:{" "}
            {filters.hashtags.length > 0 ? filters.hashtags.join(", ") : "None"}
          </Text>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    paddingVertical: 16,
    backgroundColor: "#F8F9FA",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  testSection: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
    color: "#1C1C1E",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  testButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
  },
  stateSection: {
    padding: 16,
    flex: 1,
  },
  stateDisplay: {
    backgroundColor: "#F8F9FA",
    borderRadius: 8,
    padding: 12,
    maxHeight: 200,
  },
  stateText: {
    fontSize: 14,
    color: "#1C1C1E",
    marginBottom: 8,
    fontFamily: "monospace",
  },
});

export default FilterBarTest;
