import React from "react";
import { Pressable, Text, StyleSheet } from "react-native";
import { TListItemProps } from "../types";
import { theme } from "../styles/theme";

export const TListItem: React.FC<TListItemProps> = ({
  label,
  onPress,
  style,
  ...props
}) => (
  <Pressable onPress={onPress} style={[styles.item, style]} {...props}>
    <Text style={styles.text}>{label}</Text>
  </Pressable>
);

const styles = StyleSheet.create({
  item: {
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  },
  text: {
    fontSize: 16,
    color: theme.colors.text,
  },
});
