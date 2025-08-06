import { Card } from "../ui/Card";

interface WellnessChartProps {
  isDark: boolean;
}

export const WellnessChart = ({ isDark }: WellnessChartProps) => (
  <Card isDark={isDark} className="p-6">
    <div className="flex items-center justify-between mb-4">
      <h3
        className={`text-lg font-light ${
          isDark ? "text-slate-200" : "text-slate-800"
        }`}
      >
        Wellness Journey
      </h3>
      <select
        className={`text-sm bg-transparent border-none outline-none font-light ${
          isDark ? "text-slate-400" : "text-slate-500"
        }`}
      >
        <option>This week</option>
        <option>This month</option>
        <option>Last 3 months</option>
      </select>
    </div>
    <div className="h-48 relative">
      <div
        className={`absolute inset-0 rounded-lg opacity-40 ${
          isDark
            ? "bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800"
            : "bg-gradient-to-r from-slate-100 via-blue-50 to-slate-100"
        }`}
      >
        <svg className="w-full h-full" viewBox="0 0 400 200">
          <path
            d="M0,180 Q100,140 200,120 T400,90 L400,200 L0,200 Z"
            fill={`url(#${
              isDark ? "darkGradient" : "nordicGradient"
            })`}
            opacity="0.4"
          />
          <path
            d="M0,180 Q100,140 200,120 T400,90"
            fill="none"
            stroke={isDark ? "#64748b" : "#475569"}
            strokeWidth="1.5"
            opacity="0.7"
          />
          <defs>
            <linearGradient
              id="nordicGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop
                offset="0%"
                stopColor="#cbd5e1"
                stopOpacity="0.3"
              />
              <stop
                offset="50%"
                stopColor="#e0e7ff"
                stopOpacity="0.3"
              />
              <stop
                offset="100%"
                stopColor="#f1f5f9"
                stopOpacity="0.3"
              />
            </linearGradient>
            <linearGradient
              id="darkGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop
                offset="0%"
                stopColor="#475569"
                stopOpacity="0.3"
              />
              <stop
                offset="50%"
                stopColor="#64748b"
                stopOpacity="0.3"
              />
              <stop
                offset="100%"
                stopColor="#334155"
                stopOpacity="0.3"
              />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <div className="absolute bottom-4 left-4">
        <div
          className={`text-2xl font-light ${
            isDark ? "text-slate-200" : "text-slate-800"
          }`}
        >
          85%
        </div>
        <div
          className={`text-sm font-light ${
            isDark ? "text-slate-400" : "text-slate-500"
          }`}
        >
          Overall Score
        </div>
      </div>
    </div>
  </Card>
);
