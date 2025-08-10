import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { router } from "expo-router";
import type { RootState } from "@/state-store/store";
import {
  getUserCategoryName,
  getUserCategoryDisplayName,
} from "@/constants/userCategories";
import { setSessionData } from "@/state-store/slices/app-slice";

export default function DebugSessionPage() {
  const { isAuthenticated, sessionData } = useSelector(
    (state: RootState) => state.app,
  );
  const dispatch = useDispatch();

  const userCategory = (sessionData as any)?.user_category;
  const userRole =
    (sessionData as any)?.user_role || (sessionData as any)?.role;

  const simulateUserCategory = (categoryId: number) => {
    const mockSessionData = {
      ...sessionData,
      user_category: categoryId,
    };
    dispatch(setSessionData(mockSessionData));

    const categoryName = getUserCategoryName(categoryId);
    console.log(`Simulating user_category: ${categoryId} -> ${categoryName}`);
    router.replace(`/authenticated/${categoryName}`);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <Text style={styles.title}>🔍 Session Debug</Text>
        <Text style={styles.subtitle}>Debug user category routing</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Authentication Status</Text>
          <Text style={styles.value}>
            {isAuthenticated ? "✅ Authenticated" : "❌ Not Authenticated"}
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Current User Category</Text>
          <Text style={styles.value}>
            {userCategory
              ? `${userCategory} (${getUserCategoryDisplayName(userCategory)})`
              : "❌ Not Set"}
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Current User Role (Legacy)</Text>
          <Text style={styles.value}>{userRole || "❌ Not Set"}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Full Session Data</Text>
          <Text style={styles.jsonText}>
            {JSON.stringify(sessionData, null, 2)}
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Test User Categories</Text>
          <Text style={styles.cardDescription}>
            Click to simulate different user categories:
          </Text>

          <TouchableOpacity
            style={styles.testButton}
            onPress={() => simulateUserCategory(1)}
          >
            <Text style={styles.testButtonText}>Test Parent (1)</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.testButton}
            onPress={() => simulateUserCategory(2)}
          >
            <Text style={styles.testButtonText}>Test Educator (2)</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.testButton}
            onPress={() => simulateUserCategory(4)}
          >
            <Text style={styles.testButtonText}>Test Counselor (4)</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.testButton}
            onPress={() => simulateUserCategory(5)}
          >
            <Text style={styles.testButtonText}>Test Admin (5)</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  content: {
    padding: 20,
    paddingBottom: 100,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
  },
  value: {
    fontSize: 16,
    color: "#920734",
    fontWeight: "500",
  },
  jsonText: {
    fontSize: 12,
    color: "#666",
    fontFamily: "monospace",
    backgroundColor: "#f8f8f8",
    padding: 10,
    borderRadius: 8,
  },
  testButton: {
    backgroundColor: "#920734",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 8,
  },
  testButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  backButton: {
    backgroundColor: "#666",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 20,
  },
  backButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});
