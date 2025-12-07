import React from 'react';
import { View, Switch, Pressable, ViewStyle } from 'react-native';
import { useThemeTokens } from '@/theme';
import { Text, Icon, type IconName } from '@/components/atoms';

// ═══════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════

export interface SwitchInputProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  label: string;
  description?: string;
  icon?: IconName;
  disabled?: boolean;
}

// ═══════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════

export function SwitchInput({
  value,
  onValueChange,
  label,
  description,
  icon,
  disabled = false,
}: SwitchInputProps) {
  const tokens = useThemeTokens();

  const containerStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: tokens.spacing[3],
    opacity: disabled ? 0.5 : 1,
  };

  const leftContentStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: tokens.spacing[3],
  };

  return (
    <Pressable
      style={containerStyle}
      onPress={() => !disabled && onValueChange(!value)}
      disabled={disabled}
    >
      <View style={leftContentStyle}>
        {icon && <Icon name={icon} size={22} color="secondary" />}
        <View style={{ flex: 1 }}>
          <Text variant="body" color="primary">
            {label}
          </Text>
          {description && (
            <Text variant="caption" color="muted">
              {description}
            </Text>
          )}
        </View>
      </View>

      <Switch
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
        trackColor={{
          false: tokens.colors.background.tertiary,
          true: tokens.colors.brand.primaryMuted,
        }}
        thumbColor={value ? tokens.colors.brand.primary : tokens.colors.text.muted}
        ios_backgroundColor={tokens.colors.background.tertiary}
      />
    </Pressable>
  );
}
