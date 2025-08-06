interface LogoProps {
  isDark: boolean;
}

export const Logo = ({ isDark }: LogoProps) => (
  <div className="flex items-center space-x-3">
    <div className="relative">
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        className={isDark ? "text-slate-300" : "text-slate-700"}
      >
        <circle
          cx="16"
          cy="16"
          r="14"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          opacity="0.3"
        />
        <circle
          cx="16"
          cy="16"
          r="8"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <circle cx="16" cy="16" r="2" fill="currentColor" />
      </svg>
    </div>
    <div
      className={`text-lg font-light tracking-wide ${
        isDark ? "text-slate-200" : "text-slate-800"
      }`}
    >
      modo
    </div>
  </div>
);
