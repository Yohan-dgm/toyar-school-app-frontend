import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

export default function TopManagementHome() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <Text style={styles.title}>🏢 Executive Dashboard</Text>
        <Text style={styles.subtitle}>
          Strategic oversight and institutional governance
        </Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Executive Overview</Text>
          <Text style={styles.cardDescription}>
            High-level institutional metrics, KPIs, and strategic performance indicators.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Strategic Planning</Text>
          <Text style={styles.cardDescription}>
            Long-term strategic initiatives, goals, and institutional development plans.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Governance</Text>
          <Text style={styles.cardDescription}>
            Board meetings, policy decisions, and institutional governance matters.
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
