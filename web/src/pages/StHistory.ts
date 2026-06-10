import styled from 'styled-components';

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

export const ChartWrap = styled.div`
  height: 18rem;
  width: 100%;
`;
