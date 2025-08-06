import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Card } from "../ui/Card";

interface HabitCalendarProps {
  currentDate: Date;
  selectedDate: Date;
  setCurrentDate: (date: Date) => void;
  setSelectedDate: (date: Date) => void;
  getCompletionPercentage: (date: Date) => number;
  formatDate: (date: Date) => string;
  isDark: boolean;
}

export const HabitCalendar: React.FC<HabitCalendarProps> = ({
  currentDate,
  selectedDate,
  setCurrentDate,
  setSelectedDate,
  getCompletionPercentage,
  formatDate,
  isDark,
}) => {
  const getDaysInMonth = (date: Date): (Date | null)[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: (Date | null)[] = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const getDateColor = (percentage: number): string => {
    if (percentage === 100)
      return isDark ? "bg-emerald-600" : "bg-emerald-500";
    if (percentage >= 75)
      return isDark ? "bg-orange-500" : "bg-orange-400";
    if (percentage >= 50)
      return isDark ? "bg-yellow-500" : "bg-yellow-400";
    if (percentage >= 25) return isDark ? "bg-red-500" : "bg-red-400";
    return isDark ? "bg-slate-700" : "bg-slate-200";
  };

  const days = getDaysInMonth(currentDate);
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const dayNames = ["S", "M", "T", "W", "T", "F", "S"];

  const navigateMonth = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);
    if (direction === "prev") {
      newDate.setMonth(currentDate.getMonth() - 1);
    } else {
      newDate.setMonth(currentDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
  };

  return (
    <Card isDark={isDark} className="p-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6">
        <h2
          className={`text-xl font-light ${
            isDark ? "text-slate-200" : "text-slate-800"
          }`}
        >
          {monthNames[currentDate.getMonth()]}{" "}
          {currentDate.getFullYear()}
        </h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => navigateMonth("prev")}
            className={`p-2 rounded-lg transition-colors ${
              isDark
                ? "hover:bg-slate-700 text-slate-400 hover:text-slate-200"
                : "hover:bg-slate-100 text-slate-500 hover:text-slate-700"
            }`}
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={goToToday}
            className={`px-3 py-1.5 text-sm rounded-lg transition-colors font-light ${
              isDark
                ? "bg-slate-700 hover:bg-slate-600 text-slate-200"
                : "bg-slate-100 hover:bg-slate-200 text-slate-700"
            }`}
          >
            Today
          </button>
          <button
            onClick={() => navigateMonth("next")}
            className={`p-2 rounded-lg transition-colors ${
              isDark
                ? "hover:bg-slate-700 text-slate-400 hover:text-slate-200"
                : "hover:bg-slate-100 text-slate-500 hover:text-slate-700"
            }`}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1 mb-3">
        {dayNames.map((day) => (
          <div
            key={day}
            className={`text-center text-sm font-light py-2 ${
              isDark ? "text-slate-400" : "text-slate-500"
            }`}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => {
          if (!day) {
            return <div key={index} className="p-3"></div>;
          }

          const percentage = getCompletionPercentage(day);
          const isSelected =
            formatDate(day) === formatDate(selectedDate);
          const isToday = formatDate(day) === formatDate(new Date());

          return (
            <button
              key={index}
              onClick={() => setSelectedDate(day)}
              className={`
                relative p-3 rounded-lg text-center font-light transition-all hover:scale-105
                ${
                  isSelected
                    ? isDark
                      ? "ring-2 ring-slate-400 ring-offset-2 ring-offset-slate-900"
                      : "ring-2 ring-slate-500 ring-offset-2 ring-offset-slate-50"
                    : ""
                }
                ${isToday ? "font-medium" : ""}
                ${getDateColor(percentage)} 
                ${
                  percentage > 50
                    ? "text-white"
                    : isDark
                    ? "text-slate-200"
                    : "text-slate-800"
                }
              `}
            >
              <div className="text-sm">{day.getDate()}</div>
              {percentage > 0 && (
                <div className="text-xs mt-1 opacity-90">
                  {percentage}%
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center space-x-4 mt-6 pt-4 border-t border-opacity-20 border-slate-500">
        <div className="flex items-center space-x-1">
          <div
            className={`w-3 h-3 rounded ${
              isDark ? "bg-slate-700" : "bg-slate-200"
            }`}
          ></div>
          <span
            className={`text-xs font-light ${
              isDark ? "text-slate-400" : "text-slate-500"
            }`}
          >
            0%
          </span>
        </div>
        <div className="flex items-center space-x-1">
          <div
            className={`w-3 h-3 rounded ${
              isDark ? "bg-red-500" : "bg-red-400"
            }`}
          ></div>
          <span
            className={`text-xs font-light ${
              isDark ? "text-slate-400" : "text-slate-500"
            }`}
          >
            25%
          </span>
        </div>
        <div className="flex items-center space-x-1">
          <div
            className={`w-3 h-3 rounded ${
              isDark ? "bg-yellow-500" : "bg-yellow-400"
            }`}
          ></div>
          <span
            className={`text-xs font-light ${
              isDark ? "text-slate-400" : "text-slate-500"
            }`}
          >
            50%
          </span>
        </div>
        <div className="flex items-center space-x-1">
          <div
            className={`w-3 h-3 rounded ${
              isDark ? "bg-orange-500" : "bg-orange-400"
            }`}
          ></div>
          <span
            className={`text-xs font-light ${
              isDark ? "text-slate-400" : "text-slate-500"
            }`}
          >
            75%
          </span>
        </div>
        <div className="flex items-center space-x-1">
          <div
            className={`w-3 h-3 rounded ${
              isDark ? "bg-emerald-600" : "bg-emerald-500"
            }`}
          ></div>
          <span
            className={`text-xs font-light ${
              isDark ? "text-slate-400" : "text-slate-500"
            }`}
          >
            100%
          </span>
        </div>
      </div>
    </Card>
  );
};
