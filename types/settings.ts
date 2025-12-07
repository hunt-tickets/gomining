/**
 * Settings & Profile Types
 */

export interface UserProfile {
  id: string;
  displayName: string | null;
  email: string | null;
  avatarEmoji: string;
  miningGoal: number | null; // Yearly goal in USD
  createdAt: string;
  updatedAt: string;
}

export interface AppSettings {
  // Appearance
  theme: 'dark' | 'light' | 'system';
  reduceAnimations: boolean;

  // Mining defaults
  defaultElectricityCost: number; // $/kWh
  defaultEfficiency: number; // W/TH
  displayCurrency: 'USD' | 'EUR' | 'GBP' | 'BTC';

  // App state
  hasCompletedOnboarding: boolean;
}

export const DEFAULT_SETTINGS: AppSettings = {
  theme: 'dark',
  reduceAnimations: false,
  defaultElectricityCost: 0.06,
  defaultEfficiency: 35,
  displayCurrency: 'USD',
  hasCompletedOnboarding: false,
};

export const DEFAULT_PROFILE: Omit<UserProfile, 'id' | 'createdAt' | 'updatedAt'> = {
  displayName: null,
  email: null,
  avatarEmoji: '⛏️',
  miningGoal: null,
};
