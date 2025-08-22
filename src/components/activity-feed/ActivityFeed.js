import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import NetInfo from "@react-native-community/netinfo";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useSelector } from "react-redux";
import { theme } from "../../styles/theme";
import { USER_CATEGORIES } from "../../constants/userCategories";
import PremiumTabNavigation from "../common/PremiumTabNavigation";

// Import tab components
import SchoolTabWithAPI from "./tabs/SchoolTabWithAPI";
import ClassTabWithAPI from "./tabs/ClassTabWithAPI";
import StudentTabWithAPI from "./tabs/StudentTabWithAPI";
import FilterBar from "./FilterBar";

const ActivityFeed = ({ userCategory = USER_CATEGORIES.PARENT }) => {
  const [isConnected, setIsConnected] = useState(true);
  const [activeTab, setActiveTab] = useState("School");
  const [filtersState, setFiltersState] = useState({
    searchTerm: "",
    dateRange: { start: null, end: null },
    category: "all",
    hashtags: [],
  });

  // Get posts data from Redux for dynamic filtering
  const { posts: schoolPosts, allPosts: schoolAllPosts } = useSelector(
    (state) => state.schoolPosts,
  );
  const { posts: classPosts } = useSelector((state) => state.classPosts);
  const { posts: studentPosts } = useSelector((state) => state.studentPosts);

  // Use filters directly without memoization to test
  const filters = filtersState;

  // Debug filter changes
  useEffect(() => {
    console.log("🎯 ActivityFeed: Filters updated:", filters);
  }, [filters]);

  // Get current tab's posts data for dynamic filtering
  const getCurrentTabPosts = () => {
    switch (activeTab) {
      case "School":
        return schoolPosts || [];
      case "Class":
        return classPosts || [];
      case "Student":
        return studentPosts || [];
      default:
        return [];
    }
  };

  // Get all posts (unfiltered) for filter options
  const getAllPostsForFilters = () => {
    switch (activeTab) {
      case "School":
        return schoolAllPosts || [];
      case "Class":
        return classPosts || []; // TODO: Add allPosts for class and student tabs
      case "Student":
        return studentPosts || [];
      default:
        return [];
    }
  };

  const currentTabPosts = getCurrentTabPosts();
  const allPostsForFilters = getAllPostsForFilters();

  // Check internet connectivity
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
      if (!state.isConnected) {
        Alert.alert(
          "No Internet Connection",
          "Please check your internet connection and try again.",
          [{ text: "OK" }],
        );
      }
    });

    return () => unsubscribe();
  }, []);

  // Tabs are now handled by PremiumTabNavigation component
  // No need for getVisibleTabs() as it's built into the component

  // Handle filter changes
  const handleFilterChange = (newFilters) => {
    console.log("🔄 ActivityFeed: Filter change requested:", newFilters);
    setFiltersState(newFilters);
  };

  // Clear all filters
  const clearFilters = () => {
    setFiltersState({
      searchTerm: "",
      dateRange: { start: null, end: null },
      category: "all",
      hashtags: [],
    });
  };

  // Render the active tab content with conditional rendering to prevent key conflicts

  return (
    <View style={styles.container}>
      {/* Premium Tab Navigation */}
      <PremiumTabNavigation
        activeTab={activeTab}
        onTabPress={setActiveTab}
        userCategory={userCategory}
      />

      {/* Filter Bar */}
      <FilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={clearFilters}
        postsData={allPostsForFilters}
      />

      {/* Tab Content */}
      <View style={styles.tabContent}>
        {activeTab === "School" && (
          <SchoolTabWithAPI
            userCategory={userCategory}
            isConnected={isConnected}
            filters={filters}
          />
        )}
        {activeTab === "Class" && (
          <ClassTabWithAPI
            userCategory={userCategory}
            isConnected={isConnected}
            filters={filters}
          />
        )}
        {activeTab === "Student" && userCategory === USER_CATEGORIES.PARENT && (
          <StudentTabWithAPI
            userCategory={userCategory}
            isConnected={isConnected}
            filters={filters}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  tabContent: {
    flex: 1,
  },
});

export default ActivityFeed;
