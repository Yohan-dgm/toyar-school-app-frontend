import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { TToastProps } from "../types";
import { theme } from "../styles/theme";

export const TToast: React.FC<TToastProps> = ({
  message,
  type = "info",
  duration = 2000,
  style,
  ...props
}) => {
  const fadeAnim = useSharedValue(0);

  useEffect(() => {
    fadeAnim.value = withTiming(1, { duration: 300 });
    const timer = setTimeout(() => {
      fadeAnim.value = withTiming(0, { duration: 300 });
    }, duration);
    return () => clearTimeout(timer);
  }, [duration]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: fadeAnim.value,
  }));

  return (
    <Animated.View
      style={[styles.toast, styles[type], style, animatedStyle]}
      {...props}
    >
      <Text style={styles.text}>{message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  toast: {
    position: "absolute",
    bottom: 40,
    left: 20,
    right: 20,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    zIndex: 1000,
  },
  success: { backgroundColor: theme.colors.success },
  error: { backgroundColor: theme.colors.error },
  info: { backgroundColor: theme.colors.primary },
  warning: { backgroundColor: theme.colors.warning },
  text: { color: theme.colors.background, fontWeight: "bold" },
});
