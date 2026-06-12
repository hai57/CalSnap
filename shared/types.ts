// Shared API types. Mirrors the Pydantic schemas in backend/app/schemas.py.

export type Source = 'photo' | 'text';

export interface User {
  id: number;
  email: string;
  created_at: string;
}

export interface Token {
  access_token: string;
  token_type: string;
}

export interface Nutrition {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  confidence: number | null;
}

export interface AnalyzeResult extends Nutrition {
  source: Source;
  image_url: string | null;
}

export interface FoodEntry {
  id: number;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  image_url: string | null;
  source: Source;
  confidence: number | null;
  logged_at: string;
}

export interface FoodEntryCreate {
  name: string;
  calories: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  source?: Source;
  image_url?: string | null;
  confidence?: number | null;
  logged_at?: string | null;
}

export interface FoodEntryUpdate {
  name?: string;
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  logged_at?: string;
}

export interface DailyGoal {
  calorie_target: number;
  protein_target: number;
  carb_target: number;
  fat_target: number;
}

export type DietMode =
  | 'balanced'
  | 'low_carb'
  | 'low_fat'
  | 'high_protein'
  | 'keto'
  | 'vegetarian';

export type WeightUnit = 'kg' | 'lb';

export interface UserProfile {
  weight_kg: number;
  weight_unit: WeightUnit;
  diet_mode: DietMode;
  steps_target: number;
  water_ml: number;
}

export interface MacroTotals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface DailySummary {
  day: string;
  totals: MacroTotals;
  goal: DailyGoal | null;
  entries: FoodEntry[];
}
