import React, { useState } from "react";
import { TextInput, View, Text, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { TInputFieldProps } from "../types";
import { theme } from "../styles/theme";

export const TInputField: React.FC<TInputFieldProps> = ({
  value,
  onChangeText,
  placeholder,
  variant = "default",
  error,
  success = false,
  style,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const animatedValue = useSharedValue(value ? 1 : 0);

  const handleFocus = () => {
    setIsFocused(true);
    if (variant === "floating") {
      animatedValue.value = withTiming(1, { duration: 200 });
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (variant === "floating" && !value) {
      animatedValue.value = withTiming(0, { duration: 200 });
    }
  };

  const animatedLabelStyle = useAnimatedStyle(() => ({
    top: animatedValue.value * (8 - 20) + 20, // interpolate from 20 to 8
    fontSize: animatedValue.value * (12 - 16) + 16, // interpolate from 16 to 12
  }));

  const borderColor = error
    ? theme.colors.error
    : success
      ? theme.colors.success
      : isFocused
        ? theme.colors.primary
        : theme.colors.border;

  return (
    <View style={[styles.container, style]}>
      {variant === "floating" && (
        <Animated.Text style={[styles.floatingLabel, animatedLabelStyle]}>
          {placeholder}
        </Animated.Text>
      )}
      <TextInput
        style={[
          styles.input,
          { borderColor },
          variant === "floating" && styles.floatingInput,
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={variant !== "floating" ? placeholder : ""}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholderTextColor={theme.colors.textSecondary}
        underlineColorAndroid="transparent"
        selectionColor="#9b0737"
        textAlignVertical="center"
        {...props}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: theme.spacing.sm,
  },
  input: {
    borderWidth: 1,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    fontSize: 16,
    color: theme.colors.text,
    minHeight: 44,
  },
  floatingInput: {
    paddingTop: theme.spacing.lg,
  },
  floatingLabel: {
    position: "absolute",
    left: theme.spacing.md,
    color: theme.colors.textSecondary,
    zIndex: 1,
  },
  errorText: {
    color: theme.colors.error,
    fontSize: 12,
    marginTop: theme.spacing.xs,
    marginLeft: theme.spacing.xs,
  },
});
