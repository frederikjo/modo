interface DashboardLayoutProps {
  children: React.ReactNode;
  isDark: boolean;
}

export const DashboardLayout = ({
  children,
  isDark,
}: DashboardLayoutProps) => (
  <div
    className={`min-h-screen relative overflow-hidden ${
      isDark
        ? "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
        : "bg-gradient-to-br from-slate-100 via-blue-50 to-stone-50"
    }`}
  >
    {/* Background Elements */}
    <div className="absolute inset-0 opacity-20">
      <div
        className={`absolute top-10 left-10 w-32 h-32 rounded-full blur-2xl ${
          isDark ? "bg-slate-700" : "bg-slate-200"
        }`}
      ></div>
      <div
        className={`absolute top-20 right-20 w-24 h-24 rounded-full blur-xl ${
          isDark ? "bg-slate-600" : "bg-blue-100"
        }`}
      ></div>
      <div
        className={`absolute bottom-20 left-20 w-40 h-40 rounded-full blur-2xl ${
          isDark ? "bg-slate-800" : "bg-stone-100"
        }`}
      ></div>
      <div
        className={`absolute bottom-10 right-10 w-28 h-28 rounded-full blur-xl ${
          isDark ? "bg-slate-700" : "bg-slate-100"
        }`}
      ></div>
    </div>

    <div className="relative z-10">{children}</div>
  </div>
);
