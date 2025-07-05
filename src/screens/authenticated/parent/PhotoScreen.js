import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { handleNavigationPress } from "../../../utils/navigationFix";
import { theme } from "../../../styles/theme";
import Header from "../../../components/common/Header";
import BottomNavigation from "../../../components/common/BottomNavigation";

const PhotoScreen = () => {
  const handleTabPress = (tabId) => {
    handleNavigationPress(tabId, "PhotoScreen");
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.placeholderContainer}>
          <Text style={styles.placeholderTitle}>📸 Photos & Gallery</Text>
          <Text style={styles.placeholderSubtitle}>
            School photos and memories
          </Text>

          <View style={styles.placeholderCard}>
            <Text style={styles.placeholderDescription}>
              Browse and manage school-related photos:
            </Text>
            <Text style={styles.featureList}>
              • School event photos{"\n"}• Class pictures and yearbook{"\n"}•
              Sports and activity photos{"\n"}• Achievement certificates{"\n"}•
              Student artwork gallery
            </Text>
          </View>
        </View>
      </ScrollView>

      <BottomNavigation activeTab="calendar" onTabPress={handleTabPress} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    flex: 1,
  },
  placeholderContainer: {
    flex: 1,
    padding: theme.spacing.lg,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 400,
  },
  placeholderTitle: {
    fontFamily: theme.fonts.bold,
    fontSize: 32,
    color: "#000000",
    textAlign: "center",
    marginBottom: theme.spacing.sm,
  },
  placeholderSubtitle: {
    fontFamily: theme.fonts.medium,
    fontSize: 18,
    color: "#666666",
    textAlign: "center",
    marginBottom: theme.spacing.lg,
  },
  placeholderCard: {
    backgroundColor: "#F8F9FA",
    borderRadius: 16,
    padding: theme.spacing.lg,
    width: "100%",
    maxWidth: 300,
  },
  placeholderDescription: {
    fontFamily: theme.fonts.regular,
    fontSize: 16,
    color: "#000000",
    textAlign: "center",
    marginBottom: theme.spacing.md,
    lineHeight: 24,
  },
  featureList: {
    fontFamily: theme.fonts.regular,
    fontSize: 14,
    color: "#666666",
    lineHeight: 22,
  },
});

export default PhotoScreen;
