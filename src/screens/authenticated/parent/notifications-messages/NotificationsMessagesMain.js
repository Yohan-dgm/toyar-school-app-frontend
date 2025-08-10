import React, { useEffect, useState } from "react";
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
import { transformStudentWithProfilePicture } from "../../../../utils/studentProfileUtils";
import { USER_CATEGORIES } from "../../../../constants/userCategories";
import { setSelectedStudent } from "../../../../state-store/slices/app-slice";

const NotificationsMessagesMain = () => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("notifications"); // "notifications" or "messages"
  const [filter, setFilter] = useState("all"); // "all", "unread", "academic", "events", "payments"
  const [refreshing, setRefreshing] = useState(false);

  // Get global state
  const { sessionData, selectedStudent } = useSelector((state) => state.app);

  // Get user category from session data
  const userCategory =
    sessionData?.user_category || sessionData?.data?.user_category;
  const isParent = userCategory === USER_CATEGORIES.PARENT;

  // Get student data from backend API response
  const backendStudentList = sessionData?.data?.student_list || [];

  // Transform backend student data to match UI requirements
  const students = backendStudentList.map((student) => {
    return transformStudentWithProfilePicture(student, sessionData);
  });

  // Auto-select first student if none selected and students are available
  useEffect(() => {
    if (students.length > 0 && !selectedStudent) {
      console.log(
        `🔔 NotificationsMessagesMain - Auto-selecting first student: ${students[0]?.student_calling_name}`,
      );
      dispatch(setSelectedStudent(students[0]));
    }
  }, [students.length, selectedStudent, dispatch]);

  // Mock notifications data
  const notifications = [
    {
      id: 1,
      title: "Assignment Due Tomorrow",
      message:
        "Mathematics homework is due tomorrow. Please ensure completion.",
      type: "academic",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      read: false,
      priority: "high",
      studentId: selectedStudent?.student_id,
    },
    {
      id: 2,
      title: "Parent-Teacher Meeting",
      message: "Scheduled meeting with Ms. Johnson on March 15th at 3:00 PM",
      type: "events",
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
      read: false,
      priority: "medium",
      studentId: selectedStudent?.student_id,
    },
    {
      id: 3,
      title: "Fee Payment Confirmation",
      message: "Term 2 fees payment has been successfully processed.",
      type: "payments",
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      read: true,
      priority: "low",
      studentId: selectedStudent?.student_id,
    },
    {
      id: 4,
      title: "Sports Day Registration",
      message: "Register for annual sports day events. Deadline: March 20th",
      type: "events",
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      read: true,
      priority: "medium",
      studentId: selectedStudent?.student_id,
    },
  ];

  // Mock messages data
  const messages = [
    {
      id: 1,
      sender: "Ms. Johnson",
      subject: "Math Assignment Feedback",
      message: "Great work on the algebra problems! Keep up the good effort.",
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
      read: false,
      type: "teacher",
      studentId: selectedStudent?.student_id,
    },
    {
      id: 2,
      sender: "School Administration",
      subject: "Uniform Policy Update",
      message: "Please note the updated uniform policy effective next term.",
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
      read: true,
      type: "admin",
      studentId: selectedStudent?.student_id,
    },
    {
      id: 3,
      sender: "Coach Williams",
      subject: "Basketball Practice",
      message: "Practice has been moved to 4:00 PM tomorrow due to weather.",
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      read: true,
      type: "coach",
      studentId: selectedStudent?.student_id,
    },
  ];

  // Debug logging
  console.log(
    "🔔 NotificationsMessagesMain - User category:",
    userCategory,
    "Is parent:",
    isParent,
  );
  console.log(
    "🔔 NotificationsMessagesMain - Students count:",
    students.length,
  );
  console.log(
    "🔔 NotificationsMessagesMain - Selected student:",
    selectedStudent?.student_calling_name,
  );

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const getFilteredNotifications = () => {
    let filtered = notifications;

    if (filter === "unread") {
      filtered = filtered.filter((n) => !n.read);
    } else if (filter !== "all") {
      filtered = filtered.filter((n) => n.type === filter);
    }

    return filtered;
  };

  const getUnreadCount = () => {
    return notifications.filter((n) => !n.read).length;
  };

  const getUnreadMessagesCount = () => {
    return messages.filter((m) => !m.read).length;
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (hours < 1) return "Just now";
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return timestamp.toLocaleDateString();
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "academic":
        return "school";
      case "events":
        return "event";
      case "payments":
        return "payment";
      case "teacher":
        return "person";
      case "admin":
        return "admin-panel-settings";
      case "coach":
        return "sports";
      default:
        return "notifications";
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "academic":
        return "#2196F3";
      case "events":
        return "#FF9800";
      case "payments":
        return "#4CAF50";
      case "teacher":
        return "#9C27B0";
      case "admin":
        return "#F44336";
      case "coach":
        return "#795548";
      default:
        return "#666666";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "#F44336";
      case "medium":
        return "#FF9800";
      case "low":
        return "#4CAF50";
      default:
        return "#666666";
    }
  };

  const tabs = [
    {
      id: "notifications",
      title: "Notifications",
      icon: "notifications",
      count: getUnreadCount(),
    },
    {
      id: "messages",
      title: "Messages",
      icon: "message",
      count: getUnreadMessagesCount(),
    },
  ];

  const filterOptions = [
    { id: "all", title: "All", icon: "list" },
    { id: "unread", title: "Unread", icon: "mark-email-unread" },
    { id: "academic", title: "Academic", icon: "school" },
    { id: "events", title: "Events", icon: "event" },
    { id: "payments", title: "Payments", icon: "payment" },
  ];

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.headerSection}>
        <Text style={styles.welcomeText}>Notifications & Messages</Text>
        {isParent && selectedStudent && (
          <Text style={styles.studentText}>
            Updates for {selectedStudent.student_calling_name} -{" "}
            {selectedStudent.grade}
          </Text>
        )}
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[
              styles.tabButton,
              activeTab === tab.id && styles.activeTabButton,
            ]}
            onPress={() => setActiveTab(tab.id)}
          >
            <View style={styles.tabIconContainer}>
              <MaterialIcons
                name={tab.icon}
                size={20}
                color={activeTab === tab.id ? "#FFFFFF" : "#666666"}
              />
              {tab.count > 0 && (
                <View style={styles.tabBadge}>
                  <Text style={styles.tabBadgeText}>{tab.count}</Text>
                </View>
              )}
            </View>
            <Text
              style={[
                styles.tabText,
                activeTab === tab.id && styles.activeTabText,
              ]}
            >
              {tab.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Filter Bar (only for notifications) */}
      {activeTab === "notifications" && (
        <View style={styles.filterContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {filterOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.filterButton,
                  filter === option.id && styles.activeFilterButton,
                ]}
                onPress={() => setFilter(option.id)}
              >
                <MaterialIcons
                  name={option.icon}
                  size={16}
                  color={filter === option.id ? "#FFFFFF" : "#666666"}
                />
                <Text
                  style={[
                    styles.filterText,
                    filter === option.id && styles.activeFilterText,
                  ]}
                >
                  {option.title}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Content */}
      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {activeTab === "notifications" ? (
          // Notifications List
          getFilteredNotifications().length === 0 ? (
            <View style={styles.emptyState}>
              <MaterialIcons
                name="notifications-none"
                size={64}
                color="#CCCCCC"
              />
              <Text style={styles.emptyStateText}>No Notifications</Text>
              <Text style={styles.emptyStateSubtext}>
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
                  styles.itemCard,
                  !notification.read && styles.unreadCard,
                ]}
              >
                <View style={styles.itemHeader}>
                  <View style={styles.itemIconContainer}>
                    <MaterialIcons
                      name={getTypeIcon(notification.type)}
                      size={24}
                      color={getTypeColor(notification.type)}
                    />
                  </View>
                  <View style={styles.itemInfo}>
                    <View style={styles.itemTitleRow}>
                      <Text style={styles.itemTitle}>{notification.title}</Text>
                      <View style={styles.itemMeta}>
                        <View
                          style={[
                            styles.priorityDot,
                            {
                              backgroundColor: getPriorityColor(
                                notification.priority,
                              ),
                            },
                          ]}
                        />
                        <Text style={styles.itemTimestamp}>
                          {formatTimestamp(notification.timestamp)}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.itemMessage} numberOfLines={2}>
                      {notification.message}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )
        ) : // Messages List
        messages.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialIcons name="message" size={64} color="#CCCCCC" />
            <Text style={styles.emptyStateText}>No Messages</Text>
            <Text style={styles.emptyStateSubtext}>
              No messages from teachers or school administration.
            </Text>
          </View>
        ) : (
          messages.map((message) => (
            <TouchableOpacity
              key={message.id}
              style={[styles.itemCard, !message.read && styles.unreadCard]}
            >
              <View style={styles.itemHeader}>
                <View style={styles.itemIconContainer}>
                  <MaterialIcons
                    name={getTypeIcon(message.type)}
                    size={24}
                    color={getTypeColor(message.type)}
                  />
                </View>
                <View style={styles.itemInfo}>
                  <View style={styles.itemTitleRow}>
                    <Text style={styles.itemTitle}>{message.subject}</Text>
                    <Text style={styles.itemTimestamp}>
                      {formatTimestamp(message.timestamp)}
                    </Text>
                  </View>
                  <Text style={styles.itemSender}>From: {message.sender}</Text>
                  <Text style={styles.itemMessage} numberOfLines={2}>
                    {message.message}
                  </Text>
                </View>
              </View>
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
    backgroundColor: "#FFFFFF",
  },
  headerSection: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
    backgroundColor: "#FFFFFF",
  },
  welcomeText: {
    fontFamily: theme.fonts.bold,
    fontSize: 24,
    color: "#000000",
    marginBottom: 4,
  },
  studentText: {
    fontFamily: theme.fonts.regular,
    fontSize: 14,
    color: "#666666",
  },
  tabContainer: {
    flexDirection: "row",
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    backgroundColor: "#F8F9FA",
    gap: 8,
  },
  tabButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    gap: 8,
  },
  activeTabButton: {
    backgroundColor: theme.colors.primary,
  },
  tabIconContainer: {
    position: "relative",
  },
  tabBadge: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: "#F44336",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  tabBadgeText: {
    fontFamily: theme.fonts.bold,
    fontSize: 12,
    color: "#FFFFFF",
  },
  tabText: {
    fontFamily: theme.fonts.medium,
    fontSize: 14,
    color: "#666666",
    textAlign: "center",
  },
  activeTabText: {
    color: "#FFFFFF",
  },
  filterContainer: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    backgroundColor: "#F8F9FA",
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    gap: 6,
  },
  activeFilterButton: {
    backgroundColor: theme.colors.primary,
  },
  filterText: {
    fontFamily: theme.fonts.medium,
    fontSize: 12,
    color: "#666666",
  },
  activeFilterText: {
    color: "#FFFFFF",
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyStateText: {
    fontFamily: theme.fonts.bold,
    fontSize: 18,
    color: "#666666",
    marginTop: theme.spacing.md,
  },
  emptyStateSubtext: {
    fontFamily: theme.fonts.regular,
    fontSize: 14,
    color: "#999999",
    marginTop: theme.spacing.sm,
    textAlign: "center",
  },
  itemCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: theme.spacing.md,
    marginVertical: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  unreadCard: {
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary,
  },
  itemHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  itemIconContainer: {
    marginRight: 12,
    marginTop: 2,
  },
  itemInfo: {
    flex: 1,
  },
  itemTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 4,
  },
  itemTitle: {
    fontFamily: theme.fonts.bold,
    fontSize: 16,
    color: "#000000",
    flex: 1,
    marginRight: 8,
  },
  itemMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  itemTimestamp: {
    fontFamily: theme.fonts.regular,
    fontSize: 12,
    color: "#999999",
  },
  itemSender: {
    fontFamily: theme.fonts.medium,
    fontSize: 14,
    color: "#666666",
    marginBottom: 4,
  },
  itemMessage: {
    fontFamily: theme.fonts.regular,
    fontSize: 14,
    color: "#666666",
    lineHeight: 20,
  },
});

export default NotificationsMessagesMain;
