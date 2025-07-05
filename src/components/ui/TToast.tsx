import React, { useEffect } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { TToastProps } from "../types";
import { theme } from "../styles/theme";

export const TToast: React.FC<TToastProps> = ({
  message,
  type = "info",
  duration = 2000,
  style,
  ...props
}) => {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }, duration);
    return () => clearTimeout(timer);
  }, [fadeAnim, duration]);

  return (
    <Animated.View
      style={[styles.toast, styles[type], style, { opacity: fadeAnim }]}
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
