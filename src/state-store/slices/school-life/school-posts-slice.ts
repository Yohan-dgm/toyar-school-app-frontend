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
  allPosts: Post[]; // Store all unfiltered posts for filter options
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
  likedPosts: { [userPostKey: string]: boolean }; // Track liked posts per user (format: "userId_postId")
  currentUserId: number | null; // Store current user ID for user-specific like states
}

const initialState: SchoolPostsState = {
  posts: [],
  allPosts: [], // Initialize empty array for all unfiltered posts
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
  currentUserId: null,
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

    // Set all posts (unfiltered) for filter options
    setAllPosts: (state, action: PayloadAction<Post[]>) => {
      state.allPosts = action.payload;
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
      action: PayloadAction<Partial<SchoolPostsState["filters"]>>,
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

    // Toggle like status for a post with optimistic updates
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

      // Also update in allPosts array if it exists
      const allPostIndex = state.allPosts.findIndex(
        (post) => post.id === postId,
      );
      if (allPostIndex !== -1) {
        state.allPosts[allPostIndex].is_liked_by_user = isLiked;
        state.allPosts[allPostIndex].likes_count = likesCount;
      }
    },

    // Set like loading state for specific post (placeholder for future implementation)
    setLikeLoading: (
      _state,
      _action: PayloadAction<{ postId: number; loading: boolean }>,
    ) => {
      // Future implementation: track loading state per post
      // const { postId, loading } = action.payload;
      // state.likeLoadingStates[postId] = loading;
    },

    // Revert like action (for error handling)
    revertLike: (
      state,
      action: PayloadAction<{
        postId: number;
        isLiked: boolean;
        likesCount: number;
      }>,
    ) => {
      const { postId, isLiked, likesCount } = action.payload;

      // Revert liked posts tracking with user-specific key
      if (state.currentUserId) {
        const userPostKey = `${state.currentUserId}_${postId}`;
        state.likedPosts[userPostKey] = isLiked;
      }

      // Revert the post in the posts array
      const postIndex = state.posts.findIndex((post) => post.id === postId);
      if (postIndex !== -1) {
        state.posts[postIndex].is_liked_by_user = isLiked;
        state.posts[postIndex].likes_count = likesCount;
      }

      // Also revert in allPosts array if it exists
      const allPostIndex = state.allPosts.findIndex(
        (post) => post.id === postId,
      );
      if (allPostIndex !== -1) {
        state.allPosts[allPostIndex].is_liked_by_user = isLiked;
        state.allPosts[allPostIndex].likes_count = likesCount;
      }
    },

    // Clear all data (for logout or reset)
    clearData: (state) => {
      state.posts = [];
      state.allPosts = [];
      state.pagination = null;
      state.error = null;
      state.likedPosts = {};
      state.currentUserId = null;
      state.filters = initialState.filters;
    },
  },
});

export const {
  setLoading,
  setRefreshing,
  setPosts,
  setAllPosts,
  setError,
  setFilters,
  clearFilters,
  setCurrentUserId,
  toggleLike,
  setLikeLoading,
  revertLike,
  clearData,
} = schoolPostsSlice.actions;

export default schoolPostsSlice.reducer;

// Helper function to get user-specific like state
export const getUserLikeState = (
  state: SchoolPostsState,
  postId: number,
): boolean => {
  if (!state.currentUserId) return false;
  const userPostKey = `${state.currentUserId}_${postId}`;
  return state.likedPosts[userPostKey] || false;
};

/*
=== BACKEND DATA REQUIREMENTS FOR SCHOOL POSTS ===

This slice manages school-wide posts that are visible to all users with like functionality.

1. SCHOOL POSTS LIST ENDPOINT: POST /api/activity-feed-management/school-posts/list
   Request Body:
   {
     "page": 1,
     "page_size": 10,
     "search_phrase": "optional search term",
     "search_filter_list": [], // Backend expects this parameter
     "category": "announcement|event|news|achievement", // optional
     "date_from": "2024-01-01", // optional YYYY-MM-DD format
     "date_to": "2024-12-31",   // optional YYYY-MM-DD format
     "hashtags": ["tag1", "tag2"] // optional array of hashtags
   }

   Response Format:
   {
     "status": "successful",
     "message": "Posts retrieved successfully",
     "data": {
       "posts": [
         {
           "id": 1,
           "type": "announcement|event|news|achievement",
           "category": "general",
           "title": "Post Title",
           "content": "Post content with #hashtags",
           "author_name": "John Doe",
           "author_image": "/storage/app/profiles/author.jpg",
           "created_at": "2024-01-15T10:30:00Z",
           "updated_at": "2024-01-15T10:30:00Z",
           "likes_count": 15,
           "comments_count": 5,
           "is_liked_by_user": false, // IMPORTANT: Current user's like status
           "media": [
             {
               "id": 1,
               "type": "image|video|pdf",
               "url": "/storage/app/activity-feed/media/images/file.jpg",
               "thumbnail_url": "/storage/app/activity-feed/media/thumbnails/file.jpg",
               "filename": "file.jpg",
               "size": 1024000
             }
           ],
           "hashtags": ["school", "announcement"],
           "school_id": 1,
           "class_id": null, // null for school-wide posts
           "student_id": null // null for school-wide posts
         }
       ],
       "pagination": {
         "current_page": 1,
         "per_page": 10,
         "total": 50,
         "last_page": 5,
         "has_more": true
       }
     }
   }

2. LIKE POST ENDPOINT: POST /api/activity-feed/post/like
   Request Body:
   {
     "post_id": 1,
     "action": "like|unlike"
   }

   Response Format:
   {
     "status": "successful",
     "message": "Post liked successfully",
     "data": {
       "post_id": 1,
       "likes_count": 16, // Updated likes count
       "is_liked_by_user": true // Updated user like status
     }
   }

   Error Response:
   {
     "status": "error",
     "message": "Post not found or user not authorized",
     "data": null
   }

=== BACKEND IMPLEMENTATION REQUIREMENTS ===

1. Authentication & Authorization:
   - All endpoints require valid user authentication token
   - Users can only like posts they have access to based on their role
   - Validate user permissions for school posts

2. Like Functionality:
   - Validate post_id exists and user has access
   - Validate action is either 'like' or 'unlike'
   - Handle duplicate like/unlike requests gracefully
   - Update likes_count atomically to prevent race conditions
   - Return updated likes_count and is_liked_by_user status

3. Database Operations:
   - Use transactions for like/unlike operations
   - Update likes_count in activity_feed_posts table
   - Insert/delete record in activity_feed_post_likes table
   - Ensure data consistency between tables

4. Error Handling:
   - Return appropriate HTTP status codes
   - Provide clear error messages for debugging
   - Handle edge cases (post deleted, user unauthorized, etc.)

5. Performance Considerations:
   - Implement rate limiting to prevent spam liking
   - Use database indexes on frequently queried fields
   - Consider caching for frequently accessed posts

6. Data Validation:
   - Validate all input parameters
   - Sanitize search phrases and filter inputs
   - Validate date formats and ranges

=== DATABASE TABLES NEEDED ===

1. activity_feed_posts
   - id (PRIMARY KEY)
   - type (ENUM: announcement, event, news, achievement)
   - category (VARCHAR)
   - title (VARCHAR)
   - content (TEXT)
   - author_id (FOREIGN KEY to users.id)
   - school_id (FOREIGN KEY)
   - class_id (FOREIGN KEY, nullable)
   - student_id (FOREIGN KEY, nullable)
   - likes_count (INTEGER, default 0)
   - comments_count (INTEGER, default 0)
   - created_at (TIMESTAMP)
   - updated_at (TIMESTAMP)

2. activity_feed_post_likes
   - id (PRIMARY KEY)
   - post_id (FOREIGN KEY to activity_feed_posts.id)
   - user_id (FOREIGN KEY to users.id)
   - created_at (TIMESTAMP)
   - UNIQUE constraint on (post_id, user_id)

3. activity_feed_media
   - id (PRIMARY KEY)
   - post_id (FOREIGN KEY to activity_feed_posts.id)
   - type (ENUM: image, video, pdf)
   - url (VARCHAR)
   - thumbnail_url (VARCHAR, nullable)
   - filename (VARCHAR)
   - size (BIGINT)
   - created_at (TIMESTAMP)

4. activity_feed_hashtags
   - id (PRIMARY KEY)
   - post_id (FOREIGN KEY to activity_feed_posts.id)
   - hashtag (VARCHAR)
   - created_at (TIMESTAMP)

5. users
   - id (PRIMARY KEY)
   - name (VARCHAR)
   - email (VARCHAR)
   - profile_image (VARCHAR, nullable)
   - role (ENUM: parent, educator, sport_coach, etc.)
   - school_id (FOREIGN KEY)
   - created_at (TIMESTAMP)
   - updated_at (TIMESTAMP)

=== FRONTEND INTEGRATION NOTES ===

1. Optimistic Updates:
   - Frontend implements optimistic UI updates for better UX
   - Backend should handle conflicts gracefully
   - Use revertLike action if backend request fails

2. State Management:
   - likedPosts object tracks user's like status for quick access
   - toggleLike action updates both posts and allPosts arrays
   - setLikeLoading can be used for per-post loading states

3. Error Handling:
   - Use revertLike action to rollback optimistic updates on error
   - Display appropriate error messages to users
   - Implement retry logic for network failures

4. Performance:
   - Debounce rapid like/unlike actions
   - Cache like status locally
   - Implement proper loading states
*/
