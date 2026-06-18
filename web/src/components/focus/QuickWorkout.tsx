import { useLang } from '@src/i18n';
import { useEffect, useReducer, useState } from 'react';
import { newId, usePersisted } from '@src/hooks/FocusHooks';
import {
  DEFAULT_WORKOUT,
  Exercise,
  K,
  WORKOUT_PRESETS,
  WorkoutPreset,
} from './constants';
import { Panel } from '@src/pages/StFocus';
import {
  DumbbellIcon,
  PauseIcon,
  PlayIcon,
  PlusIcon,
  RotateCcwIcon,
} from '../BaseIcons';
import {
  WorkoutAdd,
  WorkoutAppliedBanner,
  WorkoutAppliedClear,
  WorkoutBody,
  WorkoutBrand,
  WorkoutBtn,
  WorkoutCheck,
  WorkoutControls,
  WorkoutDetail,
  WorkoutDelete,
  WorkoutDot,
  WorkoutDots,
  WorkoutEmpty,
  WorkoutEyebrow,
  WorkoutField,
  WorkoutFoot,
  WorkoutHero,
  WorkoutItem,
  WorkoutList,
  WorkoutListCaption,
  WorkoutListCard,
  WorkoutListHead,
  WorkoutListTitle,
  WorkoutLogo,
  WorkoutMain,
  WorkoutMeta,
  WorkoutName,
  WorkoutPhase,
  WorkoutPreset as PresetBtn,
  WorkoutPresetName,
  WorkoutPresets,
  WorkoutPresetTag,
  WorkoutRing,
  WorkoutRingInner,
  WorkoutRoundLabel,
  WorkoutRow,
  WorkoutStage,
  WorkoutStatus,
  WorkoutSub,
  WorkoutTime,
  WorkoutTimerCard,
  WorkoutTitle,
} from './StWorkoutPanel';

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

type QuickWorkoutProps = {
  seed?: WorkoutSeed | null;
  onClearSeed?: () => void;
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

function fmt(total: number): string {
  const m = String(Math.floor(total / 60)).padStart(2, '0');
  const s = String(total % 60).padStart(2, '0');
  return `${m}:${s}`;
}

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
    const id = window.setInterval(() => dispatch({ type: 'tick' }), 1000);
    return () => window.clearInterval(id);
  }, [timer.running]);

  const pickPreset = (preset: WorkoutPreset) => {
    setPresetId(preset.id);
    dispatch({ type: 'config', preset });
  };

  const phaseTotal = timer.phase === 'rest' ? timer.rest : timer.work || 1;
  const progress =
    timer.phase === 'idle'
      ? 1
      : timer.phase === 'done'
        ? 1
        : timer.left / phaseTotal;
  const color = PHASE_COLOR[timer.phase];
  const displayTime =
    timer.phase === 'idle' ? fmt(timer.work) : fmt(timer.left);

  const addExercise = (e: React.FormEvent) => {
    e.preventDefault();
    const name = exName.trim();
    if (!name) return;
    setExercises([
      ...exercises,
      { id: newId(), name, detail: exDetail.trim(), done: false },
    ]);
    setExName('');
    setExDetail('');
  };

  const toggleEx = (id: string) =>
    setExercises(
      exercises.map((ex) => (ex.id === id ? { ...ex, done: !ex.done } : ex)),
    );

  const removeEx = (id: string) =>
    setExercises(exercises.filter((ex) => ex.id !== id));

  const doneCount = exercises.filter((ex) => ex.done).length;

  return (
    <Panel>
      <WorkoutStage>
        <WorkoutHero>
          <WorkoutBrand>
            <WorkoutLogo aria-hidden="true">
              <DumbbellIcon size={22} />
            </WorkoutLogo>
            <div>
              <WorkoutEyebrow>{t('Train')}</WorkoutEyebrow>
              <WorkoutTitle>{t('Quick session')}</WorkoutTitle>
              <WorkoutSub>{t('Move with intent — interval by interval.')}</WorkoutSub>
            </div>
          </WorkoutBrand>
          <WorkoutStatus $phase={timer.phase}>
            {t(PHASE_LABEL[timer.phase])}
          </WorkoutStatus>
        </WorkoutHero>

        <WorkoutBody>
          {seed && (
            <WorkoutAppliedBanner>
              <span>{t('Loaded: {label}', { label: seed.label })}</span>
              {onClearSeed && (
                <WorkoutAppliedClear type="button" onClick={onClearSeed}>
                  {t('Clear plan')}
                </WorkoutAppliedClear>
              )}
            </WorkoutAppliedBanner>
          )}

          <WorkoutPresets>
            {WORKOUT_PRESETS.map((p) => {
              const active = p.id === presetId;
              return (
                <PresetBtn
                  key={p.id}
                  type="button"
                  $active={active}
                  onClick={() => pickPreset(p)}
                >
                  <WorkoutPresetName>{t(p.label)}</WorkoutPresetName>
                  <WorkoutPresetTag $active={active}>{p.tag}</WorkoutPresetTag>
                </PresetBtn>
              );
            })}
          </WorkoutPresets>

          <WorkoutMain>
            <WorkoutTimerCard $phase={timer.phase}>
              <WorkoutRing
                $progress={progress}
                $color={color}
                $running={timer.running}
              >
                <svg viewBox="0 0 120 120" aria-hidden="true">
                  <circle className="track" cx="60" cy="60" r="52" />
                  <circle className="fill" cx="60" cy="60" r="52" />
                </svg>
                <WorkoutRingInner>
                  <WorkoutPhase $color={color}>
                    {t(PHASE_LABEL[timer.phase])}
                  </WorkoutPhase>
                  <WorkoutTime>{displayTime}</WorkoutTime>
                  <WorkoutRoundLabel>
                    {t('Round {n}/{total}', {
                      n: timer.round,
                      total: timer.rounds,
                    })}
                  </WorkoutRoundLabel>
                </WorkoutRingInner>
              </WorkoutRing>

              <WorkoutDots>
                {Array.from({ length: timer.rounds }).map((_, i) => {
                  const idx = i + 1;
                  const state =
                    timer.phase === 'done' || idx < timer.round
                      ? 'done'
                      : idx === timer.round && timer.phase !== 'idle'
                        ? 'active'
                        : 'todo';
                  return <WorkoutDot key={i} $state={state} />;
                })}
              </WorkoutDots>

              <WorkoutControls>
                <WorkoutBtn
                  type="button"
                  onClick={() => dispatch({ type: 'reset' })}
                  aria-label={t('Reset')}
                  title={t('Reset')}
                >
                  <RotateCcwIcon size={18} />
                </WorkoutBtn>
                <WorkoutBtn
                  type="button"
                  $primary
                  onClick={() => dispatch({ type: 'toggle' })}
                  aria-label={timer.running ? t('Pause') : t('Start')}
                  title={timer.running ? t('Pause') : t('Start')}
                >
                  {timer.running ? (
                    <PauseIcon size={20} />
                  ) : (
                    <PlayIcon size={20} />
                  )}
                </WorkoutBtn>
                <WorkoutBtn
                  type="button"
                  onClick={() => dispatch({ type: 'skip' })}
                  aria-label={t('Skip')}
                  title={t('Skip')}
                >
                  <SkipIcon />
                </WorkoutBtn>
              </WorkoutControls>
            </WorkoutTimerCard>

            <WorkoutListCard>
              <WorkoutListHead>
                <div>
                  <WorkoutListCaption>{t('Session')}</WorkoutListCaption>
                  <WorkoutListTitle>{t("Today's exercises")}</WorkoutListTitle>
                </div>
                {exercises.length > 0 && (
                  <WorkoutMeta>
                    {doneCount}/{exercises.length}
                  </WorkoutMeta>
                )}
              </WorkoutListHead>

              <WorkoutRow onSubmit={addExercise}>
                <WorkoutField
                  value={exName}
                  onChange={(e) => setExName(e.target.value)}
                  placeholder={t('e.g. Push-ups')}
                  aria-label={t('Exercise name')}
                />
                <WorkoutField
                  value={exDetail}
                  onChange={(e) => setExDetail(e.target.value)}
                  placeholder={t('3 × 12')}
                  aria-label={t('Sets and reps')}
                />
                <WorkoutAdd type="submit" aria-label={t('Add')}>
                  <PlusIcon size={16} />
                </WorkoutAdd>
              </WorkoutRow>

              {exercises.length === 0 ? (
                <WorkoutEmpty>
                  {t('No exercises yet — build your session above.')}
                </WorkoutEmpty>
              ) : (
                <WorkoutList>
                  {exercises.map((ex) => (
                    <WorkoutItem key={ex.id} $done={ex.done}>
                      <WorkoutCheck
                        type="button"
                        $done={ex.done}
                        onClick={() => toggleEx(ex.id)}
                        aria-pressed={ex.done}
                        aria-label={t('Toggle exercise')}
                      />
                      <WorkoutName $done={ex.done}>{ex.name}</WorkoutName>
                      {ex.detail && <WorkoutDetail>{ex.detail}</WorkoutDetail>}
                      <WorkoutDelete
                        type="button"
                        onClick={() => removeEx(ex.id)}
                        aria-label={t('Remove')}
                      >
                        &times;
                      </WorkoutDelete>
                    </WorkoutItem>
                  ))}
                </WorkoutList>
              )}
            </WorkoutListCard>
          </WorkoutMain>

          <WorkoutFoot>
            {t('Tip: pick a preset, press start, and move with the timer.')}
          </WorkoutFoot>
        </WorkoutBody>
      </WorkoutStage>
    </Panel>
  );
}

function SkipIcon() {
  return (
    <svg
      width={18}
      height={18}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polygon points="5 4 15 12 5 20 5 4" />
      <line x1="19" y1="5" x2="19" y2="19" />
    </svg>
  );
}
