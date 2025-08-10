// Test educator feedback API integration
import store from "./state-store/store.ts";

/**
 * Test function to quickly test the Educator Feedback API
 */
const testEducatorFeedbackAPI = async () => {
  console.log("🚀 Starting Educator Feedback API Test...");
  console.log(
    "📡 Endpoint: api/student-management/student/get-student-list-data",
  );

  const dispatch = store.dispatch;

  try {
    // Import the API dynamically to avoid compilation issues
    const { educatorFeedbackApi } = await import(
      "./api/educator-feedback-api.ts"
    );

    console.log("📞 Making API call to get student list data...");
    const result = await dispatch(
      educatorFeedbackApi.endpoints.getStudentListData.initiate(),
    );

    console.log("📥 Raw API Response:", result);

    if (result.data) {
      console.log("✅ API call successful!");
      console.log("📊 Response data:", result.data);

      if (result.data.status === "successful" && result.data.data) {
        console.log("🎓 Grades found:", result.data.data.grades?.length || 0);
        console.log("📋 First grade:", result.data.data.grades?.[0]);
        console.log(
          "📊 Grade level data:",
          result.data.data.grade_level_student_count?.length || 0,
        );
      } else if (result.data.status === "authentication-required") {
        console.log("🔐 Authentication required - this is expected in dev");
        console.log(
          "📝 Using fallback data should be handled by transformResponse",
        );
      } else {
        console.log("⚠️ Unexpected response status:", result.data.status);
      }
    } else if (result.error) {
      console.log("❌ API call failed with error:");
      console.log("🔴 Error details:", result.error);
      console.log("🔴 Error data:", result.error.data);
      console.log("🔴 Error status:", result.error.status);
    }

    // Test the hook integration as well
    console.log("\n🎯 Testing RTK Query hook integration...");

    // Check if the educatorFeedback slice exists in store
    const currentState = store.getState();
    console.log("🏪 Available slices in store:", Object.keys(currentState));

    // Check if educator feedback slice exists
    if (currentState.educatorFeedback) {
      console.log("✅ educatorFeedback slice found in store");
      console.log(
        "📊 Current educator feedback state:",
        currentState.educatorFeedback,
      );
    } else {
      console.log("❌ educatorFeedback slice NOT found in store");
    }

    // Check if apiServer1 exists
    if (currentState.apiServer1) {
      console.log("✅ apiServer1 slice found in store");
      console.log(
        "📊 API Server 1 queries:",
        Object.keys(currentState.apiServer1.queries || {}),
      );
    } else {
      console.log("❌ apiServer1 slice NOT found in store");
    }
  } catch (error) {
    console.log("💥 Exception caught:");
    console.log("🔴 Error:", error);
    console.log("🔴 Error message:", error.message);
    console.log("🔴 Error stack:", error.stack);
  }

  console.log("🏁 Educator Feedback API Test completed!");
};

// Export for testing
if (typeof window !== "undefined") {
  window.testEducatorFeedbackAPI = testEducatorFeedbackAPI;
  console.log(
    "🌐 Global test function available: window.testEducatorFeedbackAPI()",
  );
}

export { testEducatorFeedbackAPI };
