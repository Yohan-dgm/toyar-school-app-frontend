import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { MaterialIcons } from "@expo/vector-icons";
import { theme } from "../../../../styles/theme";
import { USER_CATEGORIES } from "../../../../constants/userCategories";

const EducatorNotificationsMain = () => {
  const dispatch = useDispatch();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [refreshing, setRefreshing] = useState(false);
  const [notifications, setNotifications] = useState([]);

  // Get global state
  const { sessionData } = useSelector((state) => state.app);

  // Notification categories
  const categories = [
    { id: "all", label: "All", icon: "notifications", count: 0 },
    { id: "system", label: "System", icon: "settings", count: 0 },
    { id: "student", label: "Student", icon: "person", count: 0 },
    { id: "schedule", label: "Schedule", icon: "schedule", count: 0 },
    { id: "feedback", label: "Feedback", icon: "rate-review", count: 0 },
    { id: "attendance", label: "Attendance", icon: "how-to-reg", count: 0 },
  ];

  // Mock notifications data
  useEffect(() => {
    const mockNotifications = [
      {
        id: 1,
        category: "system",
        title: "System Maintenance",
        message: "Scheduled maintenance will occur tonight from 11 PM to 1 AM",
        timestamp: "2025-01-17T10:30:00Z",
        read: false,
        priority: "medium",
        icon: "settings",
      },
      {
        id: 2,
        category: "student",
        title: "New Student Enrollment",
        message: "Sarah Wilson has been enrolled in your Grade 5 class",
        timestamp: "2025-01-17T09:15:00Z",
        read: false,
        priority: "high",
        icon: "person_add",
      },
      {
        id: 3,
        category: "schedule",
        title: "Class Schedule Change",
        message: "Mathematics class moved from 10 AM to 11 AM tomorrow",
        timestamp: "2025-01-17T08:45:00Z",
        read: true,
        priority: "high",
        icon: "schedule",
      },
      {
        id: 4,
        category: "feedback",
        title: "Feedback Approved",
        message: "Your feedback for John Doe has been approved by the principal",
        timestamp: "2025-01-16T16:20:00Z",
        read: true,
        priority: "low",
        icon: "check_circle",
      },
      {
        id: 5,
        category: "attendance",
        title: "Attendance Reminder",
        message: "Please submit today's attendance by 3 PM",
        timestamp: "2025-01-16T14:00:00Z",
        read: false,
        priority: "medium",
        icon: "how_to_reg",
      },
      {
        id: 6,
        category: "student",
        title: "Parent Meeting Request",
        message: "Mrs. Smith requested a meeting regarding Jane's progress",
        timestamp: "2025-01-16T11:30:00Z",
        read: false,
        priority: "high",
        icon: "meeting_room",
      },
      {
        id: 7,
        category: "system",
        title: "New Feature Available",
        message: "Student analysis dashboard is now available in User Actions",
        timestamp: "2025-01-15T13:45:00Z",
        read: true,
        priority: "low",
        icon: "new_releases",
      },
    ];

    setNotifications(mockNotifications);
  }, []);

  // Update category counts
  useEffect(() => {
    const updatedCategories = categories.map((category) => {
      if (category.id === "all") {
        return { ...category, count: notifications.filter(n => !n.read).length };
      }
      return {
        ...category,
        count: notifications.filter(n => n.category === category.id && !n.read).length,
      };
    });
    // Note: In a real app, you'd update the categories state here
  }, [notifications]);

  // Filter notifications based on selected category
  const filteredNotifications = selectedCategory === "all"
    ? notifications
    : notifications.filter(n => n.category === selectedCategory);

  const onRefresh = async () => {
    setRefreshing(true);
    // TODO: Implement API call to refresh notifications
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
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

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const notificationTime = new Date(timestamp);
    const diffInHours = Math.floor((now - notificationTime) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return notificationTime.toLocaleDateString();
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high": return "#F44336";
      case "medium": return "#FF9800";
      case "low": return "#4CAF50";
      default: return theme.colors.textSecondary;
    }
  };

  const renderCategoryTabs = () => (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer}>
      {categories.map((category) => (
        <TouchableOpacity
          key={category.id}
          style={[
            styles.categoryTab,
            selectedCategory === category.id && styles.selectedCategoryTab,
          ]}
          onPress={() => setSelectedCategory(category.id)}
        >
          <MaterialIcons
            name={category.icon}
            size={18}
            color={selectedCategory === category.id ? "white" : theme.colors.textSecondary}
          />
          <Text
            style={[
              styles.categoryText,
              selectedCategory === category.id && styles.selectedCategoryText,
            ]}
          >
            {category.label}
          </Text>
          {category.count > 0 && (
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryBadgeText}>{category.count}</Text>
            </View>
          )}
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const renderNotificationItem = (notification) => (
    <TouchableOpacity
      key={notification.id}
      style={[
        styles.notificationItem,
        !notification.read && styles.unreadNotification,
      ]}
      onPress={() => markAsRead(notification.id)}
    >
      <View style={styles.notificationHeader}>
        <View style={styles.notificationIconContainer}>
          <MaterialIcons
            name={notification.icon}
            size={24}
            color={getPriorityColor(notification.priority)}
          />
        </View>
        <View style={styles.notificationContent}>
          <View style={styles.notificationTitleRow}>
            <Text style={styles.notificationTitle}>{notification.title}</Text>
            {!notification.read && <View style={styles.unreadDot} />}
          </View>
          <Text style={styles.notificationMessage}>{notification.message}</Text>
          <Text style={styles.notificationTime}>{getTimeAgo(notification.timestamp)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <MaterialIcons name="notifications" size={24} color={theme.colors.primary} />
          <Text style={styles.headerTitle}>Notifications</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.markAllButton} onPress={markAllAsRead}>
            <MaterialIcons name="done-all" size={20} color={theme.colors.primary} />
            <Text style={styles.markAllText}>Mark All Read</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Category Tabs */}
      {renderCategoryTabs()}

      {/* Notifications List */}
      <ScrollView
        style={styles.notificationsList}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Text style={styles.resultsText}>
          {filteredNotifications.length} notification{filteredNotifications.length !== 1 ? 's' : ''}
          {selectedCategory !== "all" && ` in ${categories.find(c => c.id === selectedCategory)?.label}`}
        </Text>
        
        {filteredNotifications.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialIcons name="notifications-none" size={64} color={theme.colors.textSecondary} />
            <Text style={styles.emptyStateText}>No notifications found</Text>
            <Text style={styles.emptyStateSubtext}>
              You're all caught up! Check back later for updates.
            </Text>
          </View>
        ) : (
          filteredNotifications.map(renderNotificationItem)
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    backgroundColor: theme.colors.card,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.sm,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
  },
  headerActions: {
    alignItems: "flex-end",
  },
  markAllButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
  },
  markAllText: {
    fontSize: 14,
    color: theme.colors.primary,
    marginLeft: theme.spacing.xs,
  },
  categoriesContainer: {
    backgroundColor: theme.colors.card,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  categoryTab: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.background,
    marginRight: theme.spacing.sm,
    position: "relative",
  },
  selectedCategoryTab: {
    backgroundColor: theme.colors.primary,
  },
  categoryText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginLeft: theme.spacing.xs,
  },
  selectedCategoryText: {
    color: "white",
    fontWeight: "600",
  },
  categoryBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "#F44336",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  categoryBadgeText: {
    fontSize: 12,
    color: "white",
    fontWeight: "bold",
  },
  notificationsList: {
    flex: 1,
    paddingHorizontal: theme.spacing.md,
  },
  resultsText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginVertical: theme.spacing.md,
  },
  notificationItem: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  unreadNotification: {
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary,
  },
  notificationHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  notificationIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.background,
    justifyContent: "center",
    alignItems: "center",
    marginRight: theme.spacing.md,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.xs,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
    flex: 1,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.primary,
    marginLeft: theme.spacing.sm,
  },
  notificationMessage: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    lineHeight: 20,
    marginBottom: theme.spacing.sm,
  },
  notificationTime: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: theme.spacing.xl * 2,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.colors.text,
    marginTop: theme.spacing.md,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: "center",
    marginTop: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
  },
});

export default EducatorNotificationsMain;
