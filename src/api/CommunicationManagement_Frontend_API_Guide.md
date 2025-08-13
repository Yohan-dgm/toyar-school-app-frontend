# Communication Management API - Frontend Integration Guide

**Version:** 1.0  
**Date:** August 2025  
**Base URL:** `/api/communication-management`

## Table of Contents

1. [Overview](#overview)
2. [Authentication](#authentication)
3. [Notification APIs](#notification-apis)
4. [Announcement APIs](#announcement-apis)
5. [Reference Data](#reference-data)
6. [TypeScript Interfaces](#typescript-interfaces)
7. [Code Examples](#code-examples)
8. [Error Handling](#error-handling)

---

## Overview

The Communication Management module provides a comprehensive notification and announcement system. All endpoints use POST requests and return JSON responses.

### Base Configuration

```javascript
const BASE_URL = "/api/communication-management";
const headers = {
  "Content-Type": "application/json",
  Authorization: "Bearer <your-token>",
};
```

### Standard Response Format

```typescript
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
```

---

## Authentication

All endpoints require authentication using the `AuthGuard` middleware. Include the authorization token in request headers:

```javascript
headers: {
  'Authorization': 'Bearer <your-token>',
  'Content-Type': 'application/json'
}
```

---

## Notification APIs

### 1. Create Notification

**POST** `/notifications/create`

Creates a new notification (Admin/Teacher only).

#### Parameters:

```typescript
interface CreateNotificationRequest {
  notification_type_id: number; // Required: 1-8 (see reference data)
  title: string; // Required: Max 500 characters
  message: string; // Required: Notification content
  priority: "normal" | "high" | "urgent"; // Required
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

#### Example:

```javascript
const notificationData = {
  notification_type_id: 2,
  title: "New Assignment Posted",
  message: "A new assignment has been posted for Mathematics class.",
  priority: "high",
  target_type: "class",
  target_data: {
    grade_level_class_ids: [1, 2, 3],
  },
  action_url: "/assignments/123",
  action_text: "View Assignment",
};
```

---

### 2. Get User Notifications

**POST** `/notifications/list`

Retrieves paginated list of user's notifications with filtering.

#### Parameters:

```typescript
interface GetNotificationsRequest {
  page?: number; // Optional: Default 1, Min 1
  per_page?: number; // Optional: Default 20, Min 1, Max 100
  filter?: "all" | "read" | "unread" | "delivered" | "pending"; // Optional
  priority?: "normal" | "high" | "urgent"; // Optional
  type_id?: number; // Optional: Notification type ID (1-8)
  search?: string; // Optional: Max 255 characters
  unread_only?: boolean; // Optional
}
```

#### Response:

```typescript
interface GetNotificationsResponse {
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
}
```

---

### 3. Mark Notification as Read

**POST** `/notifications/mark-read`

Mark notification(s) as read.

#### Parameters:

```typescript
interface MarkAsReadRequest {
  notification_id: number; // Required: Must exist in notifications table
  mark_all?: boolean; // Optional: Mark all unread as read
}
```

---

### 4. Delete Notification

**POST** `/notifications/delete`

Remove notification from user's view (soft delete for recipient).

#### Parameters:

```typescript
interface DeleteNotificationRequest {
  notification_id: number; // Required: Must exist in notifications table
}
```

---

### 5. Get Notification Details

**POST** `/notifications/details`

Get detailed notification information (automatically marks as read).

#### Parameters:

```typescript
interface GetNotificationDetailsRequest {
  notification_id: number; // Required: Must exist in notifications table
}
```

---

### 6. Get Notification Statistics

**POST** `/notifications/stats`

Retrieve comprehensive notification statistics for the user.

#### Parameters:

```typescript
interface GetNotificationStatsRequest {
  date_range?: "today" | "week" | "month" | "all"; // Optional
  priority_filter?: ("normal" | "high" | "urgent")[]; // Optional: Array of priorities
  type_filter?: number[]; // Optional: Array of notification type IDs
  include_read?: boolean; // Optional: Default true
  include_archived?: boolean; // Optional: Default false
}
```

#### Response:

```typescript
interface GetNotificationStatsResponse {
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
  by_type: {
    [type_id: number]: {
      name: string;
      slug: string;
      color: string;
      icon: string;
      count: number;
      unread: number;
    };
  };
  priority_breakdown: {
    normal: number;
    high: number;
    urgent: number;
  };
  last_notification_at?: string; // ISO datetime
  generated_at: string; // ISO datetime
}
```

---

## Announcement APIs

### 1. Create Announcement

**POST** `/announcements/create`

Creates a new announcement.

#### Parameters:

```typescript
interface CreateAnnouncementRequest {
  title: string; // Required: Max 500 characters
  content: string; // Required: HTML content allowed
  excerpt?: string; // Optional: Max 1000 characters
  category_id: number; // Required: 1-8 (see reference data)
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
  image_url?: string; // Optional: Max 500 characters
  attachment_urls?: string[]; // Optional: Array of file URLs (max 500 chars each)
  is_featured?: boolean; // Optional: Default false
  is_pinned?: boolean; // Optional: Default false
  scheduled_at?: string; // Optional: Required if status='scheduled'
  expires_at?: string; // Optional: Auto-hide after date
  tags?: string; // Optional: Comma-separated tags (max 500 chars)
  meta_data?: Record<string, any>; // Optional: Additional metadata
}
```

#### Example:

```javascript
const announcementData = {
  title: "School Holiday Announcement",
  content:
    "<p>Dear Students and Parents,</p><p>Please note that the school will be closed...</p>",
  excerpt: "School will be closed next week for holidays",
  category_id: 1,
  priority_level: 2,
  status: "published",
  target_type: "broadcast",
  is_featured: true,
  tags: "holiday,important,schedule",
};
```

---

### 2. Get Announcements List

**POST** `/announcements/list`

Retrieve paginated list of announcements with filtering.

#### Parameters:

```typescript
interface GetAnnouncementsRequest {
  page?: number; // Optional: Default 1, Min 1
  per_page?: number; // Optional: Default 20, Min 1, Max 100
  category_id?: number; // Optional: Filter by category (1-8)
  priority_level?: 1 | 2 | 3; // Optional: Filter by priority
  status?: "draft" | "scheduled" | "published" | "archived"; // Optional
  search?: string; // Optional: Max 255 characters
  date_from?: string; // Optional: Date format (YYYY-MM-DD)
  date_to?: string; // Optional: Must be >= date_from
  featured_only?: boolean; // Optional: Show only featured announcements
  pinned_only?: boolean; // Optional: Show only pinned announcements
  sort_by?:
    | "created_at"
    | "published_at"
    | "title"
    | "priority_level"
    | "view_count"; // Optional
  sort_order?: "asc" | "desc"; // Optional
}
```

---

### 3. Get Announcement Details

**POST** `/announcements/details`

Get detailed announcement information (increments view count).

#### Parameters:

```typescript
interface GetAnnouncementDetailsRequest {
  announcement_id: number; // Required: Must exist in announcements table
}
```

---

## Reference Data

### Notification Types (notification_type_id values)

```typescript
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
```

### Announcement Categories (category_id values)

```typescript
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

### Priority Levels

```typescript
// Notification Priorities
type NotificationPriority = "normal" | "high" | "urgent";

// Announcement Priority Levels
type AnnouncementPriorityLevel = 1 | 2 | 3; // 1=Low, 2=Medium, 3=High

// Priority Colors
const PRIORITY_COLORS = {
  notification: {
    normal: "#6b7280", // Gray
    high: "#f59e0b", // Amber
    urgent: "#ef4444", // Red
  },
  announcement: {
    1: "#6b7280", // Low - Gray
    2: "#f59e0b", // Medium - Amber
    3: "#ef4444", // High - Red
  },
};
```

---

## TypeScript Interfaces

### Core Data Types

```typescript
interface NotificationItem {
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
}

interface AnnouncementItem {
  id: number;
  title: string;
  content: string;
  excerpt: string;
  category: {
    id: number;
    name: string;
    slug: string;
    color: string;
    icon: string;
  };
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
  read_time: number; // Estimated reading time in minutes
}
```

---

## Code Examples

### API Client Setup

```typescript
class CommunicationAPI {
  private baseUrl = "/api/communication-management";

  constructor(private authToken: string) {}

  private async request<T>(endpoint: string, data: any = {}): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.authToken}`,
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!result.success) {
      throw new ApiError(result.message, result.errors);
    }

    return result.data;
  }

  // Notification methods
  async getNotifications(params: GetNotificationsRequest = {}) {
    return this.request<GetNotificationsResponse>(
      "/notifications/list",
      params
    );
  }

  async getNotificationStats(params: GetNotificationStatsRequest = {}) {
    return this.request<GetNotificationStatsResponse>(
      "/notifications/stats",
      params
    );
  }

  async markAsRead(notificationId: number) {
    return this.request("/notifications/mark-read", {
      notification_id: notificationId,
    });
  }

  async deleteNotification(notificationId: number) {
    return this.request("/notifications/delete", {
      notification_id: notificationId,
    });
  }

  // Announcement methods
  async getAnnouncements(params: GetAnnouncementsRequest = {}) {
    return this.request("/announcements/list", params);
  }

  async getAnnouncementDetails(announcementId: number) {
    return this.request("/announcements/details", {
      announcement_id: announcementId,
    });
  }

  async createAnnouncement(data: CreateAnnouncementRequest) {
    return this.request("/announcements/create", data);
  }
}
```

### React Hook Example

```typescript
import { useState, useEffect } from "react";

export function useNotifications() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const api = new CommunicationAPI(authToken);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await api.getNotifications({ unread_only: false });
      setNotifications(response.notifications);
      setUnreadCount(response.unread_count);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: number) => {
    try {
      await api.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return {
    notifications,
    unreadCount,
    loading,
    fetchNotifications,
    markAsRead,
  };
}
```

### Notification Stats Dashboard

```typescript
export function NotificationStatsWidget() {
  const [stats, setStats] = useState<GetNotificationStatsResponse | null>(null);
  const api = new CommunicationAPI(authToken);

  useEffect(() => {
    api.getNotificationStats({ date_range: 'month' })
      .then(setStats)
      .catch(console.error);
  }, []);

  if (!stats) return <div>Loading...</div>;

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-blue-100 p-4 rounded">
        <h3>Total Notifications</h3>
        <p className="text-2xl">{stats.total_notifications}</p>
      </div>

      <div className="bg-red-100 p-4 rounded">
        <h3>Unread</h3>
        <p className="text-2xl">{stats.unread_count}</p>
      </div>

      <div className="bg-green-100 p-4 rounded">
        <h3>This Week</h3>
        <p className="text-2xl">{stats.recent_activity.this_week}</p>
      </div>

      <div className="bg-yellow-100 p-4 rounded">
        <h3>Urgent Unread</h3>
        <p className="text-2xl">{stats.unread_by_priority.urgent}</p>
      </div>
    </div>
  );
}
```

---

## Error Handling

### Standard Error Format

```typescript
interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string[]>; // Validation errors
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

### Common HTTP Status Codes

- **200**: Success
- **401**: Authentication required
- **403**: Insufficient permissions
- **422**: Validation failed
- **500**: Internal server error

### Error Handling Example

```typescript
try {
  const result = await api.createAnnouncement(data);
  showSuccessMessage("Announcement created successfully!");
} catch (error) {
  if (error instanceof ApiError) {
    if (error.errors) {
      // Handle validation errors
      Object.entries(error.errors).forEach(([field, messages]) => {
        showFieldError(field, messages[0]);
      });
    } else {
      // Handle general API errors
      showErrorMessage(error.message);
    }
  } else {
    // Handle network/unknown errors
    showErrorMessage("An unexpected error occurred");
  }
}
```

---

## Development Notes

### Important Validations

1. **File URLs**: All image_url and attachment_urls must be valid URLs (max 500 chars)
2. **Dates**: scheduled_at and expires_at must be future dates in ISO format
3. **Target Data**: Required fields depend on target_type selection
4. **Pagination**: per_page has a maximum limit of 100
5. **Search**: Limited to 255 characters for performance

### Performance Tips

1. Use pagination for large lists
2. Implement debouncing for search functionality
3. Cache frequently accessed reference data (types, categories)
4. Use unread_only=true for notification badges
5. Implement optimistic updates for mark-as-read operations

### Security Considerations

1. All endpoints require valid authentication tokens
2. Users can only access their own notifications
3. Admin/Teacher roles required for creating notifications
4. File uploads should be validated server-side
5. HTML content in announcements is allowed but should be sanitized

---

**Last Updated:** August 12, 2025  
**Contact:** Backend Development Team
