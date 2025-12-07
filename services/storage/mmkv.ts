/**
 * MMKV Storage Service
 * Fast, persistent key-value storage
 */

import { MMKV } from 'react-native-mmkv';

// ═══════════════════════════════════════════════════════════════════
// STORAGE INSTANCE
// ═══════════════════════════════════════════════════════════════════

export const storage = new MMKV({
  id: 'gomining-calculator',
});

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
