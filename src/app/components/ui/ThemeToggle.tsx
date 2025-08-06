import { Moon } from "lucide-react";

interface ThemeToggleProps {
  isDark: boolean;
  toggleTheme: () => void;
}

export const ThemeToggle = ({
  isDark,
  toggleTheme,
}: ThemeToggleProps) => (
  <button
    onClick={toggleTheme}
    className={`p-2 rounded-full transition-colors ${
      isDark
        ? "bg-slate-700 hover:bg-slate-600"
        : "bg-slate-200 hover:bg-slate-300"
    }`}
  >
    {isDark ? (
      <Moon className="w-4 h-4" />
    ) : (
      <div className="w-4 h-4 bg-yellow-400 rounded-full" />
    )}
  </button>
);
