import React, { useState } from "react";
import { X } from "lucide-react";
import { NewHabit } from "@/types/habit";

interface AddHabitModalProps {
  onClose: () => void;
  onAddHabit: (habit: NewHabit) => void;
  isDark: boolean;
}

const predefinedColors = [
  "#3b82f6",
  "#10b981",
  "#8b5cf6",
  "#f59e0b",
  "#ef4444",
  "#06b6d4",
  "#84cc16",
  "#f97316",
  "#ec4899",
  "#6366f1",
  "#14b8a6",
  "#eab308",
];

export const AddHabitModal: React.FC<AddHabitModalProps> = ({
  onClose,
  onAddHabit,
  isDark,
}) => {
  const [newHabit, setNewHabit] = useState<NewHabit>({
    title: "",
    recurrence: "daily",
    color: predefinedColors[0],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newHabit.title.trim()) {
      onAddHabit(newHabit);
      setNewHabit({
        title: "",
        recurrence: "daily",
        color: predefinedColors[0],
      });
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={handleBackdropClick}
    >
      <div
        className={`backdrop-blur-sm rounded-2xl border shadow-2xl p-6 w-full max-w-md ${
          isDark
            ? "bg-slate-900/90 border-slate-700/30"
            : "bg-slate-50/90 border-slate-200/30"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3
            className={`text-lg font-light ${
              isDark ? "text-slate-200" : "text-slate-800"
            }`}
          >
            Add New Habit
          </h3>
          <button
            onClick={onClose}
            className={`p-2 rounded-full transition-colors ${
              isDark
                ? "hover:bg-slate-700 text-slate-400 hover:text-slate-200"
                : "hover:bg-slate-200 text-slate-400 hover:text-slate-600"
            }`}
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Habit Title */}
          <div>
            <label
              className={`block text-sm font-light mb-2 ${
                isDark ? "text-slate-300" : "text-slate-700"
              }`}
            >
              Habit Title
            </label>
            <input
              type="text"
              value={newHabit.title}
              onChange={(e) =>
                setNewHabit({ ...newHabit, title: e.target.value })
              }
              className={`w-full px-4 py-3 rounded-lg border font-light transition-colors ${
                isDark
                  ? "bg-slate-800/60 border-slate-600/40 text-slate-200 placeholder-slate-400 focus:border-slate-500"
                  : "bg-white/60 border-slate-200 text-slate-800 placeholder-slate-500 focus:border-slate-400"
              } focus:outline-none focus:ring-0`}
              placeholder="e.g., Drink 8 glasses of water"
              required
            />
          </div>

          {/* Recurrence */}
          <div>
            <label
              className={`block text-sm font-light mb-2 ${
                isDark ? "text-slate-300" : "text-slate-700"
              }`}
            >
              Recurrence
            </label>
            <select
              value={newHabit.recurrence}
              onChange={(e) =>
                setNewHabit({
                  ...newHabit,
                  recurrence: e.target.value as
                    | "daily"
                    | "weekly"
                    | "custom",
                })
              }
              className={`w-full px-4 py-3 rounded-lg border font-light transition-colors ${
                isDark
                  ? "bg-slate-800/60 border-slate-600/40 text-slate-200 focus:border-slate-500"
                  : "bg-white/60 border-slate-200 text-slate-800 focus:border-slate-400"
              } focus:outline-none focus:ring-0`}
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="custom">Custom</option>
            </select>
          </div>

          {/* Color Selection */}
          <div>
            <label
              className={`block text-sm font-light mb-3 ${
                isDark ? "text-slate-300" : "text-slate-700"
              }`}
            >
              Color
            </label>
            <div className="grid grid-cols-6 gap-3">
              {predefinedColors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setNewHabit({ ...newHabit, color })}
                  className={`w-8 h-8 rounded-full border-2 transition-all transform hover:scale-110 ${
                    newHabit.color === color
                      ? isDark
                        ? "border-slate-300 ring-2 ring-slate-400 ring-offset-2 ring-offset-slate-900"
                        : "border-slate-600 ring-2 ring-slate-400 ring-offset-2 ring-offset-slate-50"
                      : isDark
                      ? "border-slate-600 hover:border-slate-500"
                      : "border-slate-300 hover:border-slate-400"
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className={`flex-1 px-4 py-3 rounded-lg font-light transition-colors ${
                isDark
                  ? "border border-slate-600 text-slate-300 hover:bg-slate-700"
                  : "border border-slate-300 text-slate-700 hover:bg-slate-100"
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`flex-1 px-4 py-3 rounded-lg font-light transition-colors ${
                isDark
                  ? "bg-slate-700 hover:bg-slate-600 text-slate-200 border border-slate-600"
                  : "bg-slate-800 hover:bg-slate-700 text-white border border-slate-800"
              }`}
            >
              Add Habit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
