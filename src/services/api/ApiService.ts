import {
  createApi,
  fetchBaseQuery,
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import type { RootState } from "../../state-store/store";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Base API configuration
const BASE_URL =
  process.env.EXPO_PUBLIC_BASE_URL_API_SERVER_1 || "http://localhost:3000/api";

// Custom base query with enhanced error handling and token management
const baseQueryWithAuth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const baseQuery = fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: async (headers, { getState }) => {
      // Get token from Redux state
      const state = getState() as RootState;
      const token = state.app.token;

      // Set common headers
      headers.set("Content-Type", "application/json");
      headers.set("Accept", "application/json");
      headers.set("credentials", "include");

      // Add authorization header if token exists
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
        console.log("🔐 API Request - Token added to headers");
      } else {
        console.warn("⚠️ API Request - No token available");
      }

      // Add device info headers
      headers.set("X-App-Platform", "mobile");
      headers.set("X-App-Version", "1.0.0");

      return headers;
    },
  });

  // Execute the base query
  let result = await baseQuery(args, api, extraOptions);

  // Handle token refresh if needed
  if (result.error && result.error.status === 401) {
    console.log("🔄 API Service - Token expired, attempting refresh...");

    // Try to refresh token
    const refreshResult = await refreshAuthToken(api);

    if (refreshResult.success) {
      console.log(
        "✅ API Service - Token refreshed successfully, retrying request",
      );
      // Retry the original request with new token
      result = await baseQuery(args, api, extraOptions);
    } else {
      console.log(
        "❌ API Service - Token refresh failed, redirecting to login",
      );
      // Handle logout logic here
      // You might want to dispatch a logout action
    }
  }

  // Log API requests in development
  if (__DEV__) {
    console.log("📡 API Request:", {
      url: typeof args === "string" ? args : args.url,
      method: typeof args === "string" ? "GET" : args.method || "GET",
      status: result.error?.status || "success",
    });
  }

  return result;
};

// Token refresh logic
const refreshAuthToken = async (
  api: any,
): Promise<{ success: boolean; token?: string }> => {
  try {
    const refreshToken = await AsyncStorage.getItem("refresh_token");

    if (!refreshToken) {
      return { success: false };
    }

    const refreshQuery = fetchBaseQuery({
      baseUrl: BASE_URL,
    });

    const refreshResult = await refreshQuery(
      {
        url: "/auth/refresh",
        method: "POST",
        body: { refresh_token: refreshToken },
      },
      api,
      {},
    );

    if (refreshResult.data && (refreshResult.data as any).access_token) {
      const newToken = (refreshResult.data as any).access_token;
      const newRefreshToken = (refreshResult.data as any).refresh_token;

      // Store new tokens
      await AsyncStorage.setItem("access_token", newToken);
      if (newRefreshToken) {
        await AsyncStorage.setItem("refresh_token", newRefreshToken);
      }

      // Update Redux state
      // api.dispatch(setToken(newToken));

      return { success: true, token: newToken };
    }

    return { success: false };
  } catch (error) {
    console.error("❌ Token refresh error:", error);
    return { success: false };
  }
};

// Enhanced API service with comprehensive error handling
export const apiService = createApi({
  reducerPath: "apiService",
  baseQuery: baseQueryWithAuth,
  tagTypes: [
    "User",
    "Student",
    "Teachers",
    "Notification",
    "Calendar",
    "Attendance",
    "Grade",
    "Payment",
    "Announcement",
    "Activity",
    "Message",
  ],
  endpoints: () => ({}),
});

// Common API response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    hasMore?: boolean;
  };
}

export interface PaginatedResponse<T = any> extends ApiResponse<T[]> {
  meta: {
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
    totalPages: number;
  };
}

// Common query parameters
export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  order?: "asc" | "desc";
}

export interface FilterParams extends PaginationParams {
  startDate?: string;
  endDate?: string;
  category?: string;
  status?: string;
  userCategory?: number;
  studentId?: string;
}

// API endpoint builders
export const createEndpoint = {
  // Query endpoint for GET requests
  query: <T, P = void>(config: {
    url: string | ((params: P) => string);
    tags?: string[] | ((params: P, result: T) => string[]);
    transformResponse?: (response: any) => T;
  }) => ({
    query: (params: P) => ({
      url: typeof config.url === "function" ? config.url(params) : config.url,
      method: "GET" as const,
    }),
    providesTags: config.tags,
    transformResponse: config.transformResponse,
  }),

  // Mutation endpoint for POST/PUT/DELETE requests
  mutation: <T, P = void>(config: {
    url: string | ((params: P) => string);
    method?: "POST" | "PUT" | "PATCH" | "DELETE";
    tags?: string[] | ((params: P, result: T) => string[]);
    transformResponse?: (response: any) => T;
  }) => ({
    query: (params: P) => ({
      url: typeof config.url === "function" ? config.url(params) : config.url,
      method: config.method || "POST",
      body: params,
    }),
    invalidatesTags: config.tags,
    transformResponse: config.transformResponse,
  }),
};

// Utility functions for API calls
export const apiUtils = {
  // Build query string from params
  buildQueryString: (params: Record<string, any>): string => {
    const filtered = Object.entries(params).filter(
      ([_, value]) => value !== undefined && value !== null && value !== "",
    );

    if (filtered.length === 0) return "";

    const query = new URLSearchParams();
    filtered.forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((v) => query.append(key, v.toString()));
      } else {
        query.append(key, value.toString());
      }
    });

    return `?${query.toString()}`;
  },

  // Handle API errors consistently
  handleApiError: (error: any): string => {
    if (error.status === "FETCH_ERROR") {
      return "Network error. Please check your connection.";
    }

    if (error.status === 401) {
      return "Authentication failed. Please log in again.";
    }

    if (error.status === 403) {
      return "You do not have permission to perform this action.";
    }

    if (error.status === 404) {
      return "The requested resource was not found.";
    }

    if (error.status === 422) {
      const validationErrors = error.data?.errors;
      if (validationErrors) {
        return Object.values(validationErrors).flat().join(", ");
      }
      return "Validation error occurred.";
    }

    if (error.status >= 500) {
      return "Server error. Please try again later.";
    }

    return error.data?.message || "An unexpected error occurred.";
  },

  // Transform pagination metadata
  transformPagination: (response: any): PaginatedResponse["meta"] => ({
    total: response.total || 0,
    page: response.current_page || response.page || 1,
    limit: response.per_page || response.limit || 10,
    hasMore: response.has_more_pages || response.hasMore || false,
    totalPages: response.last_page || response.totalPages || 1,
  }),
};

export default apiService;
