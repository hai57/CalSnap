import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';

import type {
  DailyGoal,
  DietMode,
  UserProfile,
  WeightUnit,
} from '@shared/types';
import {
  DIET_PRESETS,
  MACRO_COLORS,
  getDietPreset,
  macroBreakdown,
  macrosFromCalories,
} from '@shared/nutrition';

import { api } from '../lib/api';
import { useBot } from '../bot/BotContext';
import { useLang, LanguageToggle } from '../i18n';
import { NavLayoutToggle } from '../layout/NavLayoutContext';
import { useToast } from '../components/Toast';
import { ThemeToggle } from '../components/ThemeToggle';
import { useHeaderAction } from '@src/components/LayoutAction';
import {
  ActivityIcon,
  AvocadoIcon,
  BalanceIcon,
  CheckIcon,
  DropletIcon,
  DumbbellIcon,
  FlameIcon,
  LeafIcon,
  ScaleIcon,
  WheatIcon,
} from '../components/BaseIcons';
import type { SVGProps } from 'react';
import {
  AnimatedCard,
  AppearanceRow,
  Switch,
  DietDesc,
  DietGrid,
  DietHead,
  DietIcon,
  DietName,
  DietOption,
  ErrorState,
  Field,
  FieldInput,
  FieldSuffix,
  HeaderSaveButton,
  IconChip,
  MacroList,
  NutritionLayout,
  Page,
  PieCenter,
  PieLabel,
  PieTotal,
  PieWrap,
  ProfileList,
  ProfileRow,
  RetryButton,
  RowControl,
  RowHint,
  RowLabel,
  RowMain,
  RowName,
  SectionHint,
  SectionTitle,
  Segment,
  Segments,
  SkeletonLine,
  SkeletonRowBlock,
  Title,
  WaterBig,
  WaterIcon,
  WaterMl,
  WaterOption,
  WaterOptions,
  WaterUnit,
} from './StProfile';
import { MacroSlider } from '../components/profile/MarcoSlider';

const LB_PER_KG = 2.2046226218;
const WATER_OPTIONS = [1500, 2000, 2500, 3000];

type IconComponent = (
  props: SVGProps<SVGSVGElement> & { size?: number },
) => JSX.Element;

const DIET_ICONS: Record<DietMode, IconComponent> = {
  balanced: BalanceIcon,
  low_carb: WheatIcon,
  low_fat: DropletIcon,
  high_protein: DumbbellIcon,
  keto: AvocadoIcon,
  vegetarian: LeafIcon,
};

const DEFAULT_GOAL: DailyGoal = {
  calorie_target: 2000,
  protein_target: 120,
  carb_target: 250,
  fat_target: 70,
};

const DEFAULT_PROFILE: UserProfile = {
  weight_kg: 70,
  weight_unit: 'kg',
  diet_mode: 'balanced',
  steps_target: 8000,
  water_ml: 2000,
};

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

export function Profile() {
  const qc = useQueryClient();
  const toast = useToast();
  const { t } = useLang();
  const { enabled: botEnabled, setEnabled: setBotEnabled } = useBot();
  const goalQuery = useQuery<DailyGoal | null>({
    queryKey: ['goal'],
    queryFn: () => api.getGoal(),
  });
  const profileQuery = useQuery<UserProfile>({
    queryKey: ['profile'],
    queryFn: () => api.getProfile(),
  });

  const [calories, setCalories] = useState(DEFAULT_GOAL.calorie_target);
  const [carbs, setCarbs] = useState(DEFAULT_GOAL.carb_target);
  const [protein, setProtein] = useState(DEFAULT_GOAL.protein_target);
  const [fat, setFat] = useState(DEFAULT_GOAL.fat_target);

  const [weight, setWeight] = useState(DEFAULT_PROFILE.weight_kg);
  const [weightUnit, setWeightUnit] = useState<WeightUnit>('kg');
  const [dietMode, setDietMode] = useState<DietMode>('balanced');
  const [steps, setSteps] = useState(DEFAULT_PROFILE.steps_target);
  const [waterMl, setWaterMl] = useState(DEFAULT_PROFILE.water_ml);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const g = goalQuery.data;
    if (g) {
      setCalories(g.calorie_target);
      setCarbs(g.carb_target);
      setProtein(g.protein_target);
      setFat(g.fat_target);
    }
  }, [goalQuery.data]);

  useEffect(() => {
    const s = profileQuery.data;
    if (s) {
      setWeightUnit(s.weight_unit);
      setWeight(
        s.weight_unit === 'lb'
          ? round1(s.weight_kg * LB_PER_KG)
          : round1(s.weight_kg),
      );
      setDietMode(s.diet_mode);
      setSteps(s.steps_target);
      setWaterMl(s.water_ml);
    }
  }, [profileQuery.data]);

  const breakdown = macroBreakdown({ carbs, protein, fat });
  const pieData = [
    {
      key: 'carbs',
      name: t('Carbs'),
      value: breakdown.carbsKcal,
      color: MACRO_COLORS.carbs,
    },
    {
      key: 'protein',
      name: t('Protein'),
      value: breakdown.proteinKcal,
      color: MACRO_COLORS.protein,
    },
    {
      key: 'fat',
      name: t('Fat'),
      value: breakdown.fatKcal,
      color: MACRO_COLORS.fat,
    },
  ];

  function toggleUnit(unit: WeightUnit) {
    if (unit === weightUnit) return;
    setWeight((w: number) =>
      unit === 'lb' ? round1(w * LB_PER_KG) : round1(w / LB_PER_KG),
    );
    setWeightUnit(unit);
  }

  function pickDiet(mode: DietMode) {
    setDietMode(mode);
    const preset = getDietPreset(mode);
    const m = macrosFromCalories(calories, preset.split);
    setCarbs(m.carbs);
    setProtein(m.protein);
    setFat(m.fat);
  }

  const save = useMutation({
    mutationFn: async () => {
      const weightKg = weightUnit === 'lb' ? weight / LB_PER_KG : weight;
      await api.setGoal({
        calorie_target: calories,
        protein_target: protein,
        carb_target: carbs,
        fat_target: fat,
      });
      await api.setProfile({
        weight_kg: round1(weightKg),
        weight_unit: weightUnit,
        diet_mode: dietMode,
        steps_target: steps,
        water_ml: waterMl,
      });
    },
    onSuccess: () => {
      setSaved(true);
      qc.invalidateQueries({ queryKey: ['goal'] });
      qc.invalidateQueries({ queryKey: ['profile'] });
      qc.invalidateQueries({ queryKey: ['summary'] });
      toast.success(t('Profile saved'));
      setTimeout(() => setSaved(false), 2000);
    },
    onError: (err) => {
      toast.error(
        err instanceof Error ? err.message : t('Could not save profile'),
      );
    },
  });

  const loading = goalQuery.isLoading || profileQuery.isLoading;
  const error = goalQuery.isError || profileQuery.isError;

  useHeaderAction(
    <HeaderSaveButton
      onClick={() => save.mutate()}
      disabled={save.isPending || loading || error}
    >
      <CheckIcon size={16} />
      {save.isPending ? t('Saving...') : saved ? t('Saved') : t('Save')}
    </HeaderSaveButton>,
    [save.isPending, saved, loading, error, t],
  );

  if (loading) {
    return (
      <Page>
        <Title>{t('Profile')}</Title>
        <ProfileSkeleton />
      </Page>
    );
  }

  if (error) {
    return (
      <Page>
        <Title>{t('Profile')}</Title>
        <AnimatedCard>
          <ErrorState>
            <p>{t('We could not load your profile.')}</p>
            <RetryButton
              onClick={() => {
                goalQuery.refetch();
                profileQuery.refetch();
              }}
            >
              {t('Try again')}
            </RetryButton>
          </ErrorState>
        </AnimatedCard>
      </Page>
    );
  }

  return (
    <Page>
      <Title>{t('Profile')}</Title>

      {/* Basics: weight, calories, steps */}
      <AnimatedCard>
        <SectionTitle>{t('Basics')}</SectionTitle>
        <ProfileList>
          <ProfileRow>
            <RowMain>
              <IconChip>
                <ScaleIcon size={20} />
              </IconChip>
              <RowLabel>
                <RowName>{t('Goal weight')}</RowName>
                <RowHint>{t('Used for future goal recommendations.')}</RowHint>
              </RowLabel>
            </RowMain>
            <RowControl>
              <Field>
                <FieldInput
                  type="number"
                  min={0}
                  step="0.1"
                  value={weight}
                  onChange={(e) => setWeight(Number(e.target.value))}
                />
              </Field>
              <Segments>
                <Segment
                  $active={weightUnit === 'kg'}
                  onClick={() => toggleUnit('kg')}
                >
                  kg
                </Segment>
                <Segment
                  $active={weightUnit === 'lb'}
                  onClick={() => toggleUnit('lb')}
                >
                  lb
                </Segment>
              </Segments>
            </RowControl>
          </ProfileRow>

          <ProfileRow>
            <RowMain>
              <IconChip>
                <FlameIcon size={20} />
              </IconChip>
              <RowLabel>
                <RowName>{t('Daily calorie goal')}</RowName>
                <RowHint>{t('Your target for the dashboard ring.')}</RowHint>
              </RowLabel>
            </RowMain>
            <RowControl>
              <Field>
                <FieldInput
                  type="number"
                  min={0}
                  step="10"
                  value={calories}
                  onChange={(e) => setCalories(Number(e.target.value))}
                />
              </Field>
              <FieldSuffix>{t('kcal / day')}</FieldSuffix>
            </RowControl>
          </ProfileRow>

          <ProfileRow>
            <RowMain>
              <IconChip>
                <ActivityIcon size={20} />
              </IconChip>
              <RowLabel>
                <RowName>{t('Daily step goal')}</RowName>
                <RowHint>{t('A simple activity target for each day.')}</RowHint>
              </RowLabel>
            </RowMain>
            <RowControl>
              <Field>
                <FieldInput
                  type="number"
                  min={0}
                  step="500"
                  value={steps}
                  onChange={(e) => setSteps(Number(e.target.value))}
                />
              </Field>
              <FieldSuffix>{t('steps / day')}</FieldSuffix>
            </RowControl>
          </ProfileRow>
        </ProfileList>
      </AnimatedCard>

      {/* Macros */}
      <AnimatedCard $delay={60}>
        <SectionTitle>{t('Macros')}</SectionTitle>
        <SectionHint>
          {t('Fine-tune grams per macro. The ring shows your energy split.')}
        </SectionHint>
        <NutritionLayout>
          <MacroList>
            <MacroSlider
              label={t('Carbs')}
              color={MACRO_COLORS.carbs}
              grams={carbs}
              pct={breakdown.carbsPct}
              max={500}
              onChange={setCarbs}
            />
            <MacroSlider
              label={t('Protein')}
              color={MACRO_COLORS.protein}
              grams={protein}
              pct={breakdown.proteinPct}
              max={300}
              onChange={setProtein}
            />
            <MacroSlider
              label={t('Fat')}
              color={MACRO_COLORS.fat}
              grams={fat}
              pct={breakdown.fatPct}
              max={200}
              onChange={setFat}
            />
          </MacroList>

          <PieWrap>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={2}
                  stroke="none"
                >
                  {pieData.map((d) => (
                    <Cell key={d.key} fill={d.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <PieCenter>
              <PieTotal>{Math.round(breakdown.totalKcal)}</PieTotal>
              <PieLabel>{t('macro kcal')}</PieLabel>
            </PieCenter>
          </PieWrap>
        </NutritionLayout>
      </AnimatedCard>

      {/* Diet */}
      <AnimatedCard $delay={120}>
        <SectionTitle>{t('Diet')}</SectionTitle>
        <SectionHint>
          {t('Picking a diet recalculates your macros from your calorie goal.')}
        </SectionHint>
        <DietGrid>
          {DIET_PRESETS.map((preset) => {
            const active = preset.mode === dietMode;
            const Icon = DIET_ICONS[preset.mode];
            return (
              <DietOption
                key={preset.mode}
                $active={active}
                onClick={() => pickDiet(preset.mode)}
              >
                <DietHead>
                  <DietIcon $active={active}>
                    <Icon size={18} />
                  </DietIcon>
                  <DietName $active={active}>{t(preset.label)}</DietName>
                </DietHead>
                <DietDesc>{t(preset.description)}</DietDesc>
              </DietOption>
            );
          })}
        </DietGrid>
      </AnimatedCard>

      {/* Water */}
      <AnimatedCard $delay={180}>
        <SectionTitle>{t('Water')}</SectionTitle>
        <WaterBig>
          <WaterIcon>
            <DropletIcon size={24} />
          </WaterIcon>
          <WaterMl>{waterMl}</WaterMl>
          <WaterUnit>{t('ml per day')}</WaterUnit>
        </WaterBig>
        <WaterOptions>
          {WATER_OPTIONS.map((ml) => (
            <WaterOption
              key={ml}
              $active={waterMl === ml}
              onClick={() => setWaterMl(ml)}
            >
              {(ml / 1000).toFixed(1)} L
            </WaterOption>
          ))}
        </WaterOptions>
      </AnimatedCard>

      {/* Appearance */}
      <AnimatedCard $delay={240}>
        <SectionTitle>{t('Appearance')}</SectionTitle>
        <AppearanceRow>
          <RowLabel>
            <RowName>{t('Language')}</RowName>
            <RowHint>{t('English or Vietnamese.')}</RowHint>
          </RowLabel>
          <LanguageToggle />
        </AppearanceRow>
        <AppearanceRow>
          <RowLabel>
            <RowName>{t('Display mode')}</RowName>
            <RowHint>{t('System, light or dark.')}</RowHint>
          </RowLabel>
          <ThemeToggle />
        </AppearanceRow>
        <AppearanceRow>
          <RowLabel>
            <RowName>{t('Navigation')}</RowName>
            <RowHint>{t('Top bar or side bar.')}</RowHint>
          </RowLabel>
          <NavLayoutToggle />
        </AppearanceRow>
        <AppearanceRow>
          <RowLabel>
            <RowName>{t('NutriBot assistant')}</RowName>
            <RowHint>{t('Show the floating helper bot.')}</RowHint>
          </RowLabel>
          <Switch
            type="button"
            role="switch"
            aria-checked={botEnabled}
            aria-label={t('Show the floating helper bot.')}
            $on={botEnabled}
            onClick={() => setBotEnabled(!botEnabled)}
          />
        </AppearanceRow>
      </AnimatedCard>
    </Page>
  );
}

function ProfileSkeleton() {
  return (
    <>
      <AnimatedCard>
        <SkeletonLine $w="30%" $h="1.125rem" />
        <ProfileList>
          {[0, 1, 2].map((i) => (
            <SkeletonRowBlock key={i}>
              <SkeletonLine $w="40%" />
              <SkeletonLine $w="6.5rem" $h="2.25rem" />
            </SkeletonRowBlock>
          ))}
        </ProfileList>
      </AnimatedCard>
      <AnimatedCard $delay={60}>
        <SkeletonLine $w="25%" $h="1.125rem" />
        <SkeletonLine $w="60%" />
        <SkeletonLine $w="100%" $h="0.5rem" />
        <SkeletonLine $w="100%" $h="0.5rem" />
        <SkeletonLine $w="100%" $h="0.5rem" />
      </AnimatedCard>
    </>
  );
}
