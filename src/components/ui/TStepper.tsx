import React from "react";
import { View, StyleSheet } from "react-native";
import { TStepperProps } from "../types";
import { theme } from "../styles/theme";

export const TStepper: React.FC<TStepperProps> = ({
  steps,
  currentStep,
  style,
  ...props
}) => (
  <View style={[styles.container, style]} {...props}>
    {Array.from({ length: steps }).map((_, idx) => (
      <View
        key={idx}
        style={[
          styles.step,
          idx <= currentStep ? styles.active : styles.inactive,
        ]}
      />
    ))}
  </View>
);

const styles = StyleSheet.create({
  container: { flexDirection: "row", alignItems: "center", marginVertical: 8 },
  step: {
    width: 24,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  active: { backgroundColor: theme.colors.primary },
  inactive: { backgroundColor: theme.colors.border },
});
