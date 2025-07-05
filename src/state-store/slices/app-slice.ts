import { createSlice } from "@reduxjs/toolkit";

const appSlice = createSlice({
  name: "app",
  initialState: {
    token: null,
    isAuthenticated: false,
    sessionData: null,
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
    logout: (state) => {
      state.token = null;
    },
  },
});

export const { setToken, logout, setIsAuthenticated, setSessionData } =
  appSlice.actions;

export default appSlice.reducer;
