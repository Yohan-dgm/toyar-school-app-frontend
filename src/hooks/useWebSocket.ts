import { useEffect, useState, useCallback, useRef } from "react";
import WebSocketService, {
  NotificationMessage,
  RealTimeUpdate,
} from "../services/websocket/WebSocketService";

export interface UseWebSocketReturn {
  // Connection state
  isConnected: boolean;
  reconnectAttempts: number;

  // Recent data
  lastNotification: NotificationMessage | null;
  lastUpdate: RealTimeUpdate | null;

  // Actions
  connect: (
    userId: string,
    userCategory: number,
    authToken?: string,
  ) => Promise<void>;
  disconnect: () => void;
  sendNotification: (
    notification: Omit<NotificationMessage, "id" | "timestamp">,
  ) => void;
  sendUpdate: (update: Omit<RealTimeUpdate, "timestamp">) => void;
  joinRoom: (roomId: string) => void;
  leaveRoom: (roomId: string) => void;

  // Event management
  addNotificationListener: (
    listener: (notification: NotificationMessage) => void,
  ) => void;
  removeNotificationListener: (
    listener: (notification: NotificationMessage) => void,
  ) => void;
  addUpdateListener: (listener: (update: RealTimeUpdate) => void) => void;
  removeUpdateListener: (listener: (update: RealTimeUpdate) => void) => void;
}

export const useWebSocket = (): UseWebSocketReturn => {
  const [isConnected, setIsConnected] = useState(false);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const [lastNotification, setLastNotification] =
    useState<NotificationMessage | null>(null);
  const [lastUpdate, setLastUpdate] = useState<RealTimeUpdate | null>(null);

  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    // Set up connection listener
    const connectionListener = (connected: boolean) => {
      setIsConnected(connected);
      setReconnectAttempts(WebSocketService.getReconnectAttempts());
      console.log("🔌 WebSocket connection status changed:", connected);
    };

    // Set up notification listener
    const notificationListener = (notification: NotificationMessage) => {
      setLastNotification(notification);
      console.log("🔔 WebSocket notification in hook:", notification);
    };

    // Set up update listener
    const updateListener = (update: RealTimeUpdate) => {
      setLastUpdate(update);
      console.log("🔄 WebSocket update in hook:", update);
    };

    WebSocketService.addConnectionListener(connectionListener);
    WebSocketService.addNotificationListener(notificationListener);
    WebSocketService.addUpdateListener(updateListener);

    // Initialize connection status
    setIsConnected(WebSocketService.getConnectionStatus());

    return () => {
      WebSocketService.removeConnectionListener(connectionListener);
      WebSocketService.removeNotificationListener(notificationListener);
      WebSocketService.removeUpdateListener(updateListener);
    };
  }, []);

  // Actions
  const connect = useCallback(
    async (
      userId: string,
      userCategory: number,
      authToken?: string,
    ): Promise<void> => {
      try {
        await WebSocketService.initialize(userId, userCategory, authToken);
        console.log("✅ WebSocket connected via hook");
      } catch (error) {
        console.error("❌ Failed to connect WebSocket via hook:", error);
        throw error;
      }
    },
    [],
  );

  const disconnect = useCallback((): void => {
    WebSocketService.disconnect();
    console.log("🔌 WebSocket disconnected via hook");
  }, []);

  const sendNotification = useCallback(
    (notification: Omit<NotificationMessage, "id" | "timestamp">): void => {
      WebSocketService.sendNotification(notification);
    },
    [],
  );

  const sendUpdate = useCallback(
    (update: Omit<RealTimeUpdate, "timestamp">): void => {
      WebSocketService.sendUpdate(update);
    },
    [],
  );

  const joinRoom = useCallback((roomId: string): void => {
    WebSocketService.joinRoom(roomId);
  }, []);

  const leaveRoom = useCallback((roomId: string): void => {
    WebSocketService.leaveRoom(roomId);
  }, []);

  const addNotificationListener = useCallback(
    (listener: (notification: NotificationMessage) => void): void => {
      WebSocketService.addNotificationListener(listener);
    },
    [],
  );

  const removeNotificationListener = useCallback(
    (listener: (notification: NotificationMessage) => void): void => {
      WebSocketService.removeNotificationListener(listener);
    },
    [],
  );

  const addUpdateListener = useCallback(
    (listener: (update: RealTimeUpdate) => void): void => {
      WebSocketService.addUpdateListener(listener);
    },
    [],
  );

  const removeUpdateListener = useCallback(
    (listener: (update: RealTimeUpdate) => void): void => {
      WebSocketService.removeUpdateListener(listener);
    },
    [],
  );

  return {
    // Connection state
    isConnected,
    reconnectAttempts,

    // Recent data
    lastNotification,
    lastUpdate,

    // Actions
    connect,
    disconnect,
    sendNotification,
    sendUpdate,
    joinRoom,
    leaveRoom,

    // Event management
    addNotificationListener,
    removeNotificationListener,
    addUpdateListener,
    removeUpdateListener,
  };
};
