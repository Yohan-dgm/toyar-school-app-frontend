// Direct API test for educator feedback management
const https = require("https");
const http = require("http");

// Load environment variables
require("dotenv").config();

const testFeedbackAPI = async () => {
  console.log("🧪 DIRECT API TEST - Starting...");
  console.log("📅 Timestamp:", new Date().toISOString());

  const baseUrl = process.env.EXPO_PUBLIC_BASE_URL_API_SERVER_1;
  console.log("🔧 Base URL:", baseUrl);

  if (!baseUrl) {
    console.error("❌ EXPO_PUBLIC_BASE_URL_API_SERVER_1 is not set!");
    return;
  }

  const endpoint = "/api/educator-feedback-management/feedback/list";
  const fullUrl = `${baseUrl}${endpoint}`;

  console.log("🎯 Testing endpoint:", fullUrl);

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
      "Content-Length": Buffer.byteLength(requestBody),
      // Note: This won't include the actual auth token
      // You would need to add: 'Authorization': 'Bearer YOUR_TOKEN_HERE'
    },
  };

  console.log("📤 Request options:", {
    hostname: options.hostname,
    port: options.port,
    path: options.path,
    method: options.method,
    headers: options.headers,
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
        console.log("✅ Valid JSON response:", jsonData);
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

// Also test basic connectivity
const testBasicConnectivity = async () => {
  console.log("\n🌐 BASIC CONNECTIVITY TEST - Starting...");

  const baseUrl = process.env.EXPO_PUBLIC_BASE_URL_API_SERVER_1;
  if (!baseUrl) {
    console.error("❌ Base URL not set");
    return;
  }

  const urlObj = new URL(baseUrl);
  const isHttps = urlObj.protocol === "https:";
  const client = isHttps ? https : http;

  const options = {
    hostname: urlObj.hostname,
    port: urlObj.port || (isHttps ? 443 : 80),
    path: "/",
    method: "GET",
    timeout: 5000,
  };

  console.log(
    "🧪 Testing basic connectivity to:",
    `${urlObj.protocol}//${urlObj.hostname}:${options.port}`,
  );

  const req = client.request(options, (res) => {
    console.log("✅ Server is reachable");
    console.log("📊 Status:", res.statusCode);
    console.log("📊 Headers:", res.headers);

    let data = "";
    res.on("data", (chunk) => {
      data += chunk;
    });

    res.on("end", () => {
      console.log("📊 Response length:", data.length);
      if (data.includes("<!DOCTYPE html>")) {
        console.log("🌐 Server returned HTML page");
      }
    });
  });

  req.on("error", (error) => {
    console.error("❌ Basic connectivity failed:", error.message);
  });

  req.on("timeout", () => {
    console.error("❌ Basic connectivity timed out");
    req.destroy();
  });

  req.setTimeout(5000);
  req.end();
};

// Run tests
console.log("🚀 Starting API diagnostics...\n");

testBasicConnectivity();

setTimeout(() => {
  testFeedbackAPI();
}, 2000);

setTimeout(() => {
  console.log("\n✅ API diagnostics completed");
  process.exit(0);
}, 10000);
