import React, { useMemo } from "react";
import { Card } from "../ui/Card";
import { ProcessedWeightData } from "@/types/withings";

interface WeightChartProps {
  data: ProcessedWeightData[];
  isDark: boolean;
  timeRange?: "7d" | "30d" | "90d" | "1y";
}

export const WeightChart: React.FC<WeightChartProps> = ({
  data,
  isDark,
  timeRange = "30d",
}) => {
  const filteredData = useMemo(() => {
    if (!data.length) return [];
    
    const now = new Date();
    const days = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : timeRange === "90d" ? 90 : 365;
    const cutoffDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
    
    return data
      .filter(d => d.date >= cutoffDate)
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [data, timeRange]);

  const chartData = useMemo(() => {
    if (!filteredData.length) return { points: "", minWeight: 0, maxWeight: 0, range: 0 };
    
    const weights = filteredData.map(d => d.weight);
    const minWeight = Math.min(...weights);
    const maxWeight = Math.max(...weights);
    const range = maxWeight - minWeight || 1;
    
    const chartWidth = 300;
    const chartHeight = 120;
    
    const points = filteredData
      .map((d, i) => {
        const x = (i / (filteredData.length - 1)) * chartWidth;
        const y = chartHeight - ((d.weight - minWeight) / range) * chartHeight;
        return `${x},${y}`;
      })
      .join(" ");
      
    return { points, minWeight, maxWeight, range };
  }, [filteredData]);

  if (!filteredData.length) {
    return (
      <Card isDark={isDark} className="p-6">
        <h3
          className={`text-lg font-light mb-4 ${
            isDark ? "text-slate-200" : "text-slate-800"
          }`}
        >
          Weight Trend
        </h3>
        <div className="text-center py-8">
          <p
            className={`font-light ${
              isDark ? "text-slate-400" : "text-slate-500"
            }`}
          >
            No weight data available for the selected time range.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card isDark={isDark} className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3
          className={`text-lg font-light ${
            isDark ? "text-slate-200" : "text-slate-800"
          }`}
        >
          Weight Trend
        </h3>
        <div className="flex items-center space-x-2">
          <span
            className={`text-sm font-light ${
              isDark ? "text-slate-400" : "text-slate-500"
            }`}
          >
            {filteredData.length} measurements
          </span>
        </div>
      </div>

      <div className="relative h-32 mb-4">
        <svg
          viewBox="0 0 300 120"
          className="w-full h-full"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient
              id={`weightGradient-${isDark ? 'dark' : 'light'}`}
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop
                offset="0%"
                stopColor={isDark ? "#475569" : "#cbd5e1"}
                stopOpacity="0.3"
              />
              <stop
                offset="50%"
                stopColor={isDark ? "#64748b" : "#e0e7ff"}
                stopOpacity="0.3"
              />
              <stop
                offset="100%"
                stopColor={isDark ? "#334155" : "#f1f5f9"}
                stopOpacity="0.3"
              />
            </linearGradient>
          </defs>
          
          {/* Area under the curve */}
          <path
            d={`M0,120 L${chartData.points} L300,120 Z`}
            fill={`url(#weightGradient-${isDark ? 'dark' : 'light'})`}
            opacity="0.4"
          />
          
          {/* Weight line */}
          <polyline
            points={chartData.points}
            fill="none"
            stroke={isDark ? "#64748b" : "#475569"}
            strokeWidth="2"
            opacity="0.8"
          />
          
          {/* Data points */}
          {filteredData.map((d, i) => {
            const x = (i / (filteredData.length - 1)) * 300;
            const y = 120 - ((d.weight - chartData.minWeight) / chartData.range) * 120;
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r="3"
                fill={isDark ? "#64748b" : "#475569"}
                opacity="0.6"
              />
            );
          })}
        </svg>
      </div>

      <div className="flex items-center justify-between text-sm">
        <div>
          <div
            className={`font-light ${
              isDark ? "text-slate-300" : "text-slate-600"
            }`}
          >
            Min: {chartData.minWeight.toFixed(1)}kg
          </div>
        </div>
        <div className="text-center">
          <div
            className={`font-light ${
              isDark ? "text-slate-400" : "text-slate-500"
            }`}
          >
            Last {timeRange}
          </div>
        </div>
        <div className="text-right">
          <div
            className={`font-light ${
              isDark ? "text-slate-300" : "text-slate-600"
            }`}
          >
            Max: {chartData.maxWeight.toFixed(1)}kg
          </div>
        </div>
      </div>
    </Card>
  );
};