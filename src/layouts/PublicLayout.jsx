import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

export default function PublicLayout() {
  const { user, isCheckingAuth } = useSelector((state) => state.auth);

  // If authenticated as instructor or admin, isolate them from public student pages
  if (!isCheckingAuth && user) {
    if (user.role === "instructor") {
      return <Navigate to="/instructor" replace />;
    }
    if (user.role === "admin") {
      return <Navigate to="/admin" replace />;
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <Navbar />

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
