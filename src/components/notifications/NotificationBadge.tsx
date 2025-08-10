import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface NotificationBadgeProps {
  count: number;
  maxCount?: number;
  size?: "small" | "medium" | "large";
  color?: string;
  textColor?: string;
  showZero?: boolean;
  style?: any;
}

export const NotificationBadge: React.FC<NotificationBadgeProps> = ({
  count,
  maxCount = 99,
  size = "medium",
  color = "#f44336",
  textColor = "#fff",
  showZero = false,
  style,
}) => {
  if (count === 0 && !showZero) {
    return null;
  }

  const displayCount = count > maxCount ? `${maxCount}+` : count.toString();
  const sizeStyle = getSize(size);

  return (
    <View style={[styles.badge, sizeStyle, { backgroundColor: color }, style]}>
      <Text
        style={[styles.text, getTextSize(size), { color: textColor }]}
        numberOfLines={1}
        adjustsFontSizeToFit
      >
        {displayCount}
      </Text>
    </View>
  );
};

const getSize = (size: "small" | "medium" | "large") => {
  switch (size) {
    case "small":
      return { minWidth: 16, height: 16, borderRadius: 8 };
    case "large":
      return { minWidth: 28, height: 28, borderRadius: 14 };
    default:
      return { minWidth: 20, height: 20, borderRadius: 10 };
  }
};

const getTextSize = (size: "small" | "medium" | "large") => {
  switch (size) {
    case "small":
      return { fontSize: 10 };
    case "large":
      return { fontSize: 14 };
    default:
      return { fontSize: 12 };
  }
};

const styles = StyleSheet.create({
  badge: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
    position: "absolute",
    top: -8,
    right: -8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  text: {
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default NotificationBadge;
