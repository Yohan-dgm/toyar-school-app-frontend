import { io, Socket } from "socket.io-client";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface WebSocketConfig {
  url: string;
  autoConnect?: boolean;
  reconnection?: boolean;
  reconnectionAttempts?: number;
  reconnectionDelay?: number;
  timeout?: number;
}

export interface NotificationMessage {
  id: string;
  type: "notification" | "message" | "update";
  category: "academic" | "payment" | "event" | "general" | "emergency";
  title: string;
  body: string;
  data?: Record<string, any>;
  timestamp: string;
  userId?: string;
  userCategory?: number;
  priority: "low" | "normal" | "high" | "urgent";
  read?: boolean;
}

export interface RealTimeUpdate {
  type: "user_status" | "attendance" | "grade" | "announcement" | "calendar";
  data: Record<string, any>;
  timestamp: string;
  userId?: string;
  targetUsers?: string[];
}

class WebSocketService {
  private static instance: WebSocketService;
  private socket: Socket | null = null;
  private config: WebSocketConfig;
  private isConnected = false;
  private userId: string | null = null;
  private userCategory: number | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  // Event listeners
  private notificationListeners: ((
    notification: NotificationMessage,
  ) => void)[] = [];
  private updateListeners: ((update: RealTimeUpdate) => void)[] = [];
  private connectionListeners: ((connected: boolean) => void)[] = [];

  private constructor() {
    this.config = {
      url: process.env.EXPO_PUBLIC_WEBSOCKET_URL || "ws://localhost:3001",
      autoConnect: false,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
      timeout: 10000,
    };
  }

  static getInstance(): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }

  async initialize(
    userId: string,
    userCategory: number,
    authToken?: string,
  ): Promise<void> {
    try {
      this.userId = userId;
      this.userCategory = userCategory;

      console.log("🔌 Initializing WebSocket connection...", {
        url: this.config.url,
        userId,
        userCategory,
      });

      // Create socket connection
      this.socket = io(this.config.url, {
        autoConnect: this.config.autoConnect,
        reconnection: this.config.reconnection,
        reconnectionAttempts: this.config.reconnectionAttempts,
        reconnectionDelay: this.config.reconnectionDelay,
        timeout: this.config.timeout,
        auth: {
          token: authToken,
          userId,
          userCategory,
        },
        query: {
          userId,
          userCategory: userCategory.toString(),
        },
      });

      this.setupSocketListeners();

      // Connect to server
      await this.connect();

      console.log("✅ WebSocket service initialized successfully");
    } catch (error) {
      console.error("❌ Failed to initialize WebSocket service:", error);
      throw error;
    }
  }

  private setupSocketListeners(): void {
    if (!this.socket) return;

    // Connection events
    this.socket.on("connect", () => {
      console.log("🔌 WebSocket connected");
      this.isConnected = true;
      this.reconnectAttempts = 0;
      this.notifyConnectionListeners(true);

      // Join user-specific room
      if (this.userId && this.userCategory) {
        this.socket?.emit("join-room", {
          userId: this.userId,
          userCategory: this.userCategory,
        });
      }
    });

    this.socket.on("disconnect", (reason) => {
      console.log("🔌 WebSocket disconnected:", reason);
      this.isConnected = false;
      this.notifyConnectionListeners(false);
    });

    this.socket.on("connect_error", (error) => {
      console.error("❌ WebSocket connection error:", error);
      this.isConnected = false;
      this.notifyConnectionListeners(false);
    });

    this.socket.on("reconnect", (attemptNumber) => {
      console.log("🔄 WebSocket reconnected after", attemptNumber, "attempts");
      this.reconnectAttempts = 0;
    });

    this.socket.on("reconnect_attempt", (attemptNumber) => {
      console.log("🔄 WebSocket reconnection attempt:", attemptNumber);
      this.reconnectAttempts = attemptNumber;
    });

    this.socket.on("reconnect_failed", () => {
      console.error("❌ WebSocket reconnection failed");
      this.isConnected = false;
      this.notifyConnectionListeners(false);
    });

    // Application-specific events
    this.socket.on("notification", (notification: NotificationMessage) => {
      console.log("🔔 WebSocket notification received:", notification);
      this.notifyNotificationListeners(notification);
    });

    this.socket.on("real-time-update", (update: RealTimeUpdate) => {
      console.log("🔄 WebSocket real-time update received:", update);
      this.notifyUpdateListeners(update);
    });

    this.socket.on("message", (message: any) => {
      console.log("💬 WebSocket message received:", message);
    });

    // School-specific events
    this.socket.on("attendance-update", (data: any) => {
      console.log("📋 Attendance update received:", data);
      this.notifyUpdateListeners({
        type: "attendance",
        data,
        timestamp: new Date().toISOString(),
      });
    });

    this.socket.on("grade-update", (data: any) => {
      console.log("📊 Grade update received:", data);
      this.notifyUpdateListeners({
        type: "grade",
        data,
        timestamp: new Date().toISOString(),
      });
    });

    this.socket.on("announcement", (data: any) => {
      console.log("📢 Announcement received:", data);
      this.notifyUpdateListeners({
        type: "announcement",
        data,
        timestamp: new Date().toISOString(),
      });
    });

    this.socket.on("calendar-update", (data: any) => {
      console.log("📅 Calendar update received:", data);
      this.notifyUpdateListeners({
        type: "calendar",
        data,
        timestamp: new Date().toISOString(),
      });
    });
  }

  async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.socket) {
        reject(new Error("Socket not initialized"));
        return;
      }

      if (this.isConnected) {
        resolve();
        return;
      }

      const timeoutId = setTimeout(() => {
        reject(new Error("WebSocket connection timeout"));
      }, this.config.timeout);

      this.socket.once("connect", () => {
        clearTimeout(timeoutId);
        resolve();
      });

      this.socket.once("connect_error", (error) => {
        clearTimeout(timeoutId);
        reject(error);
      });

      this.socket.connect();
    });
  }

  disconnect(): void {
    if (this.socket) {
      console.log("🔌 Disconnecting WebSocket...");
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      this.notifyConnectionListeners(false);
    }
  }

  // Send messages
  sendNotification(
    notification: Omit<NotificationMessage, "id" | "timestamp">,
  ): void {
    if (!this.isConnected || !this.socket) {
      console.warn("⚠️ Cannot send notification: WebSocket not connected");
      return;
    }

    const fullNotification: NotificationMessage = {
      ...notification,
      id: `ws-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
    };

    this.socket.emit("send-notification", fullNotification);
    console.log("📤 Notification sent via WebSocket:", fullNotification);
  }

  sendUpdate(update: Omit<RealTimeUpdate, "timestamp">): void {
    if (!this.isConnected || !this.socket) {
      console.warn("⚠️ Cannot send update: WebSocket not connected");
      return;
    }

    const fullUpdate: RealTimeUpdate = {
      ...update,
      timestamp: new Date().toISOString(),
    };

    this.socket.emit("send-update", fullUpdate);
    console.log("📤 Update sent via WebSocket:", fullUpdate);
  }

  // Join/leave rooms
  joinRoom(roomId: string): void {
    if (!this.isConnected || !this.socket) {
      console.warn("⚠️ Cannot join room: WebSocket not connected");
      return;
    }

    this.socket.emit("join-room", { roomId });
    console.log("🏠 Joined room:", roomId);
  }

  leaveRoom(roomId: string): void {
    if (!this.isConnected || !this.socket) {
      console.warn("⚠️ Cannot leave room: WebSocket not connected");
      return;
    }

    this.socket.emit("leave-room", { roomId });
    console.log("🏠 Left room:", roomId);
  }

  // Event listeners management
  addNotificationListener(
    listener: (notification: NotificationMessage) => void,
  ): void {
    this.notificationListeners.push(listener);
  }

  removeNotificationListener(
    listener: (notification: NotificationMessage) => void,
  ): void {
    this.notificationListeners = this.notificationListeners.filter(
      (l) => l !== listener,
    );
  }

  addUpdateListener(listener: (update: RealTimeUpdate) => void): void {
    this.updateListeners.push(listener);
  }

  removeUpdateListener(listener: (update: RealTimeUpdate) => void): void {
    this.updateListeners = this.updateListeners.filter((l) => l !== listener);
  }

  addConnectionListener(listener: (connected: boolean) => void): void {
    this.connectionListeners.push(listener);
  }

  removeConnectionListener(listener: (connected: boolean) => void): void {
    this.connectionListeners = this.connectionListeners.filter(
      (l) => l !== listener,
    );
  }

  // Private methods
  private notifyNotificationListeners(notification: NotificationMessage): void {
    this.notificationListeners.forEach((listener) => {
      try {
        listener(notification);
      } catch (error) {
        console.error("❌ Error in notification listener:", error);
      }
    });
  }

  private notifyUpdateListeners(update: RealTimeUpdate): void {
    this.updateListeners.forEach((listener) => {
      try {
        listener(update);
      } catch (error) {
        console.error("❌ Error in update listener:", error);
      }
    });
  }

  private notifyConnectionListeners(connected: boolean): void {
    this.connectionListeners.forEach((listener) => {
      try {
        listener(connected);
      } catch (error) {
        console.error("❌ Error in connection listener:", error);
      }
    });
  }

  // Getters
  getConnectionStatus(): boolean {
    return this.isConnected;
  }

  getSocket(): Socket | null {
    return this.socket;
  }

  getUserId(): string | null {
    return this.userId;
  }

  getUserCategory(): number | null {
    return this.userCategory;
  }

  getReconnectAttempts(): number {
    return this.reconnectAttempts;
  }
}

export default WebSocketService.getInstance();
