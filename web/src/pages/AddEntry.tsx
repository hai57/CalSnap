import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import type { AnalyzeResult } from '@shared/types';

import { api, resolveImageUrl } from '../lib/api';
import { CameraIcon, PencilIcon } from '../components/BaseIcons';
import {
  ErrorText,
  FieldLabel,
  Input,
  PrimaryButton,
  Textarea,
} from '../styles/ui';
import {
  Actions,
  BackButton,
  Badge,
  BadgeRow,
  Confidence,
  DropHint,
  DropIcon,
  DropSub,
  DropTitle,
  Dropzone,
  FieldGrid,
  FormCard,
  Hint,
  Page,
  Preview,
  ResultImage,
  SaveButton,
  Tab,
  Tabs,
  Title,
} from './StAddEntry';

type Mode = 'photo' | 'text';

export function AddEntry() {
  const [mode, setMode] = useState<Mode>('photo');
  const [result, setResult] = useState<AnalyzeResult | null>(null);

  return (
    <Page>
      <Title>Add food</Title>

      {!result && (
        <>
          <Tabs>
            <Tab $active={mode === 'photo'} onClick={() => setMode('photo')}>
              <CameraIcon /> Photo
            </Tab>
            <Tab $active={mode === 'text'} onClick={() => setMode('text')}>
              <PencilIcon /> Describe
            </Tab>
          </Tabs>
          {mode === 'photo' ? (
            <PhotoForm onResult={setResult} />
          ) : (
            <TextForm onResult={setResult} />
          )}
        </>
      )}

      {result && <ConfirmCard result={result} onBack={() => setResult(null)} />}
    </Page>
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
      form.append('file', file);
      onResult(await api.analyzeImage(form));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed');
    } finally {
      setBusy(false);
    }
  }

  return (
    <FormCard>
      <Dropzone>
        <input
          type="file"
          accept="image/*"
          capture="environment"
          hidden
          onChange={onPick}
        />
        {preview ? (
          <Preview src={preview} alt="preview" />
        ) : (
          <DropHint>
            <DropIcon>
              <CameraIcon size={40} />
            </DropIcon>
            <DropTitle>Tap to take or upload a photo</DropTitle>
            <DropSub>JPG, PNG or WEBP up to 10 MB</DropSub>
          </DropHint>
        )}
      </Dropzone>
      {error && <ErrorText>{error}</ErrorText>}
      <PrimaryButton onClick={analyze} disabled={!file || busy} $fullWidth>
        {busy ? 'Analyzing with AI...' : 'Analyze photo'}
      </PrimaryButton>
    </FormCard>
  );
}

function TextForm({ onResult }: { onResult: (r: AnalyzeResult) => void }) {
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function analyze() {
    if (!text.trim()) return;
    setBusy(true);
    setError(null);
    try {
      onResult(await api.analyzeText(text.trim()));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed');
    } finally {
      setBusy(false);
    }
  }

  return (
    <FormCard>
      <Textarea
        placeholder="e.g. Two scrambled eggs, a slice of whole-wheat toast with butter, and a black coffee"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      {error && <ErrorText>{error}</ErrorText>}
      <PrimaryButton
        onClick={analyze}
        disabled={!text.trim() || busy}
        $fullWidth
      >
        {busy ? 'Analyzing with AI...' : 'Estimate calories'}
      </PrimaryButton>
    </FormCard>
  );
}

function ConfirmCard({
  result,
  onBack,
}: {
  result: AnalyzeResult;
  onBack: () => void;
}) {
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
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save');
      setBusy(false);
    }
  }

  return (
    <FormCard>
      <BadgeRow>
        <Badge>AI estimate</Badge>
        {result.confidence != null && (
          <Confidence>
            {Math.round(result.confidence * 100)}% confidence
          </Confidence>
        )}
      </BadgeRow>

      {img && <ResultImage src={img} alt={form.name} />}

      <Hint>Review and tweak before saving.</Hint>

      <div>
        <FieldLabel>Food</FieldLabel>
        <Input
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
        />
      </div>

      <FieldGrid>
        <Field
          label="Calories (kcal)"
          value={form.calories}
          onChange={num('calories')}
        />
        <Field
          label="Protein (g)"
          value={form.protein}
          onChange={num('protein')}
        />
        <Field label="Carbs (g)" value={form.carbs} onChange={num('carbs')} />
        <Field label="Fat (g)" value={form.fat} onChange={num('fat')} />
      </FieldGrid>

      {error && <ErrorText>{error}</ErrorText>}

      <Actions>
        <BackButton onClick={onBack}>Back</BackButton>
        <SaveButton onClick={save} disabled={busy}>
          {busy ? 'Saving...' : 'Save entry'}
        </SaveButton>
      </Actions>
    </FormCard>
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
      <FieldLabel>{label}</FieldLabel>
      <Input type="number" min={0} value={value} onChange={onChange} />
    </div>
  );
}
