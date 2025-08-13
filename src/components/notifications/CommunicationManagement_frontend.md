# Communication Management Module - Frontend Documentation

## Table of Contents

1. [Overview](#overview)
2. [API Endpoints](#api-endpoints)
3. [Data Structures](#data-structures)
4. [Authentication](#authentication)
5. [Implementation Examples](#implementation-examples)
6. [Error Handling](#error-handling)
7. [Real-time Features](#real-time-features)
8. [UI/UX Guidelines](#ui-ux-guidelines)

---

## Overview

The Communication Management module provides a comprehensive notification and announcement system for the school management application. It enables administrators and educators to send targeted notifications and create announcements with rich content, scheduling, and engagement tracking.

### Key Features

- **Multi-channel Notifications**: System notifications with priority levels and targeting options
- **Rich Announcements**: Full-featured announcements with categories, media, and scheduling
- **Advanced Targeting**: Broadcast, role-based, class-based, and user-specific targeting
- **Engagement Tracking**: Read/unread status, likes, view counts, and analytics
- **Real-time Updates**: Live notification delivery and status updates
- **Media Support**: Image attachments and file uploads
- **Scheduling**: Schedule announcements and notifications for future delivery

---

## API Endpoints

All endpoints use the base URL: `/api/communication-management`

### Authentication

All endpoints require authentication using the `AuthGuard` middleware. Include the authorization token in the request headers:

```typescript
headers: {
  'Authorization': 'Bearer <your-token>',
  'Content-Type': 'application/json'
}
```

### Notification Endpoints

#### 1. Create Notification

**POST** `/notifications/create`

Create a new notification (Admin/Teacher only).

```typescript
interface CreateNotificationRequest {
  notification_type_id: number; // Required: ID from notification_types table
  title: string; // Required: Max 500 characters
  message: string; // Required: Notification content
  priority: "normal" | "high" | "urgent"; // Required: Priority level
  target_type: "broadcast" | "user" | "role" | "class" | "grade"; // Required
  target_data?: {
    // Optional: Based on target_type
    user_id?: number; // For target_type: 'user' (single)
    user_ids?: number[]; // For target_type: 'user' (multiple)
    roles?: string[]; // For target_type: 'role'
    grade_level_class_ids?: number[]; // For target_type: 'class'
    grade_level_ids?: number[]; // For target_type: 'grade'
  };
  action_url?: string; // Optional: Max 500 characters
  action_text?: string; // Optional: Max 100 characters
  image_url?: string; // Optional: Max 500 characters
  is_scheduled?: boolean; // Optional: Default false
  scheduled_at?: string; // Optional: ISO datetime (future)
  expires_at?: string; // Optional: ISO datetime (future)
}
```

#### 2. Get User Notifications

**POST** `/notifications/list`

Get paginated list of user's notifications with filtering options.

```typescript
interface GetNotificationsRequest {
  page?: number; // Optional: Default 1
  per_page?: number; // Optional: Default 20, max 100
  filter?: "all" | "read" | "unread" | "delivered" | "pending"; // Optional
  priority?: "normal" | "high" | "urgent"; // Optional
  type_id?: number; // Optional: Filter by notification type
  search?: string; // Optional: Search in title/message
  unread_only?: boolean; // Optional: Show only unread
}

interface GetNotificationsResponse {
  success: true;
  message: string;
  data: {
    notifications: NotificationItem[];
    pagination: {
      current_page: number;
      per_page: number;
      total: number;
      last_page: number;
      from: number;
      to: number;
    };
    unread_count: number;
  };
}
```

#### 3. Mark Notification as Read

**POST** `/notifications/mark-read`

Mark notification(s) as read.

```typescript
interface MarkAsReadRequest {
  notification_id?: number; // Required if mark_all is false
  mark_all?: boolean; // Optional: Mark all unread as read
}
```

#### 4. Delete Notification

**POST** `/notifications/delete`

Remove notification from user's view (soft delete for recipient).

```typescript
interface DeleteNotificationRequest {
  notification_id: number; // Required
}
```

#### 5. Get Notification Details

**POST** `/notifications/details`

Get detailed notification information (automatically marks as read).

```typescript
interface GetNotificationDetailsRequest {
  notification_id: number; // Required
}
```

### Announcement Endpoints

#### 6. Create Announcement

**POST** `/announcements/create`

Create a new announcement.

```typescript
interface CreateAnnouncementRequest {
  title: string; // Required: Max 500 characters
  content: string; // Required: HTML content allowed
  excerpt?: string; // Optional: Max 1000 characters (auto-generated if not provided)
  category_id: number; // Required: ID from announcement_categories
  priority_level: 1 | 2 | 3; // Required: 1=Low, 2=Medium, 3=High
  status: "draft" | "scheduled" | "published"; // Required
  target_type?: "broadcast" | "role" | "class" | "grade" | "user"; // Optional: Default 'broadcast'
  target_data?: {
    // Optional: Based on target_type
    roles?: string[];
    user_ids?: number[];
    grade_level_class_ids?: number[];
    grade_level_ids?: number[];
  };
  image_url?: string; // Optional: Featured image
  attachment_urls?: string[]; // Optional: File attachments
  is_featured?: boolean; // Optional: Default false
  is_pinned?: boolean; // Optional: Default false
  scheduled_at?: string; // Optional: Required if status='scheduled'
  expires_at?: string; // Optional: Auto-hide after date
  tags?: string; // Optional: Comma-separated tags
  meta_data?: Record<string, any>; // Optional: Additional metadata
}
```

#### 7. Get Announcements

**POST** `/announcements/list`

Get paginated list of announcements with filtering.

```typescript
interface GetAnnouncementsRequest {
  page?: number; // Optional: Default 1
  per_page?: number; // Optional: Default 20, max 100
  category_id?: number; // Optional: Filter by category
  priority_level?: 1 | 2 | 3; // Optional: Filter by priority
  status?: "draft" | "scheduled" | "published" | "archived"; // Optional
  is_featured?: boolean; // Optional: Featured only
  is_pinned?: boolean; // Optional: Pinned only
  search?: string; // Optional: Search in title/content
  tags?: string; // Optional: Filter by tags
  date_from?: string; // Optional: Published after date
  date_to?: string; // Optional: Published before date
}
```

#### 8. Get Announcement Details

**POST** `/announcements/details`

Get detailed announcement information (increments view count).

```typescript
interface GetAnnouncementDetailsRequest {
  announcement_id: number; // Required
}
```

---

## Data Structures

### Core Types

```typescript
// Notification Types (Predefined in database)
interface NotificationType {
  id: number;
  name: string;
  slug: string;
  description: string;
  icon: string; // Icon identifier
  color: string; // Hex color code
  is_active: boolean;
}

// Available notification types:
const NOTIFICATION_TYPES = [
  { id: 1, name: "System", slug: "system", icon: "cog", color: "#6b7280" },
  {
    id: 2,
    name: "Announcement",
    slug: "announcement",
    icon: "megaphone",
    color: "#3b82f6",
  },
  {
    id: 3,
    name: "Academic",
    slug: "academic",
    icon: "book-open",
    color: "#10b981",
  },
  { id: 4, name: "Event", slug: "event", icon: "calendar", color: "#f59e0b" },
  {
    id: 5,
    name: "Alert",
    slug: "alert",
    icon: "exclamation-triangle",
    color: "#ef4444",
  },
  {
    id: 6,
    name: "Attendance",
    slug: "attendance",
    icon: "user-check",
    color: "#8b5cf6",
  },
  {
    id: 7,
    name: "Financial",
    slug: "financial",
    icon: "credit-card",
    color: "#06b6d4",
  },
  { id: 8, name: "Social", slug: "social", icon: "users", color: "#ec4899" },
];

// Announcement Categories (Predefined in database)
interface AnnouncementCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  color: string; // Hex color code
  icon: string; // Icon identifier
  sort_order: number;
  is_active: boolean;
}

// Available announcement categories:
const ANNOUNCEMENT_CATEGORIES = [
  {
    id: 1,
    name: "General",
    slug: "general",
    icon: "megaphone",
    color: "#3b82f6",
  },
  {
    id: 2,
    name: "Academic",
    slug: "academic",
    icon: "book-open",
    color: "#10b981",
  },
  { id: 3, name: "Events", slug: "events", icon: "calendar", color: "#f59e0b" },
  {
    id: 4,
    name: "Emergency",
    slug: "emergency",
    icon: "exclamation-triangle",
    color: "#ef4444",
  },
  {
    id: 5,
    name: "Administrative",
    slug: "administrative",
    icon: "clipboard-list",
    color: "#8b5cf6",
  },
  { id: 6, name: "Sports", slug: "sports", icon: "trophy", color: "#06b6d4" },
  {
    id: 7,
    name: "Health & Safety",
    slug: "health-safety",
    icon: "shield-check",
    color: "#84cc16",
  },
  {
    id: 8,
    name: "Admissions",
    slug: "admissions",
    icon: "user-plus",
    color: "#ec4899",
  },
];
```

### Response Types

```typescript
// Notification Item
interface NotificationItem {
  id: number;
  notification_type: NotificationType;
  title: string;
  message: string;
  priority: "normal" | "high" | "urgent";
  priority_label: string; // Display label
  priority_color: string; // Hex color
  target_type: string;
  target_display: string; // Human-readable target description
  action_url?: string;
  action_text?: string;
  image_url?: string;
  is_read: boolean;
  is_delivered: boolean;
  read_at?: string; // ISO datetime
  delivered_at?: string; // ISO datetime
  expires_at?: string; // ISO datetime
  created_at: string; // ISO datetime
  time_ago: string; // Human-readable time (e.g., "2 hours ago")
}

// Announcement Item
interface AnnouncementItem {
  id: number;
  title: string;
  content: string; // HTML content
  excerpt: string;
  category: AnnouncementCategory;
  priority_level: 1 | 2 | 3;
  priority_label: "Low" | "Medium" | "High";
  priority_color: string; // Hex color
  status: "draft" | "scheduled" | "published" | "archived";
  status_label: string; // Display label
  status_color: string; // Hex color
  target_type: string;
  target_display: string; // Human-readable target description
  target_data?: Record<string, any>;
  image_url?: string;
  attachment_urls?: string[];
  is_featured: boolean;
  is_pinned: boolean;
  scheduled_at?: string; // ISO datetime
  published_at?: string; // ISO datetime
  expires_at?: string; // ISO datetime
  view_count: number;
  like_count: number;
  is_read?: boolean; // For current user
  is_liked?: boolean; // For current user
  notification_sent: boolean;
  tags_array: string[];
  meta_data?: Record<string, any>;
  creator: {
    id: number;
    name: string;
    username: string;
  };
  created_at: string; // ISO datetime
  time_ago: string; // Human-readable time
  read_time: number; // Estimated reading time in minutes
}
```

### Standard API Response Format

```typescript
// Success Response
interface ApiSuccessResponse<T> {
  success: true;
  message: string;
  data: T;
}

// Error Response
interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: Record<string, string[]>; // Validation errors
}

// Paginated Response
interface PaginatedResponse<T> {
  success: true;
  message: string;
  data: {
    items: T[];
    pagination: {
      current_page: number;
      per_page: number;
      total: number;
      last_page: number;
      from: number;
      to: number;
      has_more_pages: boolean;
    };
  };
}
```

---

## Authentication

The module uses custom `AuthGuard` middleware. Ensure your API client includes:

```typescript
// API Client Setup
class CommunicationApiClient {
  private baseUrl = "/api/communication-management";
  private authToken: string;

  constructor(authToken: string) {
    this.authToken = authToken;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.authToken}`,
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!data.success) {
      throw new ApiError(data.message, data.errors);
    }

    return data;
  }
}

class ApiError extends Error {
  constructor(
    message: string,
    public errors?: Record<string, string[]>
  ) {
    super(message);
    this.name = "ApiError";
  }
}
```

---

## Implementation Examples

### React Hook for Notifications

```typescript
import { useState, useEffect, useCallback } from "react";

interface UseNotificationsOptions {
  autoRefresh?: boolean;
  refreshInterval?: number;
}

export function useNotifications(options: UseNotificationsOptions = {}) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.request<GetNotificationsResponse>(
        "/notifications/list",
        {
          method: "POST",
          body: JSON.stringify({ per_page: 20, ...params }),
        }
      );

      setNotifications(response.data.notifications);
      setUnreadCount(response.data.unread_count);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch notifications"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const markAsRead = useCallback(async (notificationId?: number) => {
    try {
      await apiClient.request("/notifications/mark-read", {
        method: "POST",
        body: JSON.stringify(
          notificationId
            ? { notification_id: notificationId }
            : { mark_all: true }
        ),
      });

      // Update local state
      if (notificationId) {
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === notificationId
              ? { ...n, is_read: true, read_at: new Date().toISOString() }
              : n
          )
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      } else {
        setNotifications((prev) =>
          prev.map((n) => ({
            ...n,
            is_read: true,
            read_at: new Date().toISOString(),
          }))
        );
        setUnreadCount(0);
      }
    } catch (err) {
      console.error("Failed to mark as read:", err);
    }
  }, []);

  // Auto-refresh notifications
  useEffect(() => {
    fetchNotifications();

    if (options.autoRefresh) {
      const interval = setInterval(
        fetchNotifications,
        options.refreshInterval || 30000
      );
      return () => clearInterval(interval);
    }
  }, [fetchNotifications, options.autoRefresh, options.refreshInterval]);

  return {
    notifications,
    unreadCount,
    loading,
    error,
    fetchNotifications,
    markAsRead,
  };
}
```

### Announcement Display Component

```tsx
import React from 'react';

interface AnnouncementCardProps {
  announcement: AnnouncementItem;
  onView?: (id: number) => void;
  onLike?: (id: number) => void;
}

export function AnnouncementCard({
  announcement,
  onView,
  onLike
}: AnnouncementCardProps) {
  const handleView = () => {
    onView?.(announcement.id);
  };

  const handleLike = () => {
    onLike?.(announcement.id);
  };

  const priorityStyles = {
    1: 'bg-gray-100 text-gray-800 border-gray-300',
    2: 'bg-amber-100 text-amber-800 border-amber-300',
    3: 'bg-red-100 text-red-800 border-red-300',
  };

  const statusStyles = {
    draft: 'bg-gray-100 text-gray-800',
    scheduled: 'bg-blue-100 text-blue-800',
    published: 'bg-green-100 text-green-800',
    archived: 'bg-slate-100 text-slate-800',
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            {announcement.is_pinned && (
              <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 mb-2">
                =� Pinned
              </div>
            )}

            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {announcement.title}
            </h3>

            <div className="flex items-center space-x-3 text-sm text-gray-500">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                  priorityStyles[announcement.priority_level]
                }`}
              >
                {announcement.priority_label} Priority
              </span>

              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  statusStyles[announcement.status]
                }`}
              >
                {announcement.status_label}
              </span>

              <span
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                style={{
                  backgroundColor: `${announcement.category.color}20`,
                  color: announcement.category.color
                }}
              >
                {announcement.category.name}
              </span>
            </div>
          </div>

          {announcement.image_url && (
            <img
              src={announcement.image_url}
              alt=""
              className="w-16 h-16 rounded-lg object-cover ml-4"
            />
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div
          className="text-gray-700 line-clamp-3 mb-3"
          dangerouslySetInnerHTML={{ __html: announcement.excerpt }}
        />

        {announcement.tags_array.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {announcement.tags_array.map(tag => (
              <span
                key={tag}
                className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span>=A {announcement.view_count} views</span>
            <span>d {announcement.like_count} likes</span>
            <span>=� {announcement.read_time} min read</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleLike}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                announcement.is_liked
                  ? 'bg-red-100 text-red-700 hover:bg-red-200'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {announcement.is_liked ? 'd' : '>
'} Like
            </button>

            <button
              onClick={handleView}
              className="px-4 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Read More
            </button>
          </div>
        </div>

        <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
          <span>By {announcement.creator.name}</span>
          <span>{announcement.time_ago}</span>
        </div>
      </div>
    </div>
  );
}
```

### Real-time Notification Handler

```typescript
class NotificationManager {
  private eventSource?: EventSource;
  private listeners: Map<string, Function[]> = new Map();

  constructor(private authToken: string) {}

  connect() {
    if (this.eventSource) {
      this.disconnect();
    }

    // Assuming you have SSE endpoint for real-time notifications
    this.eventSource = new EventSource(
      `/api/communication-management/notifications/stream?token=${this.authToken}`
    );

    this.eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        this.emit(data.type, data.payload);
      } catch (error) {
        console.error("Failed to parse notification event:", error);
      }
    };

    this.eventSource.onerror = (error) => {
      console.error("Notification stream error:", error);
      // Implement reconnection logic
      setTimeout(() => this.connect(), 5000);
    };
  }

  disconnect() {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = undefined;
    }
  }

  on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  off(event: string, callback: Function) {
    const listeners = this.listeners.get(event);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  private emit(event: string, data: any) {
    const listeners = this.listeners.get(event);
    if (listeners) {
      listeners.forEach((callback) => callback(data));
    }
  }
}

// Usage
const notificationManager = new NotificationManager(authToken);

notificationManager.on("notification.new", (notification: NotificationItem) => {
  // Show toast notification
  showToast({
    title: notification.title,
    message: notification.message,
    priority: notification.priority,
    duration: notification.priority === "urgent" ? 0 : 5000, // Urgent stays until dismissed
  });

  // Update notification badge
  updateNotificationBadge();
});

notificationManager.on(
  "announcement.published",
  (announcement: AnnouncementItem) => {
    // Show announcement notification
    if (announcement.priority_level === 3) {
      showModal({
        title: announcement.title,
        content: announcement.excerpt,
        type: "urgent",
      });
    }
  }
);

notificationManager.connect();
```

---

## Error Handling

### Standard Error Responses

All API endpoints return consistent error responses:

```typescript
// Validation Error (422)
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "title": ["The title field is required."],
    "priority_level": ["The priority level must be between 1 and 3."]
  }
}

// Authentication Error (401)
{
  "success": false,
  "message": "Authentication required",
  "errors": null
}

// Authorization Error (403)
{
  "success": false,
  "message": "Insufficient permissions",
  "errors": null
}

// Not Found Error (404)
{
  "success": false,
  "message": "Resource not found",
  "errors": null
}

// Server Error (500)
{
  "success": false,
  "message": "Internal server error",
  "errors": null
}
```

### Error Handling Best Practices

```typescript
async function createAnnouncement(data: CreateAnnouncementRequest) {
  try {
    const response = await apiClient.request<AnnouncementItem>(
      "/announcements/create",
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    );

    return { success: true, data: response.data };
  } catch (error) {
    if (error instanceof ApiError) {
      // Handle validation errors
      if (error.errors) {
        return {
          success: false,
          message: error.message,
          validationErrors: error.errors,
        };
      }

      // Handle other API errors
      return {
        success: false,
        message: error.message,
      };
    }

    // Handle network/unknown errors
    return {
      success: false,
      message: "Network error or unexpected issue occurred",
    };
  }
}

// Usage with user feedback
const result = await createAnnouncement(formData);

if (result.success) {
  showSuccessToast("Announcement created successfully!");
  navigateToAnnouncementList();
} else {
  if (result.validationErrors) {
    // Show field-specific errors
    displayValidationErrors(result.validationErrors);
  } else {
    // Show general error message
    showErrorToast(result.message);
  }
}
```

---

## Real-time Features

The module supports real-time updates through WebSocket connections or Server-Sent Events (SSE).

### WebSocket Integration

```typescript
class WebSocketNotificationClient {
  private ws?: WebSocket;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;

  constructor(
    private url: string,
    private authToken: string,
    private onNotification: (notification: any) => void
  ) {}

  connect() {
    try {
      this.ws = new WebSocket(`${this.url}?token=${this.authToken}`);

      this.ws.onopen = () => {
        console.log("WebSocket connected");
        this.reconnectAttempts = 0;
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.handleMessage(data);
        } catch (error) {
          console.error("Failed to parse WebSocket message:", error);
        }
      };

      this.ws.onclose = (event) => {
        console.log("WebSocket disconnected:", event.code, event.reason);
        this.attemptReconnect();
      };

      this.ws.onerror = (error) => {
        console.error("WebSocket error:", error);
      };
    } catch (error) {
      console.error("Failed to connect WebSocket:", error);
      this.attemptReconnect();
    }
  }

  private handleMessage(data: any) {
    switch (data.type) {
      case "notification.new":
        this.onNotification(data.payload);
        break;
      case "notification.marked_read":
        this.handleNotificationRead(data.payload);
        break;
      case "announcement.published":
        this.handleAnnouncementPublished(data.payload);
        break;
      default:
        console.log("Unknown message type:", data.type);
    }
  }

  private attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay =
        this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);

      setTimeout(() => {
        console.log(
          `Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`
        );
        this.connect();
      }, delay);
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = undefined;
    }
  }
}
```

### Push Notification Integration

```typescript
// Service Worker Registration (for push notifications)
if ("serviceWorker" in navigator && "PushManager" in window) {
  navigator.serviceWorker.register("/sw.js").then((registration) => {
    console.log("Service Worker registered:", registration);
    return initializePushNotifications(registration);
  });
}

async function initializePushNotifications(
  registration: ServiceWorkerRegistration
) {
  try {
    const permission = await Notification.requestPermission();

    if (permission !== "granted") {
      console.log("Push notification permission denied");
      return;
    }

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: VAPID_PUBLIC_KEY, // Your VAPID public key
    });

    // Send subscription to backend
    await apiClient.request("/notifications/subscribe", {
      method: "POST",
      body: JSON.stringify({
        subscription: subscription.toJSON(),
      }),
    });

    console.log("Push notifications initialized");
  } catch (error) {
    console.error("Failed to initialize push notifications:", error);
  }
}
```

---

## UI/UX Guidelines

### Visual Design Patterns

#### Priority Colors

```scss
:root {
  // Notification Priorities
  --priority-normal: #6b7280; // Gray
  --priority-high: #f59e0b; // Amber
  --priority-urgent: #ef4444; // Red

  // Announcement Priorities
  --priority-low: #6b7280; // Gray
  --priority-medium: #f59e0b; // Amber
  --priority-high: #ef4444; // Red

  // Status Colors
  --status-draft: #6b7280; // Gray
  --status-scheduled: #3b82f6; // Blue
  --status-published: #10b981; // Green
  --status-archived: #64748b; // Slate
}
```

#### Notification Badge

```tsx
function NotificationBadge({ count }: { count: number }) {
  if (count === 0) return null;

  return (
    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
      {count > 99 ? "99+" : count}
    </span>
  );
}
```

### User Experience Guidelines

1. **Notification Hierarchy**
   - Urgent notifications: Modal overlay or persistent banner
   - High priority: Toast with sound/vibration
   - Normal priority: Silent toast, badge update

2. **Announcement Display**
   - Pin important announcements to top
   - Use priority colors consistently
   - Show read/unread status clearly
   - Provide quick actions (like, share, bookmark)

3. **Loading States**
   - Skeleton loading for lists
   - Spinner for actions (mark as read, delete)
   - Optimistic updates where possible

4. **Accessibility**
   - ARIA labels for notification states
   - Keyboard navigation support
   - Screen reader announcements for new notifications
   - High contrast mode support

```tsx
// Accessible notification component example
function AccessibleNotification({
  notification,
}: {
  notification: NotificationItem;
}) {
  return (
    <div
      role="listitem"
      aria-label={`${notification.priority} priority notification: ${notification.title}`}
      className={`notification-item ${notification.is_read ? "read" : "unread"}`}
    >
      <div className="notification-content">
        <h4 id={`notification-${notification.id}-title`}>
          {notification.title}
        </h4>
        <p aria-describedby={`notification-${notification.id}-title`}>
          {notification.message}
        </p>
      </div>

      <button
        onClick={() => markAsRead(notification.id)}
        aria-label={`Mark "${notification.title}" as read`}
        disabled={notification.is_read}
      >
        {notification.is_read ? "Read" : "Mark as read"}
      </button>
    </div>
  );
}
```

5. **Performance Optimization**
   - Implement virtual scrolling for long lists
   - Use pagination or infinite scroll
   - Cache frequently accessed data
   - Debounce search input
   - Lazy load images and attachments

6. **Responsive Design**
   - Mobile-first approach
   - Touch-friendly interaction areas (44px minimum)
   - Swipe actions on mobile (mark as read, delete)
   - Collapsible content on small screens

---

## Additional Features

### Search and Filtering

```typescript
interface SearchFilters {
  query?: string;
  category_id?: number;
  priority?: string;
  status?: string;
  date_range?: {
    start: string;
    end: string;
  };
  tags?: string[];
}

function useSearch<T>(endpoint: string, initialFilters: SearchFilters = {}) {
  const [results, setResults] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState(initialFilters);
  const [total, setTotal] = useState(0);

  const debouncedSearch = useMemo(
    () =>
      debounce(async (searchFilters: SearchFilters) => {
        setLoading(true);
        try {
          const response = await apiClient.request(`${endpoint}/list`, {
            method: "POST",
            body: JSON.stringify(searchFilters),
          });

          setResults(response.data.items);
          setTotal(response.data.pagination.total);
        } catch (error) {
          console.error("Search failed:", error);
        } finally {
          setLoading(false);
        }
      }, 300),
    [endpoint]
  );

  useEffect(() => {
    debouncedSearch(filters);
  }, [filters, debouncedSearch]);

  return {
    results,
    loading,
    total,
    filters,
    updateFilters: setFilters,
  };
}
```

### Bulk Operations

```typescript
interface BulkOperationOptions {
  operation: "mark_read" | "delete" | "archive";
  items: number[];
}

async function performBulkOperation(options: BulkOperationOptions) {
  const { operation, items } = options;

  try {
    const response = await apiClient.request("/notifications/bulk", {
      method: "POST",
      body: JSON.stringify({
        operation,
        notification_ids: items,
      }),
    });

    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error };
  }
}
```

---

This documentation provides comprehensive guidance for implementing the frontend components of the Communication Management module. For additional support or questions, refer to the backend API implementation or contact the development team.
