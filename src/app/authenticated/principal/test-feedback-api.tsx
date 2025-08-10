import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  useGetFeedbackListQuery,
  useGetEducatorFeedbacksQuery,
} from "../../../api/educator-feedback-api";

const TestFeedbackAPI: React.FC = () => {
  // Test both APIs
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
    console.log("🧪 TEST COMPONENT MOUNTED - Starting API tests");
    console.log("🌐 Environment Check:", {
      baseUrl: process.env.EXPO_PUBLIC_BASE_URL_API_SERVER_1,
      expectedEndpoint: `${process.env.EXPO_PUBLIC_BASE_URL_API_SERVER_1}/api/educator-feedback-management/feedback/list`,
    });
  }, []);

  useEffect(() => {
    console.log("🧪 getFeedbackList Results:", {
      data: feedbackListData,
      loading: feedbackListLoading,
      error: feedbackListError,
    });

    // Enhanced subcategories testing
    if (feedbackListData?.data?.data) {
      const feedbacks = feedbackListData.data.data;
      console.log("🔍 SUBCATEGORIES TEST - getFeedbackList:", {
        feedbacksCount: feedbacks.length,
        subcategoriesData: feedbacks.map((feedback: any, index: number) => ({
          feedbackId: feedback.id,
          studentName: feedback.student?.full_name,
          subcategories: feedback.subcategories,
          subcategoriesCount: feedback.subcategories?.length || 0,
          rawSubcategories:
            feedback.subcategories?.map((sub: any) => ({
              id: sub.id,
              name: sub.name,
              subcategory_name: sub.subcategory_name,
              rawSub: sub,
            })) || [],
        })),
      });
    }
  }, [feedbackListData, feedbackListLoading, feedbackListError]);

  useEffect(() => {
    console.log("🧪 getEducatorFeedbacks Results:", {
      data: educatorFeedbacksData,
      loading: educatorFeedbacksLoading,
      error: educatorFeedbacksError,
    });

    // Enhanced subcategories testing
    if (educatorFeedbacksData?.data?.feedbacks) {
      const feedbacks = educatorFeedbacksData.data.feedbacks;
      console.log("🔍 SUBCATEGORIES TEST - getEducatorFeedbacks:", {
        feedbacksCount: feedbacks.length,
        subcategoriesData: feedbacks.map((feedback: any, index: number) => ({
          feedbackId: feedback.id,
          studentName: feedback.student?.full_name,
          subcategories: feedback.subcategories,
          subcategoriesCount: feedback.subcategories?.length || 0,
          rawSubcategories:
            feedback.subcategories?.map((sub: any) => ({
              id: sub.id,
              name: sub.name,
              subcategory_name: sub.subcategory_name,
              rawSub: sub,
            })) || [],
        })),
      });
    }
  }, [educatorFeedbacksData, educatorFeedbacksLoading, educatorFeedbacksError]);

  const renderApiTest = (
    title: string,
    data: any,
    loading: boolean,
    error: any,
    refetch: () => void,
  ) => (
    <View style={styles.testSection}>
      <Text style={styles.testTitle}>{title}</Text>

      <View style={styles.statusRow}>
        <Text style={styles.label}>Loading:</Text>
        <Text
          style={[styles.value, { color: loading ? "#FF9800" : "#4CAF50" }]}
        >
          {loading ? "YES" : "NO"}
        </Text>
      </View>

      <View style={styles.statusRow}>
        <Text style={styles.label}>Error:</Text>
        <Text style={[styles.value, { color: error ? "#F44336" : "#4CAF50" }]}>
          {error ? "YES" : "NO"}
        </Text>
      </View>

      <View style={styles.statusRow}>
        <Text style={styles.label}>Data:</Text>
        <Text style={[styles.value, { color: data ? "#4CAF50" : "#F44336" }]}>
          {data ? "RECEIVED" : "NONE"}
        </Text>
      </View>

      {error && (
        <View style={styles.errorDetails}>
          <Text style={styles.errorTitle}>Error Details:</Text>
          <Text style={styles.errorText}>{JSON.stringify(error, null, 2)}</Text>
        </View>
      )}

      {data && (
        <View style={styles.dataDetails}>
          <Text style={styles.dataTitle}>Data Structure:</Text>
          <ScrollView style={styles.dataScroll} nestedScrollEnabled={true}>
            <Text style={styles.dataText}>{JSON.stringify(data, null, 2)}</Text>
          </ScrollView>

          {/* Subcategories Summary */}
          {data?.data?.data && (
            <View style={styles.subcategoriesSummary}>
              <Text style={styles.subcategoriesTitle}>
                🏷️ Subcategories Test Results:
              </Text>
              {data.data.data.map((feedback: any, index: number) => (
                <View
                  key={feedback.id || index}
                  style={styles.subcategoryResult}
                >
                  <Text style={styles.subcategoryFeedbackId}>
                    Feedback #{feedback.id} -{" "}
                    {feedback.student?.full_name || "Unknown Student"}
                  </Text>
                  <Text style={styles.subcategoryCount}>
                    Subcategories: {feedback.subcategories?.length || 0}
                  </Text>
                  {feedback.subcategories?.map((sub: any, subIndex: number) => (
                    <Text key={subIndex} style={styles.subcategoryItem}>
                      •{" "}
                      {sub.name ||
                        sub.subcategory_name ||
                        "Unnamed subcategory"}{" "}
                      (ID: {sub.id})
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
            </View>
          )}

          {/* For getEducatorFeedbacks format */}
          {data?.data?.feedbacks && (
            <View style={styles.subcategoriesSummary}>
              <Text style={styles.subcategoriesTitle}>
                🏷️ Subcategories Test Results:
              </Text>
              {data.data.feedbacks.map((feedback: any, index: number) => (
                <View
                  key={feedback.id || index}
                  style={styles.subcategoryResult}
                >
                  <Text style={styles.subcategoryFeedbackId}>
                    Feedback #{feedback.id} -{" "}
                    {feedback.student?.full_name || "Unknown Student"}
                  </Text>
                  <Text style={styles.subcategoryCount}>
                    Subcategories: {feedback.subcategories?.length || 0}
                  </Text>
                  {feedback.subcategories?.map((sub: any, subIndex: number) => (
                    <Text key={subIndex} style={styles.subcategoryItem}>
                      •{" "}
                      {sub.name ||
                        sub.subcategory_name ||
                        "Unnamed subcategory"}{" "}
                      (ID: {sub.id})
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
            </View>
          )}
        </View>
      )}

      <TouchableOpacity style={styles.retryButton} onPress={refetch}>
        <Text style={styles.retryButtonText}>Retry API Call</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>🧪 Feedback API Test Page</Text>
      <Text style={styles.subtitle}>
        This page tests both getFeedbackList and getEducatorFeedbacks APIs
      </Text>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {renderApiTest(
          "getFeedbackList API",
          feedbackListData,
          feedbackListLoading,
          feedbackListError,
          refetchFeedbackList,
        )}

        {renderApiTest(
          "getEducatorFeedbacks API",
          educatorFeedbacksData,
          educatorFeedbacksLoading,
          educatorFeedbacksError,
          refetchEducatorFeedbacks,
        )}

        <View style={styles.instructions}>
          <Text style={styles.instructionsTitle}>📋 Check Console Logs:</Text>
          <Text style={styles.instructionsText}>
            • Open React Native debugger or Metro logs{"\n"}• Look for detailed
            API request/response logs{"\n"}• Check network tab for actual HTTP
            requests{"\n"}• Verify backend is receiving correct parameters
          </Text>
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
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "#333",
    marginVertical: 16,
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
    color: "#666",
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  testSection: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  testTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666",
  },
  value: {
    fontSize: 14,
    fontWeight: "600",
  },
  errorDetails: {
    marginTop: 12,
    padding: 12,
    backgroundColor: "#FFEBEE",
    borderRadius: 8,
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
  dataDetails: {
    marginTop: 12,
    padding: 12,
    backgroundColor: "#E8F5E8",
    borderRadius: 8,
  },
  dataTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4CAF50",
    marginBottom: 8,
  },
  dataScroll: {
    maxHeight: 200,
  },
  dataText: {
    fontSize: 10,
    color: "#2E7D32",
    fontFamily: "monospace",
  },
  retryButton: {
    backgroundColor: "#920734",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 12,
    alignItems: "center",
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  instructions: {
    backgroundColor: "#FFF3CD",
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#FFEAA7",
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#856404",
    marginBottom: 8,
  },
  instructionsText: {
    fontSize: 14,
    color: "#856404",
    lineHeight: 20,
  },
  subcategoriesSummary: {
    backgroundColor: "#F0F8FF",
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#920734",
  },
  subcategoriesTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#920734",
    marginBottom: 8,
  },
  subcategoryResult: {
    backgroundColor: "#FFFFFF",
    padding: 8,
    borderRadius: 6,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  subcategoryFeedbackId: {
    fontSize: 12,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  subcategoryCount: {
    fontSize: 11,
    color: "#666",
    marginBottom: 4,
  },
  subcategoryItem: {
    fontSize: 10,
    color: "#4CAF50",
    marginLeft: 8,
    marginBottom: 2,
  },
  noSubcategories: {
    fontSize: 10,
    color: "#F44336",
    marginLeft: 8,
    fontStyle: "italic",
  },
});

export default TestFeedbackAPI;
