import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, Clock, ArrowRight, GraduationCap } from "lucide-react";
import api from "../services/api";
import { LoadingState } from "../components/common/LoadingState";
import { ErrorState } from "../components/common/ErrorState";
import { EmptyState } from "../components/common/EmptyState";

export default function MyLearning() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMyCourses = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/my-courses");

        console.log("My enrolled courses:", response.data);

        // Adjust this if your backend returns a different response structure.
        const enrolledCourses =
          response.data.courses || response.data.enrollments || [];

        setCourses(enrolledCourses);
      } catch (error) {
        setError(
          error.response?.data?.message ||
            "Unable to load your enrolled courses.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMyCourses();
  }, []);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <p className="text-sm font-medium text-indigo-600">
            STUDENT DASHBOARD
          </p>

          <h1 className="mt-2 text-3xl font-bold text-gray-900">My Learning</h1>

          <p className="mt-2 text-gray-500">
            Continue learning and keep moving toward your goals.
          </p>
        </div>

        {/* Summary */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2">
          <div className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5">
            <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
              <BookOpen size={24} />
            </div>

            <div>
              <p className="text-sm text-gray-500">Enrolled courses</p>
              <p className="text-2xl font-bold text-gray-900">
                {courses.length}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5">
            <div className="rounded-xl bg-green-50 p-3 text-green-600">
              <GraduationCap size={24} />
            </div>

            <div>
              <p className="text-sm text-gray-500">Learning status</p>
              <p className="text-lg font-semibold text-gray-900">
                Keep learning
              </p>
            </div>
          </div>
        </div>

        {/* Course list */}
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Your courses</h2>

          <Link
            to="/courses"
            className="text-sm font-semibold text-indigo-600 hover:text-indigo-700"
          >
            Browse courses
          </Link>
        </div>

        {courses.length === 0 ? (
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
            {courses.map((item) => {
              // Supports either a course object or an enrollment
              // containing a populated course field.
              const course = item.course || item;
              const courseId = course._id;

              return (
                <article
                  key={item._id || courseId}
                  className="overflow-hidden rounded-2xl border border-gray-200 bg-white transition hover:shadow-md"
                >
                  {course.thumbnail ? (
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="aspect-video w-full bg-gray-100 object-cover"
                    />
                  ) : (
                    <div className="flex aspect-video items-center justify-center bg-indigo-50 text-indigo-400">
                      <BookOpen size={42} />
                    </div>
                  )}

                  <div className="p-5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-md bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700">
                        {course.category || "General"}
                      </span>

                      <span className="text-xs capitalize text-gray-500">
                        {course.level || "All levels"}
                      </span>
                    </div>

                    <h3 className="mt-3 text-lg font-bold text-gray-900">
                      {course.title || "Untitled course"}
                    </h3>

                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-500">
                      {course.description || "Start learning this course."}
                    </p>

                    <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
                      <Clock size={16} />
                      {course.duration ?? 0} hours
                    </div>

                    <Link
                      to={`/courses/${courseId}`}
                      className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
                    >
                      Continue Learning
                      <ArrowRight size={17} />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
