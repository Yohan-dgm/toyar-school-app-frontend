import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { modernColors } from "../../data/studentGrowthData";

interface ModernStatsHeaderProps {
  title?: string;
  subtitle?: string;
}

const ModernStatsHeader: React.FC<ModernStatsHeaderProps> = ({
  title = "Data and statistics",
  subtitle = "Student Performance Overview",
}) => {
  return (
    <LinearGradient
      colors={["maroon", "darkred"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  content: {
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    textAlign: "center",
    letterSpacing: 0.3,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: "500",
    color: "#FFFFFF",
    opacity: 0.9,
    textAlign: "center",
    marginTop: 2,
  },
});

export default ModernStatsHeader;
