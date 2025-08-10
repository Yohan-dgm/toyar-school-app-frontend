const fetch = require("node-fetch");

// Test the API endpoints directly
const BASE_URL = "http://172.20.10.3:9999";
const ENDPOINT = "/api/educator-feedback-management/feedback/list";

const headers = {
  "X-Requested-With": "XMLHttpRequest",
  "Content-Type": "application/json",
  Accept: "application/json",
  // Note: In real app, this would come from Redux state
  // 'Authorization': 'Bearer YOUR_TOKEN_HERE'
};

const testPayload = {
  page_size: 10,
  page: 1,
  search_phrase: "",
  search_filter_list: [],
};

async function testFeedbackAPI() {
  console.log("🧪 DIRECT API TEST STARTING");
  console.log("📍 Testing endpoint:", `${BASE_URL}${ENDPOINT}`);
  console.log("📤 Request payload:", JSON.stringify(testPayload, null, 2));
  console.log("📋 Request headers:", JSON.stringify(headers, null, 2));
  console.log("");

  try {
    console.log("⏳ Making API request...");
    const response = await fetch(`${BASE_URL}${ENDPOINT}`, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(testPayload),
    });

    console.log("📊 Response status:", response.status);
    console.log("📊 Response statusText:", response.statusText);
    console.log(
      "📊 Response headers:",
      JSON.stringify([...response.headers.entries()], null, 2),
    );
    console.log("");

    const responseText = await response.text();
    console.log("📄 Raw response text (first 500 chars):");
    console.log(responseText.substring(0, 500));
    console.log("");

    if (response.headers.get("content-type")?.includes("application/json")) {
      try {
        const jsonData = JSON.parse(responseText);
        console.log("✅ JSON Response parsed successfully:");
        console.log("🔍 Response structure:", {
          keys: Object.keys(jsonData),
          success: jsonData.success,
          status: jsonData.status,
          hasData: !!jsonData.data,
          dataKeys: jsonData.data ? Object.keys(jsonData.data) : null,
        });

        if (jsonData.data && jsonData.data.data) {
          console.log("📋 Feedback items found:", jsonData.data.data.length);
          if (jsonData.data.data.length > 0) {
            const firstFeedback = jsonData.data.data[0];
            console.log("🔍 First feedback item structure:", {
              id: firstFeedback.id,
              student: firstFeedback.student,
              subcategoriesCount: firstFeedback.subcategories?.length || 0,
              subcategories: firstFeedback.subcategories,
              allKeys: Object.keys(firstFeedback),
            });

            // Check subcategories in detail
            if (
              firstFeedback.subcategories &&
              firstFeedback.subcategories.length > 0
            ) {
              console.log("🏷️ SUBCATEGORIES FOUND!");
              firstFeedback.subcategories.forEach((sub, index) => {
                console.log(`  Subcategory ${index + 1}:`, {
                  id: sub.id,
                  name: sub.name,
                  subcategory_name: sub.subcategory_name,
                  category_id: sub.category_id,
                  allKeys: Object.keys(sub),
                });
              });
            } else {
              console.log("❌ No subcategories found in first feedback item");
            }
          }
        }
      } catch (parseError) {
        console.error("❌ Failed to parse JSON response:", parseError.message);
      }
    } else {
      console.log(
        "⚠️ Response is not JSON, content-type:",
        response.headers.get("content-type"),
      );

      if (responseText.includes("<!DOCTYPE html>")) {
        console.log("🌐 Response appears to be HTML (possibly an error page)");
      }
    }
  } catch (error) {
    console.error("❌ API request failed:", {
      message: error.message,
      code: error.code,
      type: error.constructor.name,
    });

    if (error.code === "ECONNREFUSED") {
      console.error(
        "🔌 Connection refused - API server might be down or unreachable",
      );
      console.error("🔍 Check if the server at", BASE_URL, "is running");
    } else if (error.code === "ENOTFOUND") {
      console.error("🌐 DNS resolution failed - check the hostname/IP address");
    } else if (error.code === "ETIMEDOUT") {
      console.error(
        "⏰ Request timed out - server might be slow or unreachable",
      );
    }
  }

  console.log("");
  console.log("🔧 DEBUGGING SUGGESTIONS:");
  console.log("1. Verify the API server is running at", BASE_URL);
  console.log(
    "2. Check if you need authentication token (Authorization header)",
  );
  console.log("3. Verify the endpoint path is correct:", ENDPOINT);
  console.log("4. Check if the server accepts the request payload format");
  console.log("5. Look for CORS issues if running from browser");
}

// Run the test
testFeedbackAPI().catch(console.error);
