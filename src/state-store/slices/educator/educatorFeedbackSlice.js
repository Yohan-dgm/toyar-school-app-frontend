import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async thunks for API calls
export const fetchEducatorFeedbacks = createAsyncThunk(
  "educatorFeedback/fetchFeedbacks",
  async (params, { rejectWithValue }) => {
    try {
      // TODO: Implement actual API call
      // const response = await api.get("/api/educator/feedbacks", { params });
      // return response.data;

      // Mock data for now with new intelligence categories
      return {
        feedbacks: [
          {
            id: 1,
            student_id: 1,
            student_name: "Sayon Thevsas",
            rating: 5,
            categories: ["mathematical_logical", "attendance_punctuality"],
            comment:
              "Demonstrates strong understanding and confidence in Mathematics. Shows excellent attendance and punctuality.",
            status: "approved",
            created_at: "2025-01-15T10:30:00Z",
          },
          {
            id: 2,
            student_id: 2,
            student_name: "Ayaan Nimneth",
            rating: 5,
            categories: [
              "intrapersonal",
              "interpersonal",
              "music",
              "bodily_kinesthetic",
              "attendance_punctuality",
            ],
            comment:
              "Dress code and personal cleanliness are maintained well. Shows excellent observation and analytical skills.",
            status: "approved",
            created_at: "2025-01-14T14:20:00Z",
          },
        ],
        total: 2,
      };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const submitEducatorFeedback = createAsyncThunk(
  "educatorFeedback/submitFeedback",
  async (feedbackData, { rejectWithValue }) => {
    try {
      // TODO: Implement actual API call
      // const response = await api.post("/api/educator/feedbacks", feedbackData);
      // return response.data;

      // Mock network delay to simulate real API behavior
      await new Promise((resolve) =>
        setTimeout(resolve, 1000 + Math.random() * 2000),
      );

      // Simulate occasional network errors for testing
      if (Math.random() < 0.1) {
        // 10% chance of network error
        const error = new Error("Network request failed");
        error.code = "NETWORK_ERROR";
        throw error;
      }

      // Simulate timeout errors occasionally
      if (Math.random() < 0.05) {
        // 5% chance of timeout
        const error = new Error("Request timeout");
        error.code = "TIMEOUT";
        throw error;
      }

      // Mock successful response
      return {
        id: Date.now(),
        ...feedbackData,
        status: "pending",
        created_at: new Date().toISOString(),
      };
    } catch (error) {
      // Enhanced error handling with network error classification
      const errorMessage = error.message || "Unknown error occurred";
      const errorCode = error.code || "UNKNOWN_ERROR";

      // Classify error types for better handling
      const networkErrors = ["NETWORK_ERROR", "TIMEOUT", "CONNECTION_FAILED"];
      const isNetworkError =
        networkErrors.includes(errorCode) ||
        errorMessage.toLowerCase().includes("network") ||
        errorMessage.toLowerCase().includes("timeout") ||
        errorMessage.toLowerCase().includes("connection");

      return rejectWithValue({
        message: errorMessage,
        code: errorCode,
        isNetworkError,
        timestamp: new Date().toISOString(),
        ...(error.response?.data || {}),
      });
    }
  },
);

export const updateEducatorFeedback = createAsyncThunk(
  "educatorFeedback/updateFeedback",
  async ({ id, updates }, { rejectWithValue }) => {
    try {
      // TODO: Implement actual API call
      // const response = await api.put(`/api/educator/feedbacks/${id}`, updates);
      // return response.data;

      // Mock response
      return { id, ...updates };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const deleteEducatorFeedback = createAsyncThunk(
  "educatorFeedback/deleteFeedback",
  async (feedbackId, { rejectWithValue }) => {
    try {
      // TODO: Implement actual API call
      // await api.delete(`/api/educator/feedbacks/${feedbackId}`);
      return feedbackId;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

const initialState = {
  feedbacks: [],
  loading: false,
  error: null,
  submitting: false,
  submitError: null,
  pagination: {
    page: 1,
    pageSize: 10,
    total: 0,
    hasMore: true,
  },
  filters: {
    student_id: null,
    status: "all", // all, pending, approved, rejected
    category: "all", // all, mathematical_logical, linguistic, interpersonal, intrapersonal, music, bodily_kinesthetic, attendance_punctuality
    date_range: null,
  },
};

const educatorFeedbackSlice = createSlice({
  name: "educatorFeedback",
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      state.pagination.page = 1; // Reset to first page when filters change
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
      state.pagination.page = 1;
    },
    setPage: (state, action) => {
      state.pagination.page = action.payload;
    },
    clearError: (state) => {
      state.error = null;
      state.submitError = null;
    },
    clearFeedbacks: (state) => {
      state.feedbacks = [];
      state.pagination = initialState.pagination;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch feedbacks
      .addCase(fetchEducatorFeedbacks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEducatorFeedbacks.fulfilled, (state, action) => {
        state.loading = false;
        const { feedbacks, total } = action.payload;

        if (state.pagination.page === 1) {
          state.feedbacks = feedbacks;
        } else {
          state.feedbacks = [...state.feedbacks, ...feedbacks];
        }

        state.pagination.total = total;
        state.pagination.hasMore =
          feedbacks.length === state.pagination.pageSize;
      })
      .addCase(fetchEducatorFeedbacks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Submit feedback
      .addCase(submitEducatorFeedback.pending, (state) => {
        state.submitting = true;
        state.submitError = null;
      })
      .addCase(submitEducatorFeedback.fulfilled, (state, action) => {
        state.submitting = false;
        state.feedbacks.unshift(action.payload); // Add to beginning of list
        state.pagination.total += 1;
      })
      .addCase(submitEducatorFeedback.rejected, (state, action) => {
        state.submitting = false;
        state.submitError = action.payload;
      })

      // Update feedback
      .addCase(updateEducatorFeedback.fulfilled, (state, action) => {
        const index = state.feedbacks.findIndex(
          (f) => f.id === action.payload.id,
        );
        if (index !== -1) {
          state.feedbacks[index] = {
            ...state.feedbacks[index],
            ...action.payload,
          };
        }
      })

      // Delete feedback
      .addCase(deleteEducatorFeedback.fulfilled, (state, action) => {
        state.feedbacks = state.feedbacks.filter(
          (f) => f.id !== action.payload,
        );
        state.pagination.total -= 1;
      });
  },
});

export const { setFilters, clearFilters, setPage, clearError, clearFeedbacks } =
  educatorFeedbackSlice.actions;

export default educatorFeedbackSlice.reducer;

// Selectors
export const selectEducatorFeedbacks = (state) =>
  state.educatorFeedback.feedbacks;
export const selectEducatorFeedbackLoading = (state) =>
  state.educatorFeedback.loading;
export const selectEducatorFeedbackError = (state) =>
  state.educatorFeedback.error;
export const selectEducatorFeedbackSubmitting = (state) =>
  state.educatorFeedback.submitting;
export const selectEducatorFeedbackFilters = (state) =>
  state.educatorFeedback.filters;
export const selectEducatorFeedbackPagination = (state) =>
  state.educatorFeedback.pagination;
