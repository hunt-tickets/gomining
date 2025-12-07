import React from 'react';
import { View } from 'react-native';
import { useThemeTokens } from '@/theme';
import { spacing } from '@/theme/tokens/primitives';

// ═══════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════

export type SpacerSize = keyof typeof spacing;

export interface SpacerProps {
  size?: SpacerSize;
  horizontal?: boolean;
}

// ═══════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════

export function Spacer({ size = 4, horizontal = false }: SpacerProps) {
  const tokens = useThemeTokens();
  const spaceValue = tokens.spacing[size];

  return (
    <View
      style={{
        [horizontal ? 'width' : 'height']: spaceValue,
      }}
    />
  );
}
