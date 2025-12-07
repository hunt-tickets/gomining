import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useThemeTokens } from '@/theme';

// ═══════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════

export type IconName = keyof typeof Ionicons.glyphMap;

export type IconColor =
  | 'primary'
  | 'secondary'
  | 'muted'
  | 'brand'
  | 'success'
  | 'warning'
  | 'error'
  | 'inverse';

export interface IconProps {
  name: IconName;
  size?: number;
  color?: IconColor | string;
}

// ═══════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════

export function Icon({ name, size = 24, color = 'primary' }: IconProps) {
  const tokens = useThemeTokens();

  const getColor = (): string => {
    // If it's a hex color or rgba, use it directly
    if (color.startsWith('#') || color.startsWith('rgb')) {
      return color;
    }

    const colorMap: Record<IconColor, string> = {
      primary: tokens.colors.text.primary,
      secondary: tokens.colors.text.secondary,
      muted: tokens.colors.text.muted,
      brand: tokens.colors.brand.primary,
      success: tokens.colors.semantic.success,
      warning: tokens.colors.semantic.warning,
      error: tokens.colors.semantic.error,
      inverse: tokens.colors.text.inverse,
    };

    return colorMap[color as IconColor] || tokens.colors.text.primary;
  };

  return <Ionicons name={name} size={size} color={getColor()} />;
}

// ═══════════════════════════════════════════════════════════════════
// PRESET ICONS FOR COMMON USE CASES
// ═══════════════════════════════════════════════════════════════════

export const IconPresets = {
  // Navigation
  farm: 'business-outline' as IconName,
  farmFilled: 'business' as IconName,
  dashboard: 'stats-chart-outline' as IconName,
  dashboardFilled: 'stats-chart' as IconName,
  advisor: 'sparkles-outline' as IconName,
  advisorFilled: 'sparkles' as IconName,
  settings: 'settings-outline' as IconName,
  settingsFilled: 'settings' as IconName,

  // Actions
  add: 'add' as IconName,
  edit: 'pencil' as IconName,
  delete: 'trash-outline' as IconName,
  save: 'checkmark' as IconName,
  close: 'close' as IconName,
  back: 'chevron-back' as IconName,
  forward: 'chevron-forward' as IconName,

  // Mining
  miner: 'hardware-chip-outline' as IconName,
  minerFilled: 'hardware-chip' as IconName,
  bitcoin: 'logo-bitcoin' as IconName,
  power: 'flash-outline' as IconName,
  powerFilled: 'flash' as IconName,

  // Status
  trendUp: 'trending-up' as IconName,
  trendDown: 'trending-down' as IconName,
  checkCircle: 'checkmark-circle' as IconName,
  warning: 'warning-outline' as IconName,
  info: 'information-circle-outline' as IconName,

  // Profile & Settings
  person: 'person-outline' as IconName,
  personFilled: 'person' as IconName,
  moon: 'moon-outline' as IconName,
  sunny: 'sunny-outline' as IconName,
  contrast: 'contrast-outline' as IconName,

  // Data
  refresh: 'refresh' as IconName,
  download: 'download-outline' as IconName,
  upload: 'cloud-upload-outline' as IconName,
  share: 'share-outline' as IconName,
};
