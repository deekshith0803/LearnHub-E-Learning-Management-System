import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCoursesFailure,
  fetchCoursesStart,
  fetchCoursesSuccess,
} from "../store/slices/courseSlice";
import api from "../services/api";
import CourseCard from "../components/courses/CourseCard";
import LoadingState from "../components/common/LoadingState";
import ErrorState from "../components/common/ErrorState";
import EmptyState from "../components/common/EmptyState";

const Courses = () => {
  const dispatch = useDispatch();

  const { courses, loading, error } = useSelector((state) => state.courses);

  useEffect(() => {
    const loadCourse = async () => {
      dispatch(fetchCoursesStart());
      try {
        const response = await api.get("/courses");

        console.log("API response:", response.data);

        // Adjust this path to match your actual API response.
        const courseList = response.data.courses;
        dispatch(fetchCoursesSuccess(courseList));
      } catch (error) {
        dispatch(
          fetchCoursesFailure(error.response?.data?.error || error.message),
        );
      }
    };
    loadCourse();
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
            LearnHub
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            Explore Courses
          </h1>
          <p className="mt-2 text-slate-500">
            Discover courses and build your skills.
          </p>
        </div>

        {loading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState message={error} />
        ) : courses.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default Courses;
