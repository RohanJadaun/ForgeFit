import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Clock3, Dumbbell, Flame, Plus, Trash2, X } from "lucide-react";
import { addWorkout, fetchTodayWorkout, fetchWorkouts } from "../../store/slices/workoutSlice";

const categories = ["Strength", "Cardio", "HIIT", "Yoga", "Mobility", "CrossFit", "Other"];
const metByCategory = { Strength: 5, Cardio: 7, HIIT: 8, Yoga: 3, Mobility: 3, CrossFit: 8, Other: 5 };
const inputClass = "mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100";
const blankExercise = () => ({ name: "", sets: "", reps: "", weight: "" });

function CreateWorkoutModal({ onClose }) {
  const dispatch = useDispatch();
  const workouts = useSelector((state) => state.workout.workouts);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ title: "", category: "Strength", difficulty: "Beginner", duration: "", bodyWeightKg: "", exercises: [blankExercise()] });
  const calories = useMemo(() => Math.round((metByCategory[form.category] || 5) * 3.5 * (Number(form.bodyWeightKg) || 0) / 200 * (Number(form.duration) || 0)), [form.category, form.bodyWeightKg, form.duration]);

  useEffect(() => {
    const handleKeyDown = (event) => { if (event.key === "Escape" && !saving) onClose(); };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, saving]);

  const handleChange = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  const updateExercise = (index, event) => setForm((current) => ({ ...current, exercises: current.exercises.map((exercise, i) => i === index ? { ...exercise, [event.target.name]: event.target.value } : exercise) }));
  const previousExercise = (name) => {
    const key = name.trim().toLowerCase();
    if (!key) return null;
    for (const workout of workouts) {
      const found = workout.exercises?.find((exercise) => exercise.name?.trim().toLowerCase() === key);
      if (found) return { ...found, date: workout.createdAt };
    }
    return null;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSaving(true);
    try {
      const exercises = form.exercises.filter((exercise) => exercise.name.trim()).map((exercise) => ({ name: exercise.name.trim(), sets: Number(exercise.sets) || 0, reps: Number(exercise.reps) || 0, weight: Number(exercise.weight) || 0 }));
      await dispatch(addWorkout({ title: form.title.trim(), category: form.category, difficulty: form.difficulty, duration: Number(form.duration), bodyWeightKg: Number(form.bodyWeightKg), caloriesBurned: calories, exercises })).unwrap();
      dispatch(fetchWorkouts());
      dispatch(fetchTodayWorkout());
      onClose();
    } catch (requestError) {
      setError(typeof requestError === "string" ? requestError : requestError?.message || "Could not save this workout. Check the details and try again.");
    } finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-slate-950/50 p-4 backdrop-blur-sm" onMouseDown={(event) => { if (event.target === event.currentTarget && !saving) onClose(); }}>
      <section className="my-auto w-full max-w-2xl overflow-hidden rounded-3xl border border-white/70 bg-white shadow-2xl" role="dialog" aria-modal="true" aria-labelledby="create-workout-title">
        <div className="flex items-start justify-between border-b border-slate-100 bg-gradient-to-r from-blue-50 to-white px-6 py-5 sm:px-8"><div className="flex items-center gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-white"><Dumbbell size={20} /></div><div><h2 id="create-workout-title" className="text-xl font-bold text-slate-900">Log a workout</h2><p className="mt-0.5 text-sm text-slate-500">Track your session and see how you progress.</p></div></div><button type="button" onClick={onClose} disabled={saving} aria-label="Close dialog" className="rounded-xl p-2 text-slate-400 hover:bg-white disabled:opacity-50"><X size={20} /></button></div>
        <form onSubmit={handleSubmit} className="max-h-[calc(100vh-9rem)] space-y-5 overflow-y-auto px-6 py-6 sm:px-8">
          {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
          <div className="grid gap-4 sm:grid-cols-2"><label className="text-sm font-semibold text-slate-700 sm:col-span-2">Workout name<input name="title" value={form.title} onChange={handleChange} className={inputClass} placeholder="e.g. Upper body strength" minLength={2} maxLength={80} required autoFocus /></label>
            <label className="text-sm font-semibold text-slate-700">Workout type<select name="category" value={form.category} onChange={handleChange} className={inputClass}>{categories.map((category) => <option key={category}>{category}</option>)}</select></label>
            <label className="text-sm font-semibold text-slate-700">Difficulty<select name="difficulty" value={form.difficulty} onChange={handleChange} className={inputClass}>{["Beginner", "Intermediate", "Advanced"].map((level) => <option key={level}>{level}</option>)}</select></label>
            <label className="text-sm font-semibold text-slate-700 sm:col-span-2"><span className="flex items-center gap-2"><Clock3 size={15} className="text-slate-400" />Duration (minutes)</span><input name="duration" type="number" inputMode="numeric" min="1" max="600" step="1" value={form.duration} onChange={handleChange} className={inputClass} placeholder="45" required /></label>
            <label className="text-sm font-semibold text-slate-700 sm:col-span-2">Your body weight (kg)<input name="bodyWeightKg" type="number" inputMode="decimal" min="1" max="350" step="0.1" value={form.bodyWeightKg} onChange={handleChange} className={inputClass} placeholder="e.g. 68" required /><span className="mt-1 block text-xs font-normal text-slate-500">Used only to estimate calories for this workout.</span></label>
          </div>
          <div className="flex items-center gap-2 rounded-xl bg-orange-50 px-4 py-3 text-sm text-orange-800"><Flame size={17} className="shrink-0 text-orange-500" />{calories ? `About ${calories} kcal estimated for ${form.bodyWeightKg} kg.` : "Enter your body weight and workout duration for a calorie estimate."} Actual burn varies.</div>

          <div className="space-y-3"><div className="flex items-center justify-between"><div><h3 className="text-sm font-semibold text-slate-800">Exercises <span className="font-normal text-slate-500">(optional)</span></h3><p className="text-xs text-slate-500">Record sets, reps, and weight to compare next time.</p></div><button type="button" onClick={() => setForm((current) => ({ ...current, exercises: [...current.exercises, blankExercise()] }))} className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-sm font-semibold text-blue-700 hover:bg-blue-50"><Plus size={15} /> Add exercise</button></div>
            {form.exercises.map((exercise, index) => { const previous = previousExercise(exercise.name); const improved = previous && Number(exercise.reps) > previous.reps; return <div key={index} className="rounded-2xl border border-slate-200 p-3"><div className="grid gap-2 sm:grid-cols-[1fr_75px_75px_85px_auto]"><label className="text-xs font-medium text-slate-600 sm:col-span-5">Exercise<input name="name" value={exercise.name} onChange={(event) => updateExercise(index, event)} className={inputClass} placeholder="e.g. Bench press" /></label><label className="text-xs font-medium text-slate-600">Sets<input name="sets" type="number" min="0" max="100" value={exercise.sets} onChange={(event) => updateExercise(index, event)} className={inputClass} placeholder="3" /></label><label className="text-xs font-medium text-slate-600">Reps<input name="reps" type="number" min="0" max="1000" value={exercise.reps} onChange={(event) => updateExercise(index, event)} className={inputClass} placeholder="10" /></label><label className="text-xs font-medium text-slate-600">Weight kg<input name="weight" type="number" min="0" max="1000" step="0.5" value={exercise.weight} onChange={(event) => updateExercise(index, event)} className={inputClass} placeholder="0" /></label><div className="flex items-end"><button type="button" aria-label="Remove exercise" onClick={() => setForm((current) => ({ ...current, exercises: current.exercises.length > 1 ? current.exercises.filter((_, i) => i !== index) : [blankExercise()] }))} className="mb-1 rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"><Trash2 size={16} /></button></div></div>{previous && <p className="mt-2 text-xs text-slate-500">Last time: {previous.sets} sets × {previous.reps} reps{previous.weight ? ` at ${previous.weight} kg` : ""}{exercise.reps ? <span className={improved ? "font-semibold text-emerald-700" : ""}> · {improved ? `+${Number(exercise.reps) - previous.reps} reps improvement` : `${Number(exercise.reps) - previous.reps} reps vs last time`}</span> : null}</p>}</div>; })}
          </div>
          <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end"><button type="button" onClick={onClose} disabled={saving} className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50">Cancel</button><button type="submit" disabled={saving} className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-wait disabled:opacity-60">{saving ? "Saving workout..." : "Save workout"}</button></div>
        </form>
      </section>
    </div>
  );
}

export default CreateWorkoutModal;
