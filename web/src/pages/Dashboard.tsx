import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";

import type { DailySummary, FoodEntry } from "@shared/types";

import { MacroBar } from "../components/MacroBar";
import { MacroRing } from "../components/MacroRing";
import { api, resolveImageUrl } from "../lib/api";
import { todayStr } from "../lib/date";
import { formatTime } from "../lib/date";

const DEFAULT_GOAL = { calorie_target: 2000, protein_target: 120, carb_target: 250, fat_target: 70 };

export function Dashboard() {
  const day = todayStr();
  const qc = useQueryClient();

  const { data, isLoading } = useQuery<DailySummary>({
    queryKey: ["summary", day],
    queryFn: () => api.summary(day),
  });

  const del = useMutation({
    mutationFn: (id: number) => api.deleteEntry(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["summary", day] }),
  });

  const goal = data?.goal ?? DEFAULT_GOAL;
  const totals = data?.totals ?? { calories: 0, protein: 0, carbs: 0, fat: 0 };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Today</h1>
          <p className="text-sm text-slate-500">
            {new Date().toLocaleDateString([], {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <Link to="/add" className="btn-primary px-4 py-2.5 text-sm">
          + Add food
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="card flex items-center justify-center p-6">
          <MacroRing consumed={totals.calories} goal={goal.calorie_target} />
        </div>
        <div className="card flex flex-col justify-center gap-4 p-6">
          <MacroBar
            label="Protein"
            value={totals.protein}
            goal={goal.protein_target}
            color="#3b82f6"
          />
          <MacroBar label="Carbs" value={totals.carbs} goal={goal.carb_target} color="#f59e0b" />
          <MacroBar label="Fat" value={totals.fat} goal={goal.fat_target} color="#ef4444" />
        </div>
      </div>

      <div className="card p-6">
        <h2 className="mb-4 text-lg font-semibold">Meals logged today</h2>
        {isLoading ? (
          <p className="text-sm text-slate-400">Loading...</p>
        ) : data && data.entries.length > 0 ? (
          <ul className="divide-y divide-slate-100">
            {data.entries.map((entry) => (
              <EntryRow key={entry.id} entry={entry} onDelete={() => del.mutate(entry.id)} />
            ))}
          </ul>
        ) : (
          <div className="py-10 text-center">
            <p className="text-slate-500">No meals logged yet.</p>
            <Link to="/add" className="mt-2 inline-block font-semibold text-brand-600 hover:underline">
              Snap or describe your first meal
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

function EntryRow({ entry, onDelete }: { entry: FoodEntry; onDelete: () => void }) {
  const img = resolveImageUrl(entry.image_url);
  return (
    <li className="flex items-center gap-4 py-3">
      {img ? (
        <img src={img} alt={entry.name} className="h-12 w-12 rounded-lg object-cover" />
      ) : (
        <div className="grid h-12 w-12 place-items-center rounded-lg bg-brand-50 text-lg">
          {entry.source === "photo" ? "📷" : "🍽️"}
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium">{entry.name}</p>
        <p className="text-xs text-slate-500">
          {formatTime(entry.logged_at)} · P {Math.round(entry.protein)}g · C{" "}
          {Math.round(entry.carbs)}g · F {Math.round(entry.fat)}g
        </p>
      </div>
      <div className="text-right">
        <p className="font-semibold tabular-nums">{Math.round(entry.calories)}</p>
        <p className="text-xs text-slate-400">kcal</p>
      </div>
      <button
        onClick={onDelete}
        className="ml-2 rounded-lg px-2 py-1 text-slate-400 transition hover:bg-red-50 hover:text-red-500"
        aria-label="Delete entry"
      >
        ✕
      </button>
    </li>
  );
}
