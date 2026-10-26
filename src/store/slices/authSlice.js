import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  isAuthenticated: false,
  isCheckingAuth: true,
  activeDashboard: "student",
};

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    register: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.activeDashboard = action.payload.role || "student";
    },

    login: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isCheckingAuth = false;
      state.activeDashboard = action.payload.role || "student";
    },

    setUser: (state, action) => {
      state.user = action.payload;
      state.activeDashboard = action.payload.role || state.activeDashboard;
    },

    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isCheckingAuth = false;
      state.activeDashboard = "student";
    },

    authCheckStart: (state) => {
      state.isCheckingAuth = true;
    },

    authCheckSuccess: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isCheckingAuth = false;
      state.activeDashboard = action.payload.role || "student";
    },

    authCheckFailure: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isCheckingAuth = false;
      state.activeDashboard = "student";
    },

    switchDashboard: (state, action) => {
      const allowedRoles =
        Array.isArray(state.user?.roles) && state.user.roles.length
          ? state.user.roles
          : [state.user?.role];

      if (allowedRoles.includes(action.payload)) {
        state.activeDashboard = action.payload;
      }
    },
  },
});

export const {
  register,
  login,
  setUser,
  logout,
  authCheckStart,
  authCheckSuccess,
  authCheckFailure,
  switchDashboard,
} = authSlice.actions;

export default authSlice.reducer;
