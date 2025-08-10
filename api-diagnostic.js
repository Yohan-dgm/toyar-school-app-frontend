#!/usr/bin/env node

/**
 * API Diagnostic Tool for Toyar School App
 *
 * This script diagnoses API connectivity issues and provides detailed information
 * about what's happening with the API server at 172.20.10.3:9999
 *
 * Run with: node api-diagnostic.js
 */

const http = require("http");
const https = require("https");
const net = require("net");
const { URL } = require("url");

// Configuration from your app
const API_CONFIG = {
  host: "172.20.10.3",
  port: 9999,
  baseUrl: "http://172.20.10.3:9999",
  problematicEndpoint: "/api/student-management/student/get-student-list-data",
};

// Colors for console output
const colors = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
};

function colorLog(color, message) {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function printSection(title) {
  console.log("\n" + "=".repeat(60));
  colorLog("cyan", `${title}`);
  console.log("=".repeat(60));
}

function printResult(success, message) {
  const symbol = success ? "✓" : "✗";
  const color = success ? "green" : "red";
  colorLog(color, `${symbol} ${message}`);
}

// Test network connectivity
function testPortConnectivity() {
  return new Promise((resolve) => {
    printSection("1. Testing Port Connectivity");

    const socket = new net.Socket();
    const timeout = 5000;

    socket.setTimeout(timeout);

    socket.connect(API_CONFIG.port, API_CONFIG.host, () => {
      printResult(
        true,
        `Port ${API_CONFIG.port} is open on ${API_CONFIG.host}`,
      );
      socket.destroy();
      resolve(true);
    });

    socket.on("timeout", () => {
      printResult(
        false,
        `Connection to ${API_CONFIG.host}:${API_CONFIG.port} timed out`,
      );
      socket.destroy();
      resolve(false);
    });

    socket.on("error", (err) => {
      printResult(
        false,
        `Cannot connect to ${API_CONFIG.host}:${API_CONFIG.port} - ${err.message}`,
      );
      resolve(false);
    });
  });
}

// Make HTTP request and analyze response
function makeRequest(options, data = null) {
  return new Promise((resolve) => {
    const url = new URL(options.path, API_CONFIG.baseUrl);
    const requestOptions = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: options.method || "GET",
      headers: options.headers || {},
      timeout: 10000,
    };

    const req = http.request(requestOptions, (res) => {
      let body = "";

      res.on("data", (chunk) => {
        body += chunk.toString();
      });

      res.on("end", () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: body,
          success: true,
        });
      });
    });

    req.on("timeout", () => {
      req.destroy();
      resolve({
        error: "Request timeout",
        success: false,
      });
    });

    req.on("error", (err) => {
      resolve({
        error: err.message,
        success: false,
      });
    });

    if (data) {
      req.write(data);
    }

    req.end();
  });
}

// Test basic HTTP connectivity
async function testBasicHttp() {
  printSection("2. Testing Basic HTTP Connectivity");

  const result = await makeRequest({ path: "/" });

  if (!result.success) {
    printResult(false, `HTTP request failed: ${result.error}`);
    return false;
  }

  printResult(true, `Server responds with HTTP ${result.statusCode}`);

  console.log("\nResponse Headers:");
  Object.entries(result.headers).forEach(([key, value]) => {
    console.log(`  ${key}: ${value}`);
  });

  // Check if response is HTML (indicating a web server redirect)
  const isHtml =
    result.body.toLowerCase().includes("<html") ||
    result.body.toLowerCase().includes("<!doctype");

  if (isHtml) {
    printResult(
      false,
      "Server returns HTML instead of JSON - likely a redirect or wrong server!",
    );
    console.log("\nFirst 300 characters of response:");
    console.log(result.body.substring(0, 300) + "...");
  } else if (result.statusCode >= 300 && result.statusCode < 400) {
    printResult(false, `Server redirects (${result.statusCode})`);
    if (result.headers.location) {
      colorLog("yellow", `Redirect location: ${result.headers.location}`);
    }
  } else {
    printResult(true, "Server response appears to be non-HTML");
  }

  return !isHtml;
}

// Test the problematic endpoint
async function testProblematicEndpoint() {
  printSection("3. Testing Problematic Endpoint");

  const endpoint = API_CONFIG.problematicEndpoint;
  console.log(`Testing endpoint: ${API_CONFIG.baseUrl}${endpoint}`);

  // Test GET request
  console.log("\n--- GET Request ---");
  const getResult = await makeRequest({ path: endpoint });

  if (!getResult.success) {
    printResult(false, `GET request failed: ${getResult.error}`);
  } else {
    printResult(
      true,
      `GET request completed with status ${getResult.statusCode}`,
    );

    if (getResult.headers["content-type"]) {
      console.log(`Content-Type: ${getResult.headers["content-type"]}`);
    }

    // Show first part of response
    if (getResult.body) {
      console.log("\nResponse preview:");
      console.log(
        getResult.body.substring(0, 200) +
          (getResult.body.length > 200 ? "..." : ""),
      );
    }
  }

  // Test POST request (which the API expects)
  console.log("\n--- POST Request ---");
  const postResult = await makeRequest(
    {
      path: endpoint,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    },
    "{}",
  );

  if (!postResult.success) {
    printResult(false, `POST request failed: ${postResult.error}`);
  } else {
    printResult(
      true,
      `POST request completed with status ${postResult.statusCode}`,
    );

    if (postResult.headers["content-type"]) {
      console.log(`Content-Type: ${postResult.headers["content-type"]}`);
    }

    // Show first part of response
    if (postResult.body) {
      console.log("\nResponse preview:");
      console.log(
        postResult.body.substring(0, 200) +
          (postResult.body.length > 200 ? "..." : ""),
      );
    }
  }

  // Test with Authorization header
  console.log("\n--- POST Request with Authorization ---");
  const authResult = await makeRequest(
    {
      path: endpoint,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer test-token",
      },
    },
    "{}",
  );

  if (!authResult.success) {
    printResult(false, `Auth POST request failed: ${authResult.error}`);
  } else {
    printResult(
      true,
      `Auth POST request completed with status ${authResult.statusCode}`,
    );

    if (authResult.body) {
      console.log("\nResponse preview:");
      console.log(
        authResult.body.substring(0, 200) +
          (authResult.body.length > 200 ? "..." : ""),
      );
    }
  }
}

// Test common API endpoints
async function testCommonEndpoints() {
  printSection("4. Testing Common API Endpoints");

  const endpoints = [
    "/api",
    "/api/health",
    "/api/status",
    "/health",
    "/status",
    "/api/student-management",
    "/student-management",
  ];

  for (const endpoint of endpoints) {
    const result = await makeRequest({ path: endpoint });

    if (!result.success) {
      colorLog("red", `✗ ${endpoint} - ${result.error}`);
    } else {
      const status = result.statusCode;
      if (status === 200) {
        colorLog("green", `✓ ${endpoint} - HTTP ${status}`);
      } else if (status === 404) {
        colorLog("yellow", `? ${endpoint} - HTTP ${status} (Not Found)`);
      } else {
        colorLog("red", `✗ ${endpoint} - HTTP ${status}`);
      }
    }
  }
}

// Generate troubleshooting recommendations
function generateRecommendations() {
  printSection("5. Troubleshooting Recommendations");

  console.log(
    colors.yellow +
      "Based on the diagnostic results, here are recommended actions:" +
      colors.reset,
  );
  console.log("");

  console.log(
    colors.blue + "If server returns HTML instead of JSON:" + colors.reset,
  );
  console.log(
    "1. Check if a web server (Apache/Nginx) is running instead of your API",
  );
  console.log(
    "2. Verify your API application is actually running on port 9999",
  );
  console.log("3. Check for URL rewrites or proxy configurations");
  console.log("4. Ensure API routes are properly registered");

  console.log("\n" + colors.blue + "If connection fails:" + colors.reset);
  console.log("1. Check if the API server is running");
  console.log("2. Verify firewall settings");
  console.log("3. Confirm the IP address and port are correct");

  console.log(
    "\n" + colors.blue + "Commands to run on the API server:" + colors.reset,
  );
  console.log("1. Check processes: ps aux | grep node (or your API process)");
  console.log("2. Check port usage: netstat -tulpn | grep :9999");
  console.log(
    "3. Check API logs: pm2 logs (if using PM2) or check your log files",
  );
  console.log(
    "4. Test locally on server: curl http://localhost:9999/api/health",
  );

  console.log(
    "\n" + colors.blue + "Manual curl commands to test:" + colors.reset,
  );
  console.log(`curl -v "${API_CONFIG.baseUrl}"`);
  console.log(
    `curl -X POST -H "Content-Type: application/json" -d '{}' "${API_CONFIG.baseUrl}${API_CONFIG.problematicEndpoint}"`,
  );
}

// Main diagnostic function
async function runDiagnostics() {
  console.log(
    colors.blue +
      "╔══════════════════════════════════════════════════════════════╗",
  );
  console.log(
    "║            Toyar School App - API Diagnostics               ║",
  );
  console.log(
    "╚══════════════════════════════════════════════════════════════╝" +
      colors.reset,
  );

  console.log(`\nTesting API server: ${API_CONFIG.baseUrl}`);
  console.log(`Problematic endpoint: ${API_CONFIG.problematicEndpoint}`);
  console.log(`Current time: ${new Date().toISOString()}`);

  try {
    // Run all diagnostic tests
    await testPortConnectivity();
    await testBasicHttp();
    await testProblematicEndpoint();
    await testCommonEndpoints();
    generateRecommendations();

    console.log("\n" + colors.green + "Diagnostic complete!" + colors.reset);
    console.log(
      colors.yellow +
        "Share these results with your backend team for faster troubleshooting." +
        colors.reset,
    );
  } catch (error) {
    colorLog("red", `Diagnostic failed: ${error.message}`);
    process.exit(1);
  }
}

// Run diagnostics if this script is executed directly
if (require.main === module) {
  runDiagnostics();
}

module.exports = { runDiagnostics, API_CONFIG };
