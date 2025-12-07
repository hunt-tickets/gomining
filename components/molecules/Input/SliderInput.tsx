import React from 'react';
import { View, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import { useThemeTokens } from '@/theme';
import { Text } from '@/components/atoms';

// ═══════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════

export interface SliderInputProps {
  value: number;
  onValueChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  valueFormatter?: (value: number) => string;
  disabled?: boolean;
}

// ═══════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════

export function SliderInput({
  value,
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  label,
  valueFormatter,
  disabled = false,
}: SliderInputProps) {
  const tokens = useThemeTokens();
  const sliderWidth = useSharedValue(0);
  const thumbPosition = useSharedValue(0);

  // Calculate initial thumb position based on value
  const getThumbPosition = (val: number, width: number) => {
    const percentage = (val - min) / (max - min);
    return percentage * (width - 24); // 24 is thumb width
  };

  const updateValue = (position: number) => {
    const width = sliderWidth.value;
    if (width === 0) return;

    const percentage = Math.max(0, Math.min(1, position / (width - 24)));
    let newValue = min + percentage * (max - min);

    // Apply step
    newValue = Math.round(newValue / step) * step;
    newValue = Math.max(min, Math.min(max, newValue));

    if (newValue !== value) {
      onValueChange(newValue);
    }
  };

  const panGesture = Gesture.Pan()
    .enabled(!disabled)
    .onStart(() => {
      // Start from current position
    })
    .onUpdate((event) => {
      const newPosition = Math.max(
        0,
        Math.min(sliderWidth.value - 24, thumbPosition.value + event.translationX)
      );
      runOnJS(updateValue)(newPosition);
    })
    .onEnd(() => {
      thumbPosition.value = getThumbPosition(value, sliderWidth.value);
    });

  const animatedThumbStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: getThumbPosition(value, sliderWidth.value || 200),
      },
    ],
  }));

  const animatedFillStyle = useAnimatedStyle(() => ({
    width: getThumbPosition(value, sliderWidth.value || 200) + 12,
  }));

  const percentage = ((value - min) / (max - min)) * 100;

  const trackStyle: ViewStyle = {
    height: 6,
    backgroundColor: tokens.colors.background.tertiary,
    borderRadius: tokens.radii.full,
    overflow: 'hidden',
  };

  const fillStyle: ViewStyle = {
    position: 'absolute',
    height: '100%',
    backgroundColor: tokens.colors.brand.primary,
    borderRadius: tokens.radii.full,
  };

  const thumbStyle: ViewStyle = {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: tokens.colors.brand.primary,
    top: -9,
    ...tokens.shadows.md,
  };

  const displayValue = valueFormatter ? valueFormatter(value) : value.toString();

  return (
    <View style={{ opacity: disabled ? 0.5 : 1 }}>
      {label && (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: tokens.spacing[2],
          }}
        >
          <Text variant="label" color="secondary">
            {label}
          </Text>
          <Text variant="body" weight="semibold" color="brand">
            {displayValue}
          </Text>
        </View>
      )}

      <GestureHandlerRootView>
        <GestureDetector gesture={panGesture}>
          <View
            style={{ paddingVertical: tokens.spacing[4] }}
            onLayout={(e) => {
              sliderWidth.value = e.nativeEvent.layout.width;
              thumbPosition.value = getThumbPosition(
                value,
                e.nativeEvent.layout.width
              );
            }}
          >
            <View style={trackStyle}>
              <Animated.View style={[fillStyle, animatedFillStyle]} />
            </View>
            <Animated.View style={[thumbStyle, animatedThumbStyle]} />
          </View>
        </GestureDetector>
      </GestureHandlerRootView>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: tokens.spacing[1],
        }}
      >
        <Text variant="caption" color="muted">
          {min}
        </Text>
        <Text variant="caption" color="muted">
          {max}
        </Text>
      </View>
    </View>
  );
}
