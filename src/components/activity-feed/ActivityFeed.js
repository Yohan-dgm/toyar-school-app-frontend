import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import NetInfo from "@react-native-community/netinfo";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useSelector } from "react-redux";
import { theme } from "../../styles/theme";
import { USER_CATEGORIES } from "../../constants/userCategories";

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
    (state) => state.schoolPosts
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
          [{ text: "OK" }]
        );
      }
    });

    return () => unsubscribe();
  }, []);

  // Determine which tabs to show based on user category
  const getVisibleTabs = () => {
    const tabs = [
      {
        name: "School",
        component: SchoolTabWithAPI,
        icon: "school",
        label: "School",
      },
      {
        name: "Class",
        component: ClassTabWithAPI,
        icon: "category",
        label: "Class",
      },
    ];

    // Only parents can see the Student tab
    if (userCategory === USER_CATEGORIES.PARENT) {
      tabs.push({
        name: "Student",
        component: StudentTabWithAPI,
        icon: "face",
        label: "Student",
      });
    }

    return tabs;
  };

  const visibleTabs = getVisibleTabs();

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
      {/* Custom Tab Bar */}
      <View style={styles.tabBar}>
        {visibleTabs.map((tab) => (
          <TouchableOpacity
            key={tab.name}
            style={[
              styles.tabButton,
              activeTab === tab.name && styles.activeTabButton,
            ]}
            onPress={() => setActiveTab(tab.name)}
          >
            <Icon
              name={tab.icon}
              size={18}
              color={activeTab === tab.name ? theme.colors.primary : "#8E8E93"}
            />
            <Text
              style={[
                styles.tabLabel,
                activeTab === tab.name && styles.activeTabLabel,
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

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
  tabBar: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 0.5,
    borderBottomColor: "#E5E5EA",
    paddingVertical: 3,
    paddingHorizontal: 12,
    marginTop: 0,
    marginBottom: 0,
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
  activeTabButton: {
    backgroundColor: "rgba(146, 7, 52, 0.08)",
    borderRadius: 6,
    marginHorizontal: 2,
    marginTop: 0,
    marginBottom: 0,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: "500",
    color: "#8E8E93",
    marginTop: 0,
    marginBottom: 0,
    textAlign: "center",
  },
  activeTabLabel: {
    color: theme.colors.primary,
    fontWeight: "600",
  },
  tabContent: {
    flex: 1,
  },
});

export default ActivityFeed;
