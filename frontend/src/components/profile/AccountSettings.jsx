import { useEffect, useState } from "react";

const preferenceKey = "forgefit_show_activity";

function AccountSettings() {
  const [showActivity, setShowActivity] = useState(() => window.localStorage.getItem(preferenceKey) !== "false");

  useEffect(() => {
    const syncPreference = () => setShowActivity(window.localStorage.getItem(preferenceKey) !== "false");
    window.addEventListener("storage", syncPreference);
    return () => window.removeEventListener("storage", syncPreference);
  }, []);

  const toggle = () => {
    const nextValue = !showActivity;
    window.localStorage.setItem(preferenceKey, String(nextValue));
    setShowActivity(nextValue);
    window.dispatchEvent(new Event("forgefit:preferences"));
  };

  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-slate-900">Account settings</h2>
      <p className="mb-4 mt-1 text-sm text-slate-500">This preference is saved in this browser.</p>
      <div className="flex items-center justify-between gap-4 border-t border-slate-100 pt-4">
        <div><p className="text-sm font-medium text-slate-800">Recent activity shortcut</p><p className="text-xs text-slate-500">Show the activity panel in the top navigation.</p></div>
        <button type="button" role="switch" aria-label="Show recent activity shortcut" aria-checked={showActivity} onClick={toggle} className={`flex h-6 w-11 shrink-0 items-center rounded-full p-1 transition ${showActivity ? "bg-blue-600" : "bg-slate-300"}`}>
          <span className={`h-4 w-4 rounded-full bg-white shadow transition-transform ${showActivity ? "translate-x-5" : "translate-x-0"}`} />
        </button>
      </div>
    </section>
  );
}

export default AccountSettings;
