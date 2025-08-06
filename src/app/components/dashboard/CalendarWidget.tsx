import { Calendar } from "lucide-react";
import { Card } from "../ui/Card";

interface CalendarWidgetProps {
  isDark: boolean;
}

export const CalendarWidget = ({ isDark }: CalendarWidgetProps) => (
  <Card isDark={isDark} className="p-4">
    <div className="flex items-center justify-between mb-4">
      <h4
        className={`text-sm font-light ${
          isDark ? "text-slate-200" : "text-slate-800"
        }`}
      >
        Habit Tracker
      </h4>
      <Calendar
        className={`w-4 h-4 ${
          isDark ? "text-slate-400" : "text-slate-400"
        }`}
      />
    </div>
    <div className="text-center">
      <div
        className={`text-3xl font-light mb-1 ${
          isDark ? "text-slate-200" : "text-slate-800"
        }`}
      >
        15
      </div>
      <div
        className={`text-xs font-light mb-3 ${
          isDark ? "text-slate-400" : "text-slate-500"
        }`}
      >
        March 2024
      </div>
      <div className="grid grid-cols-7 gap-1 text-xs">
        {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
          <div
            key={i}
            className={`p-1 font-light ${
              isDark ? "text-slate-500" : "text-slate-400"
            }`}
          >
            {day}
          </div>
        ))}
        {Array.from({ length: 28 }, (_, i) => (
          <div
            key={i}
            className={`p-1 rounded ${
              i === 14
                ? isDark
                  ? "bg-slate-500 text-white"
                  : "bg-slate-600 text-white"
                : i < 15
                ? isDark
                  ? "bg-slate-700 text-slate-300"
                  : "bg-slate-200 text-slate-600"
                : isDark
                ? "text-slate-400 hover:bg-slate-800"
                : "text-slate-500 hover:bg-slate-100"
            }`}
          >
            {i + 1}
          </div>
        ))}
      </div>
    </div>
  </Card>
);
