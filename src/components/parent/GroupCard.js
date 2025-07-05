import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { theme } from "../../styles/theme";
import { globalStyles } from "../../styles/globalStyles";

const GroupCard = ({ name, role, memberCount, actionText, actionColor }) => {
  return (
    <View
      style={[globalStyles.card, styles.card, { backgroundColor: actionColor }]}
    >
      <Text style={styles.title}>{name}</Text>
      <Text style={styles.role}>Role: {role}</Text>
      <Text style={styles.members}>+{memberCount} Members</Text>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>{actionText}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    marginHorizontal: theme.spacing.md,
  },
  title: {
    fontFamily: theme.fonts.bold,
    fontSize: 16,
    color: theme.colors.text,
  },
  role: {
    fontFamily: theme.fonts.regular,
    fontSize: 12,
    color: theme.colors.text,
  },
  members: {
    fontFamily: theme.fonts.regular,
    fontSize: 12,
    color: theme.colors.text,
  },
  button: {
    backgroundColor: theme.colors.secondary,
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.xs,
    marginTop: 8,
  },
  buttonText: {
    fontFamily: theme.fonts.medium,
    fontSize: 12,
    color: "#FFFFFF",
    textAlign: "center",
  },
});

export default GroupCard;
