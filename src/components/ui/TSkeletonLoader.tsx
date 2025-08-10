import React from "react";
import { View, StyleSheet } from "react-native";
import { TSkeletonLoaderProps } from "../types";
import { theme } from "../styles/theme";

export const TSkeletonLoader: React.FC<TSkeletonLoaderProps> = ({
  width = 120,
  height = 20,
  borderRadius = 4,
  style,
  ...props
}) => (
  <View
    style={[styles.skeleton, { width, height, borderRadius }, style]}
    {...props}
  />
);

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: theme.colors.surface,
    opacity: 0.5,
    marginVertical: 8,
  },
});
