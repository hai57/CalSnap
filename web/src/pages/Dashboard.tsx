import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import type { DailySummary, FoodEntry } from '@shared/types';

import { MacroBar } from '../components/MacroBar';
import { MacroRing } from '../components/MacroRing';
import { api, resolveImageUrl } from '../lib/api';
import { useLang } from '../i18n';
import { todayStr } from '../lib/date';
import { formatTime } from '../lib/date';
import { Card } from '../styles/ui';
import {
  DeleteButton,
  EmptyLink,
  EmptyState,
  EmptyText,
  EntryList,
  Grid,
  HeaderRow,
  MacroCard,
  Muted,
  Page,
  RingCard,
  Row,
  RowCalories,
  RowMain,
  RowMeta,
  RowName,
  RowRight,
  RowUnit,
  SectionTitle,
  Subtitle,
  Thumb,
  ThumbFallback,
  Title,
} from './StDashboard';

const DEFAULT_GOAL = {
  calorie_target: 2000,
  protein_target: 120,
  carb_target: 250,
  fat_target: 70,
};

export function Dashboard() {
  const day = todayStr();
  const qc = useQueryClient();
  const { t, lang } = useLang();

  const { data, isLoading } = useQuery<DailySummary>({
    queryKey: ['summary', day],
    queryFn: () => api.summary(day),
  });

  const del = useMutation({
    mutationFn: (id: number) => api.deleteEntry(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['summary', day] }),
  });

  const goal = data?.goal ?? DEFAULT_GOAL;
  const totals = data?.totals ?? { calories: 0, protein: 0, carbs: 0, fat: 0 };

  return (
    <Page>
      <HeaderRow>
        <div>
          <Title>{t('Today')}</Title>
          <Subtitle>
            {new Date().toLocaleDateString(lang === 'vi' ? 'vi-VN' : [], {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
            })}
          </Subtitle>
        </div>
      </HeaderRow>

      <Grid>
        <RingCard>
          <MacroRing consumed={totals.calories} goal={goal.calorie_target} />
        </RingCard>
        <MacroCard>
          <MacroBar
            label={t('Protein')}
            value={totals.protein}
            goal={goal.protein_target}
            color="#3b82f6"
          />
          <MacroBar
            label={t('Carbs')}
            value={totals.carbs}
            goal={goal.carb_target}
            color="#f59e0b"
          />
          <MacroBar
            label={t('Fat')}
            value={totals.fat}
            goal={goal.fat_target}
            color="#ef4444"
          />
        </MacroCard>
      </Grid>

      <Card>
        <SectionTitle>{t('Meals logged today')}</SectionTitle>
        {isLoading ? (
          <Muted>{t('Loading...')}</Muted>
        ) : data && data.entries.length > 0 ? (
          <EntryList>
            {data.entries.map((entry) => (
              <EntryRow
                key={entry.id}
                entry={entry}
                onDelete={() => del.mutate(entry.id)}
              />
            ))}
          </EntryList>
        ) : (
          <EmptyState>
            <EmptyText>{t('No meals logged yet.')}</EmptyText>
            <EmptyLink to="/add">{t('Snap or describe your first meal')}</EmptyLink>
          </EmptyState>
        )}
      </Card>
    </Page>
  );
}

function EntryRow({
  entry,
  onDelete,
}: {
  entry: FoodEntry;
  onDelete: () => void;
}) {
  const { t } = useLang();
  const img = resolveImageUrl(entry.image_url);
  return (
    <Row>
      {img ? (
        <Thumb src={img} alt={entry.name} />
      ) : (
        <ThumbFallback>{entry.source === 'photo' ? '📷' : '🍽️'}</ThumbFallback>
      )}
      <RowMain>
        <RowName>{entry.name}</RowName>
        <RowMeta>
          {formatTime(entry.logged_at)} · P {Math.round(entry.protein)}g · C{' '}
          {Math.round(entry.carbs)}g · F {Math.round(entry.fat)}g
        </RowMeta>
      </RowMain>
      <RowRight>
        <RowCalories>{Math.round(entry.calories)}</RowCalories>
        <RowUnit>kcal</RowUnit>
      </RowRight>
      <DeleteButton onClick={onDelete} aria-label={t('Delete entry')}>
        ✕
      </DeleteButton>
    </Row>
  );
}
