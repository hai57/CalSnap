import { useLang } from '@src/i18n';
import { useState } from 'react';
import { usePersisted } from '@src/hooks/FocusHooks';
import { K } from './constants';
import { QuickWorkout, type WorkoutSeed } from './QuickWorkout';
import { WorkoutPrograms } from './WorkoutProgramsPanel';
import {
  WorkoutModeNav,
  WorkoutModeTab,
  WorkoutModeWrap,
} from './StWorkoutPanel';

type WorkoutMode = 'quick' | 'programs';

export function WorkoutPanel() {
  const { t } = useLang();
  const [mode, setMode] = usePersisted<WorkoutMode>(K('workoutMode'), 'quick');
  const [seed, setSeed] = useState<WorkoutSeed | null>(null);

  const applyDay = (next: WorkoutSeed) => {
    setSeed(next);
    setMode('quick');
  };

  return (
    <WorkoutModeWrap>
      <WorkoutModeNav role="tablist" aria-label={t('Workout mode')}>
        <WorkoutModeTab
          type="button"
          role="tab"
          aria-selected={mode === 'quick'}
          $active={mode === 'quick'}
          onClick={() => setMode('quick')}
        >
          {t('Quick session')}
        </WorkoutModeTab>
        <WorkoutModeTab
          type="button"
          role="tab"
          aria-selected={mode === 'programs'}
          $active={mode === 'programs'}
          onClick={() => setMode('programs')}
        >
          {t('Training programs')}
        </WorkoutModeTab>
      </WorkoutModeNav>

      {mode === 'quick' ? (
        <QuickWorkout seed={seed} onClearSeed={() => setSeed(null)} />
      ) : (
        <WorkoutPrograms onApplyDay={applyDay} />
      )}
    </WorkoutModeWrap>
  );
}
