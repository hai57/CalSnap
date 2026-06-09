import { useQueries } from "@tanstack/react-query";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { DailySummary } from "@shared/types";

import { api } from "../lib/api";
import { formatDayLabel, toDateStr } from "../lib/date";

const DAYS = 7;

function lastNDays(n: number): string[] {
  const out: string[] = [];
  const now = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    out.push(toDateStr(d));
  }
  return out;
}

export function History() {
  const days = lastNDays(DAYS);

  const results = useQueries({
    queries: days.map((day) => ({
      queryKey: ["summary", day],
      queryFn: () => api.summary(day),
    })),
  });

  const loading = results.some((r) => r.isLoading);
  const summaries = results.map((r) => r.data).filter(Boolean) as DailySummary[];

  const chartData = days.map((day, i) => ({
    day,
    label: formatDayLabel(day),
    calories: Math.round(results[i].data?.totals.calories ?? 0),
  }));

  const goal = summaries.find((s) => s.goal)?.goal?.calorie_target ?? 2000;

  const loggedDays = chartData.filter((d) => d.calories > 0);
  const avg =
    loggedDays.length > 0
      ? Math.round(loggedDays.reduce((s, d) => s + d.calories, 0) / loggedDays.length)
      : 0;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">History</h1>

      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="Daily average" value={`${avg} kcal`} />
        <Stat label="Days logged" value={`${loggedDays.length} / ${DAYS}`} />
        <Stat label="Calorie goal" value={`${Math.round(goal)} kcal`} />
      </div>

      <div className="card p-6">
        <h2 className="mb-4 text-lg font-semibold">Last 7 days</h2>
        {loading ? (
          <p className="text-sm text-slate-400">Loading...</p>
        ) : (
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="label" tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
                <Tooltip
                  cursor={{ fill: "rgba(16,185,129,0.08)" }}
                  formatter={(v: number) => [`${v} kcal`, "Calories"]}
                />
                <ReferenceLine y={goal} stroke="#10b981" strokeDasharray="4 4" />
                <Bar dataKey="calories" fill="#10b981" radius={[6, 6, 0, 0]} maxBarSize={48} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="card p-4">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-bold tabular-nums">{value}</p>
    </div>
  );
}
