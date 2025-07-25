import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define types for the student posts state (same as others but with student_id)
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
  media: Array<{
    id: number;
    type: "image" | "video" | "pdf";
    url: string;
    thumbnail_url?: string;
    filename: string;
    size: number;
  }>;
  hashtags: string[];
  school_id: number;
  class_id: number | null;
  student_id: number; // Required for student posts
}

interface Pagination {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
  has_more: boolean;
}

interface StudentPostsState {
  posts: Post[];
  loading: boolean;
  error: string | null;
  pagination: Pagination | null;
  currentStudentId: number | null; // Track which student is currently selected
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

const initialState: StudentPostsState = {
  posts: [],
  loading: false,
  error: null,
  pagination: null,
  currentStudentId: null, // Will be set to dummy student ID initially
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

const studentPostsSlice = createSlice({
  name: "studentPosts",
  initialState,
  reducers: {
    // Set current student ID
    setCurrentStudentId: (state, action: PayloadAction<number>) => {
      state.currentStudentId = action.payload;
      // Clear posts when switching students
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
      }>
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
      action: PayloadAction<Partial<StudentPostsState["filters"]>>
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
      }>
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
      state.currentStudentId = null;
    },
  },
});

export const {
  setCurrentStudentId,
  setLoading,
  setRefreshing,
  setPosts,
  setError,
  setFilters,
  clearFilters,
  setCurrentUserId,
  toggleLike,
  clearData,
} = studentPostsSlice.actions;

export default studentPostsSlice.reducer;

// Helper function to get user-specific like state
export const getUserLikeState = (
  state: StudentPostsState,
  postId: number
): boolean => {
  if (!state.currentUserId) return false;
  const userPostKey = `${state.currentUserId}_${postId}`;
  return state.likedPosts[userPostKey] || false;
};

/*
=== BACKEND DATA REQUIREMENTS FOR STUDENT POSTS ===

This slice manages student-specific posts that are related to individual students (achievements, reports, etc.).

API Endpoint: POST /api/activity-feed/student/posts

Required Backend Data Fields:
- id: Unique post identifier
- type: Post type (announcement, event, news, achievement)
- category: Post category for filtering
- title: Post title/headline
- content: Full post content with hashtags
- author_name: Name of the post author (teacher, counselor, etc.)
- author_image: Profile image URL of the author
- created_at: Post creation timestamp
- updated_at: Last modification timestamp
- likes_count: Total number of likes
- comments_count: Total number of comments
- is_liked_by_user: Whether current user liked this post
- media: Array of attached media files (images, videos, PDFs)
- hashtags: Array of hashtags extracted from content
- school_id: School identifier
- class_id: Class identifier (can be null for school-wide student posts)
- student_id: Student identifier (REQUIRED - filters posts by student)

Request Parameters:
- student_id: Required parameter to filter posts by student
- page: Page number for pagination
- limit: Number of posts per page
- filters: Optional search, date range, category, hashtags

For now, we'll use a dummy student_id (e.g., 123) until proper parent-student association is implemented.

Database Tables Used:
- activity_feed_posts (main post data with student_id filter)
- activity_feed_media (media attachments)
- activity_feed_hashtags (hashtag associations)
- activity_feed_likes (like tracking)
- users (author information)
- students (student information for validation)
*/
