import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { colors } from '../styles/theme';
import { Card, SecondaryButton } from '../styles/ui';

export const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
`;

export const EditGoalsButton = styled(SecondaryButton).attrs({ as: Link })`
  text-decoration: none;
`;

export const StatGrid = styled.div`
  display: grid;
  gap: 1rem;

  @media (min-width: 640px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
`;

export const StatValue = styled.p`
  margin: 0.25rem 0 0;
  font-size: 1.5rem;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
`;

export const GoalStatCard = styled(Card).attrs({ as: Link })`
  display: block;
  text-decoration: none;
  color: inherit;
  cursor: pointer;
  transition:
    box-shadow 0.15s ease,
    transform 0.08s ease;

  &:hover {
    box-shadow: 0 14px 34px -12px rgba(15, 23, 42, 0.22);
    transform: translateY(-1px);
  }

  &:hover p {
    color: ${colors.brand600};
  }
`;

export const ChartWrap = styled.div`
  height: 18rem;
  width: 100%;
`;
