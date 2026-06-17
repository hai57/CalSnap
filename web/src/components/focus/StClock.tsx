import styled from 'styled-components';

export const ClockCard = styled.div`
  position: relative;
  padding: 1.125rem 1.375rem;
  border-radius: 1.125rem;
  border: 1px solid var(--focus-border);
  background: var(--focus-surface-solid);
  box-shadow: var(--focus-shadow);
  text-align: right;
  min-width: 11rem;

  &::before {
    content: '';
    position: absolute;
    top: -1px;
    right: 1.25rem;
    width: 3rem;
    height: 2px;
    border-radius: 999px;
    background: linear-gradient(
      90deg,
      transparent,
      var(--focus-amber),
      transparent
    );
  }
`;

export const Greeting = styled.div`
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--focus-amber);
  margin-bottom: 0.25rem;
`;
export const ClockTime = styled.div`
  font-family: var(--focus-mono);
  font-size: 2.25rem;
  font-weight: 500;
  line-height: 1;
  letter-spacing: -0.04em;
  font-variant-numeric: tabular-nums;
  color: var(--focus-text);
`;
export const ClockDate = styled.div`
  margin-top: 0.375rem;
  font-size: 0.8125rem;
  color: var(--focus-muted);
`;
