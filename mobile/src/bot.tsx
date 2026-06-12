import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import {
  Animated,
  Easing,
  PanResponder,
  Pressable,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Svg, {
  Circle,
  Defs,
  Ellipse,
  G,
  LinearGradient,
  Path,
  RadialGradient,
  Rect,
  Stop,
} from 'react-native-svg';

import type { DailySummary } from '@shared/types';

import { api } from './api';
import { todayStr } from './date';
import { useLang, type TFn } from './i18n';
import { colors } from './theme';

type Mood =
  | 'happy'
  | 'cheer'
  | 'warn'
  | 'think'
  | 'sad'
  | 'dragged'
  | 'annoyed';

// ----- On/off context (persisted) -----
const STORAGE_KEY = 'nutrilens_bot_enabled';

interface BotState {
  enabled: boolean;
  setEnabled: (on: boolean) => void;
}

const BotContext = createContext<BotState | undefined>(undefined);

export function BotProvider({ children }: { children: ReactNode }) {
  const [enabled, setEnabledState] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((v) => {
        if (v === 'off') setEnabledState(false);
      })
      .catch(() => undefined);
  }, []);

  const setEnabled = useCallback((on: boolean) => {
    setEnabledState(on);
    AsyncStorage.setItem(STORAGE_KEY, on ? 'on' : 'off').catch(() => undefined);
  }, []);

  const value = useMemo(() => ({ enabled, setEnabled }), [enabled, setEnabled]);
  return <BotContext.Provider value={value}>{children}</BotContext.Provider>;
}

export function useBot(): BotState {
  const ctx = useContext(BotContext);
  if (!ctx) throw new Error('useBot must be used within BotProvider');
  return ctx;
}

// ----- Messages / logic (shared with web behaviour) -----
const QUESTIONS = [
  { id: 'calo', label: 'How many calories left?' },
  { id: 'protein', label: 'Enough protein yet?' },
  { id: 'next', label: 'Suggest my next meal?' },
  { id: 'how', label: 'How am I doing today?' },
];

const DRAG_MESSAGES = [
  'Whoa... put me down!',
  'Wheee, so dizzy!',
  'Hey hey, slow down!',
];
const ANNOYED_MESSAGES = [
  'Hmph, stop dragging me!',
  'That was a bit much!',
  'Let me do my job!',
];

function pick(arr: string[]): string {
  return arr[Math.floor(Math.random() * arr.length)];
}

function clamp(v: number, min: number, max: number): number {
  return Math.min(Math.max(v, min), max);
}

function deriveMood(
  data: DailySummary | null,
  t: TFn,
): { mood: Mood; messages: string[] } {
  const goal = data?.goal;
  const consumed = Math.round(data?.totals.calories ?? 0);
  const protein = Math.round(data?.totals.protein ?? 0);

  if (!goal || goal.calorie_target <= 0) {
    return {
      mood: 'happy',
      messages: [
        t('Hi! Add a meal so I can track it.'),
        t('What did you eat today? Log it for me!'),
      ],
    };
  }
  const target = goal.calorie_target;
  const remaining = Math.max(0, Math.round(target - consumed));
  const over = Math.max(0, Math.round(consumed - target));
  const pct = Math.round((consumed / target) * 100);
  const proteinLow =
    goal.protein_target > 0 && protein < goal.protein_target * 0.6;

  if (consumed === 0) {
    return {
      mood: 'happy',
      messages: [
        t('First meal! I am waiting.'),
        t("Today's goal: {target} kcal.", { target }),
      ],
    };
  }
  if (pct < 85) {
    const msgs = [
      t('{pct}% of goal, {remaining} kcal to go!', { pct, remaining }),
      t('On the right track, take it easy.'),
    ];
    if (proteinLow) msgs.push(t('Protein is a bit low, add some!'));
    return { mood: 'happy', messages: msgs };
  }
  if (pct <= 100) {
    return {
      mood: 'cheer',
      messages: [
        t('Almost at your goal! {remaining} kcal left.', { remaining }),
        t('Close to the finish!'),
      ],
    };
  }
  if (pct <= 110) {
    return {
      mood: 'cheer',
      messages: [
        t('Calorie goal reached today!'),
        t('Great, right on target!'),
      ],
    };
  }
  return {
    mood: 'warn',
    messages: [
      t('{over} kcal over your goal.', { over }),
      t('A bit too much, balance it tomorrow!'),
    ],
  };
}

function answerFor(id: string, data: DailySummary | null, t: TFn): string {
  const goal = data?.goal;
  const consumed = Math.round(data?.totals.calories ?? 0);
  const protein = Math.round(data?.totals.protein ?? 0);
  if (!goal || goal.calorie_target <= 0) {
    return t("I don't know your goal yet. Set one in Profile!");
  }
  const remaining = Math.round(goal.calorie_target - consumed);
  const over = consumed - goal.calorie_target;
  switch (id) {
    case 'calo':
      if (over > 0)
        return t('You are {over} kcal over your goal.', {
          over: Math.round(over),
        });
      if (remaining <= 0) return t('You just hit your calorie goal!');
      return t('You have {remaining} kcal left for today.', { remaining });
    case 'protein': {
      const pt = goal.protein_target;
      if (!pt) return t('You had {protein}g protein.', { protein });
      const note =
        protein >= pt * 0.9 ? t('Looking good!') : t('Add a bit more protein!');
      return t('Protein: {protein}/{pt}g. {note}', { protein, pt, note });
    }
    case 'next':
      if (over > 0 || remaining <= 0)
        return t('Enough for today, drink water and rest!');
      if (remaining < 350)
        return t('{remaining} kcal left, a light snack fits.', { remaining });
      return t('{remaining} kcal left, you can have a full meal!', {
        remaining,
      });
    default:
      return deriveMood(data, t).messages[0];
  }
}

const MOOD_ACCENT: Record<Mood, string> = {
  happy: '#10b981',
  cheer: '#059669',
  warn: '#f59e0b',
  think: colors.blue,
  sad: '#94a3b8',
  dragged: '#38bdf8',
  annoyed: '#f59e0b',
};

// ----- Chibi SVG character -----
const VB_W = 80;
const VB_H = 88;
const EYE_Y = 36.5;
const INK = '#0f172a';
const SKIN = '#ffe9dc';
const HAIR_EDGE = '#c8d2e0';
const SUIT_EDGE = '#c3cedd';

function starPath(cx: number, cy: number, r: number): string {
  const m = r * 0.3;
  return (
    `M ${cx} ${cy - r} L ${cx + m} ${cy - m} L ${cx + r} ${cy} ` +
    `L ${cx + m} ${cy + m} L ${cx} ${cy + r} L ${cx - m} ${cy + m} ` +
    `L ${cx - r} ${cy} L ${cx - m} ${cy - m} Z`
  );
}

function OpenEye({ cx }: { cx: number }) {
  const cy = EYE_Y;
  return (
    <G>
      <Ellipse cx={cx} cy={cy} rx={5} ry={6} fill={INK} />
      <Ellipse cx={cx} cy={cy + 0.4} rx={4.1} ry={5.2} fill="url(#nbIris)" />
      <Ellipse
        cx={cx}
        cy={cy + 2.6}
        rx={2.5}
        ry={1.9}
        fill="#bfdbfe"
        opacity={0.75}
      />
      <Path d={starPath(cx, cy - 0.8, 2.4)} fill="#ffffff" />
      <Circle
        cx={cx + 1.7}
        cy={cy + 2.9}
        r={0.8}
        fill="#ffffff"
        opacity={0.9}
      />
      <Path
        d={`M ${cx - 5.4} ${cy - 2.4} Q ${cx} ${cy - 8} ${cx + 5.4} ${cy - 2.4}`}
        stroke={INK}
        strokeWidth={1.7}
        fill="none"
        strokeLinecap="round"
      />
    </G>
  );
}

function HalfEye({ cx }: { cx: number }) {
  const cy = EYE_Y;
  return (
    <G>
      <Ellipse cx={cx} cy={cy} rx={5} ry={6} fill={INK} />
      <Ellipse cx={cx} cy={cy + 0.4} rx={4.1} ry={5.2} fill="url(#nbIris)" />
      <Path
        d={`M ${cx - 5.6} ${cy - 7} L ${cx + 5.6} ${cy - 7} L ${cx + 5.6} ${cy - 0.6} Q ${cx} ${cy - 3} ${cx - 5.6} ${cy - 0.6} Z`}
        fill={SKIN}
      />
      <Path
        d={`M ${cx - 5} ${cy - 0.8} Q ${cx} ${cy - 3.2} ${cx + 5} ${cy - 0.8}`}
        stroke={INK}
        strokeWidth={1.6}
        fill="none"
        strokeLinecap="round"
      />
    </G>
  );
}

function WideEye({ cx }: { cx: number }) {
  const cy = EYE_Y;
  return (
    <G>
      <Ellipse
        cx={cx}
        cy={cy}
        rx={6.2}
        ry={7.2}
        fill="#ffffff"
        stroke={INK}
        strokeWidth={1.4}
      />
      <Ellipse cx={cx} cy={cy + 0.6} rx={3.4} ry={4} fill="url(#nbIris)" />
      <Circle cx={cx - 1} cy={cy - 1.2} r={1.1} fill="#ffffff" />
    </G>
  );
}

function FlatEye({ cx }: { cx: number }) {
  const cy = EYE_Y;
  return (
    <Path
      d={`M ${cx - 5} ${cy} L ${cx + 5} ${cy}`}
      stroke={INK}
      strokeWidth={2}
      strokeLinecap="round"
    />
  );
}

function Eyes({ mood }: { mood: Mood }) {
  const L = 32;
  const R = 48;
  const cy = EYE_Y;
  if (mood === 'dragged')
    return (
      <G>
        <WideEye cx={L} />
        <WideEye cx={R} />
      </G>
    );
  if (mood === 'annoyed')
    return (
      <G>
        <FlatEye cx={L} />
        <FlatEye cx={R} />
      </G>
    );
  if (mood === 'cheer') {
    return (
      <G stroke={INK} strokeWidth={2} fill="none" strokeLinecap="round">
        <Path
          d={`M ${L - 4.6} ${cy + 1} Q ${L} ${cy - 4.5} ${L + 4.6} ${cy + 1}`}
        />
        <Path
          d={`M ${R - 4.6} ${cy + 1} Q ${R} ${cy - 4.5} ${R + 4.6} ${cy + 1}`}
        />
      </G>
    );
  }
  if (mood === 'sad') {
    return (
      <G>
        <G stroke={INK} strokeWidth={2} fill="none" strokeLinecap="round">
          <Path
            d={`M ${L - 4.6} ${cy - 1.2} Q ${L} ${cy + 2.6} ${L + 4.6} ${cy - 1.2}`}
          />
          <Path
            d={`M ${R - 4.6} ${cy - 1.2} Q ${R} ${cy + 2.6} ${R + 4.6} ${cy - 1.2}`}
          />
        </G>
        <Ellipse
          cx={R + 4.4}
          cy={cy + 4.6}
          rx={1.2}
          ry={1.8}
          fill="#7dd3fc"
          opacity={0.9}
        />
      </G>
    );
  }
  if (mood === 'think')
    return (
      <G>
        <HalfEye cx={L} />
        <HalfEye cx={R} />
      </G>
    );
  return (
    <G>
      <OpenEye cx={L} />
      <OpenEye cx={R} />
    </G>
  );
}

function Brows({ mood }: { mood: Mood }) {
  if (mood === 'annoyed') {
    return (
      <G stroke={INK} strokeWidth={1.6} fill="none" strokeLinecap="round">
        <Path d="M 27.5 28.5 L 35.5 31" />
        <Path d="M 52.5 28.5 L 44.5 31" />
      </G>
    );
  }
  if (mood === 'dragged') {
    return (
      <G stroke={INK} strokeWidth={1.4} fill="none" strokeLinecap="round">
        <Path d="M 27.5 26.5 Q 32 24.5 36 26" />
        <Path d="M 44 26 Q 48 24.5 52.5 26.5" />
      </G>
    );
  }
  if (mood === 'warn' || mood === 'sad') {
    return (
      <G
        stroke={INK}
        strokeWidth={1.3}
        fill="none"
        strokeLinecap="round"
        opacity={0.85}
      >
        <Path d="M 27.8 30.6 Q 32 28.8 35.8 30" />
        <Path d="M 44.2 30 Q 48 28.8 52.2 30.6" />
      </G>
    );
  }
  if (mood === 'think') {
    return (
      <G
        stroke={INK}
        strokeWidth={1.3}
        fill="none"
        strokeLinecap="round"
        opacity={0.85}
      >
        <Path d="M 27.8 29.6 Q 32 28.2 36 29.4" />
        <Path d="M 44 30.2 Q 48 29.6 52.2 30.4" />
      </G>
    );
  }
  return null;
}

function Mouth({ mood }: { mood: Mood }) {
  switch (mood) {
    case 'dragged':
      return <Ellipse cx={40} cy={47.4} rx={2.6} ry={3.2} fill="#9f1239" />;
    case 'cheer':
      return (
        <Path
          d="M 35.6 45.4 Q 40 46.4 44.4 45.4 Q 43.4 50.8 40 50.8 Q 36.6 50.8 35.6 45.4 Z"
          fill="#fb7185"
          stroke="#be123c"
          strokeWidth={0.7}
        />
      );
    case 'warn':
      return (
        <Path
          d="M 37.2 46.8 L 42.8 46.8"
          stroke="#be123c"
          strokeWidth={1.4}
          strokeLinecap="round"
        />
      );
    case 'think':
      return (
        <Path
          d="M 40.6 46.9 Q 42.4 47.8 44 46.4"
          stroke="#be123c"
          strokeWidth={1.3}
          strokeLinecap="round"
          fill="none"
        />
      );
    case 'sad':
      return (
        <Path
          d="M 36.8 47.9 Q 40 45.2 43.2 47.9"
          stroke="#be123c"
          strokeWidth={1.4}
          strokeLinecap="round"
          fill="none"
        />
      );
    case 'annoyed':
      return (
        <Path
          d="M 36.6 47.6 Q 40 46 43.4 47.8"
          stroke="#be123c"
          strokeWidth={1.4}
          strokeLinecap="round"
          fill="none"
        />
      );
    default:
      return (
        <Path
          d="M 36.6 45.9 Q 40 48.7 43.4 45.9"
          stroke="#be123c"
          strokeWidth={1.4}
          strokeLinecap="round"
          fill="none"
        />
      );
  }
}

function FaceFx({ mood }: { mood: Mood }) {
  if (mood === 'dragged') {
    return (
      <Path
        d="M 55 30 q 2.4 3.2 0 4.6 q -2.4 -1.4 0 -4.6 Z"
        fill="#7dd3fc"
        opacity={0.9}
      />
    );
  }
  if (mood === 'annoyed') {
    return (
      <G stroke="#ef4444" strokeWidth={1.2} strokeLinecap="round" opacity={0.9}>
        <Path d="M 55 24.2 L 55 29.8 M 52.2 27 L 57.8 27" />
      </G>
    );
  }
  return null;
}

export function ChibiBot({ mood, size }: { mood: Mood; size: number }) {
  const accent = MOOD_ACCENT[mood];
  const blush = mood === 'sad' ? 0.3 : 0.45;
  return (
    <Svg
      width={size}
      height={(size * VB_H) / VB_W}
      viewBox={`0 0 ${VB_W} ${VB_H}`}
    >
      <Defs>
        <LinearGradient id="nbHair" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#ffffff" />
          <Stop offset="1" stopColor="#d7e0ec" />
        </LinearGradient>
        <LinearGradient id="nbSuit" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#ffffff" />
          <Stop offset="1" stopColor="#dbe4f0" />
        </LinearGradient>
        <LinearGradient id="nbBlue" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#60a5fa" />
          <Stop offset="1" stopColor="#2563eb" />
        </LinearGradient>
        <RadialGradient id="nbIris" cx="50%" cy="35%" r="75%">
          <Stop offset="0" stopColor="#93c5fd" />
          <Stop offset="0.55" stopColor="#3b82f6" />
          <Stop offset="1" stopColor="#1e3a8a" />
        </RadialGradient>
        <RadialGradient id="nbSkin" cx="50%" cy="40%" r="85%">
          <Stop offset="0" stopColor="#fff3ea" />
          <Stop offset="1" stopColor="#ffdfcd" />
        </RadialGradient>
      </Defs>

      <Path
        d="M 40 3.5 C 20 3.5 12.5 18 13.5 32 C 14 42 11 51 8.5 57.5 C 15.5 57 19.5 53 21.5 48.5 C 23 52 26 54.5 29 55.5 L 51 55.5 C 54 54.5 57 52 58.5 48.5 C 60.5 53 64.5 57 71.5 57.5 C 69 51 66 42 66.5 32 C 67.5 18 60 3.5 40 3.5 Z"
        fill="url(#nbHair)"
        stroke={HAIR_EDGE}
        strokeWidth={0.7}
      />

      <Path
        d="M 36.3 70.5 L 35.6 78.5"
        stroke="#eef2f7"
        strokeWidth={5}
        strokeLinecap="round"
      />
      <Path
        d="M 43.7 70.5 L 44.4 78.5"
        stroke="#eef2f7"
        strokeWidth={5}
        strokeLinecap="round"
      />
      <Rect
        x={31}
        y={78.8}
        width={8.6}
        height={7}
        rx={3.1}
        fill="url(#nbBlue)"
        stroke="#1d4ed8"
        strokeWidth={0.5}
      />
      <Rect
        x={40.4}
        y={78.8}
        width={8.6}
        height={7}
        rx={3.1}
        fill="url(#nbBlue)"
        stroke="#1d4ed8"
        strokeWidth={0.5}
      />

      <Path
        d="M 31.5 59.5 C 26 63.5 21.5 70 19.5 75 C 25.5 73 30.5 69 32.8 65.5 Z"
        fill="url(#nbSuit)"
        stroke="#bfdbfe"
        strokeWidth={0.6}
      />
      <Path
        d="M 48.5 59.5 C 54 63.5 58.5 70 60.5 75 C 54.5 73 49.5 69 47.2 65.5 Z"
        fill="url(#nbSuit)"
        stroke="#bfdbfe"
        strokeWidth={0.6}
      />

      <Path
        d="M 30.5 55.5 L 26.5 58.5"
        stroke="#334155"
        strokeWidth={5}
        strokeLinecap="round"
      />
      <Path
        d="M 49.5 55.5 L 53.5 58.5"
        stroke="#334155"
        strokeWidth={5}
        strokeLinecap="round"
      />
      <Path
        d="M 26.5 58.5 L 23 61.4"
        stroke="#f8fafc"
        strokeWidth={4.6}
        strokeLinecap="round"
      />
      <Path
        d="M 53.5 58.5 L 57 61.4"
        stroke="#f8fafc"
        strokeWidth={4.6}
        strokeLinecap="round"
      />
      <Circle
        cx={21}
        cy={63}
        r={3.1}
        fill="url(#nbBlue)"
        stroke="#1e40af"
        strokeWidth={0.5}
      />
      <Circle
        cx={59}
        cy={63}
        r={3.1}
        fill="url(#nbBlue)"
        stroke="#1e40af"
        strokeWidth={0.5}
      />

      <Path
        d="M 32 52.5 C 29.5 55 28.5 62 30.5 67.5 C 32 70.8 34.5 72 40 72 C 45.5 72 48 70.8 49.5 67.5 C 51.5 62 50.5 55 48 52.5 C 45 50.8 35 50.8 32 52.5 Z"
        fill="url(#nbSuit)"
        stroke={SUIT_EDGE}
        strokeWidth={0.7}
      />
      <Path
        d="M 33.8 51.7 C 36.3 50.7 43.7 50.7 46.2 51.7 L 45.2 54.2 C 41.8 53.2 38.2 53.2 34.8 54.2 Z"
        fill="#1f2937"
      />
      <Circle cx={40} cy={59.5} r={4.8} fill={accent} opacity={0.18} />
      <Circle cx={40} cy={59.5} r={3.2} fill="#ffffff" />
      <Circle cx={40} cy={59.5} r={2.2} fill={accent} />

      <Ellipse cx={40} cy={35} rx={18.5} ry={16} fill="url(#nbSkin)" />
      <Ellipse
        cx={27.5}
        cy={42.5}
        rx={3.3}
        ry={1.9}
        fill="#fb7185"
        opacity={blush}
      />
      <Ellipse
        cx={52.5}
        cy={42.5}
        rx={3.3}
        ry={1.9}
        fill="#fb7185"
        opacity={blush}
      />

      <Eyes mood={mood} />
      <Brows mood={mood} />
      <Mouth mood={mood} />
      <FaceFx mood={mood} />

      <Path
        d="M 22.5 31 C 21 17 29 9.5 40 9.5 C 51 9.5 59 17 57.5 31 C 55 25.5 53 23.5 50.2 28.5 C 47.5 22.5 44 21.8 40.8 27.5 C 38 21.8 34.5 22.3 32.5 28 C 29.5 23 26.5 25 22.5 31 Z"
        fill="url(#nbHair)"
        stroke={HAIR_EDGE}
        strokeWidth={0.6}
      />
      <Path
        d="M 26.5 12.5 C 31 8.5 49 8.5 53.5 12.5"
        stroke="#ffffff"
        strokeWidth={2.4}
        fill="none"
        strokeLinecap="round"
        opacity={0.9}
      />
    </Svg>
  );
}

// ----- Roaming + draggable overlay -----
const BOT_W = 60;
const BOT_H = (BOT_W * VB_H) / VB_W;
const MARGIN = 16;
const TAB_RESERVE = 76;
const TOP_RESERVE = 120;
const MOVE_MS = 5200;
const IDLE_THINK_MS = 13000;
const THINK_MS = 2400;
const ANSWER_MS = 7000;

export function NutriBot() {
  const { enabled } = useBot();
  // When disabled the bot is hidden entirely; the sad face lives in Profile.
  if (!enabled) return null;
  return <RoamingBot />;
}

function RoamingBot() {
  const { t } = useLang();
  const { width: W, height: H } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const minX = MARGIN;
  const maxX = W - BOT_W - MARGIN;
  const minY = insets.top + TOP_RESERVE;
  const maxY = H - BOT_H - insets.bottom - TAB_RESERVE;

  const corner = useMemo(() => ({ x: maxX, y: maxY }), [maxX, maxY]);
  const randomTarget = useCallback(() => {
    const x0 = Math.max(minX, corner.x - 130);
    const y0 = Math.max(minY, corner.y - 200);
    return {
      x: x0 + Math.random() * Math.max(1, corner.x - x0),
      y: y0 + Math.random() * Math.max(1, corner.y - y0),
    };
  }, [corner, minX, minY]);

  const pan = useRef(new Animated.ValueXY(corner)).current;
  const posRef = useRef({ ...corner });
  const float = useRef(new Animated.Value(0)).current;
  const wobble = useRef(new Animated.Value(0)).current;

  const [summary, setSummary] = useState<DailySummary | null>(null);
  const [mood, setMood] = useState<Mood>('happy');
  const [thinking, setThinking] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [annoyed, setAnnoyed] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [answer, setAnswer] = useState<string | null>(null);
  const [facingLeft, setFacingLeft] = useState(false);

  const movedRef = useRef(false);
  const startRef = useRef({ ...corner });
  const dragMsg = useRef(pick(DRAG_MESSAGES));
  const annoyedMsg = useRef(pick(ANNOYED_MESSAGES));

  const base = useMemo(() => deriveMood(summary, t), [summary, t]);

  // Keep the data-driven mood unless overridden by an interaction.
  useEffect(() => {
    setMood(base.mood);
  }, [base.mood]);

  const shownMood: Mood = dragging
    ? 'dragged'
    : annoyed
      ? 'annoyed'
      : thinking
        ? 'think'
        : mood;

  const paused = dragging || annoyed || panelOpen;

  useEffect(() => {
    const id = pan.addListener((v) => {
      posRef.current = v;
    });
    return () => pan.removeListener(id);
  }, [pan]);

  // Load today's summary.
  useEffect(() => {
    let alive = true;
    const load = () =>
      api
        .summary(todayStr())
        .then((s) => alive && setSummary(s))
        .catch(() => undefined);
    void load();
    const id = setInterval(load, 60_000);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, []);

  // Gentle float.
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(float, {
          toValue: 1,
          duration: 1700,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(float, {
          toValue: 0,
          duration: 1700,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [float]);

  // Wobble while being dragged.
  useEffect(() => {
    if (!dragging) {
      wobble.setValue(0);
      return;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(wobble, {
          toValue: 1,
          duration: 220,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(wobble, {
          toValue: -1,
          duration: 220,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [dragging, wobble]);

  // Wander.
  useEffect(() => {
    const id = setInterval(() => {
      if (paused) return;
      const target = randomTarget();
      setFacingLeft(target.x < posRef.current.x);
      Animated.timing(pan, {
        toValue: target,
        duration: 1400,
        easing: Easing.inOut(Easing.cubic),
        useNativeDriver: false,
      }).start();
    }, MOVE_MS);
    return () => clearInterval(id);
  }, [paused, pan, randomTarget]);

  // Idle thinking moments.
  useEffect(() => {
    const id = setInterval(() => {
      if (paused || answer) return;
      setThinking(true);
      setTimeout(() => setThinking(false), THINK_MS);
    }, IDLE_THINK_MS);
    return () => clearInterval(id);
  }, [paused, answer]);

  const responder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_e, g) => Math.hypot(g.dx, g.dy) > 3,
      onPanResponderGrant: () => {
        movedRef.current = false;
        // Freeze the position at grab time so drag tracks the finger 1:1.
        pan.stopAnimation((value) => {
          startRef.current = value as { x: number; y: number };
        });
      },
      onPanResponderMove: (_e, g) => {
        const start = startRef.current;
        const nx = clamp(start.x + g.dx, minX, maxX);
        const ny = clamp(start.y + g.dy, minY, maxY);
        if (!movedRef.current && Math.hypot(g.dx, g.dy) > 4) {
          movedRef.current = true;
          dragMsg.current = pick(DRAG_MESSAGES);
          setDragging(true);
        }
        if (movedRef.current) {
          setFacingLeft(g.dx < 0);
          pan.setValue({ x: nx, y: ny });
        }
      },
      onPanResponderRelease: () => {
        if (movedRef.current) {
          setDragging(false);
          annoyedMsg.current = pick(ANNOYED_MESSAGES);
          setAnnoyed(true);
          setTimeout(() => setAnnoyed(false), 1800);
        } else {
          setPanelOpen((o) => !o);
        }
      },
      onPanResponderTerminate: () => setDragging(false),
    }),
  ).current;

  function ask(qid: string) {
    setPanelOpen(false);
    setThinking(true);
    setTimeout(() => {
      setThinking(false);
      setAnswer(answerFor(qid, summary, t));
      setTimeout(() => setAnswer(null), ANSWER_MS);
    }, 800);
  }

  const onLeftHalf = posRef.current.x < W / 2;
  const bubbleText = dragging
    ? t(dragMsg.current)
    : annoyed
      ? t(annoyedMsg.current)
      : (answer ?? null);
  const bubbleVisible = !panelOpen && !!bubbleText;

  const floatY = float.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -5],
  });
  const rotate = wobble.interpolate({
    inputRange: [-1, 1],
    outputRange: ['-9deg', '9deg'],
  });
  const styles = makeStyles();

  return (
    <Animated.View pointerEvents="box-none" style={[styles.layer]}>
      <Animated.View
        style={[
          styles.mover,
          { width: BOT_W, transform: pan.getTranslateTransform() },
        ]}
      >
        {bubbleVisible && (
          <View
            pointerEvents="none"
            style={[
              styles.bubble,
              onLeftHalf ? styles.bubbleLeft : styles.bubbleRight,
            ]}
          >
            <Text style={styles.bubbleText}>{bubbleText}</Text>
          </View>
        )}

        {panelOpen && (
          <View
            style={[
              styles.panel,
              onLeftHalf ? styles.bubbleLeft : styles.bubbleRight,
            ]}
          >
            <Text style={styles.panelTitle}>{t('Ask NutriBot')}</Text>
            {QUESTIONS.map((q) => (
              <Pressable
                key={q.id}
                onPress={() => ask(q.id)}
                style={({ pressed }) => [
                  styles.chip,
                  pressed && styles.chipPressed,
                ]}
              >
                <Text style={styles.chipText}>{t(q.label)}</Text>
              </Pressable>
            ))}
          </View>
        )}

        <Animated.View
          {...responder.panHandlers}
          style={{ transform: [{ translateY: floatY }] }}
        >
          <Animated.View
            style={{ transform: [{ scaleX: facingLeft ? -1 : 1 }, { rotate }] }}
          >
            <ChibiBot mood={shownMood} size={BOT_W} />
          </Animated.View>
        </Animated.View>
      </Animated.View>
    </Animated.View>
  );
}

function makeStyles() {
  return {
    layer: {
      position: 'absolute' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 50,
    },
    mover: {
      position: 'absolute' as const,
      top: 0,
      left: 0,
      alignItems: 'center' as const,
    },
    bubble: {
      position: 'absolute' as const,
      bottom: BOT_H + 8,
      maxWidth: 220,
      minWidth: 120,
      backgroundColor: colors.card,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: colors.border,
      paddingVertical: 8,
      paddingHorizontal: 12,
      shadowColor: '#0f172a',
      shadowOpacity: 0.16,
      shadowRadius: 14,
      shadowOffset: { width: 0, height: 6 },
      elevation: 5,
    },
    bubbleLeft: { left: 0 },
    bubbleRight: { right: 0 },
    bubbleText: {
      fontSize: 13,
      fontWeight: '500' as const,
      color: colors.text,
      lineHeight: 18,
    },
    panel: {
      position: 'absolute' as const,
      bottom: BOT_H + 8,
      width: 200,
      backgroundColor: colors.card,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 10,
      gap: 6,
      shadowColor: '#0f172a',
      shadowOpacity: 0.2,
      shadowRadius: 18,
      shadowOffset: { width: 0, height: 8 },
      elevation: 8,
    },
    panelTitle: {
      fontSize: 12,
      fontWeight: '700' as const,
      color: colors.muted,
      paddingHorizontal: 2,
    },
    chip: {
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.chipBg,
      borderRadius: 10,
      paddingVertical: 9,
      paddingHorizontal: 11,
    },
    chipPressed: {
      backgroundColor: colors.brandLight,
      borderColor: colors.brand,
    },
    chipText: {
      fontSize: 13,
      fontWeight: '500' as const,
      color: colors.text,
    },
    sadCard: {
      position: 'absolute' as const,
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      gap: 10,
      paddingVertical: 10,
      paddingHorizontal: 12,
      backgroundColor: colors.card,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.border,
      shadowColor: '#0f172a',
      shadowOpacity: 0.18,
      shadowRadius: 16,
      shadowOffset: { width: 0, height: 8 },
      elevation: 6,
    },
    sadText: { gap: 2 },
    sadTitle: { fontSize: 14, fontWeight: '700' as const, color: colors.text },
    sadHint: { fontSize: 12, color: colors.muted },
  };
}
