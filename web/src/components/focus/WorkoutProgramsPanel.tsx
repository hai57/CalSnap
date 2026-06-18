import { useLang } from '@src/i18n';
import { useState } from 'react';
import { newId, usePersisted } from '@src/hooks/FocusHooks';
import { K } from './constants';
import { Panel } from '@src/pages/StFocus';
import type { WorkoutSeed } from './QuickWorkout';
import {
  TRAINING_PROGRAMS,
  TrainingDay,
  TrainingProgram,
} from './workoutProgramData';
import {
  PaywallActions,
  PaywallCard,
  PaywallGhost,
  PaywallList,
  PaywallOverlay,
  PaywallPrice,
  PaywallPrimary,
  PaywallSub,
  PaywallTitle,
  TrainingApplyBtn,
  TrainingBack,
  TrainingBadge,
  TrainingBlock,
  TrainingBlockTitle,
  TrainingCard,
  TrainingCardMeta,
  TrainingCardTagline,
  TrainingCardTitle,
  TrainingCoach,
  TrainingDayTab,
  TrainingDayTabs,
  TrainingDetail,
  TrainingDetailHead,
  TrainingDetailTitle,
  TrainingExerciseItem,
  TrainingExerciseList,
  TrainingFocus,
  TrainingGrid,
  TrainingIntro,
  TrainingMealItem,
  TrainingMealList,
  TrainingMealMacros,
  TrainingMealName,
  TrainingMealNote,
  TrainingPrice,
  TrainingSplit,
  WorkoutBody,
  WorkoutBrand,
  WorkoutEyebrow,
  WorkoutHero,
  WorkoutLogo,
  WorkoutStage,
  WorkoutSub,
  WorkoutTitle,
} from './StWorkoutPanel';
import { DumbbellIcon } from '../BaseIcons';

type TrainingProgramsProps = {
  onApplyDay: (seed: WorkoutSeed) => void;
};

export function WorkoutPrograms({ onApplyDay }: TrainingProgramsProps) {
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
      <Panel>
        <WorkoutStage>
          <WorkoutBody style={{ paddingTop: '1.5rem' }}>
            <TrainingDetail $accent={selected.accent}>
              <TrainingDetailHead>
                <div>
                  <TrainingBack type="button" onClick={() => setSelected(null)}>
                    ← {t('All programs')}
                  </TrainingBack>
                  <TrainingDetailTitle>{t(selected.title)}</TrainingDetailTitle>
                  <TrainingCoach>
                    {t('Coach')}: {selected.coach} · {selected.weeks}{' '}
                    {t('weeks')} · {selected.daysPerWeek} {t('days/week')}
                  </TrainingCoach>
                </div>
                <TrainingBadge $tier={selected.tier}>
                  {selected.tier === 'free' ? t('Free') : t('Pro')}
                </TrainingBadge>
              </TrainingDetailHead>

              <TrainingDayTabs>
                {selected.days.map((d, i) => (
                  <TrainingDayTab
                    key={d.day}
                    type="button"
                    $active={i === dayIdx}
                    $accent={selected.accent}
                    onClick={() => setDayIdx(i)}
                  >
                    {d.label}
                  </TrainingDayTab>
                ))}
              </TrainingDayTabs>

              <TrainingFocus>{day.focus}</TrainingFocus>

              <TrainingSplit>
                <TrainingBlock>
                  <TrainingBlockTitle>{t('Workout')}</TrainingBlockTitle>
                  <TrainingExerciseList>
                    {day.exercises.map((ex) => (
                      <TrainingExerciseItem key={ex.name}>
                        <span>{ex.name}</span>
                        <span>{ex.detail}</span>
                      </TrainingExerciseItem>
                    ))}
                  </TrainingExerciseList>
                </TrainingBlock>

                <TrainingBlock>
                  <TrainingBlockTitle>{t('Meals')}</TrainingBlockTitle>
                  <TrainingMealList>
                    {day.meals.map((meal) => (
                      <TrainingMealItem key={meal.name}>
                        <TrainingMealName>
                          {meal.name}
                          {meal.note && (
                            <TrainingMealNote>· {t(meal.note)}</TrainingMealNote>
                          )}
                        </TrainingMealName>
                        <TrainingMealMacros>
                          {meal.kcal} kcal · P {meal.protein}g · C {meal.carbs}g
                          · F {meal.fat}g
                        </TrainingMealMacros>
                      </TrainingMealItem>
                    ))}
                  </TrainingMealList>
                </TrainingBlock>
              </TrainingSplit>

              <TrainingApplyBtn
                type="button"
                onClick={() => applyDay(selected, day)}
              >
                {t('Start this session')}
              </TrainingApplyBtn>
            </TrainingDetail>
          </WorkoutBody>
        </WorkoutStage>

        {paywall && (
          <PaywallModal
            program={paywall}
            onUnlock={unlockPro}
            onClose={() => setPaywall(null)}
          />
        )}
      </Panel>
    );
  }

  return (
    <Panel>
      <WorkoutStage>
        <WorkoutHero>
          <WorkoutBrand>
            <WorkoutLogo aria-hidden="true">
              <DumbbellIcon size={22} />
            </WorkoutLogo>
            <div>
              <WorkoutEyebrow>{t('Programs')}</WorkoutEyebrow>
              <WorkoutTitle>{t('Training lectures')}</WorkoutTitle>
              <WorkoutSub>
                {t('Guided workouts with meal pairings — optional Pro plans.')}
              </WorkoutSub>
            </div>
          </WorkoutBrand>
        </WorkoutHero>

        <WorkoutBody>
          <TrainingIntro>
            {t(
              'Use free programs anytime, or unlock Pro for coach-led plans with specific workouts and meals. Skip this entirely and stay on Quick session if you prefer.',
            )}
          </TrainingIntro>

          <TrainingGrid>
            {TRAINING_PROGRAMS.map((program) => (
              <TrainingCard
                key={program.id}
                type="button"
                $accent={program.accent}
                onClick={() => openProgram(program)}
              >
                <TrainingBadge $tier={program.tier}>
                  {program.tier === 'free' ? t('Free') : t('Pro')}
                </TrainingBadge>
                <TrainingCardTitle>{t(program.title)}</TrainingCardTitle>
                <TrainingCardMeta>
                  {program.coach} · {program.weeks} {t('weeks')}
                </TrainingCardMeta>
                <TrainingCardTagline>{t(program.tagline)}</TrainingCardTagline>
                {program.tier === 'pro' && program.priceLabel && (
                  <TrainingPrice>{program.priceLabel}</TrainingPrice>
                )}
              </TrainingCard>
            ))}
          </TrainingGrid>
        </WorkoutBody>
      </WorkoutStage>

      {paywall && (
        <PaywallModal
          program={paywall}
          onUnlock={unlockPro}
          onClose={() => setPaywall(null)}
        />
      )}
    </Panel>
  );
}

function PaywallModal({
  program,
  onUnlock,
  onClose,
}: {
  program: TrainingProgram;
  onUnlock: () => void;
  onClose: () => void;
}) {
  const { t } = useLang();

  return (
    <PaywallOverlay role="dialog" aria-modal="true" onClick={onClose}>
      <PaywallCard onClick={(e) => e.stopPropagation()}>
        <PaywallTitle>{t('NutriLens Pro Training')}</PaywallTitle>
        <PaywallSub>
          {t('Unlock "{title}" and all Pro lectures.', {
            title: t(program.title),
          })}
        </PaywallSub>
        <PaywallList>
          <li>{t('Structured multi-week workout plans')}</li>
          <li>{t('Meal suggestions matched to each session')}</li>
          <li>{t('Macro targets aligned with your nutrition goals')}</li>
        </PaywallList>
        {program.priceLabel && (
          <PaywallPrice>{program.priceLabel}</PaywallPrice>
        )}
        <PaywallActions>
          <PaywallPrimary type="button" onClick={onUnlock}>
            {t('Unlock Pro (demo)')}
          </PaywallPrimary>
          <PaywallGhost type="button" onClick={onClose}>
            {t('Not now — keep using free tools')}
          </PaywallGhost>
        </PaywallActions>
      </PaywallCard>
    </PaywallOverlay>
  );
}
