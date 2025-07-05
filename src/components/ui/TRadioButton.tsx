import React from "react";
import { Pressable, Text, View, StyleSheet } from "react-native";
import { TRadioButtonProps } from "../types";
import { theme } from "../styles/theme";

export const TRadioButton: React.FC<TRadioButtonProps> = ({
  selected,
  onPress,
  label,
  style,
  ...props
}) => (
  <Pressable onPress={onPress} style={[styles.container, style]} {...props}>
    <View style={[styles.radio, selected && styles.selectedRadio]}>
      {selected && <View style={styles.innerCircle} />}
    </View>
    {label && <Text style={styles.label}>{label}</Text>}
  </Pressable>
);

const styles = StyleSheet.create({
  container: { flexDirection: "row", alignItems: "center", marginVertical: 4 },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  selectedRadio: {
    borderColor: theme.colors.success,
  },
  innerCircle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: theme.colors.success,
  },
  label: {
    fontSize: 16,
    color: theme.colors.text,
  },
});
