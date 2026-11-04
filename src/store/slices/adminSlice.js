import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // Platform stats
  stats: {
    totalUsers: 0,
    totalCourses: 0,
    totalLessons: 0,
    totalEnrollments: 0,
  },
  statsLoading: false,
  statsError: null,

  // Platform users list
  users: [],
  usersLoading: false,
  usersError: null,

  // Single user profile inspection (GET /api/admin/users/:id)
  selectedUser: null,
  selectedUserLoading: false,
  selectedUserError: null,

  // Platform all courses (GET /api/admin/courses)
  courses: [],
  coursesLoading: false,
  coursesError: null,

  // Instructor upgrade requests
  requests: [],
  requestsLoading: false,
  requestsError: null,

  // Actions loading & feedback
  actionLoading: false,
  actionError: null,
  actionSuccess: null,
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    // Stats actions
    fetchAdminStatsStart: (state) => {
      state.statsLoading = true;
      state.statsError = null;
    },
    fetchAdminStatsSuccess: (state, action) => {
      state.statsLoading = false;
      state.stats = action.payload;
      state.statsError = null;
    },
    fetchAdminStatsFailure: (state, action) => {
      state.statsLoading = false;
      state.statsError = action.payload;
    },

    // Users actions
    fetchAdminUsersStart: (state) => {
      state.usersLoading = true;
      state.usersError = null;
    },
    fetchAdminUsersSuccess: (state, action) => {
      state.usersLoading = false;
      state.users = action.payload;
      state.usersError = null;
    },
    fetchAdminUsersFailure: (state, action) => {
      state.usersLoading = false;
      state.usersError = action.payload;
    },

    // Single user actions
    fetchSingleUserStart: (state) => {
      state.selectedUserLoading = true;
      state.selectedUserError = null;
    },
    fetchSingleUserSuccess: (state, action) => {
      state.selectedUserLoading = false;
      state.selectedUser = action.payload;
      state.selectedUserError = null;
    },
    fetchSingleUserFailure: (state, action) => {
      state.selectedUserLoading = false;
      state.selectedUserError = action.payload;
    },
    clearSelectedUser: (state) => {
      state.selectedUser = null;
      state.selectedUserLoading = false;
      state.selectedUserError = null;
    },

    // User status toggle
    updateUserStatusStart: (state) => {
      state.actionLoading = true;
      state.actionError = null;
    },
    updateUserStatusSuccess: (state, action) => {
      state.actionLoading = false;
      const updatedUser = action.payload;
      state.users = state.users.map((u) =>
        u._id === updatedUser._id ? { ...u, status: updatedUser.status } : u,
      );
      if (state.selectedUser?._id === updatedUser._id) {
        state.selectedUser = { ...state.selectedUser, status: updatedUser.status };
      }
    },
    updateUserStatusFailure: (state, action) => {
      state.actionLoading = false;
      state.actionError = action.payload;
    },

    // User role change
    updateUserRoleStart: (state) => {
      state.actionLoading = true;
      state.actionError = null;
    },
    updateUserRoleSuccess: (state, action) => {
      state.actionLoading = false;
      const updatedUser = action.payload;
      state.users = state.users.map((u) =>
        u._id === updatedUser._id ? { ...u, role: updatedUser.role } : u,
      );
      if (state.selectedUser?._id === updatedUser._id) {
        state.selectedUser = { ...state.selectedUser, role: updatedUser.role };
      }
    },
    updateUserRoleFailure: (state, action) => {
      state.actionLoading = false;
      state.actionError = action.payload;
    },

    // Courses actions
    fetchAdminCoursesStart: (state) => {
      state.coursesLoading = true;
      state.coursesError = null;
    },
    fetchAdminCoursesSuccess: (state, action) => {
      state.coursesLoading = false;
      state.courses = action.payload;
      state.coursesError = null;
    },
    fetchAdminCoursesFailure: (state, action) => {
      state.coursesLoading = false;
      state.coursesError = action.payload;
    },

    // Toggle course status (PUT /api/courses/:id)
    toggleCourseStatusStart: (state) => {
      state.actionLoading = true;
      state.actionError = null;
    },
    toggleCourseStatusSuccess: (state, action) => {
      state.actionLoading = false;
      const updatedCourse = action.payload;
      state.courses = state.courses.map((c) =>
        c._id === updatedCourse._id ? { ...c, ...updatedCourse } : c,
      );
      state.actionSuccess = `Course "${updatedCourse.title}" status updated to ${
        updatedCourse.status ? "Published" : "Draft"
      }.`;
    },
    toggleCourseStatusFailure: (state, action) => {
      state.actionLoading = false;
      state.actionError = action.payload;
    },

    // Delete course (DELETE /api/courses/:id)
    deleteCourseStart: (state) => {
      state.actionLoading = true;
      state.actionError = null;
    },
    deleteCourseSuccess: (state, action) => {
      state.actionLoading = false;
      const courseId = action.payload;
      state.courses = state.courses.filter((c) => c._id !== courseId);
      if (state.stats.totalCourses > 0) {
        state.stats.totalCourses -= 1;
      }
      state.actionSuccess = "Course deleted successfully.";
    },
    deleteCourseFailure: (state, action) => {
      state.actionLoading = false;
      state.actionError = action.payload;
    },

    // Instructor requests
    fetchInstructorRequestsStart: (state) => {
      state.requestsLoading = true;
      state.requestsError = null;
    },
    fetchInstructorRequestsSuccess: (state, action) => {
      state.requestsLoading = false;
      state.requests = action.payload;
      state.requestsError = null;
    },
    fetchInstructorRequestsFailure: (state, action) => {
      state.requestsLoading = false;
      state.requestsError = action.payload;
    },

    handleInstructorRequestStart: (state) => {
      state.actionLoading = true;
      state.actionError = null;
    },
    handleInstructorRequestSuccess: (state, action) => {
      state.actionLoading = false;
      const updatedUser = action.payload;
      state.requests = state.requests.map((r) =>
        r._id === updatedUser._id ? { ...r, ...updatedUser } : r,
      );
      state.users = state.users.map((u) =>
        u._id === updatedUser._id ? { ...u, role: updatedUser.role } : u,
      );
      state.actionSuccess = `Request for ${updatedUser.name} has been processed.`;
    },
    handleInstructorRequestFailure: (state, action) => {
      state.actionLoading = false;
      state.actionError = action.payload;
    },

    clearAdminFeedback: (state) => {
      state.actionError = null;
      state.actionSuccess = null;
    },
  },
});

export const {
  fetchAdminStatsStart,
  fetchAdminStatsSuccess,
  fetchAdminStatsFailure,
  fetchAdminUsersStart,
  fetchAdminUsersSuccess,
  fetchAdminUsersFailure,
  fetchSingleUserStart,
  fetchSingleUserSuccess,
  fetchSingleUserFailure,
  clearSelectedUser,
  updateUserStatusStart,
  updateUserStatusSuccess,
  updateUserStatusFailure,
  updateUserRoleStart,
  updateUserRoleSuccess,
  updateUserRoleFailure,
  fetchAdminCoursesStart,
  fetchAdminCoursesSuccess,
  fetchAdminCoursesFailure,
  toggleCourseStatusStart,
  toggleCourseStatusSuccess,
  toggleCourseStatusFailure,
  deleteCourseStart,
  deleteCourseSuccess,
  deleteCourseFailure,
  fetchInstructorRequestsStart,
  fetchInstructorRequestsSuccess,
  fetchInstructorRequestsFailure,
  handleInstructorRequestStart,
  handleInstructorRequestSuccess,
  handleInstructorRequestFailure,
  clearAdminFeedback,
} = adminSlice.actions;

export default adminSlice.reducer;
