import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import {
  NotificationBadge,
  NotificationItem,
  NotificationList,
  NotificationCenter,
  NotificationIcon,
  useRealTimeNotifications,
  type UnifiedNotification,
} from "../notifications";
import PushNotificationService from "../../services/notifications/PushNotificationService";
import NotificationManager from "../../services/notifications/NotificationManager";

export const NotificationExamples: React.FC = () => {
  const [showNotificationCenter, setShowNotificationCenter] = useState(false);
  const [notificationStatus, setNotificationStatus] = useState({
    pushAvailable: false,
    localAvailable: false,
    token: null as string | null,
  });

  const {
    notifications,
    unreadCount,
    stats,
    isConnected,
    markAsRead,
    refreshNotifications,
  } = useRealTimeNotifications();

  // Check notification availability on mount
  useEffect(() => {
    const checkStatus = () => {
      const pushService = PushNotificationService.getInstance();
      setNotificationStatus({
        pushAvailable: pushService.isPushNotificationAvailable(),
        localAvailable: pushService.isLocalNotificationAvailable(),
        token: pushService.getPushToken(),
      });
    };

    checkStatus();
    // Check again after a short delay to catch async initialization
    const timer = setTimeout(checkStatus, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Sample notification data
  const sampleNotification: UnifiedNotification = {
    id: "sample-1",
    title: "New Assignment Posted",
    body: "Math homework for Chapter 5 has been assigned. Due date: Tomorrow 11:59 PM",
    type: "academic",
    priority: "high",
    source: "push",
    read: false,
    timestamp: new Date().toISOString(),
    data: {
      assignmentId: "123",
      subjectId: "math",
    },
  };

  const handleSendTestNotification = async () => {
    try {
      const pushService = PushNotificationService.getInstance();

      if (!pushService.isLocalNotificationAvailable()) {
        Alert.alert(
          "Not Available",
          "Notifications are not available on this device/simulator",
        );
        return;
      }

      await pushService.sendAcademicAlert(
        "Test Notification",
        "This is a test notification from the demo!",
      );

      const message = pushService.isPushNotificationAvailable()
        ? "Push notification sent!"
        : "Local notification sent! (Push notifications require valid Expo project ID)";

      Alert.alert("Success", message);
    } catch (error) {
      console.error("Error sending test notification:", error);
      Alert.alert(
        "Error",
        `Failed to send notification: ${error.message || error}`,
      );
    }
  };

  const handleGenerateLocalNotification = async () => {
    try {
      const notificationManager = NotificationManager.getInstance();
      await notificationManager.addLocalNotification({
        id: `demo-${Date.now()}`,
        title: "Demo Notification",
        body: `Generated at ${new Date().toLocaleTimeString()}`,
        type: "system",
        priority: "medium",
        source: "local",
        read: false,
        timestamp: new Date().toISOString(),
      });
      await refreshNotifications();
      Alert.alert("Success", "Local notification added!");
    } catch (error) {
      console.error("Error generating local notification:", error);
      Alert.alert("Error", "Failed to generate notification");
    }
  };

  const handleNotificationPress = (notification: UnifiedNotification) => {
    Alert.alert(
      "Notification Pressed",
      `You tapped on: ${notification.title}`,
      [
        { text: "Cancel" },
        {
          text: "Mark as Read",
          onPress: () => markAsRead(notification.id),
        },
      ],
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Notification System Examples</Text>
        <Text style={styles.subtitle}>
          Real-time notifications with push, WebSocket, and local support
        </Text>
      </View>

      {/* Connection Status */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Connection Status</Text>
        <View style={styles.statusContainer}>
          <View style={styles.statusItem}>
            <MaterialIcons
              name={isConnected ? "wifi" : "wifi-off"}
              size={20}
              color={isConnected ? "#4CAF50" : "#f44336"}
            />
            <Text
              style={[
                styles.statusText,
                { color: isConnected ? "#4CAF50" : "#f44336" },
              ]}
            >
              {isConnected ? "Connected" : "Disconnected"}
            </Text>
          </View>
          <Text style={styles.statsText}>
            {stats.total} total, {stats.unread} unread
          </Text>
        </View>
      </View>

      {/* Notification Capabilities */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notification Capabilities</Text>
        <View style={styles.capabilityContainer}>
          <View style={styles.capabilityItem}>
            <MaterialIcons
              name={notificationStatus.pushAvailable ? "send" : "send-disabled"}
              size={20}
              color={notificationStatus.pushAvailable ? "#4CAF50" : "#f44336"}
            />
            <Text
              style={[
                styles.capabilityText,
                {
                  color: notificationStatus.pushAvailable
                    ? "#4CAF50"
                    : "#f44336",
                },
              ]}
            >
              Push Notifications
            </Text>
          </View>

          <View style={styles.capabilityItem}>
            <MaterialIcons
              name={
                notificationStatus.localAvailable
                  ? "notifications-active"
                  : "notifications-off"
              }
              size={20}
              color={notificationStatus.localAvailable ? "#4CAF50" : "#f44336"}
            />
            <Text
              style={[
                styles.capabilityText,
                {
                  color: notificationStatus.localAvailable
                    ? "#4CAF50"
                    : "#f44336",
                },
              ]}
            >
              Local Notifications
            </Text>
          </View>
        </View>

        {notificationStatus.token && (
          <Text style={styles.tokenText}>
            Token: {notificationStatus.token.substring(0, 20)}...
          </Text>
        )}

        {!notificationStatus.pushAvailable && (
          <Text style={styles.warningText}>
            💡 To enable push notifications, configure a valid Expo project ID
            in your environment
          </Text>
        )}
      </View>

      {/* Notification Badge Examples */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notification Badges</Text>
        <View style={styles.badgeContainer}>
          <View style={styles.badgeExample}>
            <MaterialIcons name="mail" size={32} color="#666" />
            <NotificationBadge count={5} />
            <Text style={styles.badgeLabel}>Small (5)</Text>
          </View>

          <View style={styles.badgeExample}>
            <MaterialIcons name="notifications" size={32} color="#666" />
            <NotificationBadge count={23} size="medium" />
            <Text style={styles.badgeLabel}>Medium (23)</Text>
          </View>

          <View style={styles.badgeExample}>
            <MaterialIcons name="message" size={32} color="#666" />
            <NotificationBadge count={150} size="large" color="#FF9800" />
            <Text style={styles.badgeLabel}>Large (99+)</Text>
          </View>

          <View style={styles.badgeExample}>
            <MaterialIcons name="inbox" size={32} color="#666" />
            <NotificationBadge count={0} showZero />
            <Text style={styles.badgeLabel}>Zero Shown</Text>
          </View>
        </View>
      </View>

      {/* Single Notification Item */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notification Item</Text>
        <NotificationItem
          notification={sampleNotification}
          onPress={handleNotificationPress}
          onMarkAsRead={markAsRead}
          showActions={true}
        />
      </View>

      {/* Notification Icon with Center */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notification Center</Text>
        <View style={styles.centerContainer}>
          <NotificationIcon
            onPress={() => setShowNotificationCenter(true)}
            size={32}
            color="#2196F3"
            showBadge={true}
          />
          <Text style={styles.centerText}>
            Tap the notification icon to open the center
          </Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Test Actions</Text>
        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: "#4CAF50" }]}
            onPress={handleSendTestNotification}
          >
            <MaterialIcons name="send" size={20} color="#fff" />
            <Text style={styles.actionButtonText}>Send Push Notification</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: "#2196F3" }]}
            onPress={handleGenerateLocalNotification}
          >
            <MaterialIcons name="add-alert" size={20} color="#fff" />
            <Text style={styles.actionButtonText}>
              Generate Local Notification
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: "#FF9800" }]}
            onPress={refreshNotifications}
          >
            <MaterialIcons name="refresh" size={20} color="#fff" />
            <Text style={styles.actionButtonText}>Refresh Notifications</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Mini Notification List */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Notifications</Text>
        <View style={styles.miniListContainer}>
          <NotificationList
            onNotificationPress={handleNotificationPress}
            showActions={false}
            compact={true}
            maxItems={3}
            autoRefresh={false}
          />
        </View>
      </View>

      {/* Stats */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Statistics</Text>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.total}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: "#f44336" }]}>
              {stats.unread}
            </Text>
            <Text style={styles.statLabel}>Unread</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: "#FF9800" }]}>
              {stats.byPriority.high}
            </Text>
            <Text style={styles.statLabel}>High Priority</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: "#4CAF50" }]}>
              {Object.keys(stats.byType).length}
            </Text>
            <Text style={styles.statLabel}>Types</Text>
          </View>
        </View>
      </View>

      {/* Notification Center Modal */}
      <NotificationCenter
        visible={showNotificationCenter}
        onClose={() => setShowNotificationCenter(false)}
        onNotificationPress={handleNotificationPress}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "#fff",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  section: {
    backgroundColor: "#fff",
    marginTop: 8,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  statusContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statusItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusText: {
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 8,
  },
  statsText: {
    fontSize: 14,
    color: "#666",
  },
  capabilityContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginBottom: 12,
  },
  capabilityItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  capabilityText: {
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 8,
  },
  tokenText: {
    fontSize: 12,
    color: "#666",
    fontFamily: "monospace",
    marginBottom: 8,
  },
  warningText: {
    fontSize: 12,
    color: "#FF9800",
    backgroundColor: "#fff3e0",
    padding: 8,
    borderRadius: 4,
    textAlign: "center",
  },
  badgeContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  badgeExample: {
    alignItems: "center",
    position: "relative",
  },
  badgeLabel: {
    fontSize: 12,
    color: "#666",
    marginTop: 8,
  },
  centerContainer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  centerText: {
    fontSize: 14,
    color: "#666",
    marginTop: 12,
    textAlign: "center",
  },
  actionContainer: {
    gap: 12,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 8,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#fff",
    marginLeft: 8,
  },
  miniListContainer: {
    maxHeight: 300,
    borderRadius: 8,
    overflow: "hidden",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
});

export default NotificationExamples;
