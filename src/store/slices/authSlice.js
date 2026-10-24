import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  isAuthenticated: false,
  isCheckingAuth: true,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    register: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    login: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isCheckingAuth = false;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isCheckingAuth = false;
    },
    authCheckStart: (state) => {
      state.isCheckingAuth = true;
    },
    authCheckSuccess: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isCheckingAuth = false;
    },
    authCheckFailure: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isCheckingAuth = false;
    },
  },
});

export const { register, login, logout } = authSlice.actions;

export default authSlice.reducer;
