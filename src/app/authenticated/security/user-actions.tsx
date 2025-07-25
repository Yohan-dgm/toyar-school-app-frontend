import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SecurityUserActions() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Security Actions</Text>
          <Text style={styles.subtitle}>
            Security tools and safety management
          </Text>
        </View>

        <View style={styles.cardContainer}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>🚨 Incident Reporting</Text>
            <Text style={styles.cardDescription}>
              Report and document security incidents
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>👥 Visitor Management</Text>
            <Text style={styles.cardDescription}>
              Register and track campus visitors
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>🚶 Patrol Management</Text>
            <Text style={styles.cardDescription}>
              Schedule and track security patrols
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>📊 Security Reports</Text>
            <Text style={styles.cardDescription}>
              Generate security and safety reports
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>🔐 Access Control</Text>
            <Text style={styles.cardDescription}>
              Manage building and area access permissions
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