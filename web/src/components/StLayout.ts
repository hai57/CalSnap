import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

import { colors } from '../styles/theme';

export { BrandMark } from '../styles/ui';

export const Shell = styled.div`
  margin: 0 auto;
  display: flex;
  min-height: 100vh;
  max-width: 64rem;
  flex-direction: column;
  padding: 0 1rem;
`;

export const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 0;
`;

export const Brand = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const BrandName = styled.span`
  font-size: 1.25rem;
  font-weight: 700;
  letter-spacing: -0.01em;
`;

export const DesktopNav = styled.nav`
  display: none;
  align-items: center;
  gap: 0.25rem;

  @media (min-width: 640px) {
    display: flex;
  }
`;

export const NavItem = styled(NavLink)`
  border-radius: 0.5rem;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  text-decoration: none;
  color: ${colors.slate600};
  transition:
    background 0.15s ease,
    color 0.15s ease;

  &:hover {
    background: ${colors.slate100};
  }

  &.active {
    background: ${colors.brand100};
    color: ${colors.brand700};
  }
`;

export const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

export const UserEmail = styled.span`
  display: none;
  font-size: 0.875rem;
  color: ${colors.slate500};

  @media (min-width: 768px) {
    display: inline;
  }
`;

export const LogoutButton = styled.button`
  border-radius: 0.5rem;
  border: 1px solid ${colors.slate200};
  background: transparent;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  font-family: inherit;
  color: ${colors.slate600};
  cursor: pointer;
  transition: background 0.15s ease;

  &:hover {
    background: ${colors.slate100};
  }
`;

export const Main = styled.main`
  flex: 1;
  padding-bottom: 6rem;

  @media (min-width: 640px) {
    padding-bottom: 2rem;
  }
`;

export const MobileNav = styled.nav`
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10;
  display: flex;
  justify-content: space-around;
  border-top: 1px solid ${colors.slate200};
  background: ${colors.surface};
  padding: 0.5rem 0;
  backdrop-filter: blur(8px);

  @media (min-width: 640px) {
    display: none;
  }
`;

export const MobileNavItem = styled(NavLink)`
  border-radius: 0.5rem;
  padding: 0.375rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 500;
  text-decoration: none;
  color: ${colors.slate500};

  &.active {
    color: ${colors.brand600};
  }
`;
