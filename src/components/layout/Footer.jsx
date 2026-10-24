import { BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <BookOpen className="text-indigo-600" size={22} />
          <span className="font-bold text-gray-900">
            Learn<span className="text-indigo-600">Hub</span>
          </span>
        </Link>

        <p className="text-sm text-gray-500">
          Learn new skills. Build your future.
        </p>

        <p className="text-sm text-gray-500">
          © {new Date().getFullYear()} LearnHub
        </p>
      </div>
    </footer>
  );
}
