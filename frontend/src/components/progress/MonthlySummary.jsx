import { Dumbbell, Flame, Scale, ClipboardList } from "lucide-react";

function MonthlySummary({ progress = [], workouts = [] }) {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthWorkouts = workouts.filter((item) => new Date(item.createdAt) >= monthStart);
  const monthProgress = progress.filter((item) => new Date(item.date) >= monthStart);
  const weights = monthProgress.filter((item) => Number(item.weight) > 0).slice().sort((a, b) => new Date(a.date) - new Date(b.date));
  const change = weights.length > 1 ? Number((weights.at(-1).weight - weights[0].weight).toFixed(1)) : null;
  const stats = [
    { label: "Workouts logged", value: String(monthWorkouts.length), icon: Dumbbell, tint: "bg-emerald-100 text-emerald-600" },
    { label: "Calories logged", value: monthWorkouts.reduce((total, item) => total + (Number(item.caloriesBurned) || 0), 0).toLocaleString(), icon: Flame, tint: "bg-orange-100 text-orange-600" },
    { label: "Weight change", value: change === null ? "Need 2 logs" : `${change > 0 ? "+" : ""}${change} kg`, icon: Scale, tint: "bg-blue-100 text-blue-600" },
    { label: "Measurements", value: String(monthProgress.length), icon: ClipboardList, tint: "bg-violet-100 text-violet-600" },
  ];

  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold text-slate-900">This month</h3>
      <div className="grid grid-cols-2 gap-3">
        {stats.map(({ label, value, icon: Icon, tint }) => <div key={label} className="rounded-2xl border border-slate-100 bg-slate-50 p-3"><span className={`mb-2 flex h-8 w-8 items-center justify-center rounded-xl ${tint}`}><Icon size={15} /></span><p className="text-xs text-slate-500">{label}</p><p className="mt-1 text-lg font-bold text-slate-900">{value}</p></div>)}
      </div>
    </section>
  );
}

export default MonthlySummary;
