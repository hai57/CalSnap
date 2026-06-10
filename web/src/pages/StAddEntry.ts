import styled from 'styled-components';
import { colors } from '../styles/theme';
import { PrimaryButton, SecondaryButton } from '../styles/ui';

export {
  NarrowColumn as Page,
  PageTitle as Title,
  StackCard as FormCard,
} from '../styles/ui';

export const Tabs = styled.div`
  display: flex;
  gap: 0.5rem;
`;

export const Tab = styled.button<{ $active: boolean }>`
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border-radius: 0.75rem;
  border: 1px solid ${(p) => (p.$active ? colors.brand500 : colors.slate200)};
  background: ${(p) => (p.$active ? colors.brand50 : colors.white)};
  color: ${(p) => (p.$active ? colors.brand700 : colors.slate600)};
  padding: 0.75rem 1rem;
  font-weight: 500;
  font-family: inherit;
  font-size: 1rem;
  cursor: pointer;
  transition:
    background 0.15s ease,
    border-color 0.15s ease,
    color 0.15s ease;

  &:hover {
    background: ${(p) => (p.$active ? colors.brand50 : colors.slate50)};
  }
`;

export const Dropzone = styled.label`
  display: block;
  cursor: pointer;
  border-radius: 0.75rem;
  border: 2px dashed ${colors.slate300};
  padding: 1.5rem;
  text-align: center;
  transition: border-color 0.15s ease;

  &:hover {
    border-color: ${colors.brand400};
  }
`;

export const Preview = styled.img`
  margin: 0 auto;
  max-height: 16rem;
  border-radius: 0.5rem;
  object-fit: contain;
`;

export const DropHint = styled.div`
  color: ${colors.slate500};
`;

export const DropIcon = styled.div`
  display: flex;
  justify-content: center;
  color: ${colors.brand500};
`;

export const DropTitle = styled.p`
  margin: 0.5rem 0 0;
  font-weight: 500;
`;

export const DropSub = styled.p`
  margin: 0;
  font-size: 0.75rem;
  color: ${colors.slate400};
`;

export const Badge = styled.span`
  border-radius: 9999px;
  background: ${colors.brand100};
  padding: 0.125rem 0.625rem;
  font-size: 0.75rem;
  font-weight: 500;
  color: ${colors.brand700};
`;

export const BadgeRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const Confidence = styled.span`
  font-size: 0.75rem;
  color: ${colors.slate500};
`;

export const ResultImage = styled.img`
  max-height: 14rem;
  width: 100%;
  border-radius: 0.75rem;
  object-fit: cover;
`;

export const Hint = styled.p`
  margin: 0;
  font-size: 0.875rem;
  color: ${colors.slate500};
`;

export const FieldGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem;
`;

export const Actions = styled.div`
  display: flex;
  gap: 0.75rem;
`;

export const BackButton = styled(SecondaryButton)`
  flex: 1;
`;

export const SaveButton = styled(PrimaryButton)`
  flex: 1;
`;
