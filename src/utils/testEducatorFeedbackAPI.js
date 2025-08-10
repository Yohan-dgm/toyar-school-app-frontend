import store from "../state-store/store";
import { educatorFeedbackApi } from "../api/educator-feedback-api";

/**
 * Test function to quickly test the Educator Feedback API (similar to activity feed test)
 */
export const testEducatorFeedbackAPI = async () => {
  console.log("🚀 Starting Educator Feedback API Test...");
  console.log(
    "📡 Endpoint: api/student-management/student/get-student-list-data",
  );
  console.log("🔍 Method: POST with empty body");

  const dispatch = store.dispatch;

  try {
    console.log("📞 Making API call...");
    const result = await dispatch(
      educatorFeedbackApi.endpoints.getStudentListData.initiate(),
    );

    console.log("📥 Raw API Response:", result);

    if (result.data) {
      console.log("✅ API call successful!");
      console.log("📊 Response data:", result.data);
      console.log("📊 Response status:", result.data.status);

      if (result.data.status === "successful" && result.data.data) {
        console.log("🎓 Grades found:", result.data.data.grades?.length || 0);
        console.log("📋 Grades data:", result.data.data.grades);
        console.log(
          "📊 Grade level data:",
          result.data.data.grade_level_student_count?.length || 0,
        );
        console.log(
          "📋 Grade level data:",
          result.data.data.grade_level_student_count,
        );

        // Test first grade selection
        if (result.data.data.grades && result.data.data.grades.length > 0) {
          const firstGrade = result.data.data.grades[0];
          console.log("🔍 Testing student fetch for first grade:", firstGrade);

          // Test students by grade
          const studentsResult = await dispatch(
            educatorFeedbackApi.endpoints.getStudentsByGrade.initiate({
              grade_level_id: firstGrade.id,
              search: "",
            }),
          );

          console.log("👥 Students API Response:", studentsResult);

          if (studentsResult.data) {
            console.log("✅ Students API call successful!");
            console.log("📊 Students data:", studentsResult.data.data);
            console.log(
              "👥 Students count:",
              studentsResult.data.data?.students?.length || 0,
            );
          } else if (studentsResult.error) {
            console.log("❌ Students API call failed:", studentsResult.error);
          }
        }
      } else if (result.data.status === "authentication-required") {
        console.log("🔐 Authentication required - this is expected");
        console.log("✅ API is responding correctly");
        console.log("📝 Fallback data should be provided by transformResponse");
      } else {
        console.log("⚠️ Unexpected response status:", result.data.status);
        console.log("📝 Full response:", result.data);
      }
    } else if (result.error) {
      console.log("❌ API call failed with error:");
      console.log("🔴 Error details:", result.error);
      console.log("🔴 Error data:", result.error.data);
      console.log("🔴 Error status:", result.error.status);
    }
  } catch (error) {
    console.log("💥 Exception caught:");
    console.log("🔴 Error:", error);
    console.log("🔴 Error message:", error.message);
  }

  // Check Redux state
  console.log("\n🏪 Checking Redux Store State...");
  const currentState = store.getState();
  console.log("📊 Available slices:", Object.keys(currentState));

  if (currentState.educatorFeedback) {
    console.log("✅ educatorFeedback slice found");
    console.log(
      "📊 Educator feedback state:",
      Object.keys(currentState.educatorFeedback),
    );
  } else {
    console.log("❌ educatorFeedback slice NOT found");
  }

  if (currentState.apiServer1) {
    console.log("✅ apiServer1 slice found");
    console.log(
      "📊 API queries:",
      Object.keys(currentState.apiServer1.queries || {}),
    );

    // Check if our query is in the cache
    const queries = currentState.apiServer1.queries || {};
    const ourQuery = Object.keys(queries).find((key) =>
      key.includes("getStudentListData"),
    );
    if (ourQuery) {
      console.log("✅ Student list query found in cache:", ourQuery);
      console.log("📊 Query data:", queries[ourQuery]);
    } else {
      console.log("❌ Student list query NOT found in cache");
    }
  } else {
    console.log("❌ apiServer1 slice NOT found");
  }

  console.log("🏁 Educator Feedback API Test completed!");
};

/**
 * Test with component hook pattern
 */
export const testEducatorFeedbackHooks = () => {
  console.log("🎯 Testing Educator Feedback Hooks...");

  try {
    const {
      useGetStudentListDataQuery,
    } = require("../api/educator-feedback-api");
    console.log("✅ useGetStudentListDataQuery hook imported successfully");

    // Check if it's a function
    if (typeof useGetStudentListDataQuery === "function") {
      console.log("✅ Hook is a function, ready to use");
    } else {
      console.log(
        "❌ Hook is not a function:",
        typeof useGetStudentListDataQuery,
      );
    }
  } catch (error) {
    console.log("❌ Failed to import hooks:", error.message);
  }
};

// Make it globally available for console testing
if (typeof window !== "undefined") {
  window.testEducatorFeedback = {
    api: testEducatorFeedbackAPI,
    hooks: testEducatorFeedbackHooks,
    state: () => {
      const state = store.getState();
      console.log("📊 Current Store State:", {
        educatorFeedback: state.educatorFeedback ? "exists" : "missing",
        apiServer1: state.apiServer1 ? "exists" : "missing",
        apiQueries: Object.keys(state.apiServer1?.queries || {}).length,
      });
      return state;
    },
  };

  console.log("🌐 Global test functions available:");
  console.log("  - window.testEducatorFeedback.api()");
  console.log("  - window.testEducatorFeedback.hooks()");
  console.log("  - window.testEducatorFeedback.state()");
}

console.log("🚀 Educator Feedback API Test Utils Loaded!");
console.log("💡 Run testEducatorFeedbackAPI() to start testing immediately");
