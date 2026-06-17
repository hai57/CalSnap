import styled from 'styled-components';

export const SpotifyStage = styled.section`
  position: relative;
  overflow: hidden;
  border-radius: 1.25rem;
  border: 1px solid rgba(29, 185, 84, 0.22);
  background:
    radial-gradient(
      ellipse 80% 60% at 0% 0%,
      rgba(29, 185, 84, 0.14),
      transparent 55%
    ),
    radial-gradient(
      ellipse 60% 50% at 100% 100%,
      rgba(29, 185, 84, 0.08),
      transparent 50%
    ),
    var(--focus-surface-solid);
  box-shadow:
    var(--focus-shadow),
    0 0 0 1px rgba(29, 185, 84, 0.06) inset;

  [data-theme='dark'] & {
    border-color: rgba(30, 215, 96, 0.18);
    background:
      radial-gradient(
        ellipse 80% 60% at 0% 0%,
        rgba(30, 215, 96, 0.1),
        transparent 55%
      ),
      radial-gradient(
        ellipse 60% 50% at 100% 100%,
        rgba(30, 215, 96, 0.06),
        transparent 50%
      ),
      var(--focus-surface-solid);
  }
`;

export const SpotifyHero = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.5rem 1.5rem 0;
  flex-wrap: wrap;
`;

export const SpotifyBrand = styled.div`
  display: flex;
  align-items: center;
  gap: 0.875rem;
  min-width: 0;
`;

export const SpotifyNow = styled.span`
  flex-shrink: 0;
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #1db954;
  padding: 0.35rem 0.65rem;
  border-radius: 999px;
  border: 1px solid rgba(29, 185, 84, 0.35);
  background: rgba(29, 185, 84, 0.1);
`;

export const SpotifyBody = styled.div`
  padding: 1.25rem 1.5rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.125rem;
  background: linear-gradient(
    180deg,
    transparent 0%,
    rgba(0, 0, 0, 0.28) 55%,
    rgba(0, 0, 0, 0.38) 100%
  );
  border-radius: 0 0 1.2rem 1.2rem;
`;

export const SpotifyPresets = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

export const SpotifyPreset = styled.button<{ $active?: boolean }>`
  border: 1px solid
    ${(p) => (p.$active ? 'transparent' : 'var(--focus-border)')};
  background: ${(p) =>
    p.$active
      ? 'linear-gradient(135deg, #1ed760, #169c46)'
      : 'var(--focus-paper)'};
  color: ${(p) => (p.$active ? '#0a0a0a' : 'var(--focus-text)')};
  border-radius: 999px;
  padding: 0.45rem 0.9rem;
  font-family: var(--focus-body);
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: pointer;
  transition:
    transform 0.12s ease,
    box-shadow 0.2s ease,
    border-color 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    border-color: rgba(29, 185, 84, 0.45);
    box-shadow: ${(p) =>
      p.$active ? '0 6px 18px rgba(29, 185, 84, 0.35)' : 'none'};
  }
`;

export const SpotifyLoad = styled.form`
  display: flex;
  gap: 0.5rem;
  padding: 0.3rem;
  border-radius: 0.875rem;
  border: 1px solid var(--focus-border);
  background: var(--focus-paper);
`;

export const SpotifyField = styled.input`
  flex: 1;
  min-width: 0;
  border: none;
  background: transparent;
  color: var(--focus-text);
  font-family: var(--focus-body);
  font-size: 0.875rem;
  padding: 0.65rem 0.75rem;
  outline: none;

  &::placeholder {
    color: var(--focus-muted);
  }
`;

export const SpotifyLoadBtn = styled.button`
  flex-shrink: 0;
  border: none;
  border-radius: 0.625rem;
  padding: 0.65rem 1rem;
  font-family: var(--focus-body);
  font-size: 0.8125rem;
  font-weight: 700;
  cursor: pointer;
  color: #0a0a0a;
  background: linear-gradient(135deg, #1ed760, #169c46);
  box-shadow: 0 4px 14px rgba(29, 185, 84, 0.3);
  transition:
    transform 0.12s ease,
    box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 8px 20px rgba(29, 185, 84, 0.38);
  }
  &:active {
    transform: scale(0.97);
  }
`;

export const SpotifyPlayer = styled.div<{
  $size: 'compact' | 'album' | 'playlist';
}>`
  position: relative;
  width: 100%;
  margin: 0 auto;
  overflow: hidden;
  border-radius: 1rem;
  border: 1px solid rgba(29, 185, 84, 0.2);
  background: #121212;
  box-shadow:
    0 20px 48px -24px rgba(0, 0, 0, 0.55),
    0 0 0 1px rgba(255, 255, 255, 0.04) inset,
    0 0 40px -12px rgba(29, 185, 84, 0.25);

  height: ${(p) =>
    p.$size === 'compact'
      ? '9.75rem'
      : p.$size === 'album'
        ? '18rem'
        : '23.75rem'};

  iframe {
    display: block;
    width: 100%;
    height: 100%;
    border: 0;
    background: #121212;
    color-scheme: dark;
  }
`;

export const SpotifyPlayerShade = styled.div<{ $show?: boolean }>`
  position: absolute;
  inset: 0;
  z-index: 1;
  background: #121212;
  opacity: ${(p) => (p.$show ? 1 : 0)};
  pointer-events: ${(p) => (p.$show ? 'auto' : 'none')};
  transition: opacity 0.2s ease;
`;

export const SpotifyFoot = styled.p`
  margin: 0;
  text-align: center;
  font-size: 0.75rem;
  line-height: 1.5;
  color: var(--focus-muted);
`;
