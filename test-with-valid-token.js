// Test script to validate API calls with a valid token
// Run this script after getting a valid token from the app logs
const https = require("https");
const http = require("http");

// Load environment variables
require("dotenv").config();

// You need to replace this with a valid token from your app logs
const VALID_TOKEN = "REPLACE_WITH_ACTUAL_TOKEN_FROM_APP_LOGS";

const testWithValidToken = async () => {
  console.log("🧪 TESTING WITH VALID TOKEN - Starting...");
  console.log("📅 Timestamp:", new Date().toISOString());

  const baseUrl = process.env.EXPO_PUBLIC_BASE_URL_API_SERVER_1;
  console.log("🔧 Base URL:", baseUrl);

  if (!baseUrl) {
    console.error("❌ EXPO_PUBLIC_BASE_URL_API_SERVER_1 is not set!");
    return;
  }

  if (VALID_TOKEN === "REPLACE_WITH_ACTUAL_TOKEN_FROM_APP_LOGS") {
    console.error(
      "❌ Please replace VALID_TOKEN with an actual token from your app logs",
    );
    console.log("📋 To get a valid token:");
    console.log("   1. Open your React Native app");
    console.log(
      '   2. Look at the console logs for "Authorization header set successfully"',
    );
    console.log("   3. Copy the token from the logs");
    console.log("   4. Replace the VALID_TOKEN constant in this script");
    return;
  }

  const endpoint = "/api/educator-feedback-management/feedback/list";
  const fullUrl = `${baseUrl}${endpoint}`;

  console.log("🎯 Testing endpoint:", fullUrl);
  console.log("🔑 Using token:", `${VALID_TOKEN.substring(0, 20)}...`);

  const requestBody = JSON.stringify({
    page_size: 10,
    page: 1,
    search_phrase: "",
    search_filter_list: [],
  });

  const urlObj = new URL(fullUrl);
  const isHttps = urlObj.protocol === "https:";
  const client = isHttps ? https : http;

  const options = {
    hostname: urlObj.hostname,
    port: urlObj.port || (isHttps ? 443 : 80),
    path: urlObj.pathname,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-Requested-With": "XMLHttpRequest",
      Authorization: `Bearer ${VALID_TOKEN}`,
      "Content-Length": Buffer.byteLength(requestBody),
    },
  };

  console.log("📤 Request options:", {
    hostname: options.hostname,
    port: options.port,
    path: options.path,
    method: options.method,
    headers: {
      ...options.headers,
      Authorization: "Bearer [REDACTED]",
    },
  });

  console.log("📦 Request body:", requestBody);

  const req = client.request(options, (res) => {
    console.log("📥 Response status:", res.statusCode);
    console.log("📥 Response headers:", res.headers);

    let data = "";

    res.on("data", (chunk) => {
      data += chunk;
    });

    res.on("end", () => {
      console.log("📥 Response body length:", data.length);
      console.log("📥 Response body preview:", data.substring(0, 500));

      try {
        const jsonData = JSON.parse(data);
        console.log("✅ Valid JSON response received");
        console.log("📊 Response structure:", {
          hasSuccess: !!jsonData.success,
          hasStatus: !!jsonData.status,
          hasData: !!jsonData.data,
          dataType: jsonData.data ? typeof jsonData.data : null,
          isDataArray: Array.isArray(jsonData.data),
          dataLength: Array.isArray(jsonData.data)
            ? jsonData.data.length
            : "Not array",
        });

        if (jsonData.success === true) {
          console.log("🎉 SUCCESS! API returned success: true");
          if (Array.isArray(jsonData.data)) {
            console.log(`📋 Found ${jsonData.data.length} feedback items`);
            if (jsonData.data.length > 0) {
              console.log(
                "📝 First feedback item structure:",
                Object.keys(jsonData.data[0]),
              );
            }
          }
        } else if (jsonData.status === "authentication-required") {
          console.log("❌ Token is invalid or expired");
        } else {
          console.log("⚠️ Unexpected response format");
        }
      } catch (parseError) {
        console.log("⚠️ Response is not valid JSON");
        if (data.includes("<!DOCTYPE html>")) {
          console.log("🌐 Response appears to be HTML (possibly error page)");
        }
      }
    });
  });

  req.on("error", (error) => {
    console.error("❌ Request failed:", error.message);
    console.error("❌ Error details:", error);
  });

  req.on("timeout", () => {
    console.error("❌ Request timed out");
    req.destroy();
  });

  // Set timeout
  req.setTimeout(10000);

  // Send the request
  req.write(requestBody);
  req.end();
};

// Run the test
console.log("🚀 Starting authenticated API test...\n");
testWithValidToken();

setTimeout(() => {
  console.log("\n✅ Test completed");
  process.exit(0);
}, 15000);
