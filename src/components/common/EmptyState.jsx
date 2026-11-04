import { BookOpen } from "lucide-react";

const EmptyState = () => (
  <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-8 text-center">
    <div className="rounded-full bg-indigo-50 dark:bg-indigo-950/60 p-4">
      <BookOpen size={30} className="text-indigo-600 dark:text-indigo-400" />
    </div>
    <h2 className="mt-4 text-lg font-semibold text-slate-800 dark:text-white">
      No courses available
    </h2>
    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
      Courses will appear here when they become available.
    </p>
  </div>
);

export default EmptyState;
