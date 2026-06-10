import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { useAuth } from '../auth/AuthContext';
import { colors } from '../styles/theme';
import {
  HeaderRight,
  LogoutButton,
  Main,
  MobileNav,
  MobileNavItem,
  NavItem,
  UserEmail,
} from './StLayout';

const navItems = [
  { to: '/', label: 'Dashboard', end: true },
  { to: '/add', label: 'Add Food' },
  { to: '/history', label: 'History' },
  { to: '/goals', label: 'Goals' },
];

const Shell = styled.div`
  margin: 0 auto;
  display: flex;
  min-height: 100vh;
  max-width: 64rem;
  flex-direction: column;
  padding: 0 1rem;
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 0;
`;

const Brand = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const BrandMark = styled.div`
  display: grid;
  height: 2.25rem;
  width: 2.25rem;
  place-items: center;
  border-radius: 0.75rem;
  background: ${colors.brand500};
  font-size: 1.125rem;
  font-weight: 700;
  color: ${colors.white};
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const BrandName = styled.span`
  font-size: 1.25rem;
  font-weight: 700;
  letter-spacing: -0.01em;
`;

const DesktopNav = styled.nav`
  display: none;
  align-items: center;
  gap: 0.25rem;

  @media (min-width: 640px) {
    display: flex;
  }
`;

export function Layout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <Shell>
      <Header>
        <Brand>
          <BrandMark>N</BrandMark>
          <BrandName>NutriLens</BrandName>
        </Brand>
        <DesktopNav>
          {navItems.map((item) => (
            <NavItem key={item.to} to={item.to} end={item.end}>
              {item.label}
            </NavItem>
          ))}
        </DesktopNav>
        <HeaderRight>
          <UserEmail>{user?.email}</UserEmail>
          <LogoutButton
            onClick={() => {
              logout();
              navigate('/login');
            }}
          >
            Log out
          </LogoutButton>
        </HeaderRight>
      </Header>

      <Main>{children}</Main>

      <MobileNav>
        {navItems.map((item) => (
          <MobileNavItem key={item.to} to={item.to} end={item.end}>
            {item.label}
          </MobileNavItem>
        ))}
      </MobileNav>
    </Shell>
  );
}
