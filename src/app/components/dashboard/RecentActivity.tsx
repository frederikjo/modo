import { Card } from "../ui/Card";

interface RecentActivityProps {
  isDark: boolean;
}

export const RecentActivity = ({ isDark }: RecentActivityProps) => {
  const activities = [
    {
      time: "2m ago",
      action: "Completed morning workout",
      color: isDark ? "bg-slate-500" : "bg-slate-600",
    },
    {
      time: "5m ago",
      action: "Logged 8 glasses of water",
      color: isDark ? "bg-slate-400" : "bg-slate-500",
    },
    {
      time: "12m ago",
      action: "Meditation session finished",
      color: isDark ? "bg-slate-600" : "bg-slate-400",
    },
    {
      time: "25m ago",
      action: "Healthy meal logged",
      color: isDark ? "bg-slate-300" : "bg-slate-700",
    },
  ];

  return (
    <Card isDark={isDark} className="p-4">
      <h4
        className={`text-sm font-light mb-4 ${
          isDark ? "text-slate-200" : "text-slate-800"
        }`}
      >
        Recent Activities
      </h4>
      <div className="space-y-3">
        {activities.map((item, i) => (
          <div key={i} className="flex items-center space-x-3">
            <div
              className={`w-2 h-2 rounded-full ${item.color}`}
            ></div>
            <div className="flex-1">
              <div
                className={`text-xs font-light ${
                  isDark ? "text-slate-200" : "text-slate-800"
                }`}
              >
                {item.action}
              </div>
              <div
                className={`text-xs font-light ${
                  isDark ? "text-slate-400" : "text-slate-500"
                }`}
              >
                {item.time}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
