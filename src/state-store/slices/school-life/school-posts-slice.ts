import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define types for the school posts state
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
  student_id: number | null;
}

interface Pagination {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
  has_more: boolean;
}

interface SchoolPostsState {
  posts: Post[];
  loading: boolean;
  error: string | null;
  pagination: Pagination | null;
  filters: {
    search: string;
    date_from: string | null;
    date_to: string | null;
    category: string | null;
    hashtags: string[];
  };
  refreshing: boolean;
  likedPosts: { [key: number]: boolean };
}

const initialState: SchoolPostsState = {
  posts: [],
  loading: false,
  error: null,
  pagination: null,
  filters: {
    search: "",
    date_from: null,
    date_to: null,
    category: null,
    hashtags: [],
  },
  refreshing: false,
  likedPosts: {},
};

const schoolPostsSlice = createSlice({
  name: "schoolPosts",
  initialState,
  reducers: {
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
      action: PayloadAction<Partial<SchoolPostsState["filters"]>>
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

      // Update liked posts tracking
      state.likedPosts[postId] = isLiked;

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
      state.filters = initialState.filters;
    },
  },
});

export const {
  setLoading,
  setRefreshing,
  setPosts,
  setError,
  setFilters,
  clearFilters,
  toggleLike,
  clearData,
} = schoolPostsSlice.actions;

export default schoolPostsSlice.reducer;

/*
=== BACKEND DATA REQUIREMENTS FOR SCHOOL POSTS ===

This slice manages school-wide posts that are visible to all users.

API Endpoint: POST /api/activity-feed/school/posts

Required Backend Data Fields:
- id: Unique post identifier
- type: Post type (announcement, event, news, achievement)
- category: Post category for filtering
- title: Post title/headline
- content: Full post content with hashtags
- author_name: Name of the post author
- author_image: Profile image URL of the author
- created_at: Post creation timestamp
- updated_at: Last modification timestamp
- likes_count: Total number of likes
- comments_count: Total number of comments
- is_liked_by_user: Whether current user liked this post
- media: Array of attached media files (images, videos, PDFs)
- hashtags: Array of hashtags extracted from content
- school_id: School identifier
- class_id: null (school-wide posts)
- student_id: null (school-wide posts)

Pagination Data:
- current_page: Current page number
- per_page: Items per page
- total: Total number of posts
- last_page: Last page number
- has_more: Whether more posts are available

Database Tables Used:
- activity_feed_posts (main post data)
- activity_feed_media (media attachments)
- activity_feed_hashtags (hashtag associations)
- activity_feed_likes (like tracking)
- users (author information)
*/
