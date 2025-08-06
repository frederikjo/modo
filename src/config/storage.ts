export type StorageType = "localStorage" | "supabase";

export const STORAGE_CONFIG = {
  // Change this to 'supabase' when you upgrade your plan
  type: "localStorage" as StorageType,

  // Storage keys for localStorage
  keys: {
    habits: "modo-habits",
    completions: "modo-completions",
  },
};

export const setStorageType = (type: StorageType) => {
  // You could also store this in localStorage for persistence
  localStorage.setItem("modo-storage-type", type);
};

export const getStorageType = (): StorageType => {
  if (typeof window === "undefined") return STORAGE_CONFIG.type;

  const stored = localStorage.getItem("modo-storage-type");
  return (stored as StorageType) || STORAGE_CONFIG.type;
};
