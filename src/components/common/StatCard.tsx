import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

interface Props {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: number;
  trendLabel?: string;
  color?: string;
  bg?: string;
}

export function StatCard({ title, value, icon: Icon, trend, trendLabel, color = "text-purple-600", bg = "bg-purple-50" }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-11 h-11 rounded-xl ${bg} flex items-center justify-center`}>
          <Icon className={`w-5 h-5 ${color}`} />
        </div>
        {trend !== undefined && (
          <div className={`flex items-center gap-1 text-xs font-semibold ${trend >= 0 ? "text-green-600" : "text-red-500"}`}>
            {trend >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <p className="text-2xl font-bold text-gray-900 mb-1">{value}</p>
      <p className="text-sm text-gray-500">{title}</p>
      {trendLabel && <p className="text-xs text-gray-400 mt-0.5">{trendLabel}</p>}
    </div>
  );
}
