import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import { AuthProvider } from "./auth/AuthContext";
import { BotProvider } from "./bot/BotContext";
import { ToastProvider } from "./components/Toast";
import { ThemeProvider } from "./theme/ThemeContext";
import { LanguageProvider } from "./i18n";
import { NavLayoutProvider } from "./layout/NavLayoutContext";
import { Background } from "./styles/Background";
import { GlobalStyle } from "./styles/global";

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, refetchOnWindowFocus: false } },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider>
      <LanguageProvider>
        <NavLayoutProvider>
          <GlobalStyle />
          <Background />
          <QueryClientProvider client={queryClient}>
            <BrowserRouter>
              <ToastProvider>
                <BotProvider>
                  <AuthProvider>
                    <App />
                  </AuthProvider>
                </BotProvider>
              </ToastProvider>
            </BrowserRouter>
          </QueryClientProvider>
        </NavLayoutProvider>
      </LanguageProvider>
    </ThemeProvider>
  </React.StrictMode>,
);
