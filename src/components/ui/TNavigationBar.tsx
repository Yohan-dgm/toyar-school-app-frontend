import React from "react";
import { View, Pressable, Text, StyleSheet } from "react-native";
import { BaseComponentProps } from "../types";
import { theme } from "../styles/theme";

export interface TNavigationBarItem {
  icon?: React.ReactNode;
  label: string;
  onPress?: () => void;
}

export interface TNavigationBarProps extends BaseComponentProps {
  items: TNavigationBarItem[];
}

export const TNavigationBar: React.FC<TNavigationBarProps> = ({
  items,
  style,
  ...props
}) => (
  <View style={[styles.container, style]} {...props}>
    {items.map((item, idx) => (
      <Pressable key={idx} style={styles.item} onPress={item.onPress}>
        {item.icon}
        <Text style={styles.label}>{item.label}</Text>
      </Pressable>
    ))}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    paddingVertical: theme.spacing.sm,
  },
  item: {
    alignItems: "center",
    padding: theme.spacing.sm,
  },
  label: {
    color: theme.colors.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
});
