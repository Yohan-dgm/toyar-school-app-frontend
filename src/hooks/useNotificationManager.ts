import { useEffect, useState, useCallback, useRef } from "react";
import NotificationManager, {
  UnifiedNotification,
  NotificationStats,
  NotificationFilters,
} from "../services/notifications/NotificationManager";

export interface UseNotificationManagerReturn {
  // State
  notifications: UnifiedNotification[];
  stats: NotificationStats;
  isInitialized: boolean;

  // Data fetching
  getNotifications: (filters?: NotificationFilters) => UnifiedNotification[];
  getNotification: (id: string) => UnifiedNotification | null;
  getStats: (filters?: NotificationFilters) => NotificationStats;

  // Actions
  sendNotification: (
    notification: Omit<UnifiedNotification, "id" | "timestamp" | "source">,
  ) => Promise<string>;
  markAsRead: (id: string) => Promise<boolean>;
  markAllAsRead: (filters?: NotificationFilters) => Promise<number>;
  deleteNotification: (id: string) => Promise<boolean>;
  clearAll: () => void;

  // School-specific actions
  sendAcademicNotification: (
    title: string,
    body: string,
    studentId?: string,
  ) => Promise<string>;
  sendPaymentReminder: (
    title: string,
    body: string,
    amount?: number,
  ) => Promise<string>;
  sendEventNotification: (
    title: string,
    body: string,
    eventId?: string,
  ) => Promise<string>;

  // Action handling
  handleNotificationAction: (
    notificationId: string,
    actionId: string,
    data?: any,
  ) => Promise<void>;

  // Filtering and searching
  filterNotifications: (filters: NotificationFilters) => void;
  clearFilters: () => void;
  currentFilters: NotificationFilters | null;
}

export const useNotificationManager = (): UseNotificationManagerReturn => {
  const [notifications, setNotifications] = useState<UnifiedNotification[]>([]);
  const [stats, setStats] = useState<NotificationStats>({
    total: 0,
    unread: 0,
    byType: {},
    byPriority: {},
    bySource: {},
  });
  const [isInitialized, setIsInitialized] = useState(false);
  const [currentFilters, setCurrentFilters] =
    useState<NotificationFilters | null>(null);

  const initialized = useRef(false);

  // Initialize notification manager
  useEffect(() => {
    const initializeManager = async () => {
      if (initialized.current) return;
      initialized.current = true;

      try {
        console.log("📋 Initializing notification manager hook...");
        await NotificationManager.initialize();

        // Set up listeners
        const notificationListener = (notification: UnifiedNotification) => {
          console.log("📋 New notification in hook:", notification.title);
          refreshNotifications();
        };

        const statsListener = (newStats: NotificationStats) => {
          console.log("📊 Stats updated in hook:", newStats);
          setStats(newStats);
        };

        NotificationManager.addListener(notificationListener);
        NotificationManager.addStatsListener(statsListener);

        // Initial data load
        refreshNotifications();
        setStats(NotificationManager.getStats());
        setIsInitialized(true);

        console.log("✅ Notification manager hook initialized");

        // Cleanup function
        return () => {
          NotificationManager.removeListener(notificationListener);
          NotificationManager.removeStatsListener(statsListener);
        };
      } catch (error) {
        console.error(
          "❌ Failed to initialize notification manager hook:",
          error,
        );
      }
    };

    initializeManager();
  }, []);

  // Refresh notifications based on current filters
  const refreshNotifications = useCallback(() => {
    const filteredNotifications = NotificationManager.getNotifications(
      currentFilters || undefined,
    );
    setNotifications(filteredNotifications);
  }, [currentFilters]);

  // Data fetching methods
  const getNotifications = useCallback(
    (filters?: NotificationFilters): UnifiedNotification[] => {
      return NotificationManager.getNotifications(filters);
    },
    [],
  );

  const getNotification = useCallback(
    (id: string): UnifiedNotification | null => {
      return NotificationManager.getNotification(id);
    },
    [],
  );

  const getStats = useCallback(
    (filters?: NotificationFilters): NotificationStats => {
      return NotificationManager.getStats(filters);
    },
    [],
  );

  // Action methods
  const sendNotification = useCallback(
    async (
      notification: Omit<UnifiedNotification, "id" | "timestamp" | "source">,
    ): Promise<string> => {
      try {
        const id = await NotificationManager.sendNotification(notification);
        refreshNotifications();
        return id;
      } catch (error) {
        console.error("❌ Failed to send notification:", error);
        throw error;
      }
    },
    [refreshNotifications],
  );

  const markAsRead = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        const success = await NotificationManager.markAsRead(id);
        if (success) {
          refreshNotifications();
        }
        return success;
      } catch (error) {
        console.error("❌ Failed to mark notification as read:", error);
        return false;
      }
    },
    [refreshNotifications],
  );

  const markAllAsRead = useCallback(
    async (filters?: NotificationFilters): Promise<number> => {
      try {
        const updated = await NotificationManager.markAllAsRead(filters);
        refreshNotifications();
        return updated;
      } catch (error) {
        console.error("❌ Failed to mark all notifications as read:", error);
        return 0;
      }
    },
    [refreshNotifications],
  );

  const deleteNotification = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        const success = await NotificationManager.deleteNotification(id);
        if (success) {
          refreshNotifications();
        }
        return success;
      } catch (error) {
        console.error("❌ Failed to delete notification:", error);
        return false;
      }
    },
    [refreshNotifications],
  );

  const clearAll = useCallback((): void => {
    NotificationManager.clearAll();
    refreshNotifications();
  }, [refreshNotifications]);

  // School-specific methods
  const sendAcademicNotification = useCallback(
    async (
      title: string,
      body: string,
      studentId?: string,
    ): Promise<string> => {
      try {
        const id = await NotificationManager.sendAcademicNotification(
          title,
          body,
          studentId,
        );
        refreshNotifications();
        return id;
      } catch (error) {
        console.error("❌ Failed to send academic notification:", error);
        throw error;
      }
    },
    [refreshNotifications],
  );

  const sendPaymentReminder = useCallback(
    async (title: string, body: string, amount?: number): Promise<string> => {
      try {
        const id = await NotificationManager.sendPaymentReminder(
          title,
          body,
          amount,
        );
        refreshNotifications();
        return id;
      } catch (error) {
        console.error("❌ Failed to send payment reminder:", error);
        throw error;
      }
    },
    [refreshNotifications],
  );

  const sendEventNotification = useCallback(
    async (title: string, body: string, eventId?: string): Promise<string> => {
      try {
        const id = await NotificationManager.sendEventNotification(
          title,
          body,
          eventId,
        );
        refreshNotifications();
        return id;
      } catch (error) {
        console.error("❌ Failed to send event notification:", error);
        throw error;
      }
    },
    [refreshNotifications],
  );

  // Action handling
  const handleNotificationAction = useCallback(
    async (
      notificationId: string,
      actionId: string,
      data?: any,
    ): Promise<void> => {
      try {
        await NotificationManager.handleNotificationAction(
          notificationId,
          actionId,
          data,
        );
        refreshNotifications();
      } catch (error) {
        console.error("❌ Failed to handle notification action:", error);
      }
    },
    [refreshNotifications],
  );

  // Filtering methods
  const filterNotifications = useCallback(
    (filters: NotificationFilters): void => {
      setCurrentFilters(filters);
      const filteredNotifications =
        NotificationManager.getNotifications(filters);
      setNotifications(filteredNotifications);
    },
    [],
  );

  const clearFilters = useCallback((): void => {
    setCurrentFilters(null);
    refreshNotifications();
  }, [refreshNotifications]);

  // Update notifications when filters change
  useEffect(() => {
    refreshNotifications();
  }, [refreshNotifications]);

  return {
    // State
    notifications,
    stats,
    isInitialized,

    // Data fetching
    getNotifications,
    getNotification,
    getStats,

    // Actions
    sendNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,

    // School-specific actions
    sendAcademicNotification,
    sendPaymentReminder,
    sendEventNotification,

    // Action handling
    handleNotificationAction,

    // Filtering and searching
    filterNotifications,
    clearFilters,
    currentFilters,
  };
};
