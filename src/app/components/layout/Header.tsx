import { Search, Bell } from "lucide-react";
import { Logo } from "../ui/Logo";
import { ThemeToggle } from "../ui/ThemeToggle";

interface HeaderProps {
  isDark: boolean;
  toggleTheme: () => void;
}

export const Header = ({ isDark, toggleTheme }: HeaderProps) => (
  <div
    className={`flex items-center justify-between p-4 backdrop-blur-sm border-b ${
      isDark
        ? "bg-slate-900/80 border-slate-700/30"
        : "bg-slate-50/80 border-slate-200/30"
    }`}
  >
    <div className="flex items-center space-x-8">
      <Logo isDark={isDark} />
      <nav className="flex space-x-6">
        <a
          href="#"
          className={`text-sm font-light hover:opacity-80 ${
            isDark
              ? "text-slate-400 hover:text-slate-200"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          Dashboard
        </a>
        <a
          href="#"
          className={`text-sm font-normal ${
            isDark ? "text-slate-200" : "text-slate-800"
          }`}
        >
          Wellness
        </a>
        <a
          href="#"
          className={`text-sm font-light hover:opacity-80 ${
            isDark
              ? "text-slate-400 hover:text-slate-200"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          Goals
        </a>
        <a
          href="#"
          className={`text-sm font-light hover:opacity-80 ${
            isDark
              ? "text-slate-400 hover:text-slate-200"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          Profile
        </a>
      </nav>
    </div>
    <div className="flex items-center space-x-4">
      <Search
        className={`w-5 h-5 ${
          isDark ? "text-slate-400" : "text-slate-400"
        }`}
      />
      <Bell
        className={`w-5 h-5 ${
          isDark ? "text-slate-400" : "text-slate-400"
        }`}
      />
      <ThemeToggle isDark={isDark} toggleTheme={toggleTheme} />
      <div
        className={`w-8 h-8 rounded-full ${
          isDark ? "bg-slate-600" : "bg-slate-300"
        }`}
      ></div>
    </div>
  </div>
);
