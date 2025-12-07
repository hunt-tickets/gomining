import React from 'react';
import { View, ViewStyle } from 'react-native';
import { useThemeTokens } from '@/theme';
import { Text } from '../Text';

// ═══════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════

export type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'brand';
export type BadgeSize = 'sm' | 'md';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
}

// ═══════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════

export function Badge({
  children,
  variant = 'default',
  size = 'md',
}: BadgeProps) {
  const tokens = useThemeTokens();
  const badgeConfig = tokens.components.badge[variant];

  const containerStyle: ViewStyle = {
    backgroundColor: badgeConfig.background,
    paddingHorizontal: size === 'sm' ? tokens.spacing[2] : tokens.spacing[3],
    paddingVertical: size === 'sm' ? tokens.spacing[0.5] : tokens.spacing[1],
    borderRadius: tokens.radii.full,
    alignSelf: 'flex-start',
  };

  return (
    <View style={containerStyle}>
      <Text
        variant={size === 'sm' ? 'caption' : 'bodySmall'}
        weight="medium"
        style={{ color: badgeConfig.text }}
      >
        {children}
      </Text>
    </View>
  );
}
