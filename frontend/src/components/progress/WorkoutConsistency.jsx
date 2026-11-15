import { Flame } from "lucide-react";

function WorkoutConsistency({ workouts = [] }) {
  const today = new Date();
  const uniqueTrainingDays = new Set(workouts.filter((item) => item.completed).map((item) => new Date(item.completedAt || item.createdAt).toDateString()));
  let cursor = new Date(today);
  cursor.setHours(0, 0, 0, 0);
  if (!uniqueTrainingDays.has(cursor.toDateString())) cursor.setDate(cursor.getDate() - 1);
  let streak = 0;
  while (uniqueTrainingDays.has(cursor.toDateString())) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const thisMonth = workouts.filter((item) => new Date(item.createdAt) >= monthStart);
  const completed = thisMonth.filter((item) => item.completed).length;
  const completion = thisMonth.length ? Math.round((completed / thisMonth.length) * 100) : 0;

  return (
    <section className="rounded-[28px] border border-orange-100 bg-orange-50 p-5 shadow-sm">
      <div className="flex items-center gap-2"><Flame size={18} className="text-orange-500" /><h3 className="text-lg font-semibold text-slate-900">Workout consistency</h3></div>
      <div className="mt-5 flex items-end gap-2"><span className="text-5xl font-bold leading-none text-orange-500">{streak}</span><span className="pb-1 text-sm text-slate-600">day completed-workout streak</span></div>
      <p className="mt-2 text-sm text-slate-500">A session counts toward your streak when you mark it complete.</p>
      <div className="mt-5 flex justify-between text-xs"><span className="text-slate-500">Completed this month</span><span className="font-semibold text-slate-800">{completed} / {thisMonth.length} ({completion}%)</span></div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-white"><div className="h-full rounded-full bg-orange-500 transition-all" style={{ width: `${completion}%` }} /></div>
    </section>
  );
}

export default WorkoutConsistency;
