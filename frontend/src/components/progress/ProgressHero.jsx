import { Scale, Dumbbell, Trophy, ClipboardList } from "lucide-react";

function ProgressHero({ latestProgress, progress = [] }) {
  const oldest = progress.at(-1);
  const weightChange = latestProgress?.weight && oldest?.weight
    ? Number((latestProgress.weight - oldest.weight).toFixed(1))
    : null;
  const stats = [
    { label: "Latest weight", value: latestProgress?.weight ? `${latestProgress.weight} kg` : "Not logged", icon: Scale, color: "text-blue-600", bg: "bg-blue-100" },
    { label: "Measurements", value: String(progress.length), icon: ClipboardList, color: "text-emerald-600", bg: "bg-emerald-100" },
    { label: "Fitness score", value: latestProgress?.fitnessScore ? `${latestProgress.fitnessScore}/100` : "Not scored", icon: Trophy, color: "text-violet-600", bg: "bg-violet-100" },
    { label: "Change since first log", value: weightChange === null ? "—" : `${weightChange > 0 ? "+" : ""}${weightChange} kg`, icon: Dumbbell, color: "text-orange-600", bg: "bg-orange-100" },
  ];

  return (
    <section className="relative overflow-hidden rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-sm font-medium text-blue-600">Your progress</p>
      <h2 className="mt-1 text-2xl font-bold text-slate-900">A clear view of your logged measurements</h2>
      <p className="mt-2 text-sm text-slate-500">These summaries use the records you add. ForgeFit does not invent progress values.</p>
      <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
            <span className={`mb-3 flex h-9 w-9 items-center justify-center rounded-xl ${bg}`}><Icon size={17} className={color} /></span>
            <p className="text-xs text-slate-500">{label}</p>
            <p className="mt-1 text-lg font-bold text-slate-900">{value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default ProgressHero;
