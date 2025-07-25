import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface CommonSchoolCalendarProps {
  userCategory: number;
  title?: string;
  subtitle?: string;
  customEvents?: Array<{
    title: string;
    description: string;
    icon: string;
  }>;
}

export default function CommonSchoolCalendar({
  userCategory,
  title = "School Calendar",
  subtitle = "Important dates and events",
  customEvents = [],
}: CommonSchoolCalendarProps) {
  // Common events that all users see
  const commonEvents = [
    {
      title: "📅 School Events",
      description: "Assemblies, celebrations, and special occasions",
    },
    {
      title: "📚 Academic Calendar",
      description: "Term dates, examinations, and academic milestones",
    },
    {
      title: "🏆 Awards & Recognition",
      description: "Achievement ceremonies and recognition events",
    },
    {
      title: "📢 Announcements",
      description: "Important school announcements and updates",
    },
  ];

  // Combine common events with custom events
  const allEvents = [...commonEvents, ...customEvents];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>

        <View style={styles.cardContainer}>
          {allEvents.map((event, index) => (
            <View key={index} style={styles.card}>
              <Text style={styles.cardTitle}>{event.title}</Text>
              <Text style={styles.cardDescription}>{event.description}</Text>
            </View>
          ))}
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