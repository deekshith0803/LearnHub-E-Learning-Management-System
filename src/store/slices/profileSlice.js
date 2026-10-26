import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  loading: false,
  error: null,
  updating: false,
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    fetchProfileStart: (state) => {
      state.loading = true;
      state.error = null;
    },

    fetchProfileSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.error = null;
    },

    fetchProfileFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    updateProfileStart: (state) => {
      state.updating = true;
      state.error = null;
    },

    updateProfileSuccess: (state, action) => {
      state.updating = false;
      state.user = action.payload;
      state.error = null;
    },

    updateProfileFailure: (state, action) => {
      state.updating = false;
      state.error = action.payload;
    },

    clearProfile: (state) => {
      state.user = null;
      state.loading = false;
      state.error = null;
      state.updating = false;
    },
  },
});

export const {
  fetchProfileStart,
  fetchProfileSuccess,
  fetchProfileFailure,
  updateProfileStart,
  updateProfileSuccess,
  updateProfileFailure,
  clearProfile,
} = profileSlice.actions;

export default profileSlice.reducer;
