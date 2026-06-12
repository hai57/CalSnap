import styled from "styled-components";

import { useLang } from "../i18n";
import { colors } from "../styles/theme";
import { useTheme, type ThemeMode } from "../theme/ThemeContext";
import { MonitorIcon, MoonIcon, SunIcon } from "./BaseIcons";

const OPTIONS: { mode: ThemeMode; label: string; Icon: typeof SunIcon }[] = [
  { mode: "system", label: "System", Icon: MonitorIcon },
  { mode: "light", label: "Light", Icon: SunIcon },
  { mode: "dark", label: "Dark", Icon: MoonIcon },
];

export function ThemeToggle() {
  const { mode, setMode } = useTheme();
  const { t } = useLang();

  return (
    <Group role="radiogroup" aria-label={t("Display mode")}>
      {OPTIONS.map(({ mode: m, label, Icon }) => (
        <Segment
          key={m}
          type="button"
          role="radio"
          aria-checked={mode === m}
          aria-label={t(label)}
          title={t(label)}
          $active={mode === m}
          onClick={() => setMode(m)}
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
