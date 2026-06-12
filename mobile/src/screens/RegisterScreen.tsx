import { useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from "react-native";

import { useAuth } from "../auth";
import { Field, PrimaryButton } from "../components";
import { useLang } from "../i18n";
import { colors } from "../theme";

export function RegisterScreen({ navigation }: { navigation: any }) {
  const { register } = useAuth();
  const { t } = useLang();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit() {
    setError(null);
    if (password.length < 6) {
      setError(t("Password must be at least 6 characters"));
      return;
    }
    setBusy(true);
    try {
      await register(email.trim(), password);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("Registration failed"));
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
          {t("Create account")}
        </Text>
        <Text style={{ color: colors.muted, marginBottom: 24 }}>
          {t("Start tracking with AI in seconds")}
        </Text>

        <Field
          label={t("Email")}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="you@example.com"
          editable={!busy}
        />
        <Field
          label={t("Password")}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder={t("At least 6 characters")}
          editable={!busy}
        />
        {error && <Text style={{ color: colors.danger, marginBottom: 12 }}>{error}</Text>}
        <PrimaryButton title={t("Sign up")} onPress={submit} loading={busy} />

        <Pressable
          onPress={() => navigation.navigate("Login")}
          disabled={busy}
          style={{ marginTop: 20, opacity: busy ? 0.5 : 1 }}
        >
          <Text style={{ textAlign: "center", color: colors.muted }}>
            {t("Already have an account?")}{" "}
            <Text style={{ color: colors.brandDark, fontWeight: "700" }}>{t("Log in")}</Text>
          </Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
