import { useSelector } from "react-redux";
import { Trophy, Flame, Target } from "lucide-react";

function ProfileHero() {
  const { user } = useSelector((state) => state.auth);
  const { latestProgress } = useSelector((state) => state.progress);
  const fitnessProfile = user?.fitnessProfile || {};
  const name = user?.fullName || "Your profile";
  const initials = name.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase();
  const highlights = [
    { label: "Goal", value: fitnessProfile.goal || "Not set", icon: Flame, color: "text-orange-500" },
    { label: "Level", value: fitnessProfile.level || "Not set", icon: Trophy, color: "text-blue-500" },
    { label: "Height", value: fitnessProfile.height ? `${fitnessProfile.height} cm` : "Not set", icon: Target, color: "text-emerald-600" },
  ];

  return (
    <section className="relative overflow-hidden rounded-[32px] border border-slate-200 bg-gradient-to-r from-blue-50 via-white to-white p-6 shadow-sm">
      <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
        <div className="flex items-center gap-5">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-xl font-bold text-blue-700">{initials}</div>
          <div><h2 className="text-3xl font-bold tracking-tight text-slate-900">{name}</h2><p className="mt-1 text-sm text-slate-500">ForgeFit portfolio account</p></div>
        </div>
        <div className="flex flex-wrap gap-6">
          {highlights.map(({ label, value, icon: Icon, color }) => <div key={label} className="min-w-20 text-center"><Icon className={`mx-auto ${color}`} size={17} /><p className="mt-1 text-xs text-slate-500">{label}</p><p className="font-semibold text-slate-900">{value}</p></div>)}
        </div>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4"><p className="text-xs text-slate-500">Age</p><p className="mt-1 text-xl font-bold text-slate-900">{fitnessProfile.age || "Not set"}</p></div>
        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4"><p className="text-xs text-slate-500">Latest weight</p><p className="mt-1 text-xl font-bold text-slate-900">{latestProgress?.weight ? `${latestProgress.weight} kg` : "Not logged"}</p></div>
        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4"><p className="text-xs text-slate-500">Height</p><p className="mt-1 text-xl font-bold text-slate-900">{fitnessProfile.height ? `${fitnessProfile.height} cm` : "Not set"}</p></div>
        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4"><p className="text-xs text-slate-500">Fitness score</p><p className="mt-1 text-xl font-bold text-slate-900">{latestProgress?.fitnessScore ? `${latestProgress.fitnessScore}/100` : "Not logged"}</p></div>
      </div>
    </section>
  );
}

export default ProfileHero;
