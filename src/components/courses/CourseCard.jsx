import { BookOpen, Clock, IndianRupee, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const CourseCard = ({ course }) => {
  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      {/* Thumbnail */}
      <div className="relative h-48 overflow-hidden bg-slate-100">
        <img
          src={course.thumbnail}
          alt={course.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(event) => {
            event.currentTarget.style.display = "none";
          }}
        />

        <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold capitalize text-slate-700 shadow-sm">
          {course.level}
        </span>

        <span className="absolute right-3 top-3 rounded-full bg-indigo-600 px-3 py-1 text-xs font-semibold text-white">
          {course.category}
        </span>
      </div>

      {/* Course details */}
      <div className="p-5">
        <h2 className="line-clamp-2 min-h-12 text-lg font-bold text-slate-900">
          {course.title}
        </h2>

        <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-slate-500">
          {course.description}
        </p>

        {/* Duration and price */}
        <div className="mt-4 flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Clock size={16} />
            <span>{course.duration} hours</span>
          </div>

          <div className="flex items-center gap-1 text-lg font-bold text-slate-900">
            <IndianRupee size={17} />
            <span>{course.price}</span>
          </div>
        </div>

        {/* Learning outcomes */}
        {course.whatYouWillLearn?.length > 0 && (
          <div className="mt-4">
            <h3 className="mb-2 text-sm font-semibold text-slate-800">
              What you'll learn
            </h3>

            <ul className="space-y-2">
              {course.whatYouWillLearn.slice(0, 2).map((item, index) => (
                <li
                  key={`${course._id}-${index}`}
                  className="flex items-start gap-2 text-sm text-slate-500"
                >
                  <BookOpen
                    size={15}
                    className="mt-0.5 shrink-0 text-indigo-600"
                  />
                  <span className="line-clamp-1">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* View course */}
        <Link
          to={`/courses/${course._id}`}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
        >
          View Course
          <ArrowRight
            size={16}
            className="transition-transform group-hover:translate-x-1"
          />
        </Link>
      </div>
    </article>
  );
};

export default CourseCard;
