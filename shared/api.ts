// Framework-agnostic API client used by both the web and mobile apps.
// Relies only on the global `fetch` and `FormData`, which exist in browsers
// and in React Native.

import type {
  AnalyzeResult,
  DailyGoal,
  DailySummary,
  FoodEntry,
  FoodEntryCreate,
  FoodEntryUpdate,
  Token,
  User,
} from "./types";

export interface ApiClientOptions {
  baseUrl: string;
  // Returns the current auth token (or null). Called before every request.
  getToken: () => string | null | Promise<string | null>;
  // Called when the server responds 401 so the app can log the user out.
  onUnauthorized?: () => void;
}

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export class ApiClient {
  constructor(private opts: ApiClientOptions) {}

  private async request<T>(path: string, init: RequestInit = {}): Promise<T> {
    const token = await this.opts.getToken();
    const headers = new Headers(init.headers);
    if (token) headers.set("Authorization", `Bearer ${token}`);

    const res = await fetch(`${this.opts.baseUrl}${path}`, { ...init, headers });

    if (res.status === 401) {
      this.opts.onUnauthorized?.();
    }
    if (res.status === 204) {
      return undefined as T;
    }

    const text = await res.text();
    const data = text ? JSON.parse(text) : null;

    if (!res.ok) {
      const detail =
        (data && (data.detail || data.message)) || `Request failed (${res.status})`;
      throw new ApiError(res.status, typeof detail === "string" ? detail : JSON.stringify(detail));
    }
    return data as T;
  }

  private json<T>(path: string, method: string, body?: unknown): Promise<T> {
    return this.request<T>(path, {
      method,
      headers: { "Content-Type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  }

  // ---------- Auth ----------
  async register(email: string, password: string): Promise<Token> {
    return this.json<Token>("/api/auth/register", "POST", { email, password });
  }

  async login(email: string, password: string): Promise<Token> {
    // OAuth2 password flow expects form-encoded "username"/"password".
    // Encoded manually so this works in React Native too.
    const body = `username=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`;
    return this.request<Token>("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });
  }

  me(): Promise<User> {
    return this.request<User>("/api/auth/me");
  }

  // ---------- Analyze ----------
  analyzeText(description: string): Promise<AnalyzeResult> {
    return this.json<AnalyzeResult>("/api/analyze/text", "POST", { description });
  }

  // `form` must contain a "file" field. Each platform builds it differently:
  //   web:    form.append("file", fileBlob)
  //   native: form.append("file", { uri, name, type } as any)
  analyzeImage(form: FormData): Promise<AnalyzeResult> {
    return this.request<AnalyzeResult>("/api/analyze/image", {
      method: "POST",
      body: form,
    });
  }

  // ---------- Entries ----------
  createEntry(payload: FoodEntryCreate): Promise<FoodEntry> {
    return this.json<FoodEntry>("/api/entries", "POST", payload);
  }

  listEntries(day?: string): Promise<FoodEntry[]> {
    const q = day ? `?day=${encodeURIComponent(day)}` : "";
    return this.request<FoodEntry[]>(`/api/entries${q}`);
  }

  updateEntry(id: number, payload: FoodEntryUpdate): Promise<FoodEntry> {
    return this.json<FoodEntry>(`/api/entries/${id}`, "PATCH", payload);
  }

  deleteEntry(id: number): Promise<void> {
    return this.request<void>(`/api/entries/${id}`, { method: "DELETE" });
  }

  // ---------- Summary & goals ----------
  summary(day?: string): Promise<DailySummary> {
    const q = day ? `?day=${encodeURIComponent(day)}` : "";
    return this.request<DailySummary>(`/api/summary${q}`);
  }

  getGoal(): Promise<DailyGoal | null> {
    return this.request<DailyGoal | null>("/api/goal");
  }

  setGoal(goal: DailyGoal): Promise<DailyGoal> {
    return this.json<DailyGoal>("/api/goal", "PUT", goal);
  }
}
