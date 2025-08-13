import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
export const apiServer1 = createApi({
  reducerPath: "apiServer1",
  tagTypes: [
    "Students",
    "Teachers",
    "Posts",
    "ActivityFeed",
    "Calendar",
    "UserManagement",
    "EducatorFeedback",
    "Attendance",
    "StudentAttendance",
    "StudentAttendanceAggregated",
    "Auth",
    "News",
    "NewsCategories",
    "Notifications",
    "Messages",
    "NotificationPreferences",
    "NotificationTypes",
    "NotificationStats",
    "Announcements",
    "AnnouncementCategories",
  ],
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.EXPO_PUBLIC_BASE_URL_API_SERVER_1,
    prepareHeaders: (headers, api: any) => {
      const token = api.getState().app.token;
      const isAuthenticated = api.getState().app.isAuthenticated;

      console.log("🔐 API Server 1 - Authentication check:", {
        tokenExists: !!token,
        tokenLength: token ? token.length : 0,
        tokenPreview: token ? `${token.substring(0, 15)}...` : "No token",
        isAuthenticated: isAuthenticated,
        endpoint: api.endpoint,
        method: api.type,
      });

      // Set required headers as per API instructions
      headers.set("X-Requested-With", "XMLHttpRequest");
      headers.set("Content-Type", "application/json");
      headers.set("Accept", "application/json");

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
        console.log("✅ API Server 1 - Authorization header set successfully");
      } else {
        console.warn(
          "⚠️ API Server 1 - No authentication token found, request may fail",
        );
      }

      headers.set("credentials", "include");

      console.log("📤 API Server 1 - Final headers:", {
        "X-Requested-With": "XMLHttpRequest",
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: token ? "Bearer [REDACTED]" : "None",
        credentials: "include",
      });

      return headers;
    },
    // prepareHeaders: async (headers) => {
    //   // const user = await AsyncStorageService.getStoredData();
    //   // const hasUser = !!user && !!user!.userToken;

    //   // if (hasUser) {
    //   //   headers.set("Authorization", `Token ${user.userToken}`);
    //   // }

    //   // headers.set("Content-Type", "application/json");

    //   // return headers;
    // },
  }),
  endpoints: () => ({}),
});
