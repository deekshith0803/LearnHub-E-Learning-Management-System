import { useState } from "react";
import {
  X,
  BookOpen,
  Image,
  Clock,
  IndianRupee,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  Sparkles,
  Layers,
} from "lucide-react";
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

export default function CreateCourseModal({ isOpen, onClose, onCourseCreated }) {
  const [formData, setFormData] = useState({
    title: "",
    category: "Development",
    level: "beginner",
    price: "",
    duration: "",
    thumbnail: "",
    description: "",
    status: true, // true = published, false = draft
  });

  const [whatYouWillLearn, setWhatYouWillLearn] = useState([]);
  const [learningInput, setLearningInput] = useState("");

  const [requirements, setRequirements] = useState([]);
  const [requirementInput, setRequirementInput] = useState("");

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const [imgError, setImgError] = useState(false);

  if (!isOpen) return null;

  // Handle standard field changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (name === "thumbnail") {
      setImgError(false);
    }

    // Clear specific error on typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Add learning outcome
  const handleAddLearningItem = (e) => {
    e.preventDefault();
    const item = learningInput.trim();
    if (!item) return;
    if (whatYouWillLearn.includes(item)) return;
    setWhatYouWillLearn((prev) => [...prev, item]);
    setLearningInput("");
    if (errors.whatYouWillLearn) {
      setErrors((prev) => ({ ...prev, whatYouWillLearn: "" }));
    }
  };

  const handleRemoveLearningItem = (index) => {
    setWhatYouWillLearn((prev) => prev.filter((_, i) => i !== index));
  };

  // Add requirement
  const handleAddRequirement = (e) => {
    e.preventDefault();
    const item = requirementInput.trim();
    if (!item) return;
    if (requirements.includes(item)) return;
    setRequirements((prev) => [...prev, item]);
    setRequirementInput("");
    if (errors.requirements) {
      setErrors((prev) => ({ ...prev, requirements: "" }));
    }
  };

  const handleRemoveRequirement = (index) => {
    setRequirements((prev) => prev.filter((_, i) => i !== index));
  };

  // Validation function
  const validateForm = () => {
    const newErrors = {};

    // Title validation
    if (!formData.title.trim()) {
      newErrors.title = "Course title is required";
    } else if (formData.title.trim().length < 3) {
      newErrors.title = "Title must be at least 3 characters long";
    } else if (formData.title.trim().length > 100) {
      newErrors.title = "Title cannot exceed 100 characters";
    }

    // Category validation
    if (!formData.category.trim()) {
      newErrors.category = "Please select or enter a category";
    }

    // Level validation
    if (!["beginner", "intermediate", "advanced"].includes(formData.level)) {
      newErrors.level = "Invalid difficulty level";
    }

    // Price validation
    if (formData.price === "" || formData.price === null || formData.price === undefined) {
      newErrors.price = "Course price is required (0 for free)";
    } else {
      const numPrice = Number(formData.price);
      if (isNaN(numPrice) || numPrice < 0) {
        newErrors.price = "Price must be a valid number of 0 or greater";
      }
    }

    // Duration validation
    if (!formData.duration || formData.duration === "") {
      newErrors.duration = "Course duration is required";
    } else {
      const numDuration = Number(formData.duration);
      if (isNaN(numDuration) || numDuration <= 0) {
        newErrors.duration = "Duration must be a positive number of hours";
      }
    }

    // Thumbnail validation
    if (!formData.thumbnail.trim()) {
      newErrors.thumbnail = "Course thumbnail image URL is required";
    } else if (
      !formData.thumbnail.startsWith("http://") &&
      !formData.thumbnail.startsWith("https://")
    ) {
      newErrors.thumbnail = "Please enter a valid image URL starting with http:// or https://";
    }

    // Description validation
    if (!formData.description.trim()) {
      newErrors.description = "Course description is required";
    } else if (formData.description.trim().length < 10) {
      newErrors.description = "Description must be at least 10 characters long";
    } else if (formData.description.trim().length > 1500) {
      newErrors.description = "Description cannot exceed 1500 characters";
    }

    // Requirements validation
    if (requirements.length === 0) {
      newErrors.requirements = "Add at least one prerequisite requirement (e.g. Basic computer skills)";
    }

    // Learning outcomes validation
    if (whatYouWillLearn.length === 0) {
      newErrors.whatYouWillLearn = "Add at least one learning outcome (what students will learn)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        title: formData.title.trim(),
        category: formData.category.trim(),
        level: formData.level,
        price: Number(formData.price),
        duration: Number(formData.duration),
        thumbnail: formData.thumbnail.trim(),
        description: formData.description.trim(),
        requirements,
        whatYouWillLearn,
        status: formData.status,
      };

      const res = await api.post("/courses", payload);

      if (res.data?.success && res.data?.course) {
        if (onCourseCreated) {
          onCourseCreated(res.data.course);
        }
        onClose();
      } else {
        setServerError(res.data?.message || "Failed to create course. Please try again.");
      }
    } catch (err) {
      setServerError(
        err.response?.data?.message ||
          "An error occurred while creating the course. Please verify all inputs."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs overflow-y-auto">
      <div className="relative my-8 w-full max-w-3xl rounded-2xl border border-slate-200 bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4.5 bg-slate-50/70 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm shadow-indigo-200">
              <BookOpen size={20} />
            </span>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Create New Course
              </h2>
              <p className="text-xs text-slate-500">
                Provide comprehensive course details, pricing, and curriculum highlights.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-200/60 hover:text-slate-700"
          >
            <X size={20} />
          </button>
        </div>

        {/* Server Error Alert */}
        {serverError && (
          <div className="mx-6 mt-4 flex items-center gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs text-red-700">
            <AlertCircle size={17} className="shrink-0 text-red-600" />
            <p className="font-medium">{serverError}</p>
          </div>
        )}

        {/* Course Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* SECTION 1: Basic Information */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-700 flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <Sparkles size={14} /> 1. Course Overview & Identification
            </h3>

            {/* Title */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-slate-700">
                  Course Title <span className="text-red-500">*</span>
                </label>
                <span className="text-[11px] text-slate-400">
                  {formData.title.length}/100
                </span>
              </div>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                maxLength={100}
                placeholder="e.g. Master Full Stack Web Development with React & Node.js"
                className={`w-full rounded-xl border px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none transition ${
                  errors.title
                    ? "border-red-300 bg-red-50/30 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                    : "border-slate-200 bg-slate-50/50 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                }`}
              />
              {errors.title && (
                <p className="mt-1 flex items-center gap-1 text-xs text-red-600">
                  <AlertCircle size={12} /> {errors.title}
                </p>
              )}
            </div>

            {/* Category & Level & Duration Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Category */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-indigo-500 focus:bg-white"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="mt-1 text-xs text-red-600">{errors.category}</p>
                )}
              </div>

              {/* Level */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Level <span className="text-red-500">*</span>
                </label>
                <select
                  name="level"
                  value={formData.level}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2.5 text-sm text-slate-800 capitalize outline-none transition focus:border-indigo-500 focus:bg-white"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
                {errors.level && (
                  <p className="mt-1 text-xs text-red-600">{errors.level}</p>
                )}
              </div>

              {/* Duration */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Duration (Hours) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Clock
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type="number"
                    name="duration"
                    step="0.5"
                    min="0.5"
                    value={formData.duration}
                    onChange={handleChange}
                    placeholder="e.g. 12"
                    className={`w-full rounded-xl border py-2.5 pl-9 pr-3 text-sm text-slate-800 outline-none transition ${
                      errors.duration
                        ? "border-red-300 bg-red-50/30 focus:border-red-500"
                        : "border-slate-200 bg-slate-50/50 focus:border-indigo-500 focus:bg-white"
                    }`}
                  />
                </div>
                {errors.duration && (
                  <p className="mt-1 text-xs text-red-600">{errors.duration}</p>
                )}
              </div>
            </div>

            {/* Price & Publishing Status Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Price */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-semibold text-slate-700">
                    Tuition Price (INR) <span className="text-red-500">*</span>
                  </label>
                  <span className="text-[11px] font-semibold text-indigo-600">
                    {formData.price === ""
                      ? "Enter 0 for Free"
                      : Number(formData.price) === 0
                      ? "Free Course"
                      : `₹${formData.price}`}
                  </span>
                </div>
                <div className="relative">
                  <IndianRupee
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type="number"
                    name="price"
                    min="0"
                    step="1"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="e.g. 999 or 0"
                    className={`w-full rounded-xl border py-2.5 pl-9 pr-3 text-sm text-slate-800 outline-none transition ${
                      errors.price
                        ? "border-red-300 bg-red-50/30 focus:border-red-500"
                        : "border-slate-200 bg-slate-50/50 focus:border-indigo-500 focus:bg-white"
                    }`}
                  />
                </div>
                {errors.price && (
                  <p className="mt-1 text-xs text-red-600">{errors.price}</p>
                )}
              </div>

              {/* Status Toggle */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Publishing Status
                </label>
                <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/50 p-2.5">
                  <input
                    type="checkbox"
                    id="status"
                    name="status"
                    checked={formData.status}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label
                    htmlFor="status"
                    className="text-xs font-medium text-slate-700 cursor-pointer flex-1"
                  >
                    {formData.status ? (
                      <span className="text-emerald-700 font-semibold flex items-center gap-1">
                        <CheckCircle2 size={13} /> Active & Published (Visible in catalog)
                      </span>
                    ) : (
                      <span className="text-amber-700 font-semibold">
                        Draft Mode (Saved privately in your studio)
                      </span>
                    )}
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 2: Media & Description */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-700 flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <Image size={14} /> 2. Course Thumbnail & Detailed Description
            </h3>

            {/* Thumbnail URL */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Course Thumbnail Image URL <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-col sm:flex-row gap-3 items-start">
                <div className="flex-1 w-full">
                  <input
                    type="url"
                    name="thumbnail"
                    value={formData.thumbnail}
                    onChange={handleChange}
                    placeholder="https://images.unsplash.com/photo-..."
                    className={`w-full rounded-xl border px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none transition ${
                      errors.thumbnail
                        ? "border-red-300 bg-red-50/30 focus:border-red-500"
                        : "border-slate-200 bg-slate-50/50 focus:border-indigo-500 focus:bg-white"
                    }`}
                  />
                  {errors.thumbnail && (
                    <p className="mt-1 text-xs text-red-600">{errors.thumbnail}</p>
                  )}
                </div>

                {/* Thumbnail Live Preview */}
                <div className="h-20 w-32 shrink-0 rounded-xl border border-slate-200 bg-slate-100 overflow-hidden flex items-center justify-center">
                  {formData.thumbnail && !imgError ? (
                    <img
                      src={formData.thumbnail}
                      alt="Thumbnail preview"
                      onError={() => setImgError(true)}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="text-center p-2 text-slate-400">
                      <Image size={20} className="mx-auto mb-1 text-slate-300" />
                      <span className="text-[10px]">Preview</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-slate-700">
                  Course Description <span className="text-red-500">*</span>
                </label>
                <span className="text-[11px] text-slate-400">
                  {formData.description.length}/1500
                </span>
              </div>
              <textarea
                name="description"
                rows={4}
                maxLength={1500}
                value={formData.description}
                onChange={handleChange}
                placeholder="Provide a comprehensive summary of what this course covers, teaching methodologies, and who will benefit most..."
                className={`w-full rounded-xl border p-3 text-sm text-slate-800 placeholder-slate-400 outline-none transition ${
                  errors.description
                    ? "border-red-300 bg-red-50/30 focus:border-red-500"
                    : "border-slate-200 bg-slate-50/50 focus:border-indigo-500 focus:bg-white"
                }`}
              />
              {errors.description && (
                <p className="mt-1 text-xs text-red-600">{errors.description}</p>
              )}
            </div>
          </div>

          {/* SECTION 3: Curriculum Highlights (What You Will Learn & Requirements) */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-700 flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <Layers size={14} /> 3. Curriculum Highlights & Prerequisites
            </h3>

            {/* What You Will Learn */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                What Students Will Learn <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={learningInput}
                  onChange={(e) => setLearningInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddLearningItem(e);
                    }
                  }}
                  placeholder="e.g. Build modern React interfaces with Tailwind CSS"
                  className="flex-1 rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-xs text-slate-800 outline-none focus:border-indigo-500 focus:bg-white"
                />
                <button
                  type="button"
                  onClick={handleAddLearningItem}
                  className="inline-flex items-center gap-1 rounded-xl bg-indigo-50 px-3 py-2 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 transition"
                >
                  <Plus size={14} /> Add
                </button>
              </div>

              {errors.whatYouWillLearn && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.whatYouWillLearn}
                </p>
              )}

              {/* Items List */}
              {whatYouWillLearn.length > 0 && (
                <ul className="mt-2.5 space-y-1.5">
                  {whatYouWillLearn.map((item, index) => (
                    <li
                      key={index}
                      className="flex items-center justify-between gap-2 rounded-lg bg-indigo-50/50 px-3 py-1.5 text-xs text-indigo-900 border border-indigo-100"
                    >
                      <div className="flex items-center gap-2">
                        <CheckCircle2 size={13} className="text-indigo-600 shrink-0" />
                        <span>{item}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveLearningItem(index)}
                        className="text-slate-400 hover:text-red-600 transition"
                      >
                        <Trash2 size={13} />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Course Requirements */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Course Requirements / Prerequisites <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={requirementInput}
                  onChange={(e) => setRequirementInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddRequirement(e);
                    }
                  }}
                  placeholder="e.g. Basic understanding of JavaScript and HTML"
                  className="flex-1 rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-xs text-slate-800 outline-none focus:border-indigo-500 focus:bg-white"
                />
                <button
                  type="button"
                  onClick={handleAddRequirement}
                  className="inline-flex items-center gap-1 rounded-xl bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 transition"
                >
                  <Plus size={14} /> Add
                </button>
              </div>

              {errors.requirements && (
                <p className="mt-1 text-xs text-red-600">{errors.requirements}</p>
              )}

              {/* Requirements List */}
              {requirements.length > 0 && (
                <ul className="mt-2.5 space-y-1.5">
                  {requirements.map((req, index) => (
                    <li
                      key={index}
                      className="flex items-center justify-between gap-2 rounded-lg bg-slate-50 px-3 py-1.5 text-xs text-slate-800 border border-slate-200"
                    >
                      <span>• {req}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveRequirement(index)}
                        className="text-slate-400 hover:text-red-600 transition"
                      >
                        <Trash2 size={13} />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-50 transition"
            >
              {submitting ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Validating & Publishing...</span>
                </>
              ) : (
                <>
                  <Plus size={16} />
                  <span>Publish Course</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
