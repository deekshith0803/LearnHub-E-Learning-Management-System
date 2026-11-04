import { useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  BookOpen,
  Search,
  Filter,
  User,
  CheckCircle2,
  XCircle,
  Pencil,
  Trash2,
  Power,
  X,
  IndianRupee,
  Save,
} from "lucide-react";
import api from "../../services/api";
import {
  toggleCourseStatusStart,
  toggleCourseStatusSuccess,
  toggleCourseStatusFailure,
  deleteCourseStart,
  deleteCourseSuccess,
  deleteCourseFailure,
} from "../../store/slices/adminSlice";

const ALL_CATEGORIES = [
  "Development",
  "Design",
  "Business",
  "Technology",
  "Marketing",
  "Data Science",
  "Photography",
  "Music",
];

export default function AdminCourseTable({ courses = [], loading = false }) {
  const dispatch = useDispatch();
  const { actionLoading } = useSelector((state) => state.admin);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  // State for Editing Course Modal
  const [editingCourse, setEditingCourse] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: "",
    category: "Development",
    level: "beginner",
    price: 0,
    duration: 1,
    description: "",
  });
  const [editError, setEditError] = useState("");

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set();
    courses.forEach((c) => {
      if (c.category) set.add(c.category);
    });
    return Array.from(set);
  }, [courses]);

  // Filtered courses
  const filteredCourses = useMemo(() => {
    return courses.filter((c) => {
      const matchSearch =
        (c.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.instructor?.name || "")
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        (c.instructor?.email || "")
          .toLowerCase()
          .includes(searchQuery.toLowerCase());

      const matchCategory =
        selectedCategory === "all" || c.category === selectedCategory;

      const matchStatus =
        selectedStatus === "all" ||
        (selectedStatus === "active" && c.status) ||
        (selectedStatus === "inactive" && !c.status);

      return matchSearch && matchCategory && matchStatus;
    });
  }, [courses, searchQuery, selectedCategory, selectedStatus]);

  // Handle Toggle Status (PUT /api/courses/:id)
  const handleToggleStatus = async (course) => {
    dispatch(toggleCourseStatusStart());
    try {
      const res = await api.put(`/courses/${course._id}`, {
        status: !course.status,
      });
      if (res.data?.success && res.data?.course) {
        dispatch(toggleCourseStatusSuccess(res.data.course));
      }
    } catch (err) {
      dispatch(
        toggleCourseStatusFailure(
          err.response?.data?.message || "Failed to toggle course status.",
        ),
      );
    }
  };

  // Handle Delete Course (DELETE /api/courses/:id)
  const handleDeleteCourse = async (course) => {
    const confirmed = window.confirm(
      `Are you sure you want to permanently delete "${course.title}" from LearnHub? This cannot be undone.`,
    );
    if (!confirmed) return;

    dispatch(deleteCourseStart());
    try {
      const res = await api.delete(`/courses/${course._id}`);
      if (res.data?.success) {
        dispatch(deleteCourseSuccess(course._id));
      }
    } catch (err) {
      dispatch(
        deleteCourseFailure(
          err.response?.data?.message || "Failed to delete course.",
        ),
      );
    }
  };

  // Open Edit Modal
  const handleOpenEdit = (course) => {
    setEditingCourse(course);
    setEditError("");
    setEditFormData({
      title: course.title || "",
      category: course.category || "Development",
      level: course.level || "beginner",
      price: course.price ?? 0,
      duration: course.duration ?? 1,
      description: course.description || "",
    });
  };

  // Save Edit Course (PUT /api/courses/:id)
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingCourse?._id) return;
    setEditError("");

    if (!editFormData.title.trim() || editFormData.title.trim().length < 3) {
      setEditError("Title must be at least 3 characters");
      return;
    }
    if (!editFormData.description.trim() || editFormData.description.trim().length < 10) {
      setEditError("Description must be at least 10 characters");
      return;
    }

    dispatch(toggleCourseStatusStart());
    try {
      const res = await api.put(`/courses/${editingCourse._id}`, {
        title: editFormData.title.trim(),
        category: editFormData.category.trim(),
        level: editFormData.level,
        price: Number(editFormData.price),
        duration: Number(editFormData.duration),
        description: editFormData.description.trim(),
      });

      if (res.data?.success && res.data?.course) {
        dispatch(toggleCourseStatusSuccess(res.data.course));
        setEditingCourse(null);
      }
    } catch (err) {
      setEditError(
        err.response?.data?.message || "Failed to update course details.",
      );
      dispatch(
        toggleCourseStatusFailure(
          err.response?.data?.message || "Failed to update course details.",
        ),
      );
    }
  };

  return (
    <div className="space-y-4">
      {/* Search and Filters Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by course title or instructor name/email..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-4 text-sm text-slate-800 placeholder-slate-400 transition focus:border-indigo-500 focus:bg-white focus:outline-none"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Category Filter */}
          <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600">
            <Filter size={14} className="text-slate-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-transparent font-medium text-slate-700 outline-none"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-transparent font-medium text-slate-700 outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Course Table Container */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Platform Courses
            </h2>
            <p className="text-xs text-slate-500">
              Showing {filteredCourses.length} of {courses.length} total registered courses
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs font-semibold uppercase text-slate-500">
              <tr>
                <th className="px-6 py-3.5">Course Info</th>
                <th className="px-6 py-3.5">Instructor</th>
                <th className="px-6 py-3.5">Category & Level</th>
                <th className="px-6 py-3.5">Price</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Moderation Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="h-7 w-7 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
                      <span className="text-xs font-medium">Loading platform courses...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredCourses.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-1.5">
                      <BookOpen size={28} className="text-slate-300" />
                      <p className="text-sm font-semibold text-slate-600">No courses found</p>
                      <p className="text-xs text-slate-400">
                        Try adjusting your search query or category filters.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredCourses.map((course) => (
                  <tr key={course._id} className="hover:bg-slate-50/60 transition">
                    {/* Course Title and thumbnail */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {course.thumbnail ? (
                          <img
                            src={course.thumbnail}
                            alt=""
                            className="h-11 w-16 rounded-lg object-cover border border-slate-200 shrink-0"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                            }}
                          />
                        ) : (
                          <div className="flex h-11 w-16 items-center justify-center rounded-lg bg-indigo-50 text-indigo-500 border border-indigo-100 shrink-0">
                            <BookOpen size={20} />
                          </div>
                        )}
                        <div>
                          <div className="font-semibold text-slate-900 line-clamp-1 max-w-xs">
                            {course.title}
                          </div>
                          <div className="text-xs text-slate-400 line-clamp-1 max-w-xs mt-0.5">
                            {course.description || "No description"}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Instructor Info */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-slate-600 shrink-0">
                          <User size={13} />
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-slate-800">
                            {course.instructor?.name || "Unknown Author"}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            {course.instructor?.email || ""}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Category & Level */}
                    <td className="px-6 py-4">
                      <div className="flex flex-col items-start gap-1">
                        <span className="inline-flex rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
                          {course.category}
                        </span>
                        <span className="text-[11px] font-medium text-slate-400 capitalize">
                          {course.level || "beginner"}
                        </span>
                      </div>
                    </td>

                    {/* Price */}
                    <td className="px-6 py-4">
                      <span className="font-semibold text-slate-900 inline-flex items-center">
                        <IndianRupee size={13} />
                        {course.price === 0 ? "Free" : course.price}
                      </span>
                    </td>

                    {/* Status Badge */}
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          course.status
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-red-50 text-red-700 border border-red-200"
                        }`}
                      >
                        {course.status ? (
                          <>
                            <CheckCircle2 size={12} /> Published
                          </>
                        ) : (
                          <>
                            <XCircle size={12} /> Disabled
                          </>
                        )}
                      </span>
                    </td>

                    {/* Moderation Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Edit Button */}
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(course)}
                          disabled={actionLoading}
                          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600 disabled:opacity-50"
                          title="Edit Course Metadata"
                        >
                          <Pencil size={13} />
                          <span>Edit</span>
                        </button>

                        {/* Status Toggle Action (PUT /api/courses/:id) */}
                        <button
                          type="button"
                          disabled={actionLoading}
                          onClick={() => handleToggleStatus(course)}
                          className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition disabled:opacity-50 ${
                            course.status
                              ? "border-amber-200 text-amber-700 hover:bg-amber-50"
                              : "border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                          }`}
                          title="Toggle Status (Publish/Disable)"
                        >
                          <Power size={13} />
                          <span>{course.status ? "Disable" : "Publish"}</span>
                        </button>

                        {/* Delete Action (DELETE /api/courses/:id) */}
                        <button
                          type="button"
                          disabled={actionLoading}
                          onClick={() => handleDeleteCourse(course)}
                          className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white p-1.5 text-slate-400 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                          title="Delete Course from Platform"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Course Modal */}
      {editingCourse && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs animate-in fade-in duration-150"
        >
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-indigo-600 font-bold">
                <Pencil size={18} />
                <h3 className="text-base text-slate-900">
                  Edit Course Details (Admin)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingCourse(null)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X size={18} />
              </button>
            </div>

            {editError && (
              <div className="mt-3 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-600">
                {editError}
              </div>
            )}

            <form onSubmit={handleSaveEdit} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Course Title
                </label>
                <input
                  type="text"
                  required
                  value={editFormData.title}
                  onChange={(e) =>
                    setEditFormData((p) => ({ ...p, title: e.target.value }))
                  }
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Category
                  </label>
                  <select
                    value={editFormData.category}
                    onChange={(e) =>
                      setEditFormData((p) => ({ ...p, category: e.target.value }))
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none"
                  >
                    {ALL_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Difficulty Level
                  </label>
                  <select
                    value={editFormData.level}
                    onChange={(e) =>
                      setEditFormData((p) => ({ ...p, level: e.target.value }))
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Price (INR)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={editFormData.price}
                    onChange={(e) =>
                      setEditFormData((p) => ({ ...p, price: e.target.value }))
                    }
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Duration (Hours)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={editFormData.duration}
                    onChange={(e) =>
                      setEditFormData((p) => ({ ...p, duration: e.target.value }))
                    }
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  required
                  value={editFormData.description}
                  onChange={(e) =>
                    setEditFormData((p) => ({
                      ...p,
                      description: e.target.value,
                    }))
                  }
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="mt-5 flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingCourse(null)}
                  className="rounded-xl border border-slate-200 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 font-semibold text-white hover:bg-indigo-700 transition disabled:opacity-50"
                >
                  <Save size={14} />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
