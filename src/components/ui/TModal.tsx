import React from "react";
import { Modal, View, StyleSheet, TouchableOpacity } from "react-native";
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
    visible={visible}
    transparent={true}
    animationType="fade"
    onRequestClose={onDismiss}
    {...props}
  >
    <TouchableOpacity
      style={styles.overlay}
      activeOpacity={1}
      onPress={onDismiss}
    >
      <TouchableOpacity
        activeOpacity={1}
        onPress={(e) => e.stopPropagation()}
        style={[variant === "center" ? styles.centered : styles.bottom, style]}
      >
        <View style={styles.content}>{children}</View>
      </TouchableOpacity>
    </TouchableOpacity>
  </Modal>
);

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
  bottom: {
    justifyContent: "flex-end",
    alignItems: "center",
  },
  content: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    minWidth: 280,
    minHeight: 100,
    maxWidth: "90%",
  },
});
