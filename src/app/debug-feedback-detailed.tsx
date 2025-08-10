import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  useGetFeedbackListQuery,
  useGetEducatorFeedbacksQuery,
} from "../api/educator-feedback-api";

const DebugFeedbackDetailed: React.FC = () => {
  const [debugMode, setDebugMode] = useState(true);

  // Test getFeedbackList
  const {
    data: feedbackListData,
    isLoading: feedbackListLoading,
    error: feedbackListError,
    refetch: refetchFeedbackList,
  } = useGetFeedbackListQuery({
    page: 1,
    page_size: 10,
    search_phrase: "",
    search_filter_list: [],
  });

  // Test getEducatorFeedbacks
  const {
    data: educatorFeedbacksData,
    isLoading: educatorFeedbacksLoading,
    error: educatorFeedbacksError,
    refetch: refetchEducatorFeedbacks,
  } = useGetEducatorFeedbacksQuery({
    page: 1,
    page_size: 10,
    filters: {
      search: "",
      search_filter_list: [],
    },
  });

  useEffect(() => {
    console.log("🚀 DEBUG FEEDBACK DETAILED - Component Mounted");
    console.log("🌐 Environment Variables:", {
      baseUrl: process.env.EXPO_PUBLIC_BASE_URL_API_SERVER_1,
      fullEndpoint: `${process.env.EXPO_PUBLIC_BASE_URL_API_SERVER_1}/api/educator-feedback-management/feedback/list`,
    });
  }, []);

  // Enhanced logging for getFeedbackList
  useEffect(() => {
    console.log("📊 getFeedbackList DETAILED ANALYSIS:", {
      timestamp: new Date().toISOString(),
      isLoading: feedbackListLoading,
      hasError: !!feedbackListError,
      hasData: !!feedbackListData,
      error: feedbackListError,
      rawResponse: feedbackListData,
    });

    if (feedbackListData) {
      console.log("🔍 getFeedbackList DATA STRUCTURE:", {
        responseKeys: Object.keys(feedbackListData),
        dataProperty: feedbackListData.data,
        dataKeys: feedbackListData.data
          ? Object.keys(feedbackListData.data)
          : null,
        dataArrayLength: feedbackListData.data?.data?.length || 0,
        firstFeedback: feedbackListData.data?.data?.[0],
        subcategoriesAnalysis:
          feedbackListData.data?.data
            ?.map((feedback: any, index: number) => {
              if (index < 3) {
                // Only log first 3 for performance
                return {
                  feedbackId: feedback.id,
                  studentName: feedback.student?.full_name,
                  hasSubcategories: !!feedback.subcategories,
                  subcategoriesCount: feedback.subcategories?.length || 0,
                  subcategoriesData: feedback.subcategories,
                  allFeedbackKeys: Object.keys(feedback),
                };
              }
              return null;
            })
            .filter(Boolean) || [],
      });
    }
  }, [feedbackListData, feedbackListLoading, feedbackListError]);

  // Enhanced logging for getEducatorFeedbacks
  useEffect(() => {
    console.log("📊 getEducatorFeedbacks DETAILED ANALYSIS:", {
      timestamp: new Date().toISOString(),
      isLoading: educatorFeedbacksLoading,
      hasError: !!educatorFeedbacksError,
      hasData: !!educatorFeedbacksData,
      error: educatorFeedbacksError,
      rawResponse: educatorFeedbacksData,
    });

    if (educatorFeedbacksData) {
      console.log("🔍 getEducatorFeedbacks DATA STRUCTURE:", {
        responseKeys: Object.keys(educatorFeedbacksData),
        dataProperty: educatorFeedbacksData.data,
        dataKeys: educatorFeedbacksData.data
          ? Object.keys(educatorFeedbacksData.data)
          : null,
        feedbacksArrayLength:
          educatorFeedbacksData.data?.feedbacks?.length || 0,
        firstFeedback: educatorFeedbacksData.data?.feedbacks?.[0],
        subcategoriesAnalysis:
          educatorFeedbacksData.data?.feedbacks
            ?.map((feedback: any, index: number) => {
              if (index < 3) {
                // Only log first 3 for performance
                return {
                  feedbackId: feedback.id,
                  studentName: feedback.student?.full_name,
                  hasSubcategories: !!feedback.subcategories,
                  subcategoriesCount: feedback.subcategories?.length || 0,
                  subcategoriesData: feedback.subcategories,
                  allFeedbackKeys: Object.keys(feedback),
                };
              }
              return null;
            })
            .filter(Boolean) || [],
      });
    }
  }, [educatorFeedbacksData, educatorFeedbacksLoading, educatorFeedbacksError]);

  const renderDebugSection = (
    title: string,
    data: any,
    loading: boolean,
    error: any,
  ) => {
    const feedbacks = data?.data?.data || data?.data?.feedbacks || [];

    return (
      <View style={styles.debugSection}>
        <Text style={styles.debugTitle}>{title}</Text>

        <View style={styles.statusGrid}>
          <View style={styles.statusItem}>
            <Text style={styles.statusLabel}>Loading:</Text>
            <Text
              style={[
                styles.statusValue,
                { color: loading ? "#FF9800" : "#4CAF50" },
              ]}
            >
              {loading ? "YES" : "NO"}
            </Text>
          </View>
          <View style={styles.statusItem}>
            <Text style={styles.statusLabel}>Error:</Text>
            <Text
              style={[
                styles.statusValue,
                { color: error ? "#F44336" : "#4CAF50" },
              ]}
            >
              {error ? "YES" : "NO"}
            </Text>
          </View>
          <View style={styles.statusItem}>
            <Text style={styles.statusLabel}>Data:</Text>
            <Text
              style={[
                styles.statusValue,
                { color: data ? "#4CAF50" : "#F44336" },
              ]}
            >
              {data ? "RECEIVED" : "NONE"}
            </Text>
          </View>
          <View style={styles.statusItem}>
            <Text style={styles.statusLabel}>Feedbacks Count:</Text>
            <Text style={styles.statusValue}>{feedbacks.length}</Text>
          </View>
        </View>

        {error && (
          <View style={styles.errorSection}>
            <Text style={styles.errorTitle}>❌ Error Details:</Text>
            <Text style={styles.errorText}>
              {JSON.stringify(error, null, 2)}
            </Text>
          </View>
        )}

        {data && feedbacks.length > 0 && (
          <View style={styles.feedbacksSection}>
            <Text style={styles.feedbacksTitle}>📋 Feedbacks Summary:</Text>
            {feedbacks.slice(0, 3).map((feedback: any, index: number) => (
              <View key={feedback.id || index} style={styles.feedbackItem}>
                <Text style={styles.feedbackId}>ID: {feedback.id}</Text>
                <Text style={styles.feedbackStudent}>
                  Student: {feedback.student?.full_name || "Unknown"}
                </Text>
                <Text style={styles.feedbackAdmission}>
                  Admission: {feedback.student?.admission_number || "N/A"}
                </Text>
                <Text style={styles.feedbackSubcategories}>
                  🏷️ Subcategories: {feedback.subcategories?.length || 0}
                </Text>
                {feedback.subcategories?.map((sub: any, subIndex: number) => (
                  <Text key={subIndex} style={styles.subcategoryDetail}>
                    • {sub.name || sub.subcategory_name || "Unnamed"} (ID:{" "}
                    {sub.id})
                  </Text>
                ))}
                {(!feedback.subcategories ||
                  feedback.subcategories.length === 0) && (
                  <Text style={styles.noSubcategories}>
                    ❌ No subcategories found
                  </Text>
                )}
              </View>
            ))}
            {feedbacks.length > 3 && (
              <Text style={styles.moreItems}>
                ... and {feedbacks.length - 3} more items
              </Text>
            )}
          </View>
        )}

        {data && feedbacks.length === 0 && (
          <View style={styles.emptySection}>
            <Text style={styles.emptyTitle}>📭 No Feedbacks Found</Text>
            <Text style={styles.emptyText}>
              The API returned data but no feedback items were found.
            </Text>
          </View>
        )}
      </View>
    );
  };

  const handleShowAlert = (title: string, message: string) => {
    Alert.alert(title, message, [{ text: "OK" }]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🔧 Detailed Feedback Debug</Text>
        <Text style={styles.subtitle}>
          Comprehensive analysis of feedback API responses and data structure
        </Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {renderDebugSection(
          "getFeedbackList API",
          feedbackListData,
          feedbackListLoading,
          feedbackListError,
        )}

        {renderDebugSection(
          "getEducatorFeedbacks API",
          educatorFeedbacksData,
          educatorFeedbacksLoading,
          educatorFeedbacksError,
        )}

        <View style={styles.actionsSection}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              refetchFeedbackList();
              refetchEducatorFeedbacks();
            }}
          >
            <Text style={styles.actionButtonText}>🔄 Refresh Both APIs</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() =>
              handleShowAlert(
                "Environment Info",
                `Base URL: ${process.env.EXPO_PUBLIC_BASE_URL_API_SERVER_1}\nEndpoint: /api/educator-feedback-management/feedback/list`,
              )
            }
          >
            <Text style={styles.actionButtonText}>🌐 Show Environment</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() =>
              handleShowAlert(
                "Console Logs",
                "Check the console for detailed API logs with 📊 and 🔍 prefixes",
              )
            }
          >
            <Text style={styles.actionButtonText}>📋 Console Instructions</Text>
          </TouchableOpacity>
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
  header: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#333",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  debugSection: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  debugTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#920734",
    marginBottom: 12,
  },
  statusGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 12,
  },
  statusItem: {
    flexDirection: "row",
    width: "50%",
    marginBottom: 6,
  },
  statusLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666",
    minWidth: 80,
  },
  statusValue: {
    fontSize: 14,
    fontWeight: "600",
  },
  errorSection: {
    backgroundColor: "#FFEBEE",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  errorTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#F44336",
    marginBottom: 8,
  },
  errorText: {
    fontSize: 12,
    color: "#C62828",
    fontFamily: "monospace",
  },
  feedbacksSection: {
    backgroundColor: "#E8F5E8",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  feedbacksTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4CAF50",
    marginBottom: 8,
  },
  feedbackItem: {
    backgroundColor: "#FFFFFF",
    padding: 8,
    borderRadius: 6,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  feedbackId: {
    fontSize: 12,
    fontWeight: "600",
    color: "#333",
  },
  feedbackStudent: {
    fontSize: 12,
    color: "#666",
  },
  feedbackAdmission: {
    fontSize: 11,
    color: "#999",
  },
  feedbackSubcategories: {
    fontSize: 11,
    fontWeight: "600",
    color: "#920734",
    marginTop: 4,
  },
  subcategoryDetail: {
    fontSize: 10,
    color: "#4CAF50",
    marginLeft: 8,
  },
  noSubcategories: {
    fontSize: 10,
    color: "#F44336",
    marginLeft: 8,
    fontStyle: "italic",
  },
  moreItems: {
    fontSize: 12,
    color: "#666",
    fontStyle: "italic",
    textAlign: "center",
    marginTop: 8,
  },
  emptySection: {
    backgroundColor: "#FFF3CD",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#856404",
    marginBottom: 4,
  },
  emptyText: {
    fontSize: 12,
    color: "#856404",
  },
  actionsSection: {
    marginTop: 16,
  },
  actionButton: {
    backgroundColor: "#920734",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: "center",
  },
  actionButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
});

export default DebugFeedbackDetailed;
