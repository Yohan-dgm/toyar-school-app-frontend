import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

export default function TrainingPage() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <Text style={styles.title}>🏋️‍♂️ Training Sessions</Text>
        <Text style={styles.subtitle}>
          Manage training schedules and track player development
        </Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Today&apos;s Training</Text>
          <Text style={styles.cardDescription}>
            View today&apos;s training schedule, attendance, and session notes.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Training Plans</Text>
          <Text style={styles.cardDescription}>
            Create and manage training plans for different skill levels and
            positions.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Player Progress</Text>
          <Text style={styles.cardDescription}>
            Track individual player progress and performance metrics.
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
    lineHeight: 20,
  },
});
