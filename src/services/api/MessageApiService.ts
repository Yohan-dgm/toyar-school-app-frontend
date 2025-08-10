import {
  apiService,
  createEndpoint,
  ApiResponse,
  PaginatedResponse,
  FilterParams,
  apiUtils,
} from "./ApiService";

// Message types
export interface Message {
  id: string;
  subject: string;
  body: string;
  senderId: string;
  senderName: string;
  senderType:
    | "teacher"
    | "admin"
    | "parent"
    | "student"
    | "coach"
    | "counselor";
  recipientId: string;
  recipientType: "user" | "group" | "class" | "grade";
  messageType: "direct" | "announcement" | "alert" | "reminder";
  priority: "low" | "normal" | "high" | "urgent";
  status: "sent" | "delivered" | "read" | "replied";
  readAt?: string;
  repliedAt?: string;
  createdAt: string;
  updatedAt: string;
  attachments?: MessageAttachment[];
  threadId?: string;
  parentMessageId?: string;
  metadata?: Record<string, any>;
}

export interface MessageAttachment {
  id: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  url: string;
  thumbnailUrl?: string;
}

export interface CreateMessageRequest {
  subject: string;
  body: string;
  recipientId: string;
  recipientType: Message["recipientType"];
  messageType?: Message["messageType"];
  priority?: Message["priority"];
  attachments?: File[];
  parentMessageId?: string;
  scheduledAt?: string;
  metadata?: Record<string, any>;
}

export interface MessageFilters extends FilterParams {
  messageType?: Message["messageType"];
  senderType?: Message["senderType"];
  priority?: Message["priority"];
  status?: Message["status"];
  threadId?: string;
  unreadOnly?: boolean;
}

export interface MessageThread {
  id: string;
  subject: string;
  participants: MessageParticipant[];
  lastMessage: Message;
  unreadCount: number;
  messageCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface MessageParticipant {
  userId: string;
  userName: string;
  userType: Message["senderType"];
  joinedAt: string;
  lastReadAt?: string;
}

export interface MessageStats {
  total: number;
  unread: number;
  byType: Record<Message["messageType"], number>;
  byStatus: Record<Message["status"], number>;
  bySender: Record<Message["senderType"], number>;
}

// Enhanced message API service
export const messageApi = apiService.injectEndpoints({
  endpoints: (build) => ({
    // Get messages with filtering and pagination
    getMessages: build.query<PaginatedResponse<Message>, MessageFilters>({
      ...createEndpoint.query<PaginatedResponse<Message>, MessageFilters>({
        url: (params) => `/messages${apiUtils.buildQueryString(params)}`,
        tags: ["Message"],
        transformResponse: (response) => ({
          ...response,
          meta: apiUtils.transformPagination(response),
        }),
      }),
    }),

    // Get message by ID
    getMessage: build.query<ApiResponse<Message>, string>({
      ...createEndpoint.query<ApiResponse<Message>, string>({
        url: (id) => `/messages/${id}`,
        tags: (_, result) => [{ type: "Message", id: result.data?.id }],
      }),
    }),

    // Get message threads
    getMessageThreads: build.query<
      PaginatedResponse<MessageThread>,
      FilterParams
    >({
      ...createEndpoint.query<PaginatedResponse<MessageThread>, FilterParams>({
        url: (params) =>
          `/messages/threads${apiUtils.buildQueryString(params)}`,
        tags: ["Message"],
        transformResponse: (response) => ({
          ...response,
          meta: apiUtils.transformPagination(response),
        }),
      }),
    }),

    // Get messages in a thread
    getThreadMessages: build.query<
      PaginatedResponse<Message>,
      { threadId: string } & FilterParams
    >({
      ...createEndpoint.query<
        PaginatedResponse<Message>,
        { threadId: string } & FilterParams
      >({
        url: ({ threadId, ...params }) =>
          `/messages/threads/${threadId}/messages${apiUtils.buildQueryString(params)}`,
        tags: ["Message"],
        transformResponse: (response) => ({
          ...response,
          meta: apiUtils.transformPagination(response),
        }),
      }),
    }),

    // Get message statistics
    getMessageStats: build.query<ApiResponse<MessageStats>, void>({
      ...createEndpoint.query<ApiResponse<MessageStats>, void>({
        url: "/messages/stats",
        tags: ["Message"],
      }),
    }),

    // Create new message
    createMessage: build.mutation<ApiResponse<Message>, CreateMessageRequest>({
      ...createEndpoint.mutation<ApiResponse<Message>, CreateMessageRequest>({
        url: "/messages",
        method: "POST",
        tags: ["Message"],
      }),
    }),

    // Reply to message
    replyToMessage: build.mutation<
      ApiResponse<Message>,
      { messageId: string; body: string; attachments?: File[] }
    >({
      ...createEndpoint.mutation<
        ApiResponse<Message>,
        { messageId: string; body: string; attachments?: File[] }
      >({
        url: ({ messageId }) => `/messages/${messageId}/reply`,
        method: "POST",
        tags: ["Message"],
      }),
    }),

    // Forward message
    forwardMessage: build.mutation<
      ApiResponse<Message>,
      { messageId: string; recipientId: string; body?: string }
    >({
      ...createEndpoint.mutation<
        ApiResponse<Message>,
        { messageId: string; recipientId: string; body?: string }
      >({
        url: ({ messageId }) => `/messages/${messageId}/forward`,
        method: "POST",
        tags: ["Message"],
      }),
    }),

    // Mark message as read
    markMessageRead: build.mutation<ApiResponse<Message>, string>({
      ...createEndpoint.mutation<ApiResponse<Message>, string>({
        url: (id) => `/messages/${id}/read`,
        method: "PATCH",
        tags: (_, result) => [
          { type: "Message", id: result.data?.id },
          "Message",
        ],
      }),
    }),

    // Mark multiple messages as read
    markMessagesRead: build.mutation<
      ApiResponse<{ updated: number }>,
      string[]
    >({
      ...createEndpoint.mutation<ApiResponse<{ updated: number }>, string[]>({
        url: "/messages/mark-read",
        method: "PATCH",
        tags: ["Message"],
      }),
    }),

    // Mark thread as read
    markThreadRead: build.mutation<ApiResponse<{ updated: number }>, string>({
      ...createEndpoint.mutation<ApiResponse<{ updated: number }>, string>({
        url: (threadId) => `/messages/threads/${threadId}/read`,
        method: "PATCH",
        tags: ["Message"],
      }),
    }),

    // Delete message
    deleteMessage: build.mutation<ApiResponse<void>, string>({
      ...createEndpoint.mutation<ApiResponse<void>, string>({
        url: (id) => `/messages/${id}`,
        method: "DELETE",
        tags: ["Message"],
      }),
    }),

    // Delete multiple messages
    deleteMessages: build.mutation<ApiResponse<{ deleted: number }>, string[]>({
      ...createEndpoint.mutation<ApiResponse<{ deleted: number }>, string[]>({
        url: "/messages/bulk-delete",
        method: "DELETE",
        tags: ["Message"],
      }),
    }),

    // Upload message attachment
    uploadAttachment: build.mutation<
      ApiResponse<MessageAttachment>,
      { file: File; messageId?: string }
    >({
      query: ({ file, messageId }) => {
        const formData = new FormData();
        formData.append("file", file);
        if (messageId) {
          formData.append("messageId", messageId);
        }

        return {
          url: "/messages/attachments",
          method: "POST",
          body: formData,
          formData: true,
        };
      },
      invalidatesTags: ["Message"],
    }),

    // Download attachment
    downloadAttachment: build.query<Blob, string>({
      query: (attachmentId) => ({
        url: `/messages/attachments/${attachmentId}/download`,
        responseHandler: (response) => response.blob(),
      }),
    }),

    // Search messages
    searchMessages: build.query<
      PaginatedResponse<Message>,
      { query: string } & FilterParams
    >({
      ...createEndpoint.query<
        PaginatedResponse<Message>,
        { query: string } & FilterParams
      >({
        url: (params) => `/messages/search${apiUtils.buildQueryString(params)}`,
        tags: ["Message"],
        transformResponse: (response) => ({
          ...response,
          meta: apiUtils.transformPagination(response),
        }),
      }),
    }),

    // Get conversation between two users
    getConversation: build.query<
      PaginatedResponse<Message>,
      { otherUserId: string } & FilterParams
    >({
      ...createEndpoint.query<
        PaginatedResponse<Message>,
        { otherUserId: string } & FilterParams
      >({
        url: ({ otherUserId, ...params }) =>
          `/messages/conversations/${otherUserId}${apiUtils.buildQueryString(params)}`,
        tags: ["Message"],
        transformResponse: (response) => ({
          ...response,
          meta: apiUtils.transformPagination(response),
        }),
      }),
    }),

    // Get user contacts (people user has messaged with)
    getContacts: build.query<ApiResponse<MessageParticipant[]>, FilterParams>({
      ...createEndpoint.query<ApiResponse<MessageParticipant[]>, FilterParams>({
        url: (params) =>
          `/messages/contacts${apiUtils.buildQueryString(params)}`,
        tags: ["Message"],
      }),
    }),

    // Archive message
    archiveMessage: build.mutation<ApiResponse<Message>, string>({
      ...createEndpoint.mutation<ApiResponse<Message>, string>({
        url: (id) => `/messages/${id}/archive`,
        method: "PATCH",
        tags: (_, result) => [
          { type: "Message", id: result.data?.id },
          "Message",
        ],
      }),
    }),

    // Unarchive message
    unarchiveMessage: build.mutation<ApiResponse<Message>, string>({
      ...createEndpoint.mutation<ApiResponse<Message>, string>({
        url: (id) => `/messages/${id}/unarchive`,
        method: "PATCH",
        tags: (_, result) => [
          { type: "Message", id: result.data?.id },
          "Message",
        ],
      }),
    }),
  }),
});

// Export hooks for components
export const {
  useGetMessagesQuery,
  useGetMessageQuery,
  useGetMessageThreadsQuery,
  useGetThreadMessagesQuery,
  useGetMessageStatsQuery,
  useCreateMessageMutation,
  useReplyToMessageMutation,
  useForwardMessageMutation,
  useMarkMessageReadMutation,
  useMarkMessagesReadMutation,
  useMarkThreadReadMutation,
  useDeleteMessageMutation,
  useDeleteMessagesMutation,
  useUploadAttachmentMutation,
  useDownloadAttachmentQuery,
  useSearchMessagesQuery,
  useGetConversationQuery,
  useGetContactsQuery,
  useArchiveMessageMutation,
  useUnarchiveMessageMutation,
} = messageApi;

export default messageApi;
