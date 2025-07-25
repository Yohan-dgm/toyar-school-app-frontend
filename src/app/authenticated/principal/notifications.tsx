import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";

interface Notification {
  id: string;
  type: "message" | "alert" | "announcement" | "urgent";
  title: string;
  description: string;
  sender: string;
  timestamp: string;
  isRead: boolean;
}

interface MessageThread {
  id: string;
  participant: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  avatar?: string;
}

export default function PrincipalNotifications() {
  const [activeTab, setActiveTab] = useState<"notifications" | "messages">("notifications");

  const notifications: Notification[] = [
    {
      id: "1",
      type: "urgent",
      title: "Emergency Protocol Activated",
      description: "Fire drill scheduled for 2:00 PM today. All staff must participate.",
      sender: "Safety Department",
      timestamp: "10 minutes ago",
      isRead: false,
    },
    {
      id: "2",
      type: "announcement",
      title: "Parent-Teacher Conference Schedule",
      description: "Schedule for next week's parent-teacher conferences is now available.",
      sender: "Academic Office",
      timestamp: "1 hour ago",
      isRead: false,
    },
    {
      id: "3",
      type: "alert",
      title: "Budget Review Meeting",
      description: "Monthly budget review meeting scheduled for tomorrow at 9:00 AM.",
      sender: "Finance Department",
      timestamp: "2 hours ago",
      isRead: true,
    },
    {
      id: "4",
      type: "message",
      title: "Staff Meeting Minutes",
      description: "Meeting minutes from yesterday's staff meeting are ready for review.",
      sender: "Secretary Office",
      timestamp: "1 day ago",
      isRead: true,
    },
  ];

  const messageThreads: MessageThread[] = [
    {
      id: "1",
      participant: "Dr. Sarah Johnson (Vice Principal)",
      lastMessage: "The new curriculum implementation is going well...",
      timestamp: "5 minutes ago",
      unreadCount: 2,
    },
    {
      id: "2",
      participant: "Mark Thompson (Head of Mathematics)",
      lastMessage: "Can we discuss the math department budget?",
      timestamp: "1 hour ago",
      unreadCount: 1,
    },
    {
      id: "3",
      participant: "Emma Wilson (Parent Association)",
      lastMessage: "Thank you for approving the fundraising event",
      timestamp: "2 hours ago",
      unreadCount: 0,
    },
    {
      id: "4",
      participant: "David Lee (IT Department)",
      lastMessage: "System maintenance scheduled for this weekend",
      timestamp: "1 day ago",
      unreadCount: 0,
    },
  ];

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "urgent":
        return { icon: "warning", color: "#F44336" };
      case "announcement":
        return { icon: "campaign", color: "#2196F3" };
      case "alert":
        return { icon: "notifications-active", color: "#FF9800" };
      case "message":
        return { icon: "message", color: "#4CAF50" };
      default:
        return { icon: "notifications", color: "#999" };
    }
  };

  const renderNotification = (notification: Notification) => {
    const iconInfo = getNotificationIcon(notification.type);
    
    return (
      <TouchableOpacity
        key={notification.id}
        style={[
          styles.notificationCard,
          !notification.isRead && styles.unreadCard,
        ]}
        activeOpacity={0.7}
      >
        <View style={[styles.iconContainer, { backgroundColor: iconInfo.color + "15" }]}>
          <MaterialIcons name={iconInfo.icon} size={24} color={iconInfo.color} />
        </View>
        
        <View style={styles.notificationContent}>
          <View style={styles.notificationHeader}>
            <Text style={[styles.notificationTitle, !notification.isRead && styles.unreadTitle]}>
              {notification.title}
            </Text>
            <Text style={styles.timestamp}>{notification.timestamp}</Text>
          </View>
          <Text style={styles.notificationDescription}>
            {notification.description}
          </Text>
          <Text style={styles.sender}>From: {notification.sender}</Text>
        </View>
        
        {!notification.isRead && <View style={styles.unreadIndicator} />}
      </TouchableOpacity>
    );
  };

  const renderMessageThread = (thread: MessageThread) => (
    <TouchableOpacity
      key={thread.id}
      style={styles.messageCard}
      activeOpacity={0.7}
    >
      <View style={styles.avatarContainer}>
        <MaterialIcons name="person" size={24} color="#666" />
      </View>
      
      <View style={styles.messageContent}>
        <View style={styles.messageHeader}>
          <Text style={[styles.participantName, thread.unreadCount > 0 && styles.unreadTitle]}>
            {thread.participant}
          </Text>
          <View style={styles.messageInfo}>
            <Text style={styles.timestamp}>{thread.timestamp}</Text>
            {thread.unreadCount > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadCount}>{thread.unreadCount}</Text>
              </View>
            )}
          </View>
        </View>
        <Text style={styles.lastMessage} numberOfLines={2}>
          {thread.lastMessage}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notifications & Messages</Text>
        
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === "notifications" && styles.activeTab]}
            onPress={() => setActiveTab("notifications")}
          >
            <Text style={[styles.tabText, activeTab === "notifications" && styles.activeTabText]}>
              Notifications
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === "messages" && styles.activeTab]}
            onPress={() => setActiveTab("messages")}
          >
            <Text style={[styles.tabText, activeTab === "messages" && styles.activeTabText]}>
              Messages
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === "notifications" ? (
          <View style={styles.notificationsContainer}>
            {notifications.map((notification) => renderNotification(notification))}
          </View>
        ) : (
          <View style={styles.messagesContainer}>
            <View style={styles.composeContainer}>
              <TouchableOpacity style={styles.composeButton}>
                <MaterialIcons name="edit" size={20} color="white" />
                <Text style={styles.composeButtonText}>Compose Message</Text>
              </TouchableOpacity>
            </View>
            
            {messageThreads.map((thread) => renderMessageThread(thread))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 16,
    textAlign: "center",
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: 6,
  },
  activeTab: {
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabText: {
    fontSize: 14,
    color: "#666666",
    fontWeight: "500",
  },
  activeTabText: {
    color: "#2196F3",
    fontWeight: "600",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  notificationsContainer: {
    gap: 12,
    paddingBottom: 20,
  },
  notificationCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "flex-start",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  unreadCard: {
    borderLeftWidth: 4,
    borderLeftColor: "#2196F3",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 4,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1a1a1a",
    flex: 1,
    marginRight: 8,
  },
  unreadTitle: {
    fontWeight: "600",
  },
  timestamp: {
    fontSize: 12,
    color: "#999999",
  },
  notificationDescription: {
    fontSize: 14,
    color: "#666666",
    lineHeight: 18,
    marginBottom: 4,
  },
  sender: {
    fontSize: 12,
    color: "#999999",
    fontStyle: "italic",
  },
  unreadIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#2196F3",
    marginLeft: 8,
    marginTop: 4,
  },
  messagesContainer: {
    paddingBottom: 20,
  },
  composeContainer: {
    marginBottom: 20,
  },
  composeButton: {
    backgroundColor: "#2196F3",
    borderRadius: 8,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  composeButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  messageCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "flex-start",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  messageContent: {
    flex: 1,
  },
  messageHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 4,
  },
  participantName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1a1a1a",
    flex: 1,
  },
  messageInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  unreadBadge: {
    backgroundColor: "#2196F3",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 6,
  },
  unreadCount: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  lastMessage: {
    fontSize: 14,
    color: "#666666",
    lineHeight: 18,
  },
});