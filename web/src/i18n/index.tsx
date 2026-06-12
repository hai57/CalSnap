import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import styled from "styled-components";

import { colors } from "../styles/theme";

export type Lang = "en" | "vi";

const STORAGE_KEY = "nutrilens_lang";

// English source string -> Vietnamese. Missing keys fall back to the source.
const VI: Record<string, string> = {
  // nav / layout
  Dashboard: "Tổng quan",
  Progress: "Tiến độ",
  Profile: "Hồ sơ",
  "+ Add food": "+ Thêm món",
  "Log out": "Đăng xuất",
  "Loading...": "Đang tải...",

  // dashboard
  Today: "Hôm nay",
  "Meals logged today": "Bữa ăn hôm nay",
  "No meals logged yet.": "Chưa ghi bữa nào.",
  "Snap or describe your first meal": "Chụp hoặc mô tả bữa đầu tiên",
  "Delete entry": "Xoá mục",

  // macros
  Protein: "Đạm",
  Carbs: "Tinh bột",
  Fat: "Chất béo",
  Calories: "Calo",

  // add food
  "Add food": "Thêm món",
  Photo: "Ảnh",
  Describe: "Mô tả",
  "Tap to take or upload a photo": "Chạm để chụp hoặc tải ảnh",
  "JPG, PNG or WEBP up to 10 MB": "JPG, PNG hoặc WEBP tối đa 10 MB",
  "Analyzing with AI...": "Đang phân tích bằng AI...",
  "Analyze photo": "Phân tích ảnh",
  "Estimate calories": "Ước tính calo",
  "e.g. Two scrambled eggs, a slice of whole-wheat toast with butter, and a black coffee":
    "vd: Hai quả trứng bác, một lát bánh mì nguyên cám phết bơ và một ly cà phê đen",
  "AI estimate": "Ước tính bằng AI",
  "{pct}% confidence": "{pct}% độ tin cậy",
  "Review and tweak before saving.": "Xem lại và chỉnh trước khi lưu.",
  Food: "Món ăn",
  "Calories (kcal)": "Calo (kcal)",
  "Protein (g)": "Đạm (g)",
  "Carbs (g)": "Tinh bột (g)",
  "Fat (g)": "Chất béo (g)",
  Back: "Quay lại",
  "Saving...": "Đang lưu...",
  "Save entry": "Lưu mục",
  "{name} added": "Đã thêm {name}",
  "Could not save": "Không thể lưu",
  "Analysis failed": "Phân tích thất bại",

  // history
  "Edit goals": "Sửa mục tiêu",
  "Daily average": "Trung bình ngày",
  "Days logged": "Số ngày đã ghi",
  "Calorie goal": "Mục tiêu calo",
  "Last 7 days": "7 ngày gần đây",

  // goals
  "Daily goals": "Mục tiêu hàng ngày",
  "Calorie target (kcal)": "Mục tiêu calo (kcal)",
  "Protein target (g)": "Mục tiêu đạm (g)",
  "Carbs target (g)": "Mục tiêu tinh bột (g)",
  "Fat target (g)": "Mục tiêu chất béo (g)",
  "Saved!": "Đã lưu!",
  "Save goals": "Lưu mục tiêu",
  "Goals saved": "Đã lưu mục tiêu",
  "Could not save goals": "Không thể lưu mục tiêu",

  // profile
  "We could not load your profile.": "Không thể tải hồ sơ của bạn.",
  "Try again": "Thử lại",
  Saved: "Đã lưu",
  Save: "Lưu",
  Basics: "Cơ bản",
  "Current weight": "Cân nặng hiện tại",
  "Used for future goal recommendations.": "Dùng cho gợi ý mục tiêu sau này.",
  "Daily calorie goal": "Mục tiêu calo mỗi ngày",
  "Your target for the dashboard ring.": "Mục tiêu cho vòng tròn tổng quan.",
  "Daily step goal": "Mục tiêu số bước mỗi ngày",
  "A simple activity target for each day.":
    "Mục tiêu vận động đơn giản mỗi ngày.",
  "kcal / day": "kcal / ngày",
  "steps / day": "bước / ngày",
  Macros: "Macro",
  "Fine-tune grams per macro. The ring shows your energy split.":
    "Tinh chỉnh gam mỗi nhóm. Vòng tròn thể hiện tỉ lệ năng lượng.",
  "macro kcal": "kcal macro",
  Diet: "Chế độ ăn",
  "Picking a diet recalculates your macros from your calorie goal.":
    "Chọn chế độ ăn sẽ tính lại macro từ mục tiêu calo của bạn.",
  Water: "Nước",
  "ml per day": "ml mỗi ngày",
  Appearance: "Giao diện",
  "Display mode": "Chế độ hiển thị",
  System: "Hệ thống",
  Light: "Sáng",
  Dark: "Tối",
  "System, light or dark.": "Theo hệ thống, sáng hoặc tối.",
  "NutriBot assistant": "Trợ lý NutriBot",
  "Show the floating helper bot.": "Hiện con bot trợ lý nổi.",
  Language: "Ngôn ngữ",
  "English or Vietnamese.": "Tiếng Anh hoặc Tiếng Việt.",
  "Profile saved": "Đã lưu hồ sơ",
  "Could not save profile": "Không thể lưu hồ sơ",

  // diet presets
  Balanced: "Cân bằng",
  "Even macro split, great for everyday maintenance.":
    "Tỉ lệ macro đều, hợp duy trì hằng ngày.",
  "Low carb": "Ít tinh bột",
  "Fewer carbs, more protein and fat for weight control.":
    "Ít tinh bột, nhiều đạm và chất béo để kiểm soát cân nặng.",
  "Low fat": "Ít béo",
  "Limit fat, favor carbs and protein.":
    "Hạn chế chất béo, ưu tiên tinh bột và đạm.",
  "High protein": "Giàu đạm",
  "More protein to build and keep muscle.":
    "Nhiều đạm để xây và giữ cơ.",
  Keto: "Keto",
  "Very low carb, high fat to burn fat for fuel.":
    "Rất ít tinh bột, nhiều chất béo để đốt mỡ.",
  Vegetarian: "Ăn chay",
  "Plant-based, balanced carbs and plant protein.":
    "Từ thực vật, cân bằng tinh bột và đạm thực vật.",

  // auth
  "Welcome back": "Chào mừng trở lại",
  "Log in to track your calories": "Đăng nhập để theo dõi calo",
  Email: "Email",
  Password: "Mật khẩu",
  "Logging in...": "Đang đăng nhập...",
  "Log in": "Đăng nhập",
  "No account?": "Chưa có tài khoản?",
  "Sign up": "Đăng ký",
  "Login failed": "Đăng nhập thất bại",
  "Create your account": "Tạo tài khoản",
  "Start tracking with AI in seconds":
    "Bắt đầu theo dõi bằng AI trong vài giây",
  "Creating account...": "Đang tạo tài khoản...",
  "Already have an account?": "Đã có tài khoản?",
  "Password must be at least 6 characters":
    "Mật khẩu phải có ít nhất 6 ký tự",
  "Registration failed": "Đăng ký thất bại",

  // NutriBot
  "How many calories left?": "Còn bao nhiêu calo?",
  "Enough protein yet?": "Đủ protein chưa?",
  "Suggest my next meal?": "Gợi ý bữa tiếp theo?",
  "How am I doing today?": "Hôm nay mình thế nào?",
  "Hi! Add a meal so I can track it.":
    "Chào bạn! Thêm bữa ăn để mình theo dõi nhé.",
  "What did you eat today? Log it for me!":
    "Hôm nay ăn gì rồi? Log vào cho mình xem nào!",
  "First meal! I am waiting.": "Bữa đầu tiên nào! Mình đợi đây.",
  "Today's goal: {target} kcal. Let's start!":
    "Mục tiêu hôm nay: {target} kcal. Bắt đầu thôi!",
  "Only {pct}% of goal, {remaining} kcal to go!":
    "Mới {pct}% mục tiêu, còn {remaining} kcal nữa nhé!",
  "On the right track, take it easy.": "Đang đi đúng hướng, cứ từ từ thôi.",
  "Protein is a bit low, add some!": "Protein hơi thấp, thêm chút đạm nha!",
  "{pct}% already! {remaining} kcal left for today.":
    "{pct}% rồi! Còn {remaining} kcal cho hôm nay.",
  "Nice, keep it up!": "Ngon lành, giữ phong độ nha!",
  "Don't forget to add protein!": "Đừng quên thêm protein nhé!",
  "Almost at your goal! {remaining} kcal left.":
    "Sắp đạt mục tiêu rồi! Còn {remaining} kcal.",
  "Close to the finish, watch the last meal.":
    "Gần tới đích, cẩn thận bữa cuối nhé.",
  "Calorie goal reached today!": "Đạt mục tiêu calo hôm nay!",
  "Great, right on target!": "Tuyệt vời, vừa đủ mục tiêu!",
  "{over} kcal over your goal.": "Vượt {over} kcal so với mục tiêu rồi đó.",
  "A bit too much, balance it tomorrow!":
    "Hơi quá tay rồi, mai cân bằng lại nha!",
  "I don't know your goal yet. Set one in Profile!":
    "Mình chưa biết mục tiêu của bạn. Đặt mục tiêu ở Profile nhé!",
  "You are {over} kcal over your goal.":
    "Bạn đã vượt {over} kcal so với mục tiêu.",
  "You just hit your calorie goal!": "Bạn vừa đủ mục tiêu calo rồi!",
  "You have {remaining} kcal left for today.":
    "Bạn còn {remaining} kcal cho hôm nay.",
  "You had {protein}g protein.": "Bạn đã nạp {protein}g protein.",
  "Looking good!": "Ổn rồi đó!",
  "Add a bit more protein!": "Thêm chút đạm nữa nhé!",
  "Protein: {protein}/{pt}g. {note}": "Protein: {protein}/{pt}g. {note}",
  "Enough for today, drink water and rest!":
    "Hôm nay đủ rồi, uống nước và nghỉ ngơi nha!",
  "{remaining} kcal left, a light snack fits.":
    "Còn {remaining} kcal, một bữa nhẹ là vừa.",
  "{remaining} kcal left, you can have a full meal!":
    "Còn {remaining} kcal, bạn ăn một bữa đầy đủ được đó!",
  "Whoa... put me down!": "Ơ... thả mình ra!",
  "Wheee, so dizzy!": "Oáaa, chóng mặt quá!",
  "Hey hey, slow down!": "Ê ê, từ từ!",
  "Hmph, stop dragging me!": "Hứ, kéo gì kéo hoài!",
  "That was a bit much!": "Hơi quá đáng đó nha!",
  "Let me do my job!": "Để yên cho mình làm việc!",
  "Hmm, let me see...": "Hmm, để mình xem...",
  "Ask NutriBot": "Hỏi NutriBot",
  "NutriBot nutrition assistant": "NutriBot trợ lý dinh dưỡng",
  "Wake NutriBot up": "Bật lại NutriBot",
  "NutriBot is sleeping": "NutriBot đang ngủ",
  "Tap to wake me up": "Bấm để đánh thức mình dậy nhé",
};

type Params = Record<string, string | number>;

function fill(str: string, params?: Params): string {
  if (!params) return str;
  return str.replace(/\{(\w+)\}/g, (_, k) =>
    params[k] != null ? String(params[k]) : `{${k}}`,
  );
}

interface LangState {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string, params?: Params) => string;
}

const LangContext = createContext<LangState | undefined>(undefined);

function readStored(): Lang {
  if (typeof window === "undefined") return "en";
  const v = window.localStorage.getItem(STORAGE_KEY);
  return v === "vi" ? "vi" : "en";
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(readStored);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      window.localStorage.setItem(STORAGE_KEY, l);
    } catch {
      // ignore storage failures
    }
  }, []);

  const t = useCallback(
    (key: string, params?: Params) => {
      const base = lang === "vi" ? (VI[key] ?? key) : key;
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
  if (!ctx) throw new Error("useLang must be used within LanguageProvider");
  return ctx;
}

const OPTIONS: { key: Lang; label: string }[] = [
  { key: "en", label: "EN" },
  { key: "vi", label: "VI" },
];

export function LanguageToggle() {
  const { lang, setLang } = useLang();
  return (
    <Group role="radiogroup" aria-label="Language">
      {OPTIONS.map((o) => (
        <Segment
          key={o.key}
          type="button"
          role="radio"
          aria-checked={lang === o.key}
          $active={lang === o.key}
          onClick={() => setLang(o.key)}
        >
          {o.label}
        </Segment>
      ))}
    </Group>
  );
}

const Group = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.125rem;
  padding: 0.1875rem;
  border-radius: 0.625rem;
  border: 1px solid ${colors.slate200};
  background: ${colors.slate100};
`;

const Segment = styled.button<{ $active: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 2.25rem;
  height: 1.875rem;
  padding: 0 0.5rem;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-family: inherit;
  font-size: 0.8125rem;
  font-weight: 700;
  color: ${(p) => (p.$active ? colors.brand700 : colors.slate500)};
  background: ${(p) => (p.$active ? colors.white : "transparent")};
  box-shadow: ${(p) =>
    p.$active ? "0 1px 4px -1px rgba(15, 23, 42, 0.25)" : "none"};
  transition:
    background 0.15s ease,
    color 0.15s ease,
    transform 0.08s ease;

  &:hover {
    color: ${(p) => (p.$active ? colors.brand700 : colors.slate700)};
  }
  &:active {
    transform: scale(0.92);
  }
`;
