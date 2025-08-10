#!/bin/bash

# Network Diagnostic Script for Toyar School App API Server
# Created to troubleshoot API connectivity issues
# Error context: Server returns HTML redirect instead of JSON from endpoint

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
API_SERVER="172.20.10.3"
API_PORT="9999"
BASE_URL="http://${API_SERVER}:${API_PORT}"
STUDENT_ENDPOINT="/api/student-management/student/get-student-list-data"

echo -e "${BLUE}╔══════════════════════════════════════════════════════════════╗"
echo -e "║               Toyar School App - Network Diagnostics        ║"
echo -e "╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Function to print section headers
print_section() {
    echo -e "\n${YELLOW}═══ $1 ═══${NC}"
}

# Function to print test results
print_result() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✓ $2${NC}"
    else
        echo -e "${RED}✗ $2${NC}"
    fi
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check required tools
print_section "Checking Required Tools"
for tool in curl nc nmap telnet dig; do
    if command_exists "$tool"; then
        echo -e "${GREEN}✓ $tool is available${NC}"
    else
        echo -e "${RED}✗ $tool is not available${NC}"
        echo -e "  Install with: brew install $tool (macOS) or apt-get install $tool (Linux)"
    fi
done

# 1. Basic Network Connectivity Tests
print_section "1. Basic Network Connectivity"

echo "Testing ping to server..."
if ping -c 3 "$API_SERVER" >/dev/null 2>&1; then
    print_result 0 "Server $API_SERVER is reachable via ping"
else
    print_result 1 "Server $API_SERVER is NOT reachable via ping"
fi

echo "Testing port connectivity..."
if nc -z -w5 "$API_SERVER" "$API_PORT" 2>/dev/null; then
    print_result 0 "Port $API_PORT is open on $API_SERVER"
else
    print_result 1 "Port $API_PORT is NOT open on $API_SERVER"
fi

# 2. DNS Resolution
print_section "2. DNS Resolution"
echo "Resolving $API_SERVER..."
if command_exists dig; then
    dig +short "$API_SERVER" || echo "No DNS resolution (using IP directly)"
else
    nslookup "$API_SERVER" || echo "No DNS resolution (using IP directly)"
fi

# 3. Port Scanning
print_section "3. Port Scanning"
if command_exists nmap; then
    echo "Scanning common ports on $API_SERVER..."
    nmap -p 80,443,3000,8000,8080,9999 "$API_SERVER" 2>/dev/null || echo "nmap scan failed"
else
    echo "nmap not available, skipping port scan"
fi

# 4. HTTP Server Analysis
print_section "4. HTTP Server Analysis"

echo "Testing basic HTTP connection to $BASE_URL..."
HTTP_RESPONSE=$(curl -s -I -w "%{http_code}" -o /dev/null "$BASE_URL" 2>/dev/null || echo "000")
echo "HTTP Response Code: $HTTP_RESPONSE"

if [ "$HTTP_RESPONSE" = "200" ]; then
    print_result 0 "Server responds with HTTP 200"
elif [ "$HTTP_RESPONSE" = "301" ] || [ "$HTTP_RESPONSE" = "302" ]; then
    print_result 1 "Server redirects (HTTP $HTTP_RESPONSE) - this might be the issue!"
    echo "Getting redirect location..."
    REDIRECT_LOCATION=$(curl -s -I "$BASE_URL" | grep -i "location:" | cut -d' ' -f2- | tr -d '\r')
    echo "Redirect location: $REDIRECT_LOCATION"
elif [ "$HTTP_RESPONSE" = "000" ]; then
    print_result 1 "No HTTP response (connection failed)"
else
    print_result 1 "Unexpected HTTP response: $HTTP_RESPONSE"
fi

# 5. Server Response Analysis
print_section "5. Server Response Analysis"

echo "Getting full response from root endpoint..."
echo "Response Headers:"
curl -s -I "$BASE_URL" 2>/dev/null || echo "Failed to get headers"

echo -e "\nResponse Body (first 500 characters):"
BODY_RESPONSE=$(curl -s "$BASE_URL" 2>/dev/null | head -c 500 || echo "Failed to get body")
echo "$BODY_RESPONSE"

if echo "$BODY_RESPONSE" | grep -qi "html"; then
    print_result 1 "Server returns HTML instead of JSON (this is likely the problem!)"
else
    print_result 0 "Server response appears to be non-HTML"
fi

# 6. API Endpoint Testing
print_section "6. API Endpoint Testing"

FULL_ENDPOINT="${BASE_URL}${STUDENT_ENDPOINT}"
echo "Testing problematic endpoint: $FULL_ENDPOINT"

# Test GET request
echo -e "\n--- GET Request Test ---"
GET_RESPONSE=$(curl -s -w "HTTP_CODE:%{http_code}\nREDIRECT_URL:%{redirect_url}\nCONTENT_TYPE:%{content_type}\n" "$FULL_ENDPOINT" 2>/dev/null || echo "GET request failed")
echo "$GET_RESPONSE"

# Test POST request (as the API expects POST)
echo -e "\n--- POST Request Test ---"
POST_RESPONSE=$(curl -s -X POST -H "Content-Type: application/json" -w "HTTP_CODE:%{http_code}\nREDIRECT_URL:%{redirect_url}\nCONTENT_TYPE:%{content_type}\n" "$FULL_ENDPOINT" 2>/dev/null || echo "POST request failed")
echo "$POST_RESPONSE"

# Test with Authorization header
echo -e "\n--- POST Request with Auth Header Test ---"
AUTH_RESPONSE=$(curl -s -X POST -H "Content-Type: application/json" -H "Authorization: Bearer test-token" -w "HTTP_CODE:%{http_code}\nREDIRECT_URL:%{redirect_url}\nCONTENT_TYPE:%{content_type}\n" "$FULL_ENDPOINT" 2>/dev/null || echo "Auth POST request failed")
echo "$AUTH_RESPONSE"

# 7. Alternative Endpoints Testing
print_section "7. Alternative Endpoints Testing"

COMMON_ENDPOINTS=(
    "/api"
    "/api/health"
    "/api/status"
    "/health"
    "/status"
    "/api/student-management"
    "/student-management"
)

for endpoint in "${COMMON_ENDPOINTS[@]}"; do
    echo "Testing $endpoint..."
    RESP_CODE=$(curl -s -w "%{http_code}" -o /dev/null "${BASE_URL}${endpoint}" 2>/dev/null || echo "000")
    if [ "$RESP_CODE" = "200" ]; then
        echo -e "${GREEN}✓ $endpoint responds with 200${NC}"
    elif [ "$RESP_CODE" = "404" ]; then
        echo -e "${YELLOW}? $endpoint returns 404 (not found)${NC}"
    else
        echo -e "${RED}✗ $endpoint returns $RESP_CODE${NC}"
    fi
done

# 8. Process and Service Detection
print_section "8. Process and Service Detection"

echo "Checking what's running on port $API_PORT..."
if command_exists lsof; then
    echo "Local processes on port $API_PORT:"
    lsof -i :$API_PORT 2>/dev/null || echo "No local processes found on port $API_PORT"
fi

if command_exists netstat; then
    echo "Network connections:"
    netstat -tulpn 2>/dev/null | grep ":$API_PORT" || echo "No network connections found for port $API_PORT"
fi

# 9. Troubleshooting Recommendations
print_section "9. Troubleshooting Recommendations"

echo -e "${YELLOW}Based on the diagnostic results, here are recommended actions:${NC}"
echo ""

echo -e "${BLUE}If server returns HTML instead of JSON:${NC}"
echo "1. Check if the server is running a web server (Apache/Nginx) that's redirecting"
echo "2. Verify the API application is running on port $API_PORT"
echo "3. Check server configuration for URL rewrites or redirects"
echo "4. Ensure the API routes are properly configured"

echo -e "\n${BLUE}If port is not accessible:${NC}"
echo "1. Check firewall settings on the server"
echo "2. Verify the API service is actually running"
echo "3. Check if the port is correct in your configuration"

echo -e "\n${BLUE}If getting redirects:${NC}"
echo "1. Check if HTTPS is required"
echo "2. Verify the correct protocol (http vs https)"
echo "3. Check for trailing slash requirements"

echo -e "\n${BLUE}Server-side commands to run:${NC}"
echo "1. Check running processes: ps aux | grep -i api"
echo "2. Check port usage: netstat -tulpn | grep :$API_PORT"
echo "3. Check API logs: tail -f /var/log/api.log (adjust path as needed)"
echo "4. Restart API service: systemctl restart your-api-service"

# 10. Generate curl commands for manual testing
print_section "10. Manual Testing Commands"

echo -e "${YELLOW}Copy and run these commands for manual testing:${NC}"
echo ""

echo "# Test basic connectivity:"
echo "curl -v '$BASE_URL'"
echo ""

echo "# Test the problematic endpoint (GET):"
echo "curl -v '$FULL_ENDPOINT'"
echo ""

echo "# Test the problematic endpoint (POST with JSON):"
echo "curl -X POST -H 'Content-Type: application/json' -v '$FULL_ENDPOINT'"
echo ""

echo "# Test with authorization header:"
echo "curl -X POST -H 'Content-Type: application/json' -H 'Authorization: Bearer YOUR_TOKEN' -v '$FULL_ENDPOINT'"
echo ""

echo "# Test with data payload:"
echo "curl -X POST -H 'Content-Type: application/json' -d '{}' -v '$FULL_ENDPOINT'"
echo ""

echo "# Check server response headers:"
echo "curl -I '$BASE_URL'"
echo ""

echo -e "\n${GREEN}Diagnostic complete! Check the results above for issues.${NC}"
echo -e "${YELLOW}Save this output and share with your backend team for faster troubleshooting.${NC}"