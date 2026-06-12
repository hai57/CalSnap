import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import type { AnalyzeResult } from '@shared/types';

import { api, resolveImageUrl } from '../lib/api';
import { CameraIcon, PencilIcon } from '../components/BaseIcons';
import { useToast } from '../components/Toast';
import { useLang } from '../i18n';
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
  const { t } = useLang();
  const [mode, setMode] = useState<Mode>('photo');
  const [result, setResult] = useState<AnalyzeResult | null>(null);

  return (
    <Page>
      <Title>{t('Add food')}</Title>

      {!result && (
        <>
          <Tabs>
            <Tab $active={mode === 'photo'} onClick={() => setMode('photo')}>
              <CameraIcon /> {t('Photo')}
            </Tab>
            <Tab $active={mode === 'text'} onClick={() => setMode('text')}>
              <PencilIcon /> {t('Describe')}
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
  const { t } = useLang();
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
      setError(err instanceof Error ? err.message : t('Analysis failed'));
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
            <DropTitle>{t('Tap to take or upload a photo')}</DropTitle>
            <DropSub>{t('JPG, PNG or WEBP up to 10 MB')}</DropSub>
          </DropHint>
        )}
      </Dropzone>
      {error && <ErrorText>{error}</ErrorText>}
      <PrimaryButton onClick={analyze} disabled={!file || busy} $fullWidth>
        {busy ? t('Analyzing with AI...') : t('Analyze photo')}
      </PrimaryButton>
    </FormCard>
  );
}

function TextForm({ onResult }: { onResult: (r: AnalyzeResult) => void }) {
  const { t } = useLang();
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
      setError(err instanceof Error ? err.message : t('Analysis failed'));
    } finally {
      setBusy(false);
    }
  }

  return (
    <FormCard>
      <Textarea
        placeholder={t(
          'e.g. Two scrambled eggs, a slice of whole-wheat toast with butter, and a black coffee',
        )}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      {error && <ErrorText>{error}</ErrorText>}
      <PrimaryButton
        onClick={analyze}
        disabled={!text.trim() || busy}
        $fullWidth
      >
        {busy ? t('Analyzing with AI...') : t('Estimate calories')}
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
  const toast = useToast();
  const { t } = useLang();
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
      toast.success(t('{name} added', { name: form.name }));
      navigate('/');
    } catch (err) {
      const msg = err instanceof Error ? err.message : t('Could not save');
      setError(msg);
      toast.error(msg);
      setBusy(false);
    }
  }

  return (
    <FormCard>
      <BadgeRow>
        <Badge>{t('AI estimate')}</Badge>
        {result.confidence != null && (
          <Confidence>
            {t('{pct}% confidence', {
              pct: Math.round(result.confidence * 100),
            })}
          </Confidence>
        )}
      </BadgeRow>

      {img && <ResultImage src={img} alt={form.name} />}

      <Hint>{t('Review and tweak before saving.')}</Hint>

      <div>
        <FieldLabel>{t('Food')}</FieldLabel>
        <Input
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
        />
      </div>

      <FieldGrid>
        <Field
          label={t('Calories (kcal)')}
          value={form.calories}
          onChange={num('calories')}
        />
        <Field
          label={t('Protein (g)')}
          value={form.protein}
          onChange={num('protein')}
        />
        <Field
          label={t('Carbs (g)')}
          value={form.carbs}
          onChange={num('carbs')}
        />
        <Field label={t('Fat (g)')} value={form.fat} onChange={num('fat')} />
      </FieldGrid>

      {error && <ErrorText>{error}</ErrorText>}

      <Actions>
        <BackButton onClick={onBack}>{t('Back')}</BackButton>
        <SaveButton onClick={save} disabled={busy}>
          {busy ? t('Saving...') : t('Save entry')}
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
