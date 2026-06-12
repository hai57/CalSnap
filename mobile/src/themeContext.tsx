import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactElement,
  type ReactNode,
} from 'react';
import { Appearance, Pressable, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Svg, { Circle, G, Line, Path, Rect } from 'react-native-svg';

import { applyPalette, colors, type ColorScheme } from './theme';

export type ThemeMode = 'system' | 'light' | 'dark';

const STORAGE_KEY = 'nutrilens_theme_mode';

interface ThemeState {
  mode: ThemeMode;
  scheme: ColorScheme;
  version: number;
  setMode: (m: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeState | undefined>(undefined);

function resolve(mode: ThemeMode, system: ColorScheme): ColorScheme {
  return mode === 'system' ? system : mode;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>('system');
  const [system, setSystem] = useState<ColorScheme>(
    Appearance.getColorScheme() === 'dark' ? 'dark' : 'light',
  );
  const [version, setVersion] = useState(0);

  // Apply palette before first paint of children.
  const scheme = resolve(mode, system);
  applyPalette(scheme);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((v) => {
        if (v === 'light' || v === 'dark' || v === 'system') {
          setModeState(v);
          setVersion((n) => n + 1);
        }
      })
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    const sub = Appearance.addChangeListener(({ colorScheme }) => {
      setSystem(colorScheme === 'dark' ? 'dark' : 'light');
      setVersion((n) => n + 1);
    });
    return () => sub.remove();
  }, []);

  const setMode = useCallback((m: ThemeMode) => {
    setModeState(m);
    setVersion((n) => n + 1);
    AsyncStorage.setItem(STORAGE_KEY, m).catch(() => undefined);
  }, []);

  const value = useMemo<ThemeState>(
    () => ({ mode, scheme, version, setMode }),
    [mode, scheme, version, setMode],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeState {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}

type IconProps = { size: number; color: string };

function MonitorIcon({ size, color }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x={2} y={3} width={20} height={14} rx={2} stroke={color} strokeWidth={2} />
      <Line x1={8} y1={21} x2={16} y2={21} stroke={color} strokeWidth={2} strokeLinecap="round" />
      <Line x1={12} y1={17} x2={12} y2={21} stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

function SunIcon({ size, color }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={12} r={4} stroke={color} strokeWidth={2} />
      <G stroke={color} strokeWidth={2} strokeLinecap="round">
        <Line x1={12} y1={1.5} x2={12} y2={3.5} />
        <Line x1={12} y1={20.5} x2={12} y2={22.5} />
        <Line x1={1.5} y1={12} x2={3.5} y2={12} />
        <Line x1={20.5} y1={12} x2={22.5} y2={12} />
        <Line x1={4.2} y1={4.2} x2={5.6} y2={5.6} />
        <Line x1={18.4} y1={18.4} x2={19.8} y2={19.8} />
        <Line x1={4.2} y1={19.8} x2={5.6} y2={18.4} />
        <Line x1={18.4} y1={5.6} x2={19.8} y2={4.2} />
      </G>
    </Svg>
  );
}

function MoonIcon({ size, color }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"
        stroke={color}
        strokeWidth={2}
        strokeLinejoin="round"
      />
    </Svg>
  );
}

const OPTIONS: { key: ThemeMode; Icon: (p: IconProps) => ReactElement }[] = [
  { key: 'system', Icon: MonitorIcon },
  { key: 'light', Icon: SunIcon },
  { key: 'dark', Icon: MoonIcon },
];

export function ThemeToggle() {
  const { mode, setMode } = useTheme();
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.chipBg,
        padding: 3,
      }}
    >
      {OPTIONS.map(({ key, Icon }) => {
        const active = key === mode;
        return (
          <Pressable
            key={key}
            onPress={() => setMode(key)}
            style={{
              width: 34,
              height: 34,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 8,
              backgroundColor: active ? colors.card : 'transparent',
              shadowColor: '#0f172a',
              shadowOpacity: active ? 0.18 : 0,
              shadowRadius: 4,
              shadowOffset: { width: 0, height: 1 },
              elevation: active ? 2 : 0,
            }}
          >
            <Icon size={17} color={active ? colors.brand : colors.muted} />
          </Pressable>
        );
      })}
    </View>
  );
}
