function WaterTracker({ water = 0, onAddWater }) {
  const goal = 3;
  const progress = Math.min(100, Math.round((water / goal) * 100));
  return (
    <div className="mt-8 border-t border-slate-200 pt-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-slate-900">
          Water Intake
        </h3>

        <span className="font-semibold text-cyan-600">
          {water.toFixed(2).replace(/0+$/, "").replace(/\.$/, "")}L / {goal.toFixed(1)}L
        </span>
      </div>

      <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
        <div className="h-full bg-cyan-500 rounded-full transition-all" style={{ width: `${progress}%` }} />
      </div>

      <div className="flex justify-between mt-3 text-sm">
        <span className="text-slate-500">
          Hydration Goal
        </span>

        <span className="font-medium text-slate-700">
          {progress}%
        </span>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" onClick={() => onAddWater?.(0.25)} className="rounded-xl border border-cyan-200 bg-cyan-50 px-3 py-2 text-sm font-semibold text-cyan-800 transition hover:bg-cyan-100">+ 250 ml</button>
        <button type="button" onClick={() => onAddWater?.(0.5)} className="rounded-xl border border-cyan-200 bg-cyan-50 px-3 py-2 text-sm font-semibold text-cyan-800 transition hover:bg-cyan-100">+ 500 ml</button>
      </div>
    </div>
  );
}

export default WaterTracker;
