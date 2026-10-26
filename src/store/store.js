import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import coursesReducer from "./slices/courseSlice";
import profileReducer from "./slices/profileSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    courses: coursesReducer,
    profile: profileReducer,
  },
});
