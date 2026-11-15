import { useEffect, useMemo, useState } from "react";
import { Bell, CalendarDays, ChevronDown, Moon, Sun } from "lucide-react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

function Navbar() {
  const [date, setDate] = useState(() => new Date());
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [showActivity, setShowActivity] = useState(() => window.localStorage.getItem("forgefit_show_activity") !== "false");
  const [darkMode, setDarkMode] = useState(() => window.localStorage.getItem("forgefit_theme") === "dark");
  const user = useSelector((state) => state.auth.user);
  const workouts = useSelector((state) => state.workout.workouts);
  const dashboardWorkouts = useSelector((state) => state.dashboard.data?.recentWorkouts || []);

  useEffect(() => {
    const timer = window.setInterval(() => setDate(new Date()), 60_000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = darkMode ? "dark" : "light";
    window.localStorage.setItem("forgefit_theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  useEffect(() => {
    const syncPreference = () => setShowActivity(window.localStorage.getItem("forgefit_show_activity") !== "false");
    window.addEventListener("forgefit:preferences", syncPreference);
    window.addEventListener("storage", syncPreference);
    return () => {
      window.removeEventListener("forgefit:preferences", syncPreference);
      window.removeEventListener("storage", syncPreference);
    };
  }, []);

  const recentWorkout = useMemo(() => workouts[0] || dashboardWorkouts[0] || null, [workouts, dashboardWorkouts]);
  const dateLabel = new Intl.DateTimeFormat(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);

  return (
    <header className="mb-8 flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-medium text-slate-500">
          Welcome back, {user?.fullName?.split(" ")[0] || "there"}
        </p>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        <button type="button" onClick={() => setDarkMode((current) => !current)} aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"} aria-pressed={darkMode} className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500">
          {darkMode ? <Sun size={19} className="text-amber-500" /> : <Moon size={19} className="text-slate-600" />}
        </button>
        <div className="flex h-11 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 shadow-sm sm:px-4" aria-label={`Today is ${dateLabel}`}>
          <CalendarDays size={18} className="shrink-0 text-slate-500" />
          <time className="whitespace-nowrap text-xs text-slate-600 sm:text-sm" dateTime={date.toISOString()}>{dateLabel}</time>
        </div>

        {showActivity && <div className="relative">
          <button
            type="button"
            onClick={() => setNotificationsOpen((open) => !open)}
            aria-label="Toggle recent activity"
            aria-expanded={notificationsOpen}
            aria-controls="recent-activity-panel"
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <Bell size={20} className="text-slate-600" />
          </button>
          {notificationsOpen && (
            <div id="recent-activity-panel" className="absolute right-0 top-14 z-50 w-72 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl" role="status">
              <h2 className="font-semibold text-slate-900">Recent activity</h2>
              {recentWorkout ? (
                <div className="mt-3 rounded-xl bg-slate-50 p-3">
                  <p className="text-sm font-medium text-slate-800">{recentWorkout.title}</p>
                  <p className="mt-1 text-xs text-slate-500">Latest workout logged</p>
                </div>
              ) : (
                <p className="mt-2 text-sm text-slate-500">No workouts logged yet. Your activity will appear here.</p>
              )}
            </div>
          )}
        </div>}

        <Link to="/profile" className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-2 py-2 shadow-sm transition hover:shadow-md sm:gap-3 sm:px-3" aria-label="Open profile">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 font-semibold text-blue-700" aria-hidden="true">
            {(user?.fullName || "U").split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase()}
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-semibold text-slate-900">{user?.fullName || "Your profile"}</p>
            <p className="text-xs text-slate-500">View profile</p>
          </div>
          <ChevronDown size={16} className="hidden text-slate-500 sm:block" />
        </Link>
      </div>
    </header>
  );
}

export default Navbar;
