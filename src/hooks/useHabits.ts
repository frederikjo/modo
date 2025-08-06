"use client";

import { useState, useEffect, useCallback } from "react";
import { Habit, NewHabit, Completions } from "@/types/habit";
import { getHabitService } from "@/services/HabitServiceFactory";
import { getStorageType } from "@/config/storage";

export const useHabits = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [completions, setCompletions] = useState<Completions>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [storageType, setStorageTypeState] = useState(
    getStorageType()
  );

  const service = getHabitService();

  // Initialize the service and load data
  const initialize = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      await service.initialize();

      // Load habits and completions
      const [habitsData, completionsData] = await Promise.all([
        service.getHabits(),
        service.getCompletions(),
      ]);

      setHabits(habitsData);
      setCompletions(completionsData);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An error occurred"
      );
      console.error("Error initializing habits:", err);
    } finally {
      setLoading(false);
    }
  }, [service]);

  // Load habits
  const loadHabits = useCallback(async () => {
    try {
      const habitsData = await service.getHabits();
      setHabits(habitsData);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load habits"
      );
    }
  }, [service]);

  // Load completions
  const loadCompletions = useCallback(
    async (startDate?: Date, endDate?: Date) => {
      try {
        const completionsData = await service.getCompletions(
          startDate,
          endDate
        );
        setCompletions(completionsData);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load completions"
        );
      }
    },
    [service]
  );

  // Add a new habit
  const addHabit = useCallback(
    async (newHabit: NewHabit): Promise<Habit | null> => {
      try {
        const habit = await service.addHabit(newHabit);
        setHabits((prev) => [...prev, habit]);
        return habit;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to add habit"
        );
        return null;
      }
    },
    [service]
  );

  // Update a habit
  const updateHabit = useCallback(
    async (id: number, updates: Partial<Habit>): Promise<boolean> => {
      try {
        const updatedHabit = await service.updateHabit(id, updates);
        setHabits((prev) =>
          prev.map((h) => (h.id === id ? updatedHabit : h))
        );
        return true;
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to update habit"
        );
        return false;
      }
    },
    [service]
  );

  // Delete a habit
  const deleteHabit = useCallback(
    async (id: number): Promise<boolean> => {
      try {
        await service.deleteHabit(id);
        setHabits((prev) => prev.filter((h) => h.id !== id));

        // Remove completions for this habit from local state
        setCompletions((prev) => {
          const updated = { ...prev };
          Object.keys(updated).forEach((date) => {
            delete updated[date][id];
          });
          return updated;
        });

        return true;
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to delete habit"
        );
        return false;
      }
    },
    [service]
  );

  // Toggle habit completion
  const toggleCompletion = useCallback(
    async (habitId: number, date: Date): Promise<boolean | null> => {
      try {
        const newStatus = await service.toggleCompletion(
          habitId,
          date
        );
        const dateKey = date.toISOString().split("T")[0];

        setCompletions((prev) => ({
          ...prev,
          [dateKey]: {
            ...prev[dateKey],
            [habitId]: newStatus,
          },
        }));

        return newStatus;
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to toggle completion"
        );
        return null;
      }
    },
    [service]
  );

  // Set habit completion
  const setCompletion = useCallback(
    async (
      habitId: number,
      date: Date,
      completed: boolean
    ): Promise<boolean> => {
      try {
        await service.setCompletion(habitId, date, completed);
        const dateKey = date.toISOString().split("T")[0];

        setCompletions((prev) => ({
          ...prev,
          [dateKey]: {
            ...prev[dateKey],
            [habitId]: completed,
          },
        }));

        return true;
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to set completion"
        );
        return false;
      }
    },
    [service]
  );

  // Switch storage type
  const switchStorageType = useCallback(
    async (newType: "localStorage" | "supabase") => {
      try {
        setLoading(true);
        localStorage.setItem("modo-storage-type", newType);
        setStorageTypeState(newType);

        // Reinitialize with new service
        await initialize();
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to switch storage type"
        );
        setLoading(false);
      }
    },
    [initialize]
  );

  // Helper functions
  const getCompletionPercentage = useCallback(
    (date: Date, activeHabits?: Habit[]): number => {
      const dateKey = date.toISOString().split("T")[0];
      const dayCompletions = completions[dateKey];

      if (!dayCompletions) return 0;

      const habitsToCheck = activeHabits || habits;
      if (habitsToCheck.length === 0) return 0;

      const completed = habitsToCheck.filter(
        (habit) => dayCompletions[habit.id]
      ).length;
      return Math.round((completed / habitsToCheck.length) * 100);
    },
    [completions, habits]
  );

  const isHabitActiveOnDate = useCallback(
    (habit: Habit, date: Date): boolean => {
      // For now, all daily habits are active every day
      // You can extend this logic for weekly/custom patterns
      return habit.recurrence === "daily";
    },
    []
  );

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Initialize on mount
  useEffect(() => {
    initialize();
  }, [initialize]);

  return {
    // State
    habits,
    completions,
    loading,
    error,
    storageType,

    // Actions
    addHabit,
    updateHabit,
    deleteHabit,
    toggleCompletion,
    setCompletion,
    loadHabits,
    loadCompletions,
    switchStorageType,
    clearError,

    // Helpers
    getCompletionPercentage,
    isHabitActiveOnDate,

    // Service info
    isConnected: service.isConnected(),
  };
};
