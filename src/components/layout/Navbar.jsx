import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { BookOpen, Menu, X, UserRound, LogOut } from "lucide-react";

import api from "../../services/api";
import { logout } from "../../store/slices/authSlice";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [logoutError, setLogoutError] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const navLinkClass = ({ isActive }) =>
    `transition-colors ${
      isActive
        ? "font-semibold text-indigo-600"
        : "text-gray-600 hover:text-indigo-600"
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

      {isAuthenticated && (
        <NavLink to="/dashboard" className={navLinkClass} onClick={closeMenu}>
          My Learning
        </NavLink>
      )}
    </>
  );

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link to="/" onClick={closeMenu} className="flex items-center gap-2">
          <span className="rounded-xl bg-indigo-600 p-2 text-white">
            <BookOpen size={22} />
          </span>

          <span className="text-xl font-bold tracking-tight text-gray-900">
            Learn<span className="text-indigo-600">Hub</span>
          </span>
        </Link>

        {/* Desktop navigation */}
        <div className="hidden items-center gap-8 md:flex">{navLinks}</div>

        {/* Desktop authentication */}
        <div className="hidden items-center gap-3 md:flex">
          {isAuthenticated ? (
            <>
              <span className="flex items-center gap-2 text-sm text-gray-600">
                <UserRound size={18} />
                {user?.name || user?.name || "Student"}
              </span>

              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 font-medium text-gray-700 transition hover:bg-gray-50"
              >
                <LogOut size={17} />
                Log out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-lg px-4 py-2 font-medium text-gray-700 transition hover:bg-gray-100"
              >
                Log in
              </Link>

              <Link
                to="/register"
                className="rounded-lg bg-indigo-600 px-5 py-2.5 font-semibold text-white transition hover:bg-indigo-700"
              >
                Get started
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          className="rounded-lg p-2 text-gray-700 hover:bg-gray-100 md:hidden"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile navigation */}
      {menuOpen && (
        <div className="space-y-4 border-t border-gray-200 bg-white px-4 py-5 md:hidden">
          <div className="flex flex-col gap-4">{navLinks}</div>

          <div className="border-t border-gray-100 pt-4">
            {isAuthenticated ? (
              <div className="space-y-3">
                <p className="text-sm text-gray-600">
                  Signed in as{" "}
                  <span className="font-semibold text-gray-900">
                    {user?.name || user?.name || "Student"}
                  </span>
                </p>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 px-4 py-3 font-medium text-gray-700 hover:bg-gray-50"
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
                  className="rounded-lg border border-gray-200 px-4 py-3 text-center font-medium text-gray-700"
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
            <p role="alert" className="text-sm text-red-600">
              {logoutError}
            </p>
          )}
        </div>
      )}

      {logoutError && !menuOpen && (
        <p role="alert" className="px-4 pb-3 text-center text-sm text-red-600">
          {logoutError}
        </p>
      )}
    </header>
  );
}
