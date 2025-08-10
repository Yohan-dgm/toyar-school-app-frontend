import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { Alert, Platform } from "react-native";
import { useSelector } from "react-redux";
import NotificationManager, {
  UnifiedNotification,
  NotificationStats,
} from "../../services/notifications/NotificationManager";
import WebSocketService from "../../services/websocket/WebSocketService";
import PushNotificationService from "../../services/notifications/PushNotificationService";
import type { RootState } from "../../state-store/store";

interface RealTimeNotificationContextValue {
  notifications: UnifiedNotification[];
  unreadCount: number;
  stats: NotificationStats;
  isConnected: boolean;
  isInitialized: boolean;

  // Actions
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  clearAllNotifications: () => Promise<void>;
  refreshNotifications: () => Promise<void>;

  // Real-time connection
  connect: () => Promise<void>;
  disconnect: () => void;
}

const RealTimeNotificationContext =
  createContext<RealTimeNotificationContextValue | null>(null);

interface RealTimeNotificationProviderProps {
  children: React.ReactNode;
  autoConnect?: boolean;
  showInAppNotifications?: boolean;
}

export const RealTimeNotificationProvider: React.FC<
  RealTimeNotificationProviderProps
> = ({ children, autoConnect = true, showInAppNotifications = true }) => {
  const [notifications, setNotifications] = useState<UnifiedNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [stats, setStats] = useState<NotificationStats>({
    total: 0,
    unread: 0,
    byType: {},
    byPriority: { high: 0, medium: 0, low: 0 },
  });
  const [isConnected, setIsConnected] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Get user data from Redux
  const { sessionData, user, token } = useSelector(
    (state: RootState) => state.app,
  );
  const userId = sessionData?.user_id || sessionData?.data?.user_id || user?.id;
  const userCategory =
    sessionData?.user_category ||
    sessionData?.data?.user_category ||
    user?.userCategory;

  const notificationManager = NotificationManager.getInstance();
  const webSocketService = WebSocketService.getInstance();
  const pushNotificationService = PushNotificationService.getInstance();

  // Load notifications and stats
  const loadData = useCallback(async () => {
    try {
      const allNotifications = await notificationManager.getAllNotifications();
      const notificationStats = notificationManager.getStats();

      setNotifications(allNotifications);
      setUnreadCount(notificationStats.unread);
      setStats(notificationStats);
    } catch (error) {
      console.error("Error loading notification data:", error);
    }
  }, [notificationManager]);

  // Initialize services
  const initialize = useCallback(async () => {
    if (!userId || !userCategory) {
      console.log("📱 Waiting for user authentication...");
      return;
    }

    try {
      console.log("📱 Initializing notification services...");

      // Initialize notification manager
      await notificationManager.initialize();

      // Initialize push notifications (may fail gracefully)
      try {
        await pushNotificationService.initialize();
      } catch (pushError) {
        console.warn(
          "⚠️ Push notification service failed to initialize, but local notifications will still work:",
          pushError,
        );
      }

      // Load initial data
      await loadData();

      setIsInitialized(true);
      console.log("✅ Notification services initialized");

      // Auto-connect if enabled
      if (autoConnect) {
        await connect();
      }
    } catch (error) {
      console.warn(
        "⚠️ Some notification services failed to initialize, but core functionality should still work:",
        error,
      );

      // Still mark as initialized so the app can function
      setIsInitialized(true);
    }
  }, [
    userId,
    userCategory,
    autoConnect,
    notificationManager,
    pushNotificationService,
    loadData,
  ]);

  // Connect to real-time services
  const connect = useCallback(async () => {
    if (!userId || !userCategory || !token) {
      console.log("📱 Cannot connect: missing user data");
      return;
    }

    try {
      console.log("📱 Connecting to real-time services...");

      // Connect WebSocket
      await webSocketService.initialize(userId.toString(), userCategory, token);
      setIsConnected(true);

      console.log("✅ Connected to real-time services");
    } catch (error) {
      console.error("❌ Error connecting to real-time services:", error);
      setIsConnected(false);
    }
  }, [userId, userCategory, token, webSocketService]);

  // Disconnect from real-time services
  const disconnect = useCallback(() => {
    console.log("📱 Disconnecting from real-time services...");
    webSocketService.disconnect();
    setIsConnected(false);
  }, [webSocketService]);

  // Handle new notifications
  const handleNewNotification = useCallback(
    async (notification: UnifiedNotification) => {
      console.log("📱 New notification received:", notification.title);

      // Show in-app notification if enabled
      if (showInAppNotifications && Platform.OS !== "web") {
        // You can implement a toast notification here
        // For now, we'll use Alert for demonstration
        if (notification.priority === "high") {
          Alert.alert(notification.title, notification.body, [{ text: "OK" }]);
        }
      }

      // Refresh data
      await loadData();
    },
    [showInAppNotifications, loadData],
  );

  // Action methods
  const markAsRead = useCallback(
    async (id: string) => {
      await notificationManager.markAsRead(id);
      await loadData();
    },
    [notificationManager, loadData],
  );

  const markAllAsRead = useCallback(async () => {
    await notificationManager.markAllAsRead();
    await loadData();
  }, [notificationManager, loadData]);

  const deleteNotification = useCallback(
    async (id: string) => {
      await notificationManager.deleteNotification(id);
      await loadData();
    },
    [notificationManager, loadData],
  );

  const clearAllNotifications = useCallback(async () => {
    await notificationManager.clearAllNotifications();
    await loadData();
  }, [notificationManager, loadData]);

  const refreshNotifications = useCallback(async () => {
    await loadData();
  }, [loadData]);

  // Initialize when user data is available
  useEffect(() => {
    if (userId && userCategory && !isInitialized) {
      initialize();
    }
  }, [userId, userCategory, isInitialized, initialize]);

  // Set up WebSocket event listeners
  useEffect(() => {
    if (!isInitialized) return;

    // Listen for new notifications
    const unsubscribeNewNotification = notificationManager.onNewNotification(
      handleNewNotification,
    );

    // Listen for WebSocket connection status
    const unsubscribeConnectionStatus =
      webSocketService.onConnectionStatusChange((connected) => {
        console.log("📱 WebSocket connection status:", connected);
        setIsConnected(connected);
      });

    return () => {
      unsubscribeNewNotification();
      unsubscribeConnectionStatus();
    };
  }, [
    isInitialized,
    notificationManager,
    webSocketService,
    handleNewNotification,
  ]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  const contextValue: RealTimeNotificationContextValue = {
    notifications,
    unreadCount,
    stats,
    isConnected,
    isInitialized,

    // Actions
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    refreshNotifications,

    // Real-time connection
    connect,
    disconnect,
  };

  return (
    <RealTimeNotificationContext.Provider value={contextValue}>
      {children}
    </RealTimeNotificationContext.Provider>
  );
};

export const useRealTimeNotifications =
  (): RealTimeNotificationContextValue => {
    const context = useContext(RealTimeNotificationContext);
    if (!context) {
      throw new Error(
        "useRealTimeNotifications must be used within a RealTimeNotificationProvider",
      );
    }
    return context;
  };

export default RealTimeNotificationProvider;
