import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ children, role }) => {
  const { user, isCheckingAuth } = useSelector((state) => state.auth);

  // While backend is checking the HTTP-only cookie, show a loading indicator
  // This prevents premature logout / redirection on page reload
  if (isCheckingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-9 w-9 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
          <p className="text-sm font-medium text-slate-500">Checking session...</p>
        </div>
      </div>
    );
  }

  // If session check finished and no user is authenticated via cookie
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const userRole = user.role || "student";
  const hasRole =
    userRole === role ||
    (Array.isArray(user.roles) && user.roles.includes(role));

  // If user doesn't have the required role, redirect to their own dashboard
  if (role && !hasRole) {
    if (userRole === "instructor") {
      return <Navigate to="/instructor" replace />;
    }
    if (userRole === "admin") {
      return <Navigate to="/admin" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;
