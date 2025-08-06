import { HabitDataService } from "./HabitDataService";
import { LocalStorageHabitService } from "./LocalStorageHabitService";
import { SupabaseHabitService } from "./SupabaseHabitService";
import { getStorageType } from "@/config/storage";

let serviceInstance: HabitDataService | null = null;

export const getHabitService = (): HabitDataService => {
  const storageType = getStorageType();

  // Create new instance if storage type changed or no instance exists
  if (
    !serviceInstance ||
    (storageType === "localStorage" &&
      !(serviceInstance instanceof LocalStorageHabitService)) ||
    (storageType === "supabase" &&
      !(serviceInstance instanceof SupabaseHabitService))
  ) {
    switch (storageType) {
      case "localStorage":
        serviceInstance = new LocalStorageHabitService();
        break;
      case "supabase":
        serviceInstance = new SupabaseHabitService();
        break;
      default:
        throw new Error(`Unknown storage type: ${storageType}`);
    }
  }

  return serviceInstance;
};

export const resetServiceInstance = (): void => {
  serviceInstance = null;
};
