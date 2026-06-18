import { useLang } from '../i18n';
import {
  DisplayTitle,
  Eyebrow,
  Shell,
  TopBar,
  TopBarCopy,
} from './StFocus';
import { Clock } from '@src/components/focus/Clock';
import { WorkoutPanel } from '@src/components/focus/WorkoutPanel';

export function Workout() {
  const { t } = useLang();

  return (
    <Shell>
      <TopBar>
        <TopBarCopy>
          <Eyebrow>{t('Workout')}</Eyebrow>
          <DisplayTitle>{t('Train with intent.')}</DisplayTitle>
        </TopBarCopy>
        <Clock />
      </TopBar>

      <WorkoutPanel />
    </Shell>
  );
}
