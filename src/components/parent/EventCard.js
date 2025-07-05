import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { theme } from "../../styles/theme";
import { globalStyles } from "../../styles/globalStyles";

const EventCard = ({ date, time, title, note, backgroundColor }) => {
  return (
    <View style={[globalStyles.card, styles.card, { backgroundColor }]}>
      <Text style={styles.date}>{date}</Text>
      <Text style={styles.time}>{time}</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.note}>{note}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 280,
    padding: theme.spacing.md,
    marginRight: theme.spacing.sm,
    marginLeft: theme.spacing.md,
  },
  date: {
    fontFamily: theme.fonts.bold,
    fontSize: 20,
    color: theme.colors.text,
  },
  time: {
    fontFamily: theme.fonts.regular,
    fontSize: 14,
    color: theme.colors.text,
  },
  title: {
    fontFamily: theme.fonts.medium,
    fontSize: 16,
    color: theme.colors.text,
  },
  note: {
    fontFamily: theme.fonts.regular,
    fontSize: 12,
    color: theme.colors.text,
  },
});

export default EventCard;
