import { useState } from "react";

import { useAuth } from "../auth/AuthContext";
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
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Screen>
      <AuthCard>
        <AuthHeader>
          <BrandMark>N</BrandMark>
          <AuthTitle>Welcome back</AuthTitle>
          <AuthSubtitle>Log in to track your calories</AuthSubtitle>
        </AuthHeader>
        <Form onSubmit={onSubmit}>
          <div>
            <FieldLabel>Email</FieldLabel>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
          <div>
            <FieldLabel>Password</FieldLabel>
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
            {busy ? "Logging in..." : "Log in"}
          </PrimaryButton>
        </Form>
        <Footer>
          No account? <FooterLink to="/register">Sign up</FooterLink>
        </Footer>
      </AuthCard>
    </Screen>
  );
}
