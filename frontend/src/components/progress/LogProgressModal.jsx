import { useState } from "react";
import { X } from "lucide-react";

const fields = [
  ["weight", "Weight (kg)", "0.1", "300"],
  ["bodyFat", "Body fat (%)", "0.1", "100"],
  ["muscleMass", "Muscle mass (kg)", "0.1", "300"],
  ["fitnessScore", "Fitness score (0–100)", "1", "100"],
];

function LogProgressModal({ onClose, onSave }) {
  const [form, setForm] = useState({ weight: "", bodyFat: "", muscleMass: "", fitnessScore: "", progressNote: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      const data = Object.fromEntries(Object.entries(form).filter(([, value]) => value !== ""));
      for (const key of ["weight", "bodyFat", "muscleMass", "fitnessScore"]) {
        if (data[key] !== undefined) data[key] = Number(data[key]);
      }
      await onSave(data);
    } catch (saveError) {
      setError(saveError?.message || "Could not save this measurement. Try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center overflow-y-auto bg-slate-950/50 p-4 backdrop-blur-sm" onMouseDown={(event) => { if (event.target === event.currentTarget && !saving) onClose(); }}>
      <section role="dialog" aria-modal="true" aria-labelledby="progress-dialog-title" className="my-auto w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl">
        <div className="mb-5 flex items-start justify-between">
          <div><h2 id="progress-dialog-title" className="text-xl font-bold text-slate-900">Log a measurement</h2><p className="mt-1 text-sm text-slate-500">Add a dated entry to your progress history.</p></div>
          <button type="button" onClick={onClose} disabled={saving} aria-label="Close dialog" className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 disabled:opacity-50"><X size={19} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700" role="alert">{error}</p>}
          <div className="grid gap-4 sm:grid-cols-2">
            {fields.map(([name, label, step, max]) => <label key={name} className="text-sm font-medium text-slate-700">{label}<input type="number" name={name} min="0" max={max} step={step} required={name === "weight"} value={form[name]} onChange={(event) => setForm((current) => ({ ...current, [name]: event.target.value }))} className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" /></label>)}
          </div>
          <label className="block text-sm font-medium text-slate-700">Note (optional)<textarea maxLength={500} rows={3} value={form.progressNote} onChange={(event) => setForm((current) => ({ ...current, progressNote: event.target.value }))} className="mt-1.5 w-full resize-y rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" /></label>
          <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
            <button type="button" onClick={onClose} disabled={saving} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700">Cancel</button>
            <button type="submit" disabled={saving} className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60">{saving ? "Saving…" : "Save measurement"}</button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default LogProgressModal;
