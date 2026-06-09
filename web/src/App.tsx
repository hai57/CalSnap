import { Navigate, Route, Routes } from "react-router-dom";

import { Layout } from "./components/Layout";
import { useAuth } from "./auth/AuthContext";
import type { ReactNode } from "react";
import { AddEntry } from "./pages/AddEntry";
import { Dashboard } from "./pages/Dashboard";
import { Goals } from "./pages/Goals";
import { History } from "./pages/History";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";

function Protected({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-slate-500">Loading...</div>
    );
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
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
