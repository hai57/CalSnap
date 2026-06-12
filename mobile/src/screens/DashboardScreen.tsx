import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";

import type { DailySummary, FoodEntry } from "@shared/types";

import { api } from "../api";
import { Card } from "../components";
import { resolveImageUrl } from "../config";
import { formatTime, todayStr } from "../date";
import { useAuth } from "../auth";
import { useLang } from "../i18n";
import { colors } from "../theme";

const DEFAULT_GOAL = { calorie_target: 2000, protein_target: 120, carb_target: 250, fat_target: 70 };

export function DashboardScreen() {
  const { logout } = useAuth();
  const { t } = useLang();
  const [summary, setSummary] = useState<DailySummary | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      setSummary(await api.summary(todayStr()));
    } catch {
      // ignore; pull-to-refresh will retry
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load]),
  );

  const goal = summary?.goal ?? DEFAULT_GOAL;
  const totals = summary?.totals ?? { calories: 0, protein: 0, carbs: 0, fat: 0 };
  const remaining = Math.max(goal.calorie_target - totals.calories, 0);

  async function remove(id: number) {
    await api.deleteEntry(id);
    void load();
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.bg }}
      contentContainerStyle={{ padding: 16, gap: 16 }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={async () => {
            setRefreshing(true);
            await load();
            setRefreshing(false);
          }}
        />
      }
    >
      <Card style={{ alignItems: "center" }}>
        <Text style={{ color: colors.muted, fontWeight: "600" }}>{t("Calories today")}</Text>
        <Text style={{ fontSize: 48, fontWeight: "800", color: colors.text, marginVertical: 4 }}>
          {Math.round(totals.calories)}
        </Text>
        <Text style={{ color: colors.muted }}>
          {t("{remaining} kcal left of {goal}", {
            remaining: Math.round(remaining),
            goal: Math.round(goal.calorie_target),
          })}
        </Text>
        <View style={{ flexDirection: "row", gap: 18, marginTop: 16 }}>
          <Macro label={t("Protein")} value={totals.protein} color={colors.protein} />
          <Macro label={t("Carbs")} value={totals.carbs} color={colors.carbs} />
          <Macro label={t("Fat")} value={totals.fat} color={colors.fat} />
        </View>
      </Card>

      <View>
        <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
          <Text style={{ fontSize: 18, fontWeight: "700", color: colors.text }}>{t("Meals today")}</Text>
          <Pressable onPress={logout}>
            <Text style={{ color: colors.muted }}>{t("Log out")}</Text>
          </Pressable>
        </View>
        {summary && summary.entries.length > 0 ? (
          summary.entries.map((e) => (
            <EntryRow
              key={e.id}
              entry={e}
              onDelete={() =>
                Alert.alert(t("Delete entry"), t('Remove "{name}"?', { name: e.name }), [
                  { text: t("Cancel"), style: "cancel" },
                  { text: t("Delete"), style: "destructive", onPress: () => void remove(e.id) },
                ])
              }
            />
          ))
        ) : (
          <Card>
            <Text style={{ color: colors.muted, textAlign: "center" }}>
              {t('No meals yet. Tap "+ Add food" to log your first meal.')}
            </Text>
          </Card>
        )}
      </View>
    </ScrollView>
  );
}

function Macro({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <View style={{ alignItems: "center" }}>
      <Text style={{ fontSize: 18, fontWeight: "700", color }}>{Math.round(value)}g</Text>
      <Text style={{ fontSize: 12, color: colors.muted }}>{label}</Text>
    </View>
  );
}

function EntryRow({ entry, onDelete }: { entry: FoodEntry; onDelete: () => void }) {
  const img = resolveImageUrl(entry.image_url);
  return (
    <Card style={{ flexDirection: "row", alignItems: "center", marginBottom: 10, padding: 12 }}>
      {img ? (
        <Image source={{ uri: img }} style={{ width: 48, height: 48, borderRadius: 10 }} />
      ) : (
        <View
          style={{
            width: 48,
            height: 48,
            borderRadius: 10,
            backgroundColor: colors.brandLight,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ fontSize: 22 }}>{entry.source === "photo" ? "📷" : "🍽️"}</Text>
        </View>
      )}
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={{ fontWeight: "600", color: colors.text }} numberOfLines={1}>
          {entry.name}
        </Text>
        <Text style={{ fontSize: 12, color: colors.muted }}>
          {formatTime(entry.logged_at)} · P {Math.round(entry.protein)} · C {Math.round(entry.carbs)} · F{" "}
          {Math.round(entry.fat)}
        </Text>
      </View>
      <Text style={{ fontWeight: "700", color: colors.text }}>{Math.round(entry.calories)}</Text>
      <Pressable onPress={onDelete} hitSlop={10} style={{ marginLeft: 12 }}>
        <Text style={{ color: colors.muted, fontSize: 16 }}>✕</Text>
      </Pressable>
    </Card>
  );
}
