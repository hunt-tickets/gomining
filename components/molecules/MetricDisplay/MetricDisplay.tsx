import React, { useEffect } from 'react';
import { View, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useThemeTokens } from '@/theme';
import { Text, Icon } from '@/components/atoms';

// ═══════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════

export type MetricFormat = 'currency' | 'btc' | 'percentage' | 'hashrate' | 'number';
export type MetricSize = 'sm' | 'md' | 'lg' | 'xl';
export type MetricTrend = 'up' | 'down' | 'neutral';

export interface MetricDisplayProps {
  label: string;
  value: number;
  format?: MetricFormat;
  size?: MetricSize;
  trend?: MetricTrend;
  trendValue?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  animate?: boolean;
}

// ═══════════════════════════════════════════════════════════════════
// FORMATTERS
// ═══════════════════════════════════════════════════════════════════

const formatValue = (
  value: number,
  format: MetricFormat,
  decimals: number = 2,
  prefix?: string,
  suffix?: string
): string => {
  let formatted: string;

  switch (format) {
    case 'currency':
      formatted = `$${value.toLocaleString('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}`;
      break;
    case 'btc':
      formatted = `₿${value.toFixed(8)}`;
      break;
    case 'percentage':
      formatted = `${value.toFixed(decimals)}%`;
      break;
    case 'hashrate':
      if (value >= 1000) {
        formatted = `${(value / 1000).toFixed(1)} PH/s`;
      } else {
        formatted = `${value} TH/s`;
      }
      break;
    case 'number':
    default:
      formatted = value.toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: decimals,
      });
  }

  return `${prefix || ''}${formatted}${suffix || ''}`;
};

// ═══════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════

export function MetricDisplay({
  label,
  value,
  format = 'number',
  size = 'md',
  trend,
  trendValue,
  prefix,
  suffix,
  decimals = 2,
  animate = true,
}: MetricDisplayProps) {
  const tokens = useThemeTokens();
  const animatedValue = useSharedValue(0);

  useEffect(() => {
    if (animate) {
      animatedValue.value = withTiming(value, {
        duration: 800,
        easing: Easing.out(Easing.cubic),
      });
    } else {
      animatedValue.value = value;
    }
  }, [value, animate]);

  const getTextSize = () => {
    switch (size) {
      case 'sm':
        return { fontSize: tokens.typography.sizes.base, lineHeight: 24 };
      case 'lg':
        return { fontSize: tokens.typography.sizes['2xl'], lineHeight: 32 };
      case 'xl':
        return { fontSize: tokens.typography.sizes['4xl'], lineHeight: 44 };
      case 'md':
      default:
        return { fontSize: tokens.typography.sizes.xl, lineHeight: 28 };
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return tokens.colors.semantic.success;
      case 'down':
        return tokens.colors.semantic.error;
      default:
        return tokens.colors.text.muted;
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return 'trending-up' as const;
      case 'down':
        return 'trending-down' as const;
      default:
        return 'remove' as const;
    }
  };

  const containerStyle: ViewStyle = {
    gap: tokens.spacing[1],
  };

  const valueRowStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: tokens.spacing[2],
  };

  const trendContainerStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing[1],
  };

  const textSize = getTextSize();
  const displayValue = formatValue(value, format, decimals, prefix, suffix);

  return (
    <View style={containerStyle}>
      <Text variant="caption" color="muted">
        {label}
      </Text>

      <View style={valueRowStyle}>
        <Text
          variant="body"
          weight="bold"
          style={{ ...textSize, color: tokens.colors.text.primary }}
        >
          {displayValue}
        </Text>

        {trend && trendValue !== undefined && (
          <View style={trendContainerStyle}>
            <Icon name={getTrendIcon()} size={14} color={getTrendColor()} />
            <Text
              variant="caption"
              weight="medium"
              style={{ color: getTrendColor() }}
            >
              {trendValue > 0 ? '+' : ''}
              {trendValue.toFixed(2)}%
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}
