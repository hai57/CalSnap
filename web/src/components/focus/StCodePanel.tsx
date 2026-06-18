import styled, { keyframes } from 'styled-components';

const caretBlink = keyframes`
  0%, 49% { opacity: 1; }
  50%, 100% { opacity: 0; }
`;

export const CodeStage = styled.section`
  position: relative;
  overflow: hidden;
  border-radius: 1.25rem;
  border: 1px solid rgba(176, 108, 255, 0.22);
  background:
    radial-gradient(
      ellipse 80% 60% at 0% 0%,
      rgba(176, 108, 255, 0.16),
      transparent 55%
    ),
    radial-gradient(
      ellipse 60% 55% at 100% 100%,
      rgba(56, 189, 248, 0.1),
      transparent 50%
    ),
    var(--focus-surface-solid);
  box-shadow:
    var(--focus-shadow),
    0 0 0 1px rgba(176, 108, 255, 0.06) inset;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    pointer-events: none;
    background-image:
      linear-gradient(
        rgba(176, 108, 255, 0.05) 1px,
        transparent 1px
      ),
      linear-gradient(
        90deg,
        rgba(176, 108, 255, 0.05) 1px,
        transparent 1px
      );
    background-size: 28px 28px;
    background-position: -1px -1px;
    mask-image: radial-gradient(
      ellipse at 50% 0%,
      rgba(0, 0, 0, 0.55),
      transparent 70%
    );
    opacity: 0.6;
  }

  [data-theme='dark'] & {
    border-color: rgba(176, 108, 255, 0.2);
    background:
      radial-gradient(
        ellipse 80% 60% at 0% 0%,
        rgba(176, 108, 255, 0.12),
        transparent 55%
      ),
      radial-gradient(
        ellipse 60% 55% at 100% 100%,
        rgba(56, 189, 248, 0.08),
        transparent 50%
      ),
      var(--focus-surface-solid);
  }
`;

export const CodeHero = styled.div`
  position: relative;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.5rem 1.5rem 0;
  flex-wrap: wrap;
`;

export const CodeBrand = styled.div`
  display: flex;
  align-items: center;
  gap: 0.875rem;
  min-width: 0;
`;

export const CodeLogo = styled.div`
  display: grid;
  place-items: center;
  flex-shrink: 0;
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 0.85rem;
  background: linear-gradient(145deg, #b06cff, #6d36cf);
  color: #fff;
  font-family: var(--focus-mono);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  box-shadow:
    0 10px 28px -10px rgba(176, 108, 255, 0.45),
    inset 0 1px 0 rgba(255, 255, 255, 0.25);
`;

export const CodeTitle = styled.h2`
  margin: 0;
  font-family: var(--focus-display);
  font-size: 1.375rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--focus-text);
`;

export const CodeSub = styled.p`
  margin: 0.125rem 0 0;
  font-family: var(--focus-mono);
  font-size: 0.75rem;
  letter-spacing: 0.02em;
  color: var(--focus-muted);
`;

export const CodeStatus = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  flex-shrink: 0;
  font-family: var(--focus-mono);
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #b06cff;
  padding: 0.4rem 0.7rem 0.4rem 0.6rem;
  border-radius: 999px;
  border: 1px solid rgba(176, 108, 255, 0.4);
  background: rgba(176, 108, 255, 0.1);

  &::before {
    content: '';
    display: inline-block;
    width: 0.45rem;
    height: 0.45rem;
    border-radius: 999px;
    background: #38f6a4;
    box-shadow: 0 0 8px rgba(56, 246, 164, 0.7);
  }
`;

export const CodeBody = styled.div`
  position: relative;
  padding: 1.25rem 1.5rem 1.5rem;
  display: grid;
  gap: 1.125rem;
  grid-template-columns: minmax(0, 1fr);

  @media (min-width: 900px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

export const CodeBlock = styled.section`
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
  padding: 1.125rem;
  border-radius: 1rem;
  border: 1px solid rgba(176, 108, 255, 0.18);
  background:
    linear-gradient(
      180deg,
      rgba(176, 108, 255, 0.06),
      transparent 60%
    ),
    var(--focus-surface-solid);
  box-shadow:
    0 12px 36px -22px rgba(15, 23, 42, 0.45),
    inset 0 1px 0 rgba(255, 255, 255, 0.04);
`;

export const CodeBlockHead = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: var(--focus-mono);
  font-size: 0.7rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--focus-muted);

  &::before {
    content: '◆';
    color: #b06cff;
    font-size: 0.55rem;
  }
`;

export const CodeBlockTitle = styled.h3`
  margin: 0;
  font-family: var(--focus-display);
  font-size: 1.05rem;
  font-weight: 600;
  letter-spacing: -0.01em;
  color: var(--focus-text);
`;

export const CodePrompt = styled.form`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.55rem 0.65rem;
  border-radius: 0.75rem;
  border: 1px solid var(--focus-border);
  background: var(--focus-paper);
  font-family: var(--focus-mono);

  &:focus-within {
    border-color: rgba(176, 108, 255, 0.5);
    box-shadow: 0 0 0 3px rgba(176, 108, 255, 0.12);
  }
`;

export const CodePromptCaret = styled.span`
  flex-shrink: 0;
  font-family: var(--focus-mono);
  font-size: 0.85rem;
  color: #38f6a4;
  user-select: none;

  &::after {
    content: '_';
    display: inline-block;
    margin-left: 0.1rem;
    animation: ${caretBlink} 1.05s steps(1, end) infinite;
  }
`;

export const CodePromptField = styled.input`
  flex: 1;
  min-width: 0;
  border: none;
  background: transparent;
  color: var(--focus-text);
  font-family: var(--focus-mono);
  font-size: 0.8125rem;
  padding: 0.4rem 0.25rem;
  outline: none;

  &::placeholder {
    color: var(--focus-muted);
    font-style: italic;
  }
`;

export const CodePromptSelect = styled.select`
  flex-shrink: 0;
  border: 1px solid var(--focus-border);
  border-radius: 0.55rem;
  padding: 0.4rem 0.55rem;
  font-family: var(--focus-mono);
  font-size: 0.7rem;
  background: var(--focus-paper);
  color: var(--focus-text);
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 0.1em;
`;

export const CodePromptBtn = styled.button`
  flex-shrink: 0;
  border: none;
  border-radius: 0.55rem;
  padding: 0.45rem 0.85rem;
  font-family: var(--focus-mono);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  cursor: pointer;
  color: #ffffff;
  background: linear-gradient(135deg, #b06cff, #6d36cf);
  box-shadow: 0 4px 14px rgba(176, 108, 255, 0.32);
  transition:
    transform 0.12s ease,
    box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 8px 22px rgba(176, 108, 255, 0.4);
  }
  &:active {
    transform: scale(0.97);
  }
`;

export const CodeShortcuts = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(7.5rem, 1fr));
  gap: 0.5rem;
`;

export const CodeShortcut = styled.a<{ $color: string }>`
  display: flex;
  align-items: center;
  gap: 0.55rem;
  padding: 0.55rem 0.7rem;
  border-radius: 0.75rem;
  text-decoration: none;
  font-family: var(--focus-body);
  font-size: 0.78rem;
  font-weight: 600;
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
    box-shadow: 0 10px 24px -12px ${(p) => p.$color}66;
  }
`;

export const CodeShortcutMark = styled.span<{ $color: string }>`
  display: grid;
  place-items: center;
  width: 1.75rem;
  height: 1.75rem;
  flex-shrink: 0;
  border-radius: 0.45rem;
  font-family: var(--focus-mono);
  font-size: 0.85rem;
  font-weight: 700;
  color: ${(p) => p.$color};
  background: ${(p) => `${p.$color}1c`};
  border: 1px solid ${(p) => `${p.$color}33`};
`;

export const CodeShortcutLabel = styled.span`
  letter-spacing: -0.005em;
`;

export const CodeSnippetWrap = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  flex: 1;
  border-radius: 0.85rem;
  border: 1px solid rgba(176, 108, 255, 0.22);
  background: #0e0a1f;
  overflow: hidden;
  box-shadow:
    inset 0 0 0 1px rgba(255, 255, 255, 0.03),
    0 14px 40px -22px rgba(0, 0, 0, 0.6);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1.85rem;
    background: linear-gradient(
      180deg,
      rgba(176, 108, 255, 0.18),
      transparent
    );
    pointer-events: none;
  }
`;

export const CodeSnippetBar = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.55rem 0.75rem;
  font-family: var(--focus-mono);
  font-size: 0.65rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(220, 210, 255, 0.55);
  border-bottom: 1px solid rgba(176, 108, 255, 0.12);

  span.dot {
    width: 0.55rem;
    height: 0.55rem;
    border-radius: 999px;
    margin-right: 0.15rem;
    box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.06) inset;
  }
  span.dot.r { background: #ff5f56; }
  span.dot.y { background: #ffbd2e; }
  span.dot.g { background: #27c93f; }

  small {
    margin-left: auto;
    font-size: 0.6rem;
    opacity: 0.7;
  }
`;

export const CodeSnippet = styled.textarea`
  position: relative;
  z-index: 1;
  flex: 1;
  min-height: 12rem;
  resize: vertical;
  border: 0;
  outline: none;
  padding: 0.85rem 1rem;
  font-family: var(--focus-mono);
  font-size: 0.78rem;
  line-height: 1.7;
  color: #e9defc;
  background: transparent;
  caret-color: #38f6a4;

  &::placeholder {
    color: rgba(220, 210, 255, 0.35);
    font-style: italic;
  }
`;

export const CodeHint = styled.p`
  margin: 0;
  font-family: var(--focus-mono);
  font-size: 0.68rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--focus-muted);
  opacity: 0.85;
`;
