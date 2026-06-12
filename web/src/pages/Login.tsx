import { useState } from "react";

import { useAuth } from "../auth/AuthContext";
import { useLang } from "../i18n";
import { ErrorText, FieldLabel, Input, PrimaryButton } from "../styles/ui";
import {
  AuthCard,
  AuthHeader,
  AuthSubtitle,
  AuthTitle,
  BrandMark,
  Footer,
  FooterLink,
  Form,
  Screen,
} from "../styles/auth";

export function Login() {
  const { login } = useAuth();
  const { t } = useLang();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("Login failed"));
    } finally {
      setBusy(false);
    }
  }

  return (
    <Screen>
      <AuthCard>
        <AuthHeader>
          <BrandMark>N</BrandMark>
          <AuthTitle>{t("Welcome back")}</AuthTitle>
          <AuthSubtitle>{t("Log in to track your calories")}</AuthSubtitle>
        </AuthHeader>
        <Form onSubmit={onSubmit}>
          <div>
            <FieldLabel>{t("Email")}</FieldLabel>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
          <div>
            <FieldLabel>{t("Password")}</FieldLabel>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>
          {error && <ErrorText>{error}</ErrorText>}
          <PrimaryButton type="submit" disabled={busy} $fullWidth>
            {busy ? t("Logging in...") : t("Log in")}
          </PrimaryButton>
        </Form>
        <Footer>
          {t("No account?")}{" "}
          <FooterLink to="/register">{t("Sign up")}</FooterLink>
        </Footer>
      </AuthCard>
    </Screen>
  );
}
