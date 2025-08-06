interface CardProps {
  children: React.ReactNode;
  isDark: boolean;
  className?: string;
}

export const Card = ({
  children,
  isDark,
  className = "",
}: CardProps) => (
  <div
    className={`backdrop-blur-sm rounded-2xl border ${
      isDark
        ? "bg-slate-900/60 border-slate-700/30"
        : "bg-slate-50/60 border-slate-200/30"
    } ${className}`}
  >
    {children}
  </div>
);
