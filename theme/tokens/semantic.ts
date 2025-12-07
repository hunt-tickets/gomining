/**
 * Semantic Design Tokens
 * Context-aware tokens that reference primitive tokens
 * These change based on theme (dark/light)
 */

import { colors, spacing, typography, radii, shadows } from './primitives';

export type ThemeMode = 'dark' | 'light';

export const createSemanticTokens = (mode: ThemeMode) => {
  const isDark = mode === 'dark';

  return {
    colors: {
      // ═══════════════════════════════════════════════════════
      // BACKGROUND
      // ═══════════════════════════════════════════════════════
      background: {
        primary: isDark ? colors.neutral[1000] : colors.neutral[0],
        secondary: isDark ? colors.neutral[950] : colors.neutral[50],
        tertiary: isDark ? colors.neutral[900] : colors.neutral[100],
        elevated: isDark ? colors.neutral[800] : colors.neutral[0],
        inverse: isDark ? colors.neutral[0] : colors.neutral[1000],
      },

      // ═══════════════════════════════════════════════════════
      // TEXT
      // ═══════════════════════════════════════════════════════
      text: {
        primary: isDark ? colors.neutral[50] : colors.neutral[900],
        secondary: isDark ? colors.neutral[400] : colors.neutral[600],
        muted: isDark ? colors.neutral[500] : colors.neutral[500],
        inverse: isDark ? colors.neutral[900] : colors.neutral[50],
        brand: colors.purple[500],
      },

      // ═══════════════════════════════════════════════════════
      // BRAND
      // ═══════════════════════════════════════════════════════
      brand: {
        primary: colors.purple[500],
        primaryHover: colors.purple[400],
        primaryActive: colors.purple[600],
        primaryMuted: `${colors.purple[500]}20`,
        accent: colors.gold[500],
        accentMuted: `${colors.gold[500]}20`,
      },

      // ═══════════════════════════════════════════════════════
      // SEMANTIC
      // ═══════════════════════════════════════════════════════
      semantic: {
        success: colors.green[500],
        successMuted: `${colors.green[500]}20`,
        successText: isDark ? colors.green[400] : colors.green[600],
        warning: colors.orange[400],
        warningMuted: `${colors.orange[400]}20`,
        warningText: isDark ? colors.orange[300] : colors.orange[600],
        error: colors.red[500],
        errorMuted: `${colors.red[500]}20`,
        errorText: isDark ? colors.red[400] : colors.red[600],
        info: colors.blue[500],
        infoMuted: `${colors.blue[500]}20`,
        infoText: isDark ? colors.blue[400] : colors.blue[600],
      },

      // ═══════════════════════════════════════════════════════
      // BORDER
      // ═══════════════════════════════════════════════════════
      border: {
        default: isDark ? colors.neutral[800] : colors.neutral[200],
        muted: isDark ? colors.neutral[900] : colors.neutral[100],
        focus: colors.purple[500],
        error: colors.red[500],
      },

      // ═══════════════════════════════════════════════════════
      // GLASS EFFECT
      // ═══════════════════════════════════════════════════════
      glass: {
        tint: isDark
          ? 'rgba(117, 64, 239, 0.08)'
          : 'rgba(117, 64, 239, 0.05)',
        border: isDark
          ? 'rgba(255, 255, 255, 0.1)'
          : 'rgba(0, 0, 0, 0.05)',
        background: isDark
          ? 'rgba(20, 20, 22, 0.8)'
          : 'rgba(255, 255, 255, 0.8)',
      },
    },

    // ═══════════════════════════════════════════════════════
    // COMPONENT TOKENS
    // ═══════════════════════════════════════════════════════
    components: {
      // Card
      card: {
        background: isDark ? colors.neutral[950] : colors.neutral[0],
        backgroundHover: isDark ? colors.neutral[900] : colors.neutral[50],
        border: isDark ? colors.neutral[800] : colors.neutral[200],
        radius: radii.xl,
        padding: spacing[4],
      },

      // Button
      button: {
        primary: {
          background: colors.purple[500],
          backgroundHover: colors.purple[400],
          backgroundActive: colors.purple[600],
          text: colors.neutral[0],
        },
        secondary: {
          background: isDark ? colors.neutral[800] : colors.neutral[100],
          backgroundHover: isDark ? colors.neutral[700] : colors.neutral[200],
          text: isDark ? colors.neutral[50] : colors.neutral[900],
        },
        ghost: {
          background: 'transparent',
          backgroundHover: isDark
            ? 'rgba(255, 255, 255, 0.1)'
            : 'rgba(0, 0, 0, 0.05)',
          text: colors.purple[500],
        },
        danger: {
          background: colors.red[500],
          backgroundHover: colors.red[400],
          text: colors.neutral[0],
        },
      },

      // Input
      input: {
        background: isDark ? colors.neutral[900] : colors.neutral[50],
        backgroundFocus: isDark ? colors.neutral[800] : colors.neutral[0],
        border: isDark ? colors.neutral[700] : colors.neutral[300],
        borderFocus: colors.purple[500],
        text: isDark ? colors.neutral[50] : colors.neutral[900],
        placeholder: colors.neutral[500],
        radius: radii.lg,
      },

      // Badge
      badge: {
        default: {
          background: isDark ? colors.neutral[800] : colors.neutral[200],
          text: isDark ? colors.neutral[200] : colors.neutral[800],
        },
        success: {
          background: `${colors.green[500]}20`,
          text: isDark ? colors.green[400] : colors.green[600],
        },
        warning: {
          background: `${colors.orange[400]}20`,
          text: isDark ? colors.orange[300] : colors.orange[600],
        },
        error: {
          background: `${colors.red[500]}20`,
          text: isDark ? colors.red[400] : colors.red[600],
        },
        brand: {
          background: `${colors.purple[500]}20`,
          text: colors.purple[500],
        },
      },

      // Tab Bar
      tabBar: {
        background: isDark ? colors.neutral[950] : colors.neutral[0],
        border: isDark ? colors.neutral[800] : colors.neutral[200],
        activeColor: colors.purple[500],
        inactiveColor: colors.neutral[500],
      },
    },

    // Pass through primitives that don't change with theme
    spacing,
    typography,
    radii,
    shadows,
  } as const;
};

export type SemanticTokens = ReturnType<typeof createSemanticTokens>;
