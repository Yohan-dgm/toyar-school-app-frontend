import {
  apiService,
  createEndpoint,
  ApiResponse,
  PaginatedResponse,
  FilterParams,
  apiUtils,
} from "./ApiService";

// Notification types
export interface Notification {
  id: string;
  title: string;
  body: string;
  type: "academic" | "payment" | "event" | "general" | "emergency";
  category: string;
  priority: "low" | "normal" | "high" | "urgent";
  read: boolean;
  createdAt: string;
  updatedAt: string;
  userId: string;
  userCategory: number;
  studentId?: string;
  data?: Record<string, any>;
  actions?: NotificationAction[];
}

export interface NotificationAction {
  id: string;
  title: string;
  type: "button" | "input" | "link";
  url?: string;
  data?: Record<string, any>;
}

export interface CreateNotificationRequest {
  title: string;
  body: string;
  type: Notification["type"];
  category?: string;
  priority?: Notification["priority"];
  targetUsers?: string[];
  targetUserCategories?: number[];
  studentId?: string;
  data?: Record<string, any>;
  scheduledAt?: string;
  actions?: Omit<NotificationAction, "id">[];
}

export interface NotificationFilters extends FilterParams {
  type?: Notification["type"];
  priority?: Notification["priority"];
  read?: boolean;
  studentId?: string;
}

export interface NotificationStats {
  total: number;
  unread: number;
  byType: Record<Notification["type"], number>;
  byPriority: Record<Notification["priority"], number>;
}

// Enhanced notification API service
export const notificationApi = apiService.injectEndpoints({
  endpoints: (build) => ({
    // Get notifications with filtering and pagination
    getNotifications: build.query<
      PaginatedResponse<Notification>,
      NotificationFilters
    >({
      ...createEndpoint.query<
        PaginatedResponse<Notification>,
        NotificationFilters
      >({
        url: (params) => `/notifications${apiUtils.buildQueryString(params)}`,
        tags: ["Notification"],
        transformResponse: (response) => ({
          ...response,
          meta: apiUtils.transformPagination(response),
        }),
      }),
    }),

    // Get notification by ID
    getNotification: build.query<ApiResponse<Notification>, string>({
      ...createEndpoint.query<ApiResponse<Notification>, string>({
        url: (id) => `/notifications/${id}`,
        tags: (_, result) => [{ type: "Notification", id: result.data?.id }],
      }),
    }),

    // Get notification statistics
    getNotificationStats: build.query<
      ApiResponse<NotificationStats>,
      { studentId?: string }
    >({
      ...createEndpoint.query<
        ApiResponse<NotificationStats>,
        { studentId?: string }
      >({
        url: (params) =>
          `/notifications/stats${apiUtils.buildQueryString(params)}`,
        tags: ["Notification"],
      }),
    }),

    // Create new notification
    createNotification: build.mutation<
      ApiResponse<Notification>,
      CreateNotificationRequest
    >({
      ...createEndpoint.mutation<
        ApiResponse<Notification>,
        CreateNotificationRequest
      >({
        url: "/notifications",
        method: "POST",
        tags: ["Notification"],
      }),
    }),

    // Mark notification as read
    markNotificationRead: build.mutation<ApiResponse<Notification>, string>({
      ...createEndpoint.mutation<ApiResponse<Notification>, string>({
        url: (id) => `/notifications/${id}/read`,
        method: "PATCH",
        tags: (_, result) => [
          { type: "Notification", id: result.data?.id },
          "Notification",
        ],
      }),
    }),

    // Mark multiple notifications as read
    markNotificationsRead: build.mutation<
      ApiResponse<{ updated: number }>,
      string[]
    >({
      ...createEndpoint.mutation<ApiResponse<{ updated: number }>, string[]>({
        url: "/notifications/mark-read",
        method: "PATCH",
        tags: ["Notification"],
      }),
    }),

    // Mark all notifications as read
    markAllNotificationsRead: build.mutation<
      ApiResponse<{ updated: number }>,
      { studentId?: string }
    >({
      ...createEndpoint.mutation<
        ApiResponse<{ updated: number }>,
        { studentId?: string }
      >({
        url: "/notifications/mark-all-read",
        method: "PATCH",
        tags: ["Notification"],
      }),
    }),

    // Delete notification
    deleteNotification: build.mutation<ApiResponse<void>, string>({
      ...createEndpoint.mutation<ApiResponse<void>, string>({
        url: (id) => `/notifications/${id}`,
        method: "DELETE",
        tags: ["Notification"],
      }),
    }),

    // Delete multiple notifications
    deleteNotifications: build.mutation<
      ApiResponse<{ deleted: number }>,
      string[]
    >({
      ...createEndpoint.mutation<ApiResponse<{ deleted: number }>, string[]>({
        url: "/notifications/bulk-delete",
        method: "DELETE",
        tags: ["Notification"],
      }),
    }),

    // Get notification preferences
    getNotificationPreferences: build.query<
      ApiResponse<NotificationPreferences>,
      void
    >({
      ...createEndpoint.query<ApiResponse<NotificationPreferences>, void>({
        url: "/notifications/preferences",
        tags: ["User"],
      }),
    }),

    // Update notification preferences
    updateNotificationPreferences: build.mutation<
      ApiResponse<NotificationPreferences>,
      Partial<NotificationPreferences>
    >({
      ...createEndpoint.mutation<
        ApiResponse<NotificationPreferences>,
        Partial<NotificationPreferences>
      >({
        url: "/notifications/preferences",
        method: "PUT",
        tags: ["User"],
      }),
    }),

    // Register push notification token
    registerPushToken: build.mutation<
      ApiResponse<void>,
      { token: string; platform: "ios" | "android" | "web" }
    >({
      ...createEndpoint.mutation<
        ApiResponse<void>,
        { token: string; platform: "ios" | "android" | "web" }
      >({
        url: "/notifications/push-token",
        method: "POST",
        tags: ["User"],
      }),
    }),

    // Send test notification
    sendTestNotification: build.mutation<
      ApiResponse<Notification>,
      { type: Notification["type"] }
    >({
      ...createEndpoint.mutation<
        ApiResponse<Notification>,
        { type: Notification["type"] }
      >({
        url: "/notifications/test",
        method: "POST",
        tags: ["Notification"],
      }),
    }),
  }),
});

// Notification preferences interface
export interface NotificationPreferences {
  pushNotifications: {
    enabled: boolean;
    academic: boolean;
    payment: boolean;
    event: boolean;
    general: boolean;
    emergency: boolean;
  };
  emailNotifications: {
    enabled: boolean;
    academic: boolean;
    payment: boolean;
    event: boolean;
    general: boolean;
    emergency: boolean;
  };
  inAppNotifications: {
    enabled: boolean;
    academic: boolean;
    payment: boolean;
    event: boolean;
    general: boolean;
    emergency: boolean;
  };
  quietHours: {
    enabled: boolean;
    startTime: string; // HH:mm format
    endTime: string; // HH:mm format
  };
  frequency: {
    academic: "immediate" | "daily" | "weekly";
    payment: "immediate" | "daily" | "weekly";
    event: "immediate" | "daily" | "weekly";
    general: "immediate" | "daily" | "weekly";
  };
}

// Export hooks for components
export const {
  useGetNotificationsQuery,
  useGetNotificationQuery,
  useGetNotificationStatsQuery,
  useCreateNotificationMutation,
  useMarkNotificationReadMutation,
  useMarkNotificationsReadMutation,
  useMarkAllNotificationsReadMutation,
  useDeleteNotificationMutation,
  useDeleteNotificationsMutation,
  useGetNotificationPreferencesQuery,
  useUpdateNotificationPreferencesMutation,
  useRegisterPushTokenMutation,
  useSendTestNotificationMutation,
} = notificationApi;

export default notificationApi;
