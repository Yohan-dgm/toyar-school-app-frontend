import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

export default function CounselorHome() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <Text style={styles.title}>🧠 Counselor Dashboard</Text>
        <Text style={styles.subtitle}>
          Support student wellbeing and academic success
        </Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Counseling Sessions</Text>
          <Text style={styles.cardDescription}>
            Manage individual and group counseling sessions with students.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Student Support</Text>
          <Text style={styles.cardDescription}>
            Track student progress, concerns, and provide academic guidance.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Appointments</Text>
          <Text style={styles.cardDescription}>
            Schedule and manage appointments with students, parents, and staff.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Resources</Text>
          <Text style={styles.cardDescription}>
            Access counseling resources, materials, and support tools.
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
