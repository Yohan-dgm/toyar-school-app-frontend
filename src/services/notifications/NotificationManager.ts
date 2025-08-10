import PushNotificationService from "./PushNotificationService";
import WebSocketService from "../websocket/WebSocketService";
// Removed RTK Query imports to avoid circular dependency
import type {
  NotificationMessage,
  RealTimeUpdate,
} from "../websocket/WebSocketService";
import type { Notification } from "../api/NotificationApiService";

export interface UnifiedNotification {
  id: string;
  title: string;
  body: string;
  type: "academic" | "payment" | "event" | "general" | "emergency";
  category?: string;
  priority: "low" | "normal" | "high" | "urgent";
  source: "local" | "push" | "websocket" | "api";
  read: boolean;
  timestamp: string;
  userId?: string;
  userCategory?: number;
  studentId?: string;
  data?: Record<string, any>;
  actions?: NotificationAction[];
}

export interface NotificationAction {
  id: string;
  title: string;
  type: "button" | "input" | "link" | "navigate";
  url?: string;
  screen?: string;
  data?: Record<string, any>;
  handler?: (data?: any) => void | Promise<void>;
}

export interface NotificationStats {
  total: number;
  unread: number;
  byType: Record<string, number>;
  byPriority: Record<string, number>;
  bySource: Record<string, number>;
}

export interface NotificationFilters {
  type?: string[];
  priority?: string[];
  source?: string[];
  read?: boolean;
  dateRange?: {
    start: Date;
    end: Date;
  };
  studentId?: string;
}

type NotificationListener = (notification: UnifiedNotification) => void;
type StatsUpdateListener = (stats: NotificationStats) => void;

class NotificationManager {
  private static instance: NotificationManager;
  private notifications: Map<string, UnifiedNotification> = new Map();
  private listeners: NotificationListener[] = [];
  private statsListeners: StatsUpdateListener[] = [];
  private isInitialized = false;

  static getInstance(): NotificationManager {
    if (!NotificationManager.instance) {
      NotificationManager.instance = new NotificationManager();
    }
    return NotificationManager.instance;
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) {
      console.log("📋 Notification manager already initialized");
      return;
    }

    try {
      console.log("📋 Initializing notification manager...");

      // Set up listeners for different notification sources
      this.setupPushNotificationListeners();
      this.setupWebSocketListeners();

      this.isInitialized = true;
      console.log("✅ Notification manager initialized successfully");
    } catch (error) {
      console.error("❌ Failed to initialize notification manager:", error);
      throw error;
    }
  }

  private setupPushNotificationListeners(): void {
    // Listen for push notifications
    PushNotificationService.addNotificationListener((pushNotification) => {
      const unifiedNotification = this.convertPushToUnified(pushNotification);
      this.addNotification(unifiedNotification);
    });

    // Listen for notification responses
    PushNotificationService.addResponseListener((response) => {
      const notificationData = response.notification.request.content.data;
      if (notificationData?.id) {
        this.handleNotificationAction(
          notificationData.id,
          "tapped",
          notificationData,
        );
      }
    });
  }

  private setupWebSocketListeners(): void {
    // Listen for WebSocket notifications
    WebSocketService.addNotificationListener((wsNotification) => {
      const unifiedNotification =
        this.convertWebSocketToUnified(wsNotification);
      this.addNotification(unifiedNotification);

      // Also trigger push notification for immediate visibility
      this.triggerPushNotification(unifiedNotification);
    });

    // Listen for real-time updates
    WebSocketService.addUpdateListener((update) => {
      this.handleRealTimeUpdate(update);
    });
  }

  // Convert different notification types to unified format
  private convertPushToUnified(pushNotification: any): UnifiedNotification {
    return {
      id: `push-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: pushNotification.request.content.title,
      body: pushNotification.request.content.body,
      type: pushNotification.request.content.data?.type || "general",
      category: pushNotification.request.content.categoryIdentifier,
      priority: this.mapPushPriority(pushNotification.request.content.priority),
      source: "push",
      read: false,
      timestamp: new Date().toISOString(),
      data: pushNotification.request.content.data,
    };
  }

  private convertWebSocketToUnified(
    wsNotification: NotificationMessage,
  ): UnifiedNotification {
    return {
      id: wsNotification.id,
      title: wsNotification.title,
      body: wsNotification.body,
      type: wsNotification.category as any,
      priority: wsNotification.priority,
      source: "websocket",
      read: wsNotification.read || false,
      timestamp: wsNotification.timestamp,
      userId: wsNotification.userId,
      userCategory: wsNotification.userCategory,
      data: wsNotification.data,
    };
  }

  private convertApiToUnified(
    apiNotification: Notification,
  ): UnifiedNotification {
    return {
      id: apiNotification.id,
      title: apiNotification.title,
      body: apiNotification.body,
      type: apiNotification.type,
      category: apiNotification.category,
      priority: apiNotification.priority,
      source: "api",
      read: apiNotification.read,
      timestamp: apiNotification.createdAt,
      userId: apiNotification.userId,
      userCategory: apiNotification.userCategory,
      studentId: apiNotification.studentId,
      data: apiNotification.data,
      actions: apiNotification.actions?.map((action) => ({
        ...action,
        type: action.type as any,
      })),
    };
  }

  private mapPushPriority(priority: any): UnifiedNotification["priority"] {
    switch (priority) {
      case "low":
        return "low";
      case "high":
        return "high";
      case "max":
        return "urgent";
      default:
        return "normal";
    }
  }

  // Add notification to local store
  private addNotification(notification: UnifiedNotification): void {
    this.notifications.set(notification.id, notification);

    console.log("📋 Added notification:", {
      id: notification.id,
      title: notification.title,
      type: notification.type,
      source: notification.source,
    });

    // Notify listeners
    this.notifyListeners(notification);
    this.updateStats();
  }

  // Trigger push notification for WebSocket messages
  private async triggerPushNotification(
    notification: UnifiedNotification,
  ): Promise<void> {
    try {
      await PushNotificationService.sendLocalNotification({
        id: notification.id,
        title: notification.title,
        body: notification.body,
        priority: notification.priority,
        data: {
          ...notification.data,
          source: "websocket",
          originalId: notification.id,
        },
      });
    } catch (error) {
      console.error("❌ Failed to trigger push notification:", error);
    }
  }

  // Handle real-time updates
  private handleRealTimeUpdate(update: RealTimeUpdate): void {
    console.log("🔄 Processing real-time update:", update.type);

    // Create notification for certain update types
    switch (update.type) {
      case "attendance":
        this.addNotification({
          id: `update-attendance-${Date.now()}`,
          title: "Attendance Updated",
          body: "Student attendance has been updated",
          type: "academic",
          priority: "normal",
          source: "websocket",
          read: false,
          timestamp: update.timestamp,
          data: update.data,
        });
        break;

      case "grade":
        this.addNotification({
          id: `update-grade-${Date.now()}`,
          title: "New Grade Available",
          body: "A new grade has been posted",
          type: "academic",
          priority: "high",
          source: "websocket",
          read: false,
          timestamp: update.timestamp,
          data: update.data,
        });
        break;

      case "announcement":
        this.addNotification({
          id: `update-announcement-${Date.now()}`,
          title: "New Announcement",
          body: update.data?.title || "A new announcement has been posted",
          type: "general",
          priority: "normal",
          source: "websocket",
          read: false,
          timestamp: update.timestamp,
          data: update.data,
        });
        break;
    }
  }

  // Public methods
  async sendNotification(
    notification: Omit<UnifiedNotification, "id" | "timestamp" | "source">,
  ): Promise<string> {
    const fullNotification: UnifiedNotification = {
      ...notification,
      id: `local-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      source: "local",
    };

    this.addNotification(fullNotification);

    // Also send via push notifications
    await PushNotificationService.sendLocalNotification({
      id: fullNotification.id,
      title: fullNotification.title,
      body: fullNotification.body,
      priority: fullNotification.priority,
      data: fullNotification.data,
    });

    return fullNotification.id;
  }

  getNotifications(filters?: NotificationFilters): UnifiedNotification[] {
    let notifications = Array.from(this.notifications.values());

    if (filters) {
      if (filters.type?.length) {
        notifications = notifications.filter((n) =>
          filters.type!.includes(n.type),
        );
      }

      if (filters.priority?.length) {
        notifications = notifications.filter((n) =>
          filters.priority!.includes(n.priority),
        );
      }

      if (filters.source?.length) {
        notifications = notifications.filter((n) =>
          filters.source!.includes(n.source),
        );
      }

      if (typeof filters.read === "boolean") {
        notifications = notifications.filter((n) => n.read === filters.read);
      }

      if (filters.studentId) {
        notifications = notifications.filter(
          (n) => n.studentId === filters.studentId,
        );
      }

      if (filters.dateRange) {
        const { start, end } = filters.dateRange;
        notifications = notifications.filter((n) => {
          const notificationDate = new Date(n.timestamp);
          return notificationDate >= start && notificationDate <= end;
        });
      }
    }

    // Sort by timestamp (newest first)
    return notifications.sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    );
  }

  getNotification(id: string): UnifiedNotification | null {
    return this.notifications.get(id) || null;
  }

  async markAsRead(id: string): Promise<boolean> {
    const notification = this.notifications.get(id);
    if (!notification) return false;

    notification.read = true;
    this.notifications.set(id, notification);

    // If from API, also mark as read on backend
    if (notification.source === "api") {
      try {
        // You would call the API here
        // await markNotificationReadMutation({ id });
      } catch (error) {
        console.error(
          "❌ Failed to mark notification as read on backend:",
          error,
        );
      }
    }

    this.updateStats();
    return true;
  }

  async markAllAsRead(filters?: NotificationFilters): Promise<number> {
    const notifications = this.getNotifications(filters);
    let updated = 0;

    for (const notification of notifications) {
      if (!notification.read) {
        await this.markAsRead(notification.id);
        updated++;
      }
    }

    return updated;
  }

  async deleteNotification(id: string): Promise<boolean> {
    const notification = this.notifications.get(id);
    if (!notification) return false;

    this.notifications.delete(id);

    // If from API, also delete on backend
    if (notification.source === "api") {
      try {
        // You would call the API here
        // await deleteNotificationMutation({ id });
      } catch (error) {
        console.error("❌ Failed to delete notification on backend:", error);
      }
    }

    this.updateStats();
    return true;
  }

  getStats(filters?: NotificationFilters): NotificationStats {
    const notifications = this.getNotifications(filters);

    const stats: NotificationStats = {
      total: notifications.length,
      unread: notifications.filter((n) => !n.read).length,
      byType: {},
      byPriority: {},
      bySource: {},
    };

    notifications.forEach((notification) => {
      // By type
      stats.byType[notification.type] =
        (stats.byType[notification.type] || 0) + 1;

      // By priority
      stats.byPriority[notification.priority] =
        (stats.byPriority[notification.priority] || 0) + 1;

      // By source
      stats.bySource[notification.source] =
        (stats.bySource[notification.source] || 0) + 1;
    });

    return stats;
  }

  async handleNotificationAction(
    notificationId: string,
    actionId: string,
    data?: any,
  ): Promise<void> {
    const notification = this.getNotification(notificationId);
    if (!notification) return;

    console.log("🎯 Handling notification action:", {
      notificationId,
      actionId,
      data,
    });

    // Mark as read when action is taken
    await this.markAsRead(notificationId);

    // Handle built-in actions
    switch (actionId) {
      case "tapped":
        // Default tap action - could navigate to relevant screen
        this.handleDefaultTapAction(notification);
        break;

      case "dismiss":
        await this.deleteNotification(notificationId);
        break;

      default:
        // Handle custom actions
        const action = notification.actions?.find((a) => a.id === actionId);
        if (action?.handler) {
          try {
            await action.handler(data);
          } catch (error) {
            console.error("❌ Action handler error:", error);
          }
        }
    }
  }

  private handleDefaultTapAction(notification: UnifiedNotification): void {
    // Default navigation logic based on notification type
    switch (notification.type) {
      case "academic":
        console.log("📚 Navigate to academic section");
        break;
      case "payment":
        console.log("💰 Navigate to payment section");
        break;
      case "event":
        console.log("📅 Navigate to events");
        break;
      default:
        console.log("🔔 Navigate to notifications");
    }
  }

  // Listener management
  addListener(listener: NotificationListener): void {
    this.listeners.push(listener);
  }

  removeListener(listener: NotificationListener): void {
    this.listeners = this.listeners.filter((l) => l !== listener);
  }

  addStatsListener(listener: StatsUpdateListener): void {
    this.statsListeners.push(listener);
  }

  removeStatsListener(listener: StatsUpdateListener): void {
    this.statsListeners = this.statsListeners.filter((l) => l !== listener);
  }

  private notifyListeners(notification: UnifiedNotification): void {
    this.listeners.forEach((listener) => {
      try {
        listener(notification);
      } catch (error) {
        console.error("❌ Notification listener error:", error);
      }
    });
  }

  private updateStats(): void {
    const stats = this.getStats();
    this.statsListeners.forEach((listener) => {
      try {
        listener(stats);
      } catch (error) {
        console.error("❌ Stats listener error:", error);
      }
    });
  }

  // Clear all notifications
  clearAll(): void {
    this.notifications.clear();
    this.updateStats();
    console.log("🗑️ All notifications cleared");
  }

  // School-specific convenience methods
  async sendAcademicNotification(
    title: string,
    body: string,
    studentId?: string,
  ): Promise<string> {
    return this.sendNotification({
      title,
      body,
      type: "academic",
      priority: "high",
      read: false,
      studentId,
    });
  }

  async sendPaymentReminder(
    title: string,
    body: string,
    amount?: number,
  ): Promise<string> {
    return this.sendNotification({
      title,
      body,
      type: "payment",
      priority: "high",
      read: false,
      data: { amount },
    });
  }

  async sendEventNotification(
    title: string,
    body: string,
    eventId?: string,
  ): Promise<string> {
    return this.sendNotification({
      title,
      body,
      type: "event",
      priority: "normal",
      read: false,
      data: { eventId },
    });
  }
}

export default NotificationManager.getInstance();
