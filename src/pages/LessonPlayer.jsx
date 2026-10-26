import { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  PlayCircle,
  CheckCircle,
} from "lucide-react";

import api from "../services/api";
import LoadingState from "../components/common/LoadingState";
import ErrorState from "../components/common/ErrorState";

import {
  fetchCourseDetailsFailure,
  fetchCourseDetailsStart,
  fetchCourseDetailsSuccess,
  fetchMyLessonsFailure,
  fetchMyLessonsStart,
  fetchMyLessonsSuccess,
  fetchProgressStart,
  fetchProgressSuccess,
  fetchProgressFailure,
  updateProgressStart,
  updateProgressSuccess,
  updateProgressFailure,
} from "../store/slices/courseSlice";

function getYouTubeEmbedUrl(url) {
  const videoId = url?.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/))([^&?/]+)/,
  )?.[1];

  return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
}

export default function LessonPlayer() {
  const { id, lessonId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    course,
    loading: courseLoading,
    error: courseError,
    myLesson: lessons = [],
    myLessonLoading,
    myLessonError,
    progress,
    progressLoading,
    progressError,
    progressSaving,
  } = useSelector((state) => state.courses);

  useEffect(() => {
    let cancelled = false;

    const fetchCourse = async () => {
      dispatch(fetchCourseDetailsStart());
      try {
        const response = await api.get(`/courses/${id}`);
        if (!cancelled) {
          dispatch(fetchCourseDetailsSuccess(response.data.course));
        }
      } catch (error) {
        if (!cancelled) {
          dispatch(
            fetchCourseDetailsFailure(
              error.response?.data?.message || "Unable to load this course.",
            ),
          );
        }
      }
    };

    const fetchLessons = async () => {
      dispatch(fetchMyLessonsStart());
      try {
        const response = await api.get(`/courses/${id}/lessons`);
        if (!cancelled) {
          dispatch(fetchMyLessonsSuccess(response.data.lessons || []));
        }
      } catch (error) {
        if (cancelled) return;
        if (error.response?.status === 404) {
          dispatch(fetchMyLessonsSuccess([]));
        } else {
          dispatch(
            fetchMyLessonsFailure(
              error.response?.data?.message ||
                "Unable to load lessons. Please try again.",
            ),
          );
        }
      }
    };

    const fetchProgress = async () => {
      dispatch(fetchProgressStart());
      try {
        const response = await api.get(`/courses/${id}/progress`);
        if (!cancelled) {
          dispatch(fetchProgressSuccess(response.data.progress));
        }
      } catch (error) {
        if (cancelled) return;
        if (error.response?.status === 404) {
          dispatch(
            fetchProgressSuccess({ completedLessons: [], percentage: 0 }),
          );
        } else {
          dispatch(
            fetchProgressFailure(
              error.response?.data?.message ||
                "Unable to load course progress.",
            ),
          );
        }
      }
    };

    if (id) {
      fetchCourse();
      fetchLessons();
      fetchProgress();
    }

    return () => {
      cancelled = true;
    };
  }, [id, dispatch]);

  const currentIndex = lessons.findIndex(
    (item) => String(item._id) === String(lessonId),
  );

  const lesson = currentIndex >= 0 ? lessons[currentIndex] : null;
  const previousLesson = currentIndex > 0 ? lessons[currentIndex - 1] : null;
  const nextLesson =
    currentIndex >= 0 && currentIndex < lessons.length - 1
      ? lessons[currentIndex + 1]
      : null;

  const isLessonCompleted = (targetLessonId) =>
    progress?.completedLessons?.some(
      (item) => String(item?._id ?? item) === String(targetLessonId),
    ) ?? false;

  const markLessonComplete = async () => {
    if (!id || !lesson?._id || progressSaving) return false;
    if (isLessonCompleted(lesson._id)) return true;

    dispatch(updateProgressStart());
    try {
      const response = await api.put(`/courses/${id}/progress`, {
        lessonId: lesson._id,
      });
      dispatch(updateProgressSuccess(response.data.progress));
      return true;
    } catch (error) {
      console.error("Progress error:", error.response?.data || error.message);
      dispatch(
        updateProgressFailure(
          error.response?.data?.message ||
            error.message ||
            "Unable to save lesson progress.",
        ),
      );
      return false;
    }
  };

  const handleNextLesson = async () => {
    if (!nextLesson || progressSaving) return;
    const saved = await markLessonComplete();
    if (!saved) return;
    navigate(`/courses/${id}/lessons/${nextLesson._id}`);
  };

  if (courseLoading || myLessonLoading) return <LoadingState />;
  if (courseError) return <ErrorState message={courseError} />;
  if (myLessonError) return <ErrorState message={myLessonError} />;

  if (currentIndex === -1 || !lesson) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-xl font-bold">Lesson not found</h1>
        <Link
          to={`/courses/${id}`}
          className="mt-4 inline-block text-indigo-600"
        >
          Back to course
        </Link>
      </div>
    );
  }

  const videoUrl = getYouTubeEmbedUrl(lesson.videoUrl);
  const percentage = progress?.percentage ?? 0;
  const currentLessonCompleted = isLessonCompleted(lesson._id);

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Link
          to={`/courses/${id}`}
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-indigo-600"
        >
          <ArrowLeft size={17} />
          Back to course
        </Link>

        <div className="grid items-start gap-8 lg:grid-cols-[1fr_340px]">
          <section className="min-w-0">
            <div className="overflow-hidden rounded-2xl bg-black">
              {videoUrl ? (
                <iframe
                  key={lesson._id}
                  src={videoUrl}
                  title={lesson.title}
                  className="aspect-video w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              ) : (
                <div className="flex aspect-video flex-col items-center justify-center gap-3 px-4 text-center text-white">
                  <PlayCircle size={48} />
                  <p>Please add a valid YouTube URL to this lesson.</p>
                </div>
              )}
            </div>

            <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-5">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-gray-900">Course progress</h2>
                <span className="text-sm font-bold text-indigo-600">
                  {percentage}%
                </span>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full bg-indigo-600 transition-all"
                  style={{ width: `${percentage}%` }}
                />
              </div>

              {progressError && (
                <p className="mt-3 text-sm text-red-600">{progressError}</p>
              )}

              <button
                type="button"
                onClick={markLessonComplete}
                disabled={
                  progressSaving || progressLoading || currentLessonCompleted
                }
                className="mt-5 rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {progressSaving
                  ? "Saving..."
                  : currentLessonCompleted
                    ? "✓ Completed"
                    : "Mark as Complete"}
              </button>
            </div>

            <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 sm:p-8">
              <p className="text-sm font-medium text-indigo-600">
                LESSON {currentIndex + 1} OF {lessons.length}
              </p>
              <h1 className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl">
                {lesson.title}
              </h1>
              <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
                <Clock size={17} />
                {lesson.duration} minutes
              </div>

              <div className="mt-6 border-t border-gray-100 pt-6">
                <h2 className="text-lg font-semibold text-gray-900">
                  About this lesson
                </h2>
                <p className="mt-3 whitespace-pre-line text-sm leading-7 text-gray-600">
                  {lesson.description}
                </p>
              </div>

              <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-6">
                {previousLesson ? (
                  <Link
                    to={`/courses/${id}/lessons/${previousLesson._id}`}
                    className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                  >
                    <ArrowLeft size={17} />
                    Previous lesson
                  </Link>
                ) : (
                  <span />
                )}

                {nextLesson && (
                  <button
                    type="button"
                    onClick={handleNextLesson}
                    disabled={progressSaving}
                    className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {progressSaving ? "Saving..." : "Next lesson"}
                    <ArrowRight size={17} />
                  </button>
                )}
              </div>
            </div>
          </section>

          <aside className="rounded-2xl border border-gray-200 bg-white p-5 lg:sticky lg:top-6">
            <div className="mb-5">
              <p className="text-sm font-medium text-indigo-600">YOUR COURSE</p>
              <h2 className="mt-2 text-lg font-bold text-gray-900">
                {course?.title || "Course lessons"}
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                {lessons.length} lessons
              </p>
            </div>

            <div className="max-h-[520px] space-y-2 overflow-y-auto">
              {lessons.map((item, index) => {
                const isActive = String(item._id) === String(lessonId);
                const completed = isLessonCompleted(item._id);

                return (
                  <Link
                    key={item._id}
                    to={`/courses/${id}/lessons/${item._id}`}
                    className={`flex items-start gap-3 rounded-xl border p-3 transition ${
                      isActive
                        ? "border-indigo-200 bg-indigo-50"
                        : "border-transparent hover:bg-gray-50"
                    }`}
                  >
                    <div
                      className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                        completed
                          ? "bg-green-100 text-green-600"
                          : isActive
                            ? "bg-indigo-600 text-white"
                            : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {completed ? (
                        <CheckCircle size={19} />
                      ) : (
                        <PlayCircle size={19} />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-gray-400">
                        LESSON {index + 1}
                      </p>
                      <p
                        className={`mt-1 text-sm font-semibold ${
                          isActive ? "text-indigo-700" : "text-gray-800"
                        }`}
                      >
                        {item.title}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        {item.duration} minutes
                      </p>
                      {completed && (
                        <p className="mt-1 text-xs font-medium text-green-600">
                          Completed
                        </p>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
