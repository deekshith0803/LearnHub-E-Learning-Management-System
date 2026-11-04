import { NavLink, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  GraduationCap,
  Compass,
  UserRound,
  Home,
  LogOut,
  BookOpen,
  X,
} from "lucide-react";
import api from "../../services/api";
import { logout } from "../../store/slices/authSlice";

export default function StudentSidebar({ onClose }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch {
      // ignore server logout error
    } finally {
      dispatch(logout());
      if (onClose) onClose();
      navigate("/login", { replace: true });
    }
  };

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all ${
      isActive
        ? "bg-indigo-600 text-white shadow-sm shadow-indigo-200"
        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
    }`;

  const initials =
    user?.name
      ?.trim()
      ?.split(/\s+/)
      ?.map((n) => n[0])
      ?.slice(0, 2)
      ?.join("")
      ?.toUpperCase() || "ST";

  return (
    <aside className="flex h-full w-64 flex-col justify-between border-r border-slate-200 bg-white p-5">
      {/* Top Section */}
      <div className="space-y-6">
        {/* Brand Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <Link
            to="/dashboard"
            onClick={onClose}
            className="flex items-center gap-2.5"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm shadow-indigo-200">
              <BookOpen size={20} />
            </span>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-slate-900 leading-tight">
                Learn<span className="text-indigo-600">Hub</span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
                Student Portal
              </span>
            </div>
          </Link>

          {/* Close button on mobile */}
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 md:hidden"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1.5">
          <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Learning Menu
          </p>

          <NavLink to="/dashboard" end className={navLinkClass} onClick={onClose}>
            <GraduationCap size={19} />
            My Learning
          </NavLink>

          <NavLink to="/courses" className={navLinkClass} onClick={onClose}>
            <Compass size={19} />
            Explore Courses
          </NavLink>

          <NavLink to="/profile" className={navLinkClass} onClick={onClose}>
            <UserRound size={19} />
            My Profile
          </NavLink>

          <div className="pt-4 pb-1">
            <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              General
            </p>
          </div>

          <Link
            to="/"
            className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-all"
            onClick={onClose}
          >
            <Home size={19} />
            Public Home
          </Link>
        </nav>
      </div>

      {/* Bottom User Profile & Logout */}
      <div className="border-t border-slate-100 pt-4">
        <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-2.5 mb-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-100 font-bold text-xs text-indigo-700">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold text-slate-900">
              {user?.name || "Student User"}
            </p>
            <p className="truncate text-[11px] text-slate-500">
              {user?.email || "student@learnhub.com"}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-2 text-xs font-semibold text-slate-700 transition hover:bg-red-50 hover:border-red-200 hover:text-red-600"
        >
          <LogOut size={15} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
