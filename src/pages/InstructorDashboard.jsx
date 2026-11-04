import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  ClipboardList,
  Plus,
  Users,
  Video,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  XCircle,
  IndianRupee,
  Layers,
} from "lucide-react";
import { useSelector } from "react-redux";
import api from "../services/api";

export default function InstructorDashboard() {
  const { user } = useSelector((state) => state.auth);
  const firstName = user?.name?.trim()?.split(/\s+/)[0] || "Instructor";

  const [stats, setStats] = useState({
    totalCourses: 0,
    activeCourses: 0,
    draftCourses: 0,
    totalLessons: 0,
    totalEnrollments: 0,
    totalQuizzes: 0,
    recentCourses: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/instructor/stats");
      if (res.data?.success && res.data?.stats) {
        setStats(res.data.stats);
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to load instructor statistics.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    const loadStats = async () => {
      try {
        const res = await api.get("/instructor/stats");
        if (active && res.data?.success && res.data?.stats) {
          setStats(res.data.stats);
        }
      } catch (err) {
        if (active) {
          setError(
            err.response?.data?.message || "Failed to load instructor statistics.",
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };
    loadStats();
    return () => {
      active = false;
    };
  }, []);

  const summaryCards = [
    {
      label: "Your Courses",
      value: stats.totalCourses,
      note: `${stats.activeCourses || 0} Published • ${stats.draftCourses || 0} Draft`,
      icon: BookOpen,
      iconClass: "bg-indigo-50 text-indigo-600",
    },
    {
      label: "Total Learners",
      value: stats.totalEnrollments,
      note: "Learners enrolled in your courses",
      icon: Users,
      iconClass: "bg-sky-50 text-sky-600",
    },
    {
      label: "Lessons Published",
      value: stats.totalLessons,
      note: "Video lessons across all curriculum",
      icon: Video,
      iconClass: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "Course Quizzes",
      value: stats.totalQuizzes,
      note: "Assessments created for learners",
      icon: ClipboardList,
      iconClass: "bg-amber-50 text-amber-600",
    },
  ];

  const quickActions = [
    {
      title: "Manage Courses",
      description: "Review your courses, edit metadata, and toggle publishing status.",
      icon: BookOpen,
      to: "/instructor/courses",
    },
    {
      title: "Curriculum & Video Lessons",
      description: "Upload video lessons and organize course chapters.",
      icon: Video,
      to: "/instructor/courses",
    },
    {
      title: "Quiz Management",
      description: "Build assessments with multiple choice questions and answer keys.",
      icon: ClipboardList,
      to: "/instructor/courses",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-indigo-700">
                Instructor Workspace
              </span>
              {loading && (
                <span className="inline-flex items-center gap-1 text-xs text-slate-400">
                  <RefreshCw size={12} className="animate-spin" />
                  Updating stats...
                </span>
              )}
            </div>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Welcome back, {firstName}
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
              Monitor your teaching statistics, manage your course curriculum, and keep track of your learners.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={fetchStats}
              disabled={loading}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 disabled:opacity-50 transition"
              title="Refresh statistics"
            >
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
              <span>Refresh</span>
            </button>

            <Link
              to="/instructor/courses"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white shadow-xs transition hover:bg-indigo-700"
            >
              <Plus size={16} />
              <span>Go to My Courses</span>
            </Link>
          </div>
        </div>

        {/* Error notification */}
        {error && (
          <div className="mb-6 flex items-center justify-between rounded-xl border border-red-200 bg-red-50 p-4 text-xs text-red-800">
            <div className="flex items-center gap-2">
              <AlertCircle size={16} className="text-red-600 shrink-0" />
              <p className="font-medium">{error}</p>
            </div>
            <button
              type="button"
              onClick={fetchStats}
              className="font-bold underline hover:no-underline"
            >
              Retry
            </button>
          </div>
        )}

        {/* 4 Summary Cards */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {summaryCards.map(({ label, value, note, icon: Icon, iconClass }) => (
            <section
              key={label}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs transition hover:border-slate-300"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    {label}
                  </p>
                  <p className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">
                    {loading ? (
                      <span className="inline-block h-8 w-12 animate-pulse rounded bg-slate-200" />
                    ) : (
                      value
                    )}
                  </p>
                </div>
                <span className={`rounded-xl p-3 ${iconClass}`}>
                  <Icon size={22} />
                </span>
              </div>
              <p className="mt-3 text-xs text-slate-500 font-medium">{note}</p>
            </section>
          ))}
        </div>

        {/* Main Grid: Recent Courses & Quick Actions */}
        <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          {/* Recent Courses Section */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <Layers size={18} />
                </span>
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    Your Courses & Performance
                  </h2>
                  <p className="text-xs text-slate-500">
                    Live overview of your created courses, learners, and curriculum.
                  </p>
                </div>
              </div>

              <Link
                to="/instructor/courses"
                className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
              >
                <span>View all</span>
                <ArrowRight size={13} />
              </Link>
            </div>

            {loading ? (
              <div className="py-16 text-center text-slate-400 flex flex-col items-center justify-center">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
                <p className="mt-2 text-xs">Loading course performance...</p>
              </div>
            ) : !stats.recentCourses || stats.recentCourses.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/60 p-8 text-center flex flex-col items-center justify-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 mb-3">
                  <BookOpen size={24} />
                </div>
                <h3 className="text-sm font-bold text-slate-800">
                  No courses created yet
                </h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm">
                  Create your first course to begin publishing video lessons, quizzes, and enrolling learners.
                </p>
                <Link
                  to="/instructor/courses"
                  className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-indigo-700 transition"
                >
                  <Plus size={14} />
                  <span>Create Your First Course</span>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {stats.recentCourses.map((c) => (
                  <div
                    key={c._id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-4 hover:border-slate-200 transition"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="rounded-md bg-indigo-100 px-2 py-0.5 text-[10px] font-semibold text-indigo-700">
                          {c.category || "General"}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                            c.status
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-red-50 text-red-700"
                          }`}
                        >
                          {c.status ? (
                            <>
                              <CheckCircle2 size={10} /> Published
                            </>
                          ) : (
                            <>
                              <XCircle size={10} /> Draft
                            </>
                          )}
                        </span>
                      </div>

                      <h4
                        className="mt-1 text-sm font-bold text-slate-900 truncate"
                        title={c.title}
                      >
                        {c.title}
                      </h4>

                      <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                        <span className="flex items-center gap-1 text-slate-700 font-medium">
                          <Users size={12} className="text-slate-400" />
                          {c.enrollments} {c.enrollments === 1 ? "Learner" : "Learners"}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Video size={12} className="text-slate-400" />
                          {c.lessonsCount} Lessons
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <ClipboardList size={12} className="text-slate-400" />
                          {c.quizzesCount} Quizzes
                        </span>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 border-slate-200/60 pt-2 sm:pt-0 shrink-0">
                      <span className="flex items-center font-bold text-slate-900 text-xs sm:text-sm">
                        <IndianRupee size={13} />
                        {c.price || 0}
                      </span>
                      <Link
                        to="/instructor/courses"
                        className="mt-1 text-xs font-semibold text-indigo-600 hover:underline"
                      >
                        Manage →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Right Column: Quick Actions & Curriculum Summary */}
          <div className="space-y-6">
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs">
              <h2 className="text-base font-bold text-slate-900">Quick Actions</h2>
              <p className="mt-0.5 text-xs text-slate-500">
                Shortcuts for your course creation and management workflow.
              </p>

              <div className="mt-4 space-y-3">
                {quickActions.map(({ title, description, icon: Icon, to }) => (
                  <Link
                    key={title}
                    to={to}
                    className="group flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-3.5 transition hover:border-indigo-200 hover:bg-indigo-50/40"
                  >
                    <span className="rounded-lg bg-white p-2 text-slate-600 shadow-2xs transition group-hover:text-indigo-600">
                      <Icon size={18} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition">
                        {title}
                      </span>
                      <span className="mt-0.5 block text-[11px] leading-4 text-slate-500">
                        {description}
                      </span>
                    </span>
                    <ArrowRight
                      size={14}
                      className="mt-1 shrink-0 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-indigo-600"
                    />
                  </Link>
                ))}
              </div>
            </section>

            {/* Publishing Status Card */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Course Distribution Overview
              </h3>
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 font-medium text-slate-700">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                    Published (Active)
                  </span>
                  <span className="font-bold text-slate-900">
                    {stats.activeCourses || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 font-medium text-slate-700">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                    Draft Courses
                  </span>
                  <span className="font-bold text-slate-900">
                    {stats.draftCourses || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
                  <span className="font-semibold text-slate-500">
                    Average Lessons / Course
                  </span>
                  <span className="font-bold text-slate-900">
                    {stats.totalCourses > 0
                      ? (stats.totalLessons / stats.totalCourses).toFixed(1)
                      : 0}
                  </span>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}