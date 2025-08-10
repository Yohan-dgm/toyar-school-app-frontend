import React, { createContext, useContext, useEffect, ReactNode } from "react";
import {
  useNotifications,
  UseNotificationsReturn,
} from "../hooks/useNotifications";

interface NotificationContextType extends UseNotificationsReturn {}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined,
);

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
}) => {
  const notificationService = useNotifications();

  useEffect(() => {
    if (notificationService.isInitialized) {
      console.log(
        "🔔 Notification provider initialized with token:",
        notificationService.pushToken,
      );
    }
  }, [notificationService.isInitialized, notificationService.pushToken]);

  // Handle notification responses globally
  useEffect(() => {
    if (notificationService.lastResponse) {
      const { notification, actionIdentifier } =
        notificationService.lastResponse;
      const notificationData = notification.request.content.data;

      console.log("🔔 Global notification response handler:", {
        type: notificationData?.type,
        actionIdentifier,
        data: notificationData,
      });

      // Here you can add global navigation logic based on notification type
      // For example, navigate to specific screens based on notification data
      switch (notificationData?.type) {
        case "academic":
          console.log(
            "📚 Academic notification tapped - navigate to academic section",
          );
          break;
        case "payment":
          console.log(
            "💰 Payment notification tapped - navigate to payment section",
          );
          break;
        case "event":
          console.log("📅 Event notification tapped - navigate to events");
          break;
        case "general":
          console.log(
            "📋 General notification tapped - navigate to notifications",
          );
          break;
        default:
          console.log("🔔 Unknown notification type");
      }
    }
  }, [notificationService.lastResponse]);

  return (
    <NotificationContext.Provider value={notificationService}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotificationContext = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotificationContext must be used within a NotificationProvider",
    );
  }
  return context;
};
