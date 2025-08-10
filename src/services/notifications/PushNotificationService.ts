import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export interface NotificationData {
  id: string;
  title: string;
  body: string;
  data?: Record<string, any>;
  categoryId?: string;
  priority?: "low" | "normal" | "high" | "max";
  sound?: string;
  vibrate?: boolean;
}

export interface ScheduledNotification extends NotificationData {
  trigger: Notifications.NotificationTriggerInput;
}

class PushNotificationService {
  private static instance: PushNotificationService;
  private pushToken: string | null = null;
  private notificationListeners: ((
    notification: Notifications.Notification,
  ) => void)[] = [];
  private responseListeners: ((
    response: Notifications.NotificationResponse,
  ) => void)[] = [];

  static getInstance(): PushNotificationService {
    if (!PushNotificationService.instance) {
      PushNotificationService.instance = new PushNotificationService();
    }
    return PushNotificationService.instance;
  }

  async initialize(): Promise<void> {
    try {
      console.log("📱 Initializing push notification service...");

      // Request permissions (this may fail on simulator)
      const permissionsGranted = await this.requestPermissions();

      if (!permissionsGranted) {
        console.warn(
          "⚠️ Push notification permissions not available, but local notifications will still work",
        );
      }

      // Get push token (this may fail without valid project ID)
      const token = await this.registerForPushNotifications();

      if (!token) {
        console.warn(
          "⚠️ Push token not available, but local notifications will still work",
        );
      }

      // Set up listeners (this should always work)
      this.setupNotificationListeners();

      console.log("📱 Push notification service initialized successfully");
    } catch (error) {
      console.warn(
        "⚠️ Push notification service initialization had issues, but local notifications should still work:",
        error,
      );

      // Ensure listeners are set up even if other parts fail
      try {
        this.setupNotificationListeners();
      } catch (listenerError) {
        console.error(
          "❌ Failed to setup notification listeners:",
          listenerError,
        );
      }
    }
  }

  private async requestPermissions(): Promise<boolean> {
    if (!Device.isDevice) {
      console.warn(
        "⚠️ Push notifications are only supported on physical devices",
      );
      return false;
    }

    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      console.warn("⚠️ Push notification permissions not granted");
      return false;
    }

    console.log("✅ Push notification permissions granted");
    return true;
  }

  private async registerForPushNotifications(): Promise<string | null> {
    try {
      if (!Device.isDevice) {
        console.warn("⚠️ Push notifications only work on physical devices");
        return null;
      }

      // Try to get cached token first
      const cachedToken = await AsyncStorage.getItem("expo_push_token");
      if (cachedToken) {
        this.pushToken = cachedToken;
        console.log("📱 Using cached push token");

        // Configure Android channels if needed
        if (Platform.OS === "android") {
          await this.setupAndroidChannels();
        }

        return this.pushToken;
      }

      // Check if we have a valid project ID
      const projectId = process.env.EXPO_PROJECT_ID;
      if (!projectId || projectId === "your-project-id") {
        console.warn(
          "⚠️ No valid Expo project ID configured. Push notifications will work locally only.",
        );

        // Configure Android channels for local notifications
        if (Platform.OS === "android") {
          await this.setupAndroidChannels();
        }

        return null;
      }

      // Try to get Expo push token
      const token = await Notifications.getExpoPushTokenAsync({
        projectId: projectId,
      });

      this.pushToken = token.data;

      // Store token locally
      await AsyncStorage.setItem("expo_push_token", this.pushToken);

      console.log("📱 Push token registered:", this.pushToken);

      // Configure Android notification channels
      if (Platform.OS === "android") {
        await this.setupAndroidChannels();
      }

      return this.pushToken;
    } catch (error) {
      console.warn("⚠️ Failed to register for push notifications:", error);

      // Configure Android channels even if token registration fails
      if (Platform.OS === "android") {
        try {
          await this.setupAndroidChannels();
        } catch (channelError) {
          console.warn("⚠️ Failed to setup Android channels:", channelError);
        }
      }

      // Don't throw error, just return null - local notifications will still work
      return null;
    }
  }

  private async setupAndroidChannels(): Promise<void> {
    await Notifications.setNotificationChannelAsync("school-notifications", {
      name: "School Notifications",
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
      sound: "default",
    });

    await Notifications.setNotificationChannelAsync("academic-alerts", {
      name: "Academic Alerts",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#2196F3",
      sound: "default",
    });

    await Notifications.setNotificationChannelAsync("payment-reminders", {
      name: "Payment Reminders",
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#4CAF50",
      sound: "default",
    });

    await Notifications.setNotificationChannelAsync("events", {
      name: "School Events",
      importance: Notifications.AndroidImportance.DEFAULT,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF9800",
      sound: "default",
    });
  }

  private setupNotificationListeners(): void {
    // Listen for notifications received while app is foregrounded
    Notifications.addNotificationReceivedListener((notification) => {
      console.log("📨 Notification received in foreground:", notification);
      this.notificationListeners.forEach((listener) => listener(notification));
    });

    // Listen for user interactions with notifications
    Notifications.addNotificationResponseReceivedListener((response) => {
      console.log("👆 Notification response received:", response);
      this.responseListeners.forEach((listener) => listener(response));
    });
  }

  async sendLocalNotification(notification: NotificationData): Promise<string> {
    try {
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: notification.title,
          body: notification.body,
          data: notification.data || {},
          categoryIdentifier: notification.categoryId,
          priority: this.mapPriority(notification.priority),
          sound: notification.sound || "default",
        },
        trigger: null, // Send immediately
      });

      console.log("📤 Local notification sent:", notificationId);
      return notificationId;
    } catch (error) {
      console.error("❌ Failed to send local notification:", error);
      throw error;
    }
  }

  async scheduleNotification(
    notification: ScheduledNotification,
  ): Promise<string> {
    try {
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: notification.title,
          body: notification.body,
          data: notification.data || {},
          categoryIdentifier: notification.categoryId,
          priority: this.mapPriority(notification.priority),
          sound: notification.sound || "default",
        },
        trigger: notification.trigger,
      });

      console.log("⏰ Scheduled notification:", notificationId);
      return notificationId;
    } catch (error) {
      console.error("❌ Failed to schedule notification:", error);
      throw error;
    }
  }

  async cancelNotification(notificationId: string): Promise<void> {
    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
      console.log("🗑️ Notification cancelled:", notificationId);
    } catch (error) {
      console.error("❌ Failed to cancel notification:", error);
    }
  }

  async cancelAllNotifications(): Promise<void> {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      console.log("🗑️ All notifications cancelled");
    } catch (error) {
      console.error("❌ Failed to cancel all notifications:", error);
    }
  }

  async getBadgeCount(): Promise<number> {
    try {
      return await Notifications.getBadgeCountAsync();
    } catch (error) {
      console.error("❌ Failed to get badge count:", error);
      return 0;
    }
  }

  async setBadgeCount(count: number): Promise<void> {
    try {
      await Notifications.setBadgeCountAsync(count);
    } catch (error) {
      console.error("❌ Failed to set badge count:", error);
    }
  }

  async clearBadge(): Promise<void> {
    await this.setBadgeCount(0);
  }

  getPushToken(): string | null {
    return this.pushToken;
  }

  isPushNotificationAvailable(): boolean {
    return this.pushToken !== null;
  }

  isLocalNotificationAvailable(): boolean {
    return Device.isDevice || Platform.OS === "web";
  }

  addNotificationListener(
    listener: (notification: Notifications.Notification) => void,
  ): void {
    this.notificationListeners.push(listener);
  }

  removeNotificationListener(
    listener: (notification: Notifications.Notification) => void,
  ): void {
    this.notificationListeners = this.notificationListeners.filter(
      (l) => l !== listener,
    );
  }

  addResponseListener(
    listener: (response: Notifications.NotificationResponse) => void,
  ): void {
    this.responseListeners.push(listener);
  }

  removeResponseListener(
    listener: (response: Notifications.NotificationResponse) => void,
  ): void {
    this.responseListeners = this.responseListeners.filter(
      (l) => l !== listener,
    );
  }

  private mapPriority(
    priority?: string,
  ): Notifications.AndroidNotificationPriority {
    switch (priority) {
      case "low":
        return Notifications.AndroidNotificationPriority.LOW;
      case "normal":
        return Notifications.AndroidNotificationPriority.DEFAULT;
      case "high":
        return Notifications.AndroidNotificationPriority.HIGH;
      case "max":
        return Notifications.AndroidNotificationPriority.MAX;
      default:
        return Notifications.AndroidNotificationPriority.DEFAULT;
    }
  }

  // School-specific notification methods
  async sendAcademicAlert(
    title: string,
    body: string,
    studentId?: string,
  ): Promise<string> {
    return this.sendLocalNotification({
      id: `academic-${Date.now()}`,
      title,
      body,
      categoryId: "academic-alerts",
      priority: "high",
      data: { type: "academic", studentId },
    });
  }

  async sendPaymentReminder(
    title: string,
    body: string,
    amount?: number,
  ): Promise<string> {
    return this.sendLocalNotification({
      id: `payment-${Date.now()}`,
      title,
      body,
      categoryId: "payment-reminders",
      priority: "high",
      data: { type: "payment", amount },
    });
  }

  async sendEventNotification(
    title: string,
    body: string,
    eventId?: string,
  ): Promise<string> {
    return this.sendLocalNotification({
      id: `event-${Date.now()}`,
      title,
      body,
      categoryId: "events",
      priority: "normal",
      data: { type: "event", eventId },
    });
  }

  async sendGeneralNotification(
    title: string,
    body: string,
    data?: Record<string, any>,
  ): Promise<string> {
    return this.sendLocalNotification({
      id: `general-${Date.now()}`,
      title,
      body,
      categoryId: "school-notifications",
      priority: "normal",
      data: { type: "general", ...data },
    });
  }
}

export default PushNotificationService.getInstance();
