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

export function Register() {
  const { register } = useAuth();
  const { t } = useLang();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password.length < 6) {
      setError(t("Password must be at least 6 characters"));
      return;
    }
    setBusy(true);
    try {
      await register(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("Registration failed"));
    } finally {
      setBusy(false);
    }
  }

  return (
    <Screen>
      <AuthCard>
        <AuthHeader>
          <BrandMark>N</BrandMark>
          <AuthTitle>{t("Create your account")}</AuthTitle>
          <AuthSubtitle>{t("Start tracking with AI in seconds")}</AuthSubtitle>
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
              autoComplete="new-password"
              minLength={6}
            />
          </div>
          {error && <ErrorText>{error}</ErrorText>}
          <PrimaryButton type="submit" disabled={busy} $fullWidth>
            {busy ? t("Creating account...") : t("Sign up")}
          </PrimaryButton>
        </Form>
        <Footer>
          {t("Already have an account?")}{" "}
          <FooterLink to="/login">{t("Log in")}</FooterLink>
        </Footer>
      </AuthCard>
    </Screen>
  );
}
