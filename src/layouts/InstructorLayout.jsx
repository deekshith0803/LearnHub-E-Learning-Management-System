import { useState } from "react";
import { Outlet, Link } from "react-router-dom";
import { Menu, GraduationCap } from "lucide-react";
import InstructorSidebar from "../components/layout/InstructorSidebar";

export default function InstructorLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Desktop Fixed Sidebar */}
      <div className="hidden md:fixed md:inset-y-0 md:z-40 md:flex md:w-64 md:flex-col">
        <InstructorSidebar />
      </div>

      {/* Mobile Top Header */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3 md:hidden">
        <Link to="/instructor" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm shadow-indigo-200 dark:shadow-none">
            <GraduationCap size={18} />
          </span>
          <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
            Learn<span className="text-indigo-600 dark:text-indigo-400">Hub</span>
          </span>
          <span className="rounded bg-indigo-50 dark:bg-indigo-950/60 px-1.5 py-0.5 text-[9px] font-bold uppercase text-indigo-700 dark:text-indigo-300">
            Studio
          </span>
        </Link>

        <button
          type="button"
          onClick={() => setMobileMenuOpen(true)}
          className="rounded-lg p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
          aria-label="Open sidebar menu"
        >
          <Menu size={22} />
        </button>
      </header>

      {/* Mobile Slide-Over Drawer & Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer container */}
          <div className="fixed inset-y-0 left-0 z-50 w-64 shadow-2xl">
            <InstructorSidebar onClose={() => setMobileMenuOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="min-h-screen md:pl-64">
        <Outlet />
      </main>
    </div>
  );
}
