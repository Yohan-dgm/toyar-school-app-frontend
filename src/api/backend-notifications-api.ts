import { apiServer1 } from "./api-server-1";

// ============================================================================
// BACKEND-COMPATIBLE NOTIFICATIONS API
// Matches the actual backend API implementation with POST endpoints
// ============================================================================

// Request/Response interfaces based on actual backend
interface BackendNotificationRequest {
  userId: string;
  page?: number;
  limit?: number;
  filter?: "all" | "read" | "unread";
  priority?: "normal" | "high" | "urgent";
  type_id?: number;
  search?: string;
}

interface BackendNotification {
  id: number;
  notification_type_id: number;
  title: string;
  message: string;
  priority: "normal" | "high" | "urgent";
  is_read: boolean;
  created_at: string;
  updated_at: string;
  image_url?: string;
  action_url?: string;
  action_text?: string;
  expires_at?: string;
  notification_type?: {
    id: number;
    name: string;
    icon: string;
    color: string;
  };
}

interface BackendNotificationsResponse {
  success: boolean;
  message: string;
  data: {
    notifications: BackendNotification[];
    pagination: {
      current_page: number;
      per_page: number;
      total: number;
      last_page: number;
      from: number;
      to: number;
      has_more_pages: boolean;
    };
    unread_count: number;
  };
}

interface BackendCreateNotificationRequest {
  notification_type_id: number;
  title: string;
  message: string;
  priority: "normal" | "high" | "urgent";
  target_type: "broadcast" | "user" | "role" | "class" | "grade" | "school";
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
  school_id?: number;
}

interface BackendMarkReadRequest {
  userId: string;
  notificationId: string;
}

interface BackendMarkAllReadRequest {
  userId: string;
}

interface BackendDeleteRequest {
  userId: string;
  notificationId: string;
}

interface BackendNotificationDetailsRequest {
  userId: string;
  notificationId: string;
}

interface BackendNotificationTypes {
  success: boolean;
  message: string;
  data: Array<{
    id: number;
    name: string;
    slug: string;
    description: string;
    icon: string;
    color: string;
    is_active: boolean;
  }>;
}

interface BackendAnnouncementCategories {
  success: boolean;
  message: string;
  data: Array<{
    id: number;
    name: string;
    slug: string;
    description: string;
    color: string;
    icon: string;
    is_active: boolean;
  }>;
}

interface BackendAnnouncementsRequest {
  page?: number;
  per_page?: number;
  category_id?: number;
  priority_level?: number;
  status?: "draft" | "published" | "scheduled" | "archived";
  is_featured?: boolean;
  is_pinned?: boolean;
  search?: string;
}

interface BackendAnnouncementsResponse {
  success: boolean;
  message: string;
  data: Array<{
    id: number;
    title: string;
    content: string;
    excerpt?: string;
    category_id: number;
    priority_level: number;
    status: string;
    image_url?: string;
    is_featured: boolean;
    is_pinned: boolean;
    published_at?: string;
    expires_at?: string;
    created_at: string;
    updated_at: string;
    category?: {
      id: number;
      name: string;
      color: string;
      icon: string;
    };
  }>;
}

interface BackendNotificationStats {
  success: boolean;
  message: string;
  data: {
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
  };
}

export const backendNotificationsApi = apiServer1.injectEndpoints({
  endpoints: (builder) => ({
    // Get Notifications List - GET /api/notifications/{userId}
    getBackendNotifications: builder.query<
      BackendNotificationsResponse,
      BackendNotificationRequest
    >({
      query: ({ userId, page = 1, limit = 20, ...filters }) => ({
        url: `/notifications/${userId}`,
        method: "GET",
        params: {
          page,
          limit,
          ...filters,
        },
      }),
      providesTags: ["Notifications"],
    }),

    // Create Notification - POST /api/communication-management/notifications/create
    createBackendNotification: builder.mutation<
      { success: boolean; message: string; data: BackendNotification },
      BackendCreateNotificationRequest
    >({
      query: (notification) => ({
        url: "/communication-management/notifications/create",
        method: "POST",
        body: notification,
      }),
      invalidatesTags: ["Notifications", "NotificationStats"],
    }),

    // Mark as Read - PATCH /api/notifications/{userId}/{notificationId}/read
    markBackendNotificationAsRead: builder.mutation<
      { success: boolean; message: string },
      BackendMarkReadRequest
    >({
      query: ({ userId, notificationId }) => ({
        url: `/notifications/${userId}/${notificationId}/read`,
        method: "PATCH",
      }),
      invalidatesTags: ["Notifications", "NotificationStats"],
    }),

    // Delete Notification - DELETE /api/notifications/{userId}/{notificationId}
    deleteBackendNotification: builder.mutation<
      { success: boolean; message: string },
      BackendDeleteRequest
    >({
      query: ({ userId, notificationId }) => ({
        url: `/notifications/${userId}/${notificationId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Notifications", "NotificationStats"],
    }),

    // Get Notification Details - GET /api/notifications/{userId}/{notificationId}
    getBackendNotificationDetails: builder.query<
      { success: boolean; message: string; data: BackendNotification },
      BackendNotificationDetailsRequest
    >({
      query: ({ userId, notificationId }) => ({
        url: `/notifications/${userId}/${notificationId}`,
        method: "GET",
      }),
      providesTags: (result, error, arg) => [
        { type: "Notifications", id: arg.notificationId || "LIST" },
      ],
    }),

    // Note: Notification types, announcement categories, and announcements
    // are not available in the current backend API
    // These would need to be implemented on the backend first

    // Get Notification Stats - GET /api/notifications/{userId}/stats
    getBackendNotificationStats: builder.query<BackendNotificationStats, string>({
      query: (userId) => ({
        url: `/notifications/${userId}/stats`,
        method: "GET",
      }),
      providesTags: ["NotificationStats"],
    }),

    // Mark All Notifications as Read - PATCH /api/notifications/{userId}/mark-all-read
    markAllBackendNotificationsAsRead: builder.mutation<
      { success: boolean; message: string },
      BackendMarkAllReadRequest
    >({
      query: ({ userId }) => ({
        url: `/notifications/${userId}/mark-all-read`,
        method: "PATCH",
      }),
      invalidatesTags: ["Notifications", "NotificationStats"],
    }),

    // Bulk Operations - For now, we'll implement basic mark all as read
    // Individual operations can be called multiple times for bulk actions
    bulkBackendNotificationOperation: builder.mutation<
      { success: boolean; message: string },
      {
        action: "mark_read" | "delete";
        notification_ids: number[] | "all";
        userId: string;
      }
    >({
      query: (params) => {
        if (params.action === "mark_read" && params.notification_ids === "all") {
          return {
            url: `/notifications/${params.userId}/mark-all-read`,
            method: "PATCH",
          };
        }
        // For individual bulk operations, we'll need to handle them differently
        // This is a placeholder - actual implementation would need multiple API calls
        throw new Error("Bulk operations for individual items not yet implemented. Use mark all instead.");
      },
      invalidatesTags: ["Notifications", "NotificationStats"],
    }),
  }),
  overrideExisting: false,
});

// Export hooks for components to use
export const {
  useGetBackendNotificationsQuery,
  useCreateBackendNotificationMutation,
  useMarkBackendNotificationAsReadMutation,
  useDeleteBackendNotificationMutation,
  useGetBackendNotificationDetailsQuery,
  useGetBackendNotificationStatsQuery,
  useMarkAllBackendNotificationsAsReadMutation,
  useBulkBackendNotificationOperationMutation,
} = backendNotificationsApi;

// Export types for component usage
export type {
  BackendNotification,
  BackendNotificationsResponse,
  BackendCreateNotificationRequest,
  BackendNotificationRequest,
  BackendNotificationStats,
  BackendAnnouncementsRequest,
  BackendAnnouncementsResponse,
};