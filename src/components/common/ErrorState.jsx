import { AlertCircle } from "lucide-react";

export const ErrorState = ({ message }) => (
  <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-red-100 bg-red-50 p-8 text-center">
    <AlertCircle size={32} className="text-red-500" />
    <h2 className="mt-3 font-semibold text-red-800">Unable to load courses</h2>
    <p className="mt-1 text-sm text-red-600">
      {message || "Something went wrong. Please try again."}
    </p>
  </div>
);
