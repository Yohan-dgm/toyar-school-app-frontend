import React from "react";
import { View, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { TCardProps } from "../types";
import { theme } from "../styles/theme";

export const TCard: React.FC<TCardProps> = ({
  children,
  variant = "elevated",
  style,
  ...props
}) => {
  if (variant === "gradient") {
    return (
      <LinearGradient
        colors={[
          "rgba(155, 7, 55, 0.1)",
          "rgba(255, 107, 107, 0.08)",
          "rgba(76, 205, 196, 0.06)",
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.base, styles.gradient, style]}
        {...props}
      >
        {children}
      </LinearGradient>
    );
  }

  return (
    <View style={[styles.base, styles[variant], style]} {...props}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: 20,
    padding: 20,
    marginVertical: 8,
  },
  elevated: {
    backgroundColor: "#ffffff",
    shadowColor: "#9b0737",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 5,
    borderWidth: 1,
    borderColor: "rgba(155, 7, 55, 0.08)",
  },
  outlined: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "rgba(155, 7, 55, 0.2)",
  },
  glassmorphism: {
    backgroundColor: "rgba(255,255,255,0.85)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.4)",
    shadowColor: "#9b0737",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 8,
    backdropFilter: "blur(20px)",
  },
  gradient: {
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
    shadowColor: "#9b0737",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 6,
  },
  modernCard: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    shadowColor: "#9b0737",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
    borderWidth: 1,
    borderColor: "rgba(155, 7, 55, 0.05)",
    transform: [{ scale: 1 }],
  },
  floatingCard: {
    backgroundColor: "#ffffff",
    borderRadius: 28,
    shadowColor: "#9b0737",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 12,
    borderWidth: 1,
    borderColor: "rgba(155, 7, 55, 0.03)",
    transform: [{ translateY: -2 }],
  },
});
