import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  GraduationCap,
  LayoutDashboard,
  BookOpen,
  UserRound,
  LogOut,
  Menu,
  X,
  ExternalLink,
} from "lucide-react";

import api from "../../services/api";
import { logout } from "../../store/slices/authSlice";

export default function InstructorNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [logoutError, setLogoutError] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);

  const closeMenu = () => setMenuOpen(false);

  const handleLogout = async () => {
    setLogoutError("");

    try {
      await api.post("/auth/logout");
    } catch (error) {
      setLogoutError(
        error.response?.data?.message ||
          "Server logout failed. Your local session was cleared.",
      );
    } finally {
      dispatch(logout());
      closeMenu();
      navigate("/login", { replace: true });
    }
  };

  const navLinkClass = ({ isActive }) =>
    `inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
      isActive
        ? "bg-indigo-50 font-semibold text-indigo-700"
        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
    }`;

  const mobileNavLinkClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-lg px-3 py-2.5 text-base font-medium transition-colors ${
      isActive
        ? "bg-indigo-50 font-semibold text-indigo-700"
        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Brand / Logo */}
        <div className="flex items-center gap-8">
          <Link
            to="/instructor"
            onClick={closeMenu}
            className="group flex items-center gap-2.5"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm shadow-indigo-200 transition group-hover:bg-indigo-700">
              <GraduationCap size={20} />
            </span>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-slate-900 leading-tight">
                Learn<span className="text-indigo-600">Hub</span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
                Instructor Studio
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden items-center gap-1 md:flex">
            <NavLink to="/instructor" end className={navLinkClass}>
              <LayoutDashboard size={17} />
              Dashboard
            </NavLink>

            <NavLink to="/courses" className={navLinkClass}>
              <BookOpen size={17} />
              Courses
            </NavLink>

            <NavLink to="/profile" className={navLinkClass}>
              <UserRound size={17} />
              Profile
            </NavLink>

            <Link
              to="/"
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
              title="View public student portal"
            >
              <ExternalLink size={15} />
              Public Site
            </Link>
          </div>
        </div>

        {/* Right Section: Instructor Profile & Logout */}
        <div className="hidden items-center gap-3 md:flex">
          {/* Instructor badge */}
          <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-200 bg-sky-50 px-2.5 py-1 text-xs font-semibold text-sky-700">
            <GraduationCap size={13} />
            Instructor
          </span>

          {/* Instructor Name */}
          <div className="flex items-center gap-2 border-l border-slate-200 pl-3 text-sm font-medium text-slate-700">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-600">
              <UserRound size={16} />
            </span>
            <span className="max-w-[150px] truncate">
              {user?.name || "Instructor"}
            </span>
          </div>

          {/* Logout button */}
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3.5 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-red-600"
          >
            <LogOut size={16} />
            Log out
          </button>
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          className="rounded-lg p-2 text-slate-700 hover:bg-slate-100 md:hidden"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div className="space-y-4 border-t border-slate-200 bg-white px-4 py-5 md:hidden">
          <div className="flex flex-col gap-1">
            <NavLink
              to="/instructor"
              end
              className={mobileNavLinkClass}
              onClick={closeMenu}
            >
              <LayoutDashboard size={18} />
              Dashboard
            </NavLink>

            <NavLink
              to="/courses"
              className={mobileNavLinkClass}
              onClick={closeMenu}
            >
              <BookOpen size={18} />
              Courses
            </NavLink>

            <NavLink
              to="/profile"
              className={mobileNavLinkClass}
              onClick={closeMenu}
            >
              <UserRound size={18} />
              Profile
            </NavLink>

            <Link
              to="/"
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-base font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              onClick={closeMenu}
            >
              <ExternalLink size={18} />
              Public Site
            </Link>
          </div>

          <div className="border-t border-slate-100 pt-4">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-600">
                  <UserRound size={18} />
                </span>
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {user?.name || "Instructor"}
                  </p>
                  <p className="text-xs text-slate-500">{user?.email}</p>
                </div>
              </div>

              <span className="inline-flex items-center gap-1 rounded-full border border-sky-200 bg-sky-50 px-2.5 py-0.5 text-xs font-semibold text-sky-700">
                <GraduationCap size={12} /> Instructor
              </span>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-red-600"
            >
              <LogOut size={16} />
              Log out
            </button>
          </div>

          {logoutError && (
            <p role="alert" className="text-xs text-red-600">
              {logoutError}
            </p>
          )}
        </div>
      )}

      {logoutError && !menuOpen && (
        <p role="alert" className="px-4 pb-3 text-center text-xs text-red-600">
          {logoutError}
        </p>
      )}
    </header>
  );
}

