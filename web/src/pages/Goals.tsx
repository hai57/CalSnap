import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import type { DailyGoal } from "@shared/types";

import { api } from "../lib/api";

const DEFAULTS: DailyGoal = {
  calorie_target: 2000,
  protein_target: 120,
  carb_target: 250,
  fat_target: 70,
};

export function Goals() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery<DailyGoal | null>({
    queryKey: ["goal"],
    queryFn: () => api.getGoal(),
  });

  const [form, setForm] = useState<DailyGoal>(DEFAULTS);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (data) setForm(data);
  }, [data]);

  const save = useMutation({
    mutationFn: (goal: DailyGoal) => api.setGoal(goal),
    onSuccess: () => {
      setSaved(true);
      qc.invalidateQueries({ queryKey: ["goal"] });
      qc.invalidateQueries({ queryKey: ["summary"] });
      setTimeout(() => setSaved(false), 2000);
    },
  });

  function field(key: keyof DailyGoal) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [key]: Number(e.target.value) }));
  }

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <h1 className="text-2xl font-bold">Daily goals</h1>
      <div className="card space-y-4 p-6">
        {isLoading ? (
          <p className="text-sm text-slate-400">Loading...</p>
        ) : (
          <>
            <Row label="Calorie target (kcal)" value={form.calorie_target} onChange={field("calorie_target")} />
            <Row label="Protein target (g)" value={form.protein_target} onChange={field("protein_target")} />
            <Row label="Carbs target (g)" value={form.carb_target} onChange={field("carb_target")} />
            <Row label="Fat target (g)" value={form.fat_target} onChange={field("fat_target")} />
            <button
              onClick={() => save.mutate(form)}
              disabled={save.isPending}
              className="btn-primary w-full py-2.5"
            >
              {save.isPending ? "Saving..." : saved ? "Saved!" : "Save goals"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <label className="text-sm font-medium text-slate-700">{label}</label>
      <input type="number" min={0} className="input max-w-36" value={value} onChange={onChange} />
    </div>
  );
}
