import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { BaseComponentProps } from "../types";
import { theme } from "../styles/theme";

export interface THeaderProps extends BaseComponentProps {
  title: string;
}

export const THeader: React.FC<THeaderProps> = ({ title, style, ...props }) => (
  <View style={[styles.container, style]} {...props}>
    <Text style={styles.title}>{title}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    color: theme.colors.background,
    fontSize: 20,
    fontWeight: "bold",
  },
});
