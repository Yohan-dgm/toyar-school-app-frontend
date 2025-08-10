import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

export default function SportCoachHome() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <Text style={styles.title}>🏃‍♂️ Sport Coach Dashboard</Text>
        <Text style={styles.subtitle}>
          Manage your teams, training sessions, and player performance
        </Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Teams Overview</Text>
          <Text style={styles.cardDescription}>
            View and manage all your sports teams, track their progress, and
            organize training schedules.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Training Sessions</Text>
          <Text style={styles.cardDescription}>
            Plan and schedule training sessions, track attendance, and monitor
            player development.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Upcoming Matches</Text>
          <Text style={styles.cardDescription}>
            View scheduled matches, manage team lineups, and track match
            results.
          </Text>
        </View>
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
    paddingBottom: 100, // Space for bottom navigation
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
    lineHeight: 20,
  },
});
