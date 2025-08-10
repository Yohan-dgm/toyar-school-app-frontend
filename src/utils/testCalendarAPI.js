import { store } from "../state-store/store";

// Test function to verify calendar API is working for all public events
export const testCalendarAPI = async () => {
  try {
    console.log("🧪 Testing Calendar API for all public events...");

    // Get current state
    const state = store.getState();
    const { user } = state.app;

    console.log("🧪 Current state:", {
      hasUser: !!user,
      userCategory: user?.user_category,
      testingAllPublicEvents: true,
    });

    if (!user?.user_category) {
      console.log("🧪 Missing user category for API test");
      return;
    }

    // Get API base URL from environment
    const baseUrl =
      process.env.EXPO_PUBLIC_BASE_URL_API_SERVER_1 ||
      "http://192.168.1.15:9999";
    const token = state.app.sessionData?.data?.token;

    if (!token) {
      console.log("🧪 No authentication token found");
      return;
    }

    console.log("🧪 Making API call with:", {
      logInUserId: null, // Not needed for public events
      user_category: user.user_category,
      show_all_public: true,
      baseUrl,
      hasToken: !!token,
    });

    const response = await fetch(
      `${baseUrl}/api/calendar-management/event/get-event-list-data`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          logInUserId: null,
          user_category: user.user_category,
          show_all_public: true,
        }),
      },
    );

    console.log("🧪 API Response status:", response.status);
    console.log(
      "🧪 API Response headers:",
      Object.fromEntries(response.headers),
    );

    const data = await response.text();
    console.log("🧪 API Response data:", data);

    // Try to parse as JSON
    try {
      const jsonData = JSON.parse(data);
      console.log("🧪 Parsed JSON data:", jsonData);

      if (jsonData.events && Array.isArray(jsonData.events)) {
        console.log("🧪 Found events:", jsonData.events.length);

        // Filter and show only public events
        const publicEvents = jsonData.events.filter(
          (event) => event.visibility_type === "Public",
        );
        console.log("🧪 Public events:", publicEvents.length);

        publicEvents.forEach((event, index) => {
          console.log(`🧪 Public Event ${index + 1}:`, {
            id: event.id,
            title: event.title,
            date: event.start_date,
            visibility: event.visibility_type,
            category: event.event_category?.name || "General",
          });
        });

        if (publicEvents.length === 0) {
          console.log("🧪 No public events found in response");
        }
      } else {
        console.log("🧪 No events array found in response");
      }

      return jsonData;
    } catch (parseError) {
      console.log("🧪 Response is not JSON:", parseError.message);
      return data;
    }
  } catch (error) {
    console.error("🧪 Calendar API test failed:", error);
    return null;
  }
};

// Make test function available globally for debugging
if (typeof window !== "undefined") {
  window.testCalendarAPI = testCalendarAPI;
}

console.log("🧪 Calendar API Test Utils Loaded!");
console.log("💡 Run testCalendarAPI() to test the calendar API");
