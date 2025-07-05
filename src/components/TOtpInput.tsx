import React, { useRef } from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { BaseComponentProps } from "./types";
import { theme } from "./styles/theme";

export interface TOtpInputProps extends BaseComponentProps {
  value: string;
  onChange: (value: string) => void;
  length?: number;
}

export const TOtpInput: React.FC<TOtpInputProps> = ({
  value,
  onChange,
  length = 6,
  style,
  ...props
}) => {
  const inputs = useRef<(TextInput | null)[]>([]);

  const handleChange = (text: string, idx: number) => {
    let newValue = value.split("");
    newValue[idx] = text;
    onChange(newValue.join("").slice(0, length));
    if (text && idx < length - 1) {
      inputs.current[idx + 1]?.focus();
    }
  };

  return (
    <View style={[styles.container, style]} {...props}>
      {Array.from({ length }).map((_, idx) => (
        <TextInput
          key={idx}
          ref={(ref) => {
            inputs.current[idx] = ref;
            return undefined;
          }}
          value={value[idx] || ""}
          onChangeText={(text) => handleChange(text, idx)}
          style={styles.input}
          keyboardType="default"
          maxLength={1}
          autoCapitalize="characters"
          placeholder="•"
          placeholderTextColor="#CCCCCC"
          underlineColorAndroid="transparent"
          selectionColor="#9b0737"
          textAlignVertical="center"
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: theme.spacing.sm,
  },
  input: {
    width: 36,
    height: 44,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.sm,
    textAlign: "center",
    fontSize: 18,
    marginHorizontal: 4,
    backgroundColor: theme.colors.surface,
  },
});
