import { ApiClient } from '@shared/api';

const rawApiUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:8000';
export const API_URL = rawApiUrl.replace(/\/+$/, '');

const TOKEN_KEY = "calorie_token";

export const tokenStore = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (t: string) => localStorage.setItem(TOKEN_KEY, t),
  clear: () => localStorage.removeItem(TOKEN_KEY),
};

let onUnauthorized: (() => void) | undefined;
export function setUnauthorizedHandler(fn: () => void) {
  onUnauthorized = fn;
}

export const api = new ApiClient({
  baseUrl: API_URL,
  getToken: () => tokenStore.get(),
  onUnauthorized: () => onUnauthorized?.(),
});

// Resolve a possibly-relative image URL returned by the backend.
export function resolveImageUrl(url: string | null): string | null {
  if (!url) return null;
  if (url.startsWith("http")) return url;
  return `${API_URL}${url}`;
}
