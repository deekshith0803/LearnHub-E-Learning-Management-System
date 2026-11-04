import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Search, X, SlidersHorizontal, BookOpen } from "lucide-react";
import {
  fetchCoursesFailure,
  fetchCoursesStart,
  fetchCoursesSuccess,
} from "../store/slices/courseSlice";
import api from "../services/api";
import CourseCard from "../components/courses/CourseCard";
import LoadingState from "../components/common/LoadingState";
import ErrorState from "../components/common/ErrorState";

const CATEGORIES = [
  "All",
  "Development",
  "Design",
  "Business",
  "Technology",
];

const Courses = () => {
  const dispatch = useDispatch();
  const { courses, loading, error } = useSelector((state) => state.courses);

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Debounce search input to avoid excessive API requests
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 350);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch courses whenever search or category changes
  useEffect(() => {
    let cancelled = false;

    const loadCourses = async () => {
      dispatch(fetchCoursesStart());
      try {
        const params = {};
        if (debouncedSearch.trim()) {
          params.search = debouncedSearch.trim();
        }
        if (selectedCategory && selectedCategory !== "All") {
          params.category = selectedCategory;
        }

        const response = await api.get("/courses", { params });

        if (!cancelled) {
          dispatch(fetchCoursesSuccess(response.data.courses || []));
        }
      } catch (err) {
        if (!cancelled) {
          dispatch(
            fetchCoursesFailure(
              err.response?.data?.message ||
                err.response?.data?.error ||
                err.message ||
                "Unable to load courses.",
            ),
          );
        }
      }
    };

    loadCourses();

    return () => {
      cancelled = true;
    };
  }, [debouncedSearch, selectedCategory, dispatch]);

  const handleClearSearch = () => {
    setSearchTerm("");
    setDebouncedSearch("");
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setDebouncedSearch("");
    setSelectedCategory("All");
  };

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 px-4 py-10 sm:px-6 lg:px-10 text-slate-900 dark:text-slate-100 transition-colors">
      <div className="mx-auto max-w-7xl">
        {/* Page Header */}
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            LearnHub Catalog
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Explore Courses
          </h1>
          <p className="mt-2 text-slate-500 dark:text-slate-400">
            Search our library of courses, lessons, and assessments to build your skills.
          </p>
        </div>

        {/* Search and Category Filter Section */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            {/* Search Input Bar */}
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search courses by title, topic, or description..."
                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white py-3 pl-10 pr-10 text-sm shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-950"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>

          {/* Category Filter Chips */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="mr-1 flex items-center gap-1 text-xs font-semibold uppercase text-slate-400">
              <SlidersHorizontal size={13} /> Categories:
            </span>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-full px-4 py-1.5 text-xs font-medium transition ${
                  selectedCategory === cat
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Results Count Summary */}
        {!loading && !error && (
          <div className="mb-6 flex items-center justify-between text-xs text-slate-500">
            <span>
              Showing{" "}
              <strong className="text-slate-800">{courses.length}</strong>{" "}
              {courses.length === 1 ? "course" : "courses"}
              {debouncedSearch && (
                <span>
                  {" "}matching &ldquo;
                  <strong className="text-indigo-600">{debouncedSearch}</strong>
                  &rdquo;
                </span>
              )}
              {selectedCategory !== "All" && (
                <span>
                  {" "}in <strong className="text-slate-800">{selectedCategory}</strong>
                </span>
              )}
            </span>

            {(debouncedSearch || selectedCategory !== "All") && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="font-semibold text-indigo-600 hover:text-indigo-700 hover:underline"
              >
                Reset filters
              </button>
            )}
          </div>
        )}

        {/* Courses Grid / Loading / Error / Empty States */}
        {loading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState message={error} />
        ) : courses.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-500">
              <Search size={26} />
            </div>
            <h2 className="mt-4 text-lg font-bold text-slate-900">
              No matching courses found
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
              {debouncedSearch
                ? `We couldn't find any courses matching "${debouncedSearch}". Try another keyword or reset filters.`
                : "No courses are currently available in this category."}
            </p>
            <button
              type="button"
              onClick={handleResetFilters}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
            >
              <BookOpen size={16} /> View all courses
            </button>
          </div>
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
