import React from "react";
import { View, Switch, Text, StyleSheet } from "react-native";
import { BaseComponentProps } from "../types";
import { theme } from "../styles/theme";

export interface TThemeSwitcherProps extends BaseComponentProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
}

export const TThemeSwitcher: React.FC<TThemeSwitcherProps> = ({
  value,
  onValueChange,
  style,
  ...props
}) => (
  <View style={[styles.container, style]} {...props}>
    <Text style={styles.label}>{value ? "Dark" : "Light"} Mode</Text>
    <Switch value={value} onValueChange={onValueChange} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: theme.spacing.sm,
  },
  label: {
    fontSize: 16,
    color: theme.colors.text,
    marginRight: 8,
  },
});
