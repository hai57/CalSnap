import { useLang } from '@src/i18n';
import { useEffect, useRef, useState } from 'react';
import { MODES } from './constants';
import {
  IconButton,
  Pill,
  TimerControls,
  TimerDisplay,
  TimerModes,
  TimerRing,
  TimerWrap,
} from '@src/pages/StFocus';
import { PauseIcon, PlayIcon, RotateCcwIcon } from '../BaseIcons';

export function PomodoroTimer() {
  const { t } = useLang();
  const [modeId, setModeId] = useState(MODES[0].id);
  const mode = MODES.find((m) => m.id === modeId) ?? MODES[0];
  const total = mode.minutes * 60;
  const [remaining, setRemaining] = useState(total);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (!running) return;
    intervalRef.current = window.setInterval(() => {
      setRemaining((s) => {
        if (s <= 1) {
          setRunning(false);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, [running]);

  const selectMode = (id: string) => {
    const m = MODES.find((x) => x.id === id) ?? MODES[0];
    setModeId(id);
    setRunning(false);
    setRemaining(m.minutes * 60);
  };

  const reset = () => {
    setRunning(false);
    setRemaining(mode.minutes * 60);
  };

  const mm = String(Math.floor(remaining / 60)).padStart(2, '0');
  const ss = String(remaining % 60).padStart(2, '0');
  const progress = total > 0 ? remaining / total : 0;

  return (
    <TimerWrap>
      <TimerModes>
        {MODES.map((m) => (
          <Pill
            key={m.id}
            type="button"
            $active={m.id === modeId}
            onClick={() => selectMode(m.id)}
          >
            {t(m.label)}
          </Pill>
        ))}
      </TimerModes>

      <TimerRing $progress={progress} $running={running}>
        <svg viewBox="0 0 120 120" aria-hidden="true">
          <circle className="track" cx="60" cy="60" r="52" />
          <circle className="fill" cx="60" cy="60" r="52" />
        </svg>
        <TimerDisplay $running={running}>
          {mm}:{ss}
        </TimerDisplay>
      </TimerRing>

      <TimerControls>
        <IconButton
          type="button"
          $primary
          onClick={() => setRunning((r) => !r)}
          aria-label={running ? t('Pause') : t('Start')}
          title={running ? t('Pause') : t('Start')}
        >
          {running ? <PauseIcon size={18} /> : <PlayIcon size={18} />}
        </IconButton>
        <IconButton
          type="button"
          onClick={reset}
          aria-label={t('Reset')}
          title={t('Reset')}
        >
          <RotateCcwIcon size={18} />
        </IconButton>
      </TimerControls>
    </TimerWrap>
  );
}
