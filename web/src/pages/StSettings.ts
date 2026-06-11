import styled, { css } from 'styled-components';

import { colors } from '../styles/theme';
import { PrimaryButton } from '../styles/ui';

export {
  NarrowColumn as Page,
  PageTitle as Title,
  SectionTitle,
  StackCard as SectionCard,
  Input,
  FieldLabel,
  MutedText as Muted,
  PrimaryButton,
} from '../styles/ui';

export const HeaderSaveButton = styled(PrimaryButton)`
  font-size: 0.875rem;
  padding: 0.5rem 0.875rem;
`;

export const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
`;

export const InlineInput = styled.input`
  width: 7rem;
  border-radius: 0.75rem;
  border: 1px solid rgba(15, 23, 42, 0.12);
  background: ${colors.white};
  padding: 0.5rem 0.75rem;
  outline: none;
  font: inherit;
  color: inherit;
  text-align: right;

  &:focus {
    border-color: ${colors.brand500};
    box-shadow: 0 0 0 3px ${colors.brand100};
  }
`;

// ----- Segmented control (weight unit, diet, water) -----
export const Segments = styled.div`
  display: inline-flex;
  border-radius: 0.625rem;
  border: 1px solid ${colors.slate200};
  overflow: hidden;
`;

export const Segment = styled.button<{ $active: boolean }>`
  border: none;
  background: ${(p) => (p.$active ? colors.brand500 : colors.white)};
  color: ${(p) => (p.$active ? colors.white : colors.slate600)};
  font-family: inherit;
  font-size: 0.875rem;
  font-weight: 600;
  padding: 0.45rem 0.85rem;
  cursor: pointer;
  transition:
    background 0.15s ease,
    color 0.15s ease;

  & + & {
    border-left: 1px solid ${colors.slate200};
  }

  &:hover {
    background: ${(p) => (p.$active ? colors.brand500 : colors.slate50)};
  }
`;

// ----- Nutrition macro rows + sliders -----
export const NutritionLayout = styled.div`
  display: grid;
  gap: 1.5rem;

  @media (min-width: 640px) {
    grid-template-columns: 1.4fr 1fr;
    align-items: center;
  }
`;

export const MacroList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
`;

export const PieWrap = styled.div`
  position: relative;
  height: 200px;
  width: 100%;
`;

export const PieCenter = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  pointer-events: none;
`;

export const PieTotal = styled.span`
  font-size: 1.5rem;
  font-weight: 800;
  font-variant-numeric: tabular-nums;
  color: ${colors.slate900};
`;

export const PieLabel = styled.span`
  font-size: 0.75rem;
  color: ${colors.slate500};
`;

// ----- Diet mode options -----
export const DietGrid = styled.div`
  display: grid;
  gap: 0.75rem;

  @media (min-width: 640px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
`;

export const DietOption = styled.button<{ $active: boolean }>`
  text-align: left;
  border-radius: 0.875rem;
  border: 1px solid ${(p) => (p.$active ? colors.brand500 : colors.slate200)};
  background: ${(p) => (p.$active ? colors.brand50 : colors.white)};
  padding: 0.85rem;
  cursor: pointer;
  font-family: inherit;
  transition:
    border-color 0.15s ease,
    background 0.15s ease;

  ${(p) =>
    p.$active &&
    css`
      box-shadow: 0 0 0 3px ${colors.brand100};
    `}

  &:hover {
    border-color: ${colors.brand400};
  }
`;

export const DietName = styled.div<{ $active: boolean }>`
  font-weight: 700;
  font-size: 0.95rem;
  color: ${(p) => (p.$active ? colors.brand700 : colors.slate700)};
`;

export const DietDesc = styled.div`
  margin-top: 0.25rem;
  font-size: 0.78rem;
  line-height: 1.35;
  color: ${colors.slate500};
`;

// ----- Water -----
export const WaterBig = styled.div`
  text-align: center;
  margin-bottom: 1rem;
`;

export const WaterMl = styled.div`
  font-size: 2.5rem;
  font-weight: 800;
  color: ${colors.brand600};
  font-variant-numeric: tabular-nums;
  line-height: 1;
`;

export const WaterUnit = styled.div`
  font-size: 0.8rem;
  color: ${colors.slate500};
  margin-top: 0.25rem;
`;

export const WaterOptions = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.5rem;
`;

export const WaterOption = styled.button<{ $active: boolean }>`
  border-radius: 0.75rem;
  border: 1px solid ${(p) => (p.$active ? colors.brand500 : colors.slate200)};
  background: ${(p) => (p.$active ? colors.brand50 : colors.white)};
  color: ${(p) => (p.$active ? colors.brand700 : colors.slate600)};
  font-family: inherit;
  font-weight: 700;
  padding: 0.6rem 0;
  cursor: pointer;
  transition:
    border-color 0.15s ease,
    background 0.15s ease;

  &:hover {
    border-color: ${colors.brand400};
  }
`;
