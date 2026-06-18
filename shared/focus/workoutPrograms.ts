export type TrainingTier = 'free' | 'pro';

export type TrainingMeal = {
  name: string;
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
  note?: string;
};

export type TrainingExercise = {
  name: string;
  detail: string;
};

export type TrainingDay = {
  day: number;
  label: string;
  focus: string;
  exercises: TrainingExercise[];
  meals: TrainingMeal[];
  presetId?: string;
};

export type TrainingProgram = {
  id: string;
  tier: TrainingTier;
  title: string;
  coach: string;
  tagline: string;
  weeks: number;
  daysPerWeek: number;
  priceLabel?: string;
  accent: string;
  days: TrainingDay[];
};

export const TRAINING_PROGRAMS: TrainingProgram[] = [
  {
    id: 'starter',
    tier: 'free',
    title: 'Starter bodyweight',
    coach: 'NutriLens Coach',
    tagline: 'No equipment. Build the habit in one week.',
    weeks: 1,
    daysPerWeek: 5,
    accent: '#22c55e',
    days: [
      {
        day: 1,
        label: 'Day 1 — Full body',
        focus: 'Foundation · 25 min',
        presetId: 'hiit',
        exercises: [
          { name: 'Jumping jacks', detail: '3 × 45s' },
          { name: 'Push-ups', detail: '3 × 10' },
          { name: 'Bodyweight squats', detail: '3 × 15' },
          { name: 'Plank', detail: '3 × 40s' },
        ],
        meals: [
          {
            name: 'Greek yogurt bowl',
            kcal: 320,
            protein: 28,
            carbs: 32,
            fat: 8,
            note: 'Post-workout',
          },
          {
            name: 'Chicken rice bowl',
            kcal: 520,
            protein: 42,
            carbs: 48,
            fat: 12,
            note: 'Lunch',
          },
        ],
      },
      {
        day: 2,
        label: 'Day 2 — Core & legs',
        focus: 'Stability · 22 min',
        presetId: 'tabata',
        exercises: [
          { name: 'Glute bridge', detail: '3 × 15' },
          { name: 'Reverse lunges', detail: '3 × 12 each' },
          { name: 'Dead bug', detail: '3 × 10 each' },
          { name: 'Wall sit', detail: '3 × 45s' },
        ],
        meals: [
          {
            name: 'Oatmeal + banana',
            kcal: 380,
            protein: 14,
            carbs: 62,
            fat: 9,
            note: 'Breakfast',
          },
          {
            name: 'Tuna salad wrap',
            kcal: 410,
            protein: 35,
            carbs: 38,
            fat: 11,
            note: 'Dinner',
          },
        ],
      },
      {
        day: 3,
        label: 'Day 3 — Active recovery',
        focus: 'Mobility · 18 min',
        presetId: 'quick',
        exercises: [
          { name: 'Cat-cow stretch', detail: '2 × 10' },
          { name: 'Hip circles', detail: '2 × 30s each' },
          { name: 'World\'s greatest stretch', detail: '2 × 8 each' },
          { name: 'Walk or light cycle', detail: '15 min' },
        ],
        meals: [
          {
            name: 'Smoothie (berry protein)',
            kcal: 290,
            protein: 24,
            carbs: 34,
            fat: 6,
          },
          {
            name: 'Veggie omelette',
            kcal: 340,
            protein: 26,
            carbs: 8,
            fat: 22,
          },
        ],
      },
    ],
  },
  {
    id: 'lean-define',
    tier: 'pro',
    title: 'Lean & defined',
    coach: 'Coach Linh',
    tagline: 'Structured HIIT + high-protein meal pairings.',
    weeks: 4,
    daysPerWeek: 4,
    priceLabel: '$9.99/mo',
    accent: '#ff6b2c',
    days: [
      {
        day: 1,
        label: 'Week 1 · Push power',
        focus: 'Chest & shoulders · 35 min',
        presetId: 'hiit',
        exercises: [
          { name: 'Incline push-ups', detail: '4 × 12' },
          { name: 'Pike push-ups', detail: '3 × 8' },
          { name: 'Diamond push-ups', detail: '3 × max' },
          { name: 'Shoulder taps', detail: '3 × 20' },
        ],
        meals: [
          {
            name: 'Egg white scramble + toast',
            kcal: 360,
            protein: 32,
            carbs: 28,
            fat: 10,
            note: 'Pre-workout',
          },
          {
            name: 'Grilled salmon + quinoa',
            kcal: 540,
            protein: 45,
            carbs: 42,
            fat: 16,
            note: 'Dinner',
          },
          {
            name: 'Cottage cheese + berries',
            kcal: 220,
            protein: 24,
            carbs: 18,
            fat: 4,
            note: 'Snack',
          },
        ],
      },
      {
        day: 2,
        label: 'Week 1 · Pull & core',
        focus: 'Back & abs · 32 min',
        presetId: 'tabata',
        exercises: [
          { name: 'Inverted rows (table)', detail: '4 × 10' },
          { name: 'Superman hold', detail: '3 × 30s' },
          { name: 'Bicycle crunches', detail: '3 × 20' },
          { name: 'Hollow body hold', detail: '3 × 25s' },
        ],
        meals: [
          {
            name: 'Protein oats',
            kcal: 420,
            protein: 30,
            carbs: 52,
            fat: 9,
          },
          {
            name: 'Turkey lettuce wraps',
            kcal: 380,
            protein: 38,
            carbs: 22,
            fat: 14,
          },
        ],
      },
    ],
  },
  {
    id: 'strength-base',
    tier: 'pro',
    title: 'Strength foundations',
    coach: 'Coach Minh',
    tagline: 'Progressive overload with gym or dumbbells.',
    weeks: 6,
    daysPerWeek: 3,
    priceLabel: '$12.99/mo',
    accent: '#6366f1',
    days: [
      {
        day: 1,
        label: 'Session A — Squat pattern',
        focus: 'Lower body · 40 min',
        presetId: 'emom',
        exercises: [
          { name: 'Goblet squat', detail: '4 × 10' },
          { name: 'Romanian deadlift', detail: '4 × 10' },
          { name: 'Walking lunges', detail: '3 × 12 each' },
          { name: 'Calf raises', detail: '3 × 15' },
        ],
        meals: [
          {
            name: 'Rice + lean beef',
            kcal: 580,
            protein: 48,
            carbs: 55,
            fat: 14,
          },
          {
            name: 'Casein shake',
            kcal: 180,
            protein: 30,
            carbs: 6,
            fat: 2,
            note: 'Before bed',
          },
        ],
      },
    ],
  },
  {
    id: 'fat-loss',
    tier: 'pro',
    title: 'Fat loss kickstart',
    coach: 'Coach An',
    tagline: 'Calorie-aware training with daily meal targets.',
    weeks: 3,
    daysPerWeek: 5,
    priceLabel: '$8.99/mo',
    accent: '#f43f5e',
    days: [
      {
        day: 1,
        label: 'Day 1 — Metabolic circuit',
        focus: 'Full body burn · 28 min',
        presetId: 'quick',
        exercises: [
          { name: 'Burpees', detail: '4 × 8' },
          { name: 'Mountain climbers', detail: '4 × 30s' },
          { name: 'Jump squats', detail: '4 × 12' },
          { name: 'High knees', detail: '4 × 40s' },
        ],
        meals: [
          {
            name: 'Veggie stir-fry + tofu',
            kcal: 420,
            protein: 28,
            carbs: 38,
            fat: 16,
          },
          {
            name: 'Large green salad + chicken',
            kcal: 350,
            protein: 40,
            carbs: 12,
            fat: 14,
          },
        ],
      },
    ],
  },
];
