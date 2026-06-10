import styled from 'styled-components';

import { colors } from '../styles/theme';

export const Wrap = styled.div`
  position: relative;
  display: grid;
  place-items: center;
`;

export const Svg = styled.svg`
  transform: rotate(-90deg);
`;

export const Center = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const Consumed = styled.span`
  font-size: 1.875rem;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
`;

export const Goal = styled.span`
  font-size: 0.75rem;
  color: ${colors.slate500};
`;

export const Remaining = styled.span<{ $over: boolean }>`
  margin-top: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
  color: ${(p) => (p.$over ? colors.red500 : colors.brand600)};
`;
