import { apiServer1 } from "./api-server-1";

// Define the postsApi slice with RTK Query
export const postsApi = apiServer1
  .enhanceEndpoints({
    addTagTypes: ["Posts", "SchoolPosts", "ClassPosts", "StudentPosts"],
  })
  .injectEndpoints({
    // Define API endpoints (queries and mutations)
    endpoints: (build) => ({
      getPokemonByName: build.query({
        query: (name: string) => `pokemon/${name}`,
      }),

      // Query to fetch a paginated list of posts
      getPosts: build.query({
        // URL and parameters for paginated posts
        query: ({ page = 1, limit = 10 }) =>
          `/posts?_page=${page}&_limit=${limit}`,

        // Tagging posts to automatically refresh this cache when needed
        providesTags: (result) =>
          result
            ? [
                ...result.map((obj: any) => {
                  return { type: "Posts", id: obj.id };
                }),
                { type: "Posts", id: "LIST" },
              ]
            : [{ type: "Posts", id: "LIST" }],
      }),

      // Query to fetch a single post by its ID
      getPostById: build.query({
        // Define query with post ID in the URL path
        query: (id) => `/posts/${id}`,

        // Tag individual post by ID for selective cache invalidation
        providesTags: (result, error, id) => [{ type: "Posts", id }],
      }),

      // ===== SCHOOL POSTS API =====
      getSchoolPosts: build.query({
        query: ({ page = 1, limit = 10, filters = {} }) => {
          const body = {
            page,
            page_size: limit, // Backend expects 'page_size' not 'limit'
            search_phrase: filters.search || "", // Backend expects 'search_phrase'
            search_filter_list: [], // Backend expects this parameter
            category: filters.category || "",
            date_from: filters.dateFrom || filters.date_from || "", // Support both dateFrom and date_from
            date_to: filters.dateTo || filters.date_to || "", // Support both dateTo and date_to
            hashtags: filters.hashtags || [],
          };

          console.log("📤 School Posts API Request Body:", body);

          return {
            url: "api/activity-feed-management/school-posts/list",
            method: "POST",
            body,
          };
        },
        providesTags: (result) =>
          result?.data?.posts
            ? [
                ...result.data.posts.map((post: any) => ({
                  type: "SchoolPosts" as const,
                  id: post.id,
                })),
                { type: "SchoolPosts" as const, id: "LIST" },
              ]
            : [{ type: "SchoolPosts" as const, id: "LIST" }],
      }),

      // ===== LIKE POST API =====
      likePost: build.mutation({
        query: ({ post_id, action }) => ({
          url: "/api/activity-feed-management/school-posts/toggle-like",
          method: "POST",
          body: {
            post_id,
            action, // 'like' or 'unlike'
          },
        }),
        invalidatesTags: (result, error, { post_id }) => [
          { type: "SchoolPosts", id: post_id },
          { type: "ClassPosts", id: post_id },
          { type: "StudentPosts", id: post_id },
          { type: "Posts", id: post_id },
        ],
      }),

      // Mutation to create a new post
      createPost: build.mutation({
        // Configure the POST request details and payload
        query: (newPost) => ({
          url: "/posts",
          method: "POST",
          body: newPost,
        }),

        // Invalidate all posts (paginated list) to refresh after creating a post
        invalidatesTags: [{ type: "Posts", id: "LIST" }],
      }),

      // Mutation to update an existing post by its ID
      updatePost: build.mutation({
        // Define the PUT request with post ID and updated data in the payload
        query: ({ id, ...updatedData }) => ({
          url: `/posts/${id}`,
          method: "PUT",
          body: updatedData,
        }),

        // Invalidate cache for both the updated post and the paginated list
        invalidatesTags: (result, error, { id }) => [
          { type: "Posts", id },
          { type: "Posts", id: "LIST" },
        ],
      }),

      // Mutation to delete a post by its ID
      deletePost: build.mutation({
        // Define the DELETE request with post ID in the URL path
        query: (id) => ({
          url: `/posts/${id}`,
          method: "DELETE",
        }),

        // Invalidate cache for the deleted post and the paginated list
        invalidatesTags: (result, error, id) => [
          { type: "Posts", id },
          { type: "Posts", id: "LIST" },
        ],
      }),
    }),
  });

// Export generated hooks for each endpoint to use them in components
export const {
  // Original hooks
  useGetPostsQuery, // Use this when you want data to be fetched automatically as the component mounts or when the query parameters change.
  useLazyGetPostsQuery, // Use this when you need more control over when the query runs, such as in response to a user action (e.g., clicking a button), conditional fetching, or specific events.
  useGetPostByIdQuery,
  useCreatePostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
  useGetPokemonByNameQuery,
  useLazyGetPokemonByNameQuery,

  // School posts hooks
  useGetSchoolPostsQuery,
  useLazyGetSchoolPostsQuery,

  // Like functionality hooks
  useLikePostMutation,
} = postsApi;

/*
=== BACKEND DATA REQUIREMENTS FOR POST API ===

This API handles general post operations and school posts with like functionality.

1. SCHOOL POSTS ENDPOINT: POST /api/activity-feed-management/school-posts/list
   Request Body:
   {
     "page": 1,
     "page_size": 10,
     "search_phrase": "optional search term",
     "search_filter_list": [], // Backend expects this parameter
     "category": "announcement|event|news|achievement", // optional
     "date_from": "2024-01-01", // optional
     "date_to": "2024-12-31",   // optional
     "hashtags": ["tag1", "tag2"] // optional array
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
           "is_liked_by_user": false,
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
           "class_id": null,
           "student_id": null
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
       "likes_count": 16,
       "is_liked_by_user": true
     }
   }

   Error Response:
   {
     "status": "error",
     "message": "Post not found or user not authorized",
     "data": null
   }

=== BACKEND IMPLEMENTATION REQUIREMENTS ===

1. Authentication: All endpoints require valid user authentication token
2. Authorization: Users can only like posts they have access to
3. Validation: Validate post_id exists and action is 'like' or 'unlike'
4. Database Updates:
   - Update likes_count in posts table
   - Insert/delete record in post_likes table
   - Return updated counts and user like status
5. Error Handling: Return appropriate error messages for invalid requests
6. Rate Limiting: Implement rate limiting to prevent spam liking
7. Optimistic Updates: Frontend implements optimistic updates, backend should handle conflicts gracefully

=== DATABASE TABLES NEEDED ===

1. activity_feed_posts
   - id, type, category, title, content, author_id, school_id, class_id, student_id
   - likes_count, comments_count, created_at, updated_at

2. activity_feed_post_likes
   - id, post_id, user_id, created_at
   - Unique constraint on (post_id, user_id)

3. activity_feed_media
   - id, post_id, type, url, thumbnail_url, filename, size

4. activity_feed_hashtags
   - id, post_id, hashtag, created_at

5. users
   - id, name, profile_image, email, etc.
*/
