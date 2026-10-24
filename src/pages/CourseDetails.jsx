import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import api from "../services/api";
import {
  fetchCourseDetailsFailure,
  fetchCourseDetailsStart,
  fetchCourseDetailsSuccess,
} from "../store/slices/courseSlice";
import { LoadingState } from "../components/common/LoadingState";
import { ErrorState } from "../components/common/ErrorState";
import { EmptyState } from "../components/common/EmptyState";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Clock,
  GraduationCap,
  IndianRupee,
  PlayCircle,
  ShieldCheck,
} from "lucide-react";
import {
  enrollCourseStart,
  enrollCourseSuccess,
  enrollCourseFailure,
  clearEnrollmentStatus,
  fetchMyCoursesStart,
  fetchMyCoursesSuccess,
  fetchMyCoursesFailure,
  addMyCourse,
} from "../store/slices/courseSlice";

const CourseDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const {
    course,
    loading,
    error,
    enrollmentLoading,
    enrollmentSuccess,
    enrollmentError,
    myCourses,
    myCoursesLoading,
  } = useSelector((state) => state.courses);

  useEffect(() => {
    const loadCourseDetail = async () => {
      // console.log("Course ID from URL:", id);

      dispatch(fetchCourseDetailsStart());
      try {
        const response = await api.get(`/courses/${id}`);

        const courseData = response?.data?.course;

        console.log("Course data:", courseData);
        console.log("Thumbnail:", courseData?.thumbnail);

        dispatch(fetchCourseDetailsSuccess(courseData));
      } catch (error) {
        dispatch(
          fetchCourseDetailsFailure(
            error.response?.data?.message ||
              error.response?.data?.error ||
              error.message,
          ),
        );
      }
    };
    loadCourseDetail();
  }, [id, dispatch]);

  useEffect(() => {
    const loadMyCourses = async () => {
      dispatch(fetchMyCoursesStart());

      try {
        const response = await api.get("/my-courses");

        dispatch(fetchMyCoursesSuccess(response.data.enrollments || []));
      } catch (error) {
        dispatch(
          fetchMyCoursesFailure(
            error.response?.data?.message || "Failed to load enrolled courses",
          ),
        );
      }
    };

    loadMyCourses();
  }, [dispatch]);

  const handleEnroll = async () => {
    dispatch(clearEnrollmentStatus());
    dispatch(enrollCourseStart());

    try {
      await api.post(`/courses/${id}/enroll`);
      dispatch(enrollCourseSuccess());
    } catch (error) {
      const status = error.response?.status;
      const message =
        error.response?.data?.message || "Unable to enroll. Please try again.";

      if (
        status === 409 ||
        message.toLowerCase().includes("already enrolled")
      ) {
        dispatch(
          enrollCourseFailure("You are already enrolled in this course."),
        );
        return;
      }

      dispatch(enrollCourseFailure(message));
    }
  };

  if (loading) return <LoadingState />;

  if (error) return <ErrorState message={error} />;

  if (!course) return <EmptyState />;

  const alreadyEnrolled = myCourses.some((item) => item.course?._id === id);

  return (
    <main className="min-h-screen bg-gray-50 pb-12">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Link
          to="/courses"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-indigo-600"
        >
          <ArrowLeft size={17} />
          All Courses
        </Link>

        <div className="grid items-start gap-8 lg:grid-cols-[1fr_360px]">
          {/* Main course content */}
          <div className="min-w-0">
            {/* Course thumbnail */}
            <div className="mb-7 overflow-hidden rounded-2xl bg-gray-200">
              {course.thumbnail ? (
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="aspect-video w-full object-cover"
                  onError={(event) => {
                    event.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                <div className="flex aspect-video flex-col items-center justify-center gap-3 bg-indigo-50 text-indigo-400">
                  <BookOpen size={56} strokeWidth={1.5} />
                  <span className="text-sm font-medium">Course preview</span>
                </div>
              )}
            </div>

            {/* Course heading */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8">
              <div className="mb-4 flex flex-wrap gap-2">
                <span className="rounded-md bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-700">
                  {course.category}
                </span>

                <span className="rounded-md bg-gray-100 px-3 py-1.5 text-sm font-medium capitalize text-gray-600">
                  {course.level}
                </span>
              </div>

              <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900 sm:text-4xl">
                {course.title}
              </h1>

              <p className="mt-4 text-base leading-7 text-gray-600">
                {course.description}
              </p>

              <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 border-t border-gray-100 pt-5 text-sm text-gray-600">
                <span className="flex items-center gap-2">
                  <Clock size={18} className="text-indigo-600" />
                  {course.duration} hours
                </span>

                <span className="flex items-center gap-2">
                  <BookOpen size={18} className="text-indigo-600" />
                  Self-paced learning
                </span>

                <span className="flex items-center gap-2">
                  <GraduationCap size={19} className="text-indigo-600" />
                  Online course
                </span>
              </div>
            </div>

            {/* Learning outcomes */}
            <section className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 sm:p-8">
              <h2 className="text-xl font-bold text-gray-900">
                What you'll learn
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Skills and knowledge covered in this course.
              </p>

              {course.whatYouWillLearn?.length > 0 ? (
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {course.whatYouWillLearn.map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle2
                        size={19}
                        className="mt-0.5 shrink-0 text-green-600"
                      />
                      <p className="text-sm leading-6 text-gray-600">{item}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-5 text-sm text-gray-500">
                  Learning outcomes haven't been added yet.
                </p>
              )}
            </section>

            {/* Requirements */}
            <section className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 sm:p-8">
              <h2 className="text-xl font-bold text-gray-900">Requirements</h2>

              {course.requirements?.length > 0 ? (
                <ul className="mt-5 space-y-3">
                  {course.requirements.map((item, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 text-sm leading-6 text-gray-600"
                    >
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-600" />
                      {item}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 text-sm text-gray-500">
                  No specific prerequisites listed.
                </p>
              )}
            </section>

            {/* About course */}
            <section className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 sm:p-8">
              <h2 className="text-xl font-bold text-gray-900">
                About this course
              </h2>

              <p className="mt-4 whitespace-pre-line text-sm leading-7 text-gray-600">
                {course.description}
              </p>
            </section>
          </div>

          {/* Enrollment card */}
          <aside className="h-fit rounded-2xl border border-gray-200 bg-white p-6 shadow-sm lg:sticky lg:top-6">
            <p className="text-sm font-medium text-gray-500">Course price</p>

            <div className="mt-2 text-3xl font-bold text-gray-900">
              {Number(course.price) === 0
                ? "Free"
                : `₹${Number(course.price).toLocaleString("en-IN")}`}
            </div>

            <button
              type="button"
              onClick={handleEnroll}
              disabled={
                myCoursesLoading || enrollmentLoading || alreadyEnrolled
              }
              className="mt-6 w-full rounded-xl bg-indigo-600 px-5 py-3.5 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              {myCoursesLoading
                ? "Checking enrollment..."
                : enrollmentLoading
                  ? "Enrolling..."
                  : alreadyEnrolled
                    ? "Already Enrolled"
                    : "Enroll Now"}
            </button>

            {enrollmentSuccess && (
              <p className="mt-3 text-center text-sm text-green-600">
                Enrollment successful!
              </p>
            )}

            {enrollmentError && (
              <p
                role="status"
                className={`mt-3 text-center text-sm ${
                  alreadyEnrolled ? "text-amber-700" : "text-red-600"
                }`}
              >
                {enrollmentError}
              </p>
            )}

            <div className="my-6 border-t border-gray-100" />

            <h3 className="font-semibold text-gray-900">
              This course includes
            </h3>

            <ul className="mt-4 space-y-4 text-sm text-gray-600">
              <li className="flex items-start gap-3">
                <PlayCircle size={18} className="shrink-0 text-indigo-600" />
                Course learning materials
              </li>

              <li className="flex items-start gap-3">
                <Clock size={18} className="shrink-0 text-indigo-600" />
                {course.duration} hours of content
              </li>

              <li className="flex items-start gap-3">
                <GraduationCap size={19} className="shrink-0 text-indigo-600" />
                Self-paced learning
              </li>

              <li className="flex items-start gap-3">
                <ShieldCheck size={18} className="shrink-0 text-indigo-600" />
                Learn at your own pace
              </li>
            </ul>

            <Link
              to="/courses"
              className="mt-6 flex w-full items-center justify-center rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              Browse more courses
            </Link>
          </aside>
        </div>
      </div>
    </main>
  );
};

export default CourseDetails;
