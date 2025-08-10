/**
 * Manual Calendar API Test Script
 *
 * This script can be run to manually test the calendar API endpoints
 * and verify that the integration is working correctly.
 *
 * Usage: node src/tests/manual-calendar-test.js
 */

const axios = require("axios");

// Configuration
const BASE_URL =
  process.env.EXPO_PUBLIC_BASE_URL_API_SERVER_1 || "http://192.168.1.14:9999";
const BEARER_TOKEN = "your-test-token-here"; // Replace with actual token

// API Endpoints to test
const ENDPOINTS = [
  {
    name: "General Events",
    url: "/api/calendar-management/event/get-event-list-data",
    source: "general_events",
  },
  {
    name: "Special Classes",
    url: "/api/calendar-management/special-class/get-event-list-data",
    source: "special_classes",
  },
  {
    name: "Exam Schedules",
    url: "/api/calendar-management/exam-schedules/get-event-list-data",
    source: "exam_schedules",
  },
  {
    name: "Educator Feedback",
    url: "/api/calendar-management/educator-feedback/get-evoluation-process-list-data",
    source: "educator_feedback",
  },
  {
    name: "Parent Meetings",
    url: "/api/calendar-management/parent-meeting/get-event-list-data",
    source: "parent_meetings",
  },
];

// Test function for individual endpoint
async function testEndpoint(endpoint) {
  console.log(`\n📅 Testing ${endpoint.name}...`);
  console.log(`URL: ${BASE_URL}${endpoint.url}`);

  try {
    const response = await axios.get(`${BASE_URL}${endpoint.url}`, {
      headers: {
        Authorization: `Bearer ${BEARER_TOKEN}`,
        "Content-Type": "application/json",
      },
      timeout: 10000, // 10 second timeout
    });

    console.log(`✅ ${endpoint.name} - Success`);
    console.log(`Status: ${response.status}`);

    const data = response.data?.data || response.data || [];
    console.log(
      `Data count: ${Array.isArray(data) ? data.length : "Not an array"}`,
    );

    if (Array.isArray(data) && data.length > 0) {
      console.log("Sample item:", JSON.stringify(data[0], null, 2));
    }

    return {
      success: true,
      endpoint: endpoint.name,
      count: Array.isArray(data) ? data.length : 0,
      data: data,
    };
  } catch (error) {
    console.log(`❌ ${endpoint.name} - Failed`);
    console.log(`Error: ${error.message}`);

    if (error.response) {
      console.log(`Status: ${error.response.status}`);
      console.log(`Response: ${JSON.stringify(error.response.data, null, 2)}`);
    }

    return {
      success: false,
      endpoint: endpoint.name,
      error: error.message,
      status: error.response?.status,
    };
  }
}

// Main test function
async function runCalendarTests() {
  console.log("🚀 Starting Calendar API Integration Tests");
  console.log(`Base URL: ${BASE_URL}`);
  console.log(`Token: ${BEARER_TOKEN ? "Provided" : "Missing"}`);

  if (!BEARER_TOKEN || BEARER_TOKEN === "your-test-token-here") {
    console.log("⚠️  Warning: Please provide a valid Bearer token");
    console.log(
      "Update BEARER_TOKEN in this file or set it as environment variable",
    );
  }

  const results = [];

  // Test all endpoints
  for (const endpoint of ENDPOINTS) {
    const result = await testEndpoint(endpoint);
    results.push(result);

    // Add delay between requests
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  // Summary
  console.log("\n📊 Test Summary:");
  console.log("================");

  const successful = results.filter((r) => r.success);
  const failed = results.filter((r) => !r.success);

  console.log(`✅ Successful: ${successful.length}/${results.length}`);
  console.log(`❌ Failed: ${failed.length}/${results.length}`);

  if (successful.length > 0) {
    console.log("\nSuccessful endpoints:");
    successful.forEach((r) => {
      console.log(`  - ${r.endpoint}: ${r.count} items`);
    });
  }

  if (failed.length > 0) {
    console.log("\nFailed endpoints:");
    failed.forEach((r) => {
      console.log(`  - ${r.endpoint}: ${r.error} (${r.status || "No status"})`);
    });
  }

  // Total events count
  const totalEvents = successful.reduce((sum, r) => sum + r.count, 0);
  console.log(`\n📅 Total events across all endpoints: ${totalEvents}`);

  // Test data normalization
  console.log("\n🔄 Testing Data Normalization...");
  const allEvents = [];

  successful.forEach((result) => {
    if (result.data && Array.isArray(result.data)) {
      result.data.forEach((item) => {
        // Simulate the normalization process from the Redux slice
        const normalizedEvent = {
          ...item,
          source: ENDPOINTS.find((e) => e.name === result.endpoint)?.source,
          type:
            item.type || (result.endpoint.includes("exam") ? "exam" : "event"),
          title:
            item.title ||
            item.class_name ||
            item.exam_name ||
            item.feedback_title ||
            item.meeting_title ||
            item.name ||
            "Untitled",
        };
        allEvents.push(normalizedEvent);
      });
    }
  });

  console.log(`Normalized events: ${allEvents.length}`);

  if (allEvents.length > 0) {
    console.log(
      "Sample normalized event:",
      JSON.stringify(allEvents[0], null, 2),
    );
  }

  console.log("\n✨ Calendar API Integration Test Complete!");

  return {
    totalEndpoints: results.length,
    successfulEndpoints: successful.length,
    failedEndpoints: failed.length,
    totalEvents: totalEvents,
    normalizedEvents: allEvents.length,
    results: results,
  };
}

// Run tests if this file is executed directly
if (require.main === module) {
  runCalendarTests()
    .then((summary) => {
      console.log("\n📋 Final Summary:", JSON.stringify(summary, null, 2));
      process.exit(summary.failedEndpoints > 0 ? 1 : 0);
    })
    .catch((error) => {
      console.error("💥 Test runner failed:", error);
      process.exit(1);
    });
}

module.exports = { runCalendarTests, testEndpoint, ENDPOINTS };
