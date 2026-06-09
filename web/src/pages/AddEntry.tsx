import { useState } from "react";
import { useNavigate } from "react-router-dom";

import type { AnalyzeResult } from "@shared/types";

import { api, resolveImageUrl } from "../lib/api";

type Mode = "photo" | "text";

export function AddEntry() {
  const [mode, setMode] = useState<Mode>("photo");
  const [result, setResult] = useState<AnalyzeResult | null>(null);

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <h1 className="text-2xl font-bold">Add food</h1>

      {!result && (
        <>
          <div className="flex gap-2">
            <TabButton active={mode === "photo"} onClick={() => setMode("photo")}>
              📷 Photo
            </TabButton>
            <TabButton active={mode === "text"} onClick={() => setMode("text")}>
              ✍️ Describe
            </TabButton>
          </div>
          {mode === "photo" ? (
            <PhotoForm onResult={setResult} />
          ) : (
            <TextForm onResult={setResult} />
          )}
        </>
      )}

      {result && <ConfirmCard result={result} onBack={() => setResult(null)} />}
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 rounded-xl border px-4 py-3 font-medium transition ${
        active
          ? "border-brand-500 bg-brand-50 text-brand-700"
          : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
      }`}
    >
      {children}
    </button>
  );
}

function PhotoForm({ onResult }: { onResult: (r: AnalyzeResult) => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    setPreview(f ? URL.createObjectURL(f) : null);
  }

  async function analyze() {
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      const form = new FormData();
      form.append("file", file);
      onResult(await api.analyzeImage(form));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="card space-y-4 p-6">
      <label className="block cursor-pointer rounded-xl border-2 border-dashed border-slate-300 p-6 text-center transition hover:border-brand-400">
        <input type="file" accept="image/*" capture="environment" hidden onChange={onPick} />
        {preview ? (
          <img src={preview} alt="preview" className="mx-auto max-h-64 rounded-lg object-contain" />
        ) : (
          <div className="text-slate-500">
            <div className="text-4xl">📷</div>
            <p className="mt-2 font-medium">Tap to take or upload a photo</p>
            <p className="text-xs text-slate-400">JPG, PNG or WEBP up to 10 MB</p>
          </div>
        )}
      </label>
      {error && <p className="text-sm text-red-500">{error}</p>}
      <button onClick={analyze} disabled={!file || busy} className="btn-primary w-full py-2.5">
        {busy ? "Analyzing with AI..." : "Analyze photo"}
      </button>
    </div>
  );
}

function TextForm({ onResult }: { onResult: (r: AnalyzeResult) => void }) {
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function analyze() {
    if (!text.trim()) return;
    setBusy(true);
    setError(null);
    try {
      onResult(await api.analyzeText(text.trim()));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="card space-y-4 p-6">
      <textarea
        className="input min-h-32 resize-y"
        placeholder="e.g. Two scrambled eggs, a slice of whole-wheat toast with butter, and a black coffee"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
      <button onClick={analyze} disabled={!text.trim() || busy} className="btn-primary w-full py-2.5">
        {busy ? "Analyzing with AI..." : "Estimate calories"}
      </button>
    </div>
  );
}

function ConfirmCard({ result, onBack }: { result: AnalyzeResult; onBack: () => void }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: result.name,
    calories: Math.round(result.calories),
    protein: Math.round(result.protein),
    carbs: Math.round(result.carbs),
    fat: Math.round(result.fat),
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const img = resolveImageUrl(result.image_url);

  function num(key: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [key]: Number(e.target.value) }));
  }

  async function save() {
    setBusy(true);
    setError(null);
    try {
      await api.createEntry({
        ...form,
        source: result.source,
        image_url: result.image_url,
        confidence: result.confidence,
      });
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save");
      setBusy(false);
    }
  }

  return (
    <div className="card space-y-4 p-6">
      <div className="flex items-center gap-2">
        <span className="rounded-full bg-brand-100 px-2.5 py-0.5 text-xs font-medium text-brand-700">
          AI estimate
        </span>
        {result.confidence != null && (
          <span className="text-xs text-slate-500">
            {Math.round(result.confidence * 100)}% confidence
          </span>
        )}
      </div>

      {img && <img src={img} alt={form.name} className="max-h-56 w-full rounded-xl object-cover" />}

      <p className="text-sm text-slate-500">Review and tweak before saving.</p>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-600">Food</label>
        <input
          className="input"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Calories (kcal)" value={form.calories} onChange={num("calories")} />
        <Field label="Protein (g)" value={form.protein} onChange={num("protein")} />
        <Field label="Carbs (g)" value={form.carbs} onChange={num("carbs")} />
        <Field label="Fat (g)" value={form.fat} onChange={num("fat")} />
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="flex-1 rounded-xl border border-slate-200 py-2.5 font-medium text-slate-600 hover:bg-slate-50"
        >
          Back
        </button>
        <button onClick={save} disabled={busy} className="btn-primary flex-1 py-2.5">
          {busy ? "Saving..." : "Save entry"}
        </button>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-slate-600">{label}</label>
      <input type="number" min={0} className="input" value={value} onChange={onChange} />
    </div>
  );
}
