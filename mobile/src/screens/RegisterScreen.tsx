import { useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from "react-native";

import { useAuth } from "../auth";
import { Field, PrimaryButton } from "../components";
import { colors } from "../theme";

export function RegisterScreen({ navigation }: { navigation: any }) {
  const { register } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit() {
    setError(null);
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setBusy(true);
    try {
      await register(email.trim(), password);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.bg }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "center", padding: 24 }}>
        <Text style={{ fontSize: 26, fontWeight: "800", color: colors.text, marginBottom: 6 }}>
          Create account
        </Text>
        <Text style={{ color: colors.muted, marginBottom: 24 }}>
          Start tracking with AI in seconds
        </Text>

        <Field
          label="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="you@example.com"
          editable={!busy}
        />
        <Field
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="At least 6 characters"
          editable={!busy}
        />
        {error && <Text style={{ color: colors.danger, marginBottom: 12 }}>{error}</Text>}
        <PrimaryButton title="Sign up" onPress={submit} loading={busy} />

        <Pressable
          onPress={() => navigation.navigate("Login")}
          disabled={busy}
          style={{ marginTop: 20, opacity: busy ? 0.5 : 1 }}
        >
          <Text style={{ textAlign: "center", color: colors.muted }}>
            Already have an account?{" "}
            <Text style={{ color: colors.brandDark, fontWeight: "700" }}>Log in</Text>
          </Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
