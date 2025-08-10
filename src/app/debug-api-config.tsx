import React, { useEffect } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const DebugApiConfig: React.FC = () => {
  useEffect(() => {
    // Log environment configuration
    console.log("🔧 API CONFIGURATION DEBUG:", {
      timestamp: new Date().toISOString(),
      environment: {
        BASE_URL_API_SERVER_1: process.env.EXPO_PUBLIC_BASE_URL_API_SERVER_1,
        BASE_URL_STUDENT_IMAGES:
          process.env.EXPO_PUBLIC_BASE_URL_STUDENT_IMAGES,
        SITE_URL: process.env.EXPO_PUBLIC_SITE_URL,
        SITE_NAME: process.env.EXPO_PUBLIC_SITE_NAME,
      },
      apiEndpoints: {
        feedbackList: `${process.env.EXPO_PUBLIC_BASE_URL_API_SERVER_1}/api/educator-feedback-management/feedback/list`,
        categoryList: `${process.env.EXPO_PUBLIC_BASE_URL_API_SERVER_1}/api/educator-feedback-management/category/list`,
        studentList: `${process.env.EXPO_PUBLIC_BASE_URL_API_SERVER_1}/api/student-management/student/get-student-list-data`,
      },
      networkStatus: {
        isOnline:
          typeof navigator !== "undefined" ? navigator.onLine : "unknown",
        userAgent:
          typeof navigator !== "undefined" ? navigator.userAgent : "unknown",
      },
    });

    // Test basic fetch to API
    const testApiConnectivity = async () => {
      const baseUrl = process.env.EXPO_PUBLIC_BASE_URL_API_SERVER_1;
      if (!baseUrl) {
        console.error("❌ BASE_URL_API_SERVER_1 is not set!");
        return;
      }

      try {
        console.log("🧪 Testing API connectivity to:", baseUrl);
        const response = await fetch(baseUrl, {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        });

        console.log("🧪 API connectivity test result:", {
          status: response.status,
          statusText: response.statusText,
          ok: response.ok,
          headers: Object.fromEntries(response.headers.entries()),
        });
      } catch (error) {
        console.error("❌ API connectivity test failed:", error);
      }
    };

    testApiConnectivity();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.title}>API Configuration Debug</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Environment Variables</Text>
          <Text style={styles.configText}>
            BASE_URL_API_SERVER_1:{" "}
            {process.env.EXPO_PUBLIC_BASE_URL_API_SERVER_1 || "NOT SET"}
          </Text>
          <Text style={styles.configText}>
            BASE_URL_STUDENT_IMAGES:{" "}
            {process.env.EXPO_PUBLIC_BASE_URL_STUDENT_IMAGES || "NOT SET"}
          </Text>
          <Text style={styles.configText}>
            SITE_URL: {process.env.EXPO_PUBLIC_SITE_URL || "NOT SET"}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>API Endpoints</Text>
          <Text style={styles.endpointText}>
            Feedback List: {process.env.EXPO_PUBLIC_BASE_URL_API_SERVER_1}
            /api/educator-feedback-management/feedback/list
          </Text>
          <Text style={styles.endpointText}>
            Category List: {process.env.EXPO_PUBLIC_BASE_URL_API_SERVER_1}
            /api/educator-feedback-management/category/list
          </Text>
          <Text style={styles.endpointText}>
            Student List: {process.env.EXPO_PUBLIC_BASE_URL_API_SERVER_1}
            /api/student-management/student/get-student-list-data
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Network Status</Text>
          <Text style={styles.configText}>
            Online:{" "}
            {typeof navigator !== "undefined"
              ? navigator.onLine
                ? "Yes"
                : "No"
              : "Unknown"}
          </Text>
        </View>

        <Text style={styles.note}>
          Check the console logs for detailed connectivity test results.
        </Text>
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
  configText: {
    fontSize: 14,
    color: "#333",
    marginBottom: 8,
    fontFamily: "monospace",
  },
  endpointText: {
    fontSize: 12,
    color: "#666",
    marginBottom: 8,
    fontFamily: "monospace",
  },
  note: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    fontStyle: "italic",
    marginTop: 20,
  },
});

export default DebugApiConfig;
