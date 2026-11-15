import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Activity, CalendarDays, Clock3, RotateCw, Sparkles, Zap } from "lucide-react";
import MainLayout from "../components/layout/MainLayout";
import CoachChat from "../components/aiCoach/CoachChat";
import { fetchReadiness, fetchRecovery, fetchWeeklyPlan } from "../store/slices/aiCoachSlice";

function AICoach() {
  const dispatch = useDispatch();
  const { readiness, recovery, weeklyPlan, loading, error } = useSelector((state) => state.aiCoach);
  const refresh = useCallback(() => {
    dispatch(fetchReadiness());
    dispatch(fetchRecovery());
    dispatch(fetchWeeklyPlan());
  }, [dispatch]);

  useEffect(() => { refresh(); }, [refresh]);

  return (
    <MainLayout>
      <div className="space-y-6">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div><p className="flex items-center gap-2 text-sm font-semibold text-blue-700"><Sparkles size={16} /> Training companion</p><h1 className="mt-1 text-3xl font-bold text-slate-900">AI Coach</h1><p className="mt-1 text-sm text-slate-500">Guidance shaped by your workout, nutrition, and progress logs.</p></div>
          <div className="flex gap-3"><button type="button" onClick={refresh} disabled={loading} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"><RotateCw size={15} className={loading ? "animate-spin" : ""} /> Refresh insights</button><Link to="/workouts" className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">Log a workout</Link></div>
        </header>

        {error && <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700" role="alert"><span>{error}</span><button type="button" onClick={refresh} className="font-semibold underline">Try again</button></div>}

        <div className="grid gap-4 lg:grid-cols-2">
          <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2"><Zap size={18} className="text-orange-500" /><h2 className="font-semibold text-slate-900">Training readiness</h2></div>
            <div className="mt-4 flex items-end gap-2"><span className="text-4xl font-bold text-slate-900">{readiness ? readiness.score : "—"}</span><span className="pb-1 text-sm text-slate-500">/ 100</span>{readiness && <span className="mb-1 ml-2 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">{readiness.label}</span>}</div>
            <p className="mt-2 text-sm text-slate-500">A simple estimate from your recent logged workouts; it does not include sleep, heart rate, or medical information.</p>
            {readiness && <p className="mt-3 text-xs text-slate-600">{readiness.recentWorkouts} workout{readiness.recentWorkouts === 1 ? "" : "s"} in the last three days</p>}
          </section>

          <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2"><Activity size={18} className="text-emerald-600" /><h2 className="font-semibold text-slate-900">Recovery check-in</h2></div>
            <p className="mt-4 inline-flex rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">{recovery?.status || "Waiting for activity"}</p>
            <p className="mt-3 text-sm leading-6 text-slate-600">{recovery?.message || "Log a workout to get a recovery suggestion based on your recent training."}</p>
            {recovery?.hoursSinceWorkout !== null && recovery?.hoursSinceWorkout !== undefined && <p className="mt-3 flex items-center gap-1 text-xs text-slate-500"><Clock3 size={13} /> Last session {recovery.hoursSinceWorkout} hours ago</p>}
          </section>
        </div>

        <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2"><CalendarDays size={18} className="text-blue-600" /><div><h2 className="font-semibold text-slate-900">Your week</h2><p className="text-xs text-slate-500">A flexible outline based on your goal and completed sessions.</p></div></div>
          {weeklyPlan?.length ? <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-7">{weeklyPlan.map((day) => <article key={day.day} className={`rounded-2xl border p-3 ${day.status === "done" ? "border-emerald-200 bg-emerald-50" : day.status === "current" ? "border-blue-200 bg-blue-50" : "border-slate-200 bg-slate-50"}`}><p className="text-xs font-medium text-slate-500">{day.day}{day.status === "current" ? " · Today" : ""}</p><p className="mt-2 text-sm font-semibold text-slate-900">{day.workout}</p><p className="mt-1 text-xs text-slate-500">{day.status === "done" ? "Completed" : day.status === "current" ? "Today’s focus" : "Planned"}</p></article>)}</div> : <p className="text-sm text-slate-500">{loading ? "Building your week…" : "Your weekly outline will appear here."}</p>}
        </section>

        <div id="coach-chat"><CoachChat /></div>
      </div>
    </MainLayout>
  );
}

export default AICoach;
