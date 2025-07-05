import React from "react";
import Modal from "react-native-modal";
import { View, StyleSheet } from "react-native";
import { TModalProps } from "../types";
import { theme } from "../styles/theme";

export const TModal: React.FC<TModalProps> = ({
  visible,
  onDismiss,
  children,
  variant = "center",
  style,
  ...props
}) => (
  <Modal
    isVisible={visible}
    onBackdropPress={onDismiss}
    style={[variant === "center" ? styles.centered : styles.bottom, style]}
    {...props}
  >
    <View style={styles.content}>{children}</View>
  </Modal>
);

const styles = StyleSheet.create({
  centered: {
    justifyContent: "center",
    alignItems: "center",
    margin: 0,
  },
  bottom: {
    justifyContent: "flex-end",
    margin: 0,
  },
  content: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    minWidth: 280,
    minHeight: 100,
  },
});
