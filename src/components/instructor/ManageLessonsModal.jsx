import { useState, useEffect, useCallback } from "react";
import {
  X,
  Video,
  Plus,
  Trash2,
  Clock,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  BookOpen,
  Pencil,
} from "lucide-react";
import api from "../../services/api";

function getYouTubeEmbedUrl(url) {
  if (!url) return null;
  const videoId = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/))([^&?/]+)/,
  )?.[1];
  return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
}

export default function ManageLessonsModal({ isOpen, onClose, course }) {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    videoUrl: "",
    duration: 15,
    order: 1,
  });

  const [formErrors, setFormErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [editingLessonId, setEditingLessonId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const courseId = course?._id;

  const fetchLessons = useCallback(async () => {
    if (!courseId) return;
    setLoading(true);
    setError("");
    try {
      const res = await api.get(`/courses/${courseId}/lessons`);
      setLessons(res.data.lessons || []);
    } catch (err) {
      if (err.response?.status === 404) {
        setLessons([]);
      } else {
        setError(
          err.response?.data?.message || "Failed to load course lessons.",
        );
      }
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    let active = true;
    if (isOpen && courseId) {
      const load = async () => {
        try {
          const res = await api.get(`/courses/${courseId}/lessons`);
          if (active) setLessons(res.data.lessons || []);
        } catch (err) {
          if (active) {
            if (err.response?.status === 404) {
              setLessons([]);
            } else {
              setError(err.response?.data?.message || "Failed to load course lessons.");
            }
          }
        } finally {
          if (active) setLoading(false);
        }
      };
      load();
    }
    return () => {
      active = false;
    };
  }, [isOpen, courseId]);

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.title.trim() || formData.title.trim().length < 3) {
      errs.title = "Lesson title is required (at least 3 characters)";
    }
    if (!formData.description.trim() || formData.description.trim().length < 5) {
      errs.description = "Description is required (at least 5 characters)";
    }
    if (!formData.videoUrl.trim()) {
      errs.videoUrl = "Video URL is required";
    } else if (
      !formData.videoUrl.startsWith("http://") &&
      !formData.videoUrl.startsWith("https://")
    ) {
      errs.videoUrl = "Video URL must start with http:// or https://";
    }
    const numDuration = Number(formData.duration);
    if (isNaN(numDuration) || numDuration <= 0) {
      errs.duration = "Duration must be greater than 0 minutes";
    }
    const numOrder = Number(formData.order);
    if (isNaN(numOrder) || numOrder <= 0) {
      errs.order = "Order must be a positive number";
    }

    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleStartEdit = (lesson) => {
    setEditingLessonId(lesson._id);
    setFormData({
      title: lesson.title || "",
      description: lesson.description || "",
      videoUrl: lesson.videoUrl || "",
      duration: lesson.duration || 15,
      order: lesson.order || 1,
    });
    setFormErrors({});
    setError("");
    setSuccessMsg("");
  };

  const handleCancelEdit = () => {
    setEditingLessonId(null);
    setFormData({
      title: "",
      description: "",
      videoUrl: "",
      duration: 15,
      order: lessons.length + 1,
    });
    setFormErrors({});
  };

  const handleSaveLesson = async (e) => {
    e.preventDefault();
    setSuccessMsg("");
    setError("");

    if (!validate()) return;

    setSaving(true);
    try {
      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        videoUrl: formData.videoUrl.trim(),
        duration: Number(formData.duration),
        order: Number(formData.order),
      };

      if (editingLessonId) {
        const res = await api.put(`/lessons/${editingLessonId}`, payload);
        if (res.data?.success) {
          setSuccessMsg(`"${formData.title}" updated successfully!`);
          handleCancelEdit();
          await fetchLessons();
        }
      } else {
        const res = await api.post(`/courses/${courseId}/lessons`, payload);
        if (res.data?.success) {
          setSuccessMsg(`"${formData.title}" added to course lessons!`);
          setFormData({
            title: "",
            description: "",
            videoUrl: "",
            duration: 15,
            order: lessons.length + 2,
          });
          await fetchLessons();
        }
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          (editingLessonId
            ? "Failed to update lesson."
            : "Failed to add lesson. Please try again."),
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteLesson = async (lessonId, lessonTitle) => {
    if (!window.confirm(`Are you sure you want to delete "${lessonTitle}"?`)) {
      return;
    }

    if (editingLessonId === lessonId) {
      handleCancelEdit();
    }

    setDeletingId(lessonId);
    setError("");
    setSuccessMsg("");
    try {
      await api.delete(`/lessons/${lessonId}`);
      setSuccessMsg(`"${lessonTitle}" was deleted.`);
      await fetchLessons();
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to delete lesson.",
      );
    } finally {
      setDeletingId(null);
    }
  };

  const embedUrl = getYouTubeEmbedUrl(formData.videoUrl);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs overflow-y-auto">
      <div className="relative my-8 w-full max-w-4xl rounded-2xl border border-slate-200 bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-slate-50/80 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm shadow-indigo-200">
              <Video size={20} />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900">
                  Course Lessons & Curriculum
                </h2>
                <span className="rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-semibold text-indigo-700">
                  {lessons.length} {lessons.length === 1 ? "Lesson" : "Lessons"}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Course: <span className="font-semibold text-slate-700">{course?.title}</span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-200/60 hover:text-slate-700"
          >
            <X size={20} />
          </button>
        </div>

        {/* Notifications */}
        {successMsg && (
          <div className="mx-6 mt-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800">
            <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
            <p className="font-medium">{successMsg}</p>
          </div>
        )}

        {error && (
          <div className="mx-6 mt-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-800">
            <AlertCircle size={16} className="text-red-600 shrink-0" />
            <p className="font-medium">{error}</p>
          </div>
        )}

        <div className="p-6 grid grid-cols-1 lg:grid-cols-[1.1fr_1.1fr] gap-6 max-h-[75vh] overflow-y-auto">
          {/* LEFT: Add / Edit Lesson Form */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                {editingLessonId ? (
                  <>
                    <Pencil size={16} className="text-amber-600" />
                    Edit Video Lesson
                  </>
                ) : (
                  <>
                    <Plus size={16} className="text-indigo-600" />
                    Add New Video Lesson
                  </>
                )}
              </h3>
              {editingLessonId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="rounded-lg px-2 py-1 text-[11px] font-semibold text-slate-500 hover:bg-slate-200/60 hover:text-slate-800 transition"
                >
                  Cancel Edit
                </button>
              )}
            </div>

            <form onSubmit={handleSaveLesson} className="space-y-3.5 pt-1">
              {/* Lesson Title */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Lesson Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g. Introduction to HTML & Semantic Elements"
                  className={`w-full rounded-xl border bg-white px-3 py-2 text-xs text-slate-800 placeholder-slate-400 outline-none transition ${
                    formErrors.title
                      ? "border-red-300 focus:border-red-500"
                      : "border-slate-200 focus:border-indigo-500"
                  }`}
                />
                {formErrors.title && (
                  <p className="mt-1 text-[11px] text-red-600">{formErrors.title}</p>
                )}
              </div>

              {/* Video URL */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Video URL (Paste your video link) <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  name="videoUrl"
                  value={formData.videoUrl}
                  onChange={handleInputChange}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className={`w-full rounded-xl border bg-white px-3 py-2 text-xs text-slate-800 placeholder-slate-400 outline-none transition ${
                    formErrors.videoUrl
                      ? "border-red-300 focus:border-red-500"
                      : "border-slate-200 focus:border-indigo-500"
                  }`}
                />
                {formErrors.videoUrl && (
                  <p className="mt-1 text-[11px] text-red-600">{formErrors.videoUrl}</p>
                )}
              </div>

              {/* Video Preview Box */}
              {embedUrl && (
                <div className="overflow-hidden rounded-xl border border-slate-200 bg-black aspect-video">
                  <iframe
                    src={embedUrl}
                    title="Video Preview"
                    className="w-full h-full"
                    allowFullScreen
                  />
                </div>
              )}

              {/* Duration & Order Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Duration (Minutes) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Clock
                      size={14}
                      className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      type="number"
                      name="duration"
                      min="1"
                      value={formData.duration}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-8 pr-3 text-xs text-slate-800 outline-none focus:border-indigo-500"
                    />
                  </div>
                  {formErrors.duration && (
                    <p className="mt-1 text-[11px] text-red-600">
                      {formErrors.duration}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Lesson Order / Index <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="order"
                    min="1"
                    value={formData.order}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-slate-200 bg-white py-2 px-3 text-xs text-slate-800 outline-none focus:border-indigo-500"
                  />
                  {formErrors.order && (
                    <p className="mt-1 text-[11px] text-red-600">
                      {formErrors.order}
                    </p>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Lesson Summary / Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  rows={3}
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Key concepts, takeaways, or code exercises covered in this lesson..."
                  className={`w-full rounded-xl border bg-white p-2.5 text-xs text-slate-800 placeholder-slate-400 outline-none transition ${
                    formErrors.description
                      ? "border-red-300 focus:border-red-500"
                      : "border-slate-200 focus:border-indigo-500"
                  }`}
                />
                {formErrors.description && (
                  <p className="mt-1 text-[11px] text-red-600">
                    {formErrors.description}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={saving}
                className={`w-full inline-flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-semibold text-white shadow-xs disabled:opacity-50 transition ${
                  editingLessonId
                    ? "bg-amber-600 hover:bg-amber-700 shadow-amber-200"
                    : "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200"
                }`}
              >
                {saving ? (
                  <>
                    <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>{editingLessonId ? "Saving Changes..." : "Adding Lesson..."}</span>
                  </>
                ) : editingLessonId ? (
                  <>
                    <Pencil size={15} />
                    <span>Save Lesson Changes</span>
                  </>
                ) : (
                  <>
                    <Plus size={15} />
                    <span>Add Lesson to Course</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* RIGHT: Current Course Curriculum List */}
          <div className="space-y-3 flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <BookOpen size={16} className="text-indigo-600" />
                Current Curriculum ({lessons.length})
              </h3>
            </div>

            {loading ? (
              <div className="flex-1 flex flex-col items-center justify-center py-12 text-slate-400">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
                <p className="mt-2 text-xs">Loading lessons...</p>
              </div>
            ) : lessons.length === 0 ? (
              <div className="flex-1 rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 p-8 text-center flex flex-col items-center justify-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 mb-2">
                  <Video size={24} />
                </div>
                <h4 className="text-xs font-bold text-slate-800">
                  No lessons added yet
                </h4>
                <p className="text-[11px] text-slate-500 mt-1 max-w-xs">
                  Fill in the form on the left to add your first video lesson.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5 overflow-y-auto max-h-[500px] pr-1">
                {lessons.map((lesson, idx) => {
                  const isEditingThis = editingLessonId === lesson._id;
                  return (
                    <div
                      key={lesson._id}
                      className={`flex items-start justify-between gap-3 rounded-xl border p-3.5 shadow-2xs transition ${
                        isEditingThis
                          ? "border-amber-400 bg-amber-50/40 ring-1 ring-amber-300"
                          : "border-slate-200 bg-white hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-start gap-3 min-w-0 flex-1">
                        <span
                          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg font-bold text-xs ${
                            isEditingThis
                              ? "bg-amber-100 text-amber-800"
                              : "bg-indigo-50 text-indigo-700"
                          }`}
                        >
                          {lesson.order || idx + 1}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <h4
                              className="text-xs font-bold text-slate-900 truncate"
                              title={lesson.title}
                            >
                              {lesson.title}
                            </h4>
                            {isEditingThis && (
                              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-800">
                                Editing
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                            {lesson.description}
                          </p>
                          <div className="mt-1.5 flex items-center gap-3 text-[10px] text-slate-400">
                            <span className="flex items-center gap-1 text-slate-600 font-medium">
                              <Clock size={11} /> {lesson.duration || 0} mins
                            </span>
                            <a
                              href={lesson.videoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-indigo-600 hover:underline"
                            >
                              <ExternalLink size={10} /> Watch Video
                            </a>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleStartEdit(lesson)}
                          className={`rounded-lg p-1.5 transition ${
                            isEditingThis
                              ? "bg-amber-100 text-amber-800"
                              : "text-slate-400 hover:bg-amber-50 hover:text-amber-600"
                          }`}
                          title="Edit this lesson"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          type="button"
                          disabled={deletingId === lesson._id}
                          onClick={() =>
                            handleDeleteLesson(lesson._id, lesson.title)
                          }
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 transition disabled:opacity-50"
                          title="Delete this lesson"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-100 px-6 py-3.5 bg-slate-50/50 rounded-b-2xl">
          <p className="text-[11px] text-slate-500">
            Lessons will immediately appear in the student's lesson player.
          </p>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
