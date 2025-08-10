import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Alert,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import NotificationItem from "./NotificationItem";
import NotificationBadge from "./NotificationBadge";
import NotificationManager, {
  UnifiedNotification,
  NotificationFilter,
} from "../../services/notifications/NotificationManager";

interface NotificationListProps {
  onNotificationPress?: (notification: UnifiedNotification) => void;
  showActions?: boolean;
  compact?: boolean;
  maxItems?: number;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

export const NotificationList: React.FC<NotificationListProps> = ({
  onNotificationPress,
  showActions = true,
  compact = false,
  maxItems,
  autoRefresh = true,
  refreshInterval = 30000, // 30 seconds
}) => {
  const [notifications, setNotifications] = useState<UnifiedNotification[]>([]);
  const [filteredNotifications, setFilteredNotifications] = useState<
    UnifiedNotification[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<NotificationFilter>("all");
  const [unreadCount, setUnreadCount] = useState(0);

  const loadNotifications = useCallback(async () => {
    try {
      const manager = NotificationManager.getInstance();
      const allNotifications = await manager.getAllNotifications();
      setNotifications(allNotifications);

      // Apply filter
      const filtered = manager.getFilteredNotifications(filter);
      const finalList = maxItems ? filtered.slice(0, maxItems) : filtered;
      setFilteredNotifications(finalList);

      // Update unread count
      const unread = allNotifications.filter((n) => !n.read).length;
      setUnreadCount(unread);
    } catch (error) {
      console.error("Error loading notifications:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [filter, maxItems]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadNotifications();
  }, [loadNotifications]);

  const handleMarkAsRead = useCallback(
    async (id: string) => {
      try {
        const manager = NotificationManager.getInstance();
        await manager.markAsRead(id);
        loadNotifications();
      } catch (error) {
        console.error("Error marking notification as read:", error);
        Alert.alert("Error", "Failed to mark notification as read");
      }
    },
    [loadNotifications],
  );

  const handleDelete = useCallback(
    async (id: string) => {
      Alert.alert(
        "Delete Notification",
        "Are you sure you want to delete this notification?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Delete",
            style: "destructive",
            onPress: async () => {
              try {
                const manager = NotificationManager.getInstance();
                await manager.deleteNotification(id);
                loadNotifications();
              } catch (error) {
                console.error("Error deleting notification:", error);
                Alert.alert("Error", "Failed to delete notification");
              }
            },
          },
        ],
      );
    },
    [loadNotifications],
  );

  const handleMarkAllAsRead = useCallback(async () => {
    try {
      const manager = NotificationManager.getInstance();
      await manager.markAllAsRead();
      loadNotifications();
    } catch (error) {
      console.error("Error marking all as read:", error);
      Alert.alert("Error", "Failed to mark all notifications as read");
    }
  }, [loadNotifications]);

  const handleClearAll = useCallback(() => {
    Alert.alert(
      "Clear All Notifications",
      "Are you sure you want to clear all notifications? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear All",
          style: "destructive",
          onPress: async () => {
            try {
              const manager = NotificationManager.getInstance();
              await manager.clearAllNotifications();
              loadNotifications();
            } catch (error) {
              console.error("Error clearing notifications:", error);
              Alert.alert("Error", "Failed to clear notifications");
            }
          },
        },
      ],
    );
  }, [loadNotifications]);

  // Initial load
  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  // Auto refresh
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(loadNotifications, refreshInterval);
    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, loadNotifications]);

  // Filter options
  const filterOptions: {
    key: NotificationFilter;
    label: string;
    icon: string;
  }[] = [
    { key: "all", label: "All", icon: "notifications" },
    { key: "unread", label: "Unread", icon: "mark-email-unread" },
    { key: "academic", label: "Academic", icon: "school" },
    { key: "payment", label: "Payment", icon: "payment" },
    { key: "event", label: "Events", icon: "event" },
    { key: "communication", label: "Messages", icon: "message" },
  ];

  const renderFilterButton = ({
    item,
  }: {
    item: (typeof filterOptions)[0];
  }) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        filter === item.key && styles.activeFilterButton,
      ]}
      onPress={() => setFilter(item.key)}
    >
      <MaterialIcons
        name={item.icon as any}
        size={16}
        color={filter === item.key ? "#fff" : "#666"}
      />
      <Text
        style={[
          styles.filterText,
          filter === item.key && styles.activeFilterText,
        ]}
      >
        {item.label}
      </Text>
      {item.key === "unread" && unreadCount > 0 && (
        <NotificationBadge
          count={unreadCount}
          size="small"
          style={{ position: "relative", top: 0, right: 0 }}
        />
      )}
    </TouchableOpacity>
  );

  const renderNotification = ({ item }: { item: UnifiedNotification }) => (
    <NotificationItem
      notification={item}
      onPress={onNotificationPress}
      onMarkAsRead={handleMarkAsRead}
      onDelete={handleDelete}
      showActions={showActions}
      compact={compact}
    />
  );

  const renderHeader = () => (
    <View style={styles.header}>
      {/* Filter buttons */}
      <FlatList
        data={filterOptions}
        renderItem={renderFilterButton}
        keyExtractor={(item) => item.key}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterList}
        contentContainerStyle={styles.filterContent}
      />

      {/* Action buttons */}
      {!compact && (
        <View style={styles.actionBar}>
          <Text style={styles.countText}>
            {filteredNotifications.length} notification
            {filteredNotifications.length !== 1 ? "s" : ""}
            {unreadCount > 0 && ` (${unreadCount} unread)`}
          </Text>

          <View style={styles.actionButtons}>
            {unreadCount > 0 && (
              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleMarkAllAsRead}
              >
                <MaterialIcons
                  name="mark-email-read"
                  size={16}
                  color="#4CAF50"
                />
                <Text style={[styles.actionButtonText, { color: "#4CAF50" }]}>
                  Mark All Read
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleClearAll}
            >
              <MaterialIcons name="clear-all" size={16} color="#f44336" />
              <Text style={[styles.actionButtonText, { color: "#f44336" }]}>
                Clear All
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <MaterialIcons name="notifications-none" size={64} color="#ccc" />
      <Text style={styles.emptyTitle}>No notifications</Text>
      <Text style={styles.emptyText}>
        {filter === "all"
          ? "You're all caught up!"
          : `No ${filter} notifications found`}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {renderHeader()}

      <FlatList
        data={filteredNotifications}
        renderItem={renderNotification}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#2196F3"]}
            tintColor="#2196F3"
          />
        }
        ListEmptyComponent={!loading ? renderEmptyState : null}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          filteredNotifications.length === 0
            ? styles.emptyContainer
            : styles.listContent
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "#fff",
    paddingTop: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  filterList: {
    maxHeight: 50,
  },
  filterContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    borderRadius: 16,
    backgroundColor: "#f0f0f0",
  },
  activeFilterButton: {
    backgroundColor: "#2196F3",
  },
  filterText: {
    fontSize: 12,
    color: "#666",
    marginLeft: 4,
    fontWeight: "500",
  },
  activeFilterText: {
    color: "#fff",
  },
  actionBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  countText: {
    fontSize: 14,
    color: "#666",
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: "500",
    marginLeft: 4,
  },
  listContent: {
    paddingVertical: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
  },
  emptyState: {
    alignItems: "center",
    paddingHorizontal: 32,
    paddingVertical: 64,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    lineHeight: 20,
  },
});

export default NotificationList;
