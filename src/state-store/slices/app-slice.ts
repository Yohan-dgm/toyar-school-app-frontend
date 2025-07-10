import { createSlice } from "@reduxjs/toolkit";

const appSlice = createSlice({
  name: "app",
  initialState: {
    token: null,
    isAuthenticated: false,
    sessionData: null,
    user: null,
  },
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
    logout: (state) => {
      state.token = null;
      state.isAuthenticated = false;
      state.user = null;
      state.sessionData = null;
    },
  },
});

export const { setToken, logout, setIsAuthenticated, setSessionData, setUser } =
  appSlice.actions;

export default appSlice.reducer;
