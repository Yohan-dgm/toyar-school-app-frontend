import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { theme } from "../../../../styles/theme";

const NotificationsSection = ({ onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState("all"); // all, unread, academic, events, payments

  // Mock notification data - replace with real API data
  const mockNotifications = [
    {
      id: 1,
      title: "Assignment Due Tomorrow",
      message: "Math homework for Emma Johnson is due tomorrow at 9:00 AM",
      type: "academic",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      read: false,
      priority: "high",
    },
    {
      id: 2,
      title: "Parent-Teacher Meeting",
      message: "Scheduled meeting with Ms. Sarah Wilson on Friday, 2:00 PM",
      type: "events",
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      read: false,
      priority: "medium",
    },
    {
      id: 3,
      title: "Payment Confirmation",
      message: "Your payment of $250.00 for Term 2 fees has been processed successfully",
      type: "payments",
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      read: true,
      priority: "low",
    },
    {
      id: 4,
      title: "School Event: Science Fair",
      message: "Annual Science Fair will be held on March 15th. Students can register now.",
      type: "events",
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      read: true,
      priority: "medium",
    },
    {
      id: 5,
      title: "Grade Report Available",
      message: "Emma's Term 2 grade report is now available for download",
      type: "academic",
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      read: false,
      priority: "high",
    },
    {
      id: 6,
      title: "School Closure Notice",
      message: "School will be closed on March 10th due to national holiday",
      type: "events",
      timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      read: true,
      priority: "high",
    },
    {
      id: 7,
      title: "Fee Reminder",
      message: "Term 3 fees are due by March 20th. Please make payment to avoid late charges.",
      type: "payments",
      timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
      read: true,
      priority: "medium",
    },
    {
      id: 8,
      title: "Attendance Alert",
      message: "Emma's attendance is below 85%. Please ensure regular attendance.",
      type: "academic",
      timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
      read: true,
      priority: "high",
    },
  ];

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = () => {
    // Simulate API call
    setTimeout(() => {
      setNotifications(mockNotifications);
      setRefreshing(false);
    }, 1000);
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadNotifications();
  };

  const markAsRead = (notificationId) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const deleteNotification = (notificationId) => {
    Alert.alert(
      "Delete Notification",
      "Are you sure you want to delete this notification?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            setNotifications(prev =>
              prev.filter(notification => notification.id !== notificationId)
            );
          },
        },
      ]
    );
  };

  const getFilteredNotifications = () => {
    let filtered = notifications;

    switch (filter) {
      case "unread":
        filtered = notifications.filter(n => !n.read);
        break;
      case "academic":
        filtered = notifications.filter(n => n.type === "academic");
        break;
      case "events":
        filtered = notifications.filter(n => n.type === "events");
        break;
      case "payments":
        filtered = notifications.filter(n => n.type === "payments");
        break;
      default:
        filtered = notifications;
    }

    return filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "academic":
        return "school";
      case "events":
        return "event";
      case "payments":
        return "payment";
      default:
        return "notifications";
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "academic":
        return "#3B82F6";
      case "events":
        return "#10B981";
      case "payments":
        return "#F59E0B";
      default:
        return theme.colors.primary;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "#EF4444";
      case "medium":
        return "#F59E0B";
      case "low":
        return "#10B981";
      default:
        return "#6B7280";
    }
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) {
      return `${minutes}m ago`;
    } else if (hours < 24) {
      return `${hours}h ago`;
    } else {
      return `${days}d ago`;
    }
  };

  const filterOptions = [
    { key: "all", label: "All", count: notifications.length },
    { key: "unread", label: "Unread", count: notifications.filter(n => !n.read).length },
    { key: "academic", label: "Academic", count: notifications.filter(n => n.type === "academic").length },
    { key: "events", label: "Events", count: notifications.filter(n => n.type === "events").length },
    { key: "payments", label: "Payments", count: notifications.filter(n => n.type === "payments").length },
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <MaterialIcons name="close" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        {unreadCount > 0 && (
          <TouchableOpacity style={styles.markAllButton} onPress={markAllAsRead}>
            <Text style={styles.markAllButtonText}>Mark All Read</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {filterOptions.map((option) => (
            <TouchableOpacity
              key={option.key}
              style={[
                styles.filterTab,
                filter === option.key && styles.filterTabActive,
              ]}
              onPress={() => setFilter(option.key)}
            >
              <Text
                style={[
                  styles.filterTabText,
                  filter === option.key && styles.filterTabTextActive,
                ]}
              >
                {option.label}
              </Text>
              {option.count > 0 && (
                <View style={[
                  styles.filterBadge,
                  filter === option.key && styles.filterBadgeActive,
                ]}>
                  <Text style={[
                    styles.filterBadgeText,
                    filter === option.key && styles.filterBadgeTextActive,
                  ]}>
                    {option.count}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Notifications List */}
      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {getFilteredNotifications().length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialIcons name="notifications-none" size={64} color="#94A3B8" />
            <Text style={styles.emptyStateTitle}>No Notifications</Text>
            <Text style={styles.emptyStateMessage}>
              {filter === "unread" 
                ? "You're all caught up! No unread notifications."
                : "No notifications found for this category."}
            </Text>
          </View>
        ) : (
          getFilteredNotifications().map((notification) => (
            <TouchableOpacity
              key={notification.id}
              style={[
                styles.notificationCard,
                !notification.read && styles.notificationCardUnread,
              ]}
              onPress={() => markAsRead(notification.id)}
            >
              <View style={styles.notificationHeader}>
                <View style={styles.notificationIcon}>
                  <MaterialIcons
                    name={getTypeIcon(notification.type)}
                    size={20}
                    color={getTypeColor(notification.type)}
                  />
                </View>
                <View style={styles.notificationMeta}>
                  <View style={[
                    styles.priorityIndicator,
                    { backgroundColor: getPriorityColor(notification.priority) }
                  ]} />
                  <Text style={styles.notificationTime}>
                    {formatTimestamp(notification.timestamp)}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => deleteNotification(notification.id)}
                >
                  <MaterialIcons name="close" size={18} color="#94A3B8" />
                </TouchableOpacity>
              </View>
              
              <Text style={[
                styles.notificationTitle,
                !notification.read && styles.notificationTitleUnread,
              ]}>
                {notification.title}
              </Text>
              
              <Text style={styles.notificationMessage}>
                {notification.message}
              </Text>

              {!notification.read && <View style={styles.unreadIndicator} />}
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.lg,
    paddingTop: 60,
  },
  closeButton: {
    marginRight: theme.spacing.md,
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontFamily: theme.fonts.bold,
    color: "#FFFFFF",
  },
  markAllButton: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: theme.borderRadius.sm,
  },
  markAllButtonText: {
    fontSize: 14,
    fontFamily: theme.fonts.medium,
    color: "#FFFFFF",
  },
  filterContainer: {
    backgroundColor: "#FFFFFF",
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  filterTab: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    marginHorizontal: theme.spacing.xs,
    borderRadius: theme.borderRadius.full,
    backgroundColor: "#F1F5F9",
  },
  filterTabActive: {
    backgroundColor: theme.colors.primary,
  },
  filterTabText: {
    fontSize: 14,
    fontFamily: theme.fonts.medium,
    color: "#64748B",
  },
  filterTabTextActive: {
    color: "#FFFFFF",
  },
  filterBadge: {
    marginLeft: theme.spacing.xs,
    paddingHorizontal: 6,
    paddingVertical: 2,
    backgroundColor: "#E2E8F0",
    borderRadius: theme.borderRadius.full,
    minWidth: 20,
    alignItems: "center",
  },
  filterBadgeActive: {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
  filterBadgeText: {
    fontSize: 12,
    fontFamily: theme.fonts.bold,
    color: "#64748B",
  },
  filterBadgeTextActive: {
    color: "#FFFFFF",
  },
  content: {
    flex: 1,
    padding: theme.spacing.md,
  },
  notificationCard: {
    backgroundColor: "#FFFFFF",
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    position: "relative",
  },
  notificationCardUnread: {
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary,
    backgroundColor: "#FEFEFE",
  },
  notificationHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.sm,
  },
  notificationIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
    marginRight: theme.spacing.sm,
  },
  notificationMeta: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  priorityIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: theme.spacing.sm,
  },
  notificationTime: {
    fontSize: 12,
    fontFamily: theme.fonts.regular,
    color: "#94A3B8",
  },
  deleteButton: {
    padding: theme.spacing.xs,
  },
  notificationTitle: {
    fontSize: 16,
    fontFamily: theme.fonts.medium,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  notificationTitleUnread: {
    fontFamily: theme.fonts.bold,
  },
  notificationMessage: {
    fontSize: 14,
    fontFamily: theme.fonts.regular,
    color: "#64748B",
    lineHeight: 20,
  },
  unreadIndicator: {
    position: "absolute",
    top: theme.spacing.md,
    right: theme.spacing.md,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.primary,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: theme.spacing.xl * 2,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontFamily: theme.fonts.bold,
    color: theme.colors.text,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  emptyStateMessage: {
    fontSize: 14,
    fontFamily: theme.fonts.regular,
    color: "#64748B",
    textAlign: "center",
    paddingHorizontal: theme.spacing.xl,
  },
});

export default NotificationsSection;
