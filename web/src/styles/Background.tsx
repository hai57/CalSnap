import styled, { keyframes } from 'styled-components';

// Organic "water droplet" wobble: the border-radius morphs continuously while
// the blob also drifts back and forth, so it reads like a floating liquid drop.
const morphA = keyframes`
  0%   { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
  34%  { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
  67%  { border-radius: 50% 50% 40% 60% / 40% 50% 60% 50%; }
  100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
`;

const morphB = keyframes`
  0%   { border-radius: 40% 60% 60% 40% / 60% 40% 60% 40%; }
  34%  { border-radius: 70% 30% 50% 50% / 30% 60% 40% 70%; }
  67%  { border-radius: 40% 60% 30% 70% / 60% 40% 70% 30%; }
  100% { border-radius: 40% 60% 60% 40% / 60% 40% 60% 40%; }
`;

const driftA = keyframes`
  from { transform: translate(0, 0) rotate(0deg); }
  to   { transform: translate(16vw, 14vh) rotate(40deg); }
`;

const driftB = keyframes`
  from { transform: translate(0, 0) rotate(0deg); }
  to   { transform: translate(-15vw, -10vh) rotate(-35deg); }
`;

const driftC = keyframes`
  from { transform: translate(0, 0) rotate(0deg); }
  to   { transform: translate(13vw, -15vh) rotate(30deg); }
`;

const driftD = keyframes`
  from { transform: translate(0, 0) rotate(0deg); }
  to   { transform: translate(-12vw, 13vh) rotate(-25deg); }
`;

const Layer = styled.div`
  position: fixed;
  inset: 0;
  z-index: -1;
  overflow: hidden;
  pointer-events: none;
`;

// Wrapper handles the back-and-forth drift (alternate), inner handles the
// shape morph. Splitting them keeps both animations smooth.
const Drop = styled.div`
  position: absolute;
  will-change: transform;
  animation-iteration-count: infinite;
  animation-direction: alternate;
  animation-timing-function: ease-in-out;
`;

const Liquid = styled.div`
  width: 100%;
  height: 100%;
  filter: blur(5px);
  opacity: 0.55;
  will-change: border-radius;
  animation-iteration-count: infinite;
  animation-timing-function: ease-in-out;
`;

const DropViolet = styled(Drop)`
  width: 38vw;
  height: 38vw;
  top: -6vh;
  left: -6vw;
  animation-name: ${driftA};
  animation-duration: 16s;
`;
const DropSky = styled(Drop)`
  width: 34vw;
  height: 34vw;
  top: 28vh;
  right: -8vw;
  animation-name: ${driftB};
  animation-duration: 20s;
`;
const DropPink = styled(Drop)`
  width: 30vw;
  height: 30vw;
  bottom: -10vh;
  left: 14vw;
  animation-name: ${driftC};
  animation-duration: 18s;
`;
const DropAmber = styled(Drop)`
  width: 24vw;
  height: 24vw;
  top: 6vh;
  left: 42vw;
  animation-name: ${driftD};
  animation-duration: 24s;
`;

const LiquidViolet = styled(Liquid)`
  background: #c4b5fd;
  animation-name: ${morphA};
  animation-duration: 12s;
`;
const LiquidSky = styled(Liquid)`
  background: #93c5fd;
  animation-name: ${morphB};
  animation-duration: 15s;
`;
const LiquidPink = styled(Liquid)`
  background: #fbcfe8;
  animation-name: ${morphA};
  animation-duration: 14s;
`;
const LiquidAmber = styled(Liquid)`
  background: #fcd34d;
  opacity: 0.38;
  animation-name: ${morphB};
  animation-duration: 17s;
`;

export function Background() {
  return (
    <Layer aria-hidden="true">
      <DropViolet>
        <LiquidViolet />
      </DropViolet>
      <DropSky>
        <LiquidSky />
      </DropSky>
      <DropPink>
        <LiquidPink />
      </DropPink>
      <DropAmber>
        <LiquidAmber />
      </DropAmber>
    </Layer>
  );
}
