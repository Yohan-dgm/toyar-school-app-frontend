import React from "react";
import { Pressable, Text, View, StyleSheet } from "react-native";
import { TCheckboxProps } from "../types";
import { theme } from "../styles/theme";

export const TCheckbox: React.FC<TCheckboxProps> = ({
  checked,
  onChange,
  label,
  style,
  ...props
}) => (
  <Pressable
    onPress={() => onChange(!checked)}
    style={[styles.container, style]}
    {...props}
  >
    <View style={[styles.box, checked && styles.checkedBox]}>
      {checked && <View style={styles.innerCheck} />}
    </View>
    {label && <Text style={styles.label}>{label}</Text>}
  </Pressable>
);

const styles = StyleSheet.create({
  container: { flexDirection: "row", alignItems: "center", marginVertical: 4 },
  box: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  checkedBox: {
    borderColor: theme.colors.success,
    backgroundColor: theme.colors.success,
  },
  innerCheck: {
    width: 10,
    height: 10,
    backgroundColor: theme.colors.background,
    borderRadius: 2,
  },
  label: {
    fontSize: 16,
    color: theme.colors.text,
  },
});
