import { Card } from "../ui/Card";
import { CircularProgress } from "../ui/CircularProgress";

interface DailyGoalsWidgetProps {
  isDark: boolean;
}

export const DailyGoalsWidget = ({
  isDark,
}: DailyGoalsWidgetProps) => (
  <Card isDark={isDark} className="p-4">
    <h4
      className={`text-sm font-light mb-4 ${
        isDark ? "text-slate-200" : "text-slate-800"
      }`}
    >
      Todays Progress
    </h4>
    <div className="flex justify-between">
      <CircularProgress
        percentage={78}
        label="Steps"
        color="#64748b"
        isDark={isDark}
      />
      <CircularProgress
        percentage={62}
        label="Water"
        color="#94a3b8"
        isDark={isDark}
      />
      <CircularProgress
        percentage={94}
        label="Sleep"
        color="#475569"
        isDark={isDark}
      />
    </div>
  </Card>
);
