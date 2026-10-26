import { useCallback, useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  BookOpen,
  Camera,
  CheckCircle2,
  GraduationCap,
  Mail,
  Pencil,
  Save,
  ShieldCheck,
  X,
  ArrowRightLeft,
} from "lucide-react";

import api from "../services/api";
import { setUser, switchDashboard } from "../store/slices/authSlice";

import {
  fetchProfileStart,
  fetchProfileSuccess,
  fetchProfileFailure,
  updateProfileStart,
  updateProfileSuccess,
  updateProfileFailure,
} from "../store/slices/profileSlice";

import LoadingState from "../components/common/LoadingState";
import ErrorState from "../components/common/ErrorState";
import EmptyState from "../components/common/EmptyState";

const getInitials = (name = "") =>
  name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

export default function StudentProfile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    user: authUser,
    isAuthenticated,
    isCheckingAuth,
    activeDashboard,
  } = useSelector((state) => state.auth);

  const {
    user: profile,
    loading,
    error,
    updating,
  } = useSelector((state) => state.profile);

  const user = profile || authUser;

  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");

  const showMessage = (text, type = "success") => {
    setMessage(text);
    setMessageType(type);
  };

  // Fetch the current user's profile.
  const loadProfile = useCallback(async () => {
    dispatch(fetchProfileStart());

    try {
      const response = await api.get("/auth/profile");
      const fetchedUser = response.data.user;

      if (!fetchedUser) {
        throw new Error("Profile information was not returned.");
      }

      dispatch(fetchProfileSuccess(fetchedUser));
      dispatch(setUser(fetchedUser));
    } catch (err) {
      dispatch(
        fetchProfileFailure(
          err.response?.data?.message ||
            err.message ||
            "Unable to load your profile.",
        ),
      );
    }
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      loadProfile();
    }
  }, [isAuthenticated, loadProfile]);

  // Save profile changes.
  const handleSave = async (values, { setSubmitting }) => {
    setMessage("");
    dispatch(updateProfileStart());

    try {
      const response = await api.put("/auth/profile", {
        name: values.name.trim(),
        email: values.email.trim(),
        bio: values.bio.trim(),
      });

      const updatedUser = response.data.user;

      if (!updatedUser) {
        throw new Error("The updated profile was not returned.");
      }

      dispatch(updateProfileSuccess(updatedUser));
      dispatch(setUser(updatedUser));

      setIsEditing(false);
      showMessage("Your profile has been updated successfully.");
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Unable to update your profile.";

      dispatch(updateProfileFailure(errorMessage));
      showMessage(errorMessage, "error");
    } finally {
      setSubmitting(false);
    }
  };

  // Determine which dashboards this account is authorized to use.
  const roles =
    Array.isArray(user?.roles) && user.roles.length
      ? user.roles
      : user?.role
        ? [user.role]
        : [];

  const canSwitchDashboard =
    roles.includes("student") && roles.includes("instructor");

  const canRequestInstructorAccess =
    user?.role === "student" && !roles.includes("instructor");

  // Switch dashboard using Redux.
  const handleDashboardSwitch = () => {
    const nextDashboard =
      activeDashboard === "student" ? "instructor" : "student";

    if (!roles.includes(nextDashboard)) {
      showMessage(
        `Your account does not have ${nextDashboard} access.`,
        "error",
      );
      return;
    }

    dispatch(switchDashboard(nextDashboard));

    navigate(
      nextDashboard === "instructor" ? "/instructor/dashboard" : "/dashboard",
    );
  };

  // Request access is a UI placeholder until a backend endpoint exists.
  const handleRequestInstructorAccess = () => {
    showMessage(
      "Instructor access requests are not connected yet. Please contact your administrator.",
      "error",
    );
  };

  if (isCheckingAuth || (isAuthenticated && loading && !user)) {
    return <LoadingState message="Loading your profile..." />;
  }

  if (!isAuthenticated) {
    return (
      <EmptyState
        title="Sign in to view your profile"
        description="Log in to manage your LearnHub account."
        actionLabel="Go to Login"
        actionLink="/login"
      />
    );
  }

  if (!user && error) {
    return (
      <ErrorState
        title="Unable to load your profile"
        message={error}
        onRetry={loadProfile}
      />
    );
  }

  if (!user) {
    return (
      <EmptyState
        title="No profile found"
        description="Your profile information is not available."
        actionLabel="Retry"
        onAction={loadProfile}
      />
    );
  }

  const name = user.name || "";
  const email = user.email || "";
  const bio = user.bio || "";
  const role = user.role || "student";

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Navigation */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <Link
            to={
              activeDashboard === "instructor"
                ? "/instructor/dashboard"
                : "/dashboard"
            }
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-indigo-600"
          >
            <ArrowLeft size={17} />
            Back to dashboard
          </Link>

          <Link
            to="/courses"
            className="inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-700"
          >
            <BookOpen size={17} />
            Explore courses
          </Link>
        </div>

        {/* Page heading */}
        <header className="mb-7">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-indigo-600">
            Account settings
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            My Profile
          </h1>

          <p className="mt-2 text-slate-500">
            Manage your personal information and account details.
          </p>
        </header>

        {/* Profile summary */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full bg-indigo-50 text-2xl font-bold text-indigo-700 ring-4 ring-slate-50">
              {getInitials(name || "Student")}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="break-words text-2xl font-bold text-slate-950">
                  {name || "Your Name"}
                </h2>

                <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold capitalize text-indigo-700">
                  {role}
                </span>
              </div>

              <p className="mt-2 flex items-center gap-2 break-all text-sm text-slate-500">
                <Mail size={16} className="shrink-0" />
                {email || "No email available"}
              </p>

              <p className="mt-2 text-sm text-slate-400">
                Member since{" "}
                {user.createdAt
                  ? new Date(user.createdAt).toLocaleDateString(undefined, {
                      month: "long",
                      year: "numeric",
                    })
                  : "Date unavailable"}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {canSwitchDashboard && (
                <button
                  type="button"
                  onClick={handleDashboardSwitch}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
                >
                  <ArrowRightLeft size={16} />
                  Switch to{" "}
                  {activeDashboard === "student"
                    ? "Instructor"
                    : "Student"}{" "}
                  Dashboard
                </button>
              )}

              {canRequestInstructorAccess && (
                <button
                  type="button"
                  onClick={handleRequestInstructorAccess}
                  className="rounded-xl border border-indigo-200 px-4 py-3 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-50"
                >
                  Request Instructor Access
                </button>
              )}

              {!isEditing && (
                <button
                  type="button"
                  onClick={() => {
                    setMessage("");
                    setIsEditing(true);
                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
                >
                  <Pencil size={16} />
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Success and error messages */}
        {message && (
          <div
            role="status"
            className={`mt-5 flex items-start gap-3 rounded-xl border p-4 text-sm ${
              messageType === "error"
                ? "border-red-200 bg-red-50 text-red-700"
                : "border-emerald-200 bg-emerald-50 text-emerald-700"
            }`}
          >
            {messageType === "error" ? (
              <X size={18} className="mt-0.5 shrink-0" />
            ) : (
              <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
            )}

            <p>{message}</p>
          </div>
        )}

        {/* Main content */}
        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_300px]">
          {/* Personal information */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-7">
              <h2 className="text-xl font-bold text-slate-950">
                Personal information
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Keep your account information up to date.
              </p>
            </div>

            {isEditing ? (
              <Formik
                enableReinitialize
                initialValues={{ name, email, bio }}
                validate={(values) => {
                  const errors = {};

                  if (!values.name.trim()) {
                    errors.name = "Name is required.";
                  } else if (values.name.trim().length < 2) {
                    errors.name = "Name must contain at least two letters.";
                  }

                  if (!values.email.trim()) {
                    errors.email = "Email is required.";
                  } else if (
                    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())
                  ) {
                    errors.email = "Enter a valid email address.";
                  }

                  if (values.bio.length > 300) {
                    errors.bio = "Bio cannot exceed 300 characters.";
                  }

                  return errors;
                }}
                onSubmit={handleSave}
              >
                {({ isSubmitting, values }) => (
                  <Form className="space-y-5">
                    <div>
                      <label
                        htmlFor="name"
                        className="mb-2 block text-sm font-semibold text-slate-700"
                      >
                        Full name
                      </label>

                      <Field
                        id="name"
                        name="name"
                        autoComplete="name"
                        placeholder="Enter your full name"
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
                      />

                      <ErrorMessage
                        name="name"
                        component="p"
                        className="mt-2 text-sm text-red-600"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="mb-2 block text-sm font-semibold text-slate-700"
                      >
                        Email address
                      </label>

                      <Field
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        placeholder="you@example.com"
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
                      />

                      <ErrorMessage
                        name="email"
                        component="p"
                        className="mt-2 text-sm text-red-600"
                      />
                    </div>

                    <div>
                      <div className="mb-2 flex items-center justify-between gap-3">
                        <label
                          htmlFor="bio"
                          className="text-sm font-semibold text-slate-700"
                        >
                          About me
                        </label>

                        <span className="text-xs text-slate-400">
                          {values.bio.length}/300
                        </span>
                      </div>

                      <Field
                        as="textarea"
                        id="bio"
                        name="bio"
                        rows={4}
                        maxLength={300}
                        placeholder="Write a short introduction..."
                        className="w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
                      />

                      <ErrorMessage
                        name="bio"
                        component="p"
                        className="mt-2 text-sm text-red-600"
                      />
                    </div>

                    <div className="flex flex-wrap gap-3 border-t border-slate-100 pt-5">
                      <button
                        type="submit"
                        disabled={isSubmitting || updating}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <Save size={16} />
                        {isSubmitting || updating
                          ? "Saving changes..."
                          : "Save changes"}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setIsEditing(false);
                          setMessage("");
                        }}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                      >
                        <X size={16} />
                        Cancel
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            ) : (
              <div className="space-y-6">
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Full name
                  </p>
                  <p className="break-words font-medium text-slate-800">
                    {name || "Not provided"}
                  </p>
                </div>

                <div className="border-t border-slate-100 pt-5">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Email address
                  </p>
                  <p className="break-all font-medium text-slate-800">
                    {email || "Not provided"}
                  </p>
                </div>

                <div className="border-t border-slate-100 pt-5">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    About me
                  </p>
                  <p className="whitespace-pre-wrap break-words text-sm leading-7 text-slate-600">
                    {bio || "You haven't added a bio yet."}
                  </p>
                </div>
              </div>
            )}
          </section>

          {/* Account sidebar */}
          <aside className="space-y-6">
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <ShieldCheck size={22} />
              </div>

              <h2 className="font-bold text-slate-950">Account role</h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Your account role determines which LearnHub features you can
                access.
              </p>

              <div className="mt-5 flex items-center gap-3 rounded-xl bg-slate-50 p-4">
                <GraduationCap className="shrink-0 text-indigo-600" size={22} />
                <div>
                  <p className="text-sm font-semibold capitalize text-slate-800">
                    {role}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Current account role
                  </p>
                </div>
              </div>

              {role === "student" && (
                <p className="mt-4 text-sm leading-6 text-slate-500">
                  Interested in teaching? Request instructor access or contact
                  your administrator.
                </p>
              )}

              {role === "instructor" && (
                <p className="mt-4 text-sm leading-6 text-slate-500">
                  Your instructor access is managed by your account permissions.
                </p>
              )}

              {role === "admin" && (
                <p className="mt-4 text-sm leading-6 text-slate-500">
                  Administrator privileges are managed by an authorized
                  administrator.
                </p>
              )}
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}
