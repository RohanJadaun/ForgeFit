import { useState } from "react";
import { X } from "lucide-react";

const foodProfiles = [
  [/chicken|turkey|lean meat|beef/, { calories: 190, protein: 29, carbs: 0, fat: 7 }],
  [/salmon|tuna|fish/, { calories: 180, protein: 24, carbs: 0, fat: 9 }],
  [/egg/, { calories: 155, protein: 13, carbs: 1, fat: 11 }],
  [/rice|oats|pasta|bread|roti|chapati/, { calories: 150, protein: 5, carbs: 29, fat: 2 }],
  [/banana|apple|orange|berries|fruit/, { calories: 75, protein: 1, carbs: 19, fat: 0 }],
  [/potato|sweet potato/, { calories: 90, protein: 2, carbs: 21, fat: 0 }],
  [/yogurt|curd|milk/, { calories: 65, protein: 4, carbs: 5, fat: 3 }],
  [/lentil|dal|beans|chickpea/, { calories: 125, protein: 8, carbs: 21, fat: 1 }],
  [/peanut|almond|nut|peanut butter/, { calories: 590, protein: 21, carbs: 21, fat: 50 }],
  [/salad|vegetable|broccoli|spinach/, { calories: 45, protein: 3, carbs: 8, fat: 1 }],
];

const estimateNutrition = (name, grams) => {
  const profile = foodProfiles.find(([pattern]) => pattern.test(name))?.[1] || { calories: 160, protein: 7, carbs: 20, fat: 6 };
  const factor = grams / 100;
  return Object.fromEntries(Object.entries(profile).map(([key, value]) => [key, Math.round(value * factor * 10) / 10]));
};

function AddFoodModal({ onClose, onSave }) {
  const [meal, setMeal] = useState({ mealType: "Breakfast", foodName: "", quantity: "100" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const update = (event) => setMeal((current) => ({ ...current, [event.target.name]: event.target.value }));

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setSaving(true);
    try {
      const grams = Number(meal.quantity);
      await onSave({ ...meal, quantity: `${grams} g`, ...estimateNutrition(meal.foodName, grams) });
      onClose();
    } catch (saveError) {
      setError(saveError.message || "Could not save this food entry. Please try again.");
    } finally { setSaving(false); }
  };

  const inputClass = "mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-50";
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-slate-950/45 p-4" onMouseDown={(event) => { if (event.target === event.currentTarget && !saving) onClose(); }}>
      <section className="my-auto w-full max-w-xl overflow-hidden rounded-3xl border border-white/70 bg-white shadow-2xl" role="dialog" aria-modal="true" aria-labelledby="add-food-title">
        <header className="flex items-start justify-between border-b border-slate-100 px-6 py-5 sm:px-8">
          <div><p className="text-sm font-semibold text-blue-600">Nutrition log</p><h2 id="add-food-title" className="mt-1 text-2xl font-bold text-slate-900">Add food entry</h2><p className="mt-1 text-sm text-slate-500">Enter a food and its weight. Nutrition will be estimated.</p></div>
          <button type="button" onClick={onClose} disabled={saving} aria-label="Close add food dialog" className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"><X size={20} /></button>
        </header>
        <form onSubmit={submit} className="space-y-5 px-6 py-6 sm:px-8">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-medium text-slate-700 sm:col-span-2">Food name<input name="foodName" value={meal.foodName} onChange={update} required maxLength={100} placeholder="e.g. grilled chicken, rice, banana" className={inputClass} /></label>
            <label className="text-sm font-medium text-slate-700">Meal<select name="mealType" value={meal.mealType} onChange={update} className={`${inputClass} bg-white`}>{["Breakfast", "Lunch", "Dinner", "Snack"].map((type) => <option key={type}>{type}</option>)}</select></label>
            <label className="text-sm font-medium text-slate-700">Serving size<div className="mt-1.5 flex items-center gap-2"><input name="quantity" type="number" inputMode="decimal" value={meal.quantity} onChange={update} required min="1" max="5000" step="1" placeholder="100" className={inputClass} /><span className="text-slate-500">g</span></div></label>
            <p className="rounded-xl bg-blue-50 px-4 py-3 text-sm text-blue-800 sm:col-span-2">Calories and macros are estimated from the food name and weight. Values are approximate.</p>
          </div>
          {error && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
          <footer className="flex justify-end gap-3 border-t border-slate-100 pt-5"><button type="button" onClick={onClose} disabled={saving} className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50">Cancel</button><button type="submit" disabled={saving} className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-wait disabled:opacity-60">{saving ? "Saving entry..." : "Save food"}</button></footer>
        </form>
      </section>
    </div>
  );
}

export default AddFoodModal;
