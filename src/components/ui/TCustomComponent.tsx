import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { BaseComponentProps } from "../types";
import { theme } from "../styles/theme";

export interface TCustomComponentProps extends BaseComponentProps {
  label: string;
  // Add more props as needed
}

export const TCustomComponent: React.FC<TCustomComponentProps> = ({
  label,
  style,
  ...props
}) => (
  <View style={[styles.container, style]} {...props}>
    <Text style={styles.text}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: theme.colors.text,
    fontSize: 16,
  },
});
