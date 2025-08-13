// ============================================================================
// NOTIFICATION API TEST UTILITIES
// Global functions available in browser console for testing notification APIs
// ============================================================================

const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL_API_SERVER_1 || "https://school-app.toyar.lk";

// Global logger for test results
const testLogger = {
  info: (message, data) => {
    console.log(`🧪 [NotificationAPITest] ${message}`, {
      timestamp: new Date().toISOString(),
      ...data,
    });
  },
  success: (message, data) => {
    console.log(`✅ [NotificationAPITest] ${message}`, {
      timestamp: new Date().toISOString(),
      ...data,
    });
  },
  error: (message, data) => {
    console.error(`❌ [NotificationAPITest] ${message}`, {
      timestamp: new Date().toISOString(),
      ...data,
    });
  },
  warn: (message, data) => {
    console.warn(`⚠️ [NotificationAPITest] ${message}`, {
      timestamp: new Date().toISOString(),
      ...data,
    });
  },
};

// Get current user token from Redux store
const getAuthToken = () => {
  try {
    // Try to get from Redux store if available
    if (window.__REDUX_STORE__) {
      return window.__REDUX_STORE__.getState().app.token;
    }
    
    // Fallback: try to get from AsyncStorage or other sources
    const stored = localStorage.getItem('persist:root');
    if (stored) {
      const parsed = JSON.parse(stored);
      const appState = JSON.parse(parsed.app || '{}');
      return appState.token;
    }
    
    return null;
  } catch (error) {
    testLogger.error("Failed to get auth token", { error });
    return null;
  }
};

// Get current user ID
const getUserId = () => {
  try {
    if (window.__REDUX_STORE__) {
      const user = window.__REDUX_STORE__.getState().app.user;
      return user?.id?.toString() || "43"; // Fallback to known user ID
    }
    return "43"; // Default fallback
  } catch (error) {
    testLogger.error("Failed to get user ID", { error });
    return "43";
  }
};

// Generic API test function
const testAPI = async (endpoint, method = 'GET', body = null, description = '') => {
  const token = getAuthToken();
  const fullUrl = `${BASE_URL}/api${endpoint}`;
  
  testLogger.info(`Testing ${method} ${endpoint}`, {
    description,
    fullUrl,
    hasToken: !!token,
    tokenPreview: token ? `${token.substring(0, 15)}...` : 'No token',
    body,
  });

  const startTime = Date.now();

  try {
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
      method,
      headers,
      credentials: 'include',
    };

    if (body && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
      config.body = JSON.stringify(body);
    }

    const response = await fetch(fullUrl, config);
    const duration = Date.now() - startTime;
    
    // Try to parse response as JSON
    let responseData;
    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      responseData = await response.json();
    } else {
      responseData = await response.text();
    }

    if (response.ok) {
      testLogger.success(`${method} ${endpoint} - SUCCESS`, {
        status: response.status,
        statusText: response.statusText,
        duration: `${duration}ms`,
        contentType,
        responseType: typeof responseData,
        responseStructure: typeof responseData === 'object' ? {
          success: responseData?.success,
          message: responseData?.message,
          hasData: !!responseData?.data,
          dataKeys: responseData?.data ? Object.keys(responseData.data).slice(0, 10) : [],
        } : null,
        fullResponse: responseData,
      });
    } else {
      testLogger.error(`${method} ${endpoint} - FAILED`, {
        status: response.status,
        statusText: response.statusText,
        duration: `${duration}ms`,
        contentType,
        errorResponse: responseData,
      });
    }

    return {
      success: response.ok,
      status: response.status,
      data: responseData,
      duration,
    };

  } catch (error) {
    const duration = Date.now() - startTime;
    testLogger.error(`${method} ${endpoint} - NETWORK ERROR`, {
      duration: `${duration}ms`,
      error: error.message,
      fullError: error,
    });

    return {
      success: false,
      error: error.message,
      duration,
    };
  }
};

// Specific test functions for each endpoint (using POST methods like educator-feedback-api.ts)
const testNotificationAPI = {
  // Test notification list endpoint - POST /api/communication-management/notifications/list
  async getNotifications(params = {}) {
    const userId = getUserId();
    const defaultParams = {
      page: 1,
      page_size: 20,
      search_phrase: "",
      search_filter_list: [],
      user_id: userId,
      filter: "all",
      priority: "",
      type_id: null, // Required: null for all types, or 1-8 for specific notification types
    };
    const body = { ...defaultParams, ...params };
    return await testAPI('/communication-management/notifications/list', 'POST', body, 'Get user notifications with required type_id parameter');
  },

  // Test notification stats endpoint - POST /api/communication-management/notifications/stats
  async getNotificationStats(filters = {}) {
    const userId = getUserId();
    const defaultFilters = {
      date_range: "all", // 'today', 'week', 'month', 'all'
      priority_filter: [], // array of 'normal', 'high', 'urgent'
      type_filter: [], // array of integers 1-8 from notification types
      include_read: true, // boolean
      include_archived: false, // boolean
    };
    const body = {
      user_id: userId,
      ...defaultFilters,
      ...filters,
    };
    return await testAPI('/communication-management/notifications/stats', 'POST', body, 'Get notification statistics with all required validation parameters');
  },

  // Test mark notification as read - POST /api/communication-management/notifications/mark-read
  async markAsRead(notificationId) {
    const userId = getUserId();
    const body = {
      user_id: userId,
      notification_id: parseInt(notificationId),
      mark_all: false,
    };
    return await testAPI('/communication-management/notifications/mark-read', 'POST', body, `Mark notification ${notificationId} as read with POST method`);
  },

  // Test delete notification - POST /api/communication-management/notifications/delete
  async deleteNotification(notificationId) {
    const userId = getUserId();
    const body = {
      user_id: userId,
      notification_id: parseInt(notificationId),
    };
    return await testAPI('/communication-management/notifications/delete', 'POST', body, `Delete notification ${notificationId} with POST method`);
  },

  // Test mark all notifications as read - POST /api/communication-management/notifications/mark-read
  async markAllAsRead() {
    const userId = getUserId();
    const body = {
      user_id: userId,
      mark_all: true,
    };
    return await testAPI('/communication-management/notifications/mark-read', 'POST', body, 'Mark all notifications as read with POST method');
  },

  // Test notification types endpoint - POST /api/communication-management/notification-types
  async getNotificationTypes() {
    const body = {
      page: 1,
      page_size: 20,
      search_phrase: "",
      search_filter_list: [],
    };
    return await testAPI('/communication-management/notification-types', 'POST', body, 'Get notification types with POST method');
  },

  // Test announcement categories endpoint - POST /api/communication-management/announcement-categories
  async getAnnouncementCategories() {
    const body = {
      page: 1,
      page_size: 20,
      search_phrase: "",
      search_filter_list: [],
    };
    return await testAPI('/communication-management/announcement-categories', 'POST', body, 'Get announcement categories with POST method');
  },

  // Test create notification - POST /api/communication-management/notifications/create
  async createNotification(notificationData = {}) {
    const defaultData = {
      notification_type_id: 1,
      title: "Test Notification",
      message: "This is a test notification from the API test utility",
      priority: "normal",
      target_type: "broadcast",
      user_id: getUserId(),
    };
    const body = { ...defaultData, ...notificationData };
    return await testAPI('/communication-management/notifications/create', 'POST', body, 'Create a test notification with POST method');
  },

  // Test specific notification types (1-8)
  async testNotificationTypes() {
    const notificationTypes = [
      { id: 1, name: 'System' },
      { id: 2, name: 'Announcement' },
      { id: 3, name: 'Academic' },
      { id: 4, name: 'Event' },
      { id: 5, name: 'Alert' },
      { id: 6, name: 'Attendance' },
      { id: 7, name: 'Financial' },
      { id: 8, name: 'Social' },
    ];

    testLogger.info("Testing notifications by type...");
    const results = {};

    for (const type of notificationTypes) {
      testLogger.info(`Testing notifications for type: ${type.name} (ID: ${type.id})`);
      results[`type_${type.id}`] = await this.getNotifications({ type_id: type.id });
    }

    return results;
  },

  // Test different filter combinations
  async testFilterCombinations() {
    testLogger.info("Testing different filter combinations...");
    
    const testCases = [
      {
        name: "All notifications",
        params: { type_id: null }
      },
      {
        name: "System notifications only",
        params: { type_id: 1 }
      },
      {
        name: "High priority only",
        params: { priority: "high" }
      },
      {
        name: "Urgent announcements",
        params: { type_id: 2, priority: "urgent" }
      },
    ];

    const results = {};
    for (const testCase of testCases) {
      testLogger.info(`Testing: ${testCase.name}`);
      results[testCase.name.replace(/\s+/g, '_').toLowerCase()] = await this.getNotifications(testCase.params);
    }

    return results;
  },

  // Test stats with different filters
  async testStatsFilters() {
    testLogger.info("Testing stats with different filters...");
    
    const testCases = [
      {
        name: "All stats",
        filters: {}
      },
      {
        name: "Today only",
        filters: { date_range: "today" }
      },
      {
        name: "High priority only",
        filters: { priority_filter: ["high", "urgent"] }
      },
      {
        name: "System notifications only",
        filters: { type_filter: [1] }
      },
      {
        name: "Unread only",
        filters: { include_read: false }
      },
    ];

    const results = {};
    for (const testCase of testCases) {
      testLogger.info(`Testing stats: ${testCase.name}`);
      results[testCase.name.replace(/\s+/g, '_').toLowerCase()] = await this.getNotificationStats(testCase.filters);
    }

    return results;
  },

  // Test all endpoints in sequence
  async testAll() {
    testLogger.info("Running comprehensive notification API test suite with POST methods");
    
    const results = {};
    
    testLogger.info("=== Testing Core POST Endpoints ===");
    results.stats = await this.getNotificationStats();
    results.notifications = await this.getNotifications();
    results.types = await this.getNotificationTypes();
    results.categories = await this.getAnnouncementCategories();
    
    testLogger.info("=== Testing Mutation POST Endpoints ===");
    // Test with sample notification ID if notifications exist
    if (results.notifications?.success && results.notifications?.data?.notifications?.length > 0) {
      const firstNotificationId = results.notifications.data.notifications[0].id;
      testLogger.info(`Testing actions with notification ID: ${firstNotificationId}`);
      
      // Test mark as read (only if notification is unread)
      const firstNotification = results.notifications.data.notifications[0];
      if (!firstNotification.is_read) {
        results.markAsRead = await this.markAsRead(firstNotificationId);
      }
      
      // Optionally test delete (uncomment if needed)
      // results.deleteNotification = await this.deleteNotification(firstNotificationId);
    }

    // Summary
    testLogger.info("=== API Test Summary ===");
    const summary = Object.entries(results).map(([endpoint, result]) => ({
      endpoint,
      status: result.success ? '✅ SUCCESS' : '❌ FAILED',
      httpStatus: result.status,
      duration: result.duration,
      method: 'POST', // All endpoints now use POST
    }));

    console.table(summary);
    
    const successCount = Object.values(results).filter(r => r.success).length;
    const totalCount = Object.keys(results).length;
    
    testLogger.info(`Test Results: ${successCount}/${totalCount} endpoints successful`, {
      successRate: `${Math.round((successCount / totalCount) * 100)}%`,
      details: summary,
      methodUsed: 'POST (like educator-feedback-api.ts)',
    });

    return results;
  },

  // Interactive test mode
  async interactive() {
    testLogger.info("Interactive mode - Available commands (all using POST method with validation parameters):");
    console.log("// Basic API calls:");
    console.log("testNotificationAPI.getNotifications() // POST with type_id parameter");
    console.log("testNotificationAPI.getNotificationStats() // POST with validation parameters");
    console.log("testNotificationAPI.getNotificationTypes() // POST communication-management/notification-types");
    console.log("testNotificationAPI.getAnnouncementCategories() // POST communication-management/announcement-categories");
    console.log("testNotificationAPI.markAsRead(notificationId) // POST communication-management/notifications/mark-read");
    console.log("testNotificationAPI.deleteNotification(notificationId) // POST communication-management/notifications/delete");
    console.log("testNotificationAPI.markAllAsRead() // POST communication-management/notifications/mark-read");
    console.log("testNotificationAPI.createNotification(data) // POST communication-management/notifications/create");
    console.log("");
    console.log("// Advanced testing:");
    console.log("testNotificationAPI.testNotificationTypes() // Test all 8 notification types");
    console.log("testNotificationAPI.testFilterCombinations() // Test different filter combinations");
    console.log("testNotificationAPI.testStatsFilters() // Test stats with different filters");
    console.log("testNotificationAPI.testAll() // Test all endpoints");
    console.log("");
    console.log("// Filter examples:");
    console.log("testNotificationAPI.getNotifications({type_id: 1}) // System notifications only");
    console.log("testNotificationAPI.getNotifications({priority: 'high'}) // High priority only");
    console.log("testNotificationAPI.getNotificationStats({date_range: 'today'}) // Today's stats only");
    
    // Show current user context and notification types
    testLogger.info("Current user context", {
      userId: getUserId(),
      hasToken: !!getAuthToken(),
      tokenPreview: getAuthToken() ? `${getAuthToken().substring(0, 15)}...` : 'No token',
      baseUrl: BASE_URL,
      apiPattern: 'POST method with validation parameters',
    });

    testLogger.info("Available notification types", {
      types: [
        "1: System", "2: Announcement", "3: Academic", "4: Event",
        "5: Alert", "6: Attendance", "7: Financial", "8: Social"
      ],
      priorities: ["normal", "high", "urgent"],
      dateRanges: ["today", "week", "month", "all"],
    });
  }
};

// Make functions globally available
if (typeof window !== 'undefined') {
  window.testNotificationAPI = testNotificationAPI;
  
  // Auto-run on load
  testLogger.info("🚀 Notification API Test Utilities Loaded!");
  testLogger.info("💡 Run testNotificationAPI.interactive() to see available commands");
  testLogger.info("🏃 Run testNotificationAPI.testAll() to test all endpoints");
}

export default testNotificationAPI;