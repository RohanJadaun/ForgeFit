import { useSelector } from "react-redux";

function WorkoutStats() {
  const workouts = useSelector((state) => state.workout.workouts);
  const completed = workouts.filter((item) => item.completed).length;
  const duration = workouts.reduce((total, item) => total + (Number(item.duration) || 0), 0);
  const stats = [["Sessions logged", workouts.length], ["Completed", completed], ["Minutes trained", duration.toLocaleString()]];

  return <section className="grid grid-cols-3 gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">{stats.map(([label, value]) => <div key={label}><p className="text-xs text-slate-500">{label}</p><p className="mt-1 text-xl font-bold text-slate-900">{value}</p></div>)}</section>;
}

export default WorkoutStats;
