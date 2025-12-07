import React from 'react';
import { ActivityIndicator, View, ViewStyle } from 'react-native';
import { useThemeTokens } from '@/theme';

// ═══════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════

export type SpinnerSize = 'sm' | 'md' | 'lg';
export type SpinnerColor = 'brand' | 'primary' | 'muted';

export interface SpinnerProps {
  size?: SpinnerSize;
  color?: SpinnerColor;
  fullScreen?: boolean;
}

// ═══════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════

export function Spinner({
  size = 'md',
  color = 'brand',
  fullScreen = false,
}: SpinnerProps) {
  const tokens = useThemeTokens();

  const getSize = (): 'small' | 'large' => {
    switch (size) {
      case 'sm':
        return 'small';
      case 'lg':
        return 'large';
      default:
        return 'small';
    }
  };

  const getColor = (): string => {
    switch (color) {
      case 'brand':
        return tokens.colors.brand.primary;
      case 'primary':
        return tokens.colors.text.primary;
      case 'muted':
        return tokens.colors.text.muted;
      default:
        return tokens.colors.brand.primary;
    }
  };

  const spinner = <ActivityIndicator size={getSize()} color={getColor()} />;

  if (fullScreen) {
    const containerStyle: ViewStyle = {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: tokens.colors.background.primary,
    };

    return <View style={containerStyle}>{spinner}</View>;
  }

  return spinner;
}
