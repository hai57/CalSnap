import { useState } from 'react';
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';

import { K } from '@shared/focus/constants';
import {
  TRAINING_PROGRAMS,
  type TrainingDay,
  type TrainingProgram,
} from '@shared/focus/workoutPrograms';
import { newId, usePersisted } from '../hooks/focusHooks';
import { useLang } from '../i18n';
import { colors } from '../theme';
import type { WorkoutSeed } from './QuickWorkout';
import { Panel, SectionHeader } from './ui';

type WorkoutProgramsProps = {
  onApplyDay: (seed: WorkoutSeed) => void;
};

export function WorkoutPrograms({ onApplyDay }: WorkoutProgramsProps) {
  const { t } = useLang();
  const [proUnlocked, setProUnlocked] = usePersisted(K('workoutPro'), false);
  const [selected, setSelected] = useState<TrainingProgram | null>(null);
  const [dayIdx, setDayIdx] = useState(0);
  const [paywall, setPaywall] = useState<TrainingProgram | null>(null);

  const openProgram = (program: TrainingProgram) => {
    if (program.tier === 'pro' && !proUnlocked) {
      setPaywall(program);
      return;
    }
    setSelected(program);
    setDayIdx(0);
  };

  const unlockPro = () => {
    setProUnlocked(true);
    if (paywall) {
      setSelected(paywall);
      setDayIdx(0);
    }
    setPaywall(null);
  };

  const applyDay = (program: TrainingProgram, day: TrainingDay) => {
    onApplyDay({
      label: `${t(program.title)} · ${day.label}`,
      presetId: day.presetId,
      exercises: day.exercises.map((ex) => ({
        id: newId(),
        name: ex.name,
        detail: ex.detail,
        done: false,
      })),
    });
  };

  if (selected) {
    const day = selected.days[dayIdx] ?? selected.days[0];
    return (
      <Panel accent={selected.accent}>
        <View style={{ padding: 16, gap: 12 }}>
          <Pressable onPress={() => setSelected(null)}>
            <Text style={{ color: colors.brand, fontWeight: '700' }}>
              ← {t('All programs')}
            </Text>
          </Pressable>
          <Text style={{ fontSize: 22, fontWeight: '800', color: colors.text }}>
            {t(selected.title)}
          </Text>
          <Text style={{ color: colors.muted }}>
            {t('Coach')}: {selected.coach} · {selected.weeks} {t('weeks')}
          </Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              {selected.days.map((d, i) => (
                <Pressable
                  key={d.day}
                  onPress={() => setDayIdx(i)}
                  style={{
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    borderRadius: 10,
                    backgroundColor: i === dayIdx ? selected.accent : colors.bg,
                    borderWidth: 1,
                    borderColor: i === dayIdx ? selected.accent : colors.border,
                  }}
                >
                  <Text
                    style={{
                      fontWeight: '700',
                      color: i === dayIdx ? '#fff' : colors.text,
                    }}
                  >
                    {d.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </ScrollView>

          <Text style={{ color: colors.muted }}>{day.focus}</Text>

          <Text style={{ fontWeight: '700', color: colors.text }}>
            {t("Today's exercises")}
          </Text>
          {day.exercises.map((ex) => (
            <Text key={ex.name} style={{ color: colors.text }}>
              · {ex.name} — {ex.detail}
            </Text>
          ))}

          {day.meals.length > 0 ? (
            <>
              <Text style={{ fontWeight: '700', color: colors.text, marginTop: 8 }}>
                {t('Meals')}
              </Text>
              {day.meals.map((meal) => (
                <View
                  key={meal.name}
                  style={{
                    padding: 10,
                    borderRadius: 10,
                    backgroundColor: colors.bg,
                    marginTop: 6,
                  }}
                >
                  <Text style={{ fontWeight: '700', color: colors.text }}>
                    {meal.name}
                  </Text>
                  <Text style={{ color: colors.muted, fontSize: 12 }}>
                    {meal.kcal} kcal · P {meal.protein}g · C {meal.carbs}g · F{' '}
                    {meal.fat}g
                    {meal.note ? ` · ${meal.note}` : ''}
                  </Text>
                </View>
              ))}
            </>
          ) : null}

          <Pressable
            onPress={() => applyDay(selected, day)}
            style={{
              marginTop: 8,
              paddingVertical: 14,
              borderRadius: 12,
              backgroundColor: selected.accent,
              alignItems: 'center',
            }}
          >
            <Text style={{ color: '#fff', fontWeight: '800' }}>
              {t('Start this session')}
            </Text>
          </Pressable>
        </View>
      </Panel>
    );
  }

  return (
    <>
      <Panel accent="#ff6b2c">
        <SectionHeader
          eyebrow={t('Training lectures')}
          title={t('Training programs')}
          subtitle={t('Guided workouts with meal pairings — optional Pro plans.')}
          accent="#ff6b2c"
        />
        <View style={{ padding: 16, paddingTop: 0, gap: 10 }}>
          {TRAINING_PROGRAMS.map((program) => (
            <Pressable
              key={program.id}
              onPress={() => openProgram(program)}
              style={{
                padding: 14,
                borderRadius: 14,
                borderWidth: 1,
                borderColor: colors.border,
                backgroundColor: colors.bg,
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Text style={{ fontWeight: '800', color: colors.text, flex: 1 }}>
                  {t(program.title)}
                </Text>
                <Text
                  style={{
                    fontSize: 10,
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    color: program.tier === 'pro' ? '#ff6b2c' : '#22c55e',
                  }}
                >
                  {program.tier === 'pro' ? t('Pro') : t('Free')}
                </Text>
              </View>
              <Text style={{ color: colors.muted, marginTop: 4 }}>
                {t(program.tagline)}
              </Text>
              <Text style={{ color: colors.muted, fontSize: 12, marginTop: 4 }}>
                {program.weeks} {t('weeks')} · {program.daysPerWeek}{' '}
                {t('days/week')}
              </Text>
            </Pressable>
          ))}
        </View>
      </Panel>

      <Modal visible={paywall != null} transparent animationType="fade">
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            padding: 24,
          }}
        >
          <View
            style={{
              backgroundColor: colors.card,
              borderRadius: 16,
              padding: 20,
              gap: 12,
            }}
          >
            <Text style={{ fontSize: 20, fontWeight: '800', color: colors.text }}>
              {t('NutriLens Pro Training')}
            </Text>
            <Text style={{ color: colors.muted }}>
              {t('Unlock "{title}" and all Pro lectures.', {
                title: paywall ? t(paywall.title) : '',
              })}
            </Text>
            <Pressable
              onPress={unlockPro}
              style={{
                paddingVertical: 14,
                borderRadius: 12,
                backgroundColor: '#ff6b2c',
                alignItems: 'center',
              }}
            >
              <Text style={{ color: '#fff', fontWeight: '800' }}>
                {t('Unlock Pro (demo)')}
              </Text>
            </Pressable>
            <Pressable onPress={() => setPaywall(null)}>
              <Text style={{ textAlign: 'center', color: colors.muted }}>
                {t('Not now — keep using free tools')}
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
}
