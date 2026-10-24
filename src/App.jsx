import { BrowserRouter, Routes, Route } from "react-router-dom";

import PublicLayout from "./layouts/PublicLayout";
import Home from "./pages/Home";
import Courses from "./pages/Courses";
import CourseDetails from "./pages/CourseDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { useDispatch } from "react-redux";
import { login, logout } from "./store/slices/authSlice";
import api from "./services/api";
import { useEffect } from "react";
import MyLearning from "./pages/MyLearning";

export default function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const response = await api.get("/auth/profile");

        dispatch(login(response.data.user));
      } catch {
        dispatch(logout());
      }
    };

    checkLogin();
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:id" element={<CourseDetails />} />
          <Route path="/dashboard" element={<MyLearning />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
