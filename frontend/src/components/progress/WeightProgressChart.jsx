import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ResponsiveContainer, AreaChart, Area, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

const ranges = [
  { label: "6 weeks", days: 42 },
  { label: "3 months", days: 90 },
  { label: "6 months", days: 180 },
  { label: "All time", days: null },
];

function WeightProgressChart({ progress = [] }) {
  const [range, setRange] = useState(0);
  const [now] = useState(() => Date.now());
  const data = useMemo(() => {
    const earliest = ranges[range].days ? now - ranges[range].days * 86400000 : 0;
    return progress
      .filter((entry) => Number.isFinite(Number(entry.weight)) && new Date(entry.date).getTime() >= earliest)
      .slice()
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .map((entry) => ({
        date: new Date(entry.date).toLocaleDateString(undefined, { month: "short", day: "numeric" }),
        weight: Number(entry.weight),
      }));
  }, [progress, range, now]);

  return (
    <section className="min-h-[280px] rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div><h2 className="text-lg font-semibold text-slate-900">Weight history</h2><p className="mt-1 text-xs text-slate-500">Your saved measurements over time</p></div>
        <label className="sr-only" htmlFor="weight-chart-range">Chart date range</label>
        <select id="weight-chart-range" value={range} onChange={(event) => setRange(Number(event.target.value))} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700 outline-none focus:border-blue-500">
          {ranges.map((item, index) => <option key={item.label} value={index}>{item.label}</option>)}
        </select>
      </div>
      {data.length < 2 ? (
        <div className="flex min-h-[190px] flex-col items-center justify-center rounded-2xl bg-slate-50 px-5 text-center">
          <p className="text-sm font-medium text-slate-700">{data.length ? "Add one more weight entry to see a trend." : "Your weight chart will appear after you log a measurement."}</p>
          <Link to="/progress?log=1" className="mt-2 text-sm font-semibold text-blue-700 hover:underline">Log a measurement</Link>
        </div>
      ) : (
        <div className="h-[210px] w-full min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -18 }}>
              <defs><linearGradient id="weightGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#2563eb" stopOpacity={0.22} /><stop offset="95%" stopColor="#2563eb" stopOpacity={0.02} /></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 11 }} />
              <YAxis domain={([min, max]) => [Math.floor(min - 1), Math.ceil(max + 1)]} axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 11 }} />
              <Tooltip formatter={(value) => [`${value} kg`, "Weight"]} contentStyle={{ borderRadius: 14, border: "none", boxShadow: "0 10px 30px rgba(0,0,0,0.08)" }} />
              <Area type="monotone" dataKey="weight" stroke="none" fill="url(#weightGradient)" />
              <Line type="monotone" dataKey="weight" stroke="#2563eb" strokeWidth={3} dot={{ r: 4, fill: "#2563eb", strokeWidth: 0 }} activeDot={{ r: 6 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}

export default WeightProgressChart;
