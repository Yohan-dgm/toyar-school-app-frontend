import React from "react";
import { View, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { TSelectDropdownProps } from "../types";
import { theme } from "../styles/theme";

export const TSelectDropdown: React.FC<TSelectDropdownProps> = ({
  options,
  value,
  onValueChange,
  placeholder,
  style,
  ...props
}) => (
  <View style={[styles.container, style]} {...props}>
    <Picker
      selectedValue={value}
      onValueChange={onValueChange}
      style={styles.picker}
    >
      {placeholder && <Picker.Item label={placeholder} value={null} />}
      {options.map((opt) => (
        <Picker.Item key={opt.value} label={opt.label} value={opt.value} />
      ))}
    </Picker>
  </View>
);

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    marginVertical: 8,
    overflow: "hidden",
  },
  picker: {
    height: 44,
    width: "100%",
  },
});
