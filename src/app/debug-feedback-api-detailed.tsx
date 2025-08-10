import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { useGetFeedbackListQuery } from "../api/educator-feedback-api";

const DebugFeedbackApiDetailed: React.FC = () => {
  const [testResults, setTestResults] = useState<any[]>([]);

  // Get authentication state from Redux
  const authState = useSelector((state: any) => ({
    token: state.app?.token,
    isAuthenticated: state.app?.isAuthenticated,
    user: state.app?.user,
  }));

  // Test the API call
  const {
    data: feedbackResponse,
    isLoading,
    error,
    refetch,
    isFetching,
  } = useGetFeedbackListQuery({
    page: 1,
    page_size: 5,
    search_phrase: "",
    search_filter_list: [],
  });

  const addTestResult = (title: string, data: any) => {
    const result = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      title,
      data,
    };
    setTestResults((prev) => [result, ...prev]);
  };

  useEffect(() => {
    addTestResult("Component Mounted", {
      authState,
      apiState: {
        isLoading,
        isFetching,
        hasError: !!error,
        hasData: !!feedbackResponse,
      },
    });
  }, []);

  useEffect(() => {
    if (feedbackResponse) {
      addTestResult("API Response Received", feedbackResponse);
    }
  }, [feedbackResponse]);

  useEffect(() => {
    if (error) {
      addTestResult("API Error Received", error);
    }
  }, [error]);

  const handleManualTest = async () => {
    addTestResult("Manual Test Started", {
      timestamp: new Date().toISOString(),
    });

    try {
      const result = await refetch();
      addTestResult("Manual Refetch Result", result);
    } catch (error) {
      addTestResult("Manual Refetch Error", error);
    }
  };

  const handleDirectApiTest = async () => {
    const baseUrl = process.env.EXPO_PUBLIC_BASE_URL_API_SERVER_1;
    const endpoint = "/api/educator-feedback-management/feedback/list";
    const fullUrl = `${baseUrl}${endpoint}`;

    addTestResult("Direct API Test Started", {
      url: fullUrl,
      method: "POST",
      hasToken: !!authState.token,
    });

    try {
      const response = await fetch(fullUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-Requested-With": "XMLHttpRequest",
          ...(authState.token && {
            Authorization: `Bearer ${authState.token}`,
          }),
        },
        body: JSON.stringify({
          page_size: 5,
          page: 1,
          search_phrase: "",
          search_filter_list: [],
        }),
      });

      const responseText = await response.text();
      let responseData;
      try {
        responseData = JSON.parse(responseText);
      } catch {
        responseData = responseText;
      }

      addTestResult("Direct API Test Result", {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        headers: Object.fromEntries(response.headers.entries()),
        data: responseData,
      });
    } catch (error) {
      addTestResult("Direct API Test Error", error);
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.title}>Feedback API Debug Console</Text>

        {/* Authentication Status */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Authentication Status</Text>
          <Text style={styles.infoText}>
            🔐 Authenticated: {authState.isAuthenticated ? "✅ Yes" : "❌ No"}
          </Text>
          <Text style={styles.infoText}>
            🎫 Token: {authState.token ? "✅ Present" : "❌ Missing"}
          </Text>
          <Text style={styles.infoText}>
            👤 User: {authState.user?.user_category_name || "Unknown"}
          </Text>
        </View>

        {/* API State */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Current API State</Text>
          <Text style={styles.infoText}>
            ⏳ Loading: {isLoading ? "✅ Yes" : "❌ No"}
          </Text>
          <Text style={styles.infoText}>
            🔄 Fetching: {isFetching ? "✅ Yes" : "❌ No"}
          </Text>
          <Text style={styles.infoText}>
            ❌ Error: {error ? "✅ Yes" : "❌ No"}
          </Text>
          <Text style={styles.infoText}>
            📊 Data: {feedbackResponse ? "✅ Present" : "❌ Missing"}
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Test Actions</Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.button} onPress={handleManualTest}>
              <MaterialIcons name="refresh" size={16} color="#FFFFFF" />
              <Text style={styles.buttonText}>Manual Refetch</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={handleDirectApiTest}
            >
              <MaterialIcons name="bug-report" size={16} color="#FFFFFF" />
              <Text style={styles.buttonText}>Direct API Test</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.clearButton} onPress={clearResults}>
            <MaterialIcons name="clear" size={16} color="#F44336" />
            <Text style={styles.clearButtonText}>Clear Results</Text>
          </TouchableOpacity>
        </View>

        {/* Test Results */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Test Results ({testResults.length})
          </Text>
          {testResults.map((result) => (
            <View key={result.id} style={styles.resultItem}>
              <Text style={styles.resultTitle}>{result.title}</Text>
              <Text style={styles.resultTimestamp}>{result.timestamp}</Text>
              <Text style={styles.resultData}>
                {JSON.stringify(result.data, null, 2)}
              </Text>
            </View>
          ))}
          {testResults.length === 0 && (
            <Text style={styles.noResults}>
              No test results yet. Try running a test!
            </Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  section: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#920734",
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: "#333",
    marginBottom: 4,
    fontFamily: "monospace",
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  button: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#920734",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  clearButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF0F0",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#F44336",
    gap: 8,
  },
  clearButtonText: {
    color: "#F44336",
    fontSize: 14,
    fontWeight: "600",
  },
  resultItem: {
    backgroundColor: "#F8F9FA",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  resultTimestamp: {
    fontSize: 12,
    color: "#666",
    marginBottom: 8,
  },
  resultData: {
    fontSize: 12,
    color: "#333",
    fontFamily: "monospace",
    backgroundColor: "#FFFFFF",
    padding: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  noResults: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    fontStyle: "italic",
    padding: 20,
  },
});

export default DebugFeedbackApiDetailed;
