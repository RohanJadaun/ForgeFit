import { useMemo } from "react";
import { useSelector } from "react-redux";

function RecentActivity() {
  const workouts = useSelector((state) => state.workout.workouts);
  const progress = useSelector((state) => state.progress.progress);
  const activities = useMemo(() => [
    ...workouts.map((item) => ({ id: `workout-${item._id}`, title: item.title, detail: `${item.category || "Workout"} · ${item.duration || 0} min`, date: item.createdAt })),
    ...progress.map((item) => ({ id: `progress-${item._id}`, title: "Progress measurement logged", detail: item.weight ? `${item.weight} kg` : "Measurement entry", date: item.date })),
  ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5), [workouts, progress]);

  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-slate-900">Recent activity</h2>
      <p className="mb-4 mt-1 text-sm text-slate-500">Your latest logged workouts and measurements.</p>
      {activities.length ? <div className="space-y-4">{activities.map((item) => <div key={item.id} className="flex gap-3"><span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-blue-500" /><div className="min-w-0 flex-1"><div className="flex flex-wrap justify-between gap-x-4"><p className="font-semibold text-slate-900">{item.title}</p><time className="text-xs text-slate-500">{new Date(item.date).toLocaleDateString()}</time></div><p className="text-xs text-slate-500">{item.detail}</p></div></div>)}</div> : <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">No activity yet. Log a workout or progress measurement to see it here.</p>}
    </section>
  );
}

export default RecentActivity;
