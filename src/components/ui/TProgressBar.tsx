import React from "react";
import { View, StyleSheet } from "react-native";
import { TProgressBarProps } from "../types";
import { theme } from "../styles/theme";

export const TProgressBar: React.FC<TProgressBarProps> = ({
  progress,
  color,
  style,
  ...props
}) => (
  <View style={[styles.container, style]} {...props}>
    <View
      style={[
        styles.bar,
        {
          width: `${Math.max(0, Math.min(1, progress)) * 100}%`,
          backgroundColor: color || theme.colors.primary,
        },
      ]}
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    height: 8,
    width: "100%",
    backgroundColor: theme.colors.surface,
    borderRadius: 4,
    overflow: "hidden",
    marginVertical: 8,
  },
  bar: {
    height: "100%",
    borderRadius: 4,
  },
});
