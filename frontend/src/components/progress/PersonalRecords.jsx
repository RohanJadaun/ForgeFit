import { Dumbbell, Clock3, Trophy, ClipboardList } from "lucide-react";

function PersonalRecords({ progress = [], workouts = [] }) {
  const lift = workouts.flatMap((workout) => (workout.exercises || []).map((exercise) => ({ ...exercise, workout: workout.title })))
    .filter((exercise) => Number(exercise.weight) > 0)
    .sort((a, b) => Number(b.weight) - Number(a.weight))[0];
  const longestWorkout = workouts.slice().sort((a, b) => Number(b.duration) - Number(a.duration))[0];
  const highestScore = progress.slice().sort((a, b) => Number(b.fitnessScore) - Number(a.fitnessScore))[0];
  const records = [
    { label: "Heaviest logged lift", value: lift ? `${lift.name}: ${lift.weight} kg` : "No lift logged", icon: Dumbbell },
    { label: "Longest session", value: longestWorkout ? `${longestWorkout.duration} min` : "No session logged", icon: Clock3 },
    { label: "Highest fitness score", value: highestScore?.fitnessScore ? `${highestScore.fitnessScore}/100` : "No score logged", icon: Trophy },
    { label: "Measurements saved", value: String(progress.length), icon: ClipboardList },
  ];

  return (
    <section className="rounded-[28px] border border-violet-100 bg-violet-50 p-5 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold text-slate-900">Personal records</h3>
      <div className="grid grid-cols-2 gap-3">
        {records.map(({ label, value, icon: Icon }) => <div key={label} className="rounded-2xl border border-violet-100 bg-white p-3"><Icon size={17} className="mb-2 text-violet-600" /><p className="text-xs text-slate-500">{label}</p><p className="mt-1 text-sm font-bold text-slate-900">{value}</p></div>)}
      </div>
    </section>
  );
}

export default PersonalRecords;
