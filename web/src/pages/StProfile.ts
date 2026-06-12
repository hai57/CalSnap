import styled, { css, keyframes } from 'styled-components';

import { colors } from '../styles/theme';
import { PrimaryButton, StackCard } from '../styles/ui';

// Shared widths so every Basics row lines up into one column.
const FIELD_WIDTH = '7rem';
const ADDON_WIDTH = '6rem';

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

const fadeUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const shimmer = keyframes`
  from {
    background-position: -160% 0;
  }
  to {
    background-position: 160% 0;
  }
`;

const enter = css<{ $delay?: number }>`
  @media (prefers-reduced-motion: no-preference) {
    animation: ${fadeUp} 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
    animation-delay: ${(p) => p.$delay ?? 0}ms;
  }
`;

export const AnimatedCard = styled(StackCard)<{ $delay?: number }>`
  ${enter}
`;

export const HeaderSaveButton = styled(PrimaryButton)`
  font-size: 0.875rem;
  padding: 0.5rem 0.875rem;
`;

export const SectionHint = styled.p`
  margin: -0.25rem 0 0.25rem;
  font-size: 0.8125rem;
  line-height: 1.4;
  color: ${colors.slate500};
`;

export const ErrorState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 2rem 0;
  text-align: center;

  & > p {
    margin: 0;
    color: ${colors.slate600};
  }
`;

export const RetryButton = styled.button`
  border: none;
  background: transparent;
  padding: 0;
  font: inherit;
  font-weight: 600;
  color: ${colors.brand600};
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

// ----- Divided profile rows (label left, control right) -----
export const ProfileList = styled.div`
  display: flex;
  flex-direction: column;

  & > div + div {
    border-top: 1px solid ${colors.slate100};
  }
`;

export const ProfileRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.875rem 0;

  &:first-child {
    padding-top: 0;
  }
  &:last-child {
    padding-bottom: 0;
  }

  @media (max-width: 520px) {
    align-items: flex-start;
    flex-direction: column;
  }
`;

export const RowMain = styled.div`
  display: flex;
  align-items: center;
  gap: 0.875rem;
  min-width: 0;
`;

export const IconChip = styled.div`
  display: grid;
  place-items: center;
  height: 2.5rem;
  width: 2.5rem;
  flex-shrink: 0;
  border-radius: 0.75rem;
  background: ${colors.brand50};
  color: ${colors.brand600};
`;

export const RowLabel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  min-width: 0;
`;

export const RowName = styled.span`
  font-weight: 600;
  font-size: 0.9375rem;
`;

export const RowHint = styled.span`
  font-size: 0.75rem;
  color: ${colors.slate400};
`;

export const RowControl = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;
  flex-shrink: 0;

  @media (max-width: 520px) {
    width: 100%;
    justify-content: space-between;
  }
`;

// Keep `Row` as a backwards-compatible alias for a simple label/control row.
export const Row = ProfileRow;

export const InlineInput = styled.input`
  width: 6.5rem;
  border-radius: 0.75rem;
  border: 1px solid rgba(15, 23, 42, 0.12);
  background: ${colors.white};
  padding: 0.5rem 0.75rem;
  outline: none;
  font: inherit;
  font-variant-numeric: tabular-nums;
  color: inherit;
  text-align: right;
  transition:
    border-color 0.15s ease,
    box-shadow 0.15s ease;

  &:focus {
    border-color: ${colors.brand500};
    box-shadow: 0 0 0 3px ${colors.brand100};
  }

  @media (max-width: 520px) {
    flex: 1;
    min-width: 0;
  }
`;

export const Unit = styled.span`
  font-size: 0.8125rem;
  color: ${colors.slate400};
  min-width: 3.75rem;
`;

// ----- Fixed-width value field, so all Basics rows align into a column -----
export const Field = styled.label`
  display: inline-flex;
  align-items: center;
  justify-content: flex-end;
  width: ${FIELD_WIDTH};
  border-radius: 0.75rem;
  border: 1px solid rgba(15, 23, 42, 0.12);
  background: ${colors.white};
  padding: 0.5rem 0.75rem;
  cursor: text;
  transition:
    border-color 0.15s ease,
    box-shadow 0.15s ease;

  &:focus-within {
    border-color: ${colors.brand500};
    box-shadow: 0 0 0 3px ${colors.brand100};
  }

  @media (max-width: 520px) {
    flex: 1;
    width: auto;
  }
`;

export const FieldInput = styled.input`
  width: 100%;
  border: none;
  outline: none;
  background: transparent;
  font: inherit;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  color: inherit;
  text-align: right;
`;

// Unit label sits in its own fixed-width column to align with the kg/lb toggle.
export const FieldSuffix = styled.span`
  display: inline-flex;
  align-items: center;
  width: ${ADDON_WIDTH};
  font-size: 0.8125rem;
  color: ${colors.slate400};
  white-space: nowrap;
  justify-content: flex-end;
`;

// ----- Segmented control (weight unit) -----
export const Segments = styled.div`
  display: inline-flex;
  width: ${ADDON_WIDTH};
  border-radius: 0.625rem;
  border: 1px solid ${colors.slate200};
  overflow: hidden;
`;

export const Segment = styled.button<{ $active: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  border: none;
  background: ${(p) => (p.$active ? colors.brand500 : colors.white)};
  color: ${(p) => (p.$active ? colors.white : colors.slate600)};
  font-family: inherit;
  font-size: 0.875rem;
  font-weight: 600;
  padding: 0.45rem 0;
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
    background 0.15s ease,
    transform 0.08s ease;

  ${(p) =>
    p.$active &&
    css`
      box-shadow: 0 0 0 3px ${colors.brand100};
    `}

  &:hover {
    border-color: ${colors.brand400};
  }

  &:active {
    transform: scale(0.99);
  }
`;

export const DietHead = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;
`;

export const DietIcon = styled.div<{ $active: boolean }>`
  display: grid;
  place-items: center;
  height: 2rem;
  width: 2rem;
  flex-shrink: 0;
  border-radius: 0.625rem;
  background: ${(p) => (p.$active ? colors.brand100 : colors.slate100)};
  color: ${(p) => (p.$active ? colors.brand700 : colors.slate500)};
  transition:
    background 0.15s ease,
    color 0.15s ease;
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

export const WaterIcon = styled.div`
  display: grid;
  place-items: center;
  height: 2.75rem;
  width: 2.75rem;
  margin: 0 auto 0.625rem;
  border-radius: 0.875rem;
  background: ${colors.blue50};
  color: ${colors.blue600};
`;

export const WaterMl = styled.div`
  font-size: 2.5rem;
  font-weight: 800;
  color: ${colors.blue600};
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
  border: 1px solid ${(p) => (p.$active ? colors.blue500 : colors.slate200)};
  background: ${(p) => (p.$active ? colors.blue50 : colors.white)};
  color: ${(p) => (p.$active ? colors.blue700 : colors.slate600)};
  font-family: inherit;
  font-weight: 700;
  padding: 0.6rem 0;
  cursor: pointer;
  transition:
    border-color 0.15s ease,
    background 0.15s ease,
    transform 0.08s ease;

  ${(p) =>
    p.$active &&
    css`
      box-shadow: 0 0 0 3px ${colors.blue100};
    `}

  &:hover {
    border-color: ${colors.blue400};
  }

  &:active {
    transform: scale(0.97);
  }
`;

// ----- Loading skeletons -----
const skeletonBase = css`
  border-radius: 0.5rem;
  background: linear-gradient(
    90deg,
    ${colors.slate100} 25%,
    ${colors.slate200} 37%,
    ${colors.slate100} 63%
  );
  background-size: 320% 100%;

  @media (prefers-reduced-motion: no-preference) {
    animation: ${shimmer} 1.4s ease-in-out infinite;
  }
`;

export const SkeletonLine = styled.div<{ $w?: string; $h?: string }>`
  ${skeletonBase}
  width: ${(p) => p.$w ?? '100%'};
  height: ${(p) => p.$h ?? '0.875rem'};
`;

export const SkeletonRowBlock = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.875rem 0;

  &:first-child {
    padding-top: 0;
  }
`;
