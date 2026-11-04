import { useState } from "react";
import {
  BookOpen,
  Clock,
  IndianRupee,
  CheckCircle2,
  XCircle,
  Pencil,
  Video,
  Trash2,
  Power,
  X,
  Save,
  HelpCircle,
} from "lucide-react";
import ManageLessonsModal from "./ManageLessonsModal";
import ManageQuizModal from "./ManageQuizModal";
import api from "../../services/api";

const CATEGORIES = [
  "Development",
  "Design",
  "Business",
  "Technology",
  "Marketing",
  "Data Science",
  "Photography",
  "Music",
];

export default function InstructorCourseCard({ course, onCourseUpdated }) {
  const [showLessonsModal, setShowLessonsModal] = useState(false);
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState("");

  const [editData, setEditData] = useState({
    title: course.title || "",
    category: course.category || "Development",
    level: course.level || "beginner",
    price: course.price ?? 0,
    duration: course.duration ?? 1,
    description: course.description || "",
  });

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    setEditError("");

    if (!editData.title.trim() || editData.title.trim().length < 3) {
      setEditError("Title must be at least 3 characters");
      return;
    }

    if (!editData.description.trim() || editData.description.trim().length < 10) {
      setEditError("Description must be at least 10 characters");
      return;
    }

    setEditLoading(true);
    try {
      await api.put(`/courses/${course._id}`, {
        title: editData.title.trim(),
        category: editData.category.trim(),
        level: editData.level,
        price: Number(editData.price),
        duration: Number(editData.duration),
        description: editData.description.trim(),
      });
      setIsEditing(false);
      if (onCourseUpdated) onCourseUpdated();
    } catch (err) {
      setEditError(
        err.response?.data?.message || "Failed to update course. Please try again.",
      );
    } finally {
      setEditLoading(false);
    }
  };

  const handleToggleStatus = async () => {
    try {
      await api.put(`/courses/${course._id}`, { status: !course.status });
      if (onCourseUpdated) onCourseUpdated();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update course status.");
    }
  };

  const handleDeleteCourse = async () => {
    if (!window.confirm(`Are you sure you want to delete "${course.title}"? This cannot be undone.`)) {
      return;
    }
    try {
      await api.delete(`/courses/${course._id}`);
      if (onCourseUpdated) onCourseUpdated();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete course.");
    }
  };

  return (
    <>
      <div className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
        {/* Course Thumbnail */}
        <div className="relative h-44 bg-slate-100">
          {course.thumbnail ? (
            <img
              src={course.thumbnail}
              alt={course.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-slate-400">
              <BookOpen size={40} />
            </div>
          )}

          <span className="absolute right-3 top-3 rounded-lg bg-indigo-600/90 px-2.5 py-1 text-xs font-semibold text-white shadow-xs">
            {course.category || "General"}
          </span>

          <span className="absolute left-3 top-3 rounded-lg bg-black/60 px-2 py-0.5 text-[11px] font-medium text-white backdrop-blur-xs">
            {course.level || "Beginner"}
          </span>
        </div>

        {/* Course Content */}
        <div className="flex flex-1 flex-col p-5">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1 font-medium text-slate-600">
              <Clock size={13} />
              {course.duration ? `${course.duration} hrs` : "Self-paced"}
            </span>
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                course.status
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-red-50 text-red-700"
              }`}
            >
              {course.status ? (
                <>
                  <CheckCircle2 size={12} /> Published
                </>
              ) : (
                <>
                  <XCircle size={12} /> Draft
                </>
              )}
            </span>
          </div>

          <h3 className="mt-2.5 text-base font-bold text-slate-900 line-clamp-1" title={course.title}>
            {course.title}
          </h3>

          <p className="mt-1 flex-1 text-xs leading-5 text-slate-500 line-clamp-2">
            {course.description || "No description provided."}
          </p>

          <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">
            <span className="text-slate-400">Tuition Fee</span>
            <span className="flex items-center font-bold text-slate-900 text-sm">
              <IndianRupee size={15} />
              {course.price || 0}
            </span>
          </div>

          {/* Action Bar */}
          <div className="mt-4 border-t border-slate-100 pt-3 flex items-center justify-between gap-1.5">
            {/* Edit Button */}
            <button
              type="button"
              onClick={() => {
                setEditData({
                  title: course.title || "",
                  category: course.category || "Development",
                  level: course.level || "beginner",
                  price: course.price ?? 0,
                  duration: course.duration ?? 1,
                  description: course.description || "",
                });
                setIsEditing(true);
              }}
              className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50/60 px-3 py-2 text-xs font-semibold text-indigo-700 transition hover:bg-indigo-100"
              title="Edit course details"
            >
              <Pencil size={13} />
              <span>Edit</span>
            </button>

            {/* Lessons Button */}
            <button
              type="button"
              onClick={() => setShowLessonsModal(true)}
              className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50/40 px-3 py-2 text-xs font-semibold text-indigo-700 transition hover:bg-indigo-100"
              title="Manage curriculum & add video lessons"
            >
              <Video size={13} />
              <span>Lessons</span>
            </button>

            {/* Quiz Button */}
            <button
              type="button"
              onClick={() => setShowQuizModal(true)}
              className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50/40 px-3 py-2 text-xs font-semibold text-indigo-700 transition hover:bg-indigo-100"
              title="Manage course quizzes & tests"
            >
              <HelpCircle size={13} />
              <span>Quiz</span>
            </button>

            {/* Status Toggle Button */}
            <button
              type="button"
              onClick={handleToggleStatus}
              className={`inline-flex items-center justify-center rounded-xl border p-2 transition ${
                course.status
                  ? "border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100"
                  : "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
              }`}
              title={course.status ? "Unpublish Course (Set to Draft)" : "Publish Course (Make Active)"}
            >
              <Power size={14} />
            </button>

            {/* Delete Button */}
            <button
              type="button"
              onClick={handleDeleteCourse}
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white p-2 text-slate-400 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
              title="Delete Course"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Edit Course Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-xl animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Edit Course Details
                </h3>
                <p className="text-xs text-slate-500">
                  Update course metadata, pricing, and description.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X size={18} />
              </button>
            </div>

            {editError && (
              <div className="mt-3 rounded-xl border border-red-200 bg-red-50 p-2.5 text-xs text-red-600">
                {editError}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSaveEdit} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-slate-700">Course Title</label>
                <input
                  type="text"
                  name="title"
                  value={editData.title}
                  onChange={handleEditChange}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-slate-800 outline-none focus:border-indigo-500 focus:bg-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700">Category</label>
                  <select
                    name="category"
                    value={editData.category}
                    onChange={handleEditChange}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-slate-800 outline-none focus:border-indigo-500 focus:bg-white"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700">Level</label>
                  <select
                    name="level"
                    value={editData.level}
                    onChange={handleEditChange}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-slate-800 outline-none focus:border-indigo-500 focus:bg-white"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700">Price (INR)</label>
                  <input
                    type="number"
                    name="price"
                    min="0"
                    value={editData.price}
                    onChange={handleEditChange}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-slate-800 outline-none focus:border-indigo-500 focus:bg-white"
                    required
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700">Duration (Hours)</label>
                  <input
                    type="number"
                    name="duration"
                    step="0.5"
                    min="0.5"
                    value={editData.duration}
                    onChange={handleEditChange}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-slate-800 outline-none focus:border-indigo-500 focus:bg-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700">Description</label>
                <textarea
                  name="description"
                  rows={3}
                  value={editData.description}
                  onChange={handleEditChange}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-slate-800 outline-none focus:border-indigo-500 focus:bg-white"
                  required
                />
              </div>

              {/* Modal Footer */}
              <div className="mt-5 flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  disabled={editLoading}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editLoading}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-indigo-700 disabled:opacity-50"
                >
                  <Save size={13} />
                  <span>{editLoading ? "Saving..." : "Save Changes"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lesson Management Modal */}
      <ManageLessonsModal
        isOpen={showLessonsModal}
        onClose={() => setShowLessonsModal(false)}
        course={course}
      />

      {/* Quiz Management Modal */}
      <ManageQuizModal
        isOpen={showQuizModal}
        onClose={() => setShowQuizModal(false)}
        course={course}
      />
    </>
  );
}
