import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { BookOpen, GraduationCap, ArrowRight } from "lucide-react";

import api from "../services/api";
import {
  fetchMyCoursesStart,
  fetchMyCoursesSuccess,
  fetchMyCoursesFailure,
} from "../store/slices/courseSlice";

import LoadingState from "../components/common/LoadingState";
import ErrorState from "../components/common/ErrorState";
import CourseCard from "../components/courses/CourseCard";

export default function MyLearning() {
  const dispatch = useDispatch();
  const [courseDetails, setCourseDetails] = useState({});

  const { myCourses, myCoursesLoading, myCoursesError } = useSelector(
    (state) => state.courses,
  );

  useEffect(() => {
    let cancelled = false;

    const fetchMyCourses = async () => {
      dispatch(fetchMyCoursesStart());

      try {
        const response = await api.get("/my-courses");
        const enrolledCourses = response.data.enrollments || [];

        if (cancelled) return;

        dispatch(fetchMyCoursesSuccess(enrolledCourses));

        const results = await Promise.all(
          enrolledCourses.map(async (item) => {
            const course = item.course || item;
            const courseId = course._id;

            if (!courseId) return null;

            try {
              const [lessonsResponse, progressResponse] = await Promise.all([
                api.get(`/courses/${courseId}/lessons`).catch((error) => {
                  if (error.response?.status === 404) {
                    return { data: { lessons: [] } };
                  }
                  throw error;
                }),
                api.get(`/courses/${courseId}/progress`).catch((error) => {
                  if (error.response?.status === 404) {
                    return {
                      data: {
                        progress: {
                          completedLessons: [],
                          percentage: 0,
                        },
                      },
                    };
                  }
                  throw error;
                }),
              ]);

              return {
                courseId,
                lessons: lessonsResponse.data.lessons || [],
                progress: progressResponse.data.progress || {
                  completedLessons: [],
                  percentage: 0,
                },
              };
            } catch (error) {
              console.error(
                `Unable to load course progress:`,
                error.response?.data || error.message,
              );

              return {
                courseId,
                lessons: [],
                progress: {
                  completedLessons: [],
                  percentage: 0,
                },
              };
            }
          }),
        );

        if (!cancelled) {
          const detailsMap = {};

          results.filter(Boolean).forEach((detail) => {
            detailsMap[detail.courseId] = detail;
          });

          setCourseDetails(detailsMap);
        }
      } catch (error) {
        if (!cancelled) {
          dispatch(
            fetchMyCoursesFailure(
              error.response?.data?.message ||
                "Unable to load your enrolled courses.",
            ),
          );
        }
      }
    };

    fetchMyCourses();

    return () => {
      cancelled = true;
    };
  }, [dispatch]);

  if (myCoursesLoading) return <LoadingState />;
  if (myCoursesError) return <ErrorState message={myCoursesError} />;

  const completedCoursesCount = myCourses.filter((item) => {
    const course = item.course || item;
    const details = courseDetails[course._id];
    const total = details?.lessons?.length || 0;
    const completed = details?.progress?.completedLessons?.length || 0;

    return total > 0 && completed >= total;
  }).length;

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Page heading */}
        <div className="mb-8">
          <p className="text-sm font-medium text-indigo-600">
            STUDENT DASHBOARD
          </p>

          <h1 className="mt-2 text-3xl font-bold text-gray-900">My Learning</h1>

          <p className="mt-2 text-gray-500">
            Continue learning and keep moving toward your goals.
          </p>
        </div>

        {/* Summary cards */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2">
          <div className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5">
            <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
              <BookOpen size={24} />
            </div>

            <div>
              <p className="text-sm text-gray-500">Enrolled courses</p>
              <p className="text-2xl font-bold text-gray-900">
                {myCourses.length}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5">
            <div className="rounded-xl bg-green-50 p-3 text-green-600">
              <GraduationCap size={24} />
            </div>

            <div>
              <p className="text-sm text-gray-500">Completed courses</p>
              <p className="text-2xl font-bold text-gray-900">
                {completedCoursesCount}
              </p>
            </div>
          </div>
        </div>

        {/* Course heading */}
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Your courses</h2>

          <Link
            to="/courses"
            className="text-sm font-semibold text-indigo-600 hover:text-indigo-700"
          >
            Browse courses
          </Link>
        </div>

        {/* Empty state or course cards */}
        {myCourses.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white px-6 py-14 text-center">
            <BookOpen size={40} className="mx-auto text-gray-400" />

            <h3 className="mt-4 text-lg font-semibold text-gray-900">
              No courses yet
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              Enroll in a course to start your learning journey.
            </p>

            <Link
              to="/courses"
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-700"
            >
              Explore courses
              <ArrowRight size={17} />
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {myCourses.map((item) => {
              const course = item.course || item;
              const details = courseDetails[course._id];

              const lessons = details?.lessons || [];
              const completedLessons =
                details?.progress?.completedLessons || [];

              const totalLessons = lessons.length;
              const completedCount = completedLessons.length;

              const isCourseCompleted =
                totalLessons > 0 && completedCount >= totalLessons;

              const isLessonCompleted = (lessonId) =>
                completedLessons.some((completedLesson) => {
                  const completedId =
                    typeof completedLesson === "object"
                      ? completedLesson?._id
                      : completedLesson;

                  return String(completedId) === String(lessonId);
                });

              const nextLesson = lessons.find(
                (lesson) => !isLessonCompleted(lesson._id),
              );

              const continueUrl = isCourseCompleted
                ? `/courses/${course._id}`
                : nextLesson
                  ? `/courses/${course._id}/lessons/${nextLesson._id}`
                  : `/courses/${course._id}`;

              return (
                <div key={course._id}>
                  <CourseCard
                    course={course}
                    isCompleted={isCourseCompleted}
                    to={continueUrl}
                  />

                  {totalLessons > 0 && (
                    <div className="mt-3 px-1">
                      <div className="mb-2 flex justify-between text-xs text-gray-500">
                        <span>
                          {isCourseCompleted
                            ? "All lessons completed!"
                            : `${completedCount} of ${totalLessons} lessons completed`}
                        </span>

                        <span>
                          {Math.round((completedCount / totalLessons) * 100)}%
                        </span>
                      </div>

                      <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                        <div
                          className={`h-full rounded-full transition-all ${
                            isCourseCompleted ? "bg-green-500" : "bg-indigo-600"
                          }`}
                          style={{
                            width: `${Math.min(
                              100,
                              (completedCount / totalLessons) * 100,
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
