import React from "react";
import { View, Pressable, Text, StyleSheet } from "react-native";
import { TTabsProps } from "../types";
import { theme } from "../styles/theme";

export const TTabs: React.FC<TTabsProps> = ({
  tabs,
  currentTab,
  onTabChange,
  style,
  ...props
}) => (
  <View style={[styles.container, style]} {...props}>
    {tabs.map((tab, idx) => (
      <Pressable
        key={idx}
        onPress={() => onTabChange(idx)}
        style={[styles.tab, currentTab === idx && styles.activeTab]}
      >
        <Text style={[styles.label, currentTab === idx && styles.activeLabel]}>
          {tab.label}
        </Text>
      </Pressable>
    ))}
  </View>
);

const styles = StyleSheet.create({
  container: { flexDirection: "row", marginVertical: 8 },
  tab: {
    flex: 1,
    padding: theme.spacing.md,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeTab: {
    borderBottomColor: theme.colors.primary,
  },
  label: {
    color: theme.colors.textSecondary,
    fontWeight: "bold",
  },
  activeLabel: {
    color: theme.colors.primary,
  },
});
