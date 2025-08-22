import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { PaymentStatus } from "../../types/payment";

interface PaymentStatusBadgeProps {
  status: PaymentStatus;
  size?: "small" | "medium" | "large";
}

const PaymentStatusBadge: React.FC<PaymentStatusBadgeProps> = ({
  status,
  size = "medium",
}) => {
  const sizeStyles = {
    small: { paddingHorizontal: 8, paddingVertical: 4, fontSize: 10 },
    medium: { paddingHorizontal: 12, paddingVertical: 6, fontSize: 12 },
    large: { paddingHorizontal: 16, paddingVertical: 8, fontSize: 14 },
  };

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: status.color },
        {
          paddingHorizontal: sizeStyles[size].paddingHorizontal,
          paddingVertical: sizeStyles[size].paddingVertical,
        },
      ]}
    >
      <Text style={[styles.text, { fontSize: sizeStyles[size].fontSize }]}>
        {status.label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  text: {
    color: "#FFFFFF",
    fontWeight: "600",
    textAlign: "center",
  },
});

export default PaymentStatusBadge;
