import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Code2,
  Palette,
  BriefcaseBusiness,
  Globe,
  Star,
  GraduationCap,
  Sparkles,
  Award,
  Video,
} from "lucide-react";
import api from "../services/api";
import CourseCard from "../components/courses/CourseCard";

const categories = [
  { name: "Development", description: "Web, Fullstack & Mobile", icon: Code2 },
  { name: "Design", description: "UI/UX, Figma & Creative", icon: Palette },
  { name: "Business", description: "Leadership & Management", icon: BriefcaseBusiness },
  { name: "Technology", description: "Cloud, AI & DevOps", icon: Globe },
];

const highlights = [
  "Self-paced on-demand video learning",
  "Real-time progress tracking across every lesson",
  "Interactive quizzes to validate your skills",
  "Instructor-led curriculum and insights",
];

export default function Home() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);

  // Fetch real courses from backend instead of dummy mockups
  useEffect(() => {
    let cancelled = false;

    const fetchFeatured = async () => {
      try {
        const res = await api.get("/courses");
        if (!cancelled && res.data?.courses) {
          // Show top 3 active platform courses
          setFeaturedCourses(res.data.courses.slice(0, 3));
        }
      } catch {
        if (!cancelled) setFeaturedCourses([]);
      } finally {
        if (!cancelled) setLoadingCourses(false);
      }
    };

    fetchFeatured();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="overflow-hidden bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-indigo-50/70 via-white to-violet-50/70 dark:from-slate-900 dark:via-slate-950 dark:to-indigo-950/40 border-b border-slate-100 dark:border-slate-800/80">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 md:py-24 lg:grid-cols-2 lg:px-8">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-100 dark:border-indigo-900/60 bg-white dark:bg-slate-900 px-4 py-2 text-sm font-medium text-indigo-700 dark:text-indigo-400 shadow-2xs">
              <Sparkles size={16} />
              Empowering your learning journey
            </div>

            <h1 className="max-w-2xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl text-slate-950 dark:text-white">
              Learn new skills.
              <span className="block text-indigo-600 dark:text-indigo-400">
                Build your future.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-base sm:text-lg leading-relaxed text-slate-600 dark:text-slate-300">
              Explore authentic courses created by experienced instructors. Watch
              lessons, measure your comprehension with quizzes, and advance at
              your own pace.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/courses"
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:-translate-y-0.5 hover:bg-indigo-700"
              >
                Browse all courses
                <ArrowRight size={18} />
              </Link>

              {isAuthenticated ? (
                <Link
                  to={
                    user?.role === "instructor"
                      ? "/instructor"
                      : user?.role === "admin"
                        ? "/admin"
                        : "/dashboard"
                  }
                  className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-6 py-3.5 font-semibold text-slate-800 dark:text-slate-200 transition hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  Go to my dashboard
                </Link>
              ) : (
                <Link
                  to="/register"
                  className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-6 py-3.5 font-semibold text-slate-800 dark:text-slate-200 transition hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  Join for free
                </Link>
              )}
            </div>

            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-600 dark:text-slate-400">
              <span className="flex items-center gap-2">
                <CheckCircle2 size={17} className="text-emerald-600 dark:text-emerald-400" />
                Structured Video Lessons
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 size={17} className="text-emerald-600 dark:text-emerald-400" />
                Integrated Quizzes
              </span>
            </div>
          </div>

          {/* Hero Feature Showcase Card */}
          <div className="relative mx-auto w-full max-w-lg">
            <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-5">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-indigo-50 dark:bg-indigo-950/60 p-3 text-indigo-600 dark:text-indigo-400">
                    <GraduationCap size={26} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white">
                      LearnHub Student Hub
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Your personalized learning ecosystem
                    </p>
                  </div>
                </div>
                <BookOpen className="text-indigo-600 dark:text-indigo-400" size={24} />
              </div>

              <div className="mt-6 space-y-4">
                <div className="flex items-start gap-3.5 rounded-2xl bg-indigo-50/60 dark:bg-slate-800/80 p-4 border border-indigo-100/60 dark:border-slate-700/60">
                  <Video className="text-indigo-600 dark:text-indigo-400 mt-0.5 shrink-0" size={20} />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      High Quality Lessons
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                      Stream course chapters seamlessly with full progress remembering.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 rounded-2xl bg-emerald-50/60 dark:bg-slate-800/80 p-4 border border-emerald-100/60 dark:border-slate-700/60">
                  <Award className="text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" size={20} />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      Knowledge Verification
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                      Instant evaluation on chapter quizzes with comprehensive answer reviews.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 rounded-2xl bg-violet-50/60 dark:bg-slate-800/80 p-4 border border-violet-100/60 dark:border-slate-700/60">
                  <Star className="text-violet-600 dark:text-violet-400 mt-0.5 shrink-0" size={20} />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      Self-Paced Progress
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                      Pick up right where you left off from your student dashboard.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Real Platform Courses */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end mb-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              POPULAR COURSES
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
              Featured on LearnHub
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Explore real courses published by our verified instructors.
            </p>
          </div>

          <Link
            to="/courses"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            <span>View all courses</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        {loadingCourses ? (
          <div className="py-12 text-center text-slate-400">
            <div className="h-8 w-8 mx-auto animate-spin rounded-full border-3 border-indigo-600 border-t-transparent mb-2" />
            <p className="text-xs">Loading course catalog...</p>
          </div>
        ) : featuredCourses.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 p-8 text-center bg-slate-50 dark:bg-slate-900">
            <BookOpen size={32} className="mx-auto text-slate-400 mb-2" />
            <p className="font-semibold text-slate-700 dark:text-slate-300">
              New courses are being added
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Check out the full course catalog to discover available subjects.
            </p>
            <Link
              to="/courses"
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white"
            >
              Browse courses
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredCourses.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
        )}
      </section>

      {/* Categories */}
      <section className="bg-slate-50 dark:bg-slate-900/50 py-16 border-y border-slate-200 dark:border-slate-800 transition-colors">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              EXPLORE BY TOPIC
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
              Find your learning path
            </h2>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map(({ name, description, icon: Icon }) => (
              <Link
                key={name}
                to={`/courses`}
                className="group rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 transition hover:-translate-y-1 hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-lg"
              >
                <div className="inline-flex rounded-xl bg-indigo-50 dark:bg-slate-800 p-3 text-indigo-600 dark:text-indigo-400 transition group-hover:bg-indigo-600 group-hover:text-white">
                  <Icon size={24} />
                </div>
                <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white">
                  {name}
                </h3>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  {description}
                </p>
                <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                  <span>Explore</span>
                  <ArrowRight size={14} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Highlights & Benefits */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-indigo-600 p-8 sm:p-12 text-white">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-wider text-indigo-200">
              LEARNING EXPERIENCE
            </p>
            <h2 className="mt-2 text-3xl font-bold sm:text-4xl">
              Learning that fits your life
            </h2>
            <p className="mt-4 text-indigo-100 text-sm leading-relaxed">
              LearnHub brings structured video lessons, interactive comprehension
              quizzes, and detailed student progress together in one place.
            </p>

            <ul className="mt-6 space-y-3">
              {highlights.map((item, idx) => (
                <li key={idx} className="flex items-center gap-3 text-sm text-indigo-50">
                  <CheckCircle2 size={18} className="text-emerald-300 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/courses"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-50"
              >
                Start learning now
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
