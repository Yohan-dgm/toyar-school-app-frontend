import { apiServer1 } from "./api-server-1";

// ============================================================================
// COMMUNICATION MANAGEMENT API
// Comprehensive notification and announcement system API
// ============================================================================

// Core Request/Response Interfaces
interface PaginationParams {
  page?: number;
  per_page?: number;
}

interface PaginationResponse {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
  from: number;
  to: number;
  has_more_pages: boolean;
}

interface ApiSuccessResponse<T> {
  success: true;
  message: string;
  data: T;
}

interface PaginatedApiResponse<T> {
  success: true;
  message: string;
  data: {
    items: T[];
    pagination: PaginationResponse;
  };
}

// Notification Types (Predefined in backend)
interface NotificationType {
  id: number;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  is_active: boolean;
}

// Announcement Categories (Predefined in backend)
interface AnnouncementCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  color: string;
  icon: string;
  sort_order: number;
  is_active: boolean;
}

// Core Data Interfaces
interface NotificationItem {
  id: number;
  notification_type: NotificationType;
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
}

interface AnnouncementItem {
  id: number;
  title: string;
  content: string;
  excerpt: string;
  category: AnnouncementCategory;
  priority_level: 1 | 2 | 3;
  priority_label: "Low" | "Medium" | "High";
  priority_color: string;
  status: "draft" | "scheduled" | "published" | "archived";
  status_label: string;
  status_color: string;
  target_type: string;
  target_display: string;
  target_data?: Record<string, any>;
  image_url?: string;
  attachment_urls?: string[];
  is_featured: boolean;
  is_pinned: boolean;
  scheduled_at?: string;
  published_at?: string;
  expires_at?: string;
  view_count: number;
  like_count: number;
  is_read?: boolean;
  is_liked?: boolean;
  notification_sent: boolean;
  tags_array: string[];
  meta_data?: Record<string, any>;
  creator: {
    id: number;
    name: string;
    username: string;
  };
  created_at: string;
  time_ago: string;
  read_time: number;
}

// Request Interfaces
interface CreateNotificationRequest {
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
}

interface GetNotificationsRequest extends PaginationParams {
  filter?: "all" | "read" | "unread" | "delivered" | "pending";
  priority?: "normal" | "high" | "urgent";
  type_id?: number;
  search?: string;
  unread_only?: boolean;
}

interface MarkAsReadRequest {
  notification_id?: number;
  mark_all?: boolean;
}

interface DeleteNotificationRequest {
  notification_id: number;
}

interface GetNotificationDetailsRequest {
  notification_id: number;
}

interface CreateAnnouncementRequest {
  title: string;
  content: string;
  excerpt?: string;
  category_id: number;
  priority_level: 1 | 2 | 3;
  status: "draft" | "scheduled" | "published";
  target_type?: "broadcast" | "role" | "class" | "grade" | "user";
  target_data?: {
    roles?: string[];
    user_ids?: number[];
    grade_level_class_ids?: number[];
    grade_level_ids?: number[];
  };
  image_url?: string;
  attachment_urls?: string[];
  is_featured?: boolean;
  is_pinned?: boolean;
  scheduled_at?: string;
  expires_at?: string;
  tags?: string;
  meta_data?: Record<string, any>;
}

interface GetAnnouncementsRequest extends PaginationParams {
  category_id?: number;
  priority_level?: 1 | 2 | 3;
  status?: "draft" | "scheduled" | "published" | "archived";
  is_featured?: boolean;
  is_pinned?: boolean;
  search?: string;
  tags?: string;
  date_from?: string;
  date_to?: string;
}

interface GetAnnouncementDetailsRequest {
  announcement_id: number;
}

interface BulkOperationRequest {
  operation: "mark_read" | "delete" | "archive";
  notification_ids: number[];
}

interface AnnouncementActionRequest {
  announcement_id: number;
  action: "like" | "unlike" | "bookmark" | "unbookmark";
}

// Response Interfaces  
interface GetNotificationsResponse {
  success: true;
  message: string;
  data: {
    notifications: NotificationItem[];
    pagination: PaginationResponse;
    unread_count: number;
  };
}

interface NotificationStatsResponse {
  success: true;
  message: string;
  data: {
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
  };
}

// Enhanced logging utility for API calls
const apiLogger = {
  request: (endpoint: string, method: string, params?: any) => {
    console.log(`📤 [CommunicationAPI] Request - ${method} ${endpoint}`, {
      timestamp: new Date().toISOString(),
      endpoint,
      method,
      params,
      baseUrl: process.env.EXPO_PUBLIC_BASE_URL_API_SERVER_1,
    });
  },
  response: (endpoint: string, method: string, data: any, duration?: number) => {
    console.log(`📥 [CommunicationAPI] Response - ${method} ${endpoint}`, {
      timestamp: new Date().toISOString(),
      endpoint,
      method,
      responseType: typeof data,
      hasData: !!data,
      duration: duration ? `${duration}ms` : 'unknown',
      preview: data ? {
        success: data.success,
        message: data.message,
        dataKeys: data.data ? Object.keys(data.data).slice(0, 5) : [],
      } : null,
      fullResponse: data,
    });
  },
  error: (endpoint: string, method: string, error: any) => {
    console.error(`❌ [CommunicationAPI] Error - ${method} ${endpoint}`, {
      timestamp: new Date().toISOString(),
      endpoint,
      method,
      status: error?.status,
      statusText: error?.statusText,
      errorData: error?.data,
      errorMessage: error?.message,
      fullError: error,
    });
  },
};

// API Implementation with enhanced logging
export const communicationManagementApi = apiServer1.injectEndpoints({
  endpoints: (builder) => ({
    // ========================================================================
    // NOTIFICATION ENDPOINTS
    // ========================================================================

    // Get notification types
    getNotificationTypes: builder.query<NotificationType[], void>({
      query: () => {
        const endpoint = "/communication-management/notification-types";
        const method = "GET";
        apiLogger.request(endpoint, method);
        return endpoint;
      },
      providesTags: ["NotificationTypes"],
      transformResponse: (response: any) => {
        const endpoint = "/communication-management/notification-types";
        const method = "GET";
        apiLogger.response(endpoint, method, response);
        return response;
      },
    }),

    // Create notification (Admin/Teacher only)
    createNotification: builder.mutation<
      ApiSuccessResponse<NotificationItem>,
      CreateNotificationRequest
    >({
      query: (notification) => ({
        url: "/communication-management/notifications/create",
        method: "POST",
        body: notification,
      }),
      invalidatesTags: ["Notifications", "NotificationStats"],
    }),

    // Get user notifications with filtering
    getNotifications: builder.query<
      GetNotificationsResponse,
      GetNotificationsRequest
    >({
      query: (params) => {
        const endpoint = "/communication-management/notifications/list";
        const method = "POST";
        apiLogger.request(endpoint, method, params);
        return {
          url: endpoint,
          method: method,
          body: params,
        };
      },
      providesTags: ["Notifications"],
      transformResponse: (response: any) => {
        const endpoint = "/communication-management/notifications/list";
        const method = "POST";
        apiLogger.response(endpoint, method, response);
        return response;
      },
    }),

    // Get notification statistics
    getNotificationStats: builder.query<NotificationStatsResponse, void>({
      query: () => {
        const endpoint = "/communication-management/notifications/stats";
        const method = "GET";
        apiLogger.request(endpoint, method);
        return endpoint;
      },
      providesTags: ["NotificationStats"],
      transformResponse: (response: any) => {
        const endpoint = "/communication-management/notifications/stats";
        const method = "GET";
        apiLogger.response(endpoint, method, response);
        return response;
      },
    }),

    // Mark notification(s) as read
    markNotificationAsRead: builder.mutation<
      ApiSuccessResponse<void>,
      MarkAsReadRequest
    >({
      query: (params) => ({
        url: "/communication-management/notifications/mark-read",
        method: "POST",
        body: params,
      }),
      invalidatesTags: ["Notifications", "NotificationStats"],
    }),

    // Delete notification
    deleteNotification: builder.mutation<
      ApiSuccessResponse<void>,
      DeleteNotificationRequest
    >({
      query: (params) => ({
        url: "/communication-management/notifications/delete",
        method: "POST",
        body: params,
      }),
      invalidatesTags: ["Notifications", "NotificationStats"],
    }),

    // Get notification details
    getNotificationDetails: builder.query<
      ApiSuccessResponse<NotificationItem>,
      GetNotificationDetailsRequest
    >({
      query: (params) => ({
        url: "/communication-management/notifications/details",
        method: "POST",
        body: params,
      }),
      providesTags: (result, error, arg) => [
        { type: "Notifications", id: arg.notification_id },
      ],
    }),

    // Bulk operations on notifications
    bulkNotificationOperation: builder.mutation<
      ApiSuccessResponse<void>,
      BulkOperationRequest
    >({
      query: (params) => ({
        url: "/communication-management/notifications/bulk",
        method: "POST",
        body: params,
      }),
      invalidatesTags: ["Notifications", "NotificationStats"],
    }),

    // ========================================================================
    // ANNOUNCEMENT ENDPOINTS  
    // ========================================================================

    // Get announcement categories
    getAnnouncementCategories: builder.query<AnnouncementCategory[], void>({
      query: () => {
        const endpoint = "/communication-management/announcement-categories";
        const method = "GET";
        apiLogger.request(endpoint, method);
        return endpoint;
      },
      providesTags: ["AnnouncementCategories"],
      transformResponse: (response: any) => {
        const endpoint = "/communication-management/announcement-categories";
        const method = "GET";
        apiLogger.response(endpoint, method, response);
        return response;
      },
    }),

    // Create announcement
    createAnnouncement: builder.mutation<
      ApiSuccessResponse<AnnouncementItem>,
      CreateAnnouncementRequest
    >({
      query: (announcement) => ({
        url: "/communication-management/announcements/create",
        method: "POST",
        body: announcement,
      }),
      invalidatesTags: ["Announcements"],
    }),

    // Get announcements with filtering
    getAnnouncements: builder.query<
      PaginatedApiResponse<AnnouncementItem>,
      GetAnnouncementsRequest
    >({
      query: (params) => ({
        url: "/communication-management/announcements/list",
        method: "POST",
        body: params,
      }),
      providesTags: ["Announcements"],
    }),

    // Get announcement details
    getAnnouncementDetails: builder.query<
      ApiSuccessResponse<AnnouncementItem>,
      GetAnnouncementDetailsRequest
    >({
      query: (params) => ({
        url: "/communication-management/announcements/details",
        method: "POST",
        body: params,
      }),
      providesTags: (result, error, arg) => [
        { type: "Announcements", id: arg.announcement_id },
      ],
    }),

    // Update announcement
    updateAnnouncement: builder.mutation<
      ApiSuccessResponse<AnnouncementItem>,
      { announcement_id: number } & Partial<CreateAnnouncementRequest>
    >({
      query: ({ announcement_id, ...data }) => ({
        url: `/communication-management/announcements/${announcement_id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, arg) => [
        "Announcements",
        { type: "Announcements", id: arg.announcement_id },
      ],
    }),

    // Delete announcement
    deleteAnnouncement: builder.mutation<
      ApiSuccessResponse<void>,
      { announcement_id: number }
    >({
      query: ({ announcement_id }) => ({
        url: `/communication-management/announcements/${announcement_id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Announcements"],
    }),

    // Publish announcement
    publishAnnouncement: builder.mutation<
      ApiSuccessResponse<AnnouncementItem>,
      { announcement_id: number }
    >({
      query: ({ announcement_id }) => ({
        url: `/communication-management/announcements/${announcement_id}/publish`,
        method: "POST",
      }),
      invalidatesTags: (result, error, arg) => [
        "Announcements",
        { type: "Announcements", id: arg.announcement_id },
      ],
    }),

    // Announcement actions (like, bookmark, etc.)
    performAnnouncementAction: builder.mutation<
      ApiSuccessResponse<void>,
      AnnouncementActionRequest
    >({
      query: (params) => ({
        url: "/communication-management/announcements/action",
        method: "POST",
        body: params,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Announcements", id: arg.announcement_id },
      ],
    }),

    // ========================================================================
    // REAL-TIME & UTILITY ENDPOINTS
    // ========================================================================

    // Subscribe to push notifications
    subscribeToPushNotifications: builder.mutation<
      ApiSuccessResponse<void>,
      { subscription: any; device_type: "web" | "mobile" }
    >({
      query: (params) => ({
        url: "/communication-management/notifications/subscribe",
        method: "POST",
        body: params,
      }),
    }),

    // Unsubscribe from push notifications
    unsubscribeFromPushNotifications: builder.mutation<
      ApiSuccessResponse<void>,
      { endpoint: string }
    >({
      query: (params) => ({
        url: "/communication-management/notifications/unsubscribe",
        method: "POST",
        body: params,
      }),
    }),

    // Get user notification preferences
    getNotificationPreferences: builder.query<
      ApiSuccessResponse<{
        email_notifications: boolean;
        push_notifications: boolean;
        sms_notifications: boolean;
        in_app_notifications: boolean;
        notification_types: Record<string, boolean>;
        quiet_hours: {
          enabled: boolean;
          start_time: string;
          end_time: string;
        };
      }>,
      void
    >({
      query: () => "/communication-management/notifications/preferences",
      providesTags: ["NotificationPreferences"],
    }),

    // Update user notification preferences
    updateNotificationPreferences: builder.mutation<
      ApiSuccessResponse<void>,
      {
        email_notifications?: boolean;
        push_notifications?: boolean;
        sms_notifications?: boolean;
        in_app_notifications?: boolean;
        notification_types?: Record<string, boolean>;
        quiet_hours?: {
          enabled: boolean;
          start_time: string;
          end_time: string;
        };
      }
    >({
      query: (preferences) => ({
        url: "/communication-management/notifications/preferences",
        method: "PUT",
        body: preferences,
      }),
      invalidatesTags: ["NotificationPreferences"],
    }),
  }),
  overrideExisting: false,
});

// Export hooks for components to use
export const {
  // Notification Types
  useGetNotificationTypesQuery,

  // Notification Operations
  useCreateNotificationMutation,
  useGetNotificationsQuery,
  useGetNotificationStatsQuery,
  useMarkNotificationAsReadMutation,
  useDeleteNotificationMutation,
  useGetNotificationDetailsQuery,
  useBulkNotificationOperationMutation,

  // Announcement Categories
  useGetAnnouncementCategoriesQuery,

  // Announcement Operations
  useCreateAnnouncementMutation,
  useGetAnnouncementsQuery,
  useGetAnnouncementDetailsQuery,
  useUpdateAnnouncementMutation,
  useDeleteAnnouncementMutation,
  usePublishAnnouncementMutation,
  usePerformAnnouncementActionMutation,

  // Real-time & Utilities
  useSubscribeToPushNotificationsMutation,
  useUnsubscribeFromPushNotificationsMutation,
  useGetNotificationPreferencesQuery,
  useUpdateNotificationPreferencesMutation,
} = communicationManagementApi;

// Export types for component usage
export type {
  NotificationType,
  AnnouncementCategory,
  NotificationItem,
  AnnouncementItem,
  CreateNotificationRequest,
  GetNotificationsRequest,
  CreateAnnouncementRequest,
  GetAnnouncementsRequest,
  BulkOperationRequest,
  AnnouncementActionRequest,
};