interface CircularProgressProps {
  percentage: number;
  label: string;
  color: string;
  isDark: boolean;
}

export const CircularProgress = ({
  percentage,
  label,
  color,
  isDark,
}: CircularProgressProps) => (
  <div className="flex flex-col items-center">
    <div className="relative w-16 h-16 mb-2">
      <svg
        className="w-16 h-16 transform -rotate-90"
        viewBox="0 0 64 64"
      >
        <circle
          cx="32"
          cy="32"
          r="28"
          fill="none"
          stroke={isDark ? "#334155" : "#e2e8f0"}
          strokeWidth="3"
        />
        <circle
          cx="32"
          cy="32"
          r="28"
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={`${percentage * 1.76} 176`}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span
          className={`text-sm font-light ${
            isDark ? "text-slate-300" : "text-slate-700"
          }`}
        >
          {percentage}%
        </span>
      </div>
    </div>
    <span
      className={`text-xs font-light ${
        isDark ? "text-slate-400" : "text-slate-500"
      }`}
    >
      {label}
    </span>
  </div>
);
