import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define types for the class posts state (same as school posts but with class_id)
interface Post {
  id: number;
  type: "announcement" | "event" | "news" | "achievement";
  category: string;
  title: string;
  content: string;
  author_name: string;
  author_image: string;
  created_at: string;
  updated_at: string;
  likes_count: number;
  comments_count: number;
  is_liked_by_user: boolean;
  media: {
    id: number;
    type: "image" | "video" | "pdf";
    url: string;
    thumbnail_url?: string;
    filename: string;
    size: number;
  }[];
  hashtags: string[];
  school_id: number;
  class_id: number; // Required for class posts
  student_id: number | null;
}

interface Pagination {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
  has_more: boolean;
}

interface ClassPostsState {
  posts: Post[];
  loading: boolean;
  error: string | null;
  pagination: Pagination | null;
  currentClassId: number | null; // Track which class is currently selected
  filters: {
    search: string;
    date_from: string | null;
    date_to: string | null;
    category: string | null;
    hashtags: string[];
  };
  refreshing: boolean;
  likedPosts: { [userPostKey: string]: boolean }; // Track liked posts per user (format: "userId_postId")
  currentUserId: number | null; // Store current user ID for user-specific like states
}

const initialState: ClassPostsState = {
  posts: [],
  loading: false,
  error: null,
  pagination: null,
  currentClassId: null, // Will be set to dummy class ID initially
  filters: {
    search: "",
    date_from: null,
    date_to: null,
    category: null,
    hashtags: [],
  },
  refreshing: false,
  likedPosts: {},
  currentUserId: null,
};

const classPostsSlice = createSlice({
  name: "classPosts",
  initialState,
  reducers: {
    // Set current class ID
    setCurrentClassId: (state, action: PayloadAction<number>) => {
      state.currentClassId = action.payload;
      // Clear posts when switching classes
      state.posts = [];
      state.pagination = null;
    },

    // Set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    // Set refreshing state
    setRefreshing: (state, action: PayloadAction<boolean>) => {
      state.refreshing = action.payload;
    },

    // Set posts data
    setPosts: (
      state,
      action: PayloadAction<{
        posts: Post[];
        pagination: Pagination;
        append?: boolean;
      }>,
    ) => {
      const { posts, pagination, append = false } = action.payload;

      if (append) {
        // Append new posts for pagination
        const existingIds = new Set(state.posts.map((post) => post.id));
        const newPosts = posts.filter((post) => !existingIds.has(post.id));
        state.posts = [...state.posts, ...newPosts];
      } else {
        // Replace posts for refresh or initial load
        state.posts = posts;
      }

      state.pagination = pagination;
      state.error = null;
    },

    // Set error
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
      state.refreshing = false;
    },

    // Update filters
    setFilters: (
      state,
      action: PayloadAction<Partial<ClassPostsState["filters"]>>,
    ) => {
      state.filters = { ...state.filters, ...action.payload };
    },

    // Clear filters
    clearFilters: (state) => {
      state.filters = {
        search: "",
        date_from: null,
        date_to: null,
        category: null,
        hashtags: [],
      };
    },

    // Set current user ID for user-specific like tracking
    setCurrentUserId: (state, action: PayloadAction<number | null>) => {
      const newUserId = action.payload;

      // If user changed, clear like states for the previous user
      if (state.currentUserId !== newUserId) {
        state.likedPosts = {};
      }

      state.currentUserId = newUserId;
    },

    // Toggle like status for a post
    toggleLike: (
      state,
      action: PayloadAction<{
        postId: number;
        isLiked: boolean;
        likesCount: number;
      }>,
    ) => {
      const { postId, isLiked, likesCount } = action.payload;

      // Create user-specific key for like tracking (userId_postId)
      if (state.currentUserId) {
        const userPostKey = `${state.currentUserId}_${postId}`;
        state.likedPosts[userPostKey] = isLiked;
      }

      // Update the post in the posts array
      const postIndex = state.posts.findIndex((post) => post.id === postId);
      if (postIndex !== -1) {
        state.posts[postIndex].is_liked_by_user = isLiked;
        state.posts[postIndex].likes_count = likesCount;
      }
    },

    // Clear all data (for logout or reset)
    clearData: (state) => {
      state.posts = [];
      state.pagination = null;
      state.error = null;
      state.likedPosts = {};
      state.currentUserId = null;
      state.filters = initialState.filters;
      state.currentClassId = null;
    },
  },
});

export const {
  setCurrentClassId,
  setLoading,
  setRefreshing,
  setPosts,
  setError,
  setFilters,
  clearFilters,
  setCurrentUserId,
  toggleLike,
  clearData,
} = classPostsSlice.actions;

export default classPostsSlice.reducer;

// Helper function to get user-specific like state
export const getUserLikeState = (
  state: ClassPostsState,
  postId: number,
): boolean => {
  if (!state.currentUserId) return false;
  const userPostKey = `${state.currentUserId}_${postId}`;
  return state.likedPosts[userPostKey] || false;
};

/*
=== BACKEND DATA REQUIREMENTS FOR CLASS POSTS ===

This slice manages class-specific posts that are visible to students and teachers of a particular class.

API Endpoint: POST /api/activity-feed/class/posts

Required Backend Data Fields:
- id: Unique post identifier
- type: Post type (announcement, event, news, achievement)
- category: Post category for filtering
- title: Post title/headline
- content: Full post content with hashtags
- author_name: Name of the post author (teacher, principal, etc.)
- author_image: Profile image URL of the author
- created_at: Post creation timestamp
- updated_at: Last modification timestamp
- likes_count: Total number of likes
- comments_count: Total number of comments
- is_liked_by_user: Whether current user liked this post
- media: Array of attached media files (images, videos, PDFs)
- hashtags: Array of hashtags extracted from content
- school_id: School identifier
- class_id: Class identifier (REQUIRED - filters posts by class)
- student_id: null (class-wide posts, not student-specific)

Request Parameters:
- class_id: Required parameter to filter posts by class
- page: Page number for pagination
- limit: Number of posts per page
- filters: Optional search, date range, category, hashtags

For now, we'll use a dummy class_id (e.g., 5) until proper student-class association is implemented.

Database Tables Used:
- activity_feed_posts (main post data with class_id filter)
- activity_feed_media (media attachments)
- activity_feed_hashtags (hashtag associations)
- activity_feed_likes (like tracking)
- users (author information)
- classes (class information for validation)
*/
