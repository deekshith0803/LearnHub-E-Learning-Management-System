import { useState, useEffect, useCallback } from "react";
import {
  X,
  HelpCircle,
  Plus,
  Trash2,
  Pencil,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  Check,
} from "lucide-react";
import api from "../../services/api";

function createEmptyQuestion() {
  return {
    question: "",
    options: ["", "", "", ""],
    correctAnswer: "",
  };
}

export default function ManageQuizModal({ isOpen, onClose, course }) {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // "list" | "create" | "edit"
  const [view, setView] = useState("list");
  const [editingQuizId, setEditingQuizId] = useState(null);
  const [expandedQuizId, setExpandedQuizId] = useState(null);

  // Form states
  const [quizTitle, setQuizTitle] = useState("");
  const [questions, setQuestions] = useState([createEmptyQuestion()]);
  const [formErrors, setFormErrors] = useState({});

  const courseId = course?._id;

  const fetchQuizzes = useCallback(async () => {
    if (!courseId) return;
    setLoading(true);
    setError("");
    try {
      const res = await api.get(`/courses/${courseId}/quiz`);
      setQuizzes(res.data.quizzes || []);
    } catch (err) {
      if (err.response?.status === 404) {
        setQuizzes([]);
      } else {
        setError(err.response?.data?.message || "Failed to load course quizzes.");
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
          const res = await api.get(`/courses/${courseId}/quiz`);
          if (active) setQuizzes(res.data.quizzes || []);
        } catch (err) {
          if (active) {
            if (err.response?.status === 404) {
              setQuizzes([]);
            } else {
              setError(err.response?.data?.message || "Failed to load course quizzes.");
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

  const handleStartCreate = () => {
    setQuizTitle("");
    setQuestions([createEmptyQuestion()]);
    setFormErrors({});
    setError("");
    setSuccessMsg("");
    setEditingQuizId(null);
    setView("create");
  };

  const handleStartEdit = (quiz) => {
    setQuizTitle(quiz.title || "");
    const initialQuestions = (quiz.questions || []).map((q) => ({
      question: q.question || "",
      options:
        Array.isArray(q.options) && q.options.length >= 2
          ? [...q.options]
          : ["", "", "", ""],
      correctAnswer: q.correctAnswer || "",
    }));
    setQuestions(initialQuestions.length > 0 ? initialQuestions : [createEmptyQuestion()]);
    setFormErrors({});
    setError("");
    setSuccessMsg("");
    setEditingQuizId(quiz._id);
    setView("edit");
  };

  const handleBackToList = () => {
    setView("list");
    setEditingQuizId(null);
    setFormErrors({});
    setError("");
  };

  // Question editing handlers
  const handleAddQuestion = () => {
    setQuestions((prev) => [...prev, createEmptyQuestion()]);
  };

  const handleRemoveQuestion = (qIdx) => {
    if (questions.length <= 1) {
      alert("A quiz must have at least one question.");
      return;
    }
    setQuestions((prev) => prev.filter((_, idx) => idx !== qIdx));
  };

  const handleQuestionTextChange = (qIdx, text) => {
    setQuestions((prev) => {
      const updated = [...prev];
      updated[qIdx] = { ...updated[qIdx], question: text };
      return updated;
    });
  };

  const handleAddOption = (qIdx) => {
    setQuestions((prev) => {
      const updated = [...prev];
      if (updated[qIdx].options.length >= 6) {
        alert("Maximum 6 options per question.");
        return prev;
      }
      updated[qIdx] = {
        ...updated[qIdx],
        options: [...updated[qIdx].options, ""],
      };
      return updated;
    });
  };

  const handleRemoveOption = (qIdx, optIdx) => {
    setQuestions((prev) => {
      const updated = [...prev];
      if (updated[qIdx].options.length <= 2) {
        alert("Each question must have at least 2 options.");
        return prev;
      }
      const removedText = updated[qIdx].options[optIdx];
      const newOptions = updated[qIdx].options.filter((_, idx) => idx !== optIdx);
      let newCorrect = updated[qIdx].correctAnswer;
      if (newCorrect === removedText) {
        newCorrect = "";
      }
      updated[qIdx] = {
        ...updated[qIdx],
        options: newOptions,
        correctAnswer: newCorrect,
      };
      return updated;
    });
  };

  const handleOptionTextChange = (qIdx, optIdx, text) => {
    setQuestions((prev) => {
      const updated = [...prev];
      const oldText = updated[qIdx].options[optIdx];
      const newOptions = [...updated[qIdx].options];
      newOptions[optIdx] = text;
      let newCorrect = updated[qIdx].correctAnswer;
      if (newCorrect === oldText) {
        newCorrect = text;
      }
      updated[qIdx] = {
        ...updated[qIdx],
        options: newOptions,
        correctAnswer: newCorrect,
      };
      return updated;
    });
  };

  const handleSetCorrectAnswer = (qIdx, optionText) => {
    setQuestions((prev) => {
      const updated = [...prev];
      updated[qIdx] = {
        ...updated[qIdx],
        correctAnswer: optionText,
      };
      return updated;
    });
  };

  const validateQuiz = () => {
    const errors = {};
    if (!quizTitle.trim() || quizTitle.trim().length < 3) {
      errors.title = "Quiz title is required (at least 3 characters).";
    }

    if (questions.length === 0) {
      errors.general = "Please add at least one question.";
    }

    questions.forEach((q, idx) => {
      if (!q.question.trim() || q.question.trim().length < 3) {
        errors[`q_${idx}`] = `Question ${idx + 1} text must be at least 3 characters.`;
      }

      const validOptions = q.options.map((opt) => opt.trim()).filter(Boolean);
      if (validOptions.length < 2) {
        errors[`q_${idx}_opts`] = `Question ${idx + 1} must have at least 2 non-empty options.`;
      }

      if (!q.correctAnswer.trim()) {
        errors[`q_${idx}_answer`] = `Please select the correct answer for Question ${idx + 1}.`;
      } else if (!validOptions.includes(q.correctAnswer.trim())) {
        errors[`q_${idx}_answer`] = `The correct answer for Question ${idx + 1} must match one of the options.`;
      }
    });

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveQuiz = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (!validateQuiz()) {
      return;
    }

    setSaving(true);
    try {
      const cleanedQuestions = questions.map((q) => {
        const cleanedOpts = q.options.map((o) => o.trim()).filter(Boolean);
        return {
          question: q.question.trim(),
          options: cleanedOpts,
          correctAnswer: q.correctAnswer.trim(),
        };
      });

      const payload = {
        title: quizTitle.trim(),
        questions: cleanedQuestions,
      };

      if (view === "edit" && editingQuizId) {
        await api.put(`/quizzes/${editingQuizId}`, payload);
        setSuccessMsg(`Quiz "${quizTitle}" updated successfully!`);
      } else {
        await api.post(`/courses/${courseId}/quiz`, payload);
        setSuccessMsg(`Quiz "${quizTitle}" created successfully!`);
      }

      await fetchQuizzes();
      setView("list");
      setEditingQuizId(null);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to save quiz. Please ensure all fields are properly filled.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteQuiz = async (quizId, title) => {
    if (!window.confirm(`Are you sure you want to delete quiz "${title}"?`)) {
      return;
    }

    setDeletingId(quizId);
    setError("");
    setSuccessMsg("");
    try {
      await api.delete(`/quizzes/${quizId}`);
      setSuccessMsg(`Quiz "${title}" deleted.`);
      await fetchQuizzes();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete quiz.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs overflow-y-auto">
      <div className="relative my-8 w-full max-w-4xl rounded-2xl border border-slate-200 bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-slate-50/80 rounded-t-2xl shrink-0">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm shadow-indigo-200">
              <HelpCircle size={20} />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900">
                  Course Quizzes & Assessments
                </h2>
                <span className="rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-semibold text-indigo-700">
                  {quizzes.length} {quizzes.length === 1 ? "Quiz" : "Quizzes"}
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

        {/* Alerts */}
        {successMsg && (
          <div className="mx-6 mt-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800 shrink-0">
            <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
            <p className="font-medium">{successMsg}</p>
          </div>
        )}

        {error && (
          <div className="mx-6 mt-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-800 shrink-0">
            <AlertCircle size={16} className="text-red-600 shrink-0" />
            <p className="font-medium">{error}</p>
          </div>
        )}

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {view === "list" ? (
            /* LIST VIEW */
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Course Assessments
                  </h3>
                  <p className="text-xs text-slate-500">
                    Quizzes let enrolled students test their understanding after lessons.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleStartCreate}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-indigo-700 transition"
                >
                  <Plus size={15} />
                  <span>Create New Quiz</span>
                </button>
              </div>

              {loading ? (
                <div className="flex flex-col items-center justify-center py-16 text-slate-400">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
                  <p className="mt-2 text-xs">Loading course quizzes...</p>
                </div>
              ) : quizzes.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 p-10 text-center flex flex-col items-center justify-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 mb-3">
                    <HelpCircle size={26} />
                  </div>
                  <h4 className="text-sm font-bold text-slate-800">
                    No quizzes created yet
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm">
                    Add multiple-choice quizzes to help students validate their learning progress.
                  </p>
                  <button
                    type="button"
                    onClick={handleStartCreate}
                    className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-indigo-700 transition"
                  >
                    <Plus size={15} />
                    <span>Create Your First Quiz</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {quizzes.map((quiz, idx) => {
                    const isExpanded = expandedQuizId === quiz._id;
                    const questionCount = quiz.questions?.length || 0;
                    return (
                      <div
                        key={quiz._id}
                        className="rounded-xl border border-slate-200 bg-white shadow-2xs hover:border-slate-300 transition overflow-hidden"
                      >
                        <div className="p-4 flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-50 font-bold text-xs text-indigo-700">
                              #{idx + 1}
                            </span>
                            <div className="min-w-0 flex-1">
                              <h4 className="text-sm font-bold text-slate-900 truncate">
                                {quiz.title}
                              </h4>
                              <p className="text-xs text-slate-500 mt-0.5">
                                {questionCount} {questionCount === 1 ? "Question" : "Questions"} • Multiple Choice
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              type="button"
                              onClick={() =>
                                setExpandedQuizId(isExpanded ? null : quiz._id)
                              }
                              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 transition"
                              title="Toggle questions preview"
                            >
                              <span>{isExpanded ? "Hide Questions" : "Preview Questions"}</span>
                              {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                            </button>

                            <button
                              type="button"
                              onClick={() => handleStartEdit(quiz)}
                              className="rounded-lg p-1.5 text-slate-500 hover:bg-amber-50 hover:text-amber-700 transition"
                              title="Edit this quiz"
                            >
                              <Pencil size={15} />
                            </button>

                            <button
                              type="button"
                              disabled={deletingId === quiz._id}
                              onClick={() => handleDeleteQuiz(quiz._id, quiz.title)}
                              className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 transition disabled:opacity-50"
                              title="Delete this quiz"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </div>

                        {/* Expandable Question Preview */}
                        {isExpanded && (
                          <div className="border-t border-slate-100 bg-slate-50/50 p-4 space-y-3">
                            <p className="text-xs font-semibold text-slate-700">
                              Questions in this quiz:
                            </p>
                            {quiz.questions && quiz.questions.length > 0 ? (
                              quiz.questions.map((q, qIndex) => (
                                <div
                                  key={q._id || qIndex}
                                  className="rounded-lg border border-slate-200 bg-white p-3 space-y-2"
                                >
                                  <p className="text-xs font-semibold text-slate-800">
                                    {qIndex + 1}. {q.question}
                                  </p>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                                    {q.options?.map((opt, optIndex) => {
                                      const isCorrect = opt === q.correctAnswer;
                                      return (
                                        <div
                                          key={optIndex}
                                          className={`flex items-center gap-2 rounded-md px-2.5 py-1.5 text-xs ${
                                            isCorrect
                                              ? "bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold"
                                              : "bg-slate-50 text-slate-600 border border-slate-100"
                                          }`}
                                        >
                                          <span className="h-2 w-2 rounded-full shrink-0 bg-current opacity-60" />
                                          <span className="truncate flex-1">{opt}</span>
                                          {isCorrect && (
                                            <span className="inline-flex items-center gap-0.5 text-[10px] text-emerald-700 font-bold shrink-0">
                                              <Check size={12} /> Correct
                                            </span>
                                          )}
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              ))
                            ) : (
                              <p className="text-xs text-slate-400 italic">No questions listed.</p>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            /* BUILDER / EDITOR VIEW */
            <form onSubmit={handleSaveQuiz} className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <button
                  type="button"
                  onClick={handleBackToList}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition"
                >
                  <ArrowLeft size={14} />
                  <span>Back to Quizzes</span>
                </button>

                <h3 className="text-sm font-bold text-slate-900">
                  {view === "edit" ? "Edit Quiz" : "Create New Quiz"}
                </h3>
              </div>

              {/* Quiz Title */}
              <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Quiz Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={quizTitle}
                  onChange={(e) => {
                    setQuizTitle(e.target.value);
                    if (formErrors.title) {
                      setFormErrors((prev) => ({ ...prev, title: "" }));
                    }
                  }}
                  placeholder="e.g. Chapter 1 Review: Fundamentals & Syntax"
                  className={`w-full rounded-xl border bg-white px-3.5 py-2 text-xs text-slate-800 placeholder-slate-400 outline-none transition ${
                    formErrors.title
                      ? "border-red-300 focus:border-red-500"
                      : "border-slate-200 focus:border-indigo-500"
                  }`}
                />
                {formErrors.title && (
                  <p className="text-[11px] text-red-600">{formErrors.title}</p>
                )}
              </div>

              {/* Questions Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Questions ({questions.length})
                  </h4>
                  <button
                    type="button"
                    onClick={handleAddQuestion}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                  >
                    <Plus size={14} /> Add Another Question
                  </button>
                </div>

                {questions.map((q, qIdx) => (
                  <div
                    key={qIdx}
                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs space-y-4"
                  >
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <span className="flex items-center gap-2 font-bold text-xs text-indigo-700">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 text-indigo-700">
                          {qIdx + 1}
                        </span>
                        Question {qIdx + 1}
                      </span>

                      {questions.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveQuestion(qIdx)}
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 transition"
                          title="Remove Question"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>

                    {/* Question text */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Question Text <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={q.question}
                        onChange={(e) => handleQuestionTextChange(qIdx, e.target.value)}
                        placeholder="e.g. Which HTML tag is used to define an internal style sheet?"
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 outline-none focus:border-indigo-500"
                      />
                      {formErrors[`q_${qIdx}`] && (
                        <p className="mt-1 text-[11px] text-red-600">
                          {formErrors[`q_${qIdx}`]}
                        </p>
                      )}
                    </div>

                    {/* Options list */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="block text-xs font-semibold text-slate-700">
                          Answer Options (Select the radio button for the correct answer) <span className="text-red-500">*</span>
                        </label>
                        {q.options.length < 6 && (
                          <button
                            type="button"
                            onClick={() => handleAddOption(qIdx)}
                            className="text-[11px] font-semibold text-indigo-600 hover:underline"
                          >
                            + Add Option
                          </button>
                        )}
                      </div>

                      <div className="space-y-2">
                        {q.options.map((opt, optIdx) => {
                          const isCorrect = opt && q.correctAnswer === opt;
                          return (
                            <div key={optIdx} className="flex items-center gap-2">
                              {/* Radio for correct answer */}
                              <label className="flex items-center cursor-pointer p-1">
                                <input
                                  type="radio"
                                  name={`correct_${qIdx}`}
                                  checked={isCorrect}
                                  onChange={() => handleSetCorrectAnswer(qIdx, opt)}
                                  disabled={!opt.trim()}
                                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-slate-300"
                                  title="Mark as correct answer"
                                />
                              </label>

                              {/* Option Input */}
                              <input
                                type="text"
                                value={opt}
                                onChange={(e) =>
                                  handleOptionTextChange(qIdx, optIdx, e.target.value)
                                }
                                placeholder={`Option ${optIdx + 1}`}
                                className={`flex-1 rounded-xl border px-3 py-1.5 text-xs text-slate-800 outline-none transition ${
                                  isCorrect
                                    ? "border-emerald-300 bg-emerald-50/30 focus:border-emerald-500"
                                    : "border-slate-200 bg-white focus:border-indigo-500"
                                }`}
                              />

                              {/* Remove Option Button */}
                              {q.options.length > 2 && (
                                <button
                                  type="button"
                                  onClick={() => handleRemoveOption(qIdx, optIdx)}
                                  className="p-1.5 text-slate-300 hover:text-red-500 transition"
                                  title="Remove option"
                                >
                                  <X size={14} />
                                </button>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {formErrors[`q_${qIdx}_opts`] && (
                        <p className="text-[11px] text-red-600">
                          {formErrors[`q_${qIdx}_opts`]}
                        </p>
                      )}

                      {formErrors[`q_${qIdx}_answer`] && (
                        <p className="text-[11px] text-red-600">
                          {formErrors[`q_${qIdx}_answer`]}
                        </p>
                      )}

                      {q.correctAnswer && (
                        <p className="text-[11px] text-emerald-700 flex items-center gap-1 font-medium pt-1">
                          <CheckCircle2 size={13} />
                          Selected Correct Answer: <span className="font-bold">"{q.correctAnswer}"</span>
                        </p>
                      )}
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={handleAddQuestion}
                  className="w-full rounded-2xl border-2 border-dashed border-slate-200 p-3.5 text-center text-xs font-semibold text-slate-600 hover:border-indigo-300 hover:text-indigo-600 transition"
                >
                  + Add Question #{questions.length + 1}
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={handleBackToList}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-indigo-700 disabled:opacity-50 transition"
                >
                  {saving ? (
                    <>
                      <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      <span>Saving Quiz...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={15} />
                      <span>{view === "edit" ? "Save Quiz Changes" : "Publish Quiz to Course"}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-100 px-6 py-3.5 bg-slate-50/50 rounded-b-2xl shrink-0">
          <p className="text-[11px] text-slate-500">
            Quizzes will immediately be available in the student quiz player for enrolled learners.
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
