import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

export default function AdminHome() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <Text style={styles.title}>⚙️ Admin Dashboard</Text>
        <Text style={styles.subtitle}>
          System administration and user management
        </Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>System Overview</Text>
          <Text style={styles.cardDescription}>
            Monitor system health, performance metrics, and overall status.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>User Management</Text>
          <Text style={styles.cardDescription}>
            Manage user accounts, permissions, and access controls.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>System Settings</Text>
          <Text style={styles.cardDescription}>
            Configure system settings, preferences, and administrative options.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Reports & Analytics</Text>
          <Text style={styles.cardDescription}>
            Generate system reports and view usage analytics.
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
