import React from 'react';
import { View, Pressable, ViewStyle } from 'react-native';
import { useThemeTokens } from '@/theme';
import { Text, Icon, type IconName } from '@/components/atoms';

// ═══════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════

export type AlertVariant = 'info' | 'success' | 'warning' | 'error';

export interface AlertProps {
  title?: string;
  message: string;
  variant?: AlertVariant;
  icon?: IconName;
  onDismiss?: () => void;
  action?: {
    label: string;
    onPress: () => void;
  };
}

// ═══════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════

export function Alert({
  title,
  message,
  variant = 'info',
  icon,
  onDismiss,
  action,
}: AlertProps) {
  const tokens = useThemeTokens();

  const getVariantConfig = () => {
    switch (variant) {
      case 'success':
        return {
          background: tokens.colors.semantic.successMuted,
          text: tokens.colors.semantic.successText,
          icon: 'checkmark-circle' as IconName,
        };
      case 'warning':
        return {
          background: tokens.colors.semantic.warningMuted,
          text: tokens.colors.semantic.warningText,
          icon: 'warning' as IconName,
        };
      case 'error':
        return {
          background: tokens.colors.semantic.errorMuted,
          text: tokens.colors.semantic.errorText,
          icon: 'alert-circle' as IconName,
        };
      case 'info':
      default:
        return {
          background: tokens.colors.semantic.infoMuted,
          text: tokens.colors.semantic.infoText,
          icon: 'information-circle' as IconName,
        };
    }
  };

  const config = getVariantConfig();

  const containerStyle: ViewStyle = {
    flexDirection: 'row',
    backgroundColor: config.background,
    borderRadius: tokens.radii.lg,
    padding: tokens.spacing[4],
    gap: tokens.spacing[3],
  };

  const contentStyle: ViewStyle = {
    flex: 1,
    gap: tokens.spacing[1],
  };

  const actionsStyle: ViewStyle = {
    flexDirection: 'row',
    gap: tokens.spacing[4],
    marginTop: tokens.spacing[2],
  };

  return (
    <View style={containerStyle}>
      <Icon
        name={icon || config.icon}
        size={22}
        color={config.text}
      />

      <View style={contentStyle}>
        {title && (
          <Text variant="body" weight="semibold" style={{ color: config.text }}>
            {title}
          </Text>
        )}
        <Text variant="bodySmall" style={{ color: config.text }}>
          {message}
        </Text>

        {(action || onDismiss) && (
          <View style={actionsStyle}>
            {action && (
              <Pressable onPress={action.onPress}>
                <Text
                  variant="bodySmall"
                  weight="semibold"
                  style={{ color: config.text }}
                >
                  {action.label}
                </Text>
              </Pressable>
            )}
            {onDismiss && (
              <Pressable onPress={onDismiss}>
                <Text
                  variant="bodySmall"
                  weight="medium"
                  style={{ color: config.text, opacity: 0.7 }}
                >
                  Dismiss
                </Text>
              </Pressable>
            )}
          </View>
        )}
      </View>

      {onDismiss && !action && (
        <Pressable onPress={onDismiss}>
          <Icon name="close" size={20} color={config.text} />
        </Pressable>
      )}
    </View>
  );
}
