import { createSlice, createAction } from "@reduxjs/toolkit";

// Create thunk actions for user management that will be handled by middleware
export const setUserWithPostsUpdate = createAction<any>(
  "app/setUserWithPostsUpdate"
);
export const logoutWithPostsCleanup = createAction(
  "app/logoutWithPostsCleanup"
);

// Define interface for selected student data
interface SelectedStudent {
  id: number;
  student_id: number;
  user_id: number;
  grade: string;
  class_id: number | null;
  student_calling_name: string;
  full_name: string;
  admission_number: string;
  profileImage?: any;
  campus?: string;
  gender?: string;
  dateOfBirth?: string;
  schoolHouse?: string;
  guardianInfo?: any;
  timeline?: any[];
}

interface AppState {
  token: string | null;
  isAuthenticated: boolean;
  sessionData: any;
  user: any;
  selectedStudent: SelectedStudent | null;
}

const appSlice = createSlice({
  name: "app",
  initialState: {
    token: null,
    isAuthenticated: false,
    sessionData: null,
    user: null,
    selectedStudent: null,
  } as AppState,
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
    },
    setIsAuthenticated: (state, action) => {
      state.isAuthenticated = action.payload;
    },
    setSessionData: (state, action) => {
      state.sessionData = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setSelectedStudent: (state, action) => {
      state.selectedStudent = action.payload;
      console.log(
        "🎓 Global State - Selected student updated:",
        action.payload?.student_calling_name
      );
    },
    clearSelectedStudent: (state) => {
      state.selectedStudent = null;
      console.log("🎓 Global State - Selected student cleared");
    },
    logout: (state) => {
      state.token = null;
      state.isAuthenticated = false;
      state.user = null;
      state.sessionData = null;
      state.selectedStudent = null;
    },
  },
});

export const {
  setToken,
  logout,
  setIsAuthenticated,
  setSessionData,
  setUser,
  setSelectedStudent,
  clearSelectedStudent,
} = appSlice.actions;

export default appSlice.reducer;
