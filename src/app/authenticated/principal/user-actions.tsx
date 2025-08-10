import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PrincipalUserActions() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Principal Actions</Text>
          <Text style={styles.subtitle}>
            Administrative tools and leadership capabilities
          </Text>
        </View>

        <View style={styles.cardContainer}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>📚 Academic Oversight</Text>
            <Text style={styles.cardDescription}>
              Monitor curriculum delivery and academic standards
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>👥 Staff Management</Text>
            <Text style={styles.cardDescription}>
              Manage teaching staff and performance evaluations
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>🎓 Student Affairs</Text>
            <Text style={styles.cardDescription}>
              Oversee student discipline and welfare programs
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>🏫 School Operations</Text>
            <Text style={styles.cardDescription}>
              Coordinate daily operations and policy implementation
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>📊 Performance Reports</Text>
            <Text style={styles.cardDescription}>
              Generate school performance and progress reports
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
