import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

export default function ReportsPage() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <Text style={styles.title}>📊 Reports & Analytics</Text>
        <Text style={styles.subtitle}>System reports and usage analytics</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Usage Reports</Text>
          <Text style={styles.cardDescription}>
            View system usage statistics and user activity reports.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Performance Analytics</Text>
          <Text style={styles.cardDescription}>
            Monitor system performance metrics and optimization opportunities.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Custom Reports</Text>
          <Text style={styles.cardDescription}>
            Generate custom reports based on specific criteria and timeframes.
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
