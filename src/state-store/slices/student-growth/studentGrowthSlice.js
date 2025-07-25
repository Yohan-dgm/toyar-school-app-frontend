import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { studentGrowthMetrics, educatorFeedback, attendanceData } from '../../../data/studentGrowthData';

// Async thunks for API calls (using dummy data for now)
export const fetchStudentGrowthData = createAsyncThunk(
  'studentGrowth/fetchGrowthData',
  async (studentId, { rejectWithValue }) => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would be an API call
      // const response = await api.get(`/student-growth/${studentId}`);
      // return response.data;
      
      return {
        metrics: studentGrowthMetrics,
        feedback: educatorFeedback,
        attendance: attendanceData,
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchEducatorFeedback = createAsyncThunk(
  'studentGrowth/fetchFeedback',
  async ({ studentId, filters }, { rejectWithValue }) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      let filteredFeedback = educatorFeedback;
      
      // Apply filters
      if (filters?.category && filters.category !== 'all') {
        filteredFeedback = filteredFeedback.filter(feedback =>
          feedback.category.toLowerCase().includes(filters.category.toLowerCase()) ||
          feedback.subject.toLowerCase().includes(filters.category.toLowerCase())
        );
      }
      
      if (filters?.educator) {
        filteredFeedback = filteredFeedback.filter(feedback =>
          feedback.educatorName.toLowerCase().includes(filters.educator.toLowerCase())
        );
      }
      
      return filteredFeedback;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const submitParentReply = createAsyncThunk(
  'studentGrowth/submitReply',
  async ({ feedbackId, replyText }, { rejectWithValue }) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // In a real app, this would be an API call
      // const response = await api.post(`/feedback/${feedbackId}/reply`, { message: replyText });
      // return response.data;
      
      return {
        feedbackId,
        reply: {
          id: Date.now(),
          message: replyText,
          timestamp: new Date().toISOString(),
          author: 'Parent',
        },
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchAttendanceData = createAsyncThunk(
  'studentGrowth/fetchAttendance',
  async ({ studentId, period }, { rejectWithValue }) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 600));
      
      // In a real app, this would be an API call with period filtering
      // const response = await api.get(`/attendance/${studentId}?period=${period}`);
      // return response.data;
      
      return attendanceData;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  // Growth metrics data
  metrics: [],
  selectedMetric: null,
  
  // Feedback data
  feedback: [],
  feedbackFilters: {
    category: 'all',
    educator: '',
  },
  
  // Attendance data
  attendance: null,
  attendancePeriod: 'current', // 'current', 'monthly', 'weekly'
  
  // UI state
  loading: {
    metrics: false,
    feedback: false,
    attendance: false,
    reply: false,
  },
  
  error: {
    metrics: null,
    feedback: null,
    attendance: null,
    reply: null,
  },
  
  // Cache timestamps for data freshness
  lastFetched: {
    metrics: null,
    feedback: null,
    attendance: null,
  },
};

const studentGrowthSlice = createSlice({
  name: 'studentGrowth',
  initialState,
  reducers: {
    // Metric selection
    setSelectedMetric: (state, action) => {
      state.selectedMetric = action.payload;
    },
    
    // Feedback filters
    setFeedbackFilters: (state, action) => {
      state.feedbackFilters = { ...state.feedbackFilters, ...action.payload };
    },
    
    clearFeedbackFilters: (state) => {
      state.feedbackFilters = {
        category: 'all',
        educator: '',
      };
    },
    
    // Attendance period
    setAttendancePeriod: (state, action) => {
      state.attendancePeriod = action.payload;
    },
    
    // Clear errors
    clearError: (state, action) => {
      const errorType = action.payload;
      if (errorType) {
        state.error[errorType] = null;
      } else {
        state.error = {
          metrics: null,
          feedback: null,
          attendance: null,
          reply: null,
        };
      }
    },
    
    // Reset state
    resetStudentGrowthState: (state) => {
      return initialState;
    },
    
    // Update metric rating (for animations)
    updateMetricRating: (state, action) => {
      const { metricId, newRating } = action.payload;
      const metric = state.metrics.find(m => m.id === metricId);
      if (metric) {
        metric.rating = newRating;
      }
    },
  },
  
  extraReducers: (builder) => {
    // Fetch student growth data
    builder
      .addCase(fetchStudentGrowthData.pending, (state) => {
        state.loading.metrics = true;
        state.error.metrics = null;
      })
      .addCase(fetchStudentGrowthData.fulfilled, (state, action) => {
        state.loading.metrics = false;
        state.metrics = action.payload.metrics;
        state.feedback = action.payload.feedback;
        state.attendance = action.payload.attendance;
        state.lastFetched.metrics = Date.now();
        
        // Auto-select Overall metric if none selected
        if (!state.selectedMetric && action.payload.metrics.length > 0) {
          state.selectedMetric = action.payload.metrics[0];
        }
      })
      .addCase(fetchStudentGrowthData.rejected, (state, action) => {
        state.loading.metrics = false;
        state.error.metrics = action.payload;
      });
    
    // Fetch educator feedback
    builder
      .addCase(fetchEducatorFeedback.pending, (state) => {
        state.loading.feedback = true;
        state.error.feedback = null;
      })
      .addCase(fetchEducatorFeedback.fulfilled, (state, action) => {
        state.loading.feedback = false;
        state.feedback = action.payload;
        state.lastFetched.feedback = Date.now();
      })
      .addCase(fetchEducatorFeedback.rejected, (state, action) => {
        state.loading.feedback = false;
        state.error.feedback = action.payload;
      });
    
    // Submit parent reply
    builder
      .addCase(submitParentReply.pending, (state) => {
        state.loading.reply = true;
        state.error.reply = null;
      })
      .addCase(submitParentReply.fulfilled, (state, action) => {
        state.loading.reply = false;
        const { feedbackId, reply } = action.payload;
        
        // Add reply to the feedback item
        const feedback = state.feedback.find(f => f.id === feedbackId);
        if (feedback) {
          if (!feedback.replies) {
            feedback.replies = [];
          }
          feedback.replies.push(reply);
        }
      })
      .addCase(submitParentReply.rejected, (state, action) => {
        state.loading.reply = false;
        state.error.reply = action.payload;
      });
    
    // Fetch attendance data
    builder
      .addCase(fetchAttendanceData.pending, (state) => {
        state.loading.attendance = true;
        state.error.attendance = null;
      })
      .addCase(fetchAttendanceData.fulfilled, (state, action) => {
        state.loading.attendance = false;
        state.attendance = action.payload;
        state.lastFetched.attendance = Date.now();
      })
      .addCase(fetchAttendanceData.rejected, (state, action) => {
        state.loading.attendance = false;
        state.error.attendance = action.payload;
      });
  },
});

export const {
  setSelectedMetric,
  setFeedbackFilters,
  clearFeedbackFilters,
  setAttendancePeriod,
  clearError,
  resetStudentGrowthState,
  updateMetricRating,
} = studentGrowthSlice.actions;

export default studentGrowthSlice.reducer;

// Selectors
export const selectStudentGrowthMetrics = (state) => state.studentGrowth.metrics;
export const selectSelectedMetric = (state) => state.studentGrowth.selectedMetric;
export const selectEducatorFeedback = (state) => state.studentGrowth.feedback;
export const selectFeedbackFilters = (state) => state.studentGrowth.feedbackFilters;
export const selectAttendanceData = (state) => state.studentGrowth.attendance;
export const selectAttendancePeriod = (state) => state.studentGrowth.attendancePeriod;
export const selectStudentGrowthLoading = (state) => state.studentGrowth.loading;
export const selectStudentGrowthError = (state) => state.studentGrowth.error;

// Filtered feedback selector
export const selectFilteredFeedback = (state) => {
  const feedback = state.studentGrowth.feedback;
  const filters = state.studentGrowth.feedbackFilters;
  
  if (!feedback || !filters) return feedback;
  
  return feedback.filter(item => {
    const categoryMatch = filters.category === 'all' || 
      item.category.toLowerCase().includes(filters.category.toLowerCase()) ||
      item.subject.toLowerCase().includes(filters.category.toLowerCase());
    
    const educatorMatch = !filters.educator || 
      item.educatorName.toLowerCase().includes(filters.educator.toLowerCase());
    
    return categoryMatch && educatorMatch;
  });
};
