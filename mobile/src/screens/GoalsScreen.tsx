import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { ScrollView, Text } from "react-native";

import type { DailyGoal } from "@shared/types";

import { api } from "../api";
import { Card, Field, PrimaryButton } from "../components";
import { useLang } from "../i18n";
import { colors } from "../theme";
import { useToast } from "../toast";

const DEFAULTS: DailyGoal = {
  calorie_target: 2000,
  protein_target: 120,
  carb_target: 250,
  fat_target: 70,
};

export function GoalsScreen() {
  const [form, setForm] = useState({
    calorie_target: String(DEFAULTS.calorie_target),
    protein_target: String(DEFAULTS.protein_target),
    carb_target: String(DEFAULTS.carb_target),
    fat_target: String(DEFAULTS.fat_target),
  });
  const [busy, setBusy] = useState(false);
  const toast = useToast();
  const { t } = useLang();

  const load = useCallback(async () => {
    const g = await api.getGoal().catch(() => null);
    if (g) {
      setForm({
        calorie_target: String(g.calorie_target),
        protein_target: String(g.protein_target),
        carb_target: String(g.carb_target),
        fat_target: String(g.fat_target),
      });
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load]),
  );

  async function save() {
    setBusy(true);
    try {
      await api.setGoal({
        calorie_target: Number(form.calorie_target) || 0,
        protein_target: Number(form.protein_target) || 0,
        carb_target: Number(form.carb_target) || 0,
        fat_target: Number(form.fat_target) || 0,
      });
      toast.success(t("Daily goals updated"));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("Could not save"));
    } finally {
      setBusy(false);
    }
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.bg }}
      contentContainerStyle={{ padding: 16 }}
    >
      <Card>
        <Text style={{ fontSize: 16, fontWeight: "700", color: colors.text, marginBottom: 16 }}>
          {t("Daily targets")}
        </Text>
        <Field
          label={t("Calories (kcal)")}
          value={form.calorie_target}
          onChangeText={(v) => setForm((f) => ({ ...f, calorie_target: v }))}
          keyboardType="numeric"
        />
        <Field
          label={t("Protein (g)")}
          value={form.protein_target}
          onChangeText={(v) => setForm((f) => ({ ...f, protein_target: v }))}
          keyboardType="numeric"
        />
        <Field
          label={t("Carbs (g)")}
          value={form.carb_target}
          onChangeText={(v) => setForm((f) => ({ ...f, carb_target: v }))}
          keyboardType="numeric"
        />
        <Field
          label={t("Fat (g)")}
          value={form.fat_target}
          onChangeText={(v) => setForm((f) => ({ ...f, fat_target: v }))}
          keyboardType="numeric"
        />
        <PrimaryButton title={t("Save goals")} onPress={save} loading={busy} />
      </Card>
    </ScrollView>
  );
}
