import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  Award,
  RotateCcw,
  ChevronRight,
  Lock,
  ArrowRight,
  LoaderCircle,
  AlertCircle,
} from "lucide-react";
import api from "../../services/api";
import {
  fetchQuizzesStart,
  fetchQuizzesSuccess,
  fetchQuizzesFailure,
  submitQuizStart,
  submitQuizSuccess,
  submitQuizFailure,
  resetQuizResult,
} from "../../store/slices/courseSlice";

export default function CourseQuiz({ courseId, isEnrolled }) {
  const dispatch = useDispatch();
  const {
    quizzes = [],
    quizzesLoading,
    quizzesError,
    quizSubmitting,
    quizResult,
    quizSubmitError,
  } = useSelector((state) => state.courses);

  const [activeQuiz, setActiveQuiz] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [validationError, setValidationError] = useState("");

  // Fetch quizzes for this course if enrolled
  useEffect(() => {
    if (!courseId || !isEnrolled) return;

    const loadQuizzes = async () => {
      dispatch(fetchQuizzesStart());
      try {
        const response = await api.get(`/courses/${courseId}/quiz`);
        dispatch(fetchQuizzesSuccess(response.data.quizzes || []));
      } catch (err) {
        if (err.response?.status === 401) {
          dispatch(fetchQuizzesSuccess([]));
          return;
        }
        dispatch(
          fetchQuizzesFailure(
            err.response?.data?.message || "Unable to load quizzes.",
          ),
        );
      }
    };

    loadQuizzes();
  }, [courseId, isEnrolled, dispatch]);

  const handleStartQuiz = (quiz) => {
    setActiveQuiz(quiz);
    setSelectedAnswers({});
    setValidationError("");
    dispatch(resetQuizResult());
  };

  const handleSelectOption = (questionId, option) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: option,
    }));
    setValidationError("");
  };

  const handleSubmitQuiz = async () => {
    if (!activeQuiz) return;

    // Check that every question has an answer
    const unanswered = activeQuiz.questions.some(
      (q) => !selectedAnswers[q._id],
    );

    if (unanswered) {
      setValidationError("Please answer all questions before submitting.");
      return;
    }

    const payload = {
      answers: Object.entries(selectedAnswers).map(([questionId, answer]) => ({
        questionId,
        answer,
      })),
    };

    dispatch(submitQuizStart());
    try {
      const response = await api.post(
        `/quizzes/${activeQuiz._id}/submit`,
        payload,
      );
      dispatch(submitQuizSuccess(response.data.result));
    } catch (err) {
      dispatch(
        submitQuizFailure(
          err.response?.data?.message || "Failed to submit quiz. Please try again.",
        ),
      );
    }
  };

  const handleRetake = () => {
    setSelectedAnswers({});
    setValidationError("");
    dispatch(resetQuizResult());
  };

  const handleBackToList = () => {
    setActiveQuiz(null);
    setSelectedAnswers({});
    setValidationError("");
    dispatch(resetQuizResult());
  };

  // 1. Not Enrolled Locked State
  if (!isEnrolled) {
    return (
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 text-center shadow-sm">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
          <Lock size={22} />
        </div>
        <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white">
          Course Quizzes & Assessments
        </h3>
        <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500 dark:text-slate-400">
          Enroll in this course to take quizzes, test your knowledge, and track your learning progress.
        </p>
      </div>
    );
  }

  // 2. Loading State
  if (quizzesLoading) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 text-center shadow-sm">
        <LoaderCircle size={32} className="animate-spin text-indigo-600 dark:text-indigo-400" />
        <p className="mt-3 text-sm font-medium text-slate-600 dark:text-slate-300">Loading course quizzes...</p>
      </div>
    );
  }

  // 3. Error State
  if (quizzesError) {
    return (
      <div className="rounded-2xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/40 p-6 text-center text-sm text-red-600 dark:text-red-400 shadow-sm">
        <AlertCircle size={28} className="mx-auto mb-2 text-red-500 dark:text-red-400" />
        <p>{quizzesError}</p>
      </div>
    );
  }

  // 4. Empty Quizzes State
  if (!quizzes || quizzes.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 text-center">
        <HelpCircle size={32} className="mx-auto text-slate-400 dark:text-slate-500" />
        <h3 className="mt-3 text-base font-semibold text-slate-900 dark:text-white">
          No quizzes available yet
        </h3>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          The instructor has not added quizzes for this course yet.
        </p>
      </div>
    );
  }

  // 5. Active Quiz Taking / Result View
  if (activeQuiz) {
    return (
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm sm:p-8">
        {/* Quiz Header */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <span className="inline-block rounded-full bg-indigo-50 dark:bg-indigo-950/60 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-indigo-700 dark:text-indigo-300">
              Interactive Quiz
            </span>
            <h2 className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
              {activeQuiz.title}
            </h2>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {activeQuiz.questions.length} Questions • Score 70% or higher to pass
            </p>
          </div>

          <button
            type="button"
            onClick={handleBackToList}
            className="text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
          >
            ← Back to all quizzes
          </button>
        </div>

        {/* Results Screen */}
        {quizResult ? (
          <div className="space-y-6">
            <div
              className={`rounded-2xl border p-6 text-center ${
                quizResult.percentage >= 70
                  ? "border-emerald-200 dark:border-emerald-800/80 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200"
                  : "border-amber-200 dark:border-amber-800/80 bg-amber-50/70 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200"
              }`}
            >
              <div
                className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full ${
                  quizResult.percentage >= 70
                    ? "bg-emerald-600 text-white"
                    : "bg-amber-600 text-white"
                }`}
              >
                <Award size={28} />
              </div>

              <h3 className="mt-4 text-xl font-bold">
                {quizResult.percentage >= 70
                  ? "Great job! You passed the quiz!"
                  : "Keep practicing! Review your answers below."}
              </h3>

              <div className="mt-3 flex items-center justify-center gap-6">
                <div>
                  <span className="block text-2xl font-extrabold">
                    {quizResult.score} / {quizResult.totalQuestions}
                  </span>
                  <span className="text-xs uppercase tracking-wider opacity-75">
                    Correct Answers
                  </span>
                </div>
                <div className="h-8 w-px bg-slate-300 dark:bg-slate-700" />
                <div>
                  <span className="block text-2xl font-extrabold">
                    {quizResult.percentage}%
                  </span>
                  <span className="text-xs uppercase tracking-wider opacity-75">
                    Score
                  </span>
                </div>
              </div>
            </div>

            {/* Answer Breakdown */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Detailed Review
              </h4>

              {activeQuiz.questions.map((q, qIndex) => {
                const questionResult = quizResult.results?.find(
                  (r) => String(r.questionId) === String(q._id),
                );
                const isCorrect = questionResult?.correct;

                return (
                  <div
                    key={q._id}
                    className={`rounded-xl border p-5 ${
                      isCorrect
                        ? "border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/20 dark:bg-emerald-950/20"
                        : "border-red-200 dark:border-red-900/60 bg-red-50/20 dark:bg-red-950/20"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="mt-0.5">
                        {isCorrect ? (
                          <CheckCircle2 size={18} className="text-emerald-600 dark:text-emerald-400" />
                        ) : (
                          <XCircle size={18} className="text-red-500 dark:text-red-400" />
                        )}
                      </span>

                      <div className="flex-1">
                        <p className="font-semibold text-slate-900 dark:text-white">
                          {qIndex + 1}. {q.question}
                        </p>

                        <div className="mt-3 grid gap-2 sm:grid-cols-2">
                          {q.options.map((opt) => {
                            const isUserChoice =
                              questionResult?.yourAnswer === opt;
                            const isAnswerCorrect = q.correctAnswer === opt;

                            let optionStyle =
                              "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300";
                            if (isAnswerCorrect) {
                              optionStyle =
                                "border-emerald-300 dark:border-emerald-700 bg-emerald-100/60 dark:bg-emerald-950/60 font-semibold text-emerald-900 dark:text-emerald-300";
                            } else if (isUserChoice && !isCorrect) {
                              optionStyle =
                                "border-red-300 dark:border-red-700 bg-red-100/60 dark:bg-red-950/60 font-semibold text-red-900 dark:text-red-300";
                            }

                            return (
                              <div
                                key={opt}
                                className={`rounded-lg border px-3 py-2 text-xs ${optionStyle}`}
                              >
                                {opt}
                                {isUserChoice && (
                                  <span className="ml-2 text-[10px] font-bold opacity-80">
                                    (Your answer)
                                  </span>
                                )}
                                {isAnswerCorrect && !isUserChoice && (
                                  <span className="ml-2 text-[10px] font-bold text-emerald-700 dark:text-emerald-400">
                                    (Correct answer)
                                  </span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4 pt-4">
              <button
                type="button"
                onClick={handleRetake}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-5 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-200 shadow-sm transition hover:bg-slate-50 dark:hover:bg-slate-700"
              >
                <RotateCcw size={16} /> Retake Quiz
              </button>

              <button
                type="button"
                onClick={handleBackToList}
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          /* Question Form */
          <div className="space-y-6">
            {activeQuiz.questions.map((q, qIndex) => (
              <div
                key={q._id}
                className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 p-5 transition focus-within:border-indigo-400 focus-within:bg-white dark:focus-within:bg-slate-800"
              >
                <p className="font-semibold text-slate-900 dark:text-white">
                  <span className="mr-2 text-indigo-600 dark:text-indigo-400 font-bold">
                    Q{qIndex + 1}.
                  </span>
                  {q.question}
                </p>

                <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
                  {q.options.map((option) => {
                    const isSelected = selectedAnswers[q._id] === option;
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => handleSelectOption(q._id, option)}
                        className={`flex items-center gap-3 rounded-lg border px-4 py-3 text-left text-sm font-medium transition ${
                          isSelected
                            ? "border-indigo-600 dark:border-indigo-500 bg-indigo-50/80 dark:bg-indigo-950/60 text-indigo-900 dark:text-indigo-200 shadow-sm"
                            : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700"
                        }`}
                      >
                        <span
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-xs ${
                            isSelected
                              ? "border-indigo-600 bg-indigo-600 text-white"
                              : "border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-400 dark:text-slate-500"
                          }`}
                        >
                          {isSelected && "✓"}
                        </span>
                        <span>{option}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            {validationError && (
              <div className="rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/40 p-3 text-sm text-red-600 dark:text-red-400">
                {validationError}
              </div>
            )}

            {quizSubmitError && (
              <div className="rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/40 p-3 text-sm text-red-600 dark:text-red-400">
                {quizSubmitError}
              </div>
            )}

            {/* Submit Button */}
            <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-5">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Answered:{" "}
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {Object.keys(selectedAnswers).length}
                </span>{" "}
                of {activeQuiz.questions.length}
              </p>

              <button
                type="button"
                onClick={handleSubmitQuiz}
                disabled={quizSubmitting}
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-indigo-700 disabled:opacity-50"
              >
                {quizSubmitting ? (
                  <>
                    <LoaderCircle size={16} className="animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit Quiz <ArrowRight size={16} />
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // 6. Quizzes List View (when enrolled)
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Course Quizzes</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Assessments designed to test your mastery of the material
          </p>
        </div>
        <span className="rounded-full bg-indigo-50 dark:bg-indigo-950/60 px-3 py-1 text-xs font-semibold text-indigo-700 dark:text-indigo-300">
          {quizzes.length} {quizzes.length === 1 ? "Quiz" : "Quizzes"} available
        </span>
      </div>

      <div className="grid gap-3">
        {quizzes.map((quiz, idx) => (
          <div
            key={quiz._id}
            className="flex items-center justify-between rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm transition hover:border-indigo-300 dark:hover:border-indigo-500"
          >
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold">
                {idx + 1}
              </span>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white">{quiz.title}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {quiz.questions?.length || 0} Questions • Multiple Choice
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleStartQuiz(quiz)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-indigo-700"
            >
              Start Quiz <ChevronRight size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
