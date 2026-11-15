import { useSelector } from "react-redux";
import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip, CartesianGrid } from "recharts";

function WeeklyActivity() {
  const activity = useSelector((state) => state.dashboard.data?.weeklyActivity || []);
  const data = activity.map((item) => ({ day: item.day, workouts: item.workouts || 0 }));

  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-slate-900">Weekly activity</h2>
      <p className="mb-4 mt-1 text-sm text-slate-500">Completed workouts this week</p>
      {data.length ? <div className="h-56 w-full min-w-0"><ResponsiveContainer width="100%" height="100%"><BarChart data={data}><CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey="day" /><Tooltip formatter={(value) => [`${value}`, "Workouts"]} /><Bar dataKey="workouts" name="Workouts" fill="#3B82F6" radius={[8, 8, 0, 0]} /></BarChart></ResponsiveContainer></div> : <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">Activity will appear after your first logged workout.</p>}
    </section>
  );
}

export default WeeklyActivity;
