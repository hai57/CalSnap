import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

import type { DailySummary } from "@shared/types";

import { api } from "../api";
import { Card } from "../components";
import { shortDay, toDateStr } from "../date";
import { useLang } from "../i18n";
import { colors } from "../theme";

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

export function HistoryScreen({ navigation }: { navigation: any }) {
  const { t } = useLang();
  const [data, setData] = useState<{ day: string; calories: number }[]>([]);
  const [goal, setGoal] = useState(2000);

  const load = useCallback(async () => {
    const days = lastNDays(DAYS);
    const summaries = await Promise.all(
      days.map((d) => api.summary(d).catch(() => null)),
    );
    setData(
      days.map((day, i) => ({
        day,
        calories: Math.round((summaries[i] as DailySummary | null)?.totals.calories ?? 0),
      })),
    );
    const g = summaries.find((s) => s?.goal)?.goal?.calorie_target;
    if (g) setGoal(g);
  }, []);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load]),
  );

  const logged = data.filter((d) => d.calories > 0);
  const avg = logged.length ? Math.round(logged.reduce((s, d) => s + d.calories, 0) / logged.length) : 0;
  const max = Math.max(goal, ...data.map((d) => d.calories), 1);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.bg }}
      contentContainerStyle={{ padding: 16, gap: 16 }}
    >
      <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
        <Pressable
          onPress={() => navigation.navigate("Goals")}
          hitSlop={8}
          style={({ pressed }) => ({
            paddingHorizontal: 14,
            paddingVertical: 8,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: colors.border,
            backgroundColor: pressed ? colors.border : colors.card,
          })}
        >
          <Text style={{ color: colors.text, fontWeight: "600" }}>{t("Edit goals")}</Text>
        </Pressable>
      </View>

      <View style={{ flexDirection: "row", gap: 12 }}>
        <Stat label={t("Avg / day")} value={`${avg}`} />
        <Stat label={t("Days logged")} value={`${logged.length}/${DAYS}`} />
        <Stat
          label={t("Goal")}
          value={`${Math.round(goal)}`}
          onPress={() => navigation.navigate("Goals")}
        />
      </View>

      <Card>
        <Text style={{ fontSize: 16, fontWeight: "700", color: colors.text, marginBottom: 16 }}>
          {t("Last 7 days")}
        </Text>
        <View style={{ flexDirection: "row", alignItems: "flex-end", height: 180, gap: 8 }}>
          {data.map((d) => {
            const h = Math.max((d.calories / max) * 150, 2);
            const over = d.calories > goal;
            return (
              <View key={d.day} style={{ flex: 1, alignItems: "center" }}>
                <Text style={{ fontSize: 10, color: colors.muted, marginBottom: 4 }}>
                  {d.calories || ""}
                </Text>
                <View
                  style={{
                    width: "70%",
                    height: h,
                    borderRadius: 6,
                    backgroundColor: over ? colors.danger : colors.brand,
                  }}
                />
                <Text style={{ fontSize: 11, color: colors.muted, marginTop: 6 }}>
                  {shortDay(d.day)}
                </Text>
              </View>
            );
          })}
        </View>
      </Card>
    </ScrollView>
  );
}

function Stat({
  label,
  value,
  onPress,
}: {
  label: string;
  value: string;
  onPress?: () => void;
}) {
  const inner = (
    <>
      <Text style={{ fontSize: 12, color: colors.muted }}>{label}</Text>
      <Text style={{ fontSize: 20, fontWeight: "800", color: colors.text, marginTop: 2 }}>
        {value}
      </Text>
    </>
  );

  if (onPress) {
    return (
      <Pressable onPress={onPress} style={{ flex: 1 }}>
        <Card style={{ flex: 1, padding: 12, borderColor: colors.brand }}>{inner}</Card>
      </Pressable>
    );
  }

  return <Card style={{ flex: 1, padding: 12 }}>{inner}</Card>;
}
