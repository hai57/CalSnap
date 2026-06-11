import { Navigate, Route, Routes } from "react-router-dom";
import styled from "styled-components";

import { Layout } from "./components/Layout";
import { useAuth } from "./auth/AuthContext";
import type { ReactNode } from "react";
import { AddEntry } from "./pages/AddEntry";
import { Dashboard } from "./pages/Dashboard";
import { Goals } from "./pages/Goals";
import { History } from "./pages/History";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Settings } from "./pages/Settings";
import { colors } from "./styles/theme";

const FullScreenCenter = styled.div`
  display: flex;
  height: 100vh;
  align-items: center;
  justify-content: center;
  color: ${colors.slate500};
`;

function Protected({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) {
    return <FullScreenCenter>Loading...</FullScreenCenter>;
  }
  if (!user) return <Navigate to="/login" replace />;
  return <Layout>{children}</Layout>;
}

function PublicOnly({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) return <Navigate to="/" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <PublicOnly>
            <Login />
          </PublicOnly>
        }
      />
      <Route
        path="/register"
        element={
          <PublicOnly>
            <Register />
          </PublicOnly>
        }
      />
      <Route
        path="/"
        element={
          <Protected>
            <Dashboard />
          </Protected>
        }
      />
      <Route
        path="/add"
        element={
          <Protected>
            <AddEntry />
          </Protected>
        }
      />
      <Route
        path="/history"
        element={
          <Protected>
            <History />
          </Protected>
        }
      />
      <Route
        path="/goals"
        element={
          <Protected>
            <Goals />
          </Protected>
        }
      />
      <Route
        path="/settings"
        element={
          <Protected>
            <Settings />
          </Protected>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
