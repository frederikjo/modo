export interface Habit {
  id: number;
  title: string;
  recurrence: "daily" | "weekly" | "custom";
  color: string;
  createdAt?: Date;
}

export interface HabitCompletion {
  habitId: number;
  date: string; // ISO date string (YYYY-MM-DD)
  completed: boolean;
}

export interface Completions {
  [date: string]: {
    [habitId: number]: boolean;
  };
}

export interface NewHabit {
  title: string;
  recurrence: "daily" | "weekly" | "custom";
  color: string;
}

export interface CalendarDay {
  date: Date;
  percentage: number;
  isSelected: boolean;
  isToday: boolean;
}
