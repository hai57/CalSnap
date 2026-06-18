import { useEffect, useRef, useState } from 'react';
import { Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

import { MODES } from '@shared/focus/constants';
import { useLang } from '../i18n';
import { colors } from '../theme';
import { IconBtn, Pill } from './ui';

export function PomodoroTimer() {
  const { t } = useLang();
  const [modeId, setModeId] = useState(MODES[0].id);
  const mode = MODES.find((m) => m.id === modeId) ?? MODES[0];
  const total = mode.minutes * 60;
  const [remaining, setRemaining] = useState(total);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!running) return;
    intervalRef.current = setInterval(() => {
      setRemaining((s) => {
        if (s <= 1) {
          setRunning(false);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
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
  const r = 52;
  const c = 2 * Math.PI * r;

  return (
    <View style={{ alignItems: 'center', gap: 14 }}>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
        {MODES.map((m) => (
          <Pill
            key={m.id}
            label={t(m.label)}
            active={m.id === modeId}
            onPress={() => selectMode(m.id)}
          />
        ))}
      </View>

      <View style={{ width: 160, height: 160, alignItems: 'center', justifyContent: 'center' }}>
        <Svg width={160} height={160} style={{ position: 'absolute' }}>
          <Circle
            cx={80}
            cy={80}
            r={r}
            stroke={colors.border}
            strokeWidth={5}
            fill="none"
          />
          <Circle
            cx={80}
            cy={80}
            r={r}
            stroke={colors.brand}
            strokeWidth={5}
            fill="none"
            strokeDasharray={`${c}`}
            strokeDashoffset={c * (1 - progress)}
            strokeLinecap="round"
            rotation={-90}
            origin="80, 80"
          />
        </Svg>
        <Text style={{ fontSize: 32, fontWeight: '800', color: colors.text }}>
          {mm}:{ss}
        </Text>
      </View>

      <View style={{ flexDirection: 'row', gap: 10 }}>
        <IconBtn label="↺" onPress={reset} />
        <IconBtn
          label={running ? '❚❚' : '▶'}
          primary
          onPress={() => setRunning((v) => !v)}
        />
      </View>
    </View>
  );
}
