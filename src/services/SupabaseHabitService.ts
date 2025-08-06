import { HabitDataService } from "./HabitDataService";
import { Habit, NewHabit, Completions } from "@/types/habit";
import { supabase } from "@/lib/supabase";

export class SupabaseHabitService implements HabitDataService {
  private userId: string | null = null;

  async initialize(): Promise<void> {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    this.userId = session?.user?.id || null;

    if (!this.userId) {
      throw new Error("User not authenticated");
    }
  }

  private ensureAuthenticated(): void {
    if (!this.userId) {
      throw new Error(
        "User not authenticated. Call initialize() first."
      );
    }
  }

  async getHabits(): Promise<Habit[]> {
    this.ensureAuthenticated();

    const { data, error } = await supabase
      .from("habits")
      .select("*")
      .eq("user_id", this.userId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching habits:", error);
      throw new Error("Failed to fetch habits");
    }

    return data.map((habit) => ({
      id: habit.id,
      title: habit.title,
      recurrence: habit.recurrence as "daily" | "weekly" | "custom",
      color: habit.color,
      createdAt: new Date(habit.created_at),
    }));
  }

  async addHabit(newHabit: NewHabit): Promise<Habit> {
    this.ensureAuthenticated();

    const { data, error } = await supabase
      .from("habits")
      .insert([
        {
          user_id: this.userId,
          title: newHabit.title,
          recurrence: newHabit.recurrence,
          color: newHabit.color,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Error adding habit:", error);
      throw new Error("Failed to add habit");
    }

    return {
      id: data.id,
      title: data.title,
      recurrence: data.recurrence as "daily" | "weekly" | "custom",
      color: data.color,
      createdAt: new Date(data.created_at),
    };
  }

  async updateHabit(
    id: number,
    updates: Partial<Habit>
  ): Promise<Habit> {
    this.ensureAuthenticated();

    const updateData: any = {};
    if (updates.title) updateData.title = updates.title;
    if (updates.recurrence)
      updateData.recurrence = updates.recurrence;
    if (updates.color) updateData.color = updates.color;

    const { data, error } = await supabase
      .from("habits")
      .update(updateData)
      .eq("id", id)
      .eq("user_id", this.userId)
      .select()
      .single();

    if (error) {
      console.error("Error updating habit:", error);
      throw new Error("Failed to update habit");
    }

    return {
      id: data.id,
      title: data.title,
      recurrence: data.recurrence as "daily" | "weekly" | "custom",
      color: data.color,
      createdAt: new Date(data.created_at),
    };
  }

  async deleteHabit(id: number): Promise<void> {
    this.ensureAuthenticated();

    const { error } = await supabase
      .from("habits")
      .delete()
      .eq("id", id)
      .eq("user_id", this.userId);

    if (error) {
      console.error("Error deleting habit:", error);
      throw new Error("Failed to delete habit");
    }
  }

  async getCompletions(
    startDate?: Date,
    endDate?: Date
  ): Promise<Completions> {
    this.ensureAuthenticated();

    let query = supabase
      .from("habit_completions")
      .select("habit_id, completion_date, completed")
      .eq("user_id", this.userId);

    if (startDate) {
      query = query.gte(
        "completion_date",
        startDate.toISOString().split("T")[0]
      );
    }

    if (endDate) {
      query = query.lte(
        "completion_date",
        endDate.toISOString().split("T")[0]
      );
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching completions:", error);
      throw new Error("Failed to fetch completions");
    }

    // Convert to our Completions format
    const completions: Completions = {};
    data.forEach((completion) => {
      const dateKey = completion.completion_date;
      if (!completions[dateKey]) {
        completions[dateKey] = {};
      }
      completions[dateKey][completion.habit_id] =
        completion.completed;
    });

    return completions;
  }

  async toggleCompletion(
    habitId: number,
    date: Date
  ): Promise<boolean> {
    this.ensureAuthenticated();

    const dateKey = date.toISOString().split("T")[0];

    // First, check if a completion already exists
    const { data: existing } = await supabase
      .from("habit_completions")
      .select("completed")
      .eq("user_id", this.userId)
      .eq("habit_id", habitId)
      .eq("completion_date", dateKey)
      .single();

    const newStatus = !existing?.completed;

    if (existing) {
      // Update existing completion
      const { error } = await supabase
        .from("habit_completions")
        .update({ completed: newStatus })
        .eq("user_id", this.userId)
        .eq("habit_id", habitId)
        .eq("completion_date", dateKey);

      if (error) {
        console.error("Error updating completion:", error);
        throw new Error("Failed to update completion");
      }
    } else {
      // Create new completion
      const { error } = await supabase
        .from("habit_completions")
        .insert([
          {
            user_id: this.userId,
            habit_id: habitId,
            completion_date: dateKey,
            completed: newStatus,
          },
        ]);

      if (error) {
        console.error("Error creating completion:", error);
        throw new Error("Failed to create completion");
      }
    }

    return newStatus;
  }

  async setCompletion(
    habitId: number,
    date: Date,
    completed: boolean
  ): Promise<void> {
    this.ensureAuthenticated();

    const dateKey = date.toISOString().split("T")[0];

    const { error } = await supabase.from("habit_completions").upsert(
      [
        {
          user_id: this.userId,
          habit_id: habitId,
          completion_date: dateKey,
          completed: completed,
        },
      ],
      {
        onConflict: "user_id,habit_id,completion_date",
      }
    );

    if (error) {
      console.error("Error setting completion:", error);
      throw new Error("Failed to set completion");
    }
  }

  async isConnected(): Promise<boolean> {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      return !!session?.user;
    } catch {
      return false;
    }
  }
}
