import { useEffect, useState, useMemo } from "react";
import {
  BookOpen,
  Plus,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  XCircle,
  GraduationCap,
  X,
} from "lucide-react";
import api from "../services/api";
import InstructorCourseCard from "../components/instructor/InstructorCourseCard";
import CreateCourseModal from "../components/instructor/CreateCourseModal";

export default function InstructorCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);

  const fetchMyCourses = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get("/instructor/courses");
      setCourses(response.data.courses || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to load your courses. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    const loadCourses = async () => {
      try {
        const response = await api.get("/instructor/courses");
        if (active) setCourses(response.data.courses || []);
      } catch (err) {
        if (active) {
          setError(
            err.response?.data?.message ||
              "Failed to load your courses. Please try again.",
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    };
    loadCourses();
    return () => {
      active = false;
    };
  }, []);

  const handleCourseCreated = (newCourse) => {
    setSuccessMessage(
      `Course "${newCourse.title}" was published successfully!`,
    );
    fetchMyCourses();
  };

  const stats = useMemo(() => {
    const total = courses.length;
    const active = courses.filter((c) => c.status).length;
    const draft = total - active;
    return { total, active, draft };
  }, [courses]);

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wider text-indigo-700 shadow-xs">
              <GraduationCap size={14} /> Instructor Studio
            </div>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
              My Created Courses
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Author and publish your courses. Only your courses are accessible here.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={fetchMyCourses}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-50"
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>

            {/* Create New Course Button */}
            <button
              type="button"
              onClick={() => {
                setSuccessMessage("");
                setShowCreateModal(true);
              }}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
            >
              <Plus size={16} />
              Create Course
            </button>
          </div>
        </div>

        {/* Success Alert */}
        {successMessage && (
          <div className="mb-6 flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 size={18} className="shrink-0 text-emerald-600" />
              <p className="font-semibold">{successMessage}</p>
            </div>
            <button
              type="button"
              onClick={() => setSuccessMessage("")}
              className="text-emerald-600 hover:text-emerald-800"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
            <AlertCircle size={18} className="shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {/* Metric Cards */}
        <div className="mb-6 grid gap-4 grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">My Authored Courses</span>
              <span className="rounded-lg bg-indigo-50 p-2 text-indigo-600">
                <BookOpen size={16} />
              </span>
            </div>
            <p className="mt-2 text-2xl font-bold text-slate-900">{loading ? "..." : stats.total}</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Live / Published</span>
              <span className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
                <CheckCircle2 size={16} />
              </span>
            </div>
            <p className="mt-2 text-2xl font-bold text-slate-900">{loading ? "..." : stats.active}</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Drafts / Inactive</span>
              <span className="rounded-lg bg-amber-50 p-2 text-amber-600">
                <XCircle size={16} />
              </span>
            </div>
            <p className="mt-2 text-2xl font-bold text-slate-900">{loading ? "..." : stats.draft}</p>
          </div>
        </div>

        {/* Courses Listing */}
        {loading ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
            <p className="mt-3 text-sm font-medium text-slate-600">
              Loading your courses...
            </p>
          </div>
        ) : courses.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
              <BookOpen size={28} />
            </div>
            <h3 className="mt-4 text-lg font-bold text-slate-900">
              No courses created yet
            </h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
              You haven't authored any courses yet. Once you publish courses, they will appear here. No outside courses will ever be visible in your studio.
            </p>
            <button
              type="button"
              onClick={() => {
                setSuccessMessage("");
                setShowCreateModal(true);
              }}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-indigo-700"
            >
              <Plus size={15} /> Create your first course
            </button>
          </div>
        ) : (
          /* Courses Grid - Rendered using dedicated InstructorCourseCard */
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <InstructorCourseCard
                key={course._id}
                course={course}
                onCourseUpdated={fetchMyCourses}
              />
            ))}
          </div>
        )}

        {/* Full-Featured Course Creation Modal with Rigorous Verification */}
        <CreateCourseModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onCourseCreated={handleCourseCreated}
        />
      </div>
    </div>
  );
}
