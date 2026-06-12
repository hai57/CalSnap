import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { Pressable, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { colors } from './theme';

export type Lang = 'en' | 'vi';

const STORAGE_KEY = 'nutrilens_lang';

// English source string -> Vietnamese. Missing keys fall back to the source.
const VI: Record<string, string> = {
  // tabs / headers / nav
  Today: 'Hôm nay',
  Progress: 'Tiến độ',
  Profile: 'Hồ sơ',
  'Add food': 'Thêm món',
  'Daily goals': 'Mục tiêu hàng ngày',
  '+ Add food': '+ Thêm món',

  // dashboard
  'Calories today': 'Calo hôm nay',
  '{remaining} kcal left of {goal}': 'Còn {remaining} kcal trên {goal}',
  Protein: 'Đạm',
  Carbs: 'Tinh bột',
  Fat: 'Chất béo',
  'Meals today': 'Bữa ăn hôm nay',
  'Log out': 'Đăng xuất',
  'No meals yet. Tap "+ Add food" to log your first meal.':
    'Chưa có bữa nào. Bấm "+ Thêm món" để ghi bữa đầu tiên.',
  'Delete entry': 'Xoá mục',
  'Remove "{name}"?': 'Xoá "{name}"?',
  Cancel: 'Huỷ',
  Delete: 'Xoá',

  // add food
  '📷 Photo': '📷 Ảnh',
  '✍️ Describe': '✍️ Mô tả',
  'Permission needed': 'Cần quyền truy cập',
  'Please allow access to continue.': 'Vui lòng cho phép truy cập để tiếp tục.',
  'Analysis failed': 'Phân tích thất bại',
  'No photo selected': 'Chưa chọn ảnh',
  Camera: 'Máy ảnh',
  Library: 'Thư viện',
  'Analyze photo': 'Phân tích ảnh',
  'Describe your meal': 'Mô tả bữa ăn của bạn',
  'e.g. Grilled chicken breast with rice and steamed broccoli':
    'vd: Ức gà nướng với cơm và bông cải hấp',
  'Estimate calories': 'Ước tính calo',
  'AI estimate': 'Ước tính bằng AI',
  '{pct}% confidence': '{pct}% độ tin cậy',
  Food: 'Món ăn',
  Calories: 'Calo',
  'Protein (g)': 'Đạm (g)',
  'Carbs (g)': 'Tinh bột (g)',
  'Fat (g)': 'Chất béo (g)',
  Back: 'Quay lại',
  'Save entry': 'Lưu mục',
  '{name} added': 'Đã thêm {name}',
  'Could not save': 'Không thể lưu',

  // history
  'Edit goals': 'Sửa mục tiêu',
  'Avg / day': 'TB / ngày',
  'Days logged': 'Số ngày đã ghi',
  Goal: 'Mục tiêu',
  'Last 7 days': '7 ngày gần đây',

  // goals
  'Daily targets': 'Mục tiêu hằng ngày',
  'Calories (kcal)': 'Calo (kcal)',
  'Save goals': 'Lưu mục tiêu',
  'Daily goals updated': 'Đã cập nhật mục tiêu',

  // login / register
  'Log in to track your calories': 'Đăng nhập để theo dõi calo',
  Email: 'Email',
  Password: 'Mật khẩu',
  'Log in': 'Đăng nhập',
  'No account?': 'Chưa có tài khoản?',
  'Sign up': 'Đăng ký',
  'Login failed': 'Đăng nhập thất bại',
  'Create account': 'Tạo tài khoản',
  'Start tracking with AI in seconds':
    'Bắt đầu theo dõi bằng AI trong vài giây',
  'At least 6 characters': 'Ít nhất 6 ký tự',
  'Password must be at least 6 characters':
    'Mật khẩu phải có ít nhất 6 ký tự',
  'Registration failed': 'Đăng ký thất bại',
  'Already have an account?': 'Đã có tài khoản?',

  // profile
  Basics: 'Cơ bản',
  'Current weight': 'Cân nặng hiện tại',
  'Used for future goal recommendations.': 'Dùng cho gợi ý mục tiêu sau này.',
  'Daily calorie goal': 'Mục tiêu calo mỗi ngày',
  'Your target for the dashboard ring.': 'Mục tiêu cho vòng tròn tổng quan.',
  'kcal / day': 'kcal / ngày',
  'Daily step goal': 'Mục tiêu số bước mỗi ngày',
  'A simple activity target for each day.':
    'Mục tiêu vận động đơn giản mỗi ngày.',
  'steps / day': 'bước / ngày',
  Macros: 'Macro',
  'Fine-tune grams per macro. The ring shows your energy split.':
    'Tinh chỉnh gam mỗi nhóm. Vòng tròn thể hiện tỉ lệ năng lượng.',
  'macro kcal': 'kcal macro',
  Diet: 'Chế độ ăn',
  'Picking a diet recalculates your macros from your calorie goal.':
    'Chọn chế độ ăn sẽ tính lại macro từ mục tiêu calo của bạn.',
  Water: 'Nước',
  'ml per day': 'ml mỗi ngày',
  Appearance: 'Giao diện',
  Language: 'Ngôn ngữ',
  'English or Vietnamese.': 'Tiếng Anh hoặc Tiếng Việt.',
  'Display mode': 'Chế độ hiển thị',
  'System, light or dark.': 'Theo hệ thống, sáng hoặc tối.',
  'NutriBot assistant': 'Trợ lý NutriBot',
  'Show the floating helper bot.': 'Hiện con bot trợ lý nổi.',
  'Save profile': 'Lưu hồ sơ',
  'Profile updated': 'Đã cập nhật hồ sơ',
  "Couldn't save": 'Không thể lưu',
  Account: 'Tài khoản',

  // diet presets
  Balanced: 'Cân bằng',
  'Even macro split, great for everyday maintenance.':
    'Tỉ lệ macro đều, hợp duy trì hằng ngày.',
  'Low carb': 'Ít tinh bột',
  'Fewer carbs, more protein and fat for weight control.':
    'Ít tinh bột, nhiều đạm và chất béo để kiểm soát cân nặng.',
  'Low fat': 'Ít béo',
  'Limit fat, favor carbs and protein.':
    'Hạn chế chất béo, ưu tiên tinh bột và đạm.',
  'High protein': 'Giàu đạm',
  'More protein to build and keep muscle.': 'Nhiều đạm để xây và giữ cơ.',
  Keto: 'Keto',
  'Very low carb, high fat to burn fat for fuel.':
    'Rất ít tinh bột, nhiều chất béo để đốt mỡ.',
  Vegetarian: 'Ăn chay',
  'Plant-based, balanced carbs and plant protein.':
    'Từ thực vật, cân bằng tinh bột và đạm thực vật.',

  // NutriBot
  'How many calories left?': 'Còn bao nhiêu calo?',
  'Enough protein yet?': 'Đủ protein chưa?',
  'Suggest my next meal?': 'Gợi ý bữa tiếp theo?',
  'How am I doing today?': 'Hôm nay mình thế nào?',
  'Hi! Add a meal so I can track it.':
    'Chào bạn! Thêm bữa ăn để mình theo dõi nhé.',
  'What did you eat today? Log it for me!':
    'Hôm nay ăn gì rồi? Log vào cho mình xem nào!',
  'First meal! I am waiting.': 'Bữa đầu tiên nào! Mình đợi đây.',
  "Today's goal: {target} kcal.": 'Mục tiêu hôm nay: {target} kcal.',
  '{pct}% of goal, {remaining} kcal to go!':
    '{pct}% mục tiêu, còn {remaining} kcal nhé!',
  'On the right track, take it easy.': 'Đang đúng hướng, từ từ thôi.',
  'Protein is a bit low, add some!': 'Protein hơi thấp, thêm chút đạm nha!',
  'Almost at your goal! {remaining} kcal left.':
    'Sắp đạt mục tiêu! Còn {remaining} kcal.',
  'Close to the finish!': 'Gần tới đích rồi!',
  'Calorie goal reached today!': 'Đạt mục tiêu calo hôm nay!',
  'Great, right on target!': 'Tuyệt vời, vừa đủ!',
  '{over} kcal over your goal.': 'Vượt {over} kcal so với mục tiêu.',
  'A bit too much, balance it tomorrow!':
    'Hơi quá tay, mai cân bằng lại nha!',
  "I don't know your goal yet. Set one in Profile!":
    'Mình chưa biết mục tiêu của bạn. Đặt mục tiêu ở Profile nhé!',
  'You are {over} kcal over your goal.':
    'Bạn đã vượt {over} kcal so với mục tiêu.',
  'You just hit your calorie goal!': 'Bạn vừa đủ mục tiêu calo rồi!',
  'You have {remaining} kcal left for today.':
    'Bạn còn {remaining} kcal cho hôm nay.',
  'You had {protein}g protein.': 'Bạn đã nạp {protein}g protein.',
  'Looking good!': 'Ổn rồi đó!',
  'Add a bit more protein!': 'Thêm chút đạm nữa nhé!',
  'Protein: {protein}/{pt}g. {note}': 'Protein: {protein}/{pt}g. {note}',
  'Enough for today, drink water and rest!':
    'Hôm nay đủ rồi, uống nước và nghỉ ngơi nha!',
  '{remaining} kcal left, a light snack fits.':
    'Còn {remaining} kcal, một bữa nhẹ là vừa.',
  '{remaining} kcal left, you can have a full meal!':
    'Còn {remaining} kcal, ăn một bữa đầy đủ được đó!',
  'Whoa... put me down!': 'Ơ... thả mình ra!',
  'Wheee, so dizzy!': 'Oáaa, chóng mặt quá!',
  'Hey hey, slow down!': 'Ê ê, từ từ!',
  'Hmph, stop dragging me!': 'Hứ, kéo gì kéo hoài!',
  'That was a bit much!': 'Hơi quá đáng đó nha!',
  'Let me do my job!': 'Để yên cho mình làm việc!',
  'Ask NutriBot': 'Hỏi NutriBot',
  'NutriBot is sleeping': 'NutriBot đang ngủ',
  'Tap again to wake': 'Bấm lần nữa để đánh thức',
};

type Params = Record<string, string | number>;

function fill(str: string, params?: Params): string {
  if (!params) return str;
  return str.replace(/\{(\w+)\}/g, (_, k) =>
    params[k] != null ? String(params[k]) : `{${k}}`,
  );
}

export type TFn = (key: string, params?: Params) => string;

interface LangState {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: TFn;
}

const LangContext = createContext<LangState | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('en');

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((v) => {
        if (v === 'vi' || v === 'en') setLangState(v);
      })
      .catch(() => undefined);
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    AsyncStorage.setItem(STORAGE_KEY, l).catch(() => undefined);
  }, []);

  const t = useCallback<TFn>(
    (key, params) => {
      const base = lang === 'vi' ? (VI[key] ?? key) : key;
      return fill(base, params);
    },
    [lang],
  );

  const value = useMemo<LangState>(
    () => ({ lang, setLang, t }),
    [lang, setLang, t],
  );

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang(): LangState {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error('useLang must be used within LanguageProvider');
  return ctx;
}

const OPTIONS: { key: Lang; label: string }[] = [
  { key: 'en', label: 'EN' },
  { key: 'vi', label: 'VI' },
];

export function LanguageToggle() {
  const { lang, setLang } = useLang();
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.chipBg,
        padding: 3,
      }}
    >
      {OPTIONS.map(({ key, label }) => {
        const active = key === lang;
        return (
          <Pressable
            key={key}
            onPress={() => setLang(key)}
            style={{
              minWidth: 38,
              height: 34,
              paddingHorizontal: 8,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 8,
              backgroundColor: active ? colors.card : 'transparent',
              shadowColor: '#0f172a',
              shadowOpacity: active ? 0.18 : 0,
              shadowRadius: 4,
              shadowOffset: { width: 0, height: 1 },
              elevation: active ? 2 : 0,
            }}
          >
            <Text
              style={{
                fontWeight: '700',
                fontSize: 13,
                color: active ? colors.brand : colors.muted,
              }}
            >
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
