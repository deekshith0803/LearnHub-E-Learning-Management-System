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
      email: "",
      password: "",
      confirmPassword: "",
    },

    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),

      password: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .required("Password is required"),

      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password")], "Passwords must match")
        .required("Please confirm your password"),
    }),
    onSubmit: async (values) => {
      try {
        const { confirmPassword, terms, ...registerData } = values;

        const response = await api.post("/auth/register", registerData);

        console.log(response.data);

        dispatch(register(response.data.user));

        // Navigate to login after successful registration
        navigate("/login", {
          state: { message: "Registration successful! Please log in." },
        });
      } catch (error) {
        const message = error.response?.data?.message || "";

        if (
          message.includes("E11000") ||
          message.toLowerCase().includes("duplicate key")
        ) {
          formik.setFieldError("email", "This email is already registered.");
        } else {
          formik.setStatus(message || "Registration failed. Please try again.");
        }
      }
    },
  });

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-8 flex items-center justify-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white">
            <BookOpen size={22} />
          </div>
          <span className="text-2xl font-bold tracking-tight text-slate-900">
            Learn<span className="text-indigo-600">Hub</span>
          </span>
        </Link>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-7">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Create your account
            </h1>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Sign up to explore courses and start learning.
            </p>
          </div>

          <form onSubmit={formik.handleSubmit} className="space-y-5">
            {/* Full name */}
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium text-slate-700"
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
                  className="w-full rounded-lg border border-slate-300 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10"
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
                className="mb-2 block text-sm font-medium text-slate-700"
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
                  className="w-full rounded-lg border border-slate-300 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10"
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
                className="mb-2 block text-sm font-medium text-slate-700"
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
                  placeholder="Create a password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full rounded-lg border border-slate-300 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10"
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
                className="mb-2 block text-sm font-medium text-slate-700"
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
                  className="w-full rounded-lg border border-slate-300 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10"
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
            <label className="flex items-start gap-2.5 text-sm leading-5 text-slate-600">
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
                <span className="font-medium text-indigo-600">
                  Terms of Service
                </span>{" "}
                and{" "}
                <span className="font-medium text-indigo-600">
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
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/20"
            >
              Create account
              <ArrowRight size={17} />
            </button>
            {formik.status && (
              <p className="mb-3 text-sm text-red-500">{formik.status}</p>
            )}
          </form>

          <p className="mt-6 text-center text-sm text-slate-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-indigo-600 hover:text-indigo-700"
            >
              Sign in
            </Link>
          </p>
        </div>

        <p className="mt-6 text-center text-xs text-slate-400">
          © {new Date().getFullYear()} LearnHub. All rights reserved.
        </p>
      </div>
    </main>
  );
};

export default Register;
