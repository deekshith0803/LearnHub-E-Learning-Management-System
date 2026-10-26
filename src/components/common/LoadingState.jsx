import { LoaderCircle } from "lucide-react";

const LoadingState = () => (
  <div className="flex min-h-64 flex-col items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white p-8">
    <LoaderCircle size={32} className="animate-spin text-indigo-600" />
    <p className="font-medium text-slate-600">Loading courses...</p>
    <p className="text-sm text-slate-400">Please wait a moment.</p>
  </div>
);

export default LoadingState;
