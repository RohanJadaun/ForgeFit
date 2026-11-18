import { Link, NavLink } from "react-router-dom";
import {
  Home,
  Dumbbell,
  Apple,
  BarChart3,
  Bot,
  User,
  Activity,
} from "lucide-react";

function Sidebar() {
  const links = [
    { name: "Dashboard", path: "/dashboard", icon: Home },
    { name: "Workouts", path: "/workouts", icon: Dumbbell },
    { name: "Nutrition", path: "/nutrition", icon: Apple },
    { name: "Progress", path: "/progress", icon: BarChart3 },
    { name: "AI Coach", path: "/ai-coach", icon: Bot },
    { name: "Profile", path: "/profile", icon: User },
  ];

  return (
    <>
    <aside className="sticky top-6 hidden w-64 shrink-0 self-start p-4 md:block">
      <div
        className="
        bg-white
        rounded-[28px]
        border
        border-slate-200
        shadow-lg
        hover:shadow-xl
        transition-all
        duration-300
        p-6
        "
      >
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
            <Activity
              size={20}
              className="text-white"
            />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              ForgeFit
            </h1>

            <p className="text-sm text-slate-600">
              Train smarter.
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-8 space-y-2">
          {links.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 h-12 rounded-xl transition-all duration-300 font-medium ${
                    isActive
                      ? "bg-blue-500 text-white shadow-md"
                      : "text-slate-800 hover:bg-slate-100"
                  }`
                }
              >
                <Icon size={18} />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Daily Goal */}
        <div className="mt-8">
          <div className="bg-slate-50 border border-slate-200 rounded-3xl p-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-slate-900">
                Daily Goal
              </h3>

              <span className="text-blue-600 font-bold">
                80%
              </span>
            </div>

            <div className="h-2 bg-slate-200 rounded-full mt-4 overflow-hidden">
              <div className="h-full w-4/5 bg-blue-600 rounded-full"></div>
            </div>

            <div className="mt-5 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">
                  Calories
                </span>

                <span className="font-medium text-slate-900">
                  2150
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">
                  Workout
                </span>

                <span className="font-medium text-slate-900">
                  45 min
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">
                  Water
                </span>

                <span className="font-medium text-slate-900">
                  6 / 8
                </span>
              </div>
            </div>

            <Link
              to="/progress"
              className="
              mt-4
              flex
              h-11
              w-full
              items-center
              justify-center
              rounded-xl
              bg-blue-500
              text-white
              font-medium
              hover:bg-blue-700
              transition
              "
            >
              View Details
            </Link>
          </div>
        </div>
      </div>
    </aside>
    <nav aria-label="Main navigation" className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-6 border-t border-slate-200 bg-white/95 px-1 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow-[0_-8px_24px_rgba(15,23,42,0.08)] backdrop-blur md:hidden">
      {links.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.path}
            to={item.path}
            aria-label={item.name}
            className={({ isActive }) => `flex min-w-0 flex-col items-center justify-center gap-1 rounded-lg py-1 text-[10px] font-medium leading-tight transition ${isActive ? "text-blue-600" : "text-slate-500"}`}
          >
            <Icon size={19} aria-hidden="true" />
            <span className="truncate">{item.name}</span>
          </NavLink>
        );
      })}
    </nav>
    </>
  );
}

export default Sidebar;
