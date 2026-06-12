import { colors } from '../../styles/theme';
import styled from 'styled-components';

export const MacroName = styled.span<{ $color: string }>`
  font-weight: 700;
  color: ${(p) => p.$color};
`;

export const MacroRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
`;

export const MacroStats = styled.span`
  display: inline-flex;
  align-items: baseline;
  gap: 0.5rem;
  font-variant-numeric: tabular-nums;
`;

export const MacroGrams = styled.span`
  font-weight: 600;
  color: ${colors.slate700};
`;

export const MacroPct = styled.span`
  color: ${colors.slate400};
`;

export const MacroHead = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  font-size: 0.875rem;
`;

export const Range = styled.input<{ $color: string; $fill: number }>`
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 0.5rem;
  border-radius: 999px;
  cursor: pointer;
  background: ${(p) =>
    `linear-gradient(to right, ${p.$color} 0%, ${p.$color} ${p.$fill}%, ${colors.slate200} ${p.$fill}%, ${colors.slate200} 100%)`};

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 1.1rem;
    height: 1.1rem;
    border-radius: 50%;
    background: ${(p) => p.$color};
    border: 2px solid ${colors.white};
    box-shadow: 0 1px 3px rgba(15, 23, 42, 0.25);
    cursor: pointer;
  }

  &::-moz-range-track {
    height: 0.5rem;
    border-radius: 999px;
    background: ${colors.slate200};
  }

  &::-moz-range-progress {
    height: 0.5rem;
    border-radius: 999px;
    background: ${(p) => p.$color};
  }

  &::-moz-range-thumb {
    width: 1.1rem;
    height: 1.1rem;
    border: 2px solid ${colors.white};
    border-radius: 50%;
    background: ${(p) => p.$color};
    box-shadow: 0 1px 3px rgba(15, 23, 42, 0.25);
    cursor: pointer;
  }
`;
