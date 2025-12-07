/**
 * Storage Service
 * Uses MMKV on native, localStorage on web
 */

import { Platform } from 'react-native';

// ═══════════════════════════════════════════════════════════════════
// STORAGE KEYS
// ═══════════════════════════════════════════════════════════════════

export const STORAGE_KEYS = {
  // Settings
  THEME_SETTING: 'settings.theme',
  REDUCE_ANIMATIONS: 'settings.reduceAnimations',
  ELECTRICITY_COST: 'settings.electricityCost',
  DEFAULT_EFFICIENCY: 'settings.defaultEfficiency',
  DISPLAY_CURRENCY: 'settings.displayCurrency',

  // Profile
  PROFILE: 'profile',

  // Farm
  MINERS: 'farm.miners',

  // Cache
  BTC_PRICE_CACHE: 'cache.btcPrice',
  DIFFICULTY_CACHE: 'cache.difficulty',
  CACHE_TIMESTAMP: 'cache.timestamp',

  // Chat history
  CHAT_MESSAGES: 'chat.messages',

  // Onboarding
  HAS_COMPLETED_ONBOARDING: 'app.hasCompletedOnboarding',
} as const;

// ═══════════════════════════════════════════════════════════════════
// WEB STORAGE (localStorage)
// ═══════════════════════════════════════════════════════════════════

class WebStorage {
  private prefix = 'gomining:';

  getString(key: string): string | undefined {
    if (typeof window === 'undefined') return undefined;
    const value = localStorage.getItem(this.prefix + key);
    return value ?? undefined;
  }

  set(key: string, value: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.prefix + key, value);
  }

  delete(key: string): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(this.prefix + key);
  }

  clearAll(): void {
    if (typeof window === 'undefined') return;
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(this.prefix)) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((key) => localStorage.removeItem(key));
  }

  contains(key: string): boolean {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(this.prefix + key) !== null;
  }
}

// ═══════════════════════════════════════════════════════════════════
// NATIVE STORAGE (MMKV)
// ═══════════════════════════════════════════════════════════════════

let NativeStorage: typeof WebStorage | null = null;

// Only import MMKV on native platforms
if (Platform.OS !== 'web') {
  try {
    // Dynamic import for native
    const { MMKV } = require('react-native-mmkv');
    const mmkv = new MMKV({ id: 'gomining-calculator' });

    NativeStorage = class {
      getString(key: string): string | undefined {
        return mmkv.getString(key);
      }
      set(key: string, value: string): void {
        mmkv.set(key, value);
      }
      delete(key: string): void {
        mmkv.delete(key);
      }
      clearAll(): void {
        mmkv.clearAll();
      }
      contains(key: string): boolean {
        return mmkv.contains(key);
      }
    } as any;
  } catch (e) {
    console.warn('MMKV not available, using web storage fallback');
  }
}

// ═══════════════════════════════════════════════════════════════════
// STORAGE INSTANCE
// ═══════════════════════════════════════════════════════════════════

export const storage = Platform.OS === 'web' || !NativeStorage
  ? new WebStorage()
  : new NativeStorage();

// ═══════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════

/**
 * Get JSON value from storage
 */
export function getJSON<T>(key: string, defaultValue: T): T {
  try {
    const value = storage.getString(key);
    if (value === undefined) {
      return defaultValue;
    }
    return JSON.parse(value) as T;
  } catch {
    return defaultValue;
  }
}

/**
 * Set JSON value in storage
 */
export function setJSON<T>(key: string, value: T): void {
  storage.set(key, JSON.stringify(value));
}

/**
 * Remove key from storage
 */
export function remove(key: string): void {
  storage.delete(key);
}

/**
 * Clear all storage
 */
export function clearAll(): void {
  storage.clearAll();
}

/**
 * Check if key exists
 */
export function has(key: string): boolean {
  return storage.contains(key);
}
