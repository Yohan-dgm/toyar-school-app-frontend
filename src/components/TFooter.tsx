import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { BaseComponentProps } from "./types";
import { theme } from "./styles/theme";

export interface TFooterProps extends BaseComponentProps {
  children?: React.ReactNode;
}

export const TFooter: React.FC<TFooterProps> = ({
  children,
  style,
  ...props
}) => (
  <View style={[styles.container, style]} {...props}>
    {children ? children : <Text style={styles.text}>Footer</Text>}
  </View>
);

const styles = StyleSheet.create({
  container: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: theme.colors.textSecondary,
    fontSize: 16,
  },
});
