import { useSelector } from "react-redux";
import { Scale, Flame, Target, Activity } from "lucide-react";

function ProfileStats() {
  const { user } = useSelector((state) => state.auth);
  const { latestProgress } = useSelector((state) => state.progress);
  const fitnessProfile = user?.fitnessProfile || {};
  const stats = [
    { title: "Latest weight", value: latestProgress?.weight ? `${latestProgress.weight} kg` : "Not logged", icon: Scale, bg: "bg-blue-100", color: "text-blue-600" },
    { title: "Height", value: fitnessProfile.height ? `${fitnessProfile.height} cm` : "Not set", icon: Activity, bg: "bg-green-100", color: "text-green-600" },
    { title: "Goal", value: fitnessProfile.goal || "Not set", icon: Target, bg: "bg-purple-100", color: "text-purple-600" },
    { title: "Training level", value: fitnessProfile.level || "Not set", icon: Flame, bg: "bg-orange-100", color: "text-orange-600" },
  ];

  return (
    <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
      {stats.map(({ title, value, icon: Icon, bg, color }) => <div key={title} className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm"><span className={`flex h-10 w-10 items-center justify-center rounded-xl ${bg}`}><Icon size={20} className={color} /></span><p className="mt-4 text-sm text-slate-500">{title}</p><h3 className="mt-1 text-xl font-bold text-slate-900">{value}</h3></div>)}
    </div>
  );
}

export default ProfileStats;
