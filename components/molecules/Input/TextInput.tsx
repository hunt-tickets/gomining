import React, { useState } from 'react';
import {
  TextInput as RNTextInput,
  View,
  ViewStyle,
  TextStyle,
  Pressable,
} from 'react-native';
import { useThemeTokens } from '@/theme';
import { Text, Icon, type IconName } from '@/components/atoms';

// ═══════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════

export interface TextInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: IconName;
  rightIcon?: IconName;
  onRightIconPress?: () => void;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'numeric' | 'email-address' | 'decimal-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  multiline?: boolean;
  numberOfLines?: number;
  disabled?: boolean;
  maxLength?: number;
}

// ═══════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════

export function TextInput({
  value,
  onChangeText,
  placeholder,
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  onRightIconPress,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  multiline = false,
  numberOfLines = 1,
  disabled = false,
  maxLength,
}: TextInputProps) {
  const tokens = useThemeTokens();
  const [isFocused, setIsFocused] = useState(false);

  const { input } = tokens.components;

  const containerStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: multiline ? 'flex-start' : 'center',
    backgroundColor: isFocused ? input.backgroundFocus : input.background,
    borderWidth: 1,
    borderColor: error
      ? tokens.colors.border.error
      : isFocused
      ? input.borderFocus
      : input.border,
    borderRadius: input.radius,
    paddingHorizontal: tokens.spacing[4],
    paddingVertical: multiline ? tokens.spacing[3] : tokens.spacing[3],
    opacity: disabled ? 0.5 : 1,
    gap: tokens.spacing[3],
  };

  const inputStyle: TextStyle = {
    flex: 1,
    fontSize: tokens.typography.sizes.base,
    color: input.text,
    paddingVertical: 0,
    ...(multiline && {
      minHeight: numberOfLines * 24,
      textAlignVertical: 'top',
    }),
  };

  return (
    <View>
      {label && (
        <Text
          variant="label"
          color="secondary"
          style={{ marginBottom: tokens.spacing[2] }}
        >
          {label}
        </Text>
      )}

      <View style={containerStyle}>
        {leftIcon && (
          <Icon
            name={leftIcon}
            size={20}
            color={isFocused ? 'brand' : 'muted'}
          />
        )}

        <RNTextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={input.placeholder}
          style={inputStyle}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          multiline={multiline}
          numberOfLines={numberOfLines}
          editable={!disabled}
          maxLength={maxLength}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />

        {rightIcon && (
          <Pressable onPress={onRightIconPress} disabled={!onRightIconPress}>
            <Icon name={rightIcon} size={20} color="muted" />
          </Pressable>
        )}
      </View>

      {(error || helperText) && (
        <Text
          variant="caption"
          color={error ? 'error' : 'muted'}
          style={{ marginTop: tokens.spacing[1] }}
        >
          {error || helperText}
        </Text>
      )}
    </View>
  );
}
