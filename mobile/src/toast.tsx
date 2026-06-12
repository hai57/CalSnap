import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Animated, Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { colors } from "./theme";

export type ToastType = "success" | "error" | "info";

interface Toast {
  id: number;
  type: ToastType;
  message: string;
  anim: Animated.Value;
}

interface ToastApi {
  show: (message: string, type?: ToastType) => void;
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
}

const ToastContext = createContext<ToastApi | undefined>(undefined);

const DURATION = 3000;

function accentFor(type: ToastType): string {
  if (type === "success") return colors.brand;
  if (type === "error") return colors.danger;
  return colors.blue;
}

const ICON: Record<ToastType, string> = {
  success: "✓",
  error: "!",
  info: "i",
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const insets = useSafeAreaInsets();
  const [toasts, setToasts] = useState<Toast[]>([]);
  const idRef = useRef(0);

  const dismiss = useCallback((id: number) => {
    setToasts((list) => {
      const t = list.find((x) => x.id === id);
      if (t) {
        Animated.timing(t.anim, {
          toValue: 0,
          duration: 180,
          useNativeDriver: true,
        }).start(() => {
          setToasts((cur) => cur.filter((x) => x.id !== id));
        });
      }
      return list;
    });
  }, []);

  const show = useCallback(
    (message: string, type: ToastType = "info") => {
      const id = ++idRef.current;
      const anim = new Animated.Value(0);
      setToasts((list) => [...list, { id, type, message, anim }]);
      Animated.timing(anim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
      setTimeout(() => dismiss(id), DURATION);
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
      <View pointerEvents="box-none" style={[styles.viewport, { top: insets.top + 8 }]}>
        {toasts.map((t) => (
          <Animated.View
            key={t.id}
            style={[
              styles.toast,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                borderLeftColor: accentFor(t.type),
                opacity: t.anim,
                transform: [
                  {
                    translateX: t.anim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [24, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <Pressable style={styles.row} onPress={() => dismiss(t.id)}>
              <View style={[styles.icon, { backgroundColor: accentFor(t.type) }]}>
                <Text style={styles.iconText}>{ICON[t.type]}</Text>
              </View>
              <Text style={[styles.message, { color: colors.text }]} numberOfLines={3}>
                {t.message}
              </Text>
            </Pressable>
          </Animated.View>
        ))}
      </View>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastApi {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

const styles = {
  viewport: {
    position: "absolute" as const,
    left: 0,
    right: 0,
    paddingHorizontal: 12,
    alignItems: "flex-end" as const,
    gap: 8,
    zIndex: 9999,
  },
  toast: {
    minWidth: 240,
    maxWidth: "92%" as const,
    borderRadius: 14,
    borderWidth: 1,
    borderLeftWidth: 3,
    paddingVertical: 12,
    paddingHorizontal: 14,
    shadowColor: "#0f172a",
    shadowOpacity: 0.18,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  row: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 10,
  },
  icon: {
    width: 20,
    height: 20,
    borderRadius: 999,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  iconText: { color: "#fff", fontWeight: "700" as const, fontSize: 12 },
  message: {
    flexShrink: 1,
    fontSize: 14,
    fontWeight: "500" as const,
  },
};
