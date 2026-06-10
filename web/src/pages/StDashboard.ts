import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { colors } from '../styles/theme';
import { Card, PrimaryButton } from '../styles/ui';

export {
  PageColumn as Page,
  PageTitle as Title,
  SectionTitle,
  Subtitle,
  MutedText as Muted,
} from '../styles/ui';

export const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const AddLink = styled(PrimaryButton).attrs({ as: Link })`
  text-decoration: none;
  padding: 0.625rem 1rem;
`;

export const Grid = styled.div`
  display: grid;
  gap: 1.5rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

export const RingCard = styled(Card)`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const MacroCard = styled(Card)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
`;

export const EntryList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;

  & > li + li {
    border-top: 1px solid ${colors.slate100};
  }
`;

export const EmptyState = styled.div`
  padding: 2.5rem 0;
  text-align: center;
`;

export const EmptyText = styled.p`
  margin: 0;
  color: ${colors.slate500};
`;

export const EmptyLink = styled(Link)`
  margin-top: 0.5rem;
  display: inline-block;
  font-weight: 600;
  color: ${colors.brand600};
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

export const Row = styled.li`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 0;
`;

export const Thumb = styled.img`
  height: 3rem;
  width: 3rem;
  border-radius: 0.5rem;
  object-fit: cover;
`;

export const ThumbFallback = styled.div`
  display: grid;
  height: 3rem;
  width: 3rem;
  place-items: center;
  border-radius: 0.5rem;
  background: ${colors.brand50};
  font-size: 1.125rem;
`;

export const RowMain = styled.div`
  min-width: 0;
  flex: 1;
`;

export const RowName = styled.p`
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-weight: 500;
`;

export const RowMeta = styled.p`
  margin: 0;
  font-size: 0.75rem;
  color: ${colors.slate500};
`;

export const RowRight = styled.div`
  text-align: right;
`;

export const RowCalories = styled.p`
  margin: 0;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
`;

export const RowUnit = styled.p`
  margin: 0;
  font-size: 0.75rem;
  color: ${colors.slate400};
`;

export const DeleteButton = styled.button`
  margin-left: 0.5rem;
  border: none;
  background: transparent;
  border-radius: 0.5rem;
  padding: 0.25rem 0.5rem;
  color: ${colors.slate400};
  cursor: pointer;
  transition:
    background 0.15s ease,
    color 0.15s ease;

  &:hover {
    background: ${colors.red50};
    color: ${colors.red500};
  }
`;
