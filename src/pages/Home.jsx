import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Code2,
  Palette,
  BriefcaseBusiness,
  Globe,
  Star,
  Users,
  GraduationCap,
} from "lucide-react";

const categories = [
  { name: "Development", courses: "Web & software", icon: Code2 },
  { name: "Design", courses: "UI/UX & creative", icon: Palette },
  { name: "Business", courses: "Skills & strategy", icon: BriefcaseBusiness },
  { name: "Technology", courses: "Modern technologies", icon: Globe },
];

const benefits = [
  "Learn at your own pace",
  "Track your learning progress",
  "Practice with course quizzes",
];

export default function Home() {
  return (
    <div className="overflow-hidden bg-white text-gray-900">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-indigo-50 via-white to-violet-50">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 md:py-28 lg:grid-cols-2 lg:px-8">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white px-4 py-2 text-sm font-medium text-indigo-700">
              <Star size={16} />
              Your learning journey starts here
            </div>

            <h1 className="max-w-2xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Learn new skills.
              <span className="block text-indigo-600">Build your future.</span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-gray-600">
              Explore courses, learn from structured lessons, and build
              practical skills one step at a time.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/courses"
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:-translate-y-0.5 hover:bg-indigo-700"
              >
                Explore courses
                <ArrowRight size={18} />
              </Link>

              <Link
                to="/register"
                className="rounded-xl border border-gray-200 bg-white px-6 py-3.5 font-semibold text-gray-800 transition hover:bg-gray-50"
              >
                Join LearnHub
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-gray-600">
              <span className="flex items-center gap-2">
                <CheckCircle2 size={17} className="text-green-600" />
                Self-paced learning
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 size={17} className="text-green-600" />
                Progress tracking
              </span>
            </div>
          </div>

          {/* Decorative learning illustration */}
          <div className="relative mx-auto w-full max-w-lg">
            <div className="absolute -right-5 -top-5 h-32 w-32 rounded-full bg-violet-200/60 blur-3xl" />
            <div className="absolute -bottom-5 -left-5 h-32 w-32 rounded-full bg-indigo-200/70 blur-3xl" />

            <div className="relative rounded-3xl border border-white bg-white p-5 shadow-2xl shadow-indigo-900/10 sm:p-7">
              <div className="flex items-center justify-between border-b border-gray-100 pb-5">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-indigo-100 p-3 text-indigo-700">
                    <GraduationCap size={25} />
                  </div>
                  <div>
                    <p className="font-bold">Your learning space</p>
                    <p className="text-sm text-gray-500">
                      Learn something new today
                    </p>
                  </div>
                </div>
                <BookOpen className="text-indigo-500" size={23} />
              </div>

              <div className="mt-5 space-y-4">
                <div className="rounded-2xl bg-indigo-50 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm text-indigo-700">
                        Continue learning
                      </p>
                      <h3 className="mt-1 font-bold text-gray-900">
                        Web Development
                      </h3>
                    </div>
                    <Code2 className="text-indigo-600" size={30} />
                  </div>
                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-indigo-100">
                    <div className="h-full w-3/5 rounded-full bg-indigo-600" />
                  </div>
                  <p className="mt-2 text-xs text-gray-500">
                    Illustrative progress
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-gray-100 p-4">
                    <Users className="text-violet-600" size={23} />
                    <p className="mt-3 text-sm text-gray-500">Learn together</p>
                    <p className="mt-1 font-bold">Grow your skills</p>
                  </div>
                  <div className="rounded-2xl border border-gray-100 p-4">
                    <CheckCircle2 className="text-green-600" size={23} />
                    <p className="mt-3 text-sm text-gray-500">Keep improving</p>
                    <p className="mt-1 font-bold">Track progress</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="font-semibold text-indigo-600">EXPLORE TOPICS</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Find your learning path
            </h2>
            <p className="mt-3 max-w-2xl text-gray-600">
              Discover areas where you can build knowledge and practical skills.
            </p>
          </div>
          <Link
            to="/courses"
            className="inline-flex items-center gap-2 font-semibold text-indigo-600 hover:text-indigo-700"
          >
            All courses <ArrowRight size={18} />
          </Link>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map(({ name, courses, icon: Icon }) => (
            <Link
              key={name}
              to="/courses"
              className="group rounded-2xl border border-gray-200 p-6 transition hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg"
            >
              <div className="inline-flex rounded-xl bg-indigo-50 p-3 text-indigo-600 transition group-hover:bg-indigo-600 group-hover:text-white">
                <Icon size={25} />
              </div>
              <h3 className="mt-5 text-lg font-bold">{name}</h3>
              <p className="mt-2 text-sm text-gray-500">{courses}</p>
              <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-indigo-600">
                Explore <ArrowRight size={16} />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-gray-50">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8">
          <div>
            <p className="font-semibold text-indigo-600">WHY LEARNHUB?</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Learning that fits your life
            </h2>
            <p className="mt-5 max-w-xl leading-7 text-gray-600">
              LearnHub brings courses, lessons, quizzes, and progress tracking
              together in one straightforward learning experience.
            </p>

            <ul className="mt-7 space-y-4">
              {benefits.map((benefit) => (
                <li key={benefit} className="flex items-center gap-3">
                  <CheckCircle2 size={21} className="shrink-0 text-green-600" />
                  <span className="text-gray-700">{benefit}</span>
                </li>
              ))}
            </ul>

            <Link
              to="/courses"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-gray-900 px-6 py-3.5 font-semibold text-white transition hover:bg-gray-800"
            >
              Start exploring <ArrowRight size={18} />
            </Link>
          </div>

          <div className="rounded-3xl bg-indigo-600 p-8 text-white sm:p-10">
            <GraduationCap size={42} />
            <h3 className="mt-6 text-2xl font-bold">
              Take the next step in your learning journey
            </h3>
            <p className="mt-4 leading-7 text-indigo-100">
              Find a course, follow its lessons, and use quizzes to check your
              understanding.
            </p>
            <Link
              to="/register"
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-indigo-700 transition hover:bg-indigo-50"
            >
              Create your account <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Ready to start learning?
        </h2>
        <p className="mx-auto mt-4 max-w-2xl leading-7 text-gray-600">
          Explore the available courses and find a subject that interests you.
        </p>
        <Link
          to="/courses"
          className="mt-7 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 font-semibold text-white transition hover:bg-indigo-700"
        >
          Browse courses <ArrowRight size={18} />
        </Link>
      </section>
    </div>
  );
}
