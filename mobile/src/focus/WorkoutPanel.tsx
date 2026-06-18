import { useState } from 'react';
import { View } from 'react-native';

import { K } from '@shared/focus/constants';
import { usePersisted } from '../hooks/focusHooks';
import { useLang } from '../i18n';
import { QuickWorkout, type WorkoutSeed } from './QuickWorkout';
import { WorkoutPrograms } from './WorkoutProgramsPanel';
import { TabRow } from './ui';

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
    <View style={{ gap: 12 }}>
      <TabRow
        tabs={[
          { id: 'quick' as const, label: t('Quick session') },
          { id: 'programs' as const, label: t('Training programs') },
        ]}
        active={mode}
        onChange={setMode}
      />
      {mode === 'quick' ? (
        <QuickWorkout seed={seed} onClearSeed={() => setSeed(null)} />
      ) : (
        <WorkoutPrograms onApplyDay={applyDay} />
      )}
    </View>
  );
}
