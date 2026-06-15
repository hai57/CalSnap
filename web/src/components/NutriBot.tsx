import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import { useQuery } from '@tanstack/react-query';

import type { DailySummary } from '@shared/types';

import { useBot } from '../bot/BotContext';
import { useLang } from '../i18n';
import { api } from '../lib/api';
import { todayStr } from '../lib/date';
import { colors } from '../styles/theme';
import {
  Anchor,
  ANSWER_HOLD_MS,
  BOT_H,
  BOT_W,
  BotSvg,
  Bubble,
  Chip,
  EYE_Y,
  Flip,
  HAIR_EDGE,
  IDLE_THINK_MS,
  INK,
  Layer,
  MARGIN,
  MESSAGE_MS,
  MOVE_MS,
  Mover,
  Panel,
  PanelTitle,
  ROAM_X,
  ROAM_Y,
  Robot,
  SadCard,
  SadText,
  SadWrap,
  SKIN,
  SUIT_EDGE,
  THINK_DURATION,
  TOP_RESERVE,
  VB_H,
  VB_W,
} from './StNutriBot';

type TFn = (key: string, params?: Record<string, string | number>) => string;

type Mood =
  | 'happy'
  | 'cheer'
  | 'warn'
  | 'think'
  | 'sad'
  | 'dragged'
  | 'annoyed';

interface BotState {
  mood: Mood;
  messages: string[];
}

interface Question {
  id: string;
  label: string;
}

const QUESTIONS: Question[] = [
  { id: 'calo', label: 'How many calories left?' },
  { id: 'protein', label: 'Enough protein yet?' },
  { id: 'next', label: 'Suggest my next meal?' },
  { id: 'how', label: 'How am I doing today?' },
];

function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  );
}

type Side = 'left' | 'right';

function cornerTarget(side: Side = 'right') {
  if (typeof window === 'undefined') return { x: 24, y: 24 };
  return {
    x: side === 'left' ? MARGIN : window.innerWidth - BOT_W - MARGIN,
    y: window.innerHeight - BOT_H - MARGIN,
  };
}

function randomTarget(side: Side = 'right') {
  const corner = cornerTarget(side);
  const minY = Math.max(TOP_RESERVE, corner.y - ROAM_Y);
  const y = minY + Math.random() * (corner.y - minY);
  if (side === 'left') {
    const maxX = Math.min(window.innerWidth - BOT_W - MARGIN, corner.x + ROAM_X);
    return { x: corner.x + Math.random() * (maxX - corner.x), y };
  }
  const minX = Math.max(MARGIN, corner.x - ROAM_X);
  return { x: minX + Math.random() * (corner.x - minX), y };
}

function deriveState(data: DailySummary | undefined, t: TFn): BotState {
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
        t("Today's goal: {target} kcal. Let's start!", { target }),
      ],
    };
  }
  if (pct < 50) {
    const msgs = [
      t('Only {pct}% of goal, {remaining} kcal to go!', { pct, remaining }),
      t('On the right track, take it easy.'),
    ];
    if (proteinLow) msgs.push(t('Protein is a bit low, add some!'));
    return { mood: 'happy', messages: msgs };
  }
  if (pct < 85) {
    const msgs = [
      t('{pct}% already! {remaining} kcal left for today.', { pct, remaining }),
      t('Nice, keep it up!'),
    ];
    if (proteinLow) msgs.push(t("Don't forget to add protein!"));
    return { mood: 'happy', messages: msgs };
  }
  if (pct <= 100) {
    return {
      mood: 'cheer',
      messages: [
        t('Almost at your goal! {remaining} kcal left.', { remaining }),
        t('Close to the finish, watch the last meal.'),
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

// Answer a quick question using the day's summary.
function answerFor(id: string, data: DailySummary | undefined, t: TFn): string {
  const goal = data?.goal;
  const totals = data?.totals;
  const consumed = Math.round(totals?.calories ?? 0);
  const protein = Math.round(totals?.protein ?? 0);

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
      const ok = protein >= pt * 0.9;
      const note = ok ? t('Looking good!') : t('Add a bit more protein!');
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
    case 'how':
    default:
      return deriveState(data, t).messages[0];
  }
}

export function NutriBot({ side = 'right' }: { side?: Side }) {
  const { enabled, setEnabled } = useBot();
  if (!enabled) return <SadBox onWake={() => setEnabled(true)} />;
  return <RoamingBot side={side} />;
}

function RoamingBot({ side }: { side: Side }) {
  const { t } = useLang();
  const day = todayStr();
  const { data } = useQuery<DailySummary>({
    queryKey: ['summary', day],
    queryFn: () => api.summary(day),
    staleTime: 30_000,
  });

  const reduced = useRef(prefersReducedMotion());
  const [pos, setPos] = useState(() =>
    reduced.current ? cornerTarget(side) : randomTarget(side),
  );
  const [facingLeft, setFacingLeft] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [msgIndex, setMsgIndex] = useState(0);

  const [panelOpen, setPanelOpen] = useState(false);
  const [thinking, setThinking] = useState(false);
  const [answer, setAnswer] = useState<string | null>(null);

  const [dragging, setDragging] = useState(false);
  const [moved, setMoved] = useState(false);
  const [annoyed, setAnnoyed] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const dragStart = useRef({ x: 0, y: 0 });
  const movedRef = useRef(false);
  const dragMsg = useRef(pick(DRAG_MESSAGES));
  const annoyedMsg = useRef(pick(ANNOYED_MESSAGES));

  const { mood: dataMood, messages } = useMemo(
    () => deriveState(data, t),
    [data, t],
  );
  const mood: Mood = moved
    ? 'dragged'
    : annoyed
      ? 'annoyed'
      : thinking
        ? 'think'
        : dataMood;
  const paused = hovered || panelOpen || dragging || annoyed;

  useEffect(() => {
    setMsgIndex(0);
  }, [dataMood, messages.length]);

  // Wander (paused while interacting).
  useEffect(() => {
    if (reduced.current) return;
    const id = window.setInterval(() => {
      if (paused) return;
      setPos((prev) => {
        const next = randomTarget(side);
        setFacingLeft(next.x < prev.x);
        return next;
      });
    }, MOVE_MS);
    return () => window.clearInterval(id);
  }, [paused, side]);

  useEffect(() => {
    const onResize = () =>
      setPos(reduced.current ? cornerTarget(side) : randomTarget(side));
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [side]);

  // Rotate the status message shown on hover (no auto popup when idle).
  useEffect(() => {
    const id = window.setInterval(() => {
      if (answer || panelOpen) return;
      setMsgIndex((i) => (i + 1) % messages.length);
    }, MESSAGE_MS);
    return () => window.clearInterval(id);
  }, [messages.length, answer, panelOpen]);

  // Occasionally "think" for a human-like idle moment.
  useEffect(() => {
    if (reduced.current) return;
    const id = window.setInterval(() => {
      if (paused || answer) return;
      setThinking(true);
      window.setTimeout(() => setThinking(false), THINK_DURATION);
    }, IDLE_THINK_MS);
    return () => window.clearInterval(id);
  }, [paused, answer]);

  function ask(q: Question) {
    setPanelOpen(false);
    setThinking(true);
    window.setTimeout(() => {
      setThinking(false);
      setAnswer(answerFor(q.id, data, t));
      window.setTimeout(() => {
        setAnswer(null);
      }, ANSWER_HOLD_MS);
    }, 900);
  }

  function onPointerDown(e: ReactPointerEvent) {
    e.currentTarget.setPointerCapture(e.pointerId);
    dragOffset.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };
    dragStart.current = { x: e.clientX, y: e.clientY };
    movedRef.current = false;
    setMoved(false);
    setAnnoyed(false);
    setDragging(true);
  }

  function onPointerMove(e: ReactPointerEvent) {
    if (!dragging) return;
    const nx = clamp(
      e.clientX - dragOffset.current.x,
      4,
      window.innerWidth - BOT_W - 4,
    );
    const ny = clamp(
      e.clientY - dragOffset.current.y,
      4,
      window.innerHeight - BOT_H - 4,
    );
    const dist = Math.hypot(
      e.clientX - dragStart.current.x,
      e.clientY - dragStart.current.y,
    );
    if (dist > 4 && !movedRef.current) {
      movedRef.current = true;
      dragMsg.current = pick(DRAG_MESSAGES);
      setMoved(true);
    }
    if (movedRef.current) setFacingLeft(nx < pos.x);
    setPos({ x: nx, y: ny });
  }

  function endDrag(e: ReactPointerEvent) {
    if (!dragging) return;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // pointer may already be released
    }
    setDragging(false);
    if (movedRef.current) {
      setMoved(false);
      annoyedMsg.current = pick(ANNOYED_MESSAGES);
      setAnnoyed(true);
      window.setTimeout(() => setAnnoyed(false), 1800);
    }
  }

  function onClick() {
    if (movedRef.current) {
      movedRef.current = false;
      return;
    }
    setPanelOpen((o) => !o);
  }

  const onLeftHalf = pos.x < window.innerWidth / 2;
  const bubbleText = moved
    ? t(dragMsg.current)
    : annoyed
      ? t(annoyedMsg.current)
      : thinking
        ? t('Hmm, let me see...')
        : (answer ?? messages[msgIndex] ?? messages[0]);
  const bubbleVisible = !panelOpen && (hovered || moved || annoyed || !!answer);

  return (
    <Layer aria-hidden>
      <Mover
        style={{ transform: `translate(${pos.x}px, ${pos.y}px)` }}
        $reduced={reduced.current}
        $dragging={dragging}
      >
        <Anchor
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onClick={onClick}
          $dragging={dragging}
          role="button"
          tabIndex={0}
          aria-label={t('NutriBot nutrition assistant')}
        >
          <Bubble $visible={bubbleVisible} $left={onLeftHalf}>
            {bubbleText}
          </Bubble>

          <Panel
            $visible={panelOpen}
            $left={onLeftHalf}
            onClick={(e) => e.stopPropagation()}
          >
            <PanelTitle>{t('Ask NutriBot')}</PanelTitle>
            {QUESTIONS.map((q) => (
              <Chip key={q.id} type="button" onClick={() => ask(q)}>
                {t(q.label)}
              </Chip>
            ))}
          </Panel>

          <Robot $dragging={moved}>
            <Flip $facingLeft={facingLeft}>
              <ChibiBot mood={mood} />
            </Flip>
          </Robot>
        </Anchor>
      </Mover>
    </Layer>
  );
}

// Shown when the bot is switched off: a small box with a sad face.
function SadBox({ onWake }: { onWake: () => void }) {
  const { t } = useLang();
  return (
    <SadWrap>
      <SadCard
        type="button"
        onClick={onWake}
        title={t('Wake NutriBot up')}
        aria-label={t('Wake NutriBot up')}
      >
        <Robot $still>
          <ChibiBot mood="sad" width={46} />
        </Robot>
        <SadText>
          <strong>{t('NutriBot is sleeping')}</strong>
          <span>{t('Tap to wake me up')}</span>
        </SadText>
      </SadCard>
    </SadWrap>
  );
}

const MOOD_ACCENT: Record<Mood, string> = {
  happy: colors.brand500,
  cheer: colors.brand600,
  warn: '#f59e0b',
  think: colors.blue500,
  sad: colors.slate400,
  dragged: '#38bdf8',
  annoyed: '#f59e0b',
};

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

function star(cx: number, cy: number, r: number): string {
  const m = r * 0.3;
  return (
    `M ${cx} ${cy - r} L ${cx + m} ${cy - m} L ${cx + r} ${cy} ` +
    `L ${cx + m} ${cy + m} L ${cx} ${cy + r} L ${cx - m} ${cy + m} ` +
    `L ${cx - r} ${cy} L ${cx - m} ${cy - m} Z`
  );
}

function OpenEye({ cx, animate }: { cx: number; animate: boolean }) {
  const cy = EYE_Y;
  return (
    <g className={animate ? 'nb-blink' : undefined}>
      <ellipse cx={cx} cy={cy} rx={5} ry={6} fill={INK} />
      <ellipse cx={cx} cy={cy + 0.4} rx={4.1} ry={5.2} fill="url(#nbIris)" />
      <ellipse
        cx={cx}
        cy={cy + 2.6}
        rx={2.5}
        ry={1.9}
        fill="#bfdbfe"
        opacity={0.75}
      />
      <path d={star(cx, cy - 0.8, 2.4)} fill="#ffffff" />
      <circle
        cx={cx + 1.7}
        cy={cy + 2.9}
        r={0.8}
        fill="#ffffff"
        opacity={0.9}
      />
      <path
        d={`M ${cx - 5.4} ${cy - 2.4} Q ${cx} ${cy - 8} ${cx + 5.4} ${cy - 2.4}`}
        stroke={INK}
        strokeWidth={1.7}
        fill="none"
        strokeLinecap="round"
      />
    </g>
  );
}

function HalfEye({ cx }: { cx: number }) {
  const cy = EYE_Y;
  return (
    <g>
      <ellipse cx={cx} cy={cy} rx={5} ry={6} fill={INK} />
      <ellipse cx={cx} cy={cy + 0.4} rx={4.1} ry={5.2} fill="url(#nbIris)" />
      <path
        d={`M ${cx - 5.6} ${cy - 7} L ${cx + 5.6} ${cy - 7} L ${cx + 5.6} ${cy - 0.6} Q ${cx} ${cy - 3} ${cx - 5.6} ${cy - 0.6} Z`}
        fill={SKIN}
      />
      <path
        d={`M ${cx - 5} ${cy - 0.8} Q ${cx} ${cy - 3.2} ${cx + 5} ${cy - 0.8}`}
        stroke={INK}
        strokeWidth={1.6}
        fill="none"
        strokeLinecap="round"
      />
      <circle
        cx={cx + 1.6}
        cy={cy + 2.6}
        r={0.8}
        fill="#ffffff"
        opacity={0.85}
      />
    </g>
  );
}

function WideEye({ cx }: { cx: number }) {
  const cy = EYE_Y;
  return (
    <g>
      <ellipse
        cx={cx}
        cy={cy}
        rx={6.2}
        ry={7.2}
        fill="#ffffff"
        stroke={INK}
        strokeWidth={1.4}
      />
      <ellipse cx={cx} cy={cy + 0.6} rx={3.4} ry={4} fill="url(#nbIris)" />
      <circle cx={cx - 1} cy={cy - 1.2} r={1.1} fill="#ffffff" />
    </g>
  );
}

function FlatEye({ cx }: { cx: number }) {
  const cy = EYE_Y;
  return (
    <path
      d={`M ${cx - 5} ${cy} L ${cx + 5} ${cy}`}
      stroke={INK}
      strokeWidth={2}
      strokeLinecap="round"
    />
  );
}

function EyesFor({ mood }: { mood: Mood }) {
  const L = 32;
  const R = 48;
  const cy = EYE_Y;
  if (mood === 'dragged') {
    return (
      <g>
        <WideEye cx={L} />
        <WideEye cx={R} />
      </g>
    );
  }
  if (mood === 'annoyed') {
    return (
      <g>
        <FlatEye cx={L} />
        <FlatEye cx={R} />
      </g>
    );
  }
  if (mood === 'cheer') {
    return (
      <g stroke={INK} strokeWidth={2} fill="none" strokeLinecap="round">
        <path
          d={`M ${L - 4.6} ${cy + 1} Q ${L} ${cy - 4.5} ${L + 4.6} ${cy + 1}`}
        />
        <path
          d={`M ${R - 4.6} ${cy + 1} Q ${R} ${cy - 4.5} ${R + 4.6} ${cy + 1}`}
        />
      </g>
    );
  }
  if (mood === 'sad') {
    return (
      <g>
        <g stroke={INK} strokeWidth={2} fill="none" strokeLinecap="round">
          <path
            d={`M ${L - 4.6} ${cy - 1.2} Q ${L} ${cy + 2.6} ${L + 4.6} ${cy - 1.2}`}
          />
          <path
            d={`M ${R - 4.6} ${cy - 1.2} Q ${R} ${cy + 2.6} ${R + 4.6} ${cy - 1.2}`}
          />
        </g>
        <ellipse
          cx={R + 4.4}
          cy={cy + 4.6}
          rx={1.2}
          ry={1.8}
          fill="#7dd3fc"
          opacity={0.9}
        />
      </g>
    );
  }
  if (mood === 'think') {
    return (
      <g>
        <HalfEye cx={L} />
        <HalfEye cx={R} />
      </g>
    );
  }
  return (
    <g>
      <OpenEye cx={L} animate />
      <OpenEye cx={R} animate />
    </g>
  );
}

function BrowsFor({ mood }: { mood: Mood }) {
  if (mood === 'annoyed') {
    // angry brows angled down toward the nose
    return (
      <g stroke={INK} strokeWidth={1.6} fill="none" strokeLinecap="round">
        <path d="M 27.5 28.5 L 35.5 31" />
        <path d="M 52.5 28.5 L 44.5 31" />
      </g>
    );
  }
  if (mood === 'dragged') {
    // raised, surprised brows
    return (
      <g stroke={INK} strokeWidth={1.4} fill="none" strokeLinecap="round">
        <path d="M 27.5 26.5 Q 32 24.5 36 26" />
        <path d="M 44 26 Q 48 24.5 52.5 26.5" />
      </g>
    );
  }
  if (mood === 'warn' || mood === 'sad') {
    return (
      <g
        stroke={INK}
        strokeWidth={1.3}
        fill="none"
        strokeLinecap="round"
        opacity={0.85}
      >
        <path d="M 27.8 30.6 Q 32 28.8 35.8 30" />
        <path d="M 44.2 30 Q 48 28.8 52.2 30.6" />
      </g>
    );
  }
  if (mood === 'think') {
    return (
      <g
        stroke={INK}
        strokeWidth={1.3}
        fill="none"
        strokeLinecap="round"
        opacity={0.85}
      >
        <path d="M 27.8 29.6 Q 32 28.2 36 29.4" />
        <path d="M 44 30.2 Q 48 29.6 52.2 30.4" />
      </g>
    );
  }
  return null;
}

// Extra anime-style cues: sweat drop when yanked, anger mark when annoyed.
function FaceFx({ mood }: { mood: Mood }) {
  if (mood === 'dragged') {
    return (
      <path
        d="M 55 30 q 2.4 3.2 0 4.6 q -2.4 -1.4 0 -4.6 Z"
        fill="#7dd3fc"
        opacity={0.9}
      />
    );
  }
  if (mood === 'annoyed') {
    return (
      <g stroke="#ef4444" strokeWidth={1.2} strokeLinecap="round" opacity={0.9}>
        <path d="M 53 25 L 57 29 M 57 25 L 53 29" />
        <path d="M 55 24.2 L 55 29.8 M 52.2 27 L 57.8 27" />
      </g>
    );
  }
  return null;
}

function MouthFor({ mood }: { mood: Mood }) {
  switch (mood) {
    case 'dragged':
      return <ellipse cx={40} cy={47.4} rx={2.6} ry={3.2} fill="#9f1239" />;
    case 'annoyed':
      return (
        <path
          d="M 36.6 47.6 Q 40 46 43.4 47.8"
          stroke="#be123c"
          strokeWidth={1.4}
          strokeLinecap="round"
          fill="none"
        />
      );
    case 'cheer':
      return (
        <path
          d="M 35.6 45.4 Q 40 46.4 44.4 45.4 Q 43.4 50.8 40 50.8 Q 36.6 50.8 35.6 45.4 Z"
          fill="#fb7185"
          stroke="#be123c"
          strokeWidth={0.7}
        />
      );
    case 'warn':
      return (
        <path
          d="M 37.2 46.8 L 42.8 46.8"
          stroke="#be123c"
          strokeWidth={1.4}
          strokeLinecap="round"
        />
      );
    case 'think':
      return (
        <path
          d="M 40.6 46.9 Q 42.4 47.8 44 46.4"
          stroke="#be123c"
          strokeWidth={1.3}
          strokeLinecap="round"
          fill="none"
        />
      );
    case 'sad':
      return (
        <path
          d="M 36.8 47.9 Q 40 45.2 43.2 47.9"
          stroke="#be123c"
          strokeWidth={1.4}
          strokeLinecap="round"
          fill="none"
        />
      );
    default:
      return (
        <path
          d="M 36.6 45.9 Q 40 48.7 43.4 45.9"
          stroke="#be123c"
          strokeWidth={1.4}
          strokeLinecap="round"
          fill="none"
        />
      );
  }
}

function ChibiBot({ mood, width = BOT_W }: { mood: Mood; width?: number }) {
  const accent = MOOD_ACCENT[mood];
  const glowOpacity = mood === 'sad' ? 0.35 : 0.8;
  return (
    <BotSvg
      viewBox={`0 0 ${VB_W} ${VB_H}`}
      width={width}
      height={(width * VB_H) / VB_W}
      aria-hidden
    >
      <defs>
        <linearGradient id="nbHair" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#d7e0ec" />
        </linearGradient>
        <linearGradient id="nbSuit" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#dbe4f0" />
        </linearGradient>
        <linearGradient id="nbBlue" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#60a5fa" />
          <stop offset="1" stopColor="#2563eb" />
        </linearGradient>
        <radialGradient id="nbIris" cx="0.5" cy="0.35" r="0.75">
          <stop offset="0" stopColor="#93c5fd" />
          <stop offset="0.55" stopColor="#3b82f6" />
          <stop offset="1" stopColor="#1e3a8a" />
        </radialGradient>
        <radialGradient id="nbSkin" cx="0.5" cy="0.4" r="0.85">
          <stop offset="0" stopColor="#fff3ea" />
          <stop offset="1" stopColor="#ffdfcd" />
        </radialGradient>
      </defs>

      {/* hair, back layer with side locks */}
      <path
        d="M 40 3.5 C 20 3.5 12.5 18 13.5 32 C 14 42 11 51 8.5 57.5 C 15.5 57 19.5 53 21.5 48.5 C 23 52 26 54.5 29 55.5 L 51 55.5 C 54 54.5 57 52 58.5 48.5 C 60.5 53 64.5 57 71.5 57.5 C 69 51 66 42 66.5 32 C 67.5 18 60 3.5 40 3.5 Z"
        fill="url(#nbHair)"
        stroke={HAIR_EDGE}
        strokeWidth={0.7}
      />

      {/* legs and boots */}
      <path
        d="M 36.3 70.5 L 35.6 78.5"
        stroke="#eef2f7"
        strokeWidth={5}
        strokeLinecap="round"
      />
      <path
        d="M 43.7 70.5 L 44.4 78.5"
        stroke="#eef2f7"
        strokeWidth={5}
        strokeLinecap="round"
      />
      <rect
        x={31}
        y={77}
        width={8.6}
        height={2.6}
        rx={1.3}
        fill="#f8fafc"
        stroke="#cbd5e1"
        strokeWidth={0.4}
      />
      <rect
        x={40.4}
        y={77}
        width={8.6}
        height={2.6}
        rx={1.3}
        fill="#f8fafc"
        stroke="#cbd5e1"
        strokeWidth={0.4}
      />
      <rect
        x={31}
        y={78.8}
        width={8.6}
        height={7}
        rx={3.1}
        fill="url(#nbBlue)"
        stroke="#1d4ed8"
        strokeWidth={0.5}
      />
      <rect
        x={40.4}
        y={78.8}
        width={8.6}
        height={7}
        rx={3.1}
        fill="url(#nbBlue)"
        stroke="#1d4ed8"
        strokeWidth={0.5}
      />

      {/* hip flaps */}
      <path
        d="M 31.5 59.5 C 26 63.5 21.5 70 19.5 75 C 25.5 73 30.5 69 32.8 65.5 Z"
        fill="url(#nbSuit)"
        stroke="#bfdbfe"
        strokeWidth={0.6}
      />
      <path
        d="M 48.5 59.5 C 54 63.5 58.5 70 60.5 75 C 54.5 73 49.5 69 47.2 65.5 Z"
        fill="url(#nbSuit)"
        stroke="#bfdbfe"
        strokeWidth={0.6}
      />

      {/* arms: dark sleeve, white forearm, blue glove */}
      <path
        d="M 30.5 55.5 L 26.5 58.5"
        stroke="#334155"
        strokeWidth={5}
        strokeLinecap="round"
      />
      <path
        d="M 49.5 55.5 L 53.5 58.5"
        stroke="#334155"
        strokeWidth={5}
        strokeLinecap="round"
      />
      <path
        d="M 26.5 58.5 L 23 61.4"
        stroke="#f8fafc"
        strokeWidth={4.6}
        strokeLinecap="round"
      />
      <path
        d="M 53.5 58.5 L 57 61.4"
        stroke="#f8fafc"
        strokeWidth={4.6}
        strokeLinecap="round"
      />
      <circle
        cx={21}
        cy={63}
        r={3.1}
        fill="url(#nbBlue)"
        stroke="#1e40af"
        strokeWidth={0.5}
      />
      <circle
        cx={59}
        cy={63}
        r={3.1}
        fill="url(#nbBlue)"
        stroke="#1e40af"
        strokeWidth={0.5}
      />

      {/* torso suit */}
      <path
        d="M 32 52.5 C 29.5 55 28.5 62 30.5 67.5 C 32 70.8 34.5 72 40 72 C 45.5 72 48 70.8 49.5 67.5 C 51.5 62 50.5 55 48 52.5 C 45 50.8 35 50.8 32 52.5 Z"
        fill="url(#nbSuit)"
        stroke={SUIT_EDGE}
        strokeWidth={0.7}
      />
      <path
        d="M 33.8 51.7 C 36.3 50.7 43.7 50.7 46.2 51.7 L 45.2 54.2 C 41.8 53.2 38.2 53.2 34.8 54.2 Z"
        fill="#1f2937"
      />
      <path
        d="M 33 63.5 Q 40 66.5 47 63.5"
        stroke="#38bdf8"
        strokeWidth={1}
        fill="none"
        opacity={glowOpacity}
      />
      <circle cx={40} cy={59.5} r={4.8} fill={accent} opacity={0.18} />
      <circle cx={40} cy={59.5} r={3.2} fill="#ffffff" />
      <circle cx={40} cy={59.5} r={2.2} fill={accent} />

      {/* face */}
      <ellipse cx={40} cy={35} rx={18.5} ry={16} fill="url(#nbSkin)" />

      {/* blush */}
      <ellipse
        cx={27.5}
        cy={42.5}
        rx={3.3}
        ry={1.9}
        fill="#fb7185"
        opacity={mood === 'sad' ? 0.3 : 0.45}
      />
      <ellipse
        cx={52.5}
        cy={42.5}
        rx={3.3}
        ry={1.9}
        fill="#fb7185"
        opacity={mood === 'sad' ? 0.3 : 0.45}
      />

      <EyesFor mood={mood} />
      <BrowsFor mood={mood} />
      <MouthFor mood={mood} />
      <FaceFx mood={mood} />

      {/* bangs and hair shine */}
      <path
        d="M 22.5 31 C 21 17 29 9.5 40 9.5 C 51 9.5 59 17 57.5 31 C 55 25.5 53 23.5 50.2 28.5 C 47.5 22.5 44 21.8 40.8 27.5 C 38 21.8 34.5 22.3 32.5 28 C 29.5 23 26.5 25 22.5 31 Z"
        fill="url(#nbHair)"
        stroke={HAIR_EDGE}
        strokeWidth={0.6}
      />
      <path
        d="M 26.5 12.5 C 31 8.5 49 8.5 53.5 12.5"
        stroke="#ffffff"
        strokeWidth={2.4}
        fill="none"
        strokeLinecap="round"
        opacity={0.9}
      />
    </BotSvg>
  );
}
