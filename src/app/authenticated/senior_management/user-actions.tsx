import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SeniorManagementUserActions() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Senior Management Actions</Text>
          <Text style={styles.subtitle}>
            Executive tools and management capabilities
          </Text>
        </View>

        <View style={styles.cardContainer}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>🎯 Strategic Planning</Text>
            <Text style={styles.cardDescription}>
              Plan and monitor strategic initiatives
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>💼 Executive Reports</Text>
            <Text style={styles.cardDescription}>
              Generate comprehensive executive reports
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>📊 Performance Analytics</Text>
            <Text style={styles.cardDescription}>
              Analyze institutional performance metrics
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>🏛️ Board Communications</Text>
            <Text style={styles.cardDescription}>
              Manage board meetings and communications
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    paddingVertical: 30,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666666",
    textAlign: "center",
  },
  cardContainer: {
    gap: 16,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: "#666666",
    lineHeight: 20,
  },
});