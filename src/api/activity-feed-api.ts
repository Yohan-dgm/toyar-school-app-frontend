import { apiServer1 } from "./api-server-1";

// Define the activity feed API slice with RTK Query
export const activityFeedApi = apiServer1
  .enhanceEndpoints({
    addTagTypes: ["ActivityFeed", "SchoolPosts", "ClassPosts", "StudentPosts"],
  })
  .injectEndpoints({
    overrideExisting: true, // Fix RTK Query endpoint override warnings
    endpoints: (build) => ({
      // ===== SCHOOL POSTS API =====
      getSchoolPosts: build.query({
        query: ({ page = 1, limit = 10, filters = {} }) => {
          console.log("🔍 API Slice - Received parameters:", {
            page,
            limit,
            filters,
          });

          // Map frontend filter names to backend expected names
          const body = {
            page,
            page_size: limit, // Backend expects 'page_size' not 'limit'
            search_phrase: filters.search || "", // Backend expects 'search_phrase' not 'search'
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
                  type: "SchoolPosts",
                  id: post.id,
                })),
                { type: "SchoolPosts", id: "LIST" },
              ]
            : [{ type: "SchoolPosts", id: "LIST" }],
        transformResponse: (response: any) => {
          // console.log("🏫 School Posts API Response:", response);

          // Check if response is HTML (error page)
          if (
            typeof response === "string" &&
            response.includes("<!DOCTYPE html>")
          ) {
            console.error(
              "❌ School Posts API returned HTML instead of JSON:",
              response.substring(0, 200)
            );
            throw new Error("Server returned HTML error page instead of JSON");
          }

          // Transform the response to match expected structure
          if (response.status === "successful" && response.data) {
            return {
              ...response,
              data: response.data.posts, // Extract posts array for easier access
              pagination: response.data.pagination, // Keep pagination separate
            };
          }
          return response;
        },
      }),

      // ===== CLASS POSTS API =====
      getClassPosts: build.query({
        query: ({ class_id, page = 1, limit = 10, filters = {} }) => {
          const body = {
            class_id,
            page,
            page_size: limit, // Backend expects 'page_size' not 'limit'
            search_phrase: filters.search || "", // Backend expects 'search_phrase'
            search_filter_list: [], // Backend expects this parameter
            category: filters.category || "",
            date_from: filters.dateFrom || filters.date_from || "", // Support both dateFrom and date_from
            date_to: filters.dateTo || filters.date_to || "", // Support both dateTo and date_to
            hashtags: filters.hashtags || [],
          };

          console.log("📤 Class Posts API Request Body:", body);

          return {
            url: "api/activity-feed/class/posts",
            method: "POST",
            body,
          };
        },
        providesTags: (result, error, { class_id }) =>
          result?.data
            ? [
                ...result.data.map((post: any) => ({
                  type: "ClassPosts",
                  id: post.id,
                })),
                { type: "ClassPosts", id: `CLASS_${class_id}` },
              ]
            : [{ type: "ClassPosts", id: `CLASS_${class_id}` }],
        transformResponse: (response: any) => {
          console.log("🎓 Class Posts API Response:", response);
          // Transform the response to match expected structure
          if (response.status === "successful" && response.data) {
            return {
              ...response,
              data: response.data.posts, // Extract posts array for easier access
              pagination: response.data.pagination, // Keep pagination separate
            };
          }
          return response;
        },
      }),

      // ===== STUDENT POSTS API =====
      getStudentPosts: build.query({
        query: ({ student_id, page = 1, limit = 10, filters = {} }) => {
          const body = {
            student_id,
            page,
            page_size: limit, // Backend expects 'page_size' not 'limit'
            search_phrase: filters.search || "", // Backend expects 'search_phrase'
            search_filter_list: [], // Backend expects this parameter
            category: filters.category || "",
            date_from: filters.dateFrom || filters.date_from || "", // Support both dateFrom and date_from
            date_to: filters.dateTo || filters.date_to || "", // Support both dateTo and date_to
            hashtags: filters.hashtags || [],
          };

          console.log("📤 Student Posts API Request Body:", body);

          return {
            url: "api/activity-feed/student/posts",
            method: "POST",
            body,
          };
        },
        providesTags: (result, error, { student_id }) =>
          result?.data
            ? [
                ...result.data.map((post: any) => ({
                  type: "StudentPosts",
                  id: post.id,
                })),
                { type: "StudentPosts", id: `STUDENT_${student_id}` },
              ]
            : [{ type: "StudentPosts", id: `STUDENT_${student_id}` }],
        transformResponse: (response: any) => {
          console.log("👨‍🎓 Student Posts API Response:", response);
          // Transform the response to match expected structure
          if (response.status === "successful" && response.data) {
            return {
              ...response,
              data: response.data.posts, // Extract posts array for easier access
              pagination: response.data.pagination, // Keep pagination separate
            };
          }
          return response;
        },
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
        ],
      }),

      // ===== GET POST DETAILS API =====
      getPostDetails: build.query({
        query: (post_id) => ({
          url: `api/activity-feed/post/${post_id}`,
          method: "GET",
        }),
        providesTags: (result, error, post_id) => [
          { type: "SchoolPosts", id: post_id },
          { type: "ClassPosts", id: post_id },
          { type: "StudentPosts", id: post_id },
        ],
      }),
    }),
  });

// Export generated hooks for each endpoint
export const {
  useGetSchoolPostsQuery,
  useLazyGetSchoolPostsQuery,
  useGetClassPostsQuery,
  useLazyGetClassPostsQuery,
  useGetStudentPostsQuery,
  useLazyGetStudentPostsQuery,
  useLikePostMutation,
  useGetPostDetailsQuery,
  useLazyGetPostDetailsQuery,
} = activityFeedApi;

/*
=== BACKEND DATA REQUIREMENTS ===

1. SCHOOL POSTS ENDPOINT: POST /api/activity-feed/school/posts
   Request Body:
   {
     "page": 1,
     "limit": 10,
     "search": "optional search term",
     "date_from": "2024-01-01", // optional
     "date_to": "2024-12-31",   // optional
     "category": "announcement|event|news|achievement", // optional
     "hashtags": ["tag1", "tag2"] // optional array
   }

   Response Format:
   {
     "success": true,
     "data": [
       {
         "id": 1,
         "type": "announcement|event|news|achievement",
         "category": "announcement",
         "title": "Post Title",
         "content": "Post content with hashtags #example",
         "author_name": "Principal Johnson",
         "author_image": "https://example.com/profile.jpg",
         "created_at": "2024-01-15T10:30:00Z",
         "updated_at": "2024-01-15T10:30:00Z",
         "likes_count": 24,
         "comments_count": 8,
         "is_liked_by_user": false,
         "media": [
           {
             "id": 1,
             "type": "image|video|pdf",
             "url": "https://example.com/media/file.jpg",
             "thumbnail_url": "https://example.com/media/thumb.jpg", // for videos
             "filename": "original_name.jpg",
             "size": 1024000 // in bytes
           }
         ],
         "hashtags": ["ScienceFair", "Achievement"],
         "school_id": 1,
         "class_id": null, // null for school-wide posts
         "student_id": null // null for school-wide posts
       }
     ],
     "pagination": {
       "current_page": 1,
       "per_page": 10,
       "total": 150,
       "last_page": 15,
       "has_more": true
     }
   }

2. CLASS POSTS ENDPOINT: POST /api/activity-feed/class/posts
   Request Body:
   {
     "class_id": 5,
     "page": 1,
     "limit": 10,
     "search": "optional",
     "date_from": "2024-01-01",
     "date_to": "2024-12-31",
     "category": "announcement|event|news|achievement",
     "hashtags": ["tag1", "tag2"]
   }

   Response: Same format as school posts but filtered by class_id

3. STUDENT POSTS ENDPOINT: POST /api/activity-feed/student/posts
   Request Body:
   {
     "student_id": 123,
     "page": 1,
     "limit": 10,
     "search": "optional",
     "date_from": "2024-01-01",
     "date_to": "2024-12-31",
     "category": "announcement|event|news|achievement",
     "hashtags": ["tag1", "tag2"]
   }

   Response: Same format as school posts but filtered by student_id

4. LIKE POST ENDPOINT: POST /api/activity-feed/post/like
   Request Body:
   {
     "post_id": 1,
     "action": "like|unlike"
   }

   Response:
   {
     "success": true,
     "message": "Post liked successfully",
     "data": {
       "post_id": 1,
       "likes_count": 25,
       "is_liked_by_user": true
     }
   }

5. GET POST DETAILS ENDPOINT: GET /api/activity-feed/post/{post_id}
   Response: Single post object with same format as above

=== DATABASE TABLES STRUCTURE ===

1. activity_feed_posts
   - id (primary key)
   - type (enum: announcement, event, news, achievement)
   - category (varchar)
   - title (varchar)
   - content (text)
   - author_id (foreign key to users table)
   - school_id (foreign key to schools table)
   - class_id (foreign key to classes table, nullable)
   - student_id (foreign key to students table, nullable)
   - likes_count (integer, default 0)
   - comments_count (integer, default 0)
   - is_active (boolean, default true)
   - created_at (timestamp)
   - updated_at (timestamp)

2. activity_feed_media
   - id (primary key)
   - post_id (foreign key to activity_feed_posts)
   - type (enum: image, video, pdf)
   - url (varchar)
   - thumbnail_url (varchar, nullable)
   - filename (varchar)
   - size (bigint)
   - created_at (timestamp)

3. activity_feed_hashtags
   - id (primary key)
   - post_id (foreign key to activity_feed_posts)
   - hashtag (varchar)
   - created_at (timestamp)

4. activity_feed_likes
   - id (primary key)
   - post_id (foreign key to activity_feed_posts)
   - user_id (foreign key to users table)
   - created_at (timestamp)
   - unique(post_id, user_id)

5. activity_feed_comments (for future use)
   - id (primary key)
   - post_id (foreign key to activity_feed_posts)
   - user_id (foreign key to users table)
   - content (text)
   - parent_comment_id (foreign key to self, nullable)
   - created_at (timestamp)
   - updated_at (timestamp)
*/
