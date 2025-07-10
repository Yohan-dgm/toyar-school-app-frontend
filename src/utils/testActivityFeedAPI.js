import store from "../state-store/store";
import { activityFeedApi } from "../api/activity-feed-api";
import {
  setLoading,
  setPosts,
  setError,
  setFilters,
} from "../state-store/slices/school-life/school-posts-slice";

/**
 * Test function to quickly test the Activity Feed API
 * Call this from anywhere in your app for quick testing
 */
export const testActivityFeedAPI = async () => {
  console.log("🚀 Starting Activity Feed API Test...");
  console.log("📡 Endpoint: api/activity-feed-management/school-posts/list");

  const dispatch = store.dispatch;

  try {
    // Set loading state
    dispatch(setLoading(true));
    console.log("⏳ Loading state set to true");

    // Test basic API call
    console.log("📞 Making API call...");
    const result = await dispatch(
      activityFeedApi.endpoints.getSchoolPosts.initiate({
        page: 1,
        limit: 10,
        filters: {},
      })
    );

    console.log("📥 Raw API Response:", result);

    if (result.data) {
      console.log("✅ API call successful!");
      console.log("📊 Response data:", result.data);

      if (result.data.success) {
        // Update Redux state
        dispatch(
          setPosts({
            posts: result.data.data || [],
            pagination: result.data.pagination || null,
            append: false,
          })
        );

        console.log("🔄 Redux state updated");
        console.log(`📄 Posts loaded: ${result.data.data?.length || 0}`);
        console.log("📋 Pagination:", result.data.pagination);

        // Log first post for inspection
        if (result.data.data && result.data.data.length > 0) {
          console.log("🔍 First post sample:", result.data.data[0]);
        }
      } else {
        console.log("⚠️ API returned success: false");
        console.log("📝 Message:", result.data.message);
        dispatch(
          setError(result.data.message || "API returned unsuccessful response")
        );
      }
    } else if (result.error) {
      console.log("❌ API call failed with error:");
      console.log("🔴 Error details:", result.error);
      dispatch(setError(result.error.message || "Network error occurred"));
    }
  } catch (error) {
    console.log("💥 Exception caught:");
    console.log("🔴 Error:", error);
    dispatch(setError(error.message || "Unexpected error occurred"));
  } finally {
    dispatch(setLoading(false));
    console.log("✅ Loading state set to false");
  }

  // Log current Redux state
  const currentState = store.getState().schoolPosts;
  console.log("🏪 Current Redux State:");
  console.log("  - Posts count:", currentState.posts.length);
  console.log("  - Loading:", currentState.loading);
  console.log("  - Error:", currentState.error);
  console.log("  - Pagination:", currentState.pagination);

  console.log("🏁 Activity Feed API Test completed!");
  return currentState;
};

/**
 * Test API with filters
 */
export const testActivityFeedAPIWithFilters = async () => {
  console.log("🔍 Testing Activity Feed API with filters...");

  const dispatch = store.dispatch;
  const testFilters = {
    search: "announcement",
    category: "news",
    date_from: "2024-01-01",
    date_to: "2024-12-31",
  };

  console.log("🎯 Test filters:", testFilters);

  try {
    dispatch(setLoading(true));

    const result = await dispatch(
      activityFeedApi.endpoints.getSchoolPosts.initiate({
        page: 1,
        limit: 5,
        filters: testFilters,
      })
    );

    console.log("📥 Filtered API Response:", result);

    if (result.data?.success) {
      dispatch(
        setPosts({
          posts: result.data.data || [],
          pagination: result.data.pagination || null,
          append: false,
        })
      );
      dispatch(setFilters(testFilters));

      console.log(
        `✅ Filtered results: ${result.data.data?.length || 0} posts`
      );
    }
  } catch (error) {
    console.log("❌ Filtered API test failed:", error);
    dispatch(setError(error.message));
  } finally {
    dispatch(setLoading(false));
  }

  return store.getState().schoolPosts;
};

/**
 * Quick console commands for testing
 * You can run these in the browser console or React Native debugger
 */
export const quickTest = {
  // Basic test
  basic: () => testActivityFeedAPI(),

  // Test with filters
  filtered: () => testActivityFeedAPIWithFilters(),

  // Get current state
  state: () => {
    const state = store.getState().schoolPosts;
    console.log("📊 Current School Posts State:", state);
    return state;
  },

  // Clear state
  clear: () => {
    store.dispatch(setPosts({ posts: [], pagination: null, append: false }));
    store.dispatch(setError(null));
    console.log("🧹 State cleared");
  },
};

// Make it globally available for console testing
if (typeof window !== "undefined") {
  window.testActivityFeed = quickTest;
  console.log("🌐 Global test functions available:");
  console.log("  - window.testActivityFeed.basic()");
  console.log("  - window.testActivityFeed.filtered()");
  console.log("  - window.testActivityFeed.state()");
  console.log("  - window.testActivityFeed.clear()");
}

// Auto-run basic test when this file is imported (for immediate testing)
console.log("🚀 Activity Feed API Test Utils Loaded!");
console.log("📡 Ready to test: api/activity-feed-management/school-posts/list");
console.log("💡 Run testActivityFeedAPI() to start testing immediately");
