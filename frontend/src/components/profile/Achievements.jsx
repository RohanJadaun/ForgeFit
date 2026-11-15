import { useSelector } from "react-redux";
import { Award, Flame, Zap } from "lucide-react";

function Achievements() {
  const workouts = useSelector((state) => state.workout.workouts);
  const calories = workouts.reduce((total, item) => total + (Number(item.caloriesBurned) || 0), 0);
  const achievements = [
    { title: "First workout", unlocked: workouts.length >= 1, icon: Award, color: "text-blue-500" },
    { title: "10 completed workouts", unlocked: workouts.filter((item) => item.completed).length >= 10, icon: Flame, color: "text-orange-500" },
    { title: "10,000 logged calories", unlocked: calories >= 10000, icon: Zap, color: "text-violet-500" },
  ];

  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-slate-900">Achievements</h2>
      <p className="mb-4 mt-1 text-sm text-slate-500">Milestones unlock from your logged activity.</p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {achievements.map(({ title, unlocked, icon: Icon, color }) => <div key={title} className={`rounded-2xl border p-4 text-center ${unlocked ? "border-emerald-200 bg-emerald-50" : "border-slate-100 bg-slate-50 opacity-70"}`}><Icon className={`mx-auto mb-2 ${color}`} size={22} /><p className="text-sm font-semibold text-slate-900">{title}</p><p className="mt-1 text-xs text-slate-500">{unlocked ? "Unlocked" : "Keep going"}</p></div>)}
      </div>
    </section>
  );
}

export default Achievements;
