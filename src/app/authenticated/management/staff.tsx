import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

export default function StaffPage() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <Text style={styles.title}>👨‍🏫 Staff Management</Text>
        <Text style={styles.subtitle}>
          Manage staff assignments and performance
        </Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Staff Directory</Text>
          <Text style={styles.cardDescription}>
            View and manage all staff members and their roles.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Performance Reviews</Text>
          <Text style={styles.cardDescription}>
            Conduct and track staff performance evaluations.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Professional Development</Text>
          <Text style={styles.cardDescription}>
            Manage training programs and staff development initiatives.
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
