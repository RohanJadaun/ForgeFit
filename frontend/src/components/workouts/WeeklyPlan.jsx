import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";

function WeeklyPlan() {
  const workouts = useSelector((state) => state.workout.workouts);
  const today = new Date();
  const monday = new Date(today);
  monday.setHours(0, 0, 0, 0);
  monday.setDate(monday.getDate() + (monday.getDay() === 0 ? -6 : 1 - monday.getDay()));
  const days = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + index);
    const dayWorkouts = workouts.filter((workout) => new Date(workout.createdAt).toDateString() === date.toDateString());
    return { date, workouts: dayWorkouts };
  });

  return (
    <motion.section initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-start justify-between gap-3"><div><h2 className="text-xl font-semibold text-slate-900">This week</h2><p className="mt-1 text-sm text-slate-500">Sessions logged Monday through Sunday</p></div><Link to="/workouts" className="shrink-0 text-sm font-semibold text-blue-700 hover:underline">Add workout</Link></div>
      <div className="space-y-2">
        {days.map(({ date, workouts: dayWorkouts }) => {
          const isToday = date.toDateString() === today.toDateString();
          return <div key={date.toISOString()} className="flex items-center justify-between gap-3 rounded-2xl bg-slate-50 p-3"><div><p className="text-sm font-medium text-slate-900">{date.toLocaleDateString(undefined, { weekday: "long" })}{isToday ? " · Today" : ""}</p><p className="mt-0.5 text-xs text-slate-500">{dayWorkouts.length ? dayWorkouts.map((item) => item.title).join(", ") : "No workout logged"}</p></div><span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${dayWorkouts.some((item) => item.completed) ? "bg-emerald-100 text-emerald-700" : "bg-white text-slate-500"}`}>{dayWorkouts.some((item) => item.completed) ? "Completed" : dayWorkouts.length ? "Logged" : "—"}</span></div>;
        })}
      </div>
    </motion.section>
  );
}

export default WeeklyPlan;
