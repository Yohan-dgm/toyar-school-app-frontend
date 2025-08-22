// ============================================================================
// COMMUNICATION MANAGEMENT TYPES
// Comprehensive type definitions for notification and announcement system
// ============================================================================

// ========================================================================
// CORE ENUMS AND CONSTANTS
// ========================================================================

export const NOTIFICATION_PRIORITIES = {
  NORMAL: "normal",
  HIGH: "high",
  URGENT: "urgent",
} as const;

export const ANNOUNCEMENT_PRIORITY_LEVELS = {
  LOW: 1,
  MEDIUM: 2,
  HIGH: 3,
} as const;

export const ANNOUNCEMENT_STATUS = {
  DRAFT: "draft",
  SCHEDULED: "scheduled",
  PUBLISHED: "published",
  ARCHIVED: "archived",
} as const;

export const TARGET_TYPES = {
  BROADCAST: "broadcast",
  USER: "user",
  ROLE: "role",
  CLASS: "class",
  GRADE: "grade",
} as const;

export const NOTIFICATION_FILTERS = {
  ALL: "all",
  READ: "read",
  UNREAD: "unread",
  DELIVERED: "delivered",
  PENDING: "pending",
} as const;

export const BULK_OPERATIONS = {
  MARK_READ: "mark_read",
  DELETE: "delete",
  ARCHIVE: "archive",
} as const;

export const ANNOUNCEMENT_ACTIONS = {
  LIKE: "like",
  UNLIKE: "unlike",
  BOOKMARK: "bookmark",
  UNBOOKMARK: "unbookmark",
} as const;

// ========================================================================
// PREDEFINED DATA STRUCTURES
// ========================================================================

// Notification Types (Matches backend database)
export const NOTIFICATION_TYPES = [
  {
    id: 1,
    name: "System",
    slug: "system",
    description: "System-generated notifications",
    icon: "cog",
    color: "#6b7280",
  },
  {
    id: 2,
    name: "Announcement",
    slug: "announcement",
    description: "Official announcements",
    icon: "megaphone",
    color: "#3b82f6",
  },
  {
    id: 3,
    name: "Academic",
    slug: "academic",
    description: "Academic-related notifications",
    icon: "book-open",
    color: "#10b981",
  },
  {
    id: 4,
    name: "Event",
    slug: "event",
    description: "School events and activities",
    icon: "calendar",
    color: "#f59e0b",
  },
  {
    id: 5,
    name: "Alert",
    slug: "alert",
    description: "Important alerts and warnings",
    icon: "exclamation-triangle",
    color: "#ef4444",
  },
  {
    id: 6,
    name: "Attendance",
    slug: "attendance",
    description: "Attendance-related notifications",
    icon: "user-check",
    color: "#8b5cf6",
  },
  {
    id: 7,
    name: "Financial",
    slug: "financial",
    description: "Payment and financial notifications",
    icon: "credit-card",
    color: "#06b6d4",
  },
  {
    id: 8,
    name: "Social",
    slug: "social",
    description: "Social activities and community events",
    icon: "users",
    color: "#ec4899",
  },
] as const;

// Announcement Categories (Matches backend database)
export const ANNOUNCEMENT_CATEGORIES = [
  {
    id: 1,
    name: "General",
    slug: "general",
    description: "General announcements",
    icon: "megaphone",
    color: "#3b82f6",
    sort_order: 1,
  },
  {
    id: 2,
    name: "Academic",
    slug: "academic",
    description: "Academic announcements",
    icon: "book-open",
    color: "#10b981",
    sort_order: 2,
  },
  {
    id: 3,
    name: "Events",
    slug: "events",
    description: "School events and activities",
    icon: "calendar",
    color: "#f59e0b",
    sort_order: 3,
  },
  {
    id: 4,
    name: "Emergency",
    slug: "emergency",
    description: "Emergency announcements",
    icon: "exclamation-triangle",
    color: "#ef4444",
    sort_order: 4,
  },
  {
    id: 5,
    name: "Administrative",
    slug: "administrative",
    description: "Administrative announcements",
    icon: "clipboard-list",
    color: "#8b5cf6",
    sort_order: 5,
  },
  {
    id: 6,
    name: "Sports",
    slug: "sports",
    description: "Sports and athletics",
    icon: "trophy",
    color: "#06b6d4",
    sort_order: 6,
  },
  {
    id: 7,
    name: "Health & Safety",
    slug: "health-safety",
    description: "Health and safety announcements",
    icon: "shield-check",
    color: "#84cc16",
    sort_order: 7,
  },
  {
    id: 8,
    name: "Admissions",
    slug: "admissions",
    description: "Admissions and enrollment",
    icon: "user-plus",
    color: "#ec4899",
    sort_order: 8,
  },
] as const;

// Priority Display Configurations
export const PRIORITY_COLORS = {
  [NOTIFICATION_PRIORITIES.NORMAL]: "#6b7280",
  [NOTIFICATION_PRIORITIES.HIGH]: "#f59e0b",
  [NOTIFICATION_PRIORITIES.URGENT]: "#ef4444",
  [ANNOUNCEMENT_PRIORITY_LEVELS.LOW]: "#6b7280",
  [ANNOUNCEMENT_PRIORITY_LEVELS.MEDIUM]: "#f59e0b",
  [ANNOUNCEMENT_PRIORITY_LEVELS.HIGH]: "#ef4444",
} as const;

export const STATUS_COLORS = {
  [ANNOUNCEMENT_STATUS.DRAFT]: "#6b7280",
  [ANNOUNCEMENT_STATUS.SCHEDULED]: "#3b82f6",
  [ANNOUNCEMENT_STATUS.PUBLISHED]: "#10b981",
  [ANNOUNCEMENT_STATUS.ARCHIVED]: "#64748b",
} as const;

// ========================================================================
// TYPE DEFINITIONS
// ========================================================================

// Basic Type Unions
export type NotificationPriority =
  (typeof NOTIFICATION_PRIORITIES)[keyof typeof NOTIFICATION_PRIORITIES];
export type AnnouncementPriorityLevel =
  (typeof ANNOUNCEMENT_PRIORITY_LEVELS)[keyof typeof ANNOUNCEMENT_PRIORITY_LEVELS];
export type AnnouncementStatus =
  (typeof ANNOUNCEMENT_STATUS)[keyof typeof ANNOUNCEMENT_STATUS];
export type TargetType = (typeof TARGET_TYPES)[keyof typeof TARGET_TYPES];
export type NotificationFilter =
  (typeof NOTIFICATION_FILTERS)[keyof typeof NOTIFICATION_FILTERS];
export type BulkOperation =
  (typeof BULK_OPERATIONS)[keyof typeof BULK_OPERATIONS];
export type AnnouncementAction =
  (typeof ANNOUNCEMENT_ACTIONS)[keyof typeof ANNOUNCEMENT_ACTIONS];

// Core Data Interfaces
export interface NotificationType {
  id: number;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  is_active: boolean;
}

export interface AnnouncementCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  color: string;
  icon: string;
  sort_order: number;
  is_active: boolean;
}

export interface User {
  id: number;
  name: string;
  username: string;
  email?: string;
  avatar_url?: string;
  role?: string;
}

// Target Data Interface
export interface TargetData {
  user_id?: number;
  user_ids?: number[];
  roles?: string[];
  grade_level_class_ids?: number[];
  grade_level_ids?: number[];
}

// Notification Interfaces
export interface NotificationItem {
  id: number;
  notification_type: NotificationType;
  title: string;
  message: string;
  priority: NotificationPriority;
  priority_label: string;
  priority_color: string;
  target_type: TargetType;
  target_display: string;
  target_data?: TargetData;
  action_url?: string;
  action_text?: string;
  image_url?: string;
  is_read: boolean;
  is_delivered: boolean;
  is_deleted: boolean;
  read_at?: string;
  delivered_at?: string;
  expires_at?: string;
  created_at: string;
  updated_at: string;
  time_ago: string;
  creator?: User;
}

export interface NotificationStats {
  total_notifications: number;
  unread_count: number;
  unread_by_priority: {
    normal: number;
    high: number;
    urgent: number;
  };
  unread_by_type: Record<string, number>;
  recent_activity: {
    today: number;
    this_week: number;
    this_month: number;
  };
}

// Announcement Interfaces
export interface AnnouncementItem {
  id: number;
  title: string;
  content: string;
  excerpt: string;
  category: AnnouncementCategory;
  priority_level: AnnouncementPriorityLevel;
  priority_label: "Low" | "Medium" | "High";
  priority_color: string;
  status: AnnouncementStatus;
  status_label: string;
  status_color: string;
  target_type: TargetType;
  target_display: string;
  target_data?: TargetData;
  image_url?: string;
  attachment_urls?: string[];
  is_featured: boolean;
  is_pinned: boolean;
  is_published: boolean;
  scheduled_at?: string;
  published_at?: string;
  expires_at?: string;
  view_count: number;
  like_count: number;
  comment_count: number;
  share_count: number;
  is_read?: boolean;
  is_liked?: boolean;
  is_bookmarked?: boolean;
  notification_sent: boolean;
  tags: string;
  tags_array: string[];
  meta_data?: Record<string, any>;
  creator: User;
  created_at: string;
  updated_at: string;
  time_ago: string;
  read_time: number; // Estimated reading time in minutes
}

// Request/Response Interfaces
export interface PaginationParams {
  page?: number;
  per_page?: number;
}

export interface PaginationInfo {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
  from: number;
  to: number;
  has_more_pages: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: {
    items: T[];
    pagination: PaginationInfo;
  };
}

// Filter and Search Interfaces
export interface NotificationFilters {
  filter?: NotificationFilter;
  priority?: NotificationPriority;
  type_id?: number;
  search?: string;
  unread_only?: boolean;
  date_from?: string;
  date_to?: string;
}

export interface AnnouncementFilters {
  category_id?: number;
  priority_level?: AnnouncementPriorityLevel;
  status?: AnnouncementStatus;
  is_featured?: boolean;
  is_pinned?: boolean;
  search?: string;
  tags?: string;
  date_from?: string;
  date_to?: string;
  creator_id?: number;
}

// User Preferences Interface
export interface NotificationPreferences {
  email_notifications: boolean;
  push_notifications: boolean;
  sms_notifications: boolean;
  in_app_notifications: boolean;
  notification_types: Record<string, boolean>;
  quiet_hours: {
    enabled: boolean;
    start_time: string; // HH:MM format
    end_time: string; // HH:MM format
    timezone?: string;
  };
  digest_frequency: "never" | "daily" | "weekly";
  priority_filter: NotificationPriority[];
}

// Real-time Event Interfaces
export interface RealTimeEvent {
  type: string;
  payload: any;
  timestamp: string;
  user_id?: number;
}

export interface NotificationEvent extends RealTimeEvent {
  type: "notification.new" | "notification.read" | "notification.deleted";
  payload: NotificationItem;
}

export interface AnnouncementEvent extends RealTimeEvent {
  type:
    | "announcement.published"
    | "announcement.updated"
    | "announcement.deleted";
  payload: AnnouncementItem;
}

// Form Data Interfaces
export interface CreateNotificationFormData {
  notification_type_id: number;
  title: string;
  message: string;
  priority: NotificationPriority;
  target_type: TargetType;
  target_data?: TargetData;
  action_url?: string;
  action_text?: string;
  image_url?: string;
  is_scheduled?: boolean;
  scheduled_at?: Date | string;
  expires_at?: Date | string;
}

export interface CreateAnnouncementFormData {
  title: string;
  content: string;
  excerpt?: string;
  category_id: number;
  priority_level: AnnouncementPriorityLevel;
  status: AnnouncementStatus;
  target_type?: TargetType;
  target_data?: TargetData;
  image_url?: string;
  attachment_urls?: string[];
  is_featured?: boolean;
  is_pinned?: boolean;
  scheduled_at?: Date | string;
  expires_at?: Date | string;
  tags?: string;
  meta_data?: Record<string, any>;
}

// UI State Interfaces
export interface NotificationListState {
  items: NotificationItem[];
  loading: boolean;
  error: string | null;
  filters: NotificationFilters;
  selectedItems: number[];
  pagination: PaginationInfo;
  hasMore: boolean;
}

export interface AnnouncementListState {
  items: AnnouncementItem[];
  loading: boolean;
  error: string | null;
  filters: AnnouncementFilters;
  selectedItems: number[];
  pagination: PaginationInfo;
  hasMore: boolean;
}

// Component Props Interfaces
export interface NotificationItemProps {
  notification: NotificationItem;
  onRead?: (id: number) => void;
  onDelete?: (id: number) => void;
  onSelect?: (id: number, selected: boolean) => void;
  selected?: boolean;
  showActions?: boolean;
  compact?: boolean;
}

export interface AnnouncementCardProps {
  announcement: AnnouncementItem;
  onView?: (id: number) => void;
  onLike?: (id: number) => void;
  onBookmark?: (id: number) => void;
  onShare?: (id: number) => void;
  showActions?: boolean;
  compact?: boolean;
}

export interface FilterBarProps {
  filters: NotificationFilters | AnnouncementFilters;
  onFiltersChange: (filters: NotificationFilters | AnnouncementFilters) => void;
  categories?: AnnouncementCategory[];
  notificationTypes?: NotificationType[];
  showSearch?: boolean;
  showDateRange?: boolean;
}

// Utility Type Helpers
export type NotificationWithoutId = Omit<
  NotificationItem,
  "id" | "created_at" | "updated_at" | "time_ago"
>;
export type AnnouncementWithoutId = Omit<
  AnnouncementItem,
  "id" | "created_at" | "updated_at" | "time_ago" | "creator"
>;
export type PartialNotification = Partial<NotificationItem> &
  Pick<NotificationItem, "id">;
export type PartialAnnouncement = Partial<AnnouncementItem> &
  Pick<AnnouncementItem, "id">;

// Hook Return Types
export interface UseNotificationsReturn {
  notifications: NotificationItem[];
  stats: NotificationStats | null;
  loading: boolean;
  error: string | null;
  filters: NotificationFilters;
  selectedItems: number[];
  pagination: PaginationInfo;
  hasMore: boolean;
  // Actions
  fetchMore: () => Promise<void>;
  refresh: () => Promise<void>;
  setFilters: (filters: NotificationFilters) => void;
  markAsRead: (id?: number) => Promise<void>;
  deleteNotification: (id: number) => Promise<void>;
  bulkOperation: (operation: BulkOperation, ids: number[]) => Promise<void>;
  selectItem: (id: number, selected: boolean) => void;
  selectAll: (selected: boolean) => void;
}

export interface UseAnnouncementsReturn {
  announcements: AnnouncementItem[];
  loading: boolean;
  error: string | null;
  filters: AnnouncementFilters;
  selectedItems: number[];
  pagination: PaginationInfo;
  hasMore: boolean;
  categories: AnnouncementCategory[];
  // Actions
  fetchMore: () => Promise<void>;
  refresh: () => Promise<void>;
  setFilters: (filters: AnnouncementFilters) => void;
  performAction: (action: AnnouncementAction, id: number) => Promise<void>;
  selectItem: (id: number, selected: boolean) => void;
  selectAll: (selected: boolean) => void;
}
