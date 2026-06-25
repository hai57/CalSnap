import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { useAuth } from '../auth/AuthContext';
import { useLang } from '../i18n';
import { useNavLayout } from '../layout/NavLayoutContext';
import {
  ChevronLeftIcon,
  DumbbellIcon,
  HeadphonesIcon,
  HomeIcon,
  LogOutIcon,
  PlusIcon,
  UserIcon,
} from './BaseIcons';
import { colors } from '../styles/theme';
import { PrimaryButton } from '../styles/ui';
import { LayoutActionProvider, useLayoutActionSlot } from './LayoutAction';
import { ChibiBot, NutriBot } from './NutriBot';
import {
  HeaderRight,
  Main,
  MobileNav,
  MobileNavItem,
  NavItem,
} from './StLayout';

const navItems = [
  { to: '/', label: 'Dashboard', end: true, Icon: HomeIcon },
  { to: '/focus', label: 'Focus', Icon: HeadphonesIcon },
  { to: '/workout', label: 'Workout', Icon: DumbbellIcon },
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
  justify-content: space-between;
  align-items: center;
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

const HeaderStart = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  min-width: 0;
`;

const HeaderEnd = styled.div`
  display: flex;
  align-items: center;
  justify-self: end;
  justify-content: flex-end;
  min-width: 0;
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
  gap: 1.25rem;

  @media (min-width: 640px) {
    display: flex;
  }
`;

const AddButton = styled(PrimaryButton).attrs({ as: Link })`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  text-decoration: none;
  font-size: 0.875rem;
  padding: 0.5rem 0.875rem;
  width: 120px;
`;

// ---- Sidebar layout ----

const SideWrap = styled.div`
  margin: 0 auto;
  display: flex;
  min-height: 100vh;
  width: 100%;
  max-width: 80rem;
`;

const Aside = styled.aside<{ $collapsed: boolean }>`
  display: none;

  @media (min-width: 640px) {
    position: sticky;
    top: 0;
    align-self: flex-start;
    display: flex;
    height: 100vh;
    width: ${(p) => (p.$collapsed ? '4.25rem' : '13.5rem')};
    flex-shrink: 0;
    flex-direction: column;
    gap: 1.25rem;
    padding: ${(p) => (p.$collapsed ? '1.5rem 0.5rem' : '1.5rem 0.75rem')};
    background: ${colors.surface};
    border-right: 1px solid ${colors.surfaceBorder};
    transition:
      width 0.2s ease,
      padding 0.2s ease;
  }
`;

const AsideHead = styled.div<{ $collapsed: boolean }>`
  display: flex;
  align-items: center;
  justify-content: ${(p) => (p.$collapsed ? 'center' : 'flex-start')};
`;

const AsideBrand = styled(Brand)`
  padding: 0 0.25rem;
  overflow: hidden;
`;

// Floating circular toggle that straddles the sidebar's right edge.
const EdgeToggle = styled.button<{ $collapsed: boolean }>`
  position: absolute;
  top: 50%;
  right: -1rem;
  z-index: 5;
  display: grid;
  height: 2.25rem;
  width: 2.25rem;
  place-items: center;
  border-radius: 999px;
  border: 1px solid ${colors.surfaceBorder};
  background: ${colors.surface};
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  color: ${colors.slate500};
  cursor: pointer;
  box-shadow: 0 4px 12px -4px rgba(15, 23, 42, 0.35);
  opacity: 0.7;
  transform: translateY(-50%);
  transition:
    color 0.15s ease,
    border-color 0.15s ease,
    opacity 0.15s ease,
    transform 0.12s cubic-bezier(0.16, 1, 0.3, 1);

  svg {
    transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    transform: rotate(${(p) => (p.$collapsed ? '180deg' : '0deg')});
  }

  &:hover {
    opacity: 1;
    color: ${colors.brand600};
    border-color: ${colors.brand300};
    transform: translateY(-50%) scale(1.08);
  }

  &:active {
    transform: translateY(-50%) scale(0.92);
  }

  &:focus-visible {
    opacity: 1;
    outline: 2px solid ${colors.brand500};
    outline-offset: 2px;
  }
`;

const AsideNav = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
`;

const AsideNavItem = styled(NavLink)<{ $collapsed: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  border-radius: 0.625rem;
  padding: 0.625rem 0.75rem;
  justify-content: ${(p) => (p.$collapsed ? 'center' : 'flex-start')};
  font-size: 0.9rem;
  font-weight: 500;
  text-decoration: none;
  color: ${colors.slate600};
  white-space: nowrap;
  transition:
    background 0.15s ease,
    color 0.15s ease;

  svg {
    color: ${colors.slate400};
    transition: color 0.15s ease;
    flex-shrink: 0;
  }

  &:hover {
    background: ${colors.slate100};
    color: ${colors.slate900};
  }
  &:hover svg {
    color: ${colors.slate600};
  }

  &.active {
    background: ${colors.brand100};
    color: ${colors.brand700};
    font-weight: 600;
  }
  &.active svg {
    color: ${colors.brand600};
  }
`;

const AsideSpacer = styled.div`
  flex: 1;
`;

const AsideFooter = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
  align-items: stretch;
  padding-top: 1rem;
  border-top: 1px solid ${colors.surfaceBorder};
`;

const AsideBotIcon = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  padding: 0.5rem;
  cursor: pointer;
  border-radius: 0.75rem;
  margin: 0 auto;
  transition: transform 0.2s ease, background-color 0.2s ease;

  &:hover {
    background-color: ${colors.slate100};
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const AccountWrap = styled.div`
  position: relative;
`;

const AccountButton = styled.button<{
  $collapsed: boolean;
  $open: boolean;
  $compact: boolean;
}>`
  display: flex;
  width: ${(p) => (p.$compact ? 'auto' : '100%')};
  align-items: center;
  gap: 0.5rem;
  min-width: 0;
  border: ${(p) => (p.$compact ? `1px solid ${colors.slate200}` : 'none')};
  border-radius: ${(p) => (p.$compact ? '999px' : '0.625rem')};
  padding: ${(p) =>
    p.$compact ? '0.25rem 0.75rem 0.25rem 0.25rem' : '0.375rem 0.5rem'};
  font-family: inherit;
  text-align: left;
  cursor: pointer;
  color: inherit;
  background: ${(p) => (p.$open ? colors.slate100 : 'transparent')};
  justify-content: ${(p) => (p.$collapsed ? 'center' : 'flex-start')};
  transition:
    background 0.15s ease,
    border-color 0.15s ease;

  &:hover {
    background: ${colors.slate100};
  }
`;

const AccountChevron = styled.span<{
  $open: boolean;
  $placement: 'up' | 'down';
}>`
  display: inline-flex;
  margin-left: auto;
  color: ${colors.slate400};

  svg {
    transition: transform 0.2s ease;
    transform: rotate(
      ${(p) => {
        const pointsUp = p.$placement === 'up' ? !p.$open : p.$open;
        return pointsUp ? '90deg' : '270deg';
      }}
    );
  }
`;

const AccountText = styled.span`
  display: flex;
  min-width: 0;
  flex-direction: column;
`;

const AccountName = styled.span`
  font-size: 0.85rem;
  font-weight: 600;
  color: ${colors.slate700};
`;

const Avatar = styled.div`
  display: grid;
  height: 2rem;
  width: 2rem;
  flex-shrink: 0;
  place-items: center;
  border-radius: 999px;
  background: ${colors.brand100};
  color: ${colors.brand700};
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
`;

const AsideEmail = styled.span`
  font-size: 0.8rem;
  color: ${colors.slate500};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const AccountMenu = styled.div<{
  $collapsed: boolean;
  $placement: 'up' | 'down';
}>`
  position: absolute;
  ${(p) =>
    p.$placement === 'up'
      ? 'bottom: calc(100% + 0.375rem);'
      : 'top: calc(100% + 0.375rem);'}
  left: ${(p) => (p.$placement === 'up' ? '0' : 'auto')};
  right: ${(p) =>
    p.$placement === 'up' ? (p.$collapsed ? 'auto' : '0') : '0'};
  min-width: ${(p) => (p.$placement === 'up' && !p.$collapsed ? '0' : '100%')};
  z-index: 20;
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  padding: 0.375rem;
  border-radius: 0.75rem;
  border: 1px solid ${colors.surfaceBorder};
  background: ${colors.surface};
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow: 0 12px 32px -12px rgba(15, 23, 42, 0.45);
`;

const accountMenuItem = `
  display: flex;
  align-items: center;
  gap: 0.625rem;
  border: none;
  border-radius: 0.5rem;
  padding: 0.5rem 0.625rem;
  font-size: 0.875rem;
  font-weight: 500;
  font-family: inherit;
  text-align: left;
  text-decoration: none;
  cursor: pointer;
  background: transparent;
  color: ${colors.slate600};
  transition:
    background 0.15s ease,
    color 0.15s ease;

  svg {
    color: ${colors.slate400};
    flex-shrink: 0;
  }

  &:hover {
    background: ${colors.slate100};
    color: ${colors.slate900};
  }
`;

const AccountMenuLink = styled(NavLink)`
  ${accountMenuItem}

  &.active {
    color: ${colors.brand700};
  }
  &.active svg {
    color: ${colors.brand600};
  }
`;

const AccountMenuButton = styled.button`
  width: 100%;
  ${accountMenuItem}
`;

const SideContent = styled.div`
  display: flex;
  min-width: 0;
  flex: 1;
  flex-direction: column;
  padding: 0 1rem;

  @media (min-width: 640px) {
    padding: 1.5rem 2rem 0;
  }
`;

// Plain (non-blur) top bar shown only on mobile when the sidebar is hidden.
const MobileTopBar = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 1.1rem 0;

  @media (min-width: 640px) {
    display: none;
  }
`;

// Desktop-only bar that keeps the page action (e.g. Save) on the right of the
// content area in sidebar mode. Hidden on mobile (MobileTopBar covers it).
const ContentActionBar = styled.div`
  display: none;

  @media (min-width: 640px) {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 0.75rem;
    padding: 0 0 0.5rem;
  }
`;

export function Layout({ children }: { children: ReactNode }) {
  return (
    <LayoutActionProvider>
      <LayoutShell>{children}</LayoutShell>
    </LayoutActionProvider>
  );
}

// Avatar account menu shared by both layouts. `placement` controls whether it
// opens up (sidebar footer) or down (top navbar). `collapsed` is only relevant
// to the sidebar rail (icon-only avatar).
function AccountDropdown({
  placement,
  collapsed = false,
}: {
  placement: 'up' | 'down';
  collapsed?: boolean;
}) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { t } = useLang();
  const ref = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open]);

  useEffect(() => {
    window.dispatchEvent(new Event('bot:avoid-changed'));
  }, [open]);

  if (!user?.email) return null;

  const compact = placement === 'down';
  const showText = !collapsed;
  const showChevron = !collapsed;

  return (
    <AccountWrap ref={ref} data-bot-avoid="">
      {open && (
        <AccountMenu
          $collapsed={collapsed}
          $placement={placement}
          data-bot-avoid=""
        >
          <AccountMenuLink to="/profile" onClick={() => setOpen(false)}>
            <UserIcon size={16} />
            {t('Profile')}
          </AccountMenuLink>
          <AccountMenuButton
            type="button"
            onClick={() => {
              setOpen(false);
              logout();
              navigate('/login');
            }}
          >
            <LogOutIcon size={16} />
            {t('Log out')}
          </AccountMenuButton>
        </AccountMenu>
      )}
      <AccountButton
        type="button"
        $collapsed={collapsed}
        $open={open}
        $compact={compact}
        onClick={() => setOpen((o) => !o)}
        title={!showText ? user.email : undefined}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <Avatar>{user.email.charAt(0)}</Avatar>
        {showText && (
          <AccountText>
            <AccountName>{t('Account')}</AccountName>
            <AsideEmail>{user.email}</AsideEmail>
          </AccountText>
        )}
        {showChevron && (
          <AccountChevron $open={open} $placement={placement}>
            <ChevronLeftIcon size={16} />
          </AccountChevron>
        )}
      </AccountButton>
    </AccountWrap>
  );
}

function LayoutShell({ children }: { children: ReactNode }) {
  const location = useLocation();
  const { action } = useLayoutActionSlot();
  const { t } = useLang();
  const { layout, collapsed, toggleCollapsed } = useNavLayout();
  const onHome = location.pathname === '/';

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

  const brand = (
    <>
      <BrandMark>N</BrandMark>
      <BrandName>NutriLens</BrandName>
    </>
  );

  const actions = (
    <>
      {onHome && (
        <AddButton to="/add">
          <PlusIcon size={16} />
          {t('Add food')}
        </AddButton>
      )}
      {action}
      <AccountDropdown placement="down" />
    </>
  );

  const mobileNav = (
    <MobileNav>
      {navItems.map((item) => (
        <MobileNavItem key={item.to} to={item.to} end={item.end}>
          {t(item.label)}
        </MobileNavItem>
      ))}
    </MobileNav>
  );

  if (layout === 'sidebar') {
    return (
      <SideWrap>
        <Aside $collapsed={collapsed}>
          <EdgeToggle
            type="button"
            $collapsed={collapsed}
            onClick={toggleCollapsed}
            aria-label={collapsed ? t('Expand menu') : t('Collapse menu')}
            title={collapsed ? t('Expand menu') : t('Collapse menu')}
          >
            <ChevronLeftIcon size={18} />
          </EdgeToggle>
          <AsideHead $collapsed={collapsed}>
            <AsideBrand>
              <BrandMark>N</BrandMark>
              {!collapsed && <BrandName>NutriLens</BrandName>}
            </AsideBrand>
          </AsideHead>
          <AsideNav>
            {navItems
              .filter((item) => item.to !== '/profile')
              .map((item) => (
                <AsideNavItem
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  $collapsed={collapsed}
                  title={collapsed ? t(item.label) : undefined}
                >
                  <item.Icon size={18} />
                  {!collapsed && t(item.label)}
                </AsideNavItem>
              ))}
          </AsideNav>
          <AsideSpacer />
          {collapsed && (
            <AsideBotIcon
              type="button"
              onClick={toggleCollapsed}
              title={t('Ask NutriBot')}
              aria-label={t('Ask NutriBot')}
            >
              <ChibiBot mood="happy" width={34} />
            </AsideBotIcon>
          )}
          <AsideFooter>
            <AccountDropdown placement="up" collapsed={collapsed} />
          </AsideFooter>
        </Aside>

        <SideContent>
          <MobileTopBar>
            <Brand>{brand}</Brand>
            <HeaderRight>{actions}</HeaderRight>
          </MobileTopBar>

          {(action || onHome) && (
            <ContentActionBar>
              {onHome && (
                <AddButton to="/add">
                  <PlusIcon size={16} />
                  {t('Add food')}
                </AddButton>
              )}
              {action}
            </ContentActionBar>
          )}

          <Main>{children}</Main>

          {mobileNav}
        </SideContent>

        {!collapsed && <NutriBot side="left" />}
      </SideWrap>
    );
  }

  return (
    <Shell>
      <Sentinel ref={sentinelRef} />
      <Header $scrolled={scrolled}>
        <HeaderStart>
          <Brand>{brand}</Brand>
          <DesktopNav>
            {navItems.map((item) => (
              <NavItem key={item.to} to={item.to} end={item.end}>
                {t(item.label)}
              </NavItem>
            ))}
          </DesktopNav>
        </HeaderStart>
        <HeaderEnd>
          <HeaderRight>{actions}</HeaderRight>
        </HeaderEnd>
      </Header>

      <Main>{children}</Main>

      {mobileNav}

      <NutriBot />
    </Shell>
  );
}
