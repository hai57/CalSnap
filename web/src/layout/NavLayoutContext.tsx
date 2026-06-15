import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import styled from "styled-components";

import { useLang } from "../i18n";
import { colors } from "../styles/theme";

export type NavLayout = "navbar" | "sidebar";

const STORAGE_KEY = "nutrilens_nav_layout";
const COLLAPSE_KEY = "nutrilens_nav_collapsed";

interface NavLayoutState {
  layout: NavLayout;
  setLayout: (l: NavLayout) => void;
  collapsed: boolean;
  setCollapsed: (c: boolean) => void;
  toggleCollapsed: () => void;
}

const NavLayoutContext = createContext<NavLayoutState | undefined>(undefined);

function readStored(): NavLayout {
  if (typeof window === "undefined") return "navbar";
  return window.localStorage.getItem(STORAGE_KEY) === "sidebar"
    ? "sidebar"
    : "navbar";
}

function readCollapsed(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(COLLAPSE_KEY) === "1";
}

export function NavLayoutProvider({ children }: { children: ReactNode }) {
  const [layout, setLayoutState] = useState<NavLayout>(readStored);
  const [collapsed, setCollapsedState] = useState<boolean>(readCollapsed);

  const setLayout = useCallback((l: NavLayout) => {
    setLayoutState(l);
    try {
      window.localStorage.setItem(STORAGE_KEY, l);
    } catch {
      // ignore storage failures
    }
  }, []);

  const setCollapsed = useCallback((c: boolean) => {
    setCollapsedState(c);
    try {
      window.localStorage.setItem(COLLAPSE_KEY, c ? "1" : "0");
    } catch {
      // ignore storage failures
    }
  }, []);

  const toggleCollapsed = useCallback(
    () => setCollapsed(!collapsed),
    [collapsed, setCollapsed],
  );

  const value = useMemo<NavLayoutState>(
    () => ({ layout, setLayout, collapsed, setCollapsed, toggleCollapsed }),
    [layout, setLayout, collapsed, setCollapsed, toggleCollapsed],
  );

  return (
    <NavLayoutContext.Provider value={value}>
      {children}
    </NavLayoutContext.Provider>
  );
}

export function useNavLayout(): NavLayoutState {
  const ctx = useContext(NavLayoutContext);
  if (!ctx)
    throw new Error("useNavLayout must be used within NavLayoutProvider");
  return ctx;
}

function TopBarIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M3 9h18" />
    </svg>
  );
}

function SideBarIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M9 4v16" />
    </svg>
  );
}

const OPTIONS: { key: NavLayout; label: string; Icon: typeof TopBarIcon }[] = [
  { key: "navbar", label: "Top bar", Icon: TopBarIcon },
  { key: "sidebar", label: "Side bar", Icon: SideBarIcon },
];

export function NavLayoutToggle() {
  const { layout, setLayout } = useNavLayout();
  const { t } = useLang();
  return (
    <Group role="radiogroup" aria-label={t("Navigation")}>
      {OPTIONS.map(({ key, label, Icon }) => (
        <Segment
          key={key}
          type="button"
          role="radio"
          aria-checked={layout === key}
          aria-label={t(label)}
          title={t(label)}
          $active={layout === key}
          onClick={() => setLayout(key)}
        >
          <Icon size={16} />
        </Segment>
      ))}
    </Group>
  );
}

const Group = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.125rem;
  padding: 0.1875rem;
  border-radius: 0.625rem;
  border: 1px solid ${colors.slate200};
  background: ${colors.slate100};
`;

const Segment = styled.button<{ $active: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.875rem;
  height: 1.875rem;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  color: ${(p) => (p.$active ? colors.brand700 : colors.slate500)};
  background: ${(p) => (p.$active ? colors.white : "transparent")};
  box-shadow: ${(p) =>
    p.$active ? "0 1px 4px -1px rgba(15, 23, 42, 0.25)" : "none"};
  transition:
    background 0.15s ease,
    color 0.15s ease,
    transform 0.08s ease;

  &:hover {
    color: ${(p) => (p.$active ? colors.brand700 : colors.slate700)};
  }
  &:active {
    transform: scale(0.92);
  }
`;
