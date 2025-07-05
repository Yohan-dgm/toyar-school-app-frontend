import React from "react";
import { View, StyleSheet } from "react-native";
import { TCardProps } from "../types";
import { theme } from "../styles/theme";

export const TCard: React.FC<TCardProps> = ({
  children,
  variant = "elevated",
  style,
  ...props
}) => (
  <View style={[styles.base, styles[variant], style]} {...props}>
    {children}
  </View>
);

const styles = StyleSheet.create({
  base: {
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginVertical: theme.spacing.sm,
  },
  elevated: {
    backgroundColor: theme.colors.background,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  outlined: {
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  glassmorphism: {
    backgroundColor: "rgba(255,255,255,0.6)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 1,
  },
});
