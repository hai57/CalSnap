import AsyncStorage from "@react-native-async-storage/async-storage";

import { ApiClient } from "@shared/api";

import { API_URL } from "./config";

const TOKEN_KEY = "calorie_token";

// Cached in memory so getToken can resolve fast; AsyncStorage is the source of truth.
let cachedToken: string | null = null;

export const tokenStore = {
  async load(): Promise<string | null> {
    cachedToken = await AsyncStorage.getItem(TOKEN_KEY);
    return cachedToken;
  },
  get: () => cachedToken,
  async set(token: string) {
    cachedToken = token;
    await AsyncStorage.setItem(TOKEN_KEY, token);
  },
  async clear() {
    cachedToken = null;
    await AsyncStorage.removeItem(TOKEN_KEY);
  },
};

let onUnauthorized: (() => void) | undefined;
export function setUnauthorizedHandler(fn: () => void) {
  onUnauthorized = fn;
}

export const api = new ApiClient({
  baseUrl: API_URL,
  getToken: () => cachedToken,
  onUnauthorized: () => onUnauthorized?.(),
});
