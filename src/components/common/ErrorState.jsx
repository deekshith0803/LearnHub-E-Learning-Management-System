import { AlertCircle } from "lucide-react";

const ErrorState = ({ message }) => (
  <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-red-100 dark:border-red-900/50 bg-red-50 dark:bg-red-950/30 p-8 text-center">
    <AlertCircle size={32} className="text-red-500 dark:text-red-400" />
    <h2 className="mt-3 font-semibold text-red-800 dark:text-red-300">Unable to load courses</h2>
    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
      {message || "Something went wrong. Please try again."}
    </p>
  </div>
);

export default ErrorState;
