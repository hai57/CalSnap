import { colors } from '@src/styles/theme';
import styled, { css, keyframes } from 'styled-components';

export const BOT_W = 70;
export const BOT_H = 77;
export const MARGIN = 24;
export const TOP_RESERVE = 110;
export const MOVE_MS = 5200;
export const MESSAGE_MS = 8000;
export const ANSWER_HOLD_MS = 7000;
export const IDLE_THINK_MS = 13000;
export const THINK_DURATION = 2400;

export const ROAM_X = 150;
export const ROAM_Y = 220;

// ----- Chibi character (SVG) -----
export const VB_W = 80;
export const VB_H = 88;
export const EYE_Y = 36.5;
export const SKIN = '#ffe9dc';
export const INK = '#0f172a';
export const HAIR_EDGE = '#c8d2e0';
export const SUIT_EDGE = '#c3cedd';

export const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
`;

export const dragWobble = keyframes`
  0% { transform: rotate(-9deg); }
  50% { transform: rotate(9deg); }
  100% { transform: rotate(-9deg); }
`;

export const blink = keyframes`
  0%, 92%, 100% { transform: scaleY(1); }
  96% { transform: scaleY(0.1); }
`;

export const Layer = styled.div`
  position: fixed;
  inset: 0;
  z-index: 40;
  pointer-events: none;
`;

export const Mover = styled.div<{
  $reduced: boolean;
  $dragging: boolean;
  $avoiding?: boolean;
}>`
  position: absolute;
  top: 0;
  left: 0;
  will-change: transform;
  transition: ${(p) =>
    p.$dragging || p.$reduced
      ? 'none'
      : p.$avoiding
        ? 'transform 0.55s cubic-bezier(0.22, 1, 0.36, 1)'
        : 'transform 5.2s cubic-bezier(0.45, 0, 0.25, 1)'};
`;

export const Anchor = styled.div<{ $dragging: boolean }>`
  position: relative;
  width: ${BOT_W}px;
  height: ${BOT_H}px;
  pointer-events: auto;
  cursor: ${(p) => (p.$dragging ? 'grabbing' : 'grab')};
  touch-action: none;
`;

export const Robot = styled.div<{ $still?: boolean; $dragging?: boolean }>`
  position: relative;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  filter: drop-shadow(0 12px 18px rgba(37, 99, 235, 0.35));
  transform-origin: 50% 12%;

  ${(p) =>
    p.$dragging
      ? css`
          animation: ${dragWobble} 0.45s ease-in-out infinite;
        `
      : !p.$still &&
        css`
          @media (prefers-reduced-motion: no-preference) {
            animation: ${float} 3.4s ease-in-out infinite;
          }
        `}
`;

export const Flip = styled.div<{ $facingLeft: boolean }>`
  transform: scaleX(${(p) => (p.$facingLeft ? -1 : 1)});
  transition: transform 0.3s ease;
`;

export const BotSvg = styled.svg`
  display: block;
  overflow: visible;

  .nb-blink {
    transform-box: fill-box;
    transform-origin: center;
  }
  @media (prefers-reduced-motion: no-preference) {
    .nb-blink {
      animation: ${blink} 4.6s ease-in-out infinite;
    }
  }
`;

export const Bubble = styled.div<{ $visible: boolean; $left: boolean }>`
  position: absolute;
  bottom: calc(100% + 12px);
  ${(p) => (p.$left ? 'left: 0;' : 'right: 0;')}
  width: max-content;
  max-width: 220px;
  padding: 0.55rem 0.75rem;
  border-radius: 0.875rem;
  background: ${colors.white};
  backdrop-filter: blur(8px);
  border: 1px solid ${colors.surfaceBorder};
  box-shadow: 0 12px 30px -12px rgba(15, 23, 42, 0.3);
  font-size: 0.8125rem;
  font-weight: 500;
  line-height: 1.35;
  color: ${colors.slate700};
  opacity: ${(p) => (p.$visible ? 1 : 0)};
  transform: translateY(${(p) => (p.$visible ? '0' : '6px')})
    scale(${(p) => (p.$visible ? 1 : 0.96)});
  transform-origin: ${(p) => (p.$left ? 'left bottom' : 'right bottom')};
  transition:
    opacity 0.25s ease,
    transform 0.25s ease;
  pointer-events: none;

  &::after {
    content: '';
    position: absolute;
    top: 100%;
    ${(p) => (p.$left ? 'left: 18px;' : 'right: 18px;')}
    border: 6px solid transparent;
    border-top-color: ${colors.white};
  }
`;

export const Panel = styled.div<{ $visible: boolean; $left: boolean }>`
  position: absolute;
  bottom: calc(100% + 12px);
  ${(p) => (p.$left ? 'left: 0;' : 'right: 0;')}
  width: 200px;
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  padding: 0.625rem;
  border-radius: 0.875rem;
  background: ${colors.white};
  border: 1px solid ${colors.surfaceBorder};
  box-shadow: 0 16px 36px -14px rgba(15, 23, 42, 0.4);
  opacity: ${(p) => (p.$visible ? 1 : 0)};
  transform: translateY(${(p) => (p.$visible ? '0' : '6px')})
    scale(${(p) => (p.$visible ? 1 : 0.96)});
  transform-origin: ${(p) => (p.$left ? 'left bottom' : 'right bottom')};
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
  pointer-events: ${(p) => (p.$visible ? 'auto' : 'none')};
`;

export const PanelTitle = styled.div`
  font-size: 0.75rem;
  font-weight: 700;
  color: ${colors.slate500};
  padding: 0 0.125rem 0.125rem;
`;

export const Chip = styled.button`
  text-align: left;
  border: 1px solid ${colors.slate200};
  background: ${colors.slate50};
  border-radius: 0.625rem;
  padding: 0.5rem 0.625rem;
  font-family: inherit;
  font-size: 0.8125rem;
  font-weight: 500;
  color: ${colors.slate700};
  cursor: pointer;
  transition:
    background 0.15s ease,
    border-color 0.15s ease,
    transform 0.08s ease;

  &:hover {
    background: ${colors.brand50};
    border-color: ${colors.brand300};
    color: ${colors.brand700};
  }
  &:active {
    transform: scale(0.98);
  }
`;

// ----- Off-state sad box -----
export const SadWrap = styled.div`
  position: fixed;
  right: ${MARGIN}px;
  bottom: ${MARGIN}px;
  z-index: 40;
`;

export const SadCard = styled.button`
  display: flex;
  align-items: center;
  gap: 0;
  padding: 0.75rem;
  border-radius: 1rem;
  background: ${colors.surface};
  backdrop-filter: blur(8px);
  border: 1px solid ${colors.surfaceBorder};
  box-shadow: 0 14px 32px -14px rgba(15, 23, 42, 0.4);
  cursor: pointer;
  font-family: inherit;
  transition:
    transform 0.12s ease,
    box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 18px 40px -14px rgba(15, 23, 42, 0.5);
  }
  &:active {
    transform: translateY(0) scale(0.99);
  }
`;

export const SadText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  max-width: 0;
  margin-left: 0;
  opacity: 0;
  transition:
    max-width 0.28s ease,
    margin-left 0.28s ease,
    opacity 0.2s ease;

  ${SadCard}:hover &,
  ${SadCard}:focus-visible & {
    max-width: 220px;
    margin-left: 0.75rem;
    opacity: 1;
  }

  & strong {
    font-size: 0.875rem;
    font-weight: 700;
    color: ${colors.slate700};
  }
  & span {
    font-size: 0.75rem;
    color: ${colors.slate500};
  }
`;
