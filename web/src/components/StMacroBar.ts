import styled from 'styled-components';

import { colors } from '../styles/theme';

export const Head = styled.div`
  margin-bottom: 0.25rem;
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  font-size: 0.875rem;
`;

export const Label = styled.span`
  font-weight: 500;
  color: ${colors.slate700};
`;

export const Value = styled.span`
  font-variant-numeric: tabular-nums;
  color: ${colors.slate500};
`;

export const Track = styled.div`
  height: 0.625rem;
  width: 100%;
  overflow: hidden;
  border-radius: 9999px;
  background: ${colors.track};
`;

export const Fill = styled.div`
  height: 100%;
  border-radius: 9999px;
  transition: width 0.5s ease;
`;
