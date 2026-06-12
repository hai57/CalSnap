import Slider from '@react-native-community/slider';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { Pressable, ScrollView, Switch, Text, TextInput, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

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

import { api } from '../api';
import { useAuth } from '../auth';
import { useBot } from '../bot';
import { Card, PrimaryButton } from '../components';
import { LanguageToggle, useLang } from '../i18n';
import { ThemeToggle } from '../themeContext';
import { colors } from '../theme';
import { useToast } from '../toast';
import {
  ActivityIcon,
  AvocadoIcon,
  BalanceIcon,
  DropletIcon,
  DumbbellIcon,
  FlameIcon,
  type IconProps,
  LeafIcon,
  ScaleIcon,
  WheatIcon,
} from '../icons';

const LB_PER_KG = 2.2046226218;
const WATER_OPTIONS = [1500, 2000, 2500, 3000];

type IconComponent = (props: IconProps) => React.ReactElement;

const DIET_ICONS: Record<DietMode, IconComponent> = {
  balanced: BalanceIcon,
  low_carb: WheatIcon,
  low_fat: DropletIcon,
  high_protein: DumbbellIcon,
  keto: AvocadoIcon,
  vegetarian: LeafIcon,
};

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

export function ProfileScreen({ navigation }: { navigation: any }) {
  const { logout } = useAuth();
  const { t } = useLang();
  const { enabled: botEnabled, setEnabled: setBotEnabled } = useBot();
  const [calories, setCalories] = useState(2000);
  const [carbs, setCarbs] = useState(250);
  const [protein, setProtein] = useState(120);
  const [fat, setFat] = useState(70);

  const [weight, setWeight] = useState('70');
  const [weightUnit, setWeightUnit] = useState<WeightUnit>('kg');
  const [dietMode, setDietMode] = useState<DietMode>('balanced');
  const [steps, setSteps] = useState('8000');
  const [waterMl, setWaterMl] = useState(2000);
  const [busy, setBusy] = useState(false);
  const toast = useToast();

  const load = useCallback(async () => {
    const [goal, profile] = await Promise.all([
      api.getGoal().catch(() => null),
      api.getProfile().catch(() => null),
    ]);
    if (goal) {
      setCalories(goal.calorie_target);
      setCarbs(goal.carb_target);
      setProtein(goal.protein_target);
      setFat(goal.fat_target);
    }
    if (profile) {
      setWeightUnit(profile.weight_unit);
      setWeight(
        String(
          profile.weight_unit === 'lb'
            ? round1(profile.weight_kg * LB_PER_KG)
            : round1(profile.weight_kg),
        ),
      );
      setDietMode(profile.diet_mode);
      setSteps(String(profile.steps_target));
      setWaterMl(profile.water_ml);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load]),
  );

  const breakdown = macroBreakdown({ carbs, protein, fat });

  function toggleUnit(unit: WeightUnit) {
    if (unit === weightUnit) return;
    const w = Number(weight) || 0;
    setWeight(
      String(unit === 'lb' ? round1(w * LB_PER_KG) : round1(w / LB_PER_KG)),
    );
    setWeightUnit(unit);
  }

  function pickDiet(mode: DietMode) {
    setDietMode(mode);
    const m = macrosFromCalories(calories, getDietPreset(mode).split);
    setCarbs(m.carbs);
    setProtein(m.protein);
    setFat(m.fat);
  }

  async function save() {
    setBusy(true);
    try {
      const weightKg =
        weightUnit === 'lb'
          ? (Number(weight) || 0) / LB_PER_KG
          : Number(weight) || 0;
      await api.setGoal({
        calorie_target: calories,
        protein_target: protein,
        carb_target: carbs,
        fat_target: fat,
      } satisfies DailyGoal);
      await api.setProfile({
        weight_kg: round1(weightKg),
        weight_unit: weightUnit,
        diet_mode: dietMode,
        steps_target: Number(steps) || 0,
        water_ml: waterMl,
      } satisfies UserProfile);
      toast.success(t('Profile updated'));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("Couldn't save"));
    } finally {
      setBusy(false);
    }
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.bg }}
      contentContainerStyle={{ padding: 16, gap: 16 }}
    >
      {/* Basics */}
      <Card style={{ gap: 4 }}>
        <SectionTitle>{t('Basics')}</SectionTitle>

        <ProfileRow
          first
          icon={<ScaleIcon size={20} color={colors.brandDark} />}
          name={t('Current weight')}
          hint={t('Used for future goal recommendations.')}
        >
          <ValueField value={weight} onChangeText={setWeight} width={66} />
          <Segmented
            options={[
              { key: 'kg', label: 'kg' },
              { key: 'lb', label: 'lb' },
            ]}
            value={weightUnit}
            onChange={(v) => toggleUnit(v as WeightUnit)}
          />
        </ProfileRow>

        <ProfileRow
          icon={<FlameIcon size={20} color={colors.brandDark} />}
          name={t('Daily calorie goal')}
          hint={t('Your target for the dashboard ring.')}
        >
          <ValueField
            value={String(calories)}
            onChangeText={(v) => setCalories(Number(v) || 0)}
            width={66}
          />
          <Unit>{t('kcal / day')}</Unit>
        </ProfileRow>

        <ProfileRow
          icon={<ActivityIcon size={20} color={colors.brandDark} />}
          name={t('Daily step goal')}
          hint={t('A simple activity target for each day.')}
        >
          <ValueField value={steps} onChangeText={setSteps} width={66} />
          <Unit>{t('steps / day')}</Unit>
        </ProfileRow>
      </Card>

      {/* Macros */}
      <Card style={{ gap: 14 }}>
        <SectionTitle>{t('Macros')}</SectionTitle>
        <Hint>
          {t('Fine-tune grams per macro. The ring shows your energy split.')}
        </Hint>
        <View style={{ alignItems: 'center' }}>
          <MacroDonut
            carbsKcal={breakdown.carbsKcal}
            proteinKcal={breakdown.proteinKcal}
            fatKcal={breakdown.fatKcal}
            total={breakdown.totalKcal}
          />
        </View>
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
      </Card>

      {/* Diet */}
      <Card style={{ gap: 10 }}>
        <SectionTitle>{t('Diet')}</SectionTitle>
        <Hint>
          {t('Picking a diet recalculates your macros from your calorie goal.')}
        </Hint>
        {DIET_PRESETS.map((preset) => {
          const active = preset.mode === dietMode;
          const Icon = DIET_ICONS[preset.mode];
          return (
            <Pressable
              key={preset.mode}
              onPress={() => pickDiet(preset.mode)}
              style={{
                borderWidth: 1,
                borderColor: active ? colors.brand : colors.border,
                backgroundColor: active ? colors.brandLight : colors.card,
                borderRadius: 14,
                padding: 12,
                gap: 6,
              }}
            >
              <View
                style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}
              >
                <Chip
                  bg={active ? colors.brandLight : colors.chipBg}
                  size={32}
                  radius={10}
                >
                  <Icon
                    size={18}
                    color={active ? colors.brandDark : colors.muted}
                  />
                </Chip>
                <Text
                  style={{
                    fontWeight: '700',
                    fontSize: 15,
                    color: active ? colors.brandDark : colors.text,
                  }}
                >
                  {t(preset.label)}
                </Text>
              </View>
              <Text
                style={{ fontSize: 12, lineHeight: 17, color: colors.muted }}
              >
                {t(preset.description)}
              </Text>
            </Pressable>
          );
        })}
      </Card>

      {/* Water */}
      <Card style={{ gap: 12 }}>
        <SectionTitle>{t('Water')}</SectionTitle>
        <View style={{ alignItems: 'center', gap: 2 }}>
          <Chip bg={colors.blueSoft} size={44} radius={14}>
            <DropletIcon size={24} color={colors.blue} />
          </Chip>
          <Text
            style={{
              fontSize: 40,
              fontWeight: '800',
              color: colors.blue,
              marginTop: 6,
            }}
          >
            {waterMl}
          </Text>
          <Text style={{ fontSize: 12, color: colors.muted }}>{t('ml per day')}</Text>
        </View>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {WATER_OPTIONS.map((ml) => {
            const active = waterMl === ml;
            return (
              <Pressable
                key={ml}
                onPress={() => setWaterMl(ml)}
                style={{
                  flex: 1,
                  borderWidth: 1,
                  borderColor: active ? colors.blue : colors.border,
                  backgroundColor: active ? colors.blueSoft : colors.card,
                  borderRadius: 12,
                  paddingVertical: 12,
                  alignItems: 'center',
                }}
              >
                <Text
                  style={{
                    fontWeight: '700',
                    color: active ? colors.blueDark : colors.muted,
                  }}
                >
                  {(ml / 1000).toFixed(1)} L
                </Text>
              </Pressable>
            );
          })}
        </View>
      </Card>

      {/* Appearance */}
      <Card style={{ gap: 16 }}>
        <SectionTitle>{t('Appearance')}</SectionTitle>
        <AppearanceRow name={t('Language')} hint={t('English or Vietnamese.')}>
          <LanguageToggle />
        </AppearanceRow>
        <AppearanceRow name={t('Display mode')} hint={t('System, light or dark.')}>
          <ThemeToggle />
        </AppearanceRow>
        <AppearanceRow
          name={t('NutriBot assistant')}
          hint={t('Show the floating helper bot.')}
        >
          <Switch
            value={botEnabled}
            onValueChange={setBotEnabled}
            trackColor={{ false: colors.border, true: colors.brand }}
            thumbColor="#ffffff"
          />
        </AppearanceRow>
      </Card>

      <PrimaryButton title={t('Save profile')} onPress={save} loading={busy} />

      {/* Account */}
      <Card style={{ gap: 10 }}>
        <SectionTitle>{t('Account')}</SectionTitle>
        <Pressable
          onPress={() => navigation.navigate('Goals')}
          style={({ pressed }) => ({
            borderWidth: 1,
            borderColor: colors.border,
            backgroundColor: pressed ? colors.chipBg : colors.card,
            borderRadius: 12,
            paddingVertical: 14,
            alignItems: 'center',
          })}
        >
          <Text style={{ fontWeight: '700', fontSize: 15, color: colors.text }}>
            {t('Edit goals')}
          </Text>
        </Pressable>
        <Pressable
          onPress={() => logout()}
          style={({ pressed }) => ({
            borderWidth: 1,
            borderColor: colors.dangerBorder,
            backgroundColor: pressed ? colors.dangerBorder : colors.dangerSoft,
            borderRadius: 12,
            paddingVertical: 14,
            alignItems: 'center',
          })}
        >
          <Text
            style={{ fontWeight: '700', fontSize: 15, color: colors.danger }}
          >
            {t('Log out')}
          </Text>
        </Pressable>
      </Card>
    </ScrollView>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <Text style={{ fontSize: 16, fontWeight: '700', color: colors.text }}>
      {children}
    </Text>
  );
}

function Hint({ children }: { children: React.ReactNode }) {
  return (
    <Text style={{ fontSize: 13, lineHeight: 18, color: colors.muted }}>
      {children}
    </Text>
  );
}

function AppearanceRow({
  name,
  hint,
  children,
}: {
  name: string;
  hint: string;
  children: React.ReactNode;
}) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
      }}
    >
      <View style={{ flexShrink: 1 }}>
        <Text style={{ fontWeight: '600', fontSize: 15, color: colors.text }}>
          {name}
        </Text>
        <Text style={{ fontSize: 12, color: colors.muted }}>{hint}</Text>
      </View>
      {children}
    </View>
  );
}

function Chip({
  bg,
  size = 40,
  radius = 12,
  children,
}: {
  bg: string;
  size?: number;
  radius?: number;
  children: React.ReactNode;
}) {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        backgroundColor: bg,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {children}
    </View>
  );
}

function ProfileRow({
  icon,
  name,
  hint,
  first,
  children,
}: {
  icon: React.ReactNode;
  name: string;
  hint: string;
  first?: boolean;
  children: React.ReactNode;
}) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        paddingVertical: 14,
        borderTopWidth: first ? 0 : 1,
        borderTopColor: colors.border,
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12,
          flexShrink: 1,
        }}
      >
        <Chip bg={colors.brandLight}>{icon}</Chip>
        <View style={{ flexShrink: 1 }}>
          <Text style={{ fontWeight: '600', fontSize: 15, color: colors.text }}>
            {name}
          </Text>
          <Text style={{ fontSize: 12, color: colors.muted }}>{hint}</Text>
        </View>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        {children}
      </View>
    </View>
  );
}

function ValueField({
  value,
  onChangeText,
  width = 66,
}: {
  value: string;
  onChangeText: (v: string) => void;
  width?: number;
}) {
  return (
    <View
      style={{
        width,
        height: 42,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 12,
        paddingHorizontal: 10,
        justifyContent: 'center',
        backgroundColor: colors.card,
      }}
    >
      <TextInput
        value={value}
        onChangeText={onChangeText}
        keyboardType="numeric"
        style={{
          textAlign: 'right',
          fontWeight: '700',
          fontSize: 16,
          color: colors.text,
          padding: 0,
        }}
      />
    </View>
  );
}

function Unit({ children }: { children: React.ReactNode }) {
  return (
    <Text style={{ width: 72, fontSize: 13, color: colors.muted }}>
      {children}
    </Text>
  );
}

function Segmented({
  options,
  value,
  onChange,
}: {
  options: { key: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <View
      style={{
        flexDirection: 'row',
        width: 72,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 10,
        overflow: 'hidden',
      }}
    >
      {options.map((o) => {
        const active = o.key === value;
        return (
          <Pressable
            key={o.key}
            onPress={() => onChange(o.key)}
            style={{
              flex: 1,
              paddingVertical: 9,
              alignItems: 'center',
              backgroundColor: active ? colors.brand : colors.card,
            }}
          >
            <Text
              style={{
                fontWeight: '700',
                fontSize: 13,
                color: active ? '#fff' : colors.muted,
              }}
            >
              {o.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function MacroSlider({
  label,
  color,
  grams,
  pct,
  max,
  onChange,
}: {
  label: string;
  color: string;
  grams: number;
  pct: number;
  max: number;
  onChange: (v: number) => void;
}) {
  return (
    <View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={{ fontWeight: '700', color }}>{label}</Text>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <Text style={{ fontWeight: '700', color: colors.text }}>
            {grams} g
          </Text>
          <Text style={{ color: colors.muted }}>{pct}%</Text>
        </View>
      </View>
      <Slider
        minimumValue={0}
        maximumValue={max}
        step={5}
        value={grams}
        onValueChange={(v) => onChange(Math.round(v))}
        minimumTrackTintColor={color}
        maximumTrackTintColor={colors.border}
        thumbTintColor={color}
      />
    </View>
  );
}

function MacroDonut({
  carbsKcal,
  proteinKcal,
  fatKcal,
  total,
}: {
  carbsKcal: number;
  proteinKcal: number;
  fatKcal: number;
  total: number;
}) {
  const size = 160;
  const stroke = 22;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const segments = [
    { value: carbsKcal, color: MACRO_COLORS.carbs },
    { value: proteinKcal, color: MACRO_COLORS.protein },
    { value: fatKcal, color: MACRO_COLORS.fat },
  ];

  let offset = 0;
  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={colors.border}
          strokeWidth={stroke}
          fill="none"
        />
        {total > 0 &&
          segments.map((s, i) => {
            const len = (s.value / total) * c;
            const circle = (
              <Circle
                key={i}
                cx={size / 2}
                cy={size / 2}
                r={r}
                stroke={s.color}
                strokeWidth={stroke}
                fill="none"
                strokeDasharray={`${len} ${c - len}`}
                strokeDashoffset={-offset}
                strokeLinecap="butt"
                transform={`rotate(-90 ${size / 2} ${size / 2})`}
              />
            );
            offset += len;
            return circle;
          })}
      </Svg>
      <View
        style={{
          position: 'absolute',
          width: size,
          height: size,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text style={{ fontSize: 22, fontWeight: '800', color: colors.text }}>
          {Math.round(total)}
        </Text>
        <Text style={{ fontSize: 11, color: colors.muted }}>macro kcal</Text>
      </View>
    </View>
  );
}
