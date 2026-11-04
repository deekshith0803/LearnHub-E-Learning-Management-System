import { useCallback, useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  GraduationCap,
  Mail,
  Pencil,
  Save,
  ShieldCheck,
  X,
  Clock,
  AlertCircle,
  Send,
  Sun,
  Moon,
} from "lucide-react";

import api from "../services/api";
import { setUser } from "../store/slices/authSlice";
import { useTheme } from "../context/ThemeContext";

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
  const { theme, setTheme } = useTheme();

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
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestReason, setRequestReason] = useState("");
  const [submittingRequest, setSubmittingRequest] = useState(false);

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

  // Submit request to become an instructor
  const handleSubmitInstructorRequest = async (e) => {
    e.preventDefault();
    if (!requestReason.trim()) {
      showMessage(
        "Please provide a brief statement or teaching experience.",
        "error",
      );
      return;
    }

    setSubmittingRequest(true);
    try {
      const response = await api.post("/auth/request-instructor", {
        reason: requestReason.trim(),
      });

      if (response.data?.success && response.data?.user) {
        dispatch(setUser(response.data.user));
        dispatch(fetchProfileSuccess(response.data.user));
        setShowRequestModal(false);
        setRequestReason("");
        showMessage(
          "Your instructor request has been submitted to the administrator for review.",
          "success",
        );
      }
    } catch (err) {
      showMessage(
        err.response?.data?.message ||
        "Failed to submit instructor request. Please try again.",
        "error",
      );
    } finally {
      setSubmittingRequest(false);
    }
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
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 px-4 py-8 text-slate-900 dark:text-slate-100 sm:px-6 lg:px-8 transition-colors">
      <div className="mx-auto max-w-5xl">
        {/* Navigation */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <Link
            to={
              role === "admin"
                ? "/admin"
                : role === "instructor" || activeDashboard === "instructor"
                  ? "/instructor"
                  : "/dashboard"
            }
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400 transition hover:text-indigo-600 dark:hover:text-indigo-400"
          >
            <ArrowLeft size={17} />
            Back to dashboard
          </Link>

          <Link
            to="/courses"
            className="inline-flex items-center gap-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            <BookOpen size={17} />
            Explore courses
          </Link>
        </div>

        {/* Page heading */}
        <header className="mb-7">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-indigo-600 dark:text-indigo-400">
            Account settings
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
            My Profile
          </h1>

          <p className="mt-2 text-slate-500 dark:text-slate-400">
            Manage your personal information and account details.
          </p>
        </header>

        {/* Profile summary */}
        <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-2xl font-bold text-indigo-700 dark:text-indigo-400 ring-4 ring-slate-50 dark:ring-slate-800">
              {getInitials(name || "Student")}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="break-words text-2xl font-bold text-slate-950 dark:text-white">
                  {name || "Your Name"}
                </h2>

                <span className="rounded-full bg-indigo-50 dark:bg-indigo-950/60 px-3 py-1 text-xs font-semibold capitalize text-indigo-700 dark:text-indigo-300">
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
            className={`mt-5 flex items-start gap-3 rounded-xl border p-4 text-sm ${messageType === "error"
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
          <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm sm:p-8">
            <div className="mb-7">
              <h2 className="text-xl font-bold text-slate-950 dark:text-white">
                Personal information
              </h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
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
                        className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300"
                      >
                        Full name
                      </label>

                      <Field
                        id="name"
                        name="name"
                        autoComplete="name"
                        placeholder="Enter your full name"
                        className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-sm text-slate-900 dark:text-white outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 dark:focus:ring-indigo-950"
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
                        className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300"
                      >
                        Email address
                      </label>

                      <Field
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        placeholder="you@example.com"
                        className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-sm text-slate-900 dark:text-white outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 dark:focus:ring-indigo-950"
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
                          className="text-sm font-semibold text-slate-700 dark:text-slate-300"
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
                        className="w-full resize-y rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-sm text-slate-900 dark:text-white outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 dark:focus:ring-indigo-950"
                      />

                      <ErrorMessage
                        name="bio"
                        component="p"
                        className="mt-2 text-sm text-red-600"
                      />
                    </div>

                    <div className="flex flex-wrap gap-3 border-t border-slate-100 dark:border-slate-800 pt-5">
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
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-5 py-3 text-sm font-semibold text-slate-600 dark:text-slate-300 transition hover:bg-slate-50 dark:hover:bg-slate-700"
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
                  <p className="break-words font-medium text-slate-800 dark:text-slate-200">
                    {name || "Not provided"}
                  </p>
                </div>

                <div className="border-t border-slate-100 dark:border-slate-800 pt-5">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Email address
                  </p>
                  <p className="break-all font-medium text-slate-800 dark:text-slate-200">
                    {email || "Not provided"}
                  </p>
                </div>

                <div className="border-t border-slate-100 dark:border-slate-800 pt-5">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    About me
                  </p>
                  <p className="whitespace-pre-wrap break-words text-sm leading-7 text-slate-600 dark:text-slate-300">
                    {bio || "You haven't added a bio yet."}
                  </p>
                </div>
              </div>
            )}
          </section>

          {/* Account sidebar */}
          <aside className="space-y-6">
            <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <ShieldCheck size={22} />
              </div>

              <h2 className="font-bold text-slate-950 dark:text-white">Account role</h2>

              <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                Your account role determines which LearnHub features you can
                access.
              </p>

              <div className="mt-5 flex items-center gap-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 p-4">
                <GraduationCap className="shrink-0 text-indigo-600 dark:text-indigo-400" size={22} />
                <div>
                  <p className="text-sm font-semibold capitalize text-slate-800 dark:text-slate-200">
                    {role}
                  </p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Current account role
                  </p>
                </div>
              </div>

              {role === "student" && (
                <>
                  {user?.instructorRequestStatus === "pending" ? (
                    <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-900">
                      <div className="flex items-center gap-1.5 font-bold text-amber-800">
                        <Clock size={15} /> Application Pending Review
                      </div>
                      <p className="mt-1.5 text-[11px] leading-relaxed text-amber-700">
                        Submitted on{" "}
                        {user.instructorRequestDate
                          ? new Date(user.instructorRequestDate).toLocaleDateString()
                          : "recently"}
                        . An administrator will review your application soon.
                      </p>
                      {user.instructorRequestReason && (
                        <p className="mt-2.5 rounded-lg border border-amber-200 bg-white/80 p-2 text-[11px] italic text-slate-700">
                          "{user.instructorRequestReason}"
                        </p>
                      )}
                    </div>
                  ) : user?.instructorRequestStatus === "rejected" ? (
                    <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-xs text-red-900">
                      <div className="flex items-center gap-1.5 font-bold text-red-800">
                        <AlertCircle size={15} /> Request Declined
                      </div>
                      <p className="mt-1 text-[11px] leading-relaxed text-red-700">
                        {user.instructorRequestFeedback ||
                          "Your request was declined after administrative review."}
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setRequestReason(user?.instructorRequestReason || "");
                          setShowRequestModal(true);
                        }}
                        className="mt-3 w-full rounded-lg bg-red-100 py-1.5 text-center text-xs font-semibold text-red-800 hover:bg-red-200 transition"
                      >
                        Re-apply for Instructor
                      </button>
                    </div>
                  ) : (
                    <div className="mt-4">
                      <p className="text-sm leading-6 text-slate-500 dark:text-slate-400">
                        Interested in teaching on LearnHub? Apply for instructor privileges to publish courses.
                      </p>
                      <button
                        type="button"
                        onClick={() => setShowRequestModal(true)}
                        className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 py-2.5 text-xs font-semibold text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition"
                      >
                        <GraduationCap size={15} />
                        Apply to Teach
                      </button>
                    </div>
                  )}
                </>
              )}

              {role === "instructor" && (
                <p className="mt-4 text-sm leading-6 text-slate-500 dark:text-slate-400">
                  Your instructor access is managed by your account permissions.
                </p>
              )}

              {role === "admin" && (
                <p className="mt-4 text-sm leading-6 text-slate-500 dark:text-slate-400">
                  Administrator privileges are managed by an authorized
                  administrator.
                </p>
              )}
            </section>

            {/* Interface Theme Section (Light / Dark Mode) */}
            <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                {theme === "dark" ? <Moon size={22} /> : <Sun size={22} />}
              </div>

              <h2 className="font-bold text-slate-950 dark:text-white">
                Appearance & Theme
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                Choose between clean light mode and eye-friendly dark mode for studying.
              </p>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setTheme("light")}
                  className={`flex flex-col items-center gap-2 rounded-xl border p-3.5 transition text-center ${theme === "light"
                    ? "border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-bold shadow-2xs"
                    : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                    }`}
                >
                  <Sun
                    size={20}
                    className={
                      theme === "light" ? "text-amber-500" : "text-slate-400"
                    }
                  />
                  <span className="text-xs font-semibold">Light Mode</span>
                </button>

                <button
                  type="button"
                  onClick={() => setTheme("dark")}
                  className={`flex flex-col items-center gap-2 rounded-xl border p-3.5 transition text-center ${theme === "dark"
                    ? "border-indigo-500 bg-indigo-950/50 text-indigo-300 font-bold shadow-2xs"
                    : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                    }`}
                >
                  <Moon
                    size={20}
                    className={
                      theme === "dark" ? "text-indigo-400" : "text-slate-400"
                    }
                  />
                  <span className="text-xs font-semibold">Dark Mode</span>
                </button>
              </div>
            </section>
          </aside>
        </div>
      </div>

      {/* Request Instructor Access Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between">
              <div>
                <div className="inline-flex items-center gap-1.5 rounded-full border border-indigo-100 dark:border-indigo-900/60 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-0.5 text-xs font-semibold text-indigo-700 dark:text-indigo-300">
                  <GraduationCap size={13} /> Instructor Application
                </div>
                <h3 className="mt-2 text-xl font-bold text-slate-950 dark:text-white">
                  Apply for Teaching Access
                </h3>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Submit your application to the platform administrator. Once approved, you will have access to create and manage courses.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowRequestModal(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmitInstructorRequest} className="mt-5 space-y-4">
              <div>
                <label htmlFor="reason" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Teaching Focus & Relevant Experience <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="reason"
                  rows={4}
                  maxLength={500}
                  value={requestReason}
                  onChange={(e) => setRequestReason(e.target.value)}
                  placeholder="Describe the topics you would like to teach (e.g. Full Stack Web Development, Python, UI/UX) and any background or expertise..."
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-3 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 outline-none transition focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-950"
                  required
                />
                <div className="mt-1 flex justify-between text-[11px] text-slate-400">
                  <span>Be specific about what courses you plan to create.</span>
                  <span>{requestReason.length}/500</span>
                </div>
              </div>

              <div className="rounded-xl border border-indigo-100 dark:border-indigo-900/60 bg-indigo-50/50 dark:bg-indigo-950/40 p-3 text-xs text-indigo-900 dark:text-indigo-200">
                <p className="font-semibold text-indigo-800 dark:text-indigo-300">What happens next?</p>
                <p className="mt-0.5 text-[11px] text-indigo-700 dark:text-indigo-300">
                  Your request will appear in the Admin Dashboard for review. Once approved, your role will be upgraded to Instructor and you can access the Instructor Studio.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowRequestModal(false)}
                  disabled={submittingRequest}
                  className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingRequest || !requestReason.trim()}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-indigo-700 disabled:opacity-50 transition"
                >
                  <Send size={13} />
                  <span>{submittingRequest ? "Submitting..." : "Submit Application"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
