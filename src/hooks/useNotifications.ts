import { useEffect, useState, useCallback } from "react";
import * as Notifications from "expo-notifications";
import PushNotificationService, {
  NotificationData,
  ScheduledNotification,
} from "../services/notifications/PushNotificationService";

export interface UseNotificationsReturn {
  // State
  isInitialized: boolean;
  pushToken: string | null;
  lastNotification: Notifications.Notification | null;
  lastResponse: Notifications.NotificationResponse | null;
  badgeCount: number;

  // Actions
  sendNotification: (notification: NotificationData) => Promise<string>;
  scheduleNotification: (
    notification: ScheduledNotification,
  ) => Promise<string>;
  cancelNotification: (id: string) => Promise<void>;
  cancelAllNotifications: () => Promise<void>;
  updateBadgeCount: (count: number) => Promise<void>;
  clearBadge: () => Promise<void>;

  // School-specific actions
  sendAcademicAlert: (
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
  sendGeneralNotification: (
    title: string,
    body: string,
    data?: Record<string, any>,
  ) => Promise<string>;
}

export const useNotifications = (): UseNotificationsReturn => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [pushToken, setPushToken] = useState<string | null>(null);
  const [lastNotification, setLastNotification] =
    useState<Notifications.Notification | null>(null);
  const [lastResponse, setLastResponse] =
    useState<Notifications.NotificationResponse | null>(null);
  const [badgeCount, setBadgeCount] = useState(0);

  // Initialize push notification service
  useEffect(() => {
    const initializeNotifications = async () => {
      try {
        await PushNotificationService.initialize();
        const token = PushNotificationService.getPushToken();
        setPushToken(token);

        // Get current badge count
        const currentBadgeCount = await PushNotificationService.getBadgeCount();
        setBadgeCount(currentBadgeCount);

        setIsInitialized(true);
        console.log("🔔 useNotifications hook initialized");
      } catch (error) {
        console.error("❌ Failed to initialize notifications in hook:", error);
      }
    };

    initializeNotifications();
  }, []);

  // Set up notification listeners
  useEffect(() => {
    if (!isInitialized) return;

    const notificationListener = (notification: Notifications.Notification) => {
      setLastNotification(notification);
      console.log("🔔 Notification received in hook:", notification);
    };

    const responseListener = (response: Notifications.NotificationResponse) => {
      setLastResponse(response);
      console.log("👆 Notification response in hook:", response);
    };

    PushNotificationService.addNotificationListener(notificationListener);
    PushNotificationService.addResponseListener(responseListener);

    return () => {
      PushNotificationService.removeNotificationListener(notificationListener);
      PushNotificationService.removeResponseListener(responseListener);
    };
  }, [isInitialized]);

  // Action callbacks
  const sendNotification = useCallback(
    async (notification: NotificationData): Promise<string> => {
      return await PushNotificationService.sendLocalNotification(notification);
    },
    [],
  );

  const scheduleNotification = useCallback(
    async (notification: ScheduledNotification): Promise<string> => {
      return await PushNotificationService.scheduleNotification(notification);
    },
    [],
  );

  const cancelNotification = useCallback(async (id: string): Promise<void> => {
    await PushNotificationService.cancelNotification(id);
  }, []);

  const cancelAllNotifications = useCallback(async (): Promise<void> => {
    await PushNotificationService.cancelAllNotifications();
  }, []);

  const updateBadgeCount = useCallback(async (count: number): Promise<void> => {
    await PushNotificationService.setBadgeCount(count);
    setBadgeCount(count);
  }, []);

  const clearBadge = useCallback(async (): Promise<void> => {
    await PushNotificationService.clearBadge();
    setBadgeCount(0);
  }, []);

  // School-specific callbacks
  const sendAcademicAlert = useCallback(
    async (
      title: string,
      body: string,
      studentId?: string,
    ): Promise<string> => {
      return await PushNotificationService.sendAcademicAlert(
        title,
        body,
        studentId,
      );
    },
    [],
  );

  const sendPaymentReminder = useCallback(
    async (title: string, body: string, amount?: number): Promise<string> => {
      return await PushNotificationService.sendPaymentReminder(
        title,
        body,
        amount,
      );
    },
    [],
  );

  const sendEventNotification = useCallback(
    async (title: string, body: string, eventId?: string): Promise<string> => {
      return await PushNotificationService.sendEventNotification(
        title,
        body,
        eventId,
      );
    },
    [],
  );

  const sendGeneralNotification = useCallback(
    async (
      title: string,
      body: string,
      data?: Record<string, any>,
    ): Promise<string> => {
      return await PushNotificationService.sendGeneralNotification(
        title,
        body,
        data,
      );
    },
    [],
  );

  return {
    // State
    isInitialized,
    pushToken,
    lastNotification,
    lastResponse,
    badgeCount,

    // Actions
    sendNotification,
    scheduleNotification,
    cancelNotification,
    cancelAllNotifications,
    updateBadgeCount,
    clearBadge,

    // School-specific actions
    sendAcademicAlert,
    sendPaymentReminder,
    sendEventNotification,
    sendGeneralNotification,
  };
};
