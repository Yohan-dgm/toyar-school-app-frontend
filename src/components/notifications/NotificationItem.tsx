import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import type { UnifiedNotification } from "../../services/notifications/NotificationManager";

interface NotificationItemProps {
  notification: UnifiedNotification;
  onPress?: (notification: UnifiedNotification) => void;
  onMarkAsRead?: (id: string) => void;
  onDelete?: (id: string) => void;
  showActions?: boolean;
  compact?: boolean;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onPress,
  onMarkAsRead,
  onDelete,
  showActions = true,
  compact = false,
}) => {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "academic":
        return { name: "school", color: "#2196F3" };
      case "payment":
        return { name: "payment", color: "#FF9800" };
      case "event":
        return { name: "event", color: "#4CAF50" };
      case "security":
        return { name: "security", color: "#f44336" };
      case "system":
        return { name: "settings", color: "#9E9E9E" };
      case "communication":
        return { name: "message", color: "#9C27B0" };
      default:
        return { name: "notifications", color: "#607D8B" };
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "#f44336";
      case "medium":
        return "#FF9800";
      case "low":
        return "#4CAF50";
      default:
        return "#9E9E9E";
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 1) {
      return "Just now";
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours}h ago`;
    } else {
      const days = Math.floor(diffInMinutes / 1440);
      return `${days}d ago`;
    }
  };

  const typeIcon = getTypeIcon(notification.type);
  const priorityColor = getPriorityColor(notification.priority);

  return (
    <TouchableOpacity
      style={[
        styles.container,
        !notification.read && styles.unreadContainer,
        compact && styles.compactContainer,
      ]}
      onPress={() => onPress?.(notification)}
      activeOpacity={0.7}
    >
      {/* Priority indicator */}
      <View
        style={[styles.priorityIndicator, { backgroundColor: priorityColor }]}
      />

      {/* Content */}
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.typeContainer}>
            <MaterialIcons
              name={typeIcon.name as any}
              size={compact ? 16 : 20}
              color={typeIcon.color}
            />
            <Text style={[styles.typeText, compact && styles.compactText]}>
              {notification.type.toUpperCase()}
            </Text>
          </View>

          <View style={styles.metaContainer}>
            <Text style={[styles.timeText, compact && styles.compactText]}>
              {formatTime(notification.timestamp)}
            </Text>
            <MaterialIcons
              name={
                notification.source === "push"
                  ? "smartphone"
                  : notification.source === "websocket"
                    ? "wifi"
                    : "cloud"
              }
              size={compact ? 12 : 14}
              color="#9E9E9E"
            />
          </View>
        </View>

        {/* Title */}
        <Text
          style={[
            styles.title,
            !notification.read && styles.unreadTitle,
            compact && styles.compactTitle,
          ]}
          numberOfLines={compact ? 1 : 2}
        >
          {notification.title}
        </Text>

        {/* Body */}
        <Text
          style={[styles.body, compact && styles.compactBody]}
          numberOfLines={compact ? 1 : 3}
        >
          {notification.body}
        </Text>

        {/* Actions */}
        {showActions && !compact && (
          <View style={styles.actions}>
            {!notification.read && onMarkAsRead && (
              <TouchableOpacity
                style={[styles.actionButton, styles.readButton]}
                onPress={() => onMarkAsRead(notification.id)}
              >
                <MaterialIcons
                  name="mark-email-read"
                  size={16}
                  color="#4CAF50"
                />
                <Text style={[styles.actionText, { color: "#4CAF50" }]}>
                  Mark as Read
                </Text>
              </TouchableOpacity>
            )}

            {onDelete && (
              <TouchableOpacity
                style={[styles.actionButton, styles.deleteButton]}
                onPress={() => onDelete(notification.id)}
              >
                <MaterialIcons name="delete" size={16} color="#f44336" />
                <Text style={[styles.actionText, { color: "#f44336" }]}>
                  Delete
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>

      {/* Unread indicator */}
      {!notification.read && <View style={styles.unreadDot} />}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 8,
    marginVertical: 4,
    marginHorizontal: 16,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  unreadContainer: {
    backgroundColor: "#f8f9ff",
    borderLeftWidth: 4,
    borderLeftColor: "#2196F3",
  },
  compactContainer: {
    marginVertical: 2,
  },
  priorityIndicator: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 4,
    height: "100%",
  },
  content: {
    padding: 16,
    paddingRight: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  typeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  typeText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#666",
    marginLeft: 4,
    letterSpacing: 0.5,
  },
  metaContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  timeText: {
    fontSize: 12,
    color: "#9E9E9E",
    marginRight: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 4,
    lineHeight: 20,
  },
  unreadTitle: {
    fontWeight: "600",
    color: "#000",
  },
  body: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    marginBottom: 12,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: "#f5f5f5",
  },
  readButton: {
    backgroundColor: "#e8f5e8",
  },
  deleteButton: {
    backgroundColor: "#ffebee",
  },
  actionText: {
    fontSize: 12,
    fontWeight: "500",
    marginLeft: 4,
  },
  unreadDot: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#2196F3",
  },
  compactText: {
    fontSize: 10,
  },
  compactTitle: {
    fontSize: 14,
    marginBottom: 2,
  },
  compactBody: {
    fontSize: 12,
    marginBottom: 8,
  },
});

export default NotificationItem;
