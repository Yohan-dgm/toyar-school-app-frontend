// Core notification components
export { default as NotificationBadge } from "./NotificationBadge";
export { default as NotificationItem } from "./NotificationItem";
export { default as NotificationList } from "./NotificationList";
export {
  default as NotificationCenter,
  NotificationIcon,
} from "./NotificationCenter";

// Real-time notification provider
export {
  default as RealTimeNotificationProvider,
  useRealTimeNotifications,
} from "./RealTimeNotificationProvider";

// Re-export types from services for convenience
export type {
  UnifiedNotification,
  NotificationFilter,
  NotificationStats,
} from "../../services/notifications/NotificationManager";
