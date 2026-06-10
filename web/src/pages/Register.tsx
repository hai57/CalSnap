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

export function Register() {
  const { register } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setBusy(true);
    try {
      await register(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Screen>
      <AuthCard>
        <AuthHeader>
          <BrandMark>N</BrandMark>
          <AuthTitle>Create your account</AuthTitle>
          <AuthSubtitle>Start tracking with AI in seconds</AuthSubtitle>
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
              autoComplete="new-password"
              minLength={6}
            />
          </div>
          {error && <ErrorText>{error}</ErrorText>}
          <PrimaryButton type="submit" disabled={busy} $fullWidth>
            {busy ? "Creating account..." : "Sign up"}
          </PrimaryButton>
        </Form>
        <Footer>
          Already have an account? <FooterLink to="/login">Log in</FooterLink>
        </Footer>
      </AuthCard>
    </Screen>
  );
}
