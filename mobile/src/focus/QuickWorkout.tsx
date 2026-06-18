import { useEffect, useReducer, useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import {
  DEFAULT_WORKOUT,
  K,
  WORKOUT_PRESETS,
  type Exercise,
  type WorkoutPreset,
} from '@shared/focus/constants';
import { newId, usePersisted } from '../hooks/focusHooks';
import { useLang } from '../i18n';
import { CheckIcon } from '../icons';
import { colors } from '../theme';
import { InlineField, Panel, SectionHeader } from './ui';

type Phase = 'idle' | 'work' | 'rest' | 'done';

interface TimerState {
  work: number;
  rest: number;
  rounds: number;
  phase: Phase;
  round: number;
  left: number;
  running: boolean;
}

type Action =
  | { type: 'config'; preset: WorkoutPreset }
  | { type: 'toggle' }
  | { type: 'reset' }
  | { type: 'skip' }
  | { type: 'tick' };

export type WorkoutSeed = {
  label: string;
  exercises: Exercise[];
  presetId?: string;
};

const PHASE_LABEL: Record<Phase, string> = {
  idle: 'Ready',
  work: 'Work!',
  rest: 'Rest',
  done: 'Done',
};

const PHASE_COLOR: Record<Phase, string> = {
  idle: '#ff6b2c',
  work: '#ff6b2c',
  rest: '#22d3ee',
  done: '#1db954',
};

function init(preset: WorkoutPreset): TimerState {
  return {
    work: preset.work,
    rest: preset.rest,
    rounds: preset.rounds,
    phase: 'idle',
    round: 1,
    left: preset.work,
    running: false,
  };
}

function advance(s: TimerState): TimerState {
  if (s.phase === 'work' && s.rest > 0) {
    return { ...s, phase: 'rest', left: s.rest };
  }
  if (s.round < s.rounds) {
    return { ...s, phase: 'work', round: s.round + 1, left: s.work };
  }
  return { ...s, phase: 'done', running: false, left: 0 };
}

function reducer(s: TimerState, a: Action): TimerState {
  switch (a.type) {
    case 'config':
      return init(a.preset);
    case 'toggle':
      if (s.phase === 'idle' || s.phase === 'done') {
        return { ...s, phase: 'work', round: 1, left: s.work, running: true };
      }
      return { ...s, running: !s.running };
    case 'reset':
      return { ...s, phase: 'idle', round: 1, left: s.work, running: false };
    case 'skip':
      if (s.phase === 'idle' || s.phase === 'done') return s;
      return advance(s);
    case 'tick':
      if (!s.running) return s;
      if (s.left > 1) return { ...s, left: s.left - 1 };
      return advance(s);
    default:
      return s;
  }
}

function fmt(total: number): string {
  const m = String(Math.floor(total / 60)).padStart(2, '0');
  const s = String(total % 60).padStart(2, '0');
  return `${m}:${s}`;
}

type QuickWorkoutProps = {
  seed?: WorkoutSeed | null;
  onClearSeed?: () => void;
};

export function QuickWorkout({ seed, onClearSeed }: QuickWorkoutProps) {
  const { t } = useLang();
  const [presetId, setPresetId] = usePersisted(K('workoutPreset'), 'tabata');
  const initialPreset =
    WORKOUT_PRESETS.find((p) => p.id === presetId) ?? WORKOUT_PRESETS[0];
  const [timer, dispatch] = useReducer(reducer, initialPreset, init);
  const [exercises, setExercises] = usePersisted<Exercise[]>(
    K('workoutEx'),
    DEFAULT_WORKOUT,
  );
  const [exName, setExName] = useState('');
  const [exDetail, setExDetail] = useState('');

  useEffect(() => {
    if (!seed) return;
    setExercises(
      seed.exercises.map((ex) => ({
        ...ex,
        id: ex.id || newId(),
        done: false,
      })),
    );
    if (seed.presetId) {
      const preset =
        WORKOUT_PRESETS.find((p) => p.id === seed.presetId) ??
        WORKOUT_PRESETS[0];
      setPresetId(preset.id);
      dispatch({ type: 'config', preset });
    }
  }, [seed, setExercises, setPresetId]);

  useEffect(() => {
    if (!timer.running) return;
    const id = setInterval(() => dispatch({ type: 'tick' }), 1000);
    return () => clearInterval(id);
  }, [timer.running]);

  const phaseColor = PHASE_COLOR[timer.phase];
  const displayTime =
    timer.phase === 'idle' ? fmt(timer.work) : fmt(timer.left);
  const doneCount = exercises.filter((ex) => ex.done).length;

  const addExercise = () => {
    const name = exName.trim();
    if (!name) return;
    setExercises([
      ...exercises,
      { id: newId(), name, detail: exDetail.trim(), done: false },
    ]);
    setExName('');
    setExDetail('');
  };

  return (
    <Panel accent="#ff6b2c">
      <SectionHeader
        eyebrow={t('Train')}
        title={t('Quick session')}
        subtitle={t('Move with intent — interval by interval.')}
        badge={t(PHASE_LABEL[timer.phase])}
        accent="#ff6b2c"
      />
      <View style={{ padding: 16, paddingTop: 0, gap: 14 }}>
        {seed ? (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: 12,
              borderRadius: 10,
              backgroundColor: '#ff6b2c18',
              borderWidth: 1,
              borderColor: '#ff6b2c44',
            }}
          >
            <Text style={{ color: colors.text, flex: 1 }}>
              {t('Loaded: {label}', { label: seed.label })}
            </Text>
            {onClearSeed ? (
              <Pressable onPress={onClearSeed}>
                <Text style={{ color: '#e6502f', fontWeight: '700' }}>
                  {t('Clear plan')}
                </Text>
              </Pressable>
            ) : null}
          </View>
        ) : null}

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {WORKOUT_PRESETS.map((p) => {
            const active = p.id === presetId;
            return (
              <Pressable
                key={p.id}
                onPress={() => {
                  setPresetId(p.id);
                  dispatch({ type: 'config', preset: p });
                }}
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  borderRadius: 12,
                  backgroundColor: active ? '#ff6b2c' : colors.bg,
                  borderWidth: 1,
                  borderColor: active ? '#ff6b2c' : colors.border,
                }}
              >
                <Text
                  style={{
                    fontWeight: '700',
                    color: active ? '#fff' : colors.text,
                  }}
                >
                  {t(p.label)}
                </Text>
                <Text
                  style={{
                    fontSize: 11,
                    color: active ? '#fff' : colors.muted,
                    marginTop: 2,
                  }}
                >
                  {p.tag}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View
          style={{
            alignItems: 'center',
            padding: 20,
            borderRadius: 14,
            borderWidth: 1,
            borderColor: `${phaseColor}55`,
            backgroundColor: `${phaseColor}10`,
            gap: 8,
          }}
        >
          <Text
            style={{
              fontSize: 12,
              fontWeight: '700',
              letterSpacing: 1,
              textTransform: 'uppercase',
              color: phaseColor,
            }}
          >
            {t(PHASE_LABEL[timer.phase])}
          </Text>
          <Text style={{ fontSize: 44, fontWeight: '800', color: colors.text }}>
            {displayTime}
          </Text>
          <Text style={{ color: colors.muted }}>
            {t('Round {n}/{total}', {
              n: timer.round,
              total: timer.rounds,
            })}
          </Text>
          <View style={{ flexDirection: 'row', gap: 10, marginTop: 8 }}>
            <Pressable
              onPress={() => dispatch({ type: 'reset' })}
              style={btnStyle(false)}
            >
              <Text style={{ fontWeight: '700', color: colors.text }}>↺</Text>
            </Pressable>
            <Pressable
              onPress={() => dispatch({ type: 'toggle' })}
              style={btnStyle(true)}
            >
              <Text style={{ fontWeight: '700', color: '#fff' }}>
                {timer.running ? '❚❚' : '▶'}
              </Text>
            </Pressable>
            <Pressable
              onPress={() => dispatch({ type: 'skip' })}
              style={btnStyle(false)}
            >
              <Text style={{ fontWeight: '700', color: colors.text }}>⏭</Text>
            </Pressable>
          </View>
        </View>

        <View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: 8,
            }}
          >
            <Text style={{ fontWeight: '700', color: colors.text }}>
              {t("Today's exercises")}
            </Text>
            {exercises.length > 0 ? (
              <Text style={{ color: colors.muted }}>
                {doneCount}/{exercises.length}
              </Text>
            ) : null}
          </View>
          <View style={{ flexDirection: 'row', gap: 8, marginBottom: 10 }}>
            <InlineField
              value={exName}
              onChangeText={setExName}
              placeholder={t('e.g. Push-ups')}
            />
            <InlineField
              value={exDetail}
              onChangeText={setExDetail}
              placeholder={t('3 × 12')}
            />
            <Pressable onPress={addExercise} style={btnStyle(true)}>
              <Text style={{ color: '#fff', fontWeight: '700' }}>+</Text>
            </Pressable>
          </View>
          {exercises.length === 0 ? (
            <Text style={{ color: colors.muted, fontSize: 13 }}>
              {t('No exercises yet — build your session above.')}
            </Text>
          ) : (
            exercises.map((ex) => (
              <View
                key={ex.id}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 10,
                  paddingVertical: 10,
                  borderBottomWidth: 1,
                  borderBottomColor: colors.border,
                }}
              >
                <Pressable
                  onPress={() =>
                    setExercises(
                      exercises.map((e) =>
                        e.id === ex.id ? { ...e, done: !e.done } : e,
                      ),
                    )
                  }
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 6,
                    borderWidth: 1.5,
                    borderColor: ex.done ? '#e63a2e' : colors.border,
                    backgroundColor: ex.done ? '#ff6b2c' : 'transparent',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {ex.done ? <CheckIcon size={11} color="#fff" /> : null}
                </Pressable>
                <Text
                  style={{
                    flex: 1,
                    fontWeight: '600',
                    color: colors.text,
                    opacity: ex.done ? 0.55 : 1,
                    textDecorationLine: ex.done ? 'line-through' : 'none',
                  }}
                >
                  {ex.name}
                </Text>
                {ex.detail ? (
                  <Text style={{ color: colors.muted, fontSize: 12 }}>
                    {ex.detail}
                  </Text>
                ) : null}
                <Pressable
                  onPress={() =>
                    setExercises(exercises.filter((e) => e.id !== ex.id))
                  }
                >
                  <Text style={{ color: colors.muted }}>×</Text>
                </Pressable>
              </View>
            ))
          )}
        </View>
      </View>
    </Panel>
  );
}

function btnStyle(primary: boolean) {
  return {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    backgroundColor: primary ? '#ff6b2c' : colors.bg,
    borderWidth: 1,
    borderColor: primary ? '#ff6b2c' : colors.border,
  };
}
