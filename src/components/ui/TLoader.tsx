import React from "react";
import { ActivityIndicator, View, StyleSheet } from "react-native";
import { TLoaderProps } from "../types";
import { theme } from "../styles/theme";

export const TLoader: React.FC<TLoaderProps> = ({
  variant = "spinner",
  style,
  ...props
}) => (
  <View style={[styles.container, style]} {...props}>
    {variant === "spinner" ? (
      <ActivityIndicator size="large" color={theme.colors.primary} />
    ) : (
      <View style={styles.bar} />
    )}
  </View>
);

const styles = StyleSheet.create({
  container: { alignItems: "center", justifyContent: "center", padding: 8 },
  bar: {
    width: 100,
    height: 8,
    backgroundColor: theme.colors.primary,
    borderRadius: 4,
  },
});
