import React from "react";
import { Scale, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Card } from "../ui/Card";
import { ProcessedWeightData } from "@/types/withings";

interface WeightMetricCardProps {
  latestWeight: ProcessedWeightData | null;
  weightTrend: {
    current: number;
    previous: number;
    change: number;
    trend: 'up' | 'down' | 'stable';
  } | null;
  isDark: boolean;
}

export const WeightMetricCard: React.FC<WeightMetricCardProps> = ({
  latestWeight,
  weightTrend,
  isDark,
}) => {
  const formatWeight = (weight: number): string => {
    return `${weight.toFixed(1)} kg`;
  };

  const getTrendColor = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return isDark ? "text-orange-400" : "text-orange-500";
      case 'down':
        return isDark ? "text-emerald-400" : "text-emerald-500";
      default:
        return isDark ? "text-slate-400" : "text-slate-500";
    }
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <TrendingUp size={20} />;
      case 'down':
        return <TrendingDown size={20} />;
      default:
        return <Minus size={20} />;
    }
  };

  if (!latestWeight) {
    return (
      <Card isDark={isDark} className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center ${
              isDark ? "bg-slate-700" : "bg-slate-200"
            }`}
          >
            <Scale className="w-5 h-5 text-white" />
          </div>
          <span
            className={`text-xs font-light ${
              isDark ? "text-slate-400" : "text-slate-600"
            }`}
          >
            No data
          </span>
        </div>
        <div
          className={`text-2xl font-light mb-1 ${
            isDark ? "text-slate-200" : "text-slate-800"
          }`}
        >
          --.-
        </div>
        <div
          className={`text-sm font-light ${
            isDark ? "text-slate-400" : "text-slate-600"
          }`}
        >
          Current Weight
        </div>
      </Card>
    );
  }

  return (
    <Card isDark={isDark} className="p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-600">
          <Scale className="w-5 h-5 text-white" />
        </div>
        <div className="flex items-center space-x-1">
          {weightTrend && (
            <>
              <div className={getTrendColor(weightTrend.trend)}>
                {getTrendIcon(weightTrend.trend)}
              </div>
              <span
                className={`text-xs font-light ${getTrendColor(weightTrend.trend)}`}
              >
                {Math.abs(weightTrend.change).toFixed(1)}kg
              </span>
            </>
          )}
        </div>
      </div>
      <div
        className={`text-2xl font-light mb-1 ${
          isDark ? "text-slate-200" : "text-slate-800"
        }`}
      >
        {formatWeight(latestWeight.weight)}
      </div>
      <div
        className={`text-sm font-light ${
          isDark ? "text-slate-400" : "text-slate-600"
        }`}
      >
        Current Weight
      </div>
      <div
        className={`text-xs font-light ${
          isDark ? "text-slate-500" : "text-slate-500"
        }`}
      >
        {latestWeight.date.toLocaleDateString()}
      </div>
    </Card>
  );
};