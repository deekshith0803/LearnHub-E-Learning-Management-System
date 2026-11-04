import {
  ArrowRight,
  BookOpen,
  LockKeyhole,
  Mail,
  UserRound,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import api from "../services/api";
import { useDispatch } from "react-redux";
import { register } from "../store/slices/authSlice";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      terms: true,
    },

    validationSchema: Yup.object({
      name: Yup.string()
        .trim()
        .min(2, "Name must be at least 2 characters")
        .required("Full name is required"),

      email: Yup.string()
        .trim()
        .email("Invalid email address")
        .required("Email is required"),

      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),

      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password")], "Passwords must match")
        .required("Please confirm your password"),

      terms: Yup.boolean().oneOf(
        [true],
        "You must agree to the Terms and Privacy Policy",
      ),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const { name, email, password } = values;
        const registerData = {
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password,
        };

        const response = await api.post("/auth/register", registerData);

        // Reset auth state to ensure no partial unauthenticated session
        dispatch(register());

        // Explicitly navigate to login page after successful registration with a success banner
        navigate("/login", {
          replace: true,
          state: {
            registered: true,
            email: registerData.email,
            message:
              response.data?.message ||
              "Account registered successfully! Please sign in with your email and password.",
          },
        });
      } catch (error) {
        const message =
          error.response?.data?.message ||
          error.response?.data?.error ||
          error.message ||
          "";

        if (
          message.includes("E11000") ||
          message.toLowerCase().includes("duplicate") ||
          message.toLowerCase().includes("already registered")
        ) {
          formik.setFieldError("email", "This email is already registered.");
        } else {
          formik.setStatus(message || "Registration failed. Please try again.");
        }
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 py-12 text-slate-900 dark:text-slate-100 transition-colors">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-8 flex items-center justify-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white">
            <BookOpen size={22} />
          </div>
          <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Learn<span className="text-indigo-600 dark:text-indigo-400">Hub</span>
          </span>
        </Link>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm sm:p-8">
          <div className="mb-7">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Create your account
            </h1>
            <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
              Sign up to explore courses and start learning.
            </p>
          </div>

          <form onSubmit={formik.handleSubmit} className="space-y-5">
            {/* Full name */}
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Full name
              </label>
              <div className="relative">
                <UserRound
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 py-3 pl-10 pr-4 text-sm text-slate-900 dark:text-slate-100 outline-none transition placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
              {formik.touched.name && formik.errors.name && (
                <p className="mt-1.5 text-xs text-red-500">
                  {formik.errors.name}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Email address
              </label>
              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 py-3 pl-10 pr-4 text-sm text-slate-900 dark:text-slate-100 outline-none transition placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
              {formik.touched.email && formik.errors.email && (
                <p className="mt-1.5 text-xs text-red-500">
                  {formik.errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Password
              </label>
              <div className="relative">
                <LockKeyhole
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Create a password (min. 8 characters)"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 py-3 pl-10 pr-4 text-sm text-slate-900 dark:text-slate-100 outline-none transition placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
              {formik.touched.password && formik.errors.password && (
                <p className="mt-1.5 text-xs text-red-500">
                  {formik.errors.password}
                </p>
              )}
            </div>

            {/* Confirm password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Confirm password
              </label>
              <div className="relative">
                <LockKeyhole
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Re-enter your password"
                  value={formik.values.confirmPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 py-3 pl-10 pr-4 text-sm text-slate-900 dark:text-slate-100 outline-none transition placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
              {formik.touched.confirmPassword &&
                formik.errors.confirmPassword && (
                  <p className="mt-1.5 text-xs text-red-500">
                    {formik.errors.confirmPassword}
                  </p>
                )}
            </div>

            {/* Terms */}
            <label className="flex items-start gap-2.5 text-sm leading-5 text-slate-600 dark:text-slate-400 cursor-pointer">
              <input
                type="checkbox"
                name="terms"
                checked={formik.values.terms}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="mt-0.5 h-4 w-4 rounded border-slate-300 accent-indigo-600"
              />
              <span>
                I agree to the{" "}
                <span className="font-medium text-indigo-600 dark:text-indigo-400">
                  Terms of Service
                </span>{" "}
                and{" "}
                <span className="font-medium text-indigo-600 dark:text-indigo-400">
                  Privacy Policy
                </span>
                .
              </span>
            </label>
            {formik.touched.terms && formik.errors.terms && (
              <p className="-mt-3 text-xs text-red-500">
                {formik.errors.terms}
              </p>
            )}

            <button
              type="submit"
              disabled={formik.isSubmitting}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {formik.isSubmitting ? "Creating account..." : "Create account"}
              {!formik.isSubmitting && <ArrowRight size={17} />}
            </button>
            {formik.status && (
              <p className="mb-3 text-sm text-red-500">{formik.status}</p>
            )}
          </form>

          <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
            >
              Sign in
            </Link>
          </p>
        </div>

        <p className="mt-6 text-center text-xs text-slate-400">
          LearnHub. All rights reserved.
        </p>
      </div>
    </main>
  );
};

export default Register;
