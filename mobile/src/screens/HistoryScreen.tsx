import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { ScrollView, Text, View } from "react-native";

import type { DailySummary } from "@shared/types";

import { api } from "../api";
import { Card } from "../components";
import { shortDay, toDateStr } from "../date";
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

export function HistoryScreen() {
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
      <View style={{ flexDirection: "row", gap: 12 }}>
        <Stat label="Avg / day" value={`${avg}`} />
        <Stat label="Days logged" value={`${logged.length}/${DAYS}`} />
        <Stat label="Goal" value={`${Math.round(goal)}`} />
      </View>

      <Card>
        <Text style={{ fontSize: 16, fontWeight: "700", color: colors.text, marginBottom: 16 }}>
          Last 7 days
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

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <Card style={{ flex: 1, padding: 12 }}>
      <Text style={{ fontSize: 12, color: colors.muted }}>{label}</Text>
      <Text style={{ fontSize: 20, fontWeight: "800", color: colors.text, marginTop: 2 }}>
        {value}
      </Text>
    </Card>
  );
}
