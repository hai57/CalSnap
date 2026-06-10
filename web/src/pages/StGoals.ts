import { colors } from '../styles/theme';
import styled from 'styled-components';
import { Input } from '../styles/ui';

export const RowWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
`;

export const RowLabel = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${colors.slate700};
`;

export const RowInput = styled(Input)`
  max-width: 9rem;
`;
