import React, { useState, useEffect } from 'react';
import { View, ViewStyle, TextInput, Pressable, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
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
  /** Unit suffix for manual input (e.g., "TH/s", "%", "W/TH") */
  unit?: string;
  /** Number of decimal places allowed */
  decimals?: number;
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
  unit,
  decimals = 2,
}: SliderInputProps) {
  const tokens = useThemeTokens();
  const sliderWidth = useSharedValue(0);
  const thumbPosition = useSharedValue(0);

  // Manual input state
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value.toString());

  // Sync input value with prop value when not editing
  useEffect(() => {
    if (!isEditing) {
      setInputValue(value.toString());
    }
  }, [value, isEditing]);

  // Handle input text change - replace comma with period for decimal
  const handleInputChange = (text: string) => {
    // Replace comma with period for decimal separator
    const normalizedText = text.replace(',', '.');
    setInputValue(normalizedText);
  };

  // Handle manual input submission
  const handleInputSubmit = () => {
    // Replace comma with period before parsing
    const normalizedInput = inputValue.replace(',', '.');
    const parsed = parseFloat(normalizedInput);
    if (!isNaN(parsed)) {
      // Clamp to min/max
      let newValue = Math.max(min, Math.min(max, parsed));
      // Round to step if step is defined
      if (step) {
        newValue = Math.round(newValue / step) * step;
      }
      // Round to decimal places (max 2)
      const effectiveDecimals = Math.min(decimals, 2);
      newValue = parseFloat(newValue.toFixed(effectiveDecimals));
      onValueChange(newValue);
      setInputValue(newValue.toString());
    } else {
      // Reset to current value if invalid
      setInputValue(value.toString());
    }
    setIsEditing(false);
  };

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

  // Determine what to show: formatted value or raw value for editing
  const getDisplayText = () => {
    if (valueFormatter) {
      return valueFormatter(value);
    }
    return unit ? `${value} ${unit}` : value.toString();
  };

  return (
    <View style={{ opacity: disabled ? 0.5 : 1 }}>
      {label && (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: tokens.spacing[2],
          }}
        >
          <Text variant="label" color="secondary">
            {label}
          </Text>

          {isEditing ? (
            <View style={styles.inputContainer}>
              <TextInput
                style={[
                  styles.manualInput,
                  {
                    color: tokens.colors.text.primary,
                    backgroundColor: tokens.colors.background.tertiary,
                    borderColor: tokens.colors.brand.primary,
                  },
                ]}
                value={inputValue}
                onChangeText={handleInputChange}
                onBlur={handleInputSubmit}
                onSubmitEditing={handleInputSubmit}
                keyboardType="decimal-pad"
                autoFocus
                selectTextOnFocus
              />
              {unit && (
                <Text variant="caption" color="muted" style={styles.unitLabel}>
                  {unit}
                </Text>
              )}
            </View>
          ) : (
            <Pressable
              onPress={() => {
                if (!disabled) {
                  setIsEditing(true);
                  setInputValue(value.toString());
                }
              }}
              style={[
                styles.valueDisplay,
                { backgroundColor: tokens.colors.background.tertiary },
              ]}
            >
              <Text variant="body" weight="semibold" color="brand">
                {getDisplayText()}
              </Text>
            </Pressable>
          )}
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

// ═══════════════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════════════

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  manualInput: {
    minWidth: 80,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 2,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    // @ts-ignore - Web-specific property to remove focus outline
    outlineStyle: 'none',
    outlineWidth: 0,
  },
  unitLabel: {
    marginLeft: 4,
  },
  valueDisplay: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
});
