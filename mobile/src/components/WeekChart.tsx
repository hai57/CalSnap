import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import type { DailySummary } from '@shared/types';

import { api } from '../api';
import { Card } from '../components';
import { shortDay, toDateStr } from '../date';
import { useLang } from '../i18n';
import { colors } from '../theme';

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

export function WeekChart({
  onEditGoals,
}: {
  onEditGoals?: () => void;
}) {
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
        calories: Math.round(
          (summaries[i] as DailySummary | null)?.totals.calories ?? 0,
        ),
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

  const max = Math.max(goal, ...data.map((d) => d.calories), 1);

  return (
    <Card>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16,
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: '700', color: colors.text }}>
          {t('Last 7 days')}
        </Text>
        {onEditGoals ? (
          <Pressable onPress={onEditGoals} hitSlop={8}>
            <Text style={{ color: colors.brand, fontWeight: '600' }}>
              {t('Edit goals')}
            </Text>
          </Pressable>
        ) : null}
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'flex-end', height: 160, gap: 8 }}>
        {data.map((d) => {
          const h = Math.max((d.calories / max) * 130, 2);
          const over = d.calories > goal;
          return (
            <View key={d.day} style={{ flex: 1, alignItems: 'center' }}>
              <Text style={{ fontSize: 10, color: colors.muted, marginBottom: 4 }}>
                {d.calories || ''}
              </Text>
              <View
                style={{
                  width: '70%',
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
  );
}
