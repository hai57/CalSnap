import {
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import type { DailySummary, FoodEntry } from '@shared/types';

import { MacroBar } from '../components/MacroBar';
import { MacroRing } from '../components/MacroRing';
import { api, resolveImageUrl } from '../lib/api';
import { useLang } from '../i18n';
import { formatDayLabel, todayStr, toDateStr } from '../lib/date';
import { formatTime } from '../lib/date';
import { Card } from '../styles/ui';
import { colors } from '../styles/theme';
import { useHeaderAction } from '../components/LayoutAction';
import { PencilIcon } from '../components/BaseIcons';
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
  ProgressGrid,
  RingCard,
  Row,
  RowCalories,
  RowMain,
  RowMeta,
  RowName,
  RowRight,
  RowUnit,
  SectionTitle,
  StatCard,
  StatColumn,
  Subtitle,
  Thumb,
  ThumbFallback,
  Title,
} from './StDashboard';
import {
  ChartWrap,
  EditGoalsButton,
  GoalStatCard,
  StatValue,
} from './StHistory';

const DEFAULT_GOAL = {
  calorie_target: 2000,
  protein_target: 120,
  carb_target: 250,
  fat_target: 70,
};

const DAYS = 7;

function lastNDays(n: number): string[] {
  const out: string[] = [];
  const now = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    out.push(toDateStr(d));
  }
  return out;
}

export function Dashboard() {
  const day = todayStr();
  const qc = useQueryClient();
  const { t, lang } = useLang();

  useHeaderAction(
    <EditGoalsButton to="/goals">
      <PencilIcon size={16} />
      {t('Edit goals')}
    </EditGoalsButton>,
    [t],
  );

  const { data, isLoading } = useQuery<DailySummary>({
    queryKey: ['summary', day],
    queryFn: () => api.summary(day),
  });

  const del = useMutation({
    mutationFn: (id: number) => api.deleteEntry(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['summary', day] }),
  });

  const days = lastNDays(DAYS);
  const weekResults = useQueries({
    queries: days.map((d) => ({
      queryKey: ['summary', d],
      queryFn: () => api.summary(d),
    })),
  });

  const weekLoading = weekResults.some((r) => r.isLoading);
  const weekSummaries = weekResults
    .map((r) => r.data)
    .filter(Boolean) as DailySummary[];

  const chartData = days.map((d, i) => ({
    day: d,
    label: formatDayLabel(d),
    calories: Math.round(weekResults[i].data?.totals.calories ?? 0),
  }));

  const goal = data?.goal ?? DEFAULT_GOAL;
  const totals = data?.totals ?? { calories: 0, protein: 0, carbs: 0, fat: 0 };

  const weekGoal =
    weekSummaries.find((s) => s.goal)?.goal?.calorie_target ??
    goal.calorie_target;
  const loggedDays = chartData.filter((d) => d.calories > 0);
  const avg =
    loggedDays.length > 0
      ? Math.round(
          loggedDays.reduce((s, d) => s + d.calories, 0) / loggedDays.length,
        )
      : 0;

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
            color={colors.macroProtein}
          />
          <MacroBar
            label={t('Carbs')}
            value={totals.carbs}
            goal={goal.carb_target}
            color={colors.macroCarbs}
          />
          <MacroBar
            label={t('Fat')}
            value={totals.fat}
            goal={goal.fat_target}
            color={colors.macroFat}
          />
        </MacroCard>
      </Grid>

      <ProgressGrid>
        <StatColumn>
          <Stat label={t('Daily average')} value={`${avg} kcal`} />
          <Stat
            label={t('Days logged')}
            value={`${loggedDays.length} / ${DAYS}`}
          />
          <GoalStat
            label={t('Calorie goal')}
            value={`${Math.round(weekGoal)} kcal`}
          />
        </StatColumn>

        <Card>
          <SectionTitle>{t('Last 7 days')}</SectionTitle>
          {weekLoading ? (
            <Muted>{t('Loading...')}</Muted>
          ) : (
            <ChartWrap>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke={colors.slate200}
                  />
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 12, fill: colors.slate500 }}
                    axisLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: colors.slate500 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    cursor={{ fill: colors.brand500, fillOpacity: 0.08 }}
                    contentStyle={{
                      background: colors.white,
                      border: `1px solid ${colors.surfaceBorder}`,
                      borderRadius: '0.625rem',
                      boxShadow: '0 10px 30px -12px rgba(15, 23, 42, 0.35)',
                    }}
                    labelStyle={{ color: colors.slate500 }}
                    itemStyle={{ color: colors.slate900 }}
                    formatter={(v: number) => [`${v} kcal`, t('Calories')]}
                  />
                  <ReferenceLine
                    y={weekGoal}
                    stroke={colors.brand500}
                    strokeDasharray="4 4"
                  />
                  <Bar dataKey="calories" radius={[6, 6, 0, 0]} maxBarSize={56}>
                    {chartData.map((d) => (
                      <Cell
                        key={d.day}
                        fill={
                          d.calories > weekGoal ? colors.red500 : colors.brand500
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartWrap>
          )}
        </Card>
      </ProgressGrid>

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
            <EmptyLink to="/add">
              {t('Snap or describe your first meal')}
            </EmptyLink>
          </EmptyState>
        )}
      </Card>
    </Page>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <StatCard $padding="1rem">
      <Subtitle>{label}</Subtitle>
      <StatValue>{value}</StatValue>
    </StatCard>
  );
}

function GoalStat({ label, value }: { label: string; value: string }) {
  return (
    <GoalStatCard to="/goals" $padding="1rem">
      <Subtitle>{label}</Subtitle>
      <StatValue>{value}</StatValue>
    </GoalStatCard>
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
