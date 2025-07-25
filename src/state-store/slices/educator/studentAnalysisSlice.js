import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async thunks for API calls
export const fetchClassAnalytics = createAsyncThunk(
  "studentAnalysis/fetchClassAnalytics",
  async ({ classId, period }, { rejectWithValue }) => {
    try {
      // TODO: Implement actual API call
      // const response = await api.get("/api/educator/analytics/class", {
      //   params: { class_id: classId, period }
      // });
      // return response.data;
      
      // Mock data
      return {
        class_id: classId,
        period,
        overview: {
          total_students: 25,
          average_performance: 82.5,
          categories: {
            academic: 85,
            behavior: 88,
            social: 78,
            creative: 82,
            sports: 79,
          },
        },
        trends: [
          { date: "2025-01-01", academic: 80, behavior: 85, social: 75 },
          { date: "2025-01-08", academic: 82, behavior: 87, social: 77 },
          { date: "2025-01-15", academic: 85, behavior: 88, social: 78 },
        ],
        top_performers: [
          { student_id: 2, name: "Jane Smith", overall_score: 92 },
          { student_id: 1, name: "John Doe", overall_score: 88 },
          { student_id: 4, name: "Sarah Wilson", overall_score: 85 },
        ],
        needs_attention: [
          { student_id: 3, name: "Mike Johnson", overall_score: 65, areas: ["academic", "behavior"] },
        ],
      };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchStudentAnalytics = createAsyncThunk(
  "studentAnalysis/fetchStudentAnalytics",
  async ({ studentId, period }, { rejectWithValue }) => {
    try {
      // TODO: Implement actual API call
      // const response = await api.get("/api/educator/analytics/student", {
      //   params: { student_id: studentId, period }
      // });
      // return response.data;
      
      // Mock data
      return {
        student_id: studentId,
        student_name: "John Doe",
        period,
        scores: {
          academic: 85,
          behavior: 90,
          social: 78,
          creative: 82,
          sports: 88,
        },
        trends: [
          { date: "2025-01-01", academic: 80, behavior: 85, social: 75, creative: 78, sports: 85 },
          { date: "2025-01-08", academic: 82, behavior: 87, social: 77, creative: 80, sports: 86 },
          { date: "2025-01-15", academic: 85, behavior: 90, social: 78, creative: 82, sports: 88 },
        ],
        strengths: ["Mathematics", "Science", "Leadership"],
        areas_for_improvement: ["Art", "Group participation"],
        recent_feedback: [
          {
            date: "2025-01-15",
            category: "academic",
            rating: 4,
            comment: "Excellent problem-solving skills",
          },
          {
            date: "2025-01-14",
            category: "behavior",
            rating: 5,
            comment: "Great classroom participation",
          },
        ],
      };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchComparisonData = createAsyncThunk(
  "studentAnalysis/fetchComparisonData",
  async ({ classId, category, period }, { rejectWithValue }) => {
    try {
      // TODO: Implement actual API call
      // const response = await api.get("/api/educator/analytics/comparison", {
      //   params: { class_id: classId, category, period }
      // });
      // return response.data;
      
      // Mock data
      return {
        class_id: classId,
        category,
        period,
        students: [
          { id: 1, name: "John Doe", score: 85, rank: 2 },
          { id: 2, name: "Jane Smith", score: 92, rank: 1 },
          { id: 3, name: "Mike Johnson", score: 78, rank: 3 },
          { id: 4, name: "Sarah Wilson", score: 88, rank: 2 },
        ],
        class_average: 85.75,
        distribution: {
          excellent: 2, // 90-100
          good: 1,      // 80-89
          average: 1,   // 70-79
          below_average: 0, // 60-69
          poor: 0,      // <60
        },
      };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const generateAnalyticsReport = createAsyncThunk(
  "studentAnalysis/generateReport",
  async ({ classId, period, format }, { rejectWithValue }) => {
    try {
      // TODO: Implement actual API call
      // const response = await api.post("/api/educator/analytics/report", {
      //   class_id: classId,
      //   period,
      //   format
      // });
      // return response.data;
      
      // Mock response
      return {
        report_id: Date.now(),
        download_url: "https://example.com/report.pdf",
        generated_at: new Date().toISOString(),
        format,
      };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  classAnalytics: null,
  studentAnalytics: {},
  comparisonData: null,
  loading: false,
  studentLoading: false,
  comparisonLoading: false,
  error: null,
  selectedPeriod: "month", // week, month, quarter, year
  selectedCategory: "all", // all, academic, behavior, social, creative, sports
  selectedStudents: [], // for comparison
  reportGenerating: false,
  reportError: null,
};

const studentAnalysisSlice = createSlice({
  name: "studentAnalysis",
  initialState,
  reducers: {
    setSelectedPeriod: (state, action) => {
      state.selectedPeriod = action.payload;
    },
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
    setSelectedStudents: (state, action) => {
      state.selectedStudents = action.payload;
    },
    addSelectedStudent: (state, action) => {
      if (!state.selectedStudents.includes(action.payload)) {
        state.selectedStudents.push(action.payload);
      }
    },
    removeSelectedStudent: (state, action) => {
      state.selectedStudents = state.selectedStudents.filter(
        id => id !== action.payload
      );
    },
    clearAnalyticsData: (state) => {
      state.classAnalytics = null;
      state.studentAnalytics = {};
      state.comparisonData = null;
    },
    clearError: (state) => {
      state.error = null;
      state.reportError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch class analytics
      .addCase(fetchClassAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClassAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.classAnalytics = action.payload;
      })
      .addCase(fetchClassAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch student analytics
      .addCase(fetchStudentAnalytics.pending, (state) => {
        state.studentLoading = true;
      })
      .addCase(fetchStudentAnalytics.fulfilled, (state, action) => {
        state.studentLoading = false;
        const { student_id } = action.payload;
        state.studentAnalytics[student_id] = action.payload;
      })
      .addCase(fetchStudentAnalytics.rejected, (state, action) => {
        state.studentLoading = false;
        state.error = action.payload;
      })
      
      // Fetch comparison data
      .addCase(fetchComparisonData.pending, (state) => {
        state.comparisonLoading = true;
      })
      .addCase(fetchComparisonData.fulfilled, (state, action) => {
        state.comparisonLoading = false;
        state.comparisonData = action.payload;
      })
      .addCase(fetchComparisonData.rejected, (state, action) => {
        state.comparisonLoading = false;
        state.error = action.payload;
      })
      
      // Generate report
      .addCase(generateAnalyticsReport.pending, (state) => {
        state.reportGenerating = true;
        state.reportError = null;
      })
      .addCase(generateAnalyticsReport.fulfilled, (state, action) => {
        state.reportGenerating = false;
        // Handle successful report generation (e.g., show download link)
      })
      .addCase(generateAnalyticsReport.rejected, (state, action) => {
        state.reportGenerating = false;
        state.reportError = action.payload;
      });
  },
});

export const {
  setSelectedPeriod,
  setSelectedCategory,
  setSelectedStudents,
  addSelectedStudent,
  removeSelectedStudent,
  clearAnalyticsData,
  clearError,
} = studentAnalysisSlice.actions;

export default studentAnalysisSlice.reducer;

// Selectors
export const selectClassAnalytics = (state) => state.studentAnalysis.classAnalytics;
export const selectStudentAnalytics = (state) => state.studentAnalysis.studentAnalytics;
export const selectComparisonData = (state) => state.studentAnalysis.comparisonData;
export const selectAnalyticsLoading = (state) => state.studentAnalysis.loading;
export const selectStudentAnalyticsLoading = (state) => state.studentAnalysis.studentLoading;
export const selectComparisonLoading = (state) => state.studentAnalysis.comparisonLoading;
export const selectAnalyticsError = (state) => state.studentAnalysis.error;
export const selectSelectedPeriod = (state) => state.studentAnalysis.selectedPeriod;
export const selectSelectedCategory = (state) => state.studentAnalysis.selectedCategory;
export const selectSelectedStudents = (state) => state.studentAnalysis.selectedStudents;
