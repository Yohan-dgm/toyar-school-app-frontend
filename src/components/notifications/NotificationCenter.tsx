import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Platform,
  Animated,
  Dimensions,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import NotificationList from "./NotificationList";
import NotificationBadge from "./NotificationBadge";
import NotificationManager, {
  UnifiedNotification,
} from "../../services/notifications/NotificationManager";

interface NotificationCenterProps {
  visible: boolean;
  onClose: () => void;
  onNotificationPress?: (notification: UnifiedNotification) => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  visible,
  onClose,
  onNotificationPress,
}) => {
  const insets = useSafeAreaInsets();
  const [slideAnim] = useState(
    new Animated.Value(Dimensions.get("window").height),
  );
  const [unreadCount, setUnreadCount] = useState(0);

  const loadUnreadCount = useCallback(async () => {
    try {
      const manager = NotificationManager.getInstance();
      const notifications = await manager.getAllNotifications();
      const unread = notifications.filter((n) => !n.read).length;
      setUnreadCount(unread);
    } catch (error) {
      console.error("Error loading unread count:", error);
    }
  }, []);

  const handleNotificationPress = useCallback(
    (notification: UnifiedNotification) => {
      onNotificationPress?.(notification);
      onClose();
    },
    [onNotificationPress, onClose],
  );

  // Load unread count on mount and when visible changes
  useEffect(() => {
    loadUnreadCount();
  }, [loadUnreadCount, visible]);

  // Animation effects
  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: Dimensions.get("window").height,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, slideAnim]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />

        <Animated.View
          style={[
            styles.container,
            {
              paddingTop:
                insets.top +
                (Platform.OS === "ios" ? 0 : StatusBar.currentHeight || 0),
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <View style={styles.titleContainer}>
                <MaterialIcons name="notifications" size={24} color="#333" />
                <Text style={styles.title}>Notifications</Text>
                {unreadCount > 0 && (
                  <NotificationBadge
                    count={unreadCount}
                    size="small"
                    style={{
                      position: "relative",
                      top: 0,
                      right: 0,
                      marginLeft: 8,
                    }}
                  />
                )}
              </View>

              <TouchableOpacity
                style={styles.closeButton}
                onPress={onClose}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <MaterialIcons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Notification List */}
          <View style={styles.content}>
            <NotificationList
              onNotificationPress={handleNotificationPress}
              showActions={true}
              compact={false}
              autoRefresh={true}
            />
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

interface NotificationIconProps {
  onPress: () => void;
  size?: number;
  color?: string;
  showBadge?: boolean;
  style?: any;
}

export const NotificationIcon: React.FC<NotificationIconProps> = ({
  onPress,
  size = 24,
  color = "#333",
  showBadge = true,
  style,
}) => {
  const [unreadCount, setUnreadCount] = useState(0);

  const loadUnreadCount = useCallback(async () => {
    try {
      const manager = NotificationManager.getInstance();
      const notifications = await manager.getAllNotifications();
      const unread = notifications.filter((n) => !n.read).length;
      setUnreadCount(unread);
    } catch (error) {
      console.error("Error loading unread count:", error);
    }
  }, []);

  useEffect(() => {
    loadUnreadCount();

    // Refresh count every 30 seconds
    const interval = setInterval(loadUnreadCount, 30000);
    return () => clearInterval(interval);
  }, [loadUnreadCount]);

  return (
    <TouchableOpacity
      style={[styles.iconContainer, style]}
      onPress={onPress}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    >
      <MaterialIcons name="notifications" size={size} color={color} />
      {showBadge && unreadCount > 0 && (
        <NotificationBadge count={unreadCount} size="small" />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  backdrop: {
    flex: 1,
  },
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#f5f5f5",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: "hidden",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },
  header: {
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    marginLeft: 8,
  },
  closeButton: {
    padding: 4,
  },
  content: {
    flex: 1,
  },
  iconContainer: {
    position: "relative",
  },
});

export default NotificationCenter;
