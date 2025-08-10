import React, { createContext, useContext, useEffect, ReactNode } from "react";
import { useSelector } from "react-redux";
import { useWebSocket, UseWebSocketReturn } from "../hooks/useWebSocket";
import type { RootState } from "../state-store/store";

interface WebSocketContextType extends UseWebSocketReturn {}

const WebSocketContext = createContext<WebSocketContextType | undefined>(
  undefined,
);

interface WebSocketProviderProps {
  children: ReactNode;
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({
  children,
}) => {
  const webSocketService = useWebSocket();

  // Get user authentication data from Redux
  const { token, sessionData } = useSelector((state: RootState) => state.app);
  const userId = sessionData?.user_id || sessionData?.data?.user_id;
  const userCategory =
    sessionData?.user_category || sessionData?.data?.user_category;

  // Auto-connect when user is authenticated
  useEffect(() => {
    const connectWebSocket = async () => {
      if (token && userId && userCategory && !webSocketService.isConnected) {
        try {
          console.log("🔌 Auto-connecting WebSocket for authenticated user:", {
            userId,
            userCategory,
            hasToken: !!token,
          });

          await webSocketService.connect(
            userId.toString(),
            userCategory,
            token,
          );

          // Join user-specific rooms based on user category
          const userRoomId = `user-${userId}`;
          const categoryRoomId = `category-${userCategory}`;

          webSocketService.joinRoom(userRoomId);
          webSocketService.joinRoom(categoryRoomId);

          console.log("✅ WebSocket connected and joined rooms:", {
            userRoom: userRoomId,
            categoryRoom: categoryRoomId,
          });
        } catch (error) {
          console.error("❌ Failed to auto-connect WebSocket:", error);
        }
      }
    };

    connectWebSocket();
  }, [token, userId, userCategory, webSocketService.isConnected]);

  // Disconnect when user logs out
  useEffect(() => {
    if (!token && webSocketService.isConnected) {
      console.log("🔌 Disconnecting WebSocket due to logout");
      webSocketService.disconnect();
    }
  }, [token, webSocketService.isConnected]);

  // Handle real-time notifications
  useEffect(() => {
    if (webSocketService.lastNotification) {
      const notification = webSocketService.lastNotification;
      console.log(
        "🔔 Processing WebSocket notification in provider:",
        notification,
      );

      // Here you can integrate with the notification service
      // For example, show local notifications for real-time messages
      // NotificationService.sendLocalNotification(notification);
    }
  }, [webSocketService.lastNotification]);

  // Handle real-time updates
  useEffect(() => {
    if (webSocketService.lastUpdate) {
      const update = webSocketService.lastUpdate;
      console.log("🔄 Processing WebSocket update in provider:", update);

      // Here you can update Redux store or trigger UI updates
      // For example, update attendance data, grades, etc.
      switch (update.type) {
        case "attendance":
          console.log("📋 Attendance update:", update.data);
          // Dispatch to attendance slice
          break;
        case "grade":
          console.log("📊 Grade update:", update.data);
          // Dispatch to student growth slice
          break;
        case "announcement":
          console.log("📢 Announcement update:", update.data);
          // Update announcements in store
          break;
        case "calendar":
          console.log("📅 Calendar update:", update.data);
          // Update calendar slice
          break;
        case "user_status":
          console.log("👤 User status update:", update.data);
          // Update user status
          break;
        default:
          console.log("❓ Unknown update type:", update.type);
      }
    }
  }, [webSocketService.lastUpdate]);

  return (
    <WebSocketContext.Provider value={webSocketService}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocketContext = (): WebSocketContextType => {
  const context = useContext(WebSocketContext);
  if (context === undefined) {
    throw new Error(
      "useWebSocketContext must be used within a WebSocketProvider",
    );
  }
  return context;
};
