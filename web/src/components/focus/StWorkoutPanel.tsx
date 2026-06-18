import styled, { css, keyframes } from 'styled-components';

const pulseDot = keyframes`
  0%, 100% { transform: scale(1); opacity: 0.85; }
  50% { transform: scale(1.25); opacity: 1; }
`;

const ringGlow = keyframes`
  0%, 100% { filter: drop-shadow(0 0 6px currentColor); }
  50% { filter: drop-shadow(0 0 16px currentColor); }
`;

export const WorkoutStage = styled.section`
  position: relative;
  overflow: hidden;
  border-radius: 1.25rem;
  border: 1px solid rgba(255, 107, 44, 0.26);
  background:
    radial-gradient(
      ellipse 80% 60% at 0% 0%,
      rgba(255, 107, 44, 0.18),
      transparent 55%
    ),
    radial-gradient(
      ellipse 60% 55% at 100% 100%,
      rgba(255, 61, 87, 0.1),
      transparent 50%
    ),
    var(--focus-surface-solid);
  box-shadow:
    var(--focus-shadow),
    0 0 0 1px rgba(255, 107, 44, 0.06) inset;

  /* diagonal speed lines */
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    pointer-events: none;
    background-image: repeating-linear-gradient(
      115deg,
      rgba(255, 107, 44, 0.05) 0 2px,
      transparent 2px 16px
    );
    mask-image: radial-gradient(
      ellipse at 100% 0%,
      rgba(0, 0, 0, 0.6),
      transparent 70%
    );
    opacity: 0.7;
  }

  [data-theme='dark'] & {
    border-color: rgba(255, 107, 44, 0.22);
    background:
      radial-gradient(
        ellipse 80% 60% at 0% 0%,
        rgba(255, 107, 44, 0.14),
        transparent 55%
      ),
      radial-gradient(
        ellipse 60% 55% at 100% 100%,
        rgba(255, 61, 87, 0.08),
        transparent 50%
      ),
      var(--focus-surface-solid);
  }
`;

export const WorkoutHero = styled.div`
  position: relative;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.5rem 1.5rem 0;
  flex-wrap: wrap;
`;

export const WorkoutBrand = styled.div`
  display: flex;
  align-items: center;
  gap: 0.875rem;
  min-width: 0;
`;

export const WorkoutLogo = styled.div`
  display: grid;
  place-items: center;
  flex-shrink: 0;
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 0.85rem;
  background: linear-gradient(145deg, #ff8a4c, #e63a2e);
  color: #fff;
  box-shadow:
    0 10px 28px -10px rgba(255, 107, 44, 0.55),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);

  svg {
    width: 1.4rem;
    height: 1.4rem;
  }
`;

export const WorkoutEyebrow = styled.span`
  display: block;
  font-family: var(--focus-mono);
  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: #e6502f;
  margin-bottom: 0.15rem;
`;

export const WorkoutTitle = styled.h2`
  margin: 0;
  font-family: var(--focus-display);
  font-size: 1.45rem;
  font-weight: 700;
  letter-spacing: -0.025em;
  color: var(--focus-text);
`;

export const WorkoutSub = styled.p`
  margin: 0.2rem 0 0;
  font-size: 0.8125rem;
  color: var(--focus-muted);
`;

export const WorkoutStatus = styled.span<{ $phase: string }>`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
  font-family: var(--focus-mono);
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  padding: 0.4rem 0.75rem 0.4rem 0.6rem;
  border-radius: 999px;

  ${(p) => {
    const c =
      p.$phase === 'rest'
        ? '#22d3ee'
        : p.$phase === 'done'
          ? '#1db954'
          : p.$phase === 'work'
            ? '#ff6b2c'
            : '#e6502f';
    return css`
      color: ${c};
      border: 1px solid ${c}66;
      background: ${c}1a;

      &::before {
        content: '';
        width: 0.45rem;
        height: 0.45rem;
        border-radius: 999px;
        background: ${c};
        box-shadow: 0 0 10px ${c}b3;
        animation: ${pulseDot} 1.4s ease-in-out infinite;
      }
    `;
  }}
`;

export const WorkoutBody = styled.div`
  position: relative;
  padding: 1.25rem 1.5rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.125rem;
`;

export const WorkoutPresets = styled.div`
  display: grid;
  gap: 0.625rem;
  grid-template-columns: repeat(auto-fill, minmax(9rem, 1fr));
`;

export const WorkoutPreset = styled.button<{ $active?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  padding: 0.7rem 0.85rem;
  border-radius: 0.85rem;
  cursor: pointer;
  text-align: left;
  font-family: var(--focus-body);
  border: 1px solid
    ${(p) => (p.$active ? 'transparent' : 'var(--focus-border)')};
  background: ${(p) =>
    p.$active
      ? 'linear-gradient(135deg, #ff8a4c, #e63a2e)'
      : 'var(--focus-paper)'};
  color: ${(p) => (p.$active ? '#fff' : 'var(--focus-text)')};
  transition:
    transform 0.12s ease,
    box-shadow 0.2s ease,
    border-color 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    border-color: ${(p) => (p.$active ? 'transparent' : 'rgba(255, 107, 44, 0.5)')};
    box-shadow: ${(p) =>
      p.$active ? '0 10px 24px -10px rgba(255, 107, 44, 0.55)' : 'none'};
  }
`;

export const WorkoutPresetName = styled.span`
  font-size: 0.875rem;
  font-weight: 700;
  letter-spacing: -0.01em;
`;

export const WorkoutPresetTag = styled.span<{ $active?: boolean }>`
  font-family: var(--focus-mono);
  font-size: 0.68rem;
  letter-spacing: 0.02em;
  color: ${(p) => (p.$active ? 'rgba(255, 255, 255, 0.85)' : 'var(--focus-muted)')};
`;

export const WorkoutMain = styled.div`
  display: grid;
  gap: 1.125rem;
  align-items: stretch;

  @media (min-width: 880px) {
    grid-template-columns: minmax(0, 0.95fr) minmax(0, 1.05fr);
  }
`;

export const WorkoutTimerCard = styled.div<{ $phase: string }>`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem 1.25rem;
  border-radius: 1rem;
  border: 1px solid
    ${(p) =>
      p.$phase === 'rest'
        ? 'rgba(34, 211, 238, 0.3)'
        : 'rgba(255, 107, 44, 0.28)'};
  background:
    radial-gradient(
      ellipse 90% 70% at 50% 0%,
      ${(p) =>
        p.$phase === 'rest'
          ? 'rgba(34, 211, 238, 0.12)'
          : 'rgba(255, 107, 44, 0.12)'},
      transparent 65%
    ),
    var(--focus-surface-solid);
  box-shadow:
    0 16px 44px -26px rgba(15, 23, 42, 0.5),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
  transition:
    border-color 0.4s ease,
    background 0.4s ease;
`;

export const WorkoutRing = styled.div<{ $progress: number; $color: string; $running: boolean }>`
  position: relative;
  width: 12rem;
  height: 12rem;

  svg {
    transform: rotate(-90deg);
    width: 100%;
    height: 100%;
  }

  circle.track {
    fill: none;
    stroke: var(--focus-border);
    stroke-width: 5;
  }

  circle.fill {
    fill: none;
    stroke: ${(p) => p.$color};
    color: ${(p) => p.$color};
    stroke-width: 5;
    stroke-linecap: round;
    stroke-dasharray: 326.7;
    stroke-dashoffset: ${(p) => 326.7 * (1 - p.$progress)};
    transition:
      stroke-dashoffset 0.95s linear,
      stroke 0.4s ease;
    ${(p) =>
      p.$running
        ? css`
            animation: ${ringGlow} 2s ease-in-out infinite;
          `
        : css`
            filter: drop-shadow(0 0 6px ${p.$color}88);
          `}
  }
`;

export const WorkoutRingInner = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.15rem;
`;

export const WorkoutPhase = styled.span<{ $color: string }>`
  font-family: var(--focus-mono);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: ${(p) => p.$color};
`;

export const WorkoutTime = styled.div`
  font-family: var(--focus-mono);
  font-size: 2.85rem;
  font-weight: 500;
  line-height: 1;
  letter-spacing: -0.04em;
  font-variant-numeric: tabular-nums;
  color: var(--focus-text);
`;

export const WorkoutRoundLabel = styled.span`
  font-family: var(--focus-mono);
  font-size: 0.7rem;
  letter-spacing: 0.06em;
  color: var(--focus-muted);
`;

export const WorkoutDots = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.3rem;
  max-width: 13rem;
`;

export const WorkoutDot = styled.span<{ $state: 'done' | 'active' | 'todo' }>`
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 999px;
  transition:
    background 0.3s ease,
    transform 0.3s ease;
  background: ${(p) =>
    p.$state === 'done'
      ? '#ff6b2c'
      : p.$state === 'active'
        ? '#ff8a4c'
        : 'var(--focus-border)'};
  transform: ${(p) => (p.$state === 'active' ? 'scale(1.5)' : 'scale(1)')};
  box-shadow: ${(p) =>
    p.$state === 'active' ? '0 0 10px rgba(255, 107, 44, 0.8)' : 'none'};
`;

export const WorkoutControls = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;
`;

export const WorkoutBtn = styled.button<{ $primary?: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  cursor: pointer;
  font-family: var(--focus-body);
  font-weight: 700;
  transition:
    transform 0.12s ease,
    box-shadow 0.2s ease,
    border-color 0.18s ease;

  ${(p) =>
    p.$primary
      ? css`
          width: 3.4rem;
          height: 3.4rem;
          border-radius: 999px;
          border: none;
          color: #fff;
          background: linear-gradient(135deg, #ff8a4c, #e63a2e);
          box-shadow: 0 10px 24px -8px rgba(255, 107, 44, 0.6);

          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 14px 30px -8px rgba(255, 107, 44, 0.7);
          }
        `
      : css`
          width: 2.85rem;
          height: 2.85rem;
          border-radius: 999px;
          border: 1px solid var(--focus-border);
          background: var(--focus-paper);
          color: var(--focus-text);

          &:hover {
            border-color: rgba(255, 107, 44, 0.5);
            color: #e6502f;
          }
        `}

  &:active {
    transform: scale(0.94);
  }
`;

export const WorkoutListCard = styled.section`
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
  padding: 1.25rem;
  border-radius: 1rem;
  border: 1px solid var(--focus-border);
  background: var(--focus-surface-solid);
  box-shadow:
    0 14px 38px -24px rgba(15, 23, 42, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
`;

export const WorkoutListHead = styled.header`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.5rem;
`;

export const WorkoutListCaption = styled.span`
  font-family: var(--focus-mono);
  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #e6502f;
`;

export const WorkoutListTitle = styled.h3`
  margin: 0.1rem 0 0;
  font-family: var(--focus-display);
  font-size: 1.15rem;
  font-weight: 600;
  letter-spacing: -0.015em;
  color: var(--focus-text);
`;

export const WorkoutMeta = styled.span`
  font-family: var(--focus-mono);
  font-size: 0.72rem;
  color: var(--focus-muted);
`;

export const WorkoutRow = styled.form`
  display: grid;
  grid-template-columns: minmax(0, 1.4fr) minmax(0, 0.9fr) auto;
  gap: 0.5rem;
  padding: 0.25rem;
  border-radius: 0.75rem;
  border: 1px solid var(--focus-border);
  background: var(--focus-paper);
`;

export const WorkoutField = styled.input`
  min-width: 0;
  border: none;
  background: transparent;
  padding: 0.55rem 0.7rem;
  font-family: var(--focus-body);
  font-size: 0.85rem;
  color: var(--focus-text);
  outline: none;

  &::placeholder {
    color: var(--focus-muted);
  }

  & + & {
    border-left: 1px solid var(--focus-border);
  }
`;

export const WorkoutAdd = styled.button`
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 0.6rem;
  padding: 0 0.85rem;
  color: #fff;
  cursor: pointer;
  background: linear-gradient(135deg, #ff8a4c, #e63a2e);
  box-shadow: 0 4px 14px rgba(255, 107, 44, 0.35);
  transition:
    transform 0.12s ease,
    box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 8px 22px rgba(255, 107, 44, 0.45);
  }
  &:active {
    transform: scale(0.95);
  }
`;

export const WorkoutList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
`;

export const WorkoutItem = styled.li<{ $done?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.7rem;
  padding: 0.6rem 0.75rem;
  border-radius: 0.75rem;
  border: 1px solid var(--focus-border);
  background: ${(p) => (p.$done ? 'transparent' : 'var(--focus-paper)')};
  opacity: ${(p) => (p.$done ? 0.6 : 1)};
  transition:
    background 0.15s ease,
    opacity 0.15s ease;
`;

export const WorkoutCheck = styled.button<{ $done?: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 1.25rem;
  height: 1.25rem;
  padding: 0;
  margin: 0;
  line-height: 0;
  font: inherit;
  border-radius: 0.4rem;
  cursor: pointer;
  color: #fff;
  border: 1.5px solid
    ${(p) => (p.$done ? '#e63a2e' : 'var(--focus-border)')};
  background: ${(p) =>
    p.$done ? 'linear-gradient(135deg, #ff8a4c, #e63a2e)' : 'transparent'};
  box-shadow: ${(p) =>
    p.$done ? '0 2px 8px -2px rgba(255, 107, 44, 0.45)' : 'none'};
  transition:
    background 0.15s ease,
    border-color 0.15s ease,
    box-shadow 0.15s ease;

  &::after {
    content: '';
    display: block;
    width: 0.3rem;
    height: 0.55rem;
    border: solid #fff;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg) translateY(-1px);
    opacity: ${(p) => (p.$done ? 1 : 0)};
    transition: opacity 0.12s ease;
  }

  &:hover {
    border-color: ${(p) =>
      p.$done ? '#e63a2e' : 'rgba(255, 107, 44, 0.55)'};
  }

  &:focus-visible {
    outline: 2px solid rgba(255, 107, 44, 0.55);
    outline-offset: 2px;
  }
`;

export const WorkoutName = styled.span<{ $done?: boolean }>`
  flex: 1;
  min-width: 0;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--focus-text);
  text-decoration: ${(p) => (p.$done ? 'line-through' : 'none')};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const WorkoutDetail = styled.span`
  flex-shrink: 0;
  font-family: var(--focus-mono);
  font-size: 0.72rem;
  letter-spacing: 0.02em;
  color: #e6502f;
  padding: 0.15rem 0.5rem;
  border-radius: 999px;
  background: rgba(255, 107, 44, 0.12);
`;

export const WorkoutDelete = styled.button`
  flex-shrink: 0;
  border: none;
  background: transparent;
  color: var(--focus-muted);
  font-size: 1.05rem;
  line-height: 1;
  cursor: pointer;
  padding: 0 0.2rem;
  opacity: 0.6;

  &:hover {
    color: #e63a2e;
    opacity: 1;
  }
`;

export const WorkoutEmpty = styled.div`
  display: grid;
  place-items: center;
  min-height: 6rem;
  border-radius: 0.75rem;
  border: 1px dashed rgba(255, 107, 44, 0.3);
  background: repeating-linear-gradient(
    45deg,
    rgba(255, 107, 44, 0.04) 0 8px,
    transparent 8px 16px
  );
  font-size: 0.8125rem;
  font-style: italic;
  color: var(--focus-muted);
  text-align: center;
  padding: 1rem;
`;

export const WorkoutFoot = styled.p`
  margin: 0;
  text-align: center;
  font-size: 0.75rem;
  line-height: 1.5;
  color: var(--focus-muted);
`;

export const WorkoutModeNav = styled.nav`
  display: flex;
  gap: 0.375rem;
  padding: 0.3rem;
  border-radius: 0.875rem;
  border: 1px solid var(--focus-border);
  background: var(--focus-paper);
  width: fit-content;
  max-width: 100%;
  flex-wrap: wrap;
`;

export const WorkoutModeTab = styled.button<{ $active?: boolean }>`
  border: none;
  border-radius: 0.65rem;
  padding: 0.55rem 1rem;
  font-family: var(--focus-body);
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: pointer;
  color: ${(p) => (p.$active ? '#fff' : 'var(--focus-text)')};
  background: ${(p) =>
    p.$active
      ? 'linear-gradient(135deg, #ff8a4c, #e63a2e)'
      : 'transparent'};
  box-shadow: ${(p) =>
    p.$active ? '0 6px 18px -8px rgba(255, 107, 44, 0.55)' : 'none'};
  transition:
    background 0.18s ease,
    color 0.18s ease,
    box-shadow 0.2s ease;

  &:hover {
    color: ${(p) => (p.$active ? '#fff' : '#e6502f')};
  }
`;

export const WorkoutModeWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

export const WorkoutAppliedBanner = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  flex-wrap: wrap;
  padding: 0.65rem 0.85rem;
  border-radius: 0.75rem;
  border: 1px solid rgba(34, 197, 94, 0.35);
  background: rgba(34, 197, 94, 0.1);
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--focus-text);
`;

export const WorkoutAppliedClear = styled.button`
  border: none;
  background: transparent;
  font-family: var(--focus-body);
  font-size: 0.75rem;
  font-weight: 600;
  color: #16a34a;
  cursor: pointer;
  text-decoration: underline;
  text-underline-offset: 2px;
`;

export const TrainingIntro = styled.p`
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.55;
  color: var(--focus-muted);
  max-width: 42rem;
`;

export const TrainingGrid = styled.div`
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fill, minmax(15rem, 1fr));
`;

export const TrainingCard = styled.button<{ $accent: string }>`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  padding: 1.125rem;
  border-radius: 1rem;
  cursor: pointer;
  text-align: left;
  font-family: var(--focus-body);
  border: 1px solid var(--focus-border);
  background: var(--focus-surface-solid);
  box-shadow: 0 12px 32px -22px rgba(15, 23, 42, 0.45);
  transition:
    transform 0.14s ease,
    border-color 0.18s ease,
    box-shadow 0.2s ease;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 1rem;
    right: 1rem;
    height: 2px;
    background: linear-gradient(
      90deg,
      transparent,
      ${(p) => p.$accent},
      transparent
    );
  }

  &:hover {
    transform: translateY(-2px);
    border-color: ${(p) => `${p.$accent}66`};
    box-shadow: 0 16px 40px -20px ${(p) => `${p.$accent}44`};
  }
`;

export const TrainingBadge = styled.span<{ $tier: 'free' | 'pro' }>`
  align-self: flex-start;
  font-family: var(--focus-mono);
  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  padding: 0.28rem 0.55rem;
  border-radius: 999px;
  color: ${(p) => (p.$tier === 'free' ? '#16a34a' : '#e6502f')};
  border: 1px solid
    ${(p) => (p.$tier === 'free' ? 'rgba(34, 197, 94, 0.4)' : 'rgba(255, 107, 44, 0.45)')};
  background: ${(p) =>
    p.$tier === 'free' ? 'rgba(34, 197, 94, 0.12)' : 'rgba(255, 107, 44, 0.12)'};
`;

export const TrainingCardTitle = styled.h3`
  margin: 0;
  font-family: var(--focus-display);
  font-size: 1.125rem;
  font-weight: 600;
  letter-spacing: -0.015em;
  color: var(--focus-text);
`;

export const TrainingCardMeta = styled.p`
  margin: 0;
  font-size: 0.78rem;
  color: var(--focus-muted);
`;

export const TrainingCardTagline = styled.p`
  margin: 0;
  font-size: 0.8125rem;
  line-height: 1.45;
  color: var(--focus-muted);
`;

export const TrainingPrice = styled.span`
  margin-top: auto;
  font-family: var(--focus-mono);
  font-size: 0.75rem;
  font-weight: 700;
  color: #e6502f;
`;

export const TrainingDetail = styled.section<{ $accent: string }>`
  display: flex;
  flex-direction: column;
  gap: 1.125rem;
  padding: 1.25rem;
  border-radius: 1rem;
  border: 1px solid var(--focus-border);
  background: var(--focus-surface-solid);
  box-shadow: var(--focus-shadow);

  &::before {
    content: '';
    display: block;
    height: 2px;
    margin: -1.25rem -1.25rem 0;
    border-radius: 1rem 1rem 0 0;
    background: linear-gradient(
      90deg,
      transparent,
      ${(p) => p.$accent},
      transparent
    );
  }
`;

export const TrainingDetailHead = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
`;

export const TrainingBack = styled.button`
  border: none;
  background: transparent;
  font-family: var(--focus-body);
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--focus-muted);
  cursor: pointer;
  padding: 0;

  &:hover {
    color: #e6502f;
  }
`;

export const TrainingDetailTitle = styled.h3`
  margin: 0.35rem 0 0;
  font-family: var(--focus-display);
  font-size: 1.35rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--focus-text);
`;

export const TrainingCoach = styled.p`
  margin: 0.25rem 0 0;
  font-size: 0.8125rem;
  color: var(--focus-muted);
`;

export const TrainingDayTabs = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
`;

export const TrainingDayTab = styled.button<{ $active?: boolean; $accent: string }>`
  border: 1px solid
    ${(p) => (p.$active ? p.$accent : 'var(--focus-border)')};
  background: ${(p) =>
    p.$active ? `${p.$accent}18` : 'var(--focus-paper)'};
  color: var(--focus-text);
  border-radius: 999px;
  padding: 0.4rem 0.8rem;
  font-family: var(--focus-mono);
  font-size: 0.68rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  cursor: pointer;
  transition:
    border-color 0.15s ease,
    background 0.15s ease;
`;

export const TrainingSplit = styled.div`
  display: grid;
  gap: 1rem;

  @media (min-width: 820px) {
    grid-template-columns: 1fr 1fr;
  }
`;

export const TrainingBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
`;

export const TrainingBlockTitle = styled.h4`
  margin: 0;
  font-family: var(--focus-mono);
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #e6502f;
`;

export const TrainingFocus = styled.p`
  margin: 0;
  font-size: 0.8125rem;
  color: var(--focus-muted);
`;

export const TrainingExerciseList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
`;

export const TrainingExerciseItem = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.55rem 0.7rem;
  border-radius: 0.65rem;
  border: 1px solid var(--focus-border);
  background: var(--focus-paper);
  font-size: 0.8125rem;
`;

export const TrainingMealList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const TrainingMealItem = styled.li`
  padding: 0.65rem 0.75rem;
  border-radius: 0.75rem;
  border: 1px solid var(--focus-border);
  background: var(--focus-paper);
`;

export const TrainingMealName = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--focus-text);
`;

export const TrainingMealMacros = styled.div`
  margin-top: 0.25rem;
  font-family: var(--focus-mono);
  font-size: 0.68rem;
  letter-spacing: 0.02em;
  color: var(--focus-muted);
`;

export const TrainingMealNote = styled.span`
  margin-left: 0.35rem;
  color: #e6502f;
`;

export const TrainingApplyBtn = styled.button`
  align-self: flex-start;
  border: none;
  border-radius: 0.75rem;
  padding: 0.7rem 1.15rem;
  font-family: var(--focus-body);
  font-size: 0.875rem;
  font-weight: 700;
  color: #fff;
  cursor: pointer;
  background: linear-gradient(135deg, #ff8a4c, #e63a2e);
  box-shadow: 0 8px 22px -8px rgba(255, 107, 44, 0.55);
  transition:
    transform 0.12s ease,
    box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 12px 28px -8px rgba(255, 107, 44, 0.65);
  }
`;

export const PaywallOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 50;
  display: grid;
  place-items: center;
  padding: 1rem;
  background: rgba(15, 23, 42, 0.55);
  backdrop-filter: blur(6px);
`;

export const PaywallCard = styled.div`
  width: min(100%, 26rem);
  padding: 1.5rem;
  border-radius: 1.125rem;
  border: 1px solid rgba(255, 107, 44, 0.28);
  background: var(--focus-surface-solid);
  box-shadow: 0 24px 64px -24px rgba(0, 0, 0, 0.55);
`;

export const PaywallTitle = styled.h3`
  margin: 0;
  font-family: var(--focus-display);
  font-size: 1.35rem;
  font-weight: 700;
  color: var(--focus-text);
`;

export const PaywallSub = styled.p`
  margin: 0.5rem 0 1rem;
  font-size: 0.875rem;
  line-height: 1.5;
  color: var(--focus-muted);
`;

export const PaywallList = styled.ul`
  margin: 0 0 1.25rem;
  padding: 0 0 0 1.1rem;
  font-size: 0.8125rem;
  line-height: 1.6;
  color: var(--focus-text);
`;

export const PaywallPrice = styled.div`
  margin-bottom: 1rem;
  font-family: var(--focus-mono);
  font-size: 1.125rem;
  font-weight: 700;
  color: #e6502f;
`;

export const PaywallActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const PaywallPrimary = styled.button`
  border: none;
  border-radius: 0.75rem;
  padding: 0.75rem 1rem;
  font-family: var(--focus-body);
  font-size: 0.875rem;
  font-weight: 700;
  color: #fff;
  cursor: pointer;
  background: linear-gradient(135deg, #ff8a4c, #e63a2e);
`;

export const PaywallGhost = styled.button`
  border: none;
  background: transparent;
  font-family: var(--focus-body);
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--focus-muted);
  cursor: pointer;
  padding: 0.5rem;

  &:hover {
    color: var(--focus-text);
  }
`;

