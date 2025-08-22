// ============================================================================
// REAL-TIME NOTIFICATION MANAGER
// Handles WebSocket connections, push notifications, and real-time events
// ============================================================================

import {
  RealTimeEvent,
  NotificationEvent,
  AnnouncementEvent,
  NotificationItem,
  AnnouncementItem,
} from "../types/communication-management";

type EventCallback = (data: any) => void;

export class NotificationManager {
  private static instance: NotificationManager;
  private websocket?: WebSocket;
  private eventSource?: EventSource;
  private listeners: Map<string, EventCallback[]> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private authToken?: string;
  private userId?: string;
  private isConnected = false;

  private constructor() {}

  static getInstance(): NotificationManager {
    if (!NotificationManager.instance) {
      NotificationManager.instance = new NotificationManager();
    }
    return NotificationManager.instance;
  }

  // ========================================================================
  // CONNECTION MANAGEMENT
  // ========================================================================

  initialize(authToken: string, userId: string) {
    this.authToken = authToken;
    this.userId = userId;
    this.connectWebSocket();
    this.initializePushNotifications();
  }

  private connectWebSocket() {
    if (!this.authToken || !this.userId) {
      console.warn(
        "NotificationManager: Cannot connect without auth token and user ID",
      );
      return;
    }

    try {
      const wsUrl = `${process.env.EXPO_PUBLIC_WS_URL || "ws://localhost:3000"}/ws/notifications`;
      const params = new URLSearchParams({
        token: this.authToken,
        userId: this.userId,
      });

      this.websocket = new WebSocket(`${wsUrl}?${params.toString()}`);

      this.websocket.onopen = () => {
        console.log("NotificationManager: WebSocket connected");
        this.isConnected = true;
        this.reconnectAttempts = 0;
        this.emit("connection.established", { connected: true });
      };

      this.websocket.onmessage = (event) => {
        try {
          const data: RealTimeEvent = JSON.parse(event.data);
          this.handleRealtimeEvent(data);
        } catch (error) {
          console.error(
            "NotificationManager: Failed to parse WebSocket message:",
            error,
          );
        }
      };

      this.websocket.onclose = (event) => {
        console.log(
          "NotificationManager: WebSocket disconnected:",
          event.code,
          event.reason,
        );
        this.isConnected = false;
        this.emit("connection.lost", {
          code: event.code,
          reason: event.reason,
        });
        this.attemptReconnect();
      };

      this.websocket.onerror = (error) => {
        console.error("NotificationManager: WebSocket error:", error);
        this.emit("connection.error", { error });
      };
    } catch (error) {
      console.error(
        "NotificationManager: Failed to create WebSocket connection:",
        error,
      );
      this.attemptReconnect();
    }
  }

  private connectServerSentEvents() {
    if (!this.authToken || !this.userId) return;

    try {
      const sseUrl = `${process.env.EXPO_PUBLIC_BASE_URL_API_SERVER_1}/communication-management/notifications/stream`;
      const params = new URLSearchParams({
        token: this.authToken,
        userId: this.userId,
      });

      this.eventSource = new EventSource(`${sseUrl}?${params.toString()}`);

      this.eventSource.onopen = () => {
        console.log("NotificationManager: SSE connected");
        this.isConnected = true;
      };

      this.eventSource.onmessage = (event) => {
        try {
          const data: RealTimeEvent = JSON.parse(event.data);
          this.handleRealtimeEvent(data);
        } catch (error) {
          console.error(
            "NotificationManager: Failed to parse SSE message:",
            error,
          );
        }
      };

      this.eventSource.onerror = (error) => {
        console.error("NotificationManager: SSE error:", error);
        this.isConnected = false;
        // Fallback to WebSocket
        this.eventSource?.close();
        this.connectWebSocket();
      };
    } catch (error) {
      console.error(
        "NotificationManager: Failed to create SSE connection:",
        error,
      );
      this.connectWebSocket(); // Fallback to WebSocket
    }
  }

  private attemptReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error("NotificationManager: Max reconnection attempts reached");
      this.emit("connection.failed", {
        attempts: this.reconnectAttempts,
        maxAttempts: this.maxReconnectAttempts,
      });
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);

    setTimeout(() => {
      console.log(
        `NotificationManager: Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`,
      );
      this.emit("connection.reconnecting", {
        attempt: this.reconnectAttempts,
        maxAttempts: this.maxReconnectAttempts,
      });
      this.connectWebSocket();
    }, delay);
  }

  disconnect() {
    if (this.websocket) {
      this.websocket.close();
      this.websocket = undefined;
    }

    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = undefined;
    }

    this.isConnected = false;
    this.listeners.clear();
    console.log("NotificationManager: Disconnected");
  }

  // ========================================================================
  // PUSH NOTIFICATIONS
  // ========================================================================

  private async initializePushNotifications() {
    if (
      typeof window === "undefined" ||
      !("serviceWorker" in navigator) ||
      !("PushManager" in window)
    ) {
      console.log("NotificationManager: Push notifications not supported");
      return;
    }

    try {
      const permission = await this.requestNotificationPermission();
      if (permission !== "granted") {
        console.log("NotificationManager: Notification permission denied");
        return;
      }

      const registration = await navigator.serviceWorker.register("/sw.js");
      const subscription =
        await this.subscribeToPushNotifications(registration);

      if (subscription) {
        await this.sendSubscriptionToServer(subscription);
      }
    } catch (error) {
      console.error(
        "NotificationManager: Failed to initialize push notifications:",
        error,
      );
    }
  }

  private async requestNotificationPermission(): Promise<NotificationPermission> {
    if (!("Notification" in window)) {
      return "denied";
    }

    if (Notification.permission === "granted") {
      return "granted";
    }

    if (Notification.permission === "denied") {
      return "denied";
    }

    return await Notification.requestPermission();
  }

  private async subscribeToPushNotifications(
    registration: ServiceWorkerRegistration,
  ) {
    try {
      const vapidPublicKey = process.env.EXPO_PUBLIC_VAPID_PUBLIC_KEY;
      if (!vapidPublicKey) {
        console.warn("NotificationManager: VAPID public key not configured");
        return null;
      }

      return await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(vapidPublicKey),
      });
    } catch (error) {
      console.error(
        "NotificationManager: Failed to subscribe to push notifications:",
        error,
      );
      return null;
    }
  }

  private async sendSubscriptionToServer(subscription: PushSubscription) {
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_BASE_URL_API_SERVER_1}/communication-management/notifications/subscribe`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.authToken}`,
          },
          body: JSON.stringify({
            subscription: subscription.toJSON(),
            device_type: "web",
          }),
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      console.log("NotificationManager: Push subscription sent to server");
    } catch (error) {
      console.error(
        "NotificationManager: Failed to send subscription to server:",
        error,
      );
    }
  }

  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, "+")
      .replace(/_/g, "/");
    const rawData = window.atob(base64);
    return new Uint8Array(rawData.split("").map((char) => char.charCodeAt(0)));
  }

  // ========================================================================
  // EVENT HANDLING
  // ========================================================================

  private handleRealtimeEvent(event: RealTimeEvent) {
    console.log("NotificationManager: Received event:", event.type);

    switch (event.type) {
      case "notification.new":
        this.handleNewNotification(event as NotificationEvent);
        break;
      case "notification.read":
        this.handleNotificationRead(event as NotificationEvent);
        break;
      case "notification.deleted":
        this.handleNotificationDeleted(event as NotificationEvent);
        break;
      case "announcement.published":
        this.handleAnnouncementPublished(event as AnnouncementEvent);
        break;
      case "announcement.updated":
        this.handleAnnouncementUpdated(event as AnnouncementEvent);
        break;
      case "announcement.deleted":
        this.handleAnnouncementDeleted(event as AnnouncementEvent);
        break;
      default:
        console.log("NotificationManager: Unknown event type:", event.type);
    }

    // Emit the event to all registered listeners
    this.emit(event.type, event.payload);
  }

  private handleNewNotification(event: NotificationEvent) {
    const notification = event.payload;

    // Show browser notification for urgent and high priority
    if (
      notification.priority === "urgent" ||
      notification.priority === "high"
    ) {
      this.showBrowserNotification(notification);
    }

    // Emit specific events based on priority
    if (notification.priority === "urgent") {
      this.emit("notification.urgent", notification);
    } else if (notification.priority === "high") {
      this.emit("notification.high", notification);
    }
  }

  private handleNotificationRead(event: NotificationEvent) {
    this.emit("notification.read", event.payload);
  }

  private handleNotificationDeleted(event: NotificationEvent) {
    this.emit("notification.deleted", event.payload);
  }

  private handleAnnouncementPublished(event: AnnouncementEvent) {
    const announcement = event.payload;

    // Show notification for high priority announcements
    if (announcement.priority_level === 3) {
      this.showAnnouncementNotification(announcement);
    }

    this.emit("announcement.published", announcement);
  }

  private handleAnnouncementUpdated(event: AnnouncementEvent) {
    this.emit("announcement.updated", event.payload);
  }

  private handleAnnouncementDeleted(event: AnnouncementEvent) {
    this.emit("announcement.deleted", event.payload);
  }

  private showBrowserNotification(notification: NotificationItem) {
    if (!("Notification" in window) || Notification.permission !== "granted") {
      return;
    }

    const options: NotificationOptions = {
      body: notification.message,
      icon: notification.image_url || "/icons/notification-icon.png",
      badge: "/icons/notification-badge.png",
      tag: `notification-${notification.id}`,
      requireInteraction: notification.priority === "urgent",
      silent: false,
      data: {
        notificationId: notification.id,
        actionUrl: notification.action_url,
      },
    };

    const browserNotification = new Notification(notification.title, options);

    browserNotification.onclick = () => {
      // Handle notification click
      if (notification.action_url) {
        window.open(notification.action_url, "_blank");
      }
      browserNotification.close();
      this.emit("notification.clicked", notification);
    };

    // Auto-close after 10 seconds for non-urgent notifications
    if (notification.priority !== "urgent") {
      setTimeout(() => {
        browserNotification.close();
      }, 10000);
    }
  }

  private showAnnouncementNotification(announcement: AnnouncementItem) {
    if (!("Notification" in window) || Notification.permission !== "granted") {
      return;
    }

    const options: NotificationOptions = {
      body: announcement.excerpt,
      icon: announcement.image_url || "/icons/announcement-icon.png",
      badge: "/icons/notification-badge.png",
      tag: `announcement-${announcement.id}`,
      requireInteraction: announcement.priority_level === 3,
      data: {
        announcementId: announcement.id,
        type: "announcement",
      },
    };

    const browserNotification = new Notification(
      `📢 ${announcement.title}`,
      options,
    );

    browserNotification.onclick = () => {
      // Handle announcement click - navigate to announcement details
      browserNotification.close();
      this.emit("announcement.clicked", announcement);
    };

    // Auto-close after 15 seconds
    setTimeout(() => {
      browserNotification.close();
    }, 15000);
  }

  // ========================================================================
  // EVENT LISTENER MANAGEMENT
  // ========================================================================

  on(event: string, callback: EventCallback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  off(event: string, callback: EventCallback) {
    const listeners = this.listeners.get(event);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  once(event: string, callback: EventCallback) {
    const onceCallback: EventCallback = (data) => {
      callback(data);
      this.off(event, onceCallback);
    };
    this.on(event, onceCallback);
  }

  private emit(event: string, data: any) {
    const listeners = this.listeners.get(event);
    if (listeners) {
      listeners.forEach((callback) => {
        try {
          callback(data);
        } catch (error) {
          console.error(
            `NotificationManager: Error in event listener for ${event}:`,
            error,
          );
        }
      });
    }
  }

  // ========================================================================
  // UTILITY METHODS
  // ========================================================================

  isConnectedToRealtime(): boolean {
    return this.isConnected;
  }

  getConnectionStatus(): {
    connected: boolean;
    reconnectAttempts: number;
    maxReconnectAttempts: number;
  } {
    return {
      connected: this.isConnected,
      reconnectAttempts: this.reconnectAttempts,
      maxReconnectAttempts: this.maxReconnectAttempts,
    };
  }

  // Send a heartbeat to keep the connection alive
  sendHeartbeat() {
    if (this.websocket && this.websocket.readyState === WebSocket.OPEN) {
      this.websocket.send(
        JSON.stringify({ type: "heartbeat", timestamp: Date.now() }),
      );
    }
  }

  // Clean up resources
  cleanup() {
    this.disconnect();
    this.listeners.clear();
    this.authToken = undefined;
    this.userId = undefined;
  }
}

// Export a singleton instance
export default NotificationManager.getInstance();
