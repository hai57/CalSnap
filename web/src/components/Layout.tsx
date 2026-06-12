import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { useAuth } from '../auth/AuthContext';
import { useLang } from '../i18n';
import { colors } from '../styles/theme';
import { PrimaryButton } from '../styles/ui';
import { LayoutActionProvider, useLayoutActionSlot } from './LayoutAction';
import { NutriBot } from './NutriBot';
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
  { to: '/history', label: 'Progress' },
  { to: '/profile', label: 'Profile' },
];

const Shell = styled.div`
  margin: 0 auto;
  display: flex;
  min-height: 100vh;
  max-width: 64rem;
  flex-direction: column;
  padding: 0 1rem;
`;

// 1px sentinel at the very top; when it scrolls out of view the header is "scrolled".
const Sentinel = styled.div`
  height: 1px;
`;

const Header = styled.header<{ $scrolled: boolean }>`
  position: sticky;
  top: 0;
  z-index: 30;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.1rem 1rem;
  margin: 0 -1rem;
  border-bottom: 1px solid
    ${(p) => (p.$scrolled ? colors.surfaceBorder : 'transparent')};
  backdrop-filter: ${(p) =>
    p.$scrolled ? 'blur(10px) saturate(160%)' : 'none'};
  -webkit-backdrop-filter: ${(p) =>
    p.$scrolled ? 'blur(10px) saturate(160%)' : 'none'};
  box-shadow: ${(p) =>
    p.$scrolled ? '0 6px 20px -16px rgba(15, 23, 42, 0.65)' : 'none'};
  transition:
    background 0.25s ease,
    backdrop-filter 0.25s ease,
    border-color 0.25s ease,
    box-shadow 0.25s ease;
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
  color: ${colors.onAccent};
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

const AddButton = styled(PrimaryButton).attrs({ as: Link })`
  text-decoration: none;
  font-size: 0.875rem;
  padding: 0.5rem 0.875rem;
`;

export function Layout({ children }: { children: ReactNode }) {
  return (
    <LayoutActionProvider>
      <LayoutShell>{children}</LayoutShell>
    </LayoutActionProvider>
  );
}

function LayoutShell({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { action } = useLayoutActionSlot();
  const { t } = useLang();

  const sentinelRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setScrolled(!entry.isIntersecting),
      { threshold: 0 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Shell>
      <Sentinel ref={sentinelRef} />
      <Header $scrolled={scrolled}>
        <Brand>
          <BrandMark>N</BrandMark>
          <BrandName>NutriLens</BrandName>
        </Brand>
        <DesktopNav>
          {navItems.map((item) => (
            <NavItem key={item.to} to={item.to} end={item.end}>
              {t(item.label)}
            </NavItem>
          ))}
        </DesktopNav>
        <HeaderRight>
          {action}
          <AddButton to="/add">{t('+ Add food')}</AddButton>
          <UserEmail>{user?.email}</UserEmail>
          <LogoutButton
            onClick={() => {
              logout();
              navigate('/login');
            }}
          >
            {t('Log out')}
          </LogoutButton>
        </HeaderRight>
      </Header>

      <Main>{children}</Main>

      <MobileNav>
        {navItems.map((item) => (
          <MobileNavItem key={item.to} to={item.to} end={item.end}>
            {t(item.label)}
          </MobileNavItem>
        ))}
      </MobileNav>

      <NutriBot />
    </Shell>
  );
}
