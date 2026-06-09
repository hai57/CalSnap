interface MacroRingProps {
  consumed: number;
  goal: number;
  label?: string;
}

export function MacroRing({ consumed, goal, label = "kcal" }: MacroRingProps) {
  const radius = 70;
  const stroke = 14;
  const circumference = 2 * Math.PI * radius;
  const ratio = goal > 0 ? Math.min(consumed / goal, 1) : 0;
  const offset = circumference * (1 - ratio);
  const remaining = Math.max(goal - consumed, 0);
  const over = consumed > goal && goal > 0;

  return (
    <div className="relative grid place-items-center">
      <svg width="180" height="180" viewBox="0 0 180 180" className="-rotate-90">
        <circle cx="90" cy="90" r={radius} fill="none" stroke="#e2e8f0" strokeWidth={stroke} />
        <circle
          cx="90"
          cy="90"
          r={radius}
          fill="none"
          stroke={over ? "#ef4444" : "#10b981"}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.6s ease" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-3xl font-bold tabular-nums">{Math.round(consumed)}</span>
        <span className="text-xs text-slate-500">
          / {Math.round(goal)} {label}
        </span>
        <span className={`mt-1 text-xs font-medium ${over ? "text-red-500" : "text-brand-600"}`}>
          {over ? `${Math.round(consumed - goal)} over` : `${Math.round(remaining)} left`}
        </span>
      </div>
    </div>
  );
}
