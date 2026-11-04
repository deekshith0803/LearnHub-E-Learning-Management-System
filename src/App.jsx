import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import PublicLayout from "./layouts/PublicLayout";
import StudentLayout from "./layouts/StudentLayout";
import InstructorLayout from "./layouts/InstructorLayout";
import AdminLayout from "./layouts/AdminLayout";

import Home from "./pages/Home";
import Courses from "./pages/Courses";
import CourseDetails from "./pages/CourseDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";

import MyLearning from "./pages/MyLearning";
import LessonPlayer from "./pages/LessonPlayer";
import StudentProfile from "./pages/StudentProfile";
import InstructorDashboard from "./pages/InstructorDashboard";
import InstructorCourses from "./pages/InstructorCourses";
import AdminDashboard from "./pages/AdminDashboard";
import AdminCourses from "./pages/AdminCourses";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import api from "./services/api";
import {
  authCheckStart,
  authCheckSuccess,
  authCheckFailure,
} from "./store/slices/authSlice";

export default function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const verifySession = async () => {
      try {
        dispatch(authCheckStart());
        const response = await api.get("/auth/profile");
        if (response.data?.success && response.data?.user) {
          dispatch(authCheckSuccess(response.data.user));
        } else {
          dispatch(authCheckFailure());
        }
      } catch {
        dispatch(authCheckFailure());
      }
    };

    verifySession();
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Auth routes */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* 1. Public catalog & home routes (PublicLayout) */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:id" element={<CourseDetails />} />
          <Route
            path="/courses/:id/lessons/:lessonId"
            element={<LessonPlayer />}
          />
        </Route>

        {/* 2. Protected Student routes (StudentLayout with StudentSidebar) */}
        <Route element={<StudentLayout />}>
          <Route element={<ProtectedRoute role="student" />}>
            <Route path="/dashboard" element={<MyLearning />} />
            <Route path="/profile" element={<StudentProfile />} />
          </Route>
        </Route>

        {/* 3. Protected Instructor routes (InstructorLayout with InstructorSidebar) */}
        <Route element={<InstructorLayout />}>
          <Route element={<ProtectedRoute role="instructor" />}>
            <Route path="/instructor" element={<InstructorDashboard />} />
            <Route
              path="/instructor/dashboard"
              element={<Navigate to="/instructor" replace />}
            />
            <Route
              path="/instructor/courses"
              element={<InstructorCourses />}
            />
            <Route path="/instructor/profile" element={<StudentProfile />} />
          </Route>
        </Route>

        {/* 4. Protected Admin routes (AdminLayout with AdminSidebar) */}
        <Route element={<AdminLayout />}>
          <Route element={<ProtectedRoute role="admin" />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/courses" element={<AdminCourses />} />
            <Route path="/admin/profile" element={<StudentProfile />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
