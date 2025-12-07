import React from 'react';
import {
  Pressable,
  ActivityIndicator,
  View,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useThemeTokens } from '@/theme';
import { Text } from '../Text';

// ═══════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onPress?: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// ═══════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  onPress,
}: ButtonProps) {
  const tokens = useThemeTokens();
  const scale = useSharedValue(1);

  const buttonConfig = tokens.components.button[variant];

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    if (!disabled && !loading) {
      scale.value = withSpring(0.97, { damping: 15, stiffness: 400 });
    }
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
  };

  const getSizeStyles = (): { container: ViewStyle; text: TextStyle } => {
    switch (size) {
      case 'sm':
        return {
          container: {
            paddingVertical: tokens.spacing[2],
            paddingHorizontal: tokens.spacing[3],
            borderRadius: tokens.radii.md,
          },
          text: { fontSize: tokens.typography.sizes.sm },
        };
      case 'lg':
        return {
          container: {
            paddingVertical: tokens.spacing[4],
            paddingHorizontal: tokens.spacing[6],
            borderRadius: tokens.radii.xl,
          },
          text: { fontSize: tokens.typography.sizes.lg },
        };
      case 'md':
      default:
        return {
          container: {
            paddingVertical: tokens.spacing[3],
            paddingHorizontal: tokens.spacing[5],
            borderRadius: tokens.radii.lg,
          },
          text: { fontSize: tokens.typography.sizes.base },
        };
    }
  };

  const sizeStyles = getSizeStyles();

  const containerStyle: ViewStyle = {
    backgroundColor: buttonConfig.background,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: tokens.spacing[2],
    opacity: disabled ? 0.5 : 1,
    ...sizeStyles.container,
    ...(fullWidth && { width: '100%' }),
  };

  const textStyle: TextStyle = {
    color: buttonConfig.text,
    fontWeight: tokens.typography.weights.semibold,
    ...sizeStyles.text,
  };

  return (
    <AnimatedPressable
      style={[containerStyle, animatedStyle]}
      disabled={disabled || loading}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      {loading ? (
        <ActivityIndicator color={buttonConfig.text} size="small" />
      ) : (
        <>
          {leftIcon}
          <Text style={textStyle}>{children}</Text>
          {rightIcon}
        </>
      )}
    </AnimatedPressable>
  );
}
