import { NavLink, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  GraduationCap,
  LayoutDashboard,
  BookOpen,
  UserRound,
  LogOut,
  X,
} from "lucide-react";
import api from "../../services/api";
import { logout } from "../../store/slices/authSlice";

export default function InstructorSidebar({ onClose }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch {
      // ignore
    } finally {
      dispatch(logout());
      if (onClose) onClose();
      navigate("/login", { replace: true });
    }
  };

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all ${
      isActive
        ? "bg-indigo-600 text-white shadow-sm shadow-indigo-200 dark:shadow-none"
        : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
    }`;

  const initials =
    user?.name
      ?.trim()
      ?.split(/\s+/)
      ?.map((n) => n[0])
      ?.slice(0, 2)
      ?.join("")
      ?.toUpperCase() || "IN";

  return (
    <aside className="flex h-full w-64 flex-col justify-between border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 transition-colors">
      {/* Top Section */}
      <div className="space-y-6">
        {/* Brand Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <Link
            to="/instructor"
            onClick={onClose}
            className="flex items-center gap-2.5"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm shadow-indigo-200 dark:shadow-none">
              <GraduationCap size={20} />
            </span>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
                Learn<span className="text-indigo-600 dark:text-indigo-400">Hub</span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Instructor Studio
              </span>
            </div>
          </Link>

          {/* Close button on mobile */}
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-300 md:hidden"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1.5">
          <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Teaching Management
          </p>

          <NavLink to="/instructor" end className={navLinkClass} onClick={onClose}>
            <LayoutDashboard size={19} />
            Studio Dashboard
          </NavLink>

          <NavLink
            to="/instructor/courses"
            className={navLinkClass}
            onClick={onClose}
          >
            <BookOpen size={19} />
            My Courses
          </NavLink>

          <NavLink
            to="/instructor/profile"
            className={navLinkClass}
            onClick={onClose}
          >
            <UserRound size={19} />
            Instructor Profile
          </NavLink>
        </nav>
      </div>

      {/* Bottom Profile & Logout */}
      <div className="border-t border-slate-100 dark:border-slate-800 pt-4">
        <div className="flex items-center gap-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 p-2.5 mb-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-950/60 font-bold text-xs text-indigo-700 dark:text-indigo-300">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <p className="truncate text-xs font-semibold text-slate-900 dark:text-white">
                {user?.name || "Instructor User"}
              </p>
              <span className="rounded bg-indigo-100 dark:bg-indigo-950/60 px-1.5 py-0.2 text-[9px] font-bold uppercase text-indigo-700 dark:text-indigo-300">
                Teacher
              </span>
            </div>
            <p className="truncate text-[11px] text-slate-500 dark:text-slate-400">
              {user?.email || "instructor@learnhub.com"}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 transition hover:bg-red-50 dark:hover:bg-red-950/30 hover:border-red-200 dark:hover:border-red-900/60 hover:text-red-600 dark:hover:text-red-400"
        >
          <LogOut size={15} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
