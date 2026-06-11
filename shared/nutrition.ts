import type { DietMode } from "./types";

// Calories per gram for each macronutrient.
export const KCAL_PER_G = {
  carbs: 4,
  protein: 4,
  fat: 9,
} as const;

export interface DietPreset {
  mode: DietMode;
  label: string;
  description: string;
  // Share of total calories per macro. Must sum to 1.
  split: { carbs: number; protein: number; fat: number };
}

export const DIET_PRESETS: DietPreset[] = [
  {
    mode: "balanced",
    label: "Balanced",
    description: "Even macro split, great for everyday maintenance.",
    split: { carbs: 0.5, protein: 0.2, fat: 0.3 },
  },
  {
    mode: "low_carb",
    label: "Low carb",
    description: "Fewer carbs, more protein and fat for weight control.",
    split: { carbs: 0.25, protein: 0.35, fat: 0.4 },
  },
  {
    mode: "low_fat",
    label: "Low fat",
    description: "Limit fat, favor carbs and protein.",
    split: { carbs: 0.6, protein: 0.25, fat: 0.15 },
  },
  {
    mode: "high_protein",
    label: "High protein",
    description: "More protein to build and keep muscle.",
    split: { carbs: 0.35, protein: 0.4, fat: 0.25 },
  },
  {
    mode: "keto",
    label: "Keto",
    description: "Very low carb, high fat to burn fat for fuel.",
    split: { carbs: 0.05, protein: 0.25, fat: 0.7 },
  },
  {
    mode: "vegetarian",
    label: "Vegetarian",
    description: "Plant-based, balanced carbs and plant protein.",
    split: { carbs: 0.55, protein: 0.2, fat: 0.25 },
  },
];

export function getDietPreset(mode: DietMode): DietPreset {
  return DIET_PRESETS.find((p) => p.mode === mode) ?? DIET_PRESETS[0];
}

// Convert a calorie target + diet split into macro grams.
export function macrosFromCalories(
  calories: number,
  split: { carbs: number; protein: number; fat: number },
): { carbs: number; protein: number; fat: number } {
  return {
    carbs: Math.round((calories * split.carbs) / KCAL_PER_G.carbs),
    protein: Math.round((calories * split.protein) / KCAL_PER_G.protein),
    fat: Math.round((calories * split.fat) / KCAL_PER_G.fat),
  };
}

// Calories contributed by a given macro amount (grams).
export function macroKcal(grams: number, macro: keyof typeof KCAL_PER_G): number {
  return grams * KCAL_PER_G[macro];
}

export interface MacroBreakdown {
  carbsKcal: number;
  proteinKcal: number;
  fatKcal: number;
  totalKcal: number;
  carbsPct: number;
  proteinPct: number;
  fatPct: number;
}

// Given macro grams, compute kcal + percentage-of-energy for each.
export function macroBreakdown(grams: {
  carbs: number;
  protein: number;
  fat: number;
}): MacroBreakdown {
  const carbsKcal = macroKcal(grams.carbs, "carbs");
  const proteinKcal = macroKcal(grams.protein, "protein");
  const fatKcal = macroKcal(grams.fat, "fat");
  const totalKcal = carbsKcal + proteinKcal + fatKcal;
  const pct = (v: number) => (totalKcal > 0 ? Math.round((v / totalKcal) * 100) : 0);
  return {
    carbsKcal,
    proteinKcal,
    fatKcal,
    totalKcal,
    carbsPct: pct(carbsKcal),
    proteinPct: pct(proteinKcal),
    fatPct: pct(fatKcal),
  };
}

export const MACRO_COLORS = {
  carbs: "#f59e0b",
  protein: "#3b82f6",
  fat: "#ef4444",
} as const;
