import { Watch } from "lucide-react";

function ConnectedDevices() {
  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-2"><Watch size={19} className="text-blue-600" /><h2 className="text-xl font-semibold">Device integrations</h2></div>
      <p className="mt-2 text-sm leading-6 text-slate-500">No fitness devices are connected in this portfolio demo. Workout and nutrition entries are added directly in ForgeFit.</p>
    </section>
  );
}

export default ConnectedDevices;
