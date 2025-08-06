"use client";

import React, { useState } from "react";
import {
  Calendar as CalendarIcon,
  Plus,
  Settings,
  AlertCircle,
} from "lucide-react";
import { useHabits } from "@/hooks/useHabits";
import { HabitCalendar } from "./HabitCalendar";
import { HabitList } from "./HabitList";
import { StorageSettings } from "../settings/StorageSettings";
import { Card } from "../ui/Card";
import { AddHabitModal } from "./AddHabitListModal";

interface HabitTrackerProps {
  isDark: boolean;
}

export const HabitTracker: React.FC<HabitTrackerProps> = ({
  isDark,
}) => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showAddHabit, setShowAddHabit] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);

  const {
    habits,
    completions,
    loading,
    error,
    storageType,
    addHabit,
    deleteHabit,
    toggleCompletion,
    getCompletionPercentage,
    isHabitActiveOnDate,
    switchStorageType,
    clearError,
  } = useHabits();

  const handleAddHabit = async (newHabit: {
    title: string;
    recurrence: "daily" | "weekly" | "custom";
    color: string;
  }) => {
    const result = await addHabit(newHabit);
    if (result) {
      setShowAddHabit(false);
    }
  };

  const handleRemoveHabit = async (habitId: number) => {
    await deleteHabit(habitId);
  };

  const handleToggleCompletion = async (habitId: number) => {
    await toggleCompletion(habitId, selectedDate);
  };

  const formatDate = (date: Date): string => {
    return date.toISOString().split("T")[0];
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <Card isDark={isDark} className="p-12">
          <div className="text-center">
            <div
              className={`text-lg font-light ${
                isDark ? "text-slate-200" : "text-slate-800"
              }`}
            >
              Loading your habits...
            </div>
            <div
              className={`text-sm font-light mt-2 ${
                isDark ? "text-slate-400" : "text-slate-500"
              }`}
            >
              Using{" "}
              {storageType === "localStorage"
                ? "Local Storage"
                : "Supabase Database"}
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Error Display */}
      {error && (
        <Card
          isDark={isDark}
          className="p-4 mb-6 border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20"
        >
          <div className="flex items-start space-x-3">
            <AlertCircle
              className="text-red-500 flex-shrink-0 mt-0.5"
              size={20}
            />
            <div className="flex-1">
              <div
                className={`text-sm font-medium ${
                  isDark ? "text-red-200" : "text-red-800"
                }`}
              >
                Error
              </div>
              <div
                className={`text-sm font-light ${
                  isDark ? "text-red-300" : "text-red-700"
                }`}
              >
                {error}
              </div>
              <button
                onClick={clearError}
                className={`text-xs underline mt-1 ${
                  isDark
                    ? "text-red-400 hover:text-red-300"
                    : "text-red-600 hover:text-red-500"
                }`}
              >
                Dismiss
              </button>
            </div>
          </div>
        </Card>
      )}

      {/* Header */}
      <Card isDark={isDark} className="p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <CalendarIcon
              className={`${
                isDark ? "text-slate-300" : "text-slate-600"
              }`}
              size={24}
            />
            <div>
              <h1
                className={`text-2xl font-light ${
                  isDark ? "text-slate-200" : "text-slate-800"
                }`}
              >
                Habit Tracker
              </h1>
              <div
                className={`text-xs font-light ${
                  isDark ? "text-slate-400" : "text-slate-500"
                }`}
              >
                Using{" "}
                {storageType === "localStorage"
                  ? "Local Storage"
                  : "Supabase Database"}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowSettings(true)}
              className={`p-2 rounded-lg transition-all ${
                isDark
                  ? "bg-slate-700 hover:bg-slate-600 text-slate-300 border border-slate-600"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200"
              }`}
            >
              <Settings size={16} />
            </button>
            <button
              onClick={() => setShowAddHabit(true)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                isDark
                  ? "bg-slate-700 hover:bg-slate-600 text-slate-200 border border-slate-600"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200"
              }`}
            >
              <Plus size={16} />
              <span className="font-light">Add Habit</span>
            </button>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <HabitCalendar
            currentDate={currentDate}
            selectedDate={selectedDate}
            setCurrentDate={setCurrentDate}
            setSelectedDate={setSelectedDate}
            getCompletionPercentage={(date) =>
              getCompletionPercentage(date, habits)
            }
            formatDate={formatDate}
            isDark={isDark}
          />
        </div>

        {/* Habits Panel */}
        <div className="space-y-6">
          <HabitList
            selectedDate={selectedDate}
            habits={habits}
            completions={completions}
            isHabitActiveOnDate={isHabitActiveOnDate}
            toggleHabitCompletion={handleToggleCompletion}
            removeHabit={handleRemoveHabit}
            formatDate={formatDate}
            isDark={isDark}
          />
        </div>
      </div>

      {/* Add Habit Modal */}
      {showAddHabit && (
        <AddHabitModal
          onClose={() => setShowAddHabit(false)}
          onAddHabit={handleAddHabit}
          isDark={isDark}
        />
      )}

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-2xl">
            <StorageSettings
              isDark={isDark}
              currentType={storageType}
              onStorageTypeChange={switchStorageType}
              isLoading={loading}
            />
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setShowSettings(false)}
                className={`px-4 py-2 rounded-lg font-light transition-colors ${
                  isDark
                    ? "bg-slate-700 hover:bg-slate-600 text-slate-200"
                    : "bg-slate-800 hover:bg-slate-700 text-white"
                }`}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
