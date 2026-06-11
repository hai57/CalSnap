import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { Alert, Image, Pressable, ScrollView, Text, View } from "react-native";

import type { AnalyzeResult } from "@shared/types";

import { api } from "../api";
import { Card, Field, PrimaryButton } from "../components";
import { resolveImageUrl } from "../config";
import { colors } from "../theme";

type Mode = "photo" | "text";

export function AddScreen({ navigation }: { navigation: any }) {
  const [mode, setMode] = useState<Mode>("photo");
  const [result, setResult] = useState<AnalyzeResult | null>(null);

  if (result) {
    return (
      <Confirm
        result={result}
        onBack={() => setResult(null)}
        onSaved={() => {
          setResult(null);
          navigation.navigate("Main", { screen: "Today" });
        }}
      />
    );
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.bg }}
      contentContainerStyle={{ padding: 16, gap: 16 }}
    >
      <View style={{ flexDirection: "row", gap: 10 }}>
        <Tab label="📷 Photo" active={mode === "photo"} onPress={() => setMode("photo")} />
        <Tab label="✍️ Describe" active={mode === "text"} onPress={() => setMode("text")} />
      </View>
      {mode === "photo" ? <PhotoMode onResult={setResult} /> : <TextMode onResult={setResult} />}
    </ScrollView>
  );
}

function Tab({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        flex: 1,
        paddingVertical: 14,
        borderRadius: 12,
        borderWidth: 1,
        alignItems: "center",
        borderColor: active ? colors.brand : colors.border,
        backgroundColor: active ? colors.brandLight : "#fff",
      }}
    >
      <Text style={{ fontWeight: "600", color: active ? colors.brandDark : colors.muted }}>
        {label}
      </Text>
    </Pressable>
  );
}

function PhotoMode({ onResult }: { onResult: (r: AnalyzeResult) => void }) {
  const [asset, setAsset] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [busy, setBusy] = useState(false);

  async function pick(useCamera: boolean) {
    const perm = useCamera
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert("Permission needed", "Please allow access to continue.");
      return;
    }
    const res = useCamera
      ? await ImagePicker.launchCameraAsync({ quality: 0.7 })
      : await ImagePicker.launchImageLibraryAsync({ quality: 0.7, mediaTypes: ["images"] });
    if (!res.canceled) setAsset(res.assets[0]);
  }

  async function analyze() {
    if (!asset) return;
    setBusy(true);
    try {
      const form = new FormData();
      const name = asset.fileName ?? "photo.jpg";
      const type = asset.mimeType ?? "image/jpeg";
      // React Native FormData file shape.
      form.append("file", { uri: asset.uri, name, type } as any);
      onResult(await api.analyzeImage(form));
    } catch (err) {
      Alert.alert("Analysis failed", err instanceof Error ? err.message : "Try again");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card style={{ gap: 14 }}>
      {asset ? (
        <Image
          source={{ uri: asset.uri }}
          style={{ width: "100%", height: 220, borderRadius: 12 }}
          resizeMode="cover"
        />
      ) : (
        <View
          style={{
            height: 160,
            borderRadius: 12,
            borderWidth: 2,
            borderStyle: "dashed",
            borderColor: colors.border,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ fontSize: 36 }}>📷</Text>
          <Text style={{ color: colors.muted, marginTop: 6 }}>No photo selected</Text>
        </View>
      )}
      <View style={{ flexDirection: "row", gap: 10 }}>
        <View style={{ flex: 1 }}>
          <PrimaryButton title="Camera" onPress={() => pick(true)} />
        </View>
        <View style={{ flex: 1 }}>
          <PrimaryButton title="Library" onPress={() => pick(false)} />
        </View>
      </View>
      <PrimaryButton
        title="Analyze photo"
        onPress={analyze}
        loading={busy}
        disabled={!asset}
      />
    </Card>
  );
}

function TextMode({ onResult }: { onResult: (r: AnalyzeResult) => void }) {
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);

  async function analyze() {
    if (!text.trim()) return;
    setBusy(true);
    try {
      onResult(await api.analyzeText(text.trim()));
    } catch (err) {
      Alert.alert("Analysis failed", err instanceof Error ? err.message : "Try again");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card style={{ gap: 6 }}>
      <Field
        label="Describe your meal"
        value={text}
        onChangeText={setText}
        multiline
        numberOfLines={4}
        placeholder="e.g. Grilled chicken breast with rice and steamed broccoli"
        style={{
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: 12,
          padding: 14,
          minHeight: 110,
          textAlignVertical: "top",
          fontSize: 16,
          color: colors.text,
        }}
      />
      <PrimaryButton
        title="Estimate calories"
        onPress={analyze}
        loading={busy}
        disabled={!text.trim()}
      />
    </Card>
  );
}

function Confirm({
  result,
  onBack,
  onSaved,
}: {
  result: AnalyzeResult;
  onBack: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState({
    name: result.name,
    calories: String(Math.round(result.calories)),
    protein: String(Math.round(result.protein)),
    carbs: String(Math.round(result.carbs)),
    fat: String(Math.round(result.fat)),
  });
  const [busy, setBusy] = useState(false);
  const img = resolveImageUrl(result.image_url);

  async function save() {
    setBusy(true);
    try {
      await api.createEntry({
        name: form.name,
        calories: Number(form.calories) || 0,
        protein: Number(form.protein) || 0,
        carbs: Number(form.carbs) || 0,
        fat: Number(form.fat) || 0,
        source: result.source,
        image_url: result.image_url,
        confidence: result.confidence,
      });
      onSaved();
    } catch (err) {
      Alert.alert("Could not save", err instanceof Error ? err.message : "Try again");
      setBusy(false);
    }
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.bg }}
      contentContainerStyle={{ padding: 16 }}
    >
      <Card style={{ gap: 4 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 }}>
          <View style={{ backgroundColor: colors.brandLight, paddingHorizontal: 10, paddingVertical: 3, borderRadius: 999 }}>
            <Text style={{ color: colors.brandDark, fontSize: 12, fontWeight: "700" }}>AI estimate</Text>
          </View>
          {result.confidence != null && (
            <Text style={{ color: colors.muted, fontSize: 12 }}>
              {Math.round(result.confidence * 100)}% confidence
            </Text>
          )}
        </View>

        {img && (
          <Image
            source={{ uri: img }}
            style={{ width: "100%", height: 180, borderRadius: 12, marginBottom: 10 }}
            resizeMode="cover"
          />
        )}

        <Field label="Food" value={form.name} onChangeText={(v) => setForm((f) => ({ ...f, name: v }))} />
        <Row>
          <NumField label="Calories" value={form.calories} onChange={(v) => setForm((f) => ({ ...f, calories: v }))} />
          <NumField label="Protein (g)" value={form.protein} onChange={(v) => setForm((f) => ({ ...f, protein: v }))} />
        </Row>
        <Row>
          <NumField label="Carbs (g)" value={form.carbs} onChange={(v) => setForm((f) => ({ ...f, carbs: v }))} />
          <NumField label="Fat (g)" value={form.fat} onChange={(v) => setForm((f) => ({ ...f, fat: v }))} />
        </Row>

        <View style={{ flexDirection: "row", gap: 10, marginTop: 6 }}>
          <Pressable
            onPress={onBack}
            style={{
              flex: 1,
              paddingVertical: 14,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: colors.border,
              alignItems: "center",
            }}
          >
            <Text style={{ color: colors.muted, fontWeight: "600" }}>Back</Text>
          </Pressable>
          <View style={{ flex: 1 }}>
            <PrimaryButton title="Save entry" onPress={save} loading={busy} />
          </View>
        </View>
      </Card>
    </ScrollView>
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return <View style={{ flexDirection: "row", gap: 10 }}>{children}</View>;
}

function NumField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <View style={{ flex: 1 }}>
      <Field label={label} value={value} onChangeText={onChange} keyboardType="numeric" />
    </View>
  );
}
