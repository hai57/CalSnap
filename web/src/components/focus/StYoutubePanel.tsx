import styled, { keyframes } from 'styled-components';

const livePulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(255, 75, 75, 0.55); }
  70% { box-shadow: 0 0 0 6px rgba(255, 75, 75, 0); }
  100% { box-shadow: 0 0 0 0 rgba(255, 75, 75, 0); }
`;

export const YoutubeStage = styled.section`
  position: relative;
  overflow: hidden;
  border-radius: 1.25rem;
  border: 1px solid rgba(255, 75, 75, 0.22);
  background:
    radial-gradient(
      ellipse 80% 60% at 0% 0%,
      rgba(255, 75, 75, 0.16),
      transparent 55%
    ),
    radial-gradient(
      ellipse 60% 50% at 100% 100%,
      rgba(255, 75, 75, 0.08),
      transparent 50%
    ),
    var(--focus-surface-solid);
  box-shadow:
    var(--focus-shadow),
    0 0 0 1px rgba(255, 75, 75, 0.06) inset;

  [data-theme='dark'] & {
    border-color: rgba(255, 75, 75, 0.2);
    background:
      radial-gradient(
        ellipse 80% 60% at 0% 0%,
        rgba(255, 75, 75, 0.12),
        transparent 55%
      ),
      radial-gradient(
        ellipse 60% 50% at 100% 100%,
        rgba(255, 75, 75, 0.06),
        transparent 50%
      ),
      var(--focus-surface-solid);
  }
`;

export const YoutubeHero = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.5rem 1.5rem 0;
  flex-wrap: wrap;
`;

export const YoutubeBrand = styled.div`
  display: flex;
  align-items: center;
  gap: 0.875rem;
  min-width: 0;
`;

export const YoutubeLogo = styled.div`
  position: relative;
  display: grid;
  place-items: center;
  flex-shrink: 0;
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 0.85rem;
  background: linear-gradient(145deg, #ff5959, #c11919);
  color: #fff;
  font-size: 0.95rem;
  font-weight: 800;
  box-shadow:
    0 10px 28px -10px rgba(255, 75, 75, 0.45),
    inset 0 1px 0 rgba(255, 255, 255, 0.25);

  &::after {
    content: '';
    position: absolute;
    inset: -3px;
    border-radius: 1rem;
    border: 1px solid rgba(255, 75, 75, 0.25);
  }
`;

export const YoutubeTitle = styled.h2`
  margin: 0;
  font-family: var(--focus-display);
  font-size: 1.375rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--focus-text);
`;

export const YoutubeSub = styled.p`
  margin: 0.125rem 0 0;
  font-size: 0.8125rem;
  color: var(--focus-muted);
`;

export const YoutubeLive = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  flex-shrink: 0;
  font-family: var(--focus-mono);
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #ff4b4b;
  padding: 0.4rem 0.7rem 0.4rem 0.55rem;
  border-radius: 999px;
  border: 1px solid rgba(255, 75, 75, 0.4);
  background: rgba(255, 75, 75, 0.1);

  &::before {
    content: '';
    display: inline-block;
    width: 0.45rem;
    height: 0.45rem;
    border-radius: 999px;
    background: #ff4b4b;
    animation: ${livePulse} 1.6s ease-out infinite;
  }
`;

export const YoutubeBody = styled.div`
  padding: 1.25rem 1.5rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.125rem;
  background: linear-gradient(
    180deg,
    transparent 0%,
    rgba(0, 0, 0, 0.18) 55%,
    rgba(0, 0, 0, 0.3) 100%
  );
  border-radius: 0 0 1.2rem 1.2rem;
`;

export const YoutubePlayer = styled.div`
  position: relative;
  width: 100%;
  max-width: 52rem;
  margin: 0 auto;
  overflow: hidden;
  border-radius: 1rem;
  aspect-ratio: 16 / 9;
  border: 1px solid rgba(255, 75, 75, 0.2);
  background: #0b0b0b;
  box-shadow:
    0 24px 60px -28px rgba(0, 0, 0, 0.65),
    0 0 0 1px rgba(255, 255, 255, 0.04) inset,
    0 0 60px -16px rgba(255, 75, 75, 0.3);

  iframe {
    display: block;
    width: 100%;
    height: 100%;
    border: 0;
    background: #0b0b0b;
    color-scheme: dark;
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    pointer-events: none;
    box-shadow: inset 0 0 60px rgba(255, 75, 75, 0.06);
  }
`;

export const YoutubeStationsHead = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.75rem;
  margin-top: 0.5rem;
`;

export const YoutubeStationsTitle = styled.h3`
  margin: 0;
  font-family: var(--focus-display);
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: -0.01em;
  color: var(--focus-text);
`;

export const YoutubeStationsHint = styled.span`
  font-family: var(--focus-mono);
  font-size: 0.6875rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--focus-muted);
`;

export const YoutubeStationGrid = styled.div`
  display: grid;
  gap: 0.625rem;
  grid-template-columns: repeat(auto-fill, minmax(8.5rem, 1fr));
`;

export const YoutubeStation = styled.button<{
  $color: string;
  $active?: boolean;
}>`
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.65rem 0.75rem;
  border-radius: 0.85rem;
  cursor: pointer;
  text-align: left;
  font-family: var(--focus-body);
  border: 1px solid
    ${(p) => (p.$active ? p.$color : 'var(--focus-border)')};
  background: ${(p) =>
    p.$active
      ? `linear-gradient(135deg, ${p.$color}26, transparent 70%), var(--focus-paper)`
      : 'var(--focus-paper)'};
  color: var(--focus-text);
  transition:
    transform 0.14s ease,
    border-color 0.18s ease,
    box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    border-color: ${(p) => p.$color};
    box-shadow: 0 10px 24px -12px ${(p) => p.$color}66;
  }
`;

export const YoutubeStationDisc = styled.span<{ $color: string }>`
  display: grid;
  place-items: center;
  width: 2rem;
  height: 2rem;
  flex-shrink: 0;
  border-radius: 999px;
  font-size: 0.875rem;
  color: ${(p) => p.$color};
  background: radial-gradient(
    circle at 30% 30%,
    ${(p) => `${p.$color}33`},
    ${(p) => `${p.$color}14`} 70%
  );
  border: 1px solid ${(p) => `${p.$color}3a`};
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.06) inset;
`;

export const YoutubeStationLabel = styled.span`
  font-size: 0.8125rem;
  font-weight: 600;
  letter-spacing: -0.005em;
`;

export const YoutubeFoot = styled.p`
  margin: 0;
  text-align: center;
  font-size: 0.75rem;
  line-height: 1.5;
  color: var(--focus-muted);
`;
