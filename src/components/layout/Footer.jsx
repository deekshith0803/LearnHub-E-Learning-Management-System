import { BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

const currentYear = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <BookOpen className="text-indigo-600 dark:text-indigo-400" size={22} />
          <span className="font-bold text-gray-900 dark:text-white">
            Learn<span className="text-indigo-600 dark:text-indigo-400">Hub</span>
          </span>
        </Link>

        <p className="text-sm text-gray-500 dark:text-gray-400">
          Learn new skills. Build your future.
        </p>

        <p className="text-sm text-gray-500 dark:text-gray-400">
          © {currentYear} LearnHub
        </p>
      </div>
    </footer>
  );
}
