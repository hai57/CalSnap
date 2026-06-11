import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';

import type {
  DailyGoal,
  DietMode,
  UserSettings,
  WeightUnit,
} from '@shared/types';
import {
  DIET_PRESETS,
  MACRO_COLORS,
  getDietPreset,
  macroBreakdown,
  macrosFromCalories,
} from '@shared/nutrition';

import { api } from '../lib/api';
import { useHeaderAction } from '@src/components/LayoutAction';
import {
  DietDesc,
  DietGrid,
  DietName,
  DietOption,
  FieldLabel,
  HeaderSaveButton,
  InlineInput,
  MacroList,
  Muted,
  NutritionLayout,
  Page,
  PieCenter,
  PieLabel,
  PieTotal,
  PieWrap,
  Row,
  SectionCard,
  SectionTitle,
  Segment,
  Segments,
  Title,
  WaterBig,
  WaterMl,
  WaterOption,
  WaterOptions,
  WaterUnit,
} from './StSettings';
import { MacroSlider } from '../components/settings/MarcoSlider';

const LB_PER_KG = 2.2046226218;
const WATER_OPTIONS = [1500, 2000, 2500, 3000];

const DEFAULT_GOAL: DailyGoal = {
  calorie_target: 2000,
  protein_target: 120,
  carb_target: 250,
  fat_target: 70,
};

const DEFAULT_SETTINGS: UserSettings = {
  weight_kg: 70,
  weight_unit: 'kg',
  diet_mode: 'balanced',
  steps_target: 8000,
  water_ml: 2000,
};

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

export function Settings() {
  const qc = useQueryClient();
  const goalQuery = useQuery<DailyGoal | null>({
    queryKey: ['goal'],
    queryFn: () => api.getGoal(),
  });
  const settingsQuery = useQuery<UserSettings>({
    queryKey: ['settings'],
    queryFn: () => api.getSettings(),
  });

  const [calories, setCalories] = useState(DEFAULT_GOAL.calorie_target);
  const [carbs, setCarbs] = useState(DEFAULT_GOAL.carb_target);
  const [protein, setProtein] = useState(DEFAULT_GOAL.protein_target);
  const [fat, setFat] = useState(DEFAULT_GOAL.fat_target);

  const [weight, setWeight] = useState(DEFAULT_SETTINGS.weight_kg);
  const [weightUnit, setWeightUnit] = useState<WeightUnit>('kg');
  const [dietMode, setDietMode] = useState<DietMode>('balanced');
  const [steps, setSteps] = useState(DEFAULT_SETTINGS.steps_target);
  const [waterMl, setWaterMl] = useState(DEFAULT_SETTINGS.water_ml);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const g = goalQuery.data;
    if (g) {
      setCalories(g.calorie_target);
      setCarbs(g.carb_target);
      setProtein(g.protein_target);
      setFat(g.fat_target);
    }
  }, [goalQuery.data]);

  useEffect(() => {
    const s = settingsQuery.data;
    if (s) {
      setWeightUnit(s.weight_unit);
      setWeight(
        s.weight_unit === 'lb'
          ? round1(s.weight_kg * LB_PER_KG)
          : round1(s.weight_kg),
      );
      setDietMode(s.diet_mode);
      setSteps(s.steps_target);
      setWaterMl(s.water_ml);
    }
  }, [settingsQuery.data]);

  const breakdown = macroBreakdown({ carbs, protein, fat });
  const pieData = [
    {
      key: 'carbs',
      name: 'Tinh bột',
      value: breakdown.carbsKcal,
      color: MACRO_COLORS.carbs,
    },
    {
      key: 'protein',
      name: 'Chất đạm',
      value: breakdown.proteinKcal,
      color: MACRO_COLORS.protein,
    },
    {
      key: 'fat',
      name: 'Chất béo',
      value: breakdown.fatKcal,
      color: MACRO_COLORS.fat,
    },
  ];

  function toggleUnit(unit: WeightUnit) {
    if (unit === weightUnit) return;
    setWeight((w) =>
      unit === 'lb' ? round1(w * LB_PER_KG) : round1(w / LB_PER_KG),
    );
    setWeightUnit(unit);
  }

  function pickDiet(mode: DietMode) {
    setDietMode(mode);
    const preset = getDietPreset(mode);
    const m = macrosFromCalories(calories, preset.split);
    setCarbs(m.carbs);
    setProtein(m.protein);
    setFat(m.fat);
  }

  const save = useMutation({
    mutationFn: async () => {
      const weightKg = weightUnit === 'lb' ? weight / LB_PER_KG : weight;
      await api.setGoal({
        calorie_target: calories,
        protein_target: protein,
        carb_target: carbs,
        fat_target: fat,
      });
      await api.setSettings({
        weight_kg: round1(weightKg),
        weight_unit: weightUnit,
        diet_mode: dietMode,
        steps_target: steps,
        water_ml: waterMl,
      });
    },
    onSuccess: () => {
      setSaved(true);
      qc.invalidateQueries({ queryKey: ['goal'] });
      qc.invalidateQueries({ queryKey: ['settings'] });
      qc.invalidateQueries({ queryKey: ['summary'] });
      setTimeout(() => setSaved(false), 2000);
    },
  });

  const loading = goalQuery.isLoading || settingsQuery.isLoading;
  const activeDiet = getDietPreset(dietMode);

  useHeaderAction(
    <HeaderSaveButton
      onClick={() => save.mutate()}
      disabled={save.isPending || loading}
    >
      {save.isPending ? 'Saving...' : saved ? 'Saved!' : 'Save'}
    </HeaderSaveButton>,
    [save.isPending, saved, loading],
  );

  return (
    <Page>
      <Title>Settings</Title>

      {loading ? (
        <Muted>Loading...</Muted>
      ) : (
        <>
          {/* Weight */}
          <SectionCard>
            <SectionTitle>Weight</SectionTitle>
            <Row>
              <FieldLabel style={{ margin: 0 }}>Current weight</FieldLabel>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                }}
              >
                <InlineInput
                  type="number"
                  min={0}
                  step="0.1"
                  value={weight}
                  onChange={(e) => setWeight(Number(e.target.value))}
                />
                <Segments>
                  <Segment
                    $active={weightUnit === 'kg'}
                    onClick={() => toggleUnit('kg')}
                  >
                    kg
                  </Segment>
                  <Segment
                    $active={weightUnit === 'lb'}
                    onClick={() => toggleUnit('lb')}
                  >
                    lb
                  </Segment>
                </Segments>
              </div>
            </Row>
          </SectionCard>

          {/* Calories */}
          <SectionCard>
            <SectionTitle>Calories</SectionTitle>
            <Row>
              <FieldLabel style={{ margin: 0 }}>Daily calorie goal</FieldLabel>
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <InlineInput
                  type="number"
                  min={0}
                  step="10"
                  value={calories}
                  onChange={(e) => setCalories(Number(e.target.value))}
                />
                <Muted>kcal/day</Muted>
              </div>
            </Row>
          </SectionCard>

          {/* Nutrition */}
          <SectionCard>
            <SectionTitle>Nutrition</SectionTitle>
            <NutritionLayout>
              <MacroList>
                <MacroSlider
                  label="Carbs"
                  color={MACRO_COLORS.carbs}
                  grams={carbs}
                  pct={breakdown.carbsPct}
                  kcal={breakdown.carbsKcal}
                  max={500}
                  onChange={setCarbs}
                />
                <MacroSlider
                  label="Protein"
                  color={MACRO_COLORS.protein}
                  grams={protein}
                  pct={breakdown.proteinPct}
                  kcal={breakdown.proteinKcal}
                  max={300}
                  onChange={setProtein}
                />
                <MacroSlider
                  label="Fat"
                  color={MACRO_COLORS.fat}
                  grams={fat}
                  pct={breakdown.fatPct}
                  kcal={breakdown.fatKcal}
                  max={200}
                  onChange={setFat}
                />
              </MacroList>

              <PieWrap>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={55}
                      outerRadius={85}
                      paddingAngle={2}
                      stroke="none"
                    >
                      {pieData.map((d) => (
                        <Cell key={d.key} fill={d.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <PieCenter>
                  <PieTotal>{Math.round(breakdown.totalKcal)}</PieTotal>
                  <PieLabel>macro kcal</PieLabel>
                </PieCenter>
              </PieWrap>
            </NutritionLayout>
          </SectionCard>

          {/* Diet */}
          <SectionCard>
            <SectionTitle>Diet</SectionTitle>
            <DietGrid>
              {DIET_PRESETS.map((preset) => (
                <DietOption
                  key={preset.mode}
                  $active={preset.mode === dietMode}
                  onClick={() => pickDiet(preset.mode)}
                >
                  <DietName $active={preset.mode === dietMode}>
                    {preset.label}
                  </DietName>
                  <DietDesc>{preset.description}</DietDesc>
                </DietOption>
              ))}
            </DietGrid>
            <Muted style={{ marginTop: '0.25rem' }}>
              Choosing a diet recalculates your macros from your calorie goal.
              Current: {activeDiet.label}.
            </Muted>
          </SectionCard>

          {/* Steps */}
          <SectionCard>
            <SectionTitle>Steps</SectionTitle>
            <Row>
              <FieldLabel style={{ margin: 0 }}>Daily goal</FieldLabel>
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <InlineInput
                  type="number"
                  min={0}
                  step="500"
                  value={steps}
                  onChange={(e) => setSteps(Number(e.target.value))}
                />
                <Muted>steps/day</Muted>
              </div>
            </Row>
          </SectionCard>

          {/* Water */}
          <SectionCard>
            <SectionTitle>Water</SectionTitle>
            <WaterBig>
              <WaterMl>{waterMl}</WaterMl>
              <WaterUnit>ml per day</WaterUnit>
            </WaterBig>
            <WaterOptions>
              {WATER_OPTIONS.map((ml) => (
                <WaterOption
                  key={ml}
                  $active={waterMl === ml}
                  onClick={() => setWaterMl(ml)}
                >
                  {(ml / 1000).toFixed(1)} L
                </WaterOption>
              ))}
            </WaterOptions>
          </SectionCard>
        </>
      )}
    </Page>
  );
}
