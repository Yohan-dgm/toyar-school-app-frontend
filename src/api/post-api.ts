import { apiServer1 } from "./api-server-1";

// Define the postsApi slice with RTK Query
export const postsApi = apiServer1
  .enhanceEndpoints({ addTagTypes: ["Posts"] })
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
  // useGetPostsQuery, // Use this when you want data to be fetched automatically as the component mounts or when the query parameters change.
  // useLazyGetPostsQuery, // Use this when you need more control over when the query runs, such as in response to a user action (e.g., clicking a button), conditional fetching, or specific events.
  // useGetPostByIdQuery,
  // useCreatePostMutation,
  // useUpdatePostMutation,
  // useDeletePostMutation,
  // useGetPokemonByNameQuery,
  // useLazyGetPokemonByNameQuery,
} = postsApi;
