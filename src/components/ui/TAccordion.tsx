import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { TAccordionProps } from "../types";
import { theme } from "../styles/theme";

export const TAccordion: React.FC<TAccordionProps> = ({
  sections,
  style,
  ...props
}) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  return (
    <View style={style} {...props}>
      {sections.map((section, idx) => (
        <View key={idx}>
          <Pressable
            onPress={() => setOpenIndex(openIndex === idx ? null : idx)}
            style={styles.header}
          >
            <Text style={styles.title}>{section.title}</Text>
          </Pressable>
          {openIndex === idx && (
            <View style={styles.content}>{section.content}</View>
          )}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
    color: theme.colors.text,
  },
  content: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background,
  },
});
