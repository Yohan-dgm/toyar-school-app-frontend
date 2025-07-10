import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

// Import API hooks and slice actions
import { useLazyGetSchoolPostsQuery } from "../../api/activity-feed-api";
import {
  setLoading,
  setRefreshing,
  setPosts,
  setError,
  setFilters,
  clearFilters,
} from "../../state-store/slices/school-life/school-posts-slice";

const ActivityFeedAPITest = () => {
  const dispatch = useDispatch();
  const [testResults, setTestResults] = useState([]);
  const logIdCounter = useRef(0); // Counter for unique log IDs

  // Redux state
  const { posts, loading, refreshing, pagination, error, filters } =
    useSelector((state) => state.schoolPosts);

  // API hook
  const [getSchoolPosts, { isLoading: apiLoading, error: apiError }] =
    useLazyGetSchoolPostsQuery();

  // Add log entry
  const addLog = (message, type = "info", data = null) => {
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = {
      id: `log-${++logIdCounter.current}`, // Unique sequential ID
      timestamp,
      message,
      type, // info, success, error, warning
      data,
    };

    setTestResults((prev) => [logEntry, ...prev]);

    // Also log to console for debugging
    console.log(`[${timestamp}] ${type.toUpperCase()}: ${message}`, data || "");
  };

  // Test basic API call
  const testBasicAPICall = async () => {
    addLog("🚀 Starting basic API test...", "info");
    dispatch(setLoading(true));

    const requestParams = {
      page: 1,
      limit: 10,
      filters: {},
    };

    try {
      addLog(
        "📡 Calling API: api/activity-feed-management/school-posts/list",
        "info"
      );
      addLog("📤 Request parameters:", "info", requestParams);

      const response = await getSchoolPosts(requestParams).unwrap();

      addLog("✅ API call successful!", "success", response);

      if (response.status === "successful") {
        dispatch(
          setPosts({
            posts: response.data || [],
            pagination: response.pagination || null,
            append: false,
          })
        );
        addLog(
          `📊 Posts loaded: ${response.data?.length || 0} posts`,
          "success"
        );
        addLog("📄 Pagination info:", "info", response.pagination);
      } else {
        addLog("⚠️ API returned unsuccessful status", "warning", response);
        dispatch(
          setError(response.message || "API returned unsuccessful response")
        );
      }
    } catch (error) {
      addLog("❌ API call failed", "error", {
        message: error.message,
        status: error.status,
        data: error.data,
      });
      dispatch(setError(error.message || "Network error occurred"));
    } finally {
      dispatch(setLoading(false));
    }
  };

  // Test with filters
  const testWithFilters = async () => {
    addLog("🔍 Testing API with filters...", "info");
    dispatch(setLoading(true));

    const testFilters = {
      search: "test", // Will be mapped to search_phrase in API
      category: "announcement",
      date_from: "2024-01-01",
      date_to: "2024-12-31",
    };

    const requestParams = {
      page: 1,
      limit: 5,
      filters: testFilters,
    };

    try {
      addLog("📡 Calling API with filters:", "info", testFilters);
      addLog("📤 Full request parameters:", "info", requestParams);

      const response = await getSchoolPosts(requestParams).unwrap();

      addLog("✅ Filtered API call successful!", "success", response);

      if (response.status === "successful") {
        dispatch(
          setPosts({
            posts: response.data || [],
            pagination: response.pagination || null,
            append: false,
          })
        );
        dispatch(setFilters(testFilters));
        addLog(
          `📊 Filtered posts loaded: ${response.data?.length || 0} posts`,
          "success"
        );
      }
    } catch (error) {
      addLog("❌ Filtered API call failed", "error", error);
      dispatch(setError(error.message || "Network error occurred"));
    } finally {
      dispatch(setLoading(false));
    }
  };

  // Test pagination
  const testPagination = async () => {
    addLog("📄 Testing pagination (page 2)...", "info");
    dispatch(setLoading(true));

    try {
      const response = await getSchoolPosts({
        page: 2,
        limit: 10,
        filters: {},
      }).unwrap();

      addLog("✅ Pagination test successful!", "success", response);

      if (response.status === "successful") {
        dispatch(
          setPosts({
            posts: response.data || [],
            pagination: response.pagination || null,
            append: true, // Append for pagination
          })
        );
        addLog(
          `📊 Page 2 posts loaded: ${response.data?.length || 0} posts`,
          "success"
        );
      }
    } catch (error) {
      addLog("❌ Pagination test failed", "error", error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  // Clear logs
  const clearLogs = () => {
    setTestResults([]);
    addLog("🧹 Logs cleared", "info");
  };

  // Clear Redux state
  const clearReduxState = () => {
    dispatch(setPosts({ posts: [], pagination: null, append: false }));
    dispatch(setError(null));
    dispatch(clearFilters());
    addLog("🗑️ Redux state cleared", "info");
  };

  // Get log color based on type
  const getLogColor = (type) => {
    switch (type) {
      case "success":
        return "#4CAF50";
      case "error":
        return "#F44336";
      case "warning":
        return "#FF9800";
      default:
        return "#2196F3";
    }
  };

  // Component mount log
  useEffect(() => {
    addLog("🎯 Activity Feed API Test Component mounted", "info");
    addLog(
      "🔗 API Endpoint: api/activity-feed-management/school-posts/list",
      "info"
    );
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Activity Feed API Test</Text>

      {/* Test Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.primaryButton]}
          onPress={testBasicAPICall}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Testing..." : "Test Basic API"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={testWithFilters}
          disabled={loading}
        >
          <Text style={styles.buttonText}>Test with Filters</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={testPagination}
          disabled={loading}
        >
          <Text style={styles.buttonText}>Test Pagination</Text>
        </TouchableOpacity>
      </View>

      {/* State Info */}
      <View style={styles.stateContainer}>
        <Text style={styles.stateTitle}>Redux State:</Text>
        <Text style={styles.stateText}>Posts: {posts.length}</Text>
        <Text style={styles.stateText}>Loading: {loading.toString()}</Text>
        <Text style={styles.stateText}>Error: {error || "None"}</Text>
        <Text style={styles.stateText}>
          Pagination:{" "}
          {pagination
            ? `Page ${pagination.current_page}/${pagination.last_page}`
            : "None"}
        </Text>
      </View>

      {/* Control Buttons */}
      <View style={styles.controlContainer}>
        <TouchableOpacity
          style={[styles.button, styles.warningButton]}
          onPress={clearLogs}
        >
          <Text style={styles.buttonText}>Clear Logs</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.dangerButton]}
          onPress={clearReduxState}
        >
          <Text style={styles.buttonText}>Clear State</Text>
        </TouchableOpacity>
      </View>

      {/* Test Results Log */}
      <Text style={styles.logTitle}>Test Results Log:</Text>
      <ScrollView
        style={styles.logContainer}
        showsVerticalScrollIndicator={false}
      >
        {testResults.map((log) => (
          <View key={log.id} style={styles.logEntry}>
            <View style={styles.logHeader}>
              <Text
                style={[styles.logTimestamp, { color: getLogColor(log.type) }]}
              >
                [{log.timestamp}] {log.type.toUpperCase()}
              </Text>
            </View>
            <Text style={styles.logMessage}>{log.message}</Text>
            {log.data && (
              <Text style={styles.logData}>
                {typeof log.data === "object"
                  ? JSON.stringify(log.data, null, 2)
                  : log.data}
              </Text>
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
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  controlContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  button: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 10,
    minWidth: "48%",
    alignItems: "center",
  },
  primaryButton: {
    backgroundColor: "#2196F3",
  },
  secondaryButton: {
    backgroundColor: "#4CAF50",
  },
  warningButton: {
    backgroundColor: "#FF9800",
  },
  dangerButton: {
    backgroundColor: "#F44336",
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
  },
  stateContainer: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  stateTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  stateText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  logTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  logContainer: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 8,
    padding: 10,
  },
  logEntry: {
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingVertical: 10,
  },
  logHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  logTimestamp: {
    fontSize: 12,
    fontWeight: "600",
  },
  logMessage: {
    fontSize: 14,
    color: "#333",
    marginBottom: 5,
  },
  logData: {
    fontSize: 12,
    color: "#666",
    backgroundColor: "#f8f8f8",
    padding: 8,
    borderRadius: 4,
    fontFamily: "monospace",
  },
});

export default ActivityFeedAPITest;
