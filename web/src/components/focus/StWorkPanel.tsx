import styled, { keyframes } from 'styled-components';

const amberPulse = keyframes`
  0%, 100% { transform: scale(1); opacity: 0.9; }
  50% { transform: scale(1.18); opacity: 1; }
`;

export const WorkStage = styled.section`
  position: relative;
  overflow: hidden;
  border-radius: 1.25rem;
  border: 1px solid rgba(232, 168, 56, 0.26);
  background:
    radial-gradient(
      ellipse 80% 60% at 0% 0%,
      rgba(232, 168, 56, 0.16),
      transparent 55%
    ),
    radial-gradient(
      ellipse 60% 55% at 100% 100%,
      rgba(232, 168, 56, 0.08),
      transparent 50%
    ),
    var(--focus-surface-solid);
  box-shadow:
    var(--focus-shadow),
    0 0 0 1px rgba(232, 168, 56, 0.06) inset;

  /* hand-drawn paper grain via cross-hatched gradients */
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    pointer-events: none;
    background-image:
      repeating-linear-gradient(
        135deg,
        rgba(232, 168, 56, 0.04) 0 1px,
        transparent 1px 9px
      );
    mix-blend-mode: multiply;
    opacity: 0.5;
  }

  [data-theme='dark'] & {
    border-color: rgba(232, 168, 56, 0.22);
    background:
      radial-gradient(
        ellipse 80% 60% at 0% 0%,
        rgba(232, 168, 56, 0.12),
        transparent 55%
      ),
      radial-gradient(
        ellipse 60% 55% at 100% 100%,
        rgba(232, 168, 56, 0.06),
        transparent 50%
      ),
      var(--focus-surface-solid);

    &::before {
      opacity: 0.3;
      mix-blend-mode: screen;
    }
  }
`;

export const WorkHero = styled.div`
  position: relative;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.5rem 1.5rem 0;
  flex-wrap: wrap;
`;

export const WorkBrand = styled.div`
  display: flex;
  align-items: center;
  gap: 0.875rem;
  min-width: 0;
`;

export const WorkLogo = styled.div`
  position: relative;
  display: grid;
  place-items: center;
  flex-shrink: 0;
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 0.85rem;
  background: linear-gradient(145deg, #f4c46a, #b97f1e);
  color: #2a1d05;
  font-size: 1rem;
  font-weight: 800;
  box-shadow:
    0 10px 28px -10px rgba(232, 168, 56, 0.5),
    inset 0 1px 0 rgba(255, 255, 255, 0.35);
`;

export const WorkEyebrow = styled.span`
  display: inline-block;
  font-family: var(--focus-mono);
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: #b97f1e;
  margin-bottom: 0.2rem;
`;

export const WorkTitle = styled.h2`
  margin: 0;
  font-family: var(--focus-display);
  font-size: 1.45rem;
  font-weight: 700;
  letter-spacing: -0.025em;
  color: var(--focus-text);
  font-style: italic;
`;

export const WorkSub = styled.p`
  margin: 0.2rem 0 0;
  font-size: 0.8125rem;
  color: var(--focus-muted);
`;

export const WorkStatus = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
  font-family: var(--focus-mono);
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: #b97f1e;
  padding: 0.4rem 0.7rem 0.4rem 0.55rem;
  border-radius: 999px;
  border: 1px solid rgba(232, 168, 56, 0.45);
  background: rgba(232, 168, 56, 0.12);

  &::before {
    content: '';
    width: 0.45rem;
    height: 0.45rem;
    border-radius: 999px;
    background: #e8a838;
    box-shadow: 0 0 10px rgba(232, 168, 56, 0.7);
    animation: ${amberPulse} 2.2s ease-in-out infinite;
  }
`;

export const WorkBody = styled.div`
  position: relative;
  padding: 1.25rem 1.5rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.125rem;
`;

export const WorkGrid = styled.div`
  display: grid;
  gap: 1.125rem;
  align-items: stretch;

  @media (min-width: 900px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

export const WorkCard = styled.section<{ $accent?: string }>`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
  min-height: 0;
  padding: 1.125rem 1.125rem 1.25rem;
  border-radius: 1rem;
  border: 1px solid var(--focus-border);
  background: var(--focus-surface-solid);
  box-shadow:
    0 14px 38px -22px rgba(15, 23, 42, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.06);
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 1rem;
    right: 1rem;
    height: 2px;
    background: ${(p) =>
      p.$accent
        ? `linear-gradient(90deg, transparent, ${p.$accent}, transparent)`
        : 'linear-gradient(90deg, transparent, rgba(232, 168, 56, 0.7), transparent)'};
    opacity: 0.8;
  }
`;

export const WorkCardHead = styled.header`
  display: flex;
  align-items: baseline;
  gap: 0.55rem;
  justify-content: space-between;
`;

export const WorkCardCaption = styled.span<{ $accent?: string }>`
  font-family: var(--focus-mono);
  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: ${(p) => p.$accent ?? '#b97f1e'};
`;

export const WorkCardTitle = styled.h3`
  margin: 0;
  font-family: var(--focus-display);
  font-size: 1.15rem;
  font-weight: 600;
  letter-spacing: -0.015em;
  color: var(--focus-text);
  font-style: italic;
`;

export const WorkCardMeta = styled.span`
  font-family: var(--focus-mono);
  font-size: 0.7rem;
  color: var(--focus-muted);
`;

export const WorkRow = styled.form`
  display: flex;
  gap: 0.5rem;
  padding: 0.25rem;
  border-radius: 0.75rem;
  border: 1px solid var(--focus-border);
  background: var(--focus-paper);
`;

export const WorkField = styled.input`
  flex: 1;
  min-width: 0;
  border: none;
  background: transparent;
  padding: 0.55rem 0.75rem;
  font-family: var(--focus-body);
  font-size: 0.875rem;
  color: var(--focus-text);
  outline: none;

  &::placeholder {
    color: var(--focus-muted);
  }
`;

export const WorkAdd = styled.button`
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  border: none;
  border-radius: 0.6rem;
  padding: 0.55rem 0.85rem;
  font-family: var(--focus-body);
  font-size: 0.8125rem;
  font-weight: 700;
  color: #2a1d05;
  cursor: pointer;
  background: linear-gradient(135deg, #f4c46a, #b97f1e);
  box-shadow: 0 4px 14px rgba(232, 168, 56, 0.32);
  transition:
    transform 0.12s ease,
    box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 8px 22px rgba(232, 168, 56, 0.42);
  }
  &:active {
    transform: scale(0.97);
  }
`;

export const WorkBody2 = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
  min-height: 0;
`;

export const WorkEmpty = styled.div`
  display: grid;
  place-items: center;
  flex: 1;
  min-height: 6rem;
  border-radius: 0.75rem;
  border: 1px dashed rgba(232, 168, 56, 0.3);
  background:
    repeating-linear-gradient(
      45deg,
      rgba(232, 168, 56, 0.04) 0 8px,
      transparent 8px 16px
    );
  font-family: var(--focus-body);
  font-size: 0.8125rem;
  font-style: italic;
  color: var(--focus-muted);
  text-align: center;
  padding: 1rem;
`;

export const WorkLinkGrid = styled.div`
  display: grid;
  gap: 0.5rem;
  grid-template-columns: repeat(auto-fill, minmax(7rem, 1fr));
`;

export const WorkLinkTile = styled.a<{ $color: string }>`
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.55rem;
  padding: 0.6rem 0.7rem;
  border-radius: 0.75rem;
  text-decoration: none;
  font-family: var(--focus-body);
  color: var(--focus-text);
  border: 1px solid var(--focus-border);
  background: var(--focus-paper);
  transition:
    transform 0.12s ease,
    border-color 0.18s ease,
    box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    border-color: ${(p) => p.$color};
    box-shadow: 0 10px 24px -12px ${(p) => p.$color}55;
  }
`;

export const WorkLinkMark = styled.span<{ $color: string }>`
  display: grid;
  place-items: center;
  width: 1.75rem;
  height: 1.75rem;
  flex-shrink: 0;
  border-radius: 0.5rem;
  font-family: var(--focus-mono);
  font-size: 0.85rem;
  font-weight: 700;
  color: ${(p) => p.$color};
  background: ${(p) => `${p.$color}1c`};
  border: 1px solid ${(p) => `${p.$color}33`};
`;

export const WorkLinkLabel = styled.span`
  font-size: 0.8125rem;
  font-weight: 600;
  letter-spacing: -0.005em;
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const WorkLinkDelete = styled.button`
  position: absolute;
  top: 0.25rem;
  right: 0.35rem;
  width: 1.1rem;
  height: 1.1rem;
  display: grid;
  place-items: center;
  border-radius: 999px;
  border: none;
  background: transparent;
  color: var(--focus-muted);
  font-size: 0.85rem;
  line-height: 1;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.15s ease;

  ${WorkLinkTile}:hover & {
    opacity: 0.85;
  }

  &:hover {
    color: #d33;
    opacity: 1;
  }
`;

export const WorkTaskList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 0.35rem;
`;

export const WorkTaskItem = styled.li<{ $done?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.55rem 0.7rem;
  border-radius: 0.7rem;
  border: 1px solid var(--focus-border);
  background: ${(p) =>
    p.$done
      ? 'transparent'
      : 'var(--focus-paper)'};
  transition: background 0.15s ease;
  opacity: ${(p) => (p.$done ? 0.55 : 1)};
`;

export const WorkTaskCheck = styled.button<{ $done?: boolean }>`
  display: grid;
  place-items: center;
  width: 1.1rem;
  height: 1.1rem;
  flex-shrink: 0;
  border-radius: 0.35rem;
  border: 1.5px solid
    ${(p) => (p.$done ? '#b97f1e' : 'var(--focus-border)')};
  background: ${(p) => (p.$done ? '#e8a838' : 'transparent')};
  color: #2a1d05;
  cursor: pointer;
  transition:
    background 0.15s ease,
    border-color 0.15s ease;

  &:hover {
    border-color: #b97f1e;
  }
`;

export const WorkTaskText = styled.span<{ $done?: boolean }>`
  flex: 1;
  font-size: 0.875rem;
  text-decoration: ${(p) => (p.$done ? 'line-through' : 'none')};
  color: ${(p) => (p.$done ? 'var(--focus-muted)' : 'var(--focus-text)')};
`;

export const WorkTaskDelete = styled.button`
  flex-shrink: 0;
  border: none;
  background: transparent;
  color: var(--focus-muted);
  font-size: 1rem;
  line-height: 1;
  cursor: pointer;
  padding: 0 0.25rem;
  opacity: 0.6;

  &:hover {
    color: #d33;
    opacity: 1;
  }
`;

export const WorkNotesWrap = styled.div`
  position: relative;
  border-radius: 0.85rem;
  border: 1px solid rgba(232, 168, 56, 0.22);
  background:
    repeating-linear-gradient(
      transparent 0 1.45rem,
      rgba(232, 168, 56, 0.1) 1.45rem 1.5rem
    ),
    var(--focus-paper);
  overflow: hidden;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 2rem;
    width: 1px;
    background: rgba(220, 38, 38, 0.25);
  }
`;

export const WorkNotes = styled.textarea`
  position: relative;
  z-index: 1;
  display: block;
  width: 100%;
  min-height: 11rem;
  resize: vertical;
  border: 0;
  outline: none;
  background: transparent;
  font-family: var(--focus-display);
  font-size: 0.95rem;
  line-height: 1.5rem;
  color: var(--focus-text);
  padding: 0.45rem 1rem 0.45rem 2.5rem;

  &::placeholder {
    color: var(--focus-muted);
    font-style: italic;
  }
`;

export const WorkTimerHolder = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0;
`;
