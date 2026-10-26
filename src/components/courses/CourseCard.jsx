import {
  BookOpen,
  Clock,
  IndianRupee,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import { Link } from "react-router-dom";

const CourseCard = ({ course, isCompleted = false, to }) => {
  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative h-48 overflow-hidden bg-slate-100">
        {course.thumbnail ? (
          <img
            src={course.thumbnail}
            alt={course.title || "Course thumbnail"}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <BookOpen size={48} className="text-slate-400" />
          </div>
        )}

        <span className="absolute left-3 top-3 rounded-lg bg-white/95 px-3 py-1 text-xs font-semibold text-slate-700">
          {course.level || "All Levels"}
        </span>

        {isCompleted && (
          <span className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-lg bg-green-600 px-3 py-1.5 text-xs font-semibold text-white">
            <CheckCircle size={14} />
            Completed
          </span>
        )}

        {course.category && (
          <span className="absolute right-3 top-3 rounded-lg bg-indigo-600 px-3 py-1 text-xs font-semibold text-white">
            {course.category}
          </span>
        )}
      </div>

      <div className="p-5">
        <h2 className="line-clamp-2 text-lg font-bold text-slate-900">
          {course.title || "Untitled Course"}
        </h2>

        <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-slate-500">
          {course.description || "Explore this course and start learning."}
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500">
          <span className="flex items-center gap-1.5">
            <Clock size={16} />
            {course.duration ?? 0} hours
          </span>

          <span className="flex items-center gap-1.5">
            <IndianRupee size={16} />
            {course.price ?? 0}
          </span>
        </div>

        {course.whatYouWillLearn?.length > 0 && (
          <div className="mt-4 border-t border-slate-100 pt-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
              What you'll learn
            </p>

            <ul className="space-y-1.5">
              {course.whatYouWillLearn.slice(0, 2).map((item, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 text-sm text-slate-600"
                >
                  <CheckCircle
                    size={15}
                    className="mt-0.5 shrink-0 text-indigo-500"
                  />
                  <span className="line-clamp-1">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <Link
          to={to || `/courses/${course._id}`}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
        >
          {isCompleted ? "Review Course" : "Continue Learning"}
          <ArrowRight size={16} />
        </Link>
      </div>
    </article>
  );
};

export default CourseCard;
