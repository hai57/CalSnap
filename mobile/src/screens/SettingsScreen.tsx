import Slider from "@react-native-community/slider";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";
import Svg, { Circle } from "react-native-svg";

import type { DailyGoal, DietMode, UserSettings, WeightUnit } from "@shared/types";
import {
  DIET_PRESETS,
  MACRO_COLORS,
  getDietPreset,
  macroBreakdown,
  macrosFromCalories,
} from "@shared/nutrition";

import { api } from "../api";
import { Card, Field, PrimaryButton } from "../components";
import { colors } from "../theme";

const LB_PER_KG = 2.2046226218;
const WATER_OPTIONS = [1500, 2000, 2500, 3000];

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

export function SettingsScreen() {
  const [calories, setCalories] = useState(2000);
  const [carbs, setCarbs] = useState(250);
  const [protein, setProtein] = useState(120);
  const [fat, setFat] = useState(70);

  const [weight, setWeight] = useState("70");
  const [weightUnit, setWeightUnit] = useState<WeightUnit>("kg");
  const [dietMode, setDietMode] = useState<DietMode>("balanced");
  const [steps, setSteps] = useState("8000");
  const [waterMl, setWaterMl] = useState(2000);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    const [goal, settings] = await Promise.all([
      api.getGoal().catch(() => null),
      api.getSettings().catch(() => null),
    ]);
    if (goal) {
      setCalories(goal.calorie_target);
      setCarbs(goal.carb_target);
      setProtein(goal.protein_target);
      setFat(goal.fat_target);
    }
    if (settings) {
      setWeightUnit(settings.weight_unit);
      setWeight(
        String(
          settings.weight_unit === "lb"
            ? round1(settings.weight_kg * LB_PER_KG)
            : round1(settings.weight_kg),
        ),
      );
      setDietMode(settings.diet_mode);
      setSteps(String(settings.steps_target));
      setWaterMl(settings.water_ml);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load]),
  );

  const breakdown = macroBreakdown({ carbs, protein, fat });

  function toggleUnit(unit: WeightUnit) {
    if (unit === weightUnit) return;
    const w = Number(weight) || 0;
    setWeight(String(unit === "lb" ? round1(w * LB_PER_KG) : round1(w / LB_PER_KG)));
    setWeightUnit(unit);
  }

  function pickDiet(mode: DietMode) {
    setDietMode(mode);
    const m = macrosFromCalories(calories, getDietPreset(mode).split);
    setCarbs(m.carbs);
    setProtein(m.protein);
    setFat(m.fat);
  }

  async function save() {
    setBusy(true);
    try {
      const weightKg = weightUnit === "lb" ? (Number(weight) || 0) / LB_PER_KG : Number(weight) || 0;
      await api.setGoal({
        calorie_target: calories,
        protein_target: protein,
        carb_target: carbs,
        fat_target: fat,
      } satisfies DailyGoal);
      await api.setSettings({
        weight_kg: round1(weightKg),
        weight_unit: weightUnit,
        diet_mode: dietMode,
        steps_target: Number(steps) || 0,
        water_ml: waterMl,
      } satisfies UserSettings);
      Alert.alert("Saved", "Your settings have been updated.");
    } catch (err) {
      Alert.alert("Couldn't save", err instanceof Error ? err.message : "Try again");
    } finally {
      setBusy(false);
    }
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.bg }}
      contentContainerStyle={{ padding: 16, gap: 16 }}
    >
      {/* Weight */}
      <Card style={{ gap: 12 }}>
        <SectionTitle>Weight</SectionTitle>
        <View style={{ flexDirection: "row", alignItems: "flex-end", gap: 12 }}>
          <View style={{ flex: 1 }}>
            <Field
              label="Current weight"
              value={weight}
              onChangeText={setWeight}
              keyboardType="numeric"
            />
          </View>
          <Segmented
            options={[
              { key: "kg", label: "kg" },
              { key: "lb", label: "lb" },
            ]}
            value={weightUnit}
            onChange={(v) => toggleUnit(v as WeightUnit)}
          />
        </View>
      </Card>

      {/* Calories */}
      <Card style={{ gap: 8 }}>
        <SectionTitle>Calories</SectionTitle>
        <Field
          label="Daily calorie goal (kcal/day)"
          value={String(calories)}
          onChangeText={(v) => setCalories(Number(v) || 0)}
          keyboardType="numeric"
        />
      </Card>

      {/* Nutrition */}
      <Card style={{ gap: 14 }}>
        <SectionTitle>Nutrition</SectionTitle>
        <View style={{ alignItems: "center" }}>
          <MacroDonut
            carbsKcal={breakdown.carbsKcal}
            proteinKcal={breakdown.proteinKcal}
            fatKcal={breakdown.fatKcal}
            total={breakdown.totalKcal}
          />
        </View>
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
      </Card>

      {/* Diet */}
      <Card style={{ gap: 10 }}>
        <SectionTitle>Diet</SectionTitle>
        {DIET_PRESETS.map((preset) => {
          const active = preset.mode === dietMode;
          return (
            <Pressable
              key={preset.mode}
              onPress={() => pickDiet(preset.mode)}
              style={{
                borderWidth: 1,
                borderColor: active ? colors.brand : colors.border,
                backgroundColor: active ? colors.brandLight : "#fff",
                borderRadius: 12,
                padding: 12,
              }}
            >
              <Text
                style={{
                  fontWeight: "700",
                  color: active ? colors.brandDark : colors.text,
                }}
              >
                {preset.label}
              </Text>
              <Text style={{ fontSize: 12, color: colors.muted, marginTop: 2 }}>
                {preset.description}
              </Text>
            </Pressable>
          );
        })}
      </Card>

      {/* Steps */}
      <Card style={{ gap: 8 }}>
        <SectionTitle>Steps</SectionTitle>
        <Field
          label="Daily goal (steps/day)"
          value={steps}
          onChangeText={setSteps}
          keyboardType="numeric"
        />
      </Card>

      {/* Water */}
      <Card style={{ gap: 12 }}>
        <SectionTitle>Water</SectionTitle>
        <View style={{ alignItems: "center" }}>
          <Text style={{ fontSize: 40, fontWeight: "800", color: colors.brandDark }}>
            {waterMl}
          </Text>
          <Text style={{ fontSize: 12, color: colors.muted }}>ml per day</Text>
        </View>
        <View style={{ flexDirection: "row", gap: 8 }}>
          {WATER_OPTIONS.map((ml) => {
            const active = waterMl === ml;
            return (
              <Pressable
                key={ml}
                onPress={() => setWaterMl(ml)}
                style={{
                  flex: 1,
                  borderWidth: 1,
                  borderColor: active ? colors.brand : colors.border,
                  backgroundColor: active ? colors.brandLight : "#fff",
                  borderRadius: 12,
                  paddingVertical: 12,
                  alignItems: "center",
                }}
              >
                <Text style={{ fontWeight: "700", color: active ? colors.brandDark : colors.muted }}>
                  {(ml / 1000).toFixed(1)} L
                </Text>
              </Pressable>
            );
          })}
        </View>
      </Card>

      <PrimaryButton title="Save settings" onPress={save} loading={busy} />
    </ScrollView>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <Text style={{ fontSize: 16, fontWeight: "700", color: colors.text }}>{children}</Text>
  );
}

function Segmented({
  options,
  value,
  onChange,
}: {
  options: { key: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 10,
        overflow: "hidden",
        marginBottom: 14,
      }}
    >
      {options.map((o) => {
        const active = o.key === value;
        return (
          <Pressable
            key={o.key}
            onPress={() => onChange(o.key)}
            style={{
              paddingHorizontal: 16,
              paddingVertical: 10,
              backgroundColor: active ? colors.brand : "#fff",
            }}
          >
            <Text style={{ fontWeight: "700", color: active ? "#fff" : colors.muted }}>
              {o.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function MacroSlider({
  label,
  color,
  grams,
  pct,
  kcal,
  max,
  onChange,
}: {
  label: string;
  color: string;
  grams: number;
  pct: number;
  kcal: number;
  max: number;
  onChange: (v: number) => void;
}) {
  return (
    <View>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text style={{ fontWeight: "700", color }}>{label}</Text>
        <Text style={{ color: colors.muted, fontSize: 13 }}>
          {pct}% · {grams} g · {Math.round(kcal)} kcal
        </Text>
      </View>
      <Slider
        minimumValue={0}
        maximumValue={max}
        step={5}
        value={grams}
        onValueChange={(v) => onChange(Math.round(v))}
        minimumTrackTintColor={color}
        maximumTrackTintColor={colors.border}
        thumbTintColor={color}
      />
    </View>
  );
}

function MacroDonut({
  carbsKcal,
  proteinKcal,
  fatKcal,
  total,
}: {
  carbsKcal: number;
  proteinKcal: number;
  fatKcal: number;
  total: number;
}) {
  const size = 160;
  const stroke = 22;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const segments = [
    { value: carbsKcal, color: MACRO_COLORS.carbs },
    { value: proteinKcal, color: MACRO_COLORS.protein },
    { value: fatKcal, color: MACRO_COLORS.fat },
  ];

  let offset = 0;
  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size}>
        <Circle cx={size / 2} cy={size / 2} r={r} stroke={colors.border} strokeWidth={stroke} fill="none" />
        {total > 0 &&
          segments.map((s, i) => {
            const len = (s.value / total) * c;
            const circle = (
              <Circle
                key={i}
                cx={size / 2}
                cy={size / 2}
                r={r}
                stroke={s.color}
                strokeWidth={stroke}
                fill="none"
                strokeDasharray={`${len} ${c - len}`}
                strokeDashoffset={-offset}
                strokeLinecap="butt"
                transform={`rotate(-90 ${size / 2} ${size / 2})`}
              />
            );
            offset += len;
            return circle;
          })}
      </Svg>
      <View
        style={{
          position: "absolute",
          width: size,
          height: size,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ fontSize: 22, fontWeight: "800", color: colors.text }}>
          {Math.round(total)}
        </Text>
        <Text style={{ fontSize: 11, color: colors.muted }}>macro kcal</Text>
      </View>
    </View>
  );
}
