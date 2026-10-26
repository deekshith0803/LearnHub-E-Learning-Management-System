import { BookOpen } from "lucide-react";

const EmptyState = () => (
  <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
    <div className="rounded-full bg-indigo-50 p-4">
      <BookOpen size={30} className="text-indigo-600" />
    </div>
    <h2 className="mt-4 text-lg font-semibold text-slate-800">
      No courses available
    </h2>
    <p className="mt-1 text-sm text-slate-500">
      Courses will appear here when they become available.
    </p>
  </div>
);

export default EmptyState;
