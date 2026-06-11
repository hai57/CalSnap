import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

interface LayoutActionValue {
  action: ReactNode;
  setAction: (node: ReactNode) => void;
}

const LayoutActionContext = createContext<LayoutActionValue>({
  action: null,
  setAction: () => {},
});

export function LayoutActionProvider({ children }: { children: ReactNode }) {
  const [action, setAction] = useState<ReactNode>(null);
  return (
    <LayoutActionContext.Provider value={{ action, setAction }}>
      {children}
    </LayoutActionContext.Provider>
  );
}

export function useLayoutActionSlot() {
  return useContext(LayoutActionContext);
}

// Pages call this to render a node (e.g. a Save button) in the header, next to
// "+ Add food". The node is cleared automatically when the page unmounts.
export function useHeaderAction(node: ReactNode, deps: unknown[]) {
  const { setAction } = useLayoutActionSlot();
  useEffect(() => {
    setAction(node);
    return () => setAction(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
