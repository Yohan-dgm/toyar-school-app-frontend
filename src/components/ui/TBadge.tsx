import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { TBadgeProps } from "../types";
import { theme } from "../styles/theme";

export const TBadge: React.FC<TBadgeProps> = ({
  value,
  color,
  style,
  ...props
}) => (
  <View
    style={[
      styles.badge,
      { backgroundColor: color || theme.colors.error },
      style,
    ]}
    {...props}
  >
    <Text style={styles.text}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  badge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: theme.colors.error,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
    alignSelf: "flex-start",
  },
  text: {
    color: theme.colors.background,
    fontSize: 12,
    fontWeight: "bold",
  },
});
