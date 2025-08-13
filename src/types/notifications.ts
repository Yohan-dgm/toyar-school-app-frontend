export interface BaseNotification {
  id: number;
  notification_type: {
    id: number;
    name: string;
    slug: string;
    icon: string;
    color: string;
  };
  title: string;
  message: string;
  priority: "normal" | "high" | "urgent";
  priority_label: string;
  priority_color: string;
  target_type: string;
  target_display: string;
  action_url?: string;
  action_text?: string;
  image_url?: string;
  is_read: boolean;
  is_delivered: boolean;
  read_at?: string;
  delivered_at?: string;
  expires_at?: string;
  created_at: string;
  time_ago: string;
  
  // Legacy fields for backward compatibility
  userId?: string;
  userCategory?: number;
  type?: string;
  description?: string;
  sender?: string;
  senderCategory?: number;
  timestamp?: string;
  isRead?: boolean;
  expiresAt?: string;
  actionUrl?: string;
  metadata?: Record<string, any>;
}

export interface MessageThread {
  id: string;
  participantId: string;
  participantName: string;
  participantCategory: number;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  avatar?: string;
  isGroup?: boolean;
  groupMembers?: string[];
}

export interface NotificationPreferences {
  userId: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
  inAppNotifications: boolean;
  notificationTypes: {
    messages: boolean;
    alerts: boolean;
    announcements: boolean;
    urgent: boolean;
    reminders: boolean;
    system: boolean;
  };
  quietHours?: {
    enabled: boolean;
    startTime: string;
    endTime: string;
  };
}

export interface NotificationStats {
  total_notifications: number;
  unread_count: number;
  unread_by_priority: {
    normal: number;
    high: number;
    urgent: number;
  };
  recent_activity: {
    today: number;
    this_week: number;
    this_month: number;
  };
  by_type?: Record<string, {
    name: string;
    slug: string;
    color: string;
    icon: string;
    count: number;
    unread: number;
  }>;
  priority_breakdown?: {
    normal: number;
    high: number;
    urgent: number;
  };
  last_notification_at?: string;
  generated_at?: string;
  
  // Legacy fields for backward compatibility
  totalUnread?: number;
  unreadByType?: Record<string, number>;
  totalMessages?: number;
  unreadMessages?: number;
}

export interface CreateNotificationRequest {
  notification_type_id: number;
  title: string;
  message: string;
  priority: "normal" | "high" | "urgent";
  target_type: "broadcast" | "user" | "role" | "class" | "grade";
  target_data?: {
    user_id?: number;
    user_ids?: number[];
    roles?: string[];
    grade_level_class_ids?: number[];
    grade_level_ids?: number[];
  };
  action_url?: string;
  action_text?: string;
  image_url?: string;
  is_scheduled?: boolean;
  scheduled_at?: string;
  expires_at?: string;
  
  // Legacy fields for backward compatibility
  recipientIds?: string[];
  recipientCategories?: number[];
  type?: string;
  description?: string;
  expiresAt?: string;
  actionUrl?: string;
  metadata?: Record<string, any>;
}

export interface NotificationFilters {
  filter?: "all" | "read" | "unread" | "delivered" | "pending";
  priority?: "normal" | "high" | "urgent";
  type_id?: number;
  search?: string;
  unread_only?: boolean;
  
  // Legacy fields for backward compatibility
  type?: string;
  isRead?: boolean;
  dateFrom?: string;
  dateTo?: string;
  senderId?: string;
  search_filter_list?: string[];
  status?: string;
}

export interface PaginatedNotifications {
  data: BaseNotification[];
  metadata: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
    from: number;
    to: number;
  };
  unread_count: number;
  
  // Legacy fields for backward compatibility
  notifications?: BaseNotification[];
  totalCount?: number;
  currentPage?: number;
  totalPages?: number;
  hasMore?: boolean;
}

export interface PaginatedMessageThreads {
  data: MessageThread[];
  metadata: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
    from: number;
    to: number;
  };
  
  // Legacy fields for backward compatibility
  threads?: MessageThread[];
  totalCount?: number;
  currentPage?: number;
  totalPages?: number;
  hasMore?: boolean;
}

export type NotificationTabType = "notifications" | "messages";

export interface NotificationSystemProps {
  userCategory: number;
  userId: string;
}
