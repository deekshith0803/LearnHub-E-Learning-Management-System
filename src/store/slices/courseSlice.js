import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  courses: [],
  loading: false,
  error: null,

  enrollmentLoading: false,
  enrollmentError: null,
  enrollmentSuccess: null,

  myCourses: [],
  myCoursesLoading: false,
  myCoursesError: null,

  myLesson: [],
  myLessonLoading: false,
  myLessonError: null,

  progress: null,
  progressLoading: false,
  progressError: null,
  progressSaving: false,

  quizzes: [],
  quizzesLoading: false,
  quizzesError: null,
  quizSubmitting: false,
  quizSubmitError: null,
  quizResult: null,
};

const courseSlice = createSlice({
  name: "courses",
  initialState,
  reducers: {
    fetchCoursesStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchCoursesSuccess: (state, action) => {
      state.loading = false;
      state.courses = action.payload;
    },
    fetchCoursesFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    fetchCourseDetailsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchCourseDetailsSuccess: (state, action) => {
      state.loading = false;
      state.course = action.payload;
    },
    fetchCourseDetailsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    enrollCourseStart: (state) => {
      state.enrollmentLoading = true;
      state.enrollmentError = null;
      state.enrollmentSuccess = null;
    },

    enrollCourseSuccess: (state, action) => {
      state.enrollmentLoading = false;
      state.enrollmentSuccess = action.payload;
    },

    enrollCourseFailure: (state, action) => {
      state.enrollmentLoading = false;
      state.enrollmentError = action.payload;
    },

    clearEnrollmentStatus: (state) => {
      state.enrollmentError = null;
      state.enrollmentSuccess = null;
    },

    fetchMyCoursesStart: (state) => {
      state.myCoursesLoading = true;
      state.myCoursesError = null;
    },

    fetchMyCoursesSuccess: (state, action) => {
      state.myCoursesLoading = false;
      state.myCourses = action.payload;
    },

    fetchMyCoursesFailure: (state, action) => {
      state.myCoursesLoading = false;
      state.myCoursesError = action.payload;
    },

    addMyCourse: (state, action) => {
      const courseId = String(action.payload);

      const exists = state.myCourses.some(
        (item) => String(item.course?._id) === courseId,
      );

      if (!exists) {
        state.myCourses.push({
          course: { _id: courseId },
        });
      }
    },

    fetchMyLessonsStart: (state) => {
      state.myLessonLoading = true;
      state.myLessonError = null;
    },

    fetchMyLessonsSuccess: (state, action) => {
      state.myLessonLoading = false;
      state.myLessonError = null;
      state.myLesson = action.payload;
    },

    fetchMyLessonsFailure: (state, action) => {
      state.myLessonLoading = false;
      state.myLessonError = action.payload;
    },

    fetchProgressStart: (state) => {
      state.progressLoading = true;
      state.progressError = null;
    },

    fetchProgressSuccess: (state, action) => {
      state.progressLoading = false;
      state.progress = action.payload;
    },

    fetchProgressFailure: (state, action) => {
      state.progressLoading = false;
      state.progressError = action.payload;
    },

    updateProgressStart: (state) => {
      state.progressSaving = true;
      state.progressError = null;
    },

    updateProgressSuccess: (state, action) => {
      state.progressSaving = false;
      state.progress = action.payload;
    },

    updateProgressFailure: (state, action) => {
      state.progressSaving = false;
      state.progressError = action.payload;
    },

    fetchQuizzesStart: (state) => {
      state.quizzesLoading = true;
      state.quizzesError = null;
    },
    fetchQuizzesSuccess: (state, action) => {
      state.quizzesLoading = false;
      state.quizzes = action.payload;
      state.quizzesError = null;
    },
    fetchQuizzesFailure: (state, action) => {
      state.quizzesLoading = false;
      state.quizzesError = action.payload;
    },

    submitQuizStart: (state) => {
      state.quizSubmitting = true;
      state.quizSubmitError = null;
    },
    submitQuizSuccess: (state, action) => {
      state.quizSubmitting = false;
      state.quizResult = action.payload;
      state.quizSubmitError = null;
    },
    submitQuizFailure: (state, action) => {
      state.quizSubmitting = false;
      state.quizSubmitError = action.payload;
    },
    resetQuizResult: (state) => {
      state.quizResult = null;
      state.quizSubmitError = null;
    },
  },
});

export const {
  fetchCoursesStart,
  fetchCoursesSuccess,
  fetchCoursesFailure,
  fetchCourseDetailsStart,
  fetchCourseDetailsSuccess,
  fetchCourseDetailsFailure,
  enrollCourseStart,
  enrollCourseSuccess,
  enrollCourseFailure,
  clearEnrollmentStatus,
  fetchMyCoursesStart,
  fetchMyCoursesSuccess,
  fetchMyCoursesFailure,
  addMyCourse,
  fetchMyLessonsStart,
  fetchMyLessonsSuccess,
  fetchMyLessonsFailure,
  fetchProgressStart,
  fetchProgressSuccess,
  fetchProgressFailure,
  updateProgressStart,
  updateProgressSuccess,
  updateProgressFailure,
  fetchQuizzesStart,
  fetchQuizzesSuccess,
  fetchQuizzesFailure,
  submitQuizStart,
  submitQuizSuccess,
  submitQuizFailure,
  resetQuizResult,
} = courseSlice.actions;

export default courseSlice.reducer;
