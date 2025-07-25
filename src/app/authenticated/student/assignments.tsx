import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function StudentAssignments() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Assignments</Text>
          <Text style={styles.subtitle}>
            View and manage your assignments
          </Text>
        </View>

        <View style={styles.cardContainer}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>📝 Pending Assignments</Text>
            <Text style={styles.cardDescription}>
              View assignments that need to be completed
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>✅ Completed Assignments</Text>
            <Text style={styles.cardDescription}>
              Track your completed assignments and grades
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>📅 Upcoming Deadlines</Text>
            <Text style={styles.cardDescription}>
              Important assignment due dates and reminders
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>📊 Progress Tracking</Text>
            <Text style={styles.cardDescription}>
              Monitor your academic progress and performance
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