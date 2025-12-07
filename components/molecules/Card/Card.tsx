import React from 'react';
import { View, Pressable, ViewStyle, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useThemeTokens, useTheme } from '@/theme';

// ═══════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════

export interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  onPress?: () => void;
  style?: ViewStyle;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// ═══════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════

export function Card({
  children,
  variant = 'default',
  padding = 'md',
  onPress,
  style,
}: CardProps) {
  const tokens = useThemeTokens();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    if (onPress) {
      scale.value = withSpring(0.98, { damping: 15, stiffness: 400 });
    }
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
  };

  const getPadding = (): number => {
    switch (padding) {
      case 'none':
        return 0;
      case 'sm':
        return tokens.spacing[3];
      case 'lg':
        return tokens.spacing[6];
      case 'md':
      default:
        return tokens.spacing[4];
    }
  };

  const getVariantStyles = (): ViewStyle => {
    const { card } = tokens.components;

    switch (variant) {
      case 'elevated':
        return {
          backgroundColor: card.background,
          ...tokens.shadows.md,
        };
      case 'outlined':
        return {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: card.border,
        };
      case 'default':
      default:
        return {
          backgroundColor: card.background,
          borderWidth: 1,
          borderColor: card.border,
        };
    }
  };

  const containerStyle: ViewStyle = {
    borderRadius: tokens.components.card.radius,
    padding: getPadding(),
    overflow: 'hidden',
    ...getVariantStyles(),
    ...style,
  };

  if (onPress) {
    return (
      <AnimatedPressable
        style={[containerStyle, animatedStyle]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        {children}
      </AnimatedPressable>
    );
  }

  return <View style={containerStyle}>{children}</View>;
}

// ═══════════════════════════════════════════════════════════════════
// GLASS CARD (iOS Blur Effect)
// ═══════════════════════════════════════════════════════════════════

export interface GlassCardProps extends Omit<CardProps, 'variant'> {
  intensity?: number;
}

export function GlassCard({
  children,
  padding = 'md',
  onPress,
  style,
  intensity = 20,
}: GlassCardProps) {
  const tokens = useThemeTokens();
  const { isDark } = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    if (onPress) {
      scale.value = withSpring(0.98, { damping: 15, stiffness: 400 });
    }
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
  };

  const getPadding = (): number => {
    switch (padding) {
      case 'none':
        return 0;
      case 'sm':
        return tokens.spacing[3];
      case 'lg':
        return tokens.spacing[6];
      case 'md':
      default:
        return tokens.spacing[4];
    }
  };

  const containerStyle: ViewStyle = {
    borderRadius: tokens.components.card.radius,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: tokens.colors.glass.border,
    ...style,
  };

  const contentStyle: ViewStyle = {
    padding: getPadding(),
    backgroundColor: tokens.colors.glass.tint,
  };

  // Use BlurView on iOS, fallback on other platforms
  const renderContent = () => {
    if (Platform.OS === 'ios') {
      return (
        <BlurView intensity={intensity} tint={isDark ? 'dark' : 'light'}>
          <View style={contentStyle}>{children}</View>
        </BlurView>
      );
    }

    // Fallback for Android/Web
    return (
      <View
        style={[
          contentStyle,
          { backgroundColor: tokens.colors.glass.background },
        ]}
      >
        {children}
      </View>
    );
  };

  if (onPress) {
    return (
      <AnimatedPressable
        style={[containerStyle, animatedStyle]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        {renderContent()}
      </AnimatedPressable>
    );
  }

  return <View style={containerStyle}>{renderContent()}</View>;
}
