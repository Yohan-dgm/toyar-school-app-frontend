import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

export default function ManagementHome() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <Text style={styles.title}>📊 Management Dashboard</Text>
        <Text style={styles.subtitle}>
          Operational management and institutional oversight
        </Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Analytics Overview</Text>
          <Text style={styles.cardDescription}>
            View key performance indicators and operational metrics.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Department Management</Text>
          <Text style={styles.cardDescription}>
            Oversee departmental operations and resource allocation.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Staff Management</Text>
          <Text style={styles.cardDescription}>
            Manage staff assignments, performance, and development.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Financial Overview</Text>
          <Text style={styles.cardDescription}>
            Monitor budgets, expenses, and financial performance.
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
