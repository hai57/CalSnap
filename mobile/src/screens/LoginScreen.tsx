import { useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from "react-native";

import { useAuth } from "../auth";
import { Field, PrimaryButton } from "../components";
import { useLang } from "../i18n";
import { colors } from "../theme";

export function LoginScreen({ navigation }: { navigation: any }) {
  const { login } = useAuth();
  const { t } = useLang();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit() {
    setError(null);
    setBusy(true);
    try {
      await login(email.trim(), password);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("Login failed"));
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
        <View style={{ alignItems: "center", marginBottom: 28 }}>
          <View
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              backgroundColor: colors.brand,
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 12,
            }}
          >
            <Text style={{ color: "#fff", fontSize: 28, fontWeight: "800" }}>N</Text>
          </View>
          <Text style={{ fontSize: 26, fontWeight: "800", color: colors.text }}>NutriLens</Text>
          <Text style={{ color: colors.muted, marginTop: 4 }}>{t("Log in to track your calories")}</Text>
        </View>

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
          placeholder="••••••••"
          editable={!busy}
        />
        {error && <Text style={{ color: colors.danger, marginBottom: 12 }}>{error}</Text>}
        <PrimaryButton title={t("Log in")} onPress={submit} loading={busy} />

        <Pressable
          onPress={() => navigation.navigate("Register")}
          disabled={busy}
          style={{ marginTop: 20, opacity: busy ? 0.5 : 1 }}
        >
          <Text style={{ textAlign: "center", color: colors.muted }}>
            {t("No account?")} <Text style={{ color: colors.brandDark, fontWeight: "700" }}>{t("Sign up")}</Text>
          </Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
