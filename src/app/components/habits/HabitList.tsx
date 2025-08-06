import React from "react";
import { Check, X } from "lucide-react";
import { Habit, Completions } from "@/types/habit";
import { Card } from "../ui/Card";

interface HabitListProps {
  selectedDate: Date;
  habits: Habit[];
  completions: Completions;
  isHabitActiveOnDate: (habit: Habit, date: Date) => boolean;
  toggleHabitCompletion: (habitId: number) => void;
  removeHabit: (habitId: number) => void;
  formatDate: (date: Date) => string;
  isDark: boolean;
}

export const HabitList: React.FC<HabitListProps> = ({
  selectedDate,
  habits,
  completions,
  isHabitActiveOnDate,
  toggleHabitCompletion,
  removeHabit,
  formatDate,
  isDark,
}) => {
  const selectedDateKey = formatDate(selectedDate);
  const todayHabits = habits.filter((habit) =>
    isHabitActiveOnDate(habit, selectedDate)
  );

  const formatSelectedDate = (date: Date): string => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <>
      {/* Selected Date Habits */}
      <Card isDark={isDark} className="p-6">
        <h3
          className={`text-lg font-light mb-4 ${
            isDark ? "text-slate-200" : "text-slate-800"
          }`}
        >
          {formatSelectedDate(selectedDate)}
        </h3>

        <div className="space-y-3">
          {todayHabits.map((habit) => {
            const isCompleted =
              completions[selectedDateKey]?.[habit.id] || false;
            return (
              <div
                key={habit.id}
                className={`flex items-center justify-between p-4 rounded-lg border transition-all ${
                  isCompleted
                    ? isDark
                      ? "bg-emerald-900/30 border-emerald-700/50"
                      : "bg-emerald-50 border-emerald-200"
                    : isDark
                    ? "bg-slate-800/40 border-slate-700/30 hover:bg-slate-700/40"
                    : "bg-slate-50/60 border-slate-200/30 hover:bg-slate-100/60"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: habit.color }}
                  />
                  <span
                    className={`font-light ${
                      isCompleted
                        ? `line-through ${
                            isDark
                              ? "text-slate-400"
                              : "text-slate-500"
                          }`
                        : isDark
                        ? "text-slate-200"
                        : "text-slate-800"
                    }`}
                  >
                    {habit.title}
                  </span>
                </div>
                <button
                  onClick={() => toggleHabitCompletion(habit.id)}
                  className={`p-2 rounded-full transition-all ${
                    isCompleted
                      ? isDark
                        ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                        : "bg-emerald-500 hover:bg-emerald-600 text-white"
                      : isDark
                      ? "bg-slate-600 hover:bg-slate-500 text-slate-300"
                      : "bg-slate-200 hover:bg-slate-300 text-slate-600"
                  }`}
                >
                  <Check size={14} />
                </button>
              </div>
            );
          })}

          {todayHabits.length === 0 && (
            <div className="text-center py-8">
              <p
                className={`font-light ${
                  isDark ? "text-slate-400" : "text-slate-500"
                }`}
              >
                No habits scheduled for this day
              </p>
            </div>
          )}
        </div>
      </Card>

      {/* All Habits Management */}
      <Card isDark={isDark} className="p-6">
        <h3
          className={`text-lg font-light mb-4 ${
            isDark ? "text-slate-200" : "text-slate-800"
          }`}
        >
          All Habits
        </h3>
        <div className="space-y-3">
          {habits.map((habit) => (
            <div
              key={habit.id}
              className={`flex items-center justify-between p-4 rounded-lg transition-colors ${
                isDark
                  ? "bg-slate-800/40 hover:bg-slate-700/40"
                  : "bg-slate-50/60 hover:bg-slate-100/60"
              }`}
            >
              <div className="flex items-center space-x-3">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: habit.color }}
                />
                <div>
                  <span
                    className={`font-light ${
                      isDark ? "text-slate-200" : "text-slate-800"
                    }`}
                  >
                    {habit.title}
                  </span>
                  <div
                    className={`text-xs font-light capitalize ${
                      isDark ? "text-slate-400" : "text-slate-500"
                    }`}
                  >
                    {habit.recurrence}
                  </div>
                </div>
              </div>
              <button
                onClick={() => removeHabit(habit.id)}
                className={`p-1.5 rounded-full transition-colors ${
                  isDark
                    ? "text-slate-400 hover:text-red-400 hover:bg-red-900/20"
                    : "text-slate-400 hover:text-red-500 hover:bg-red-50"
                }`}
              >
                <X size={14} />
              </button>
            </div>
          ))}

          {habits.length === 0 && (
            <div className="text-center py-8">
              <p
                className={`font-light ${
                  isDark ? "text-slate-400" : "text-slate-500"
                }`}
              >
                No habits yet. Add your first habit to get started!
              </p>
            </div>
          )}
        </div>
      </Card>
    </>
  );
};
