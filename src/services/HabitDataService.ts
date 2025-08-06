import { Habit, NewHabit, Completions } from "@/types/habit";

export interface HabitDataService {
  // Habit CRUD operations
  getHabits(): Promise<Habit[]>;
  addHabit(habit: NewHabit): Promise<Habit>;
  updateHabit(id: number, updates: Partial<Habit>): Promise<Habit>;
  deleteHabit(id: number): Promise<void>;

  // Completion operations
  getCompletions(
    startDate?: Date,
    endDate?: Date
  ): Promise<Completions>;
  toggleCompletion(habitId: number, date: Date): Promise<boolean>;
  setCompletion(
    habitId: number,
    date: Date,
    completed: boolean
  ): Promise<void>;

  // Utility methods
  isConnected(): Promise<boolean>;
  initialize(): Promise<void>;
}
