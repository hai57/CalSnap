import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import styled, { css, keyframes } from "styled-components";

import { colors } from "../styles/theme";

export type ToastType = "success" | "error" | "info";

interface Toast {
  id: number;
  type: ToastType;
  message: string;
}

interface ToastApi {
  show: (message: string, type?: ToastType) => void;
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
}

const ToastContext = createContext<ToastApi | undefined>(undefined);

const DURATION = 3500;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const idRef = useRef(0);

  const dismiss = useCallback((id: number) => {
    setToasts((list) => list.filter((t) => t.id !== id));
  }, []);

  const show = useCallback(
    (message: string, type: ToastType = "info") => {
      const id = ++idRef.current;
      setToasts((list) => [...list, { id, type, message }]);
      window.setTimeout(() => dismiss(id), DURATION);
    },
    [dismiss],
  );

  const api = useMemo<ToastApi>(
    () => ({
      show,
      success: (m) => show(m, "success"),
      error: (m) => show(m, "error"),
      info: (m) => show(m, "info"),
    }),
    [show],
  );

  return (
    <ToastContext.Provider value={api}>
      {children}
      <Viewport>
        {toasts.map((t) => (
          <ToastCard key={t.id} $type={t.type} role="status" onClick={() => dismiss(t.id)}>
            <Icon $type={t.type}>{ICONS[t.type]}</Icon>
            <Message>{t.message}</Message>
          </ToastCard>
        ))}
      </Viewport>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastApi {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

const ICONS: Record<ToastType, string> = {
  success: "✓",
  error: "!",
  info: "i",
};

const ACCENT: Record<ToastType, string> = {
  success: colors.brand500,
  error: colors.red500,
  info: colors.blue500,
};

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(16px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateX(0) scale(1);
  }
`;

const Viewport = styled.div`
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.5rem;
  pointer-events: none;
  width: max-content;
  max-width: calc(100vw - 2rem);
`;

const ToastCard = styled.div<{ $type: ToastType }>`
  pointer-events: auto;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.625rem;
  min-width: 16rem;
  max-width: 100%;
  padding: 0.75rem 1rem;
  border-radius: 0.875rem;
  background: ${colors.surface};
  backdrop-filter: blur(10px);
  border: 1px solid ${colors.surfaceBorder};
  box-shadow: 0 12px 30px -12px rgba(15, 23, 42, 0.28);
  animation: ${slideIn} 0.18s ease-out;
  ${(p) => css`
    border-left: 3px solid ${ACCENT[p.$type]};
  `}
`;

const Icon = styled.span<{ $type: ToastType }>`
  display: grid;
  place-items: center;
  flex-shrink: 0;
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 700;
  color: ${colors.onAccent};
  background: ${(p) => ACCENT[p.$type]};
`;

const Message = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${colors.slate700};
  line-height: 1.3;
`;
