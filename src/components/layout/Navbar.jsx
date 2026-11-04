import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { BookOpen, Menu, X, UserRound, LogOut, Sun, Moon } from "lucide-react";

import api from "../../services/api";
import { logout } from "../../store/slices/authSlice";
import { useTheme } from "../../context/ThemeContext";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [logoutError, setLogoutError] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const navLinkClass = ({ isActive }) =>
    `transition-colors ${
      isActive
        ? "font-semibold text-indigo-600 dark:text-indigo-400"
        : "text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
    }`;

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

  const navLinks = (
    <>
      <NavLink to="/" end className={navLinkClass} onClick={closeMenu}>
        Home
      </NavLink>

      <NavLink to="/courses" className={navLinkClass} onClick={closeMenu}>
        Courses
      </NavLink>

      {isAuthenticated && (!user?.role || user?.role === "student") && (
        <NavLink to="/dashboard" className={navLinkClass} onClick={closeMenu}>
          My Learning
        </NavLink>
      )}

      {isAuthenticated && user?.role === "instructor" && (
        <NavLink to="/instructor" className={navLinkClass} onClick={closeMenu}>
          Instructor Dashboard
        </NavLink>
      )}

      {isAuthenticated && user?.role === "admin" && (
        <NavLink to="/admin" className={navLinkClass} onClick={closeMenu}>
          Admin Dashboard
        </NavLink>
      )}

      {isAuthenticated && (
        <NavLink
          to={
            user?.role === "instructor"
              ? "/instructor/profile"
              : user?.role === "admin"
                ? "/admin/profile"
                : "/profile"
          }
          className={navLinkClass}
          onClick={closeMenu}
        >
          My Profile
        </NavLink>
      )}
    </>
  );

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur transition-colors">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link to="/" onClick={closeMenu} className="flex items-center gap-2">
          <span className="rounded-xl bg-indigo-600 p-2 text-white shadow-xs">
            <BookOpen size={22} />
          </span>

          <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
            Learn<span className="text-indigo-600 dark:text-indigo-400">Hub</span>
          </span>
        </Link>

        {/* Desktop navigation */}
        <div className="hidden items-center gap-8 md:flex">{navLinks}</div>

        {/* Desktop authentication & Theme toggle */}
        <div className="hidden items-center gap-3 md:flex">
          {/* Simple Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-700 dark:text-gray-200 transition hover:bg-gray-100 dark:hover:bg-slate-700 shadow-2xs"
            title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            aria-label="Toggle dark mode"
          >
            {theme === "dark" ? (
              <Sun size={17} className="text-amber-400" />
            ) : (
              <Moon size={17} className="text-slate-600" />
            )}
          </button>

          {isAuthenticated ? (
            <>
              <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300">
                  <UserRound size={16} />
                </span>
                <span className="font-medium">{user?.name || "Student"}</span>
                {user?.role && user.role !== "student" && (
                  <span
                    className={`rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider ${
                      user.role === "admin"
                        ? "border border-indigo-200 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300"
                        : "border border-sky-200 bg-sky-50 dark:bg-sky-950/50 text-sky-700 dark:text-sky-300"
                    }`}
                  >
                    {user.role}
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-2 rounded-lg border border-gray-200 dark:border-slate-700 px-4 py-2 font-medium text-gray-700 dark:text-gray-200 transition hover:bg-gray-50 dark:hover:bg-slate-800"
              >
                <LogOut size={17} />
                Log out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-lg px-4 py-2 font-medium text-gray-700 dark:text-gray-200 transition hover:bg-gray-100 dark:hover:bg-slate-800"
              >
                Log in
              </Link>

              <Link
                to="/register"
                className="rounded-lg bg-indigo-600 px-5 py-2.5 font-semibold text-white transition hover:bg-indigo-700 shadow-sm"
              >
                Get started
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu and theme buttons */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            type="button"
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-700 dark:text-gray-200"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun size={17} className="text-amber-400" />
            ) : (
              <Moon size={17} className="text-slate-600" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="rounded-lg p-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile navigation */}
      {menuOpen && (
        <div className="space-y-4 border-t border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-5 md:hidden">
          <div className="flex flex-col gap-4">{navLinks}</div>

          <div className="border-t border-gray-100 dark:border-slate-800 pt-4">
            {isAuthenticated ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300">
                      <UserRound size={16} />
                    </span>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {user?.name || "Student"}
                    </p>
                  </div>
                  {user?.role && user.role !== "student" && (
                    <span
                      className={`rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider ${
                        user.role === "admin"
                          ? "border border-indigo-200 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300"
                          : "border border-sky-200 bg-sky-50 dark:bg-sky-950/50 text-sky-700 dark:text-sky-300"
                      }`}
                    >
                      {user.role}
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 dark:border-slate-700 px-4 py-3 font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-800"
                >
                  <LogOut size={17} />
                  Log out
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <Link
                  to="/login"
                  onClick={closeMenu}
                  className="rounded-lg border border-gray-200 dark:border-slate-700 px-4 py-3 text-center font-medium text-gray-700 dark:text-gray-200"
                >
                  Log in
                </Link>

                <Link
                  to="/register"
                  onClick={closeMenu}
                  className="rounded-lg bg-indigo-600 px-4 py-3 text-center font-semibold text-white hover:bg-indigo-700"
                >
                  Get started
                </Link>
              </div>
            )}
          </div>

          {logoutError && (
            <p role="alert" className="text-sm text-red-600 dark:text-red-400">
              {logoutError}
            </p>
          )}
        </div>
      )}

      {logoutError && !menuOpen && (
        <p role="alert" className="px-4 pb-3 text-center text-sm text-red-600 dark:text-red-400">
          {logoutError}
        </p>
      )}
    </header>
  );
}
