import styled, { css, keyframes } from 'styled-components';

import { colors } from '../styles/theme';

const glow = keyframes`
  0%, 100% { opacity: 0.55; }
  50% { opacity: 0.85; }
`;

const tick = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.35; }
`;

export const Shell = styled.div`
  --focus-display: 'Fraunces', Georgia, serif;
  --focus-body: 'DM Sans', system-ui, sans-serif;
  --focus-mono: 'JetBrains Mono', ui-monospace, monospace;
  --focus-amber: #e8a838;
  --focus-amber-soft: rgba(232, 168, 56, 0.14);
  --focus-amber-glow: rgba(232, 168, 56, 0.28);
  --focus-ink: #1a1714;
  --focus-paper: #faf6ef;
  --focus-surface: #fffdf8;
  --focus-surface-solid: #fffdf8;
  --focus-border: rgba(26, 23, 20, 0.08);
  --focus-muted: #7a7268;
  --focus-text: #1a1714;
  --focus-shadow: 0 24px 64px -28px rgba(26, 23, 20, 0.22);

  position: relative;
  font-family: var(--focus-body);
  color: var(--focus-text);
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
  padding: 0.25rem 0 2rem;
  isolation: isolate;

  &::before {
    content: '';
    position: absolute;
    inset: -3rem -2rem auto;
    height: 22rem;
    // background:
    //   radial-gradient(
    //     ellipse 70% 80% at 8% 0%,
    //     var(--focus-amber-glow),
    //     transparent 58%
    //   ),
    //   radial-gradient(
    //     ellipse 50% 60% at 92% 8%,
    //     rgba(180, 140, 90, 0.12),
    //     transparent 55%
    //   );
    pointer-events: none;
    z-index: -1;
    animation: ${glow} 8s ease-in-out infinite;
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    opacity: 0.035;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    pointer-events: none;
    z-index: -1;
  }

  [data-theme='dark'] & {
    --focus-amber: #f0b84a;
    --focus-amber-soft: rgba(240, 184, 74, 0.1);
    --focus-amber-glow: rgba(240, 184, 74, 0.16);
    --focus-ink: #f2ece3;
    --focus-paper: #0c0e12;
    --focus-surface: #161921;
    --focus-surface-solid: #161921;
    --focus-border: rgba(242, 236, 227, 0.07);
    --focus-muted: #8b93a8;
    --focus-text: #ece8e1;
    --focus-shadow: 0 28px 72px -32px rgba(0, 0, 0, 0.65);
  }
`;

export const TopBar = styled.header`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--focus-border);
`;

export const TopBarCopy = styled.div`
  min-width: 0;
`;

export const Eyebrow = styled.p`
  margin: 0 0 0.5rem;
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--focus-amber);
`;

export const DisplayTitle = styled.h1`
  margin: 0;
  font-family: var(--focus-display);
  font-size: clamp(2.25rem, 5vw, 3.25rem);
  font-weight: 800;
  line-height: 1.05;
  letter-spacing: -0.03em;
  color: var(--focus-text);
`;

export const Lead = styled.p`
  margin: 0.625rem 0 0;
  font-size: 0.9375rem;
  line-height: 1.55;
  color: var(--focus-muted);
`;

export const Toolbar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
  padding: 1rem;
  border-radius: 1rem;
  border: 1px solid var(--focus-border);
  background: var(--focus-surface-solid);
  box-shadow: var(--focus-shadow);
`;

export const SearchForm = styled.form`
  display: flex;
  gap: 0.5rem;
  padding: 0.25rem;
  border-radius: 0.75rem;
  border: 1px solid var(--focus-border);
  background: var(--focus-paper);
`;

export const Field = styled.input`
  flex: 1;
  min-width: 0;
  border: none;
  background: transparent;
  color: var(--focus-text);
  font-family: var(--focus-body);
  font-size: 0.9375rem;
  padding: 0.7rem 0.875rem;
  outline: none;

  &::placeholder {
    color: var(--focus-muted);
  }
`;

export const ActionBtn = styled.button<{ $variant?: 'primary' | 'ghost' }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  flex-shrink: 0;
  border: none;
  border-radius: 0.75rem;
  padding: 0.7rem 1.125rem;
  font-family: var(--focus-body);
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition:
    transform 0.12s ease,
    box-shadow 0.2s ease,
    background 0.2s ease;

  ${(p) =>
    p.$variant === 'ghost'
      ? css`
          background: transparent;
          color: var(--focus-muted);
          border: 1px solid var(--focus-border);
          &:hover {
            color: var(--focus-text);
            border-color: var(--focus-amber);
          }
        `
      : css`
          background: linear-gradient(135deg, var(--focus-amber), #d4922a);
          color: #1a1208;
          box-shadow: 0 4px 18px var(--focus-amber-glow);
          &:hover {
            transform: translateY(-1px);
            box-shadow: 0 8px 24px var(--focus-amber-glow);
          }
        `}

  &:active {
    transform: scale(0.97);
  }
`;

export const PillRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
`;

export const Pill = styled.button<{ $active?: boolean }>`
  border: 1px solid
    ${(p) => (p.$active ? 'transparent' : 'var(--focus-border)')};
  background: ${(p) => (p.$active ? 'var(--focus-amber-soft)' : 'transparent')};
  color: ${(p) => (p.$active ? 'var(--focus-amber)' : 'var(--focus-muted)')};
  border-radius: 999px;
  padding: 0.35rem 0.8rem;
  font-family: var(--focus-body);
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  cursor: pointer;
  transition: all 0.18s ease;

  &:hover {
    color: var(--focus-text);
    border-color: var(--focus-amber);
  }
`;

export const ModeNav = styled.nav`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.25rem;
  padding: 0.25rem;
  border-radius: 0.75rem;
  border: 1px solid var(--focus-border);
  background: var(--focus-paper);

  @media (max-width: 640px) {
    grid-template-columns: repeat(4, minmax(4.25rem, 1fr));
    overflow-x: auto;
  }
`;

export const ModeTab = styled.button<{ $active?: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border: none;
  border-radius: 0.625rem;
  padding: 0.625rem 0.75rem;
  font-family: var(--focus-body);
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  color: ${(p) => (p.$active ? 'var(--focus-text)' : 'var(--focus-muted)')};
  background: ${(p) =>
    p.$active ? 'var(--focus-surface-solid)' : 'transparent'};
  box-shadow: ${(p) =>
    p.$active
      ? '0 2px 12px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.06)'
      : 'none'};
  transition: all 0.2s ease;

  [data-theme='dark'] & {
    box-shadow: ${(p) =>
      p.$active
        ? '0 2px 16px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.04)'
        : 'none'};
  }

  &:hover {
    color: var(--focus-text);
  }

  span.icon {
    font-size: 1rem;
    opacity: ${(p) => (p.$active ? 1 : 0.55)};
  }
`;

export const PanelStage = styled.div`
  position: relative;
  isolation: isolate;
  overflow: hidden;
`;

export const PanelSlot = styled.div<{ $active?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  width: 100%;
  transition: opacity 0.15s ease;

  ${(p) =>
    p.$active
      ? css`
          position: relative;
          visibility: visible;
          opacity: 1;
          pointer-events: auto;
          z-index: 1;
        `
      : css`
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 0;
          overflow: hidden;
          visibility: hidden;
          opacity: 0;
          pointer-events: none;
          z-index: 0;
        `}
`;

export const Panel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

export const TintedPanel = styled.div<{ $accent: string }>`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  position: relative;
  padding: 1.5rem;
  border-radius: 1.25rem;
  border: 1px solid
    color-mix(in srgb, ${(p) => p.$accent} 22%, transparent);
  background:
    radial-gradient(
      ellipse 80% 60% at 0% 0%,
      color-mix(in srgb, ${(p) => p.$accent} 14%, transparent),
      transparent 55%
    ),
    radial-gradient(
      ellipse 60% 50% at 100% 100%,
      color-mix(in srgb, ${(p) => p.$accent} 8%, transparent),
      transparent 50%
    ),
    var(--focus-surface-solid);
  box-shadow:
    var(--focus-shadow),
    0 0 0 1px color-mix(in srgb, ${(p) => p.$accent} 6%, transparent) inset;

  [data-theme='dark'] & {
    border-color: color-mix(in srgb, ${(p) => p.$accent} 18%, transparent);
    background:
      radial-gradient(
        ellipse 80% 60% at 0% 0%,
        color-mix(in srgb, ${(p) => p.$accent} 10%, transparent),
        transparent 55%
      ),
      radial-gradient(
        ellipse 60% 50% at 100% 100%,
        color-mix(in srgb, ${(p) => p.$accent} 6%, transparent),
        transparent 50%
      ),
      var(--focus-surface-solid);
  }
`;

export const Grid = styled.div`
  display: grid;
  gap: 1.25rem;
  align-items: stretch;

  @media (min-width: 900px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

export const Card = styled.section`
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  border-radius: 1.125rem;
  border: 1px solid var(--focus-border);
  background: var(--focus-surface-solid);
  padding: 1.375rem;
  box-shadow: var(--focus-shadow);
  overflow: hidden;
`;

export const CardBody = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
`;

export const CardHead = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;
  margin-bottom: 1.125rem;
`;

export const CardDot = styled.span<{ $color: string }>`
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 999px;
  background: ${(p) => p.$color};
  box-shadow: 0 0 10px ${(p) => p.$color}88;
  flex-shrink: 0;
`;

export const CardTitle = styled.h2`
  margin: 0;
  font-family: var(--focus-display);
  font-size: 1.125rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--focus-text);
`;

export const CardBadge = styled.span`
  margin-left: auto;
  font-family: var(--focus-mono);
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--focus-amber);
  padding: 0.2rem 0.5rem;
  border-radius: 999px;
  background: var(--focus-amber-soft);
`;

export const Row = styled.form`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
`;

export const InsetField = styled.input`
  flex: 1;
  min-width: 8rem;
  border-radius: 0.75rem;
  border: 1px solid var(--focus-border);
  background: var(--focus-surface-solid);
  color: var(--focus-text);
  font-family: var(--focus-body);
  font-size: 0.875rem;
  padding: 0.7rem 0.875rem;
  outline: none;
  transition:
    border-color 0.15s ease,
    box-shadow 0.15s ease;

  &:focus {
    border-color: var(--focus-amber);
    box-shadow: 0 0 0 3px var(--focus-amber-soft);
  }

  &::placeholder {
    color: var(--focus-muted);
  }
`;

export const Select = styled.select`
  border-radius: 0.75rem;
  border: 1px solid var(--focus-border);
  background: var(--focus-surface-solid);
  color: var(--focus-text);
  font-family: var(--focus-body);
  font-size: 0.875rem;
  padding: 0.7rem 0.75rem;
  cursor: pointer;
  outline: none;

  &:focus {
    border-color: var(--focus-amber);
    box-shadow: 0 0 0 3px var(--focus-amber-soft);
  }
`;

export const Hint = styled.p`
  margin: 0.75rem 0 0;
  margin-top: auto;
  padding-top: 0.75rem;
  font-size: 0.75rem;
  line-height: 1.55;
  color: var(--focus-muted);
`;

export const HintError = styled.p`
  margin: 0 0 0.75rem;
  font-size: 0.75rem;
  line-height: 1.55;
  color: ${colors.red500};
`;

export const MediaShell = styled.div<{ $provider: 'spotify' | 'youtube' }>`
  width: 100%;
  max-width: ${(p) => (p.$provider === 'youtube' ? '52rem' : '40rem')};
  margin: 0 auto;
`;

export const MediaFrame = styled.div<{ $provider: 'spotify' | 'youtube' }>`
  width: 100%;
  flex-shrink: 0;
  overflow: hidden;
  border-radius: 0.875rem;
  border: 1px solid var(--focus-border);
  background: #121212;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.04);

  ${(p) =>
    p.$provider === 'spotify' ? `height: 28rem;` : `aspect-ratio: 16 / 9;`}

  iframe {
    display: block;
    width: 100%;
    height: 100%;
    border: 0;
    background: #121212;
  }
`;

export const StationGrid = styled.div`
  display: grid;
  gap: 0.75rem;
  grid-template-columns: repeat(auto-fill, minmax(5.5rem, 1fr));
`;

export const Station = styled.button<{ $color: string; $active?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.625rem;
  padding: 1rem 0.5rem 0.75rem;
  border-radius: 1rem;
  border: 1px solid ${(p) => (p.$active ? p.$color : 'var(--focus-border)')};
  background: ${(p) =>
    p.$active ? `${p.$color}18` : 'var(--focus-surface-solid)'};
  cursor: pointer;
  font-family: inherit;
  transition:
    transform 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-4px);
    border-color: ${(p) => p.$color};
    box-shadow: 0 12px 28px -12px ${(p) => p.$color}66;
  }
`;

export const StationDisc = styled.span<{ $color: string }>`
  position: relative;
  display: grid;
  place-items: center;
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 999px;
  background: radial-gradient(
    circle at 32% 28%,
    ${(p) => p.$color}ee,
    ${(p) => p.$color}88
  );
  color: #fff;
  font-size: 0.9rem;
  box-shadow:
    inset 0 2px 4px rgba(255, 255, 255, 0.25),
    0 4px 14px ${(p) => p.$color}55;

  &::after {
    content: '';
    position: absolute;
    width: 0.45rem;
    height: 0.45rem;
    border-radius: 999px;
    background: rgba(0, 0, 0, 0.4);
    pointer-events: none;
  }
`;

export const StationLabel = styled.span`
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  text-align: center;
  color: var(--focus-text);
  line-height: 1.3;
`;

export const ShortcutGrid = styled.div`
  display: grid;
  gap: 0.75rem;
  flex: 1;
  align-content: start;
  grid-template-columns: repeat(auto-fill, minmax(5.5rem, 1fr));
`;

export const Shortcut = styled.a<{ $color: string }>`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 0.5rem;
  border-radius: 1rem;
  border: 1px solid var(--focus-border);
  background: var(--focus-surface-solid);
  text-decoration: none;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-3px);
    border-color: ${(p) => p.$color};
    box-shadow: 0 10px 24px -10px ${(p) => p.$color}55;
  }
`;

export const ShortcutMark = styled.span<{ $color: string }>`
  display: grid;
  place-items: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.75rem;
  background: ${(p) => p.$color};
  color: #fff;
  font-weight: 700;
  font-size: 0.95rem;
`;

export const ShortcutLabel = styled(StationLabel)``;

export const LinkGrid = styled.div`
  display: grid;
  gap: 0.75rem;
  flex: 1;
  align-content: start;
  grid-template-columns: repeat(auto-fill, minmax(5.5rem, 1fr));
`;

export const LinkTile = styled.a<{ $color: string }>`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 0.5rem;
  border-radius: 1rem;
  border: 1px solid var(--focus-border);
  background: var(--focus-surface-solid);
  text-decoration: none;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    border-color 0.2s ease;

  &:hover {
    transform: translateY(-3px);
    border-color: ${(p) => p.$color};
  }
`;

export const LinkDelete = styled.button`
  position: absolute;
  top: 0.3rem;
  right: 0.4rem;
  border: none;
  background: transparent;
  color: var(--focus-muted);
  font-size: 1rem;
  line-height: 1;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.15s ease;

  ${LinkTile}:hover & {
    opacity: 1;
  }
  &:hover {
    color: ${colors.red500};
  }
`;

export const Notes = styled.textarea`
  width: 100%;
  flex: 1;
  min-height: 13rem;
  resize: vertical;
  border-radius: 0.875rem;
  border: 1px solid var(--focus-border);
  background: var(--focus-surface-solid);
  color: var(--focus-text);
  font-family: var(--focus-mono);
  font-size: 0.8125rem;
  line-height: 1.65;
  padding: 1rem;
  outline: none;
  transition:
    border-color 0.15s ease,
    box-shadow 0.15s ease;

  &:focus {
    border-color: var(--focus-amber);
    box-shadow: 0 0 0 3px var(--focus-amber-soft);
  }

  &::placeholder {
    color: var(--focus-muted);
    font-family: var(--focus-body);
  }
`;

export const Empty = styled.div`
  display: grid;
  place-items: center;
  flex: 1;
  min-height: 7rem;
  border-radius: 0.875rem;
  border: 1px dashed var(--focus-border);
  color: var(--focus-muted);
  font-size: 0.875rem;
  text-align: center;
  padding: 1.5rem;
`;

export const TaskList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 0.5rem;
`;

export const TaskItem = styled.li<{ $done?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 0.875rem;
  border-radius: 0.75rem;
  border: 1px solid var(--focus-border);
  background: ${(p) =>
    p.$done ? 'transparent' : 'var(--focus-surface-solid)'};
  opacity: ${(p) => (p.$done ? 0.65 : 1)};
  transition: opacity 0.2s ease;
`;

export const TaskCheck = styled.button<{ $done?: boolean }>`
  display: grid;
  place-items: center;
  flex-shrink: 0;
  width: 1.375rem;
  height: 1.375rem;
  border-radius: 0.375rem;
  cursor: pointer;
  border: 1.5px solid
    ${(p) => (p.$done ? 'var(--focus-amber)' : 'var(--focus-border)')};
  background: ${(p) => (p.$done ? 'var(--focus-amber)' : 'transparent')};
  color: #1a1208;
  transition: all 0.15s ease;

  &:hover {
    border-color: var(--focus-amber);
  }
`;

export const TaskText = styled.span<{ $done?: boolean }>`
  flex: 1;
  min-width: 0;
  font-size: 0.9rem;
  color: var(--focus-text);
  text-decoration: ${(p) => (p.$done ? 'line-through' : 'none')};
  word-break: break-word;
`;

export const TaskDelete = styled.button`
  border: none;
  background: transparent;
  color: var(--focus-muted);
  font-size: 1.125rem;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 0.375rem;
  transition: color 0.15s ease;

  &:hover {
    color: ${colors.red500};
  }
`;

/* ── Pomodoro ────────────────────────────────────────────────── */
export const TimerWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.25rem;
`;

export const TimerRing = styled.div<{ $progress: number; $running: boolean }>`
  position: relative;
  width: 11rem;
  height: 11rem;

  svg {
    transform: rotate(-90deg);
    width: 100%;
    height: 100%;
  }

  circle.track {
    fill: none;
    stroke: var(--focus-border);
    stroke-width: 4;
  }

  circle.fill {
    fill: none;
    stroke: var(--focus-amber);
    stroke-width: 4;
    stroke-linecap: round;
    stroke-dasharray: 326.7;
    stroke-dashoffset: ${(p) => 326.7 * (1 - p.$progress)};
    transition: stroke-dashoffset 0.8s ease;
    filter: drop-shadow(0 0 6px var(--focus-amber-glow));
  }
`;

export const TimerDisplay = styled.div<{ $running?: boolean }>`
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  font-family: var(--focus-mono);
  font-size: 2.5rem;
  font-weight: 500;
  letter-spacing: -0.04em;
  font-variant-numeric: tabular-nums;
  color: var(--focus-text);

  &::after {
    content: '';
    position: absolute;
    bottom: 2.25rem;
    width: 0.375rem;
    height: 0.375rem;
    border-radius: 999px;
    background: var(--focus-amber);
    opacity: ${(p) => (p.$running ? 1 : 0)};
    animation: ${(p) => (p.$running ? tick : 'none')} 1s step-end infinite;
  }
`;

export const TimerModes = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.375rem;
`;

export const TimerControls = styled.div`
  display: flex;
  gap: 0.625rem;
`;

export const IconButton = styled.button<{ $primary?: boolean }>`
  display: grid;
  place-items: center;
  width: 3rem;
  height: 3rem;
  border-radius: 999px;
  border: 1px solid
    ${(p) => (p.$primary ? 'transparent' : 'var(--focus-border)')};
  background: ${(p) =>
    p.$primary
      ? 'linear-gradient(135deg, var(--focus-amber), #d4922a)'
      : 'var(--focus-surface-solid)'};
  color: ${(p) => (p.$primary ? '#1a1208' : 'var(--focus-muted)')};
  cursor: pointer;
  box-shadow: ${(p) =>
    p.$primary ? '0 4px 18px var(--focus-amber-glow)' : 'none'};
  transition:
    transform 0.12s ease,
    color 0.15s ease;

  &:hover {
    transform: scale(1.05);
    color: ${(p) => (p.$primary ? '#1a1208' : 'var(--focus-text)')};
  }
  &:active {
    transform: scale(0.95);
  }
`;
