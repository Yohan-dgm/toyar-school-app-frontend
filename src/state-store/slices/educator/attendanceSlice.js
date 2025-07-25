import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async thunks for API calls
export const fetchClassAttendance = createAsyncThunk(
  "attendance/fetchClassAttendance",
  async ({ date, classId }, { rejectWithValue }) => {
    try {
      // TODO: Implement actual API call
      // const response = await api.get("/api/educator/attendance", { 
      //   params: { date, class_id: classId } 
      // });
      // return response.data;
      
      // Mock data for now
      return {
        date,
        class_id: classId,
        students: [
          { id: 1, name: "John Doe", status: "present" },
          { id: 2, name: "Jane Smith", status: "present" },
          { id: 3, name: "Mike Johnson", status: "absent" },
        ],
      };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const submitAttendance = createAsyncThunk(
  "attendance/submitAttendance",
  async ({ date, classId, attendanceData }, { rejectWithValue }) => {
    try {
      // TODO: Implement actual API call
      // const response = await api.post("/api/educator/attendance", {
      //   date,
      //   class_id: classId,
      //   attendance: attendanceData,
      // });
      // return response.data;
      
      // Mock response
      return {
        date,
        class_id: classId,
        attendance: attendanceData,
        submitted_at: new Date().toISOString(),
      };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchAttendanceHistory = createAsyncThunk(
  "attendance/fetchHistory",
  async ({ classId, startDate, endDate }, { rejectWithValue }) => {
    try {
      // TODO: Implement actual API call
      // const response = await api.get("/api/educator/attendance/history", {
      //   params: { class_id: classId, start_date: startDate, end_date: endDate }
      // });
      // return response.data;
      
      // Mock data
      return [
        {
          date: "2025-01-16",
          total_students: 25,
          present: 23,
          absent: 2,
          late: 0,
          submitted_at: "2025-01-16T15:30:00Z",
        },
        {
          date: "2025-01-15",
          total_students: 25,
          present: 24,
          absent: 1,
          late: 0,
          submitted_at: "2025-01-15T15:25:00Z",
        },
      ];
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchAttendanceStats = createAsyncThunk(
  "attendance/fetchStats",
  async ({ classId, period }, { rejectWithValue }) => {
    try {
      // TODO: Implement actual API call
      // const response = await api.get("/api/educator/attendance/stats", {
      //   params: { class_id: classId, period }
      // });
      // return response.data;
      
      // Mock data
      return {
        period,
        total_days: 20,
        average_attendance: 92.5,
        trends: {
          present: 85,
          absent: 10,
          late: 5,
        },
        student_stats: [
          { student_id: 1, name: "John Doe", attendance_rate: 95 },
          { student_id: 2, name: "Jane Smith", attendance_rate: 100 },
          { student_id: 3, name: "Mike Johnson", attendance_rate: 80 },
        ],
      };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  currentAttendance: null,
  attendanceHistory: [],
  attendanceStats: null,
  loading: false,
  submitting: false,
  error: null,
  submitError: null,
  selectedDate: new Date().toISOString().split('T')[0],
  classId: null,
  lastSubmitted: null,
};

const attendanceSlice = createSlice({
  name: "attendance",
  initialState,
  reducers: {
    setSelectedDate: (state, action) => {
      state.selectedDate = action.payload;
    },
    setClassId: (state, action) => {
      state.classId = action.payload;
    },
    updateStudentAttendance: (state, action) => {
      const { studentId, status } = action.payload;
      if (state.currentAttendance && state.currentAttendance.students) {
        const studentIndex = state.currentAttendance.students.findIndex(
          s => s.id === studentId
        );
        if (studentIndex !== -1) {
          state.currentAttendance.students[studentIndex].status = status;
        }
      }
    },
    clearAttendanceData: (state) => {
      state.currentAttendance = null;
      state.attendanceHistory = [];
      state.attendanceStats = null;
    },
    clearError: (state) => {
      state.error = null;
      state.submitError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch class attendance
      .addCase(fetchClassAttendance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClassAttendance.fulfilled, (state, action) => {
        state.loading = false;
        state.currentAttendance = action.payload;
      })
      .addCase(fetchClassAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Submit attendance
      .addCase(submitAttendance.pending, (state) => {
        state.submitting = true;
        state.submitError = null;
      })
      .addCase(submitAttendance.fulfilled, (state, action) => {
        state.submitting = false;
        state.lastSubmitted = action.payload.submitted_at;
        
        // Update history if it exists
        const existingIndex = state.attendanceHistory.findIndex(
          h => h.date === action.payload.date
        );
        if (existingIndex !== -1) {
          state.attendanceHistory[existingIndex] = {
            ...state.attendanceHistory[existingIndex],
            submitted_at: action.payload.submitted_at,
          };
        }
      })
      .addCase(submitAttendance.rejected, (state, action) => {
        state.submitting = false;
        state.submitError = action.payload;
      })
      
      // Fetch attendance history
      .addCase(fetchAttendanceHistory.fulfilled, (state, action) => {
        state.attendanceHistory = action.payload;
      })
      
      // Fetch attendance stats
      .addCase(fetchAttendanceStats.fulfilled, (state, action) => {
        state.attendanceStats = action.payload;
      });
  },
});

export const {
  setSelectedDate,
  setClassId,
  updateStudentAttendance,
  clearAttendanceData,
  clearError,
} = attendanceSlice.actions;

export default attendanceSlice.reducer;

// Selectors
export const selectCurrentAttendance = (state) => state.attendance.currentAttendance;
export const selectAttendanceHistory = (state) => state.attendance.attendanceHistory;
export const selectAttendanceStats = (state) => state.attendance.attendanceStats;
export const selectAttendanceLoading = (state) => state.attendance.loading;
export const selectAttendanceSubmitting = (state) => state.attendance.submitting;
export const selectAttendanceError = (state) => state.attendance.error;
export const selectSelectedDate = (state) => state.attendance.selectedDate;
export const selectClassId = (state) => state.attendance.classId;
