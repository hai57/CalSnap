import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

import type { DailyGoal } from '@shared/types';

import { api } from '../lib/api';
import { useToast } from '../components/Toast';
import { useLang } from '../i18n';
import {
  MutedText as Muted,
  NarrowColumn as Page,
  PageTitle as Title,
  PrimaryButton,
  StackCard as FormCard,
} from '../styles/ui';
import { RowInput, RowLabel, RowWrap } from './StGoals';

const DEFAULTS: DailyGoal = {
  calorie_target: 2000,
  protein_target: 120,
  carb_target: 250,
  fat_target: 70,
};

export function Goals() {
  const qc = useQueryClient();
  const toast = useToast();
  const { t } = useLang();
  const { data, isLoading } = useQuery<DailyGoal | null>({
    queryKey: ['goal'],
    queryFn: () => api.getGoal(),
  });

  const [form, setForm] = useState<DailyGoal>(DEFAULTS);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (data) setForm(data);
  }, [data]);

  const save = useMutation({
    mutationFn: (goal: DailyGoal) => api.setGoal(goal),
    onSuccess: () => {
      setSaved(true);
      qc.invalidateQueries({ queryKey: ['goal'] });
      qc.invalidateQueries({ queryKey: ['summary'] });
      toast.success(t('Goals saved'));
      setTimeout(() => setSaved(false), 2000);
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : t('Could not save goals'));
    },
  });

  function field(key: keyof DailyGoal) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [key]: Number(e.target.value) }));
  }

  return (
    <Page>
      <Title>{t('Daily goals')}</Title>
      <FormCard>
        {isLoading ? (
          <Muted>{t('Loading...')}</Muted>
        ) : (
          <>
            <Row
              label={t('Calorie target (kcal)')}
              value={form.calorie_target}
              onChange={field('calorie_target')}
            />
            <Row
              label={t('Protein target (g)')}
              value={form.protein_target}
              onChange={field('protein_target')}
            />
            <Row
              label={t('Carbs target (g)')}
              value={form.carb_target}
              onChange={field('carb_target')}
            />
            <Row
              label={t('Fat target (g)')}
              value={form.fat_target}
              onChange={field('fat_target')}
            />
            <PrimaryButton
              onClick={() => save.mutate(form)}
              disabled={save.isPending}
              $fullWidth
            >
              {save.isPending
                ? t('Saving...')
                : saved
                  ? t('Saved!')
                  : t('Save goals')}
            </PrimaryButton>
          </>
        )}
      </FormCard>
    </Page>
  );
}

function Row({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <RowWrap>
      <RowLabel>{label}</RowLabel>
      <RowInput type="number" min={0} value={value} onChange={onChange} />
    </RowWrap>
  );
}
