import { useEffect, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Shield,
  RefreshCw,
  AlertCircle,
  BookOpen,
  CheckCircle2,
  XCircle,
  Users,
  Check,
} from "lucide-react";
import api from "../services/api";
import AdminCourseTable from "../components/admin/AdminCourseTable";
import {
  fetchAdminCoursesStart,
  fetchAdminCoursesSuccess,
  fetchAdminCoursesFailure,
  clearAdminFeedback,
} from "../store/slices/adminSlice";

export default function AdminCourses() {
  const dispatch = useDispatch();
  const {
    courses,
    coursesLoading,
    coursesError,
    actionSuccess,
    actionError,
  } = useSelector((state) => state.admin);

  const fetchAllPlatformCourses = useCallback(async () => {
    dispatch(fetchAdminCoursesStart());
    try {
      const response = await api.get("/admin/courses");
      dispatch(fetchAdminCoursesSuccess(response.data.courses || []));
    } catch (err) {
      dispatch(
        fetchAdminCoursesFailure(
          err.response?.data?.message ||
            "Failed to load platform courses. Please try again.",
        ),
      );
    }
  }, [dispatch]);

  useEffect(() => {
    fetchAllPlatformCourses();
  }, [fetchAllPlatformCourses]);

  // Compute platform metrics for overview
  const stats = useMemo(() => {
    const total = courses.length;
    const active = courses.filter((c) => c.status).length;
    const inactive = total - active;
    const instructorSet = new Set();
    courses.forEach((c) => {
      if (c.instructor?._id || c.instructor) {
        instructorSet.add(c.instructor?._id || c.instructor);
      }
    });

    return {
      total,
      active,
      inactive,
      totalInstructors: instructorSet.size,
    };
  }, [courses]);

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wider text-indigo-700 shadow-xs">
              <Shield size={14} /> Admin Platform Governance
            </div>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
              Platform Course Management
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Complete oversight of all courses published across LearnHub by all instructors.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchAllPlatformCourses}
            disabled={coursesLoading}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-50"
          >
            <RefreshCw size={16} className={coursesLoading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {/* Global Feedback Notifications from Redux */}
        {actionSuccess && (
          <div className="mb-6 flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800 animate-in fade-in">
            <div className="flex items-center gap-2.5">
              <Check size={18} className="text-emerald-600 shrink-0" />
              <span>{actionSuccess}</span>
            </div>
            <button
              type="button"
              onClick={() => dispatch(clearAdminFeedback())}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-900"
            >
              Dismiss
            </button>
          </div>
        )}

        {(coursesError || actionError) && (
          <div className="mb-6 flex items-center justify-between rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600 animate-in fade-in">
            <div className="flex items-center gap-2.5">
              <AlertCircle size={18} className="shrink-0" />
              <span>{coursesError || actionError}</span>
            </div>
            <button
              type="button"
              onClick={() => dispatch(clearAdminFeedback())}
              className="text-xs font-semibold text-red-700 hover:text-red-900"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Platform Course Metrics */}
        <div className="mb-6 grid gap-4 grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Total Courses</span>
              <span className="rounded-lg bg-indigo-50 p-2 text-indigo-600">
                <BookOpen size={16} />
              </span>
            </div>
            <p className="mt-2 text-2xl font-bold text-slate-900">
              {coursesLoading ? "..." : stats.total}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Published</span>
              <span className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
                <CheckCircle2 size={16} />
              </span>
            </div>
            <p className="mt-2 text-2xl font-bold text-slate-900">
              {coursesLoading ? "..." : stats.active}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Disabled / Draft</span>
              <span className="rounded-lg bg-red-50 p-2 text-red-600">
                <XCircle size={16} />
              </span>
            </div>
            <p className="mt-2 text-2xl font-bold text-slate-900">
              {coursesLoading ? "..." : stats.inactive}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Instructors</span>
              <span className="rounded-lg bg-sky-50 p-2 text-sky-600">
                <Users size={16} />
              </span>
            </div>
            <p className="mt-2 text-2xl font-bold text-slate-900">
              {coursesLoading ? "..." : stats.totalInstructors}
            </p>
          </div>
        </div>

        {/* Dedicated Admin Course Component */}
        <AdminCourseTable courses={courses} loading={coursesLoading} />
      </div>
    </div>
  );
}
