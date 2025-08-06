import { LucideIcon } from "lucide-react";
import { Card } from "../ui/Card";

interface MetricCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: LucideIcon;
  color: string;
  isDark: boolean;
}

export const MetricCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color,
  isDark,
}: MetricCardProps) => (
  <Card isDark={isDark} className="p-4">
    <div className="flex items-center justify-between mb-2">
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center ${color}`}
      >
        <Icon className="w-5 h-5 text-white" />
      </div>
      <span
        className={`text-xs font-light ${
          isDark ? "text-slate-400" : "text-slate-600"
        }`}
      >
        On track
      </span>
    </div>
    <div
      className={`text-2xl font-light mb-1 ${
        isDark ? "text-slate-200" : "text-slate-800"
      }`}
    >
      {value}
    </div>
    <div
      className={`text-sm font-light ${
        isDark ? "text-slate-400" : "text-slate-600"
      }`}
    >
      {title}
    </div>
    {subtitle && (
      <div
        className={`text-xs font-light ${
          isDark ? "text-slate-500" : "text-slate-500"
        }`}
      >
        {subtitle}
      </div>
    )}
  </Card>
);
