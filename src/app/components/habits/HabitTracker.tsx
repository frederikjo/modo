"use client";

import React, { useState } from "react";
import { Calendar as CalendarIcon, Plus } from "lucide-react";
import { Habit, Completions, NewHabit } from "@/types/habit";
import { HabitCalendar } from "./HabitCalendar";
import { HabitList } from "./HabitList";
import { Card } from "../ui/Card";
import { AddHabitModal } from "./AddHabitListModal";

interface HabitTrackerProps {
  isDark: boolean;
}

const initialHabits: Habit[] = [
  {
    id: 1,
    title: "Drink 8 glasses of water",
    recurrence: "daily",
    color: "#3b82f6",
  },
  {
    id: 2,
    title: "Exercise for 30 minutes",
    recurrence: "daily",
    color: "#10b981",
  },
  {
    id: 3,
    title: "Read for 20 minutes",
    recurrence: "daily",
    color: "#8b5cf6",
  },
  {
    id: 4,
    title: "Take vitamins",
    recurrence: "daily",
    color: "#f59e0b",
  },
];

const generateCompletions = (): Completions => {
  const completions: Completions = {};
  const today = new Date();

  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateKey = date.toISOString().split("T")[0];

    completions[dateKey] = {
      1: Math.random() > 0.3,
      2: Math.random() > 0.4,
      3: Math.random() > 0.5,
      4: Math.random() > 0.2,
    };
  }

  return completions;
};

export const HabitTracker: React.FC<HabitTrackerProps> = ({
  isDark,
}) => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [habits, setHabits] = useState<Habit[]>(initialHabits);
  const [completions, setCompletions] = useState<Completions>(
    generateCompletions()
  );
  const [showAddHabit, setShowAddHabit] = useState<boolean>(false);

  const formatDate = (date: Date): string => {
    return date.toISOString().split("T")[0];
  };

  const getCompletionPercentage = (date: Date): number => {
    const dateKey = formatDate(date);
    const dayCompletions = completions[dateKey];

    if (!dayCompletions) return 0;

    const activeHabits = habits.filter((habit) =>
      isHabitActiveOnDate(habit, date)
    );
    if (activeHabits.length === 0) return 0;

    const completed = activeHabits.filter(
      (habit) => dayCompletions[habit.id]
    ).length;
    return Math.round((completed / activeHabits.length) * 100);
  };

  const isHabitActiveOnDate = (habit: Habit, date: Date): boolean => {
    // For now, all daily habits are active every day
    return habit.recurrence === "daily";
  };

  const toggleHabitCompletion = (habitId: number): void => {
    const dateKey = formatDate(selectedDate);
    setCompletions((prev) => ({
      ...prev,
      [dateKey]: {
        ...prev[dateKey],
        [habitId]: !prev[dateKey]?.[habitId],
      },
    }));
  };

  const addHabit = (newHabit: NewHabit): void => {
    const habit: Habit = {
      id: Date.now(),
      ...newHabit,
      createdAt: new Date(),
    };
    setHabits([...habits, habit]);
    setShowAddHabit(false);
  };

  const removeHabit = (habitId: number): void => {
    setHabits(habits.filter((h) => h.id !== habitId));
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
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
            <h1
              className={`text-2xl font-light ${
                isDark ? "text-slate-200" : "text-slate-800"
              }`}
            >
              Habit Tracker
            </h1>
          </div>
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
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <HabitCalendar
            currentDate={currentDate}
            selectedDate={selectedDate}
            setCurrentDate={setCurrentDate}
            setSelectedDate={setSelectedDate}
            getCompletionPercentage={getCompletionPercentage}
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
            toggleHabitCompletion={toggleHabitCompletion}
            removeHabit={removeHabit}
            formatDate={formatDate}
            isDark={isDark}
          />
        </div>
      </div>

      {/* Add Habit Modal */}
      {showAddHabit && (
        <AddHabitModal
          onClose={() => setShowAddHabit(false)}
          onAddHabit={addHabit}
          isDark={isDark}
        />
      )}
    </div>
  );
};
