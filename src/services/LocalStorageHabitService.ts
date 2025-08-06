import { HabitDataService } from "./HabitDataService";
import { Habit, NewHabit, Completions } from "@/types/habit";
import { STORAGE_CONFIG } from "@/config/storage";

export class LocalStorageHabitService implements HabitDataService {
  private isClient = typeof window !== "undefined";

  async initialize(): Promise<void> {
    // Initialize with sample data if nothing exists
    if (
      this.isClient &&
      !localStorage.getItem(STORAGE_CONFIG.keys.habits)
    ) {
      const sampleHabits: Habit[] = [
        {
          id: 1,
          title: "Drink 8 glasses of water",
          recurrence: "daily",
          color: "#3b82f6",
          createdAt: new Date(),
        },
        {
          id: 2,
          title: "Exercise for 30 minutes",
          recurrence: "daily",
          color: "#10b981",
          createdAt: new Date(),
        },
        {
          id: 3,
          title: "Read for 20 minutes",
          recurrence: "daily",
          color: "#8b5cf6",
          createdAt: new Date(),
        },
        {
          id: 4,
          title: "Take vitamins",
          recurrence: "daily",
          color: "#f59e0b",
          createdAt: new Date(),
        },
      ];

      localStorage.setItem(
        STORAGE_CONFIG.keys.habits,
        JSON.stringify(sampleHabits)
      );

      // Generate sample completions
      const completions =
        this.generateSampleCompletions(sampleHabits);
      localStorage.setItem(
        STORAGE_CONFIG.keys.completions,
        JSON.stringify(completions)
      );
    }
  }

  private generateSampleCompletions(habits: Habit[]): Completions {
    const completions: Completions = {};
    const today = new Date();

    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateKey = date.toISOString().split("T")[0];

      completions[dateKey] = {};
      habits.forEach((habit) => {
        completions[dateKey][habit.id] = Math.random() > 0.3;
      });
    }

    return completions;
  }

  async getHabits(): Promise<Habit[]> {
    if (!this.isClient) return [];

    const stored = localStorage.getItem(STORAGE_CONFIG.keys.habits);
    if (!stored) return [];

    try {
      const habits = JSON.parse(stored);
      return habits.map((habit: any) => ({
        ...habit,
        createdAt: habit.createdAt
          ? new Date(habit.createdAt)
          : new Date(),
      }));
    } catch (error) {
      console.error("Error parsing habits from localStorage:", error);
      return [];
    }
  }

  async addHabit(newHabit: NewHabit): Promise<Habit> {
    if (!this.isClient) throw new Error("Not in client environment");

    const habits = await this.getHabits();
    const habit: Habit = {
      id: Date.now(),
      ...newHabit,
      createdAt: new Date(),
    };

    const updatedHabits = [...habits, habit];
    localStorage.setItem(
      STORAGE_CONFIG.keys.habits,
      JSON.stringify(updatedHabits)
    );

    return habit;
  }

  async updateHabit(
    id: number,
    updates: Partial<Habit>
  ): Promise<Habit> {
    if (!this.isClient) throw new Error("Not in client environment");

    const habits = await this.getHabits();
    const habitIndex = habits.findIndex((h) => h.id === id);

    if (habitIndex === -1) {
      throw new Error("Habit not found");
    }

    const updatedHabit = { ...habits[habitIndex], ...updates };
    habits[habitIndex] = updatedHabit;

    localStorage.setItem(
      STORAGE_CONFIG.keys.habits,
      JSON.stringify(habits)
    );
    return updatedHabit;
  }

  async deleteHabit(id: number): Promise<void> {
    if (!this.isClient) throw new Error("Not in client environment");

    const habits = await this.getHabits();
    const filteredHabits = habits.filter((h) => h.id !== id);

    localStorage.setItem(
      STORAGE_CONFIG.keys.habits,
      JSON.stringify(filteredHabits)
    );

    // Also remove completions for this habit
    const completions = await this.getCompletions();
    Object.keys(completions).forEach((date) => {
      delete completions[date][id];
    });
    localStorage.setItem(
      STORAGE_CONFIG.keys.completions,
      JSON.stringify(completions)
    );
  }

  async getCompletions(
    startDate?: Date,
    endDate?: Date
  ): Promise<Completions> {
    if (!this.isClient) return {};

    const stored = localStorage.getItem(
      STORAGE_CONFIG.keys.completions
    );
    if (!stored) return {};

    try {
      const allCompletions: Completions = JSON.parse(stored);

      if (!startDate && !endDate) {
        return allCompletions;
      }

      // Filter by date range if provided
      const filtered: Completions = {};
      Object.keys(allCompletions).forEach((dateKey) => {
        const date = new Date(dateKey);
        if (startDate && date < startDate) return;
        if (endDate && date > endDate) return;
        filtered[dateKey] = allCompletions[dateKey];
      });

      return filtered;
    } catch (error) {
      console.error(
        "Error parsing completions from localStorage:",
        error
      );
      return {};
    }
  }

  async toggleCompletion(
    habitId: number,
    date: Date
  ): Promise<boolean> {
    const dateKey = date.toISOString().split("T")[0];
    const completions = await this.getCompletions();

    if (!completions[dateKey]) {
      completions[dateKey] = {};
    }

    const currentStatus = completions[dateKey][habitId] || false;
    const newStatus = !currentStatus;

    completions[dateKey][habitId] = newStatus;

    if (this.isClient) {
      localStorage.setItem(
        STORAGE_CONFIG.keys.completions,
        JSON.stringify(completions)
      );
    }

    return newStatus;
  }

  async setCompletion(
    habitId: number,
    date: Date,
    completed: boolean
  ): Promise<void> {
    const dateKey = date.toISOString().split("T")[0];
    const completions = await this.getCompletions();

    if (!completions[dateKey]) {
      completions[dateKey] = {};
    }

    completions[dateKey][habitId] = completed;

    if (this.isClient) {
      localStorage.setItem(
        STORAGE_CONFIG.keys.completions,
        JSON.stringify(completions)
      );
    }
  }

  async isConnected(): Promise<boolean> {
    return this.isClient;
  }
}
