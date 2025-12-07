import React from 'react';
import { Text as RNText, TextStyle, StyleSheet } from 'react-native';
import { useThemeTokens } from '@/theme';

// ═══════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════

export type TextVariant =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'body'
  | 'bodySmall'
  | 'caption'
  | 'label'
  | 'mono';

export type TextColor =
  | 'primary'
  | 'secondary'
  | 'muted'
  | 'inverse'
  | 'brand'
  | 'success'
  | 'warning'
  | 'error';

export interface TextProps {
  children: React.ReactNode;
  variant?: TextVariant;
  color?: TextColor;
  weight?: 'regular' | 'medium' | 'semibold' | 'bold';
  align?: 'left' | 'center' | 'right';
  numberOfLines?: number;
  style?: TextStyle;
}

// ═══════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════

export function Text({
  children,
  variant = 'body',
  color = 'primary',
  weight,
  align,
  numberOfLines,
  style,
}: TextProps) {
  const tokens = useThemeTokens();

  const getVariantStyles = (): TextStyle => {
    const { typography } = tokens;

    switch (variant) {
      case 'h1':
        return {
          fontSize: typography.sizes['4xl'],
          fontWeight: typography.weights.bold,
          lineHeight: typography.sizes['4xl'] * typography.lineHeights.tight,
        };
      case 'h2':
        return {
          fontSize: typography.sizes['3xl'],
          fontWeight: typography.weights.bold,
          lineHeight: typography.sizes['3xl'] * typography.lineHeights.tight,
        };
      case 'h3':
        return {
          fontSize: typography.sizes['2xl'],
          fontWeight: typography.weights.semibold,
          lineHeight: typography.sizes['2xl'] * typography.lineHeights.tight,
        };
      case 'h4':
        return {
          fontSize: typography.sizes.xl,
          fontWeight: typography.weights.semibold,
          lineHeight: typography.sizes.xl * typography.lineHeights.normal,
        };
      case 'body':
        return {
          fontSize: typography.sizes.base,
          fontWeight: typography.weights.regular,
          lineHeight: typography.sizes.base * typography.lineHeights.normal,
        };
      case 'bodySmall':
        return {
          fontSize: typography.sizes.sm,
          fontWeight: typography.weights.regular,
          lineHeight: typography.sizes.sm * typography.lineHeights.normal,
        };
      case 'caption':
        return {
          fontSize: typography.sizes.xs,
          fontWeight: typography.weights.regular,
          lineHeight: typography.sizes.xs * typography.lineHeights.normal,
        };
      case 'label':
        return {
          fontSize: typography.sizes.sm,
          fontWeight: typography.weights.medium,
          lineHeight: typography.sizes.sm * typography.lineHeights.normal,
          textTransform: 'uppercase',
          letterSpacing: 0.5,
        };
      case 'mono':
        return {
          fontSize: typography.sizes.sm,
          fontWeight: typography.weights.regular,
          fontFamily: typography.fonts.mono,
          lineHeight: typography.sizes.sm * typography.lineHeights.normal,
        };
      default:
        return {};
    }
  };

  const getColorStyle = (): string => {
    const { colors } = tokens;

    switch (color) {
      case 'primary':
        return colors.text.primary;
      case 'secondary':
        return colors.text.secondary;
      case 'muted':
        return colors.text.muted;
      case 'inverse':
        return colors.text.inverse;
      case 'brand':
        return colors.brand.primary;
      case 'success':
        return colors.semantic.successText;
      case 'warning':
        return colors.semantic.warningText;
      case 'error':
        return colors.semantic.errorText;
      default:
        return colors.text.primary;
    }
  };

  const textStyles: TextStyle[] = [
    getVariantStyles(),
    { color: getColorStyle() },
    weight && { fontWeight: tokens.typography.weights[weight] },
    align && { textAlign: align },
    style,
  ].filter(Boolean) as TextStyle[];

  return (
    <RNText style={textStyles} numberOfLines={numberOfLines}>
      {children}
    </RNText>
  );
}
