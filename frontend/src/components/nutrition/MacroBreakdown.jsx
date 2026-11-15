import { Plus } from "lucide-react";
import WaterTracker from "./WaterTracker";

function MacroBreakdown({ nutrition, onAddFood, onAddWater }) {
  const macros = [
    { label: "Protein", value: nutrition?.protein || 0, color: "bg-red-500" },
    { label: "Carbs", value: nutrition?.carbs || 0, color: "bg-yellow-500" },
    { label: "Fat", value: nutrition?.fat || 0, color: "bg-violet-500" },
  ];
  const total = macros.reduce((sum, macro) => sum + Number(macro.value), 0);
  return (
    <div className="bg-white border border-slate-200 rounded-[28px] shadow-sm p-6">
      <h2 className="text-xl font-semibold">
        Macro Breakdown
      </h2>

      <p className="text-sm text-slate-500 mt-1 mb-6">
        Logged macro amounts and their share of total grams.
      </p>

      <div className="space-y-5">
        {macros.map((macro) => {
          const share = total ? Math.round((macro.value / total) * 100) : 0;
          return <div key={macro.label}>
          <div className="flex justify-between text-sm mb-1">
            <span>{macro.label}</span>
            <span>{macro.value}g · {share}%</span>
          </div>

          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div className={`h-full ${macro.color} rounded-full transition-all`} style={{ width: `${share}%` }} />
          </div>
        </div>;
        })}
      </div>

      <WaterTracker water={nutrition?.water || 0} onAddWater={onAddWater} />

      <button type="button" onClick={onAddFood} className="mt-6 w-full flex items-center justify-center gap-2 py-3 rounded-2xl border border-slate-200 hover:bg-slate-50 transition">
        <Plus size={18} />
        Add Food Entry
      </button>
    </div>
  );
}

export default MacroBreakdown;
