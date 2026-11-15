import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import MainLayout from "../components/layout/MainLayout";
import { editWorkout, fetchWorkoutById, fetchWorkouts } from "../store/slices/workoutSlice";

function WorkoutDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selectedWorkout, loading, error, workouts } = useSelector((state) => state.workout);
  const [saving, setSaving] = useState(false);
  const [actionError, setActionError] = useState("");

  useEffect(() => {
    dispatch(fetchWorkoutById(id));
    dispatch(fetchWorkouts());
  }, [dispatch, id]);

  const previousFor = (exerciseName) => {
    const currentDate = new Date(selectedWorkout?.createdAt || 0).getTime();
    for (const workout of workouts) {
      if (workout._id === id || new Date(workout.createdAt || 0).getTime() >= currentDate) continue;
      const match = workout.exercises?.find((exercise) => exercise.name?.trim().toLowerCase() === exerciseName?.trim().toLowerCase());
      if (match) return match;
    }
    return null;
  };

  if (!selectedWorkout || selectedWorkout._id !== id) {
    return <MainLayout><p className="p-6 text-slate-500" role={error ? "alert" : "status"}>{error || (loading ? "Loading workout..." : "Workout not found.")}</p></MainLayout>;
  }

  return <MainLayout>
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-sm font-medium text-blue-700">{selectedWorkout.category} · {selectedWorkout.difficulty}</p><h1 className="mt-1 text-3xl font-bold text-slate-900">{selectedWorkout.title}</h1><p className="mt-1 text-sm text-slate-500">{selectedWorkout.createdAt ? new Date(selectedWorkout.createdAt).toLocaleString() : ""}</p></div>
        <button type="button" disabled={saving} onClick={async () => { setSaving(true); setActionError(""); try { await dispatch(editWorkout({ id, data: { completed: !selectedWorkout.completed, completedAt: selectedWorkout.completed ? null : new Date().toISOString() } })).unwrap(); } catch (saveError) { setActionError(saveError?.response?.data?.message || "Could not update workout status."); } finally { setSaving(false); } }} className={`rounded-xl px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50 ${selectedWorkout.completed ? "bg-emerald-700 hover:bg-emerald-800" : "bg-blue-600 hover:bg-blue-700"}`}>
          {saving ? "Saving..." : selectedWorkout.completed ? "Mark incomplete" : "Mark complete"}
        </button>
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-3"><p className="rounded-xl bg-slate-50 p-3 text-sm text-slate-600">Duration <strong className="ml-2 text-slate-900">{selectedWorkout.duration} min</strong></p><p className="rounded-xl bg-slate-50 p-3 text-sm text-slate-600">Estimated calories <strong className="ml-2 text-slate-900">{selectedWorkout.caloriesBurned || 0} kcal</strong>{selectedWorkout.bodyWeightKg ? <span className="ml-1 text-xs">at {selectedWorkout.bodyWeightKg} kg</span> : null}</p><p className="rounded-xl bg-slate-50 p-3 text-sm text-slate-600">Status <strong className="ml-2 text-slate-900">{selectedWorkout.completed ? "Completed" : "Planned / logged"}</strong></p></div>
      {actionError && <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700" role="alert">{actionError}</p>}
      <div className="mt-6"><h2 className="mb-2 font-semibold text-slate-900">Exercises and progress</h2>
        {selectedWorkout.exercises?.length ? <ul className="space-y-2">{selectedWorkout.exercises.map((exercise, index) => { const previous = previousFor(exercise.name); const repChange = previous ? (exercise.reps || 0) - (previous.reps || 0) : 0; const weightChange = previous ? (exercise.weight || 0) - (previous.weight || 0) : 0; return <li key={`${exercise.name}-${index}`} className="rounded-xl border border-slate-200 bg-slate-50 p-3"><p className="font-medium text-slate-900">{exercise.name}</p><p className="text-sm text-slate-500">{exercise.sets || 0} sets · {exercise.reps || 0} reps{exercise.weight ? ` · ${exercise.weight} kg` : ""}</p>{previous && <p className="mt-1 text-xs text-slate-500">Last time: {previous.sets} sets · {previous.reps} reps{previous.weight ? ` · ${previous.weight} kg` : ""}{repChange > 0 || weightChange > 0 ? <span className="font-semibold text-emerald-700"> · Improved{repChange > 0 ? ` +${repChange} reps` : ""}{weightChange > 0 ? ` +${weightChange} kg` : ""}</span> : null}</p>}</li>; })}</ul> : <p className="text-sm text-slate-500">No exercises were recorded for this session.</p>}
      </div>
    </div>
  </MainLayout>;
}

export default WorkoutDetails;
