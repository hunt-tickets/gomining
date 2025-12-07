import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import { useColorScheme as useSystemColorScheme } from 'react-native';
import { createSemanticTokens, type ThemeMode, type SemanticTokens } from './tokens';

// ═══════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════

export type ThemeSetting = 'dark' | 'light' | 'system';

interface ThemeContextValue {
  theme: ThemeMode;
  themeSetting: ThemeSetting;
  tokens: SemanticTokens;
  setThemeSetting: (setting: ThemeSetting) => void;
  isDark: boolean;
}

// ═══════════════════════════════════════════════════════════════════
// CONTEXT
// ═══════════════════════════════════════════════════════════════════

const ThemeContext = createContext<ThemeContextValue | null>(null);

// ═══════════════════════════════════════════════════════════════════
// PROVIDER
// ═══════════════════════════════════════════════════════════════════

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: ThemeSetting;
  storageKey?: string;
}

export function ThemeProvider({
  children,
  defaultTheme = 'dark',
}: ThemeProviderProps) {
  const systemColorScheme = useSystemColorScheme();
  const [themeSetting, setThemeSettingState] = useState<ThemeSetting>(defaultTheme);

  // Resolve the actual theme based on setting
  const theme: ThemeMode = useMemo(() => {
    if (themeSetting === 'system') {
      return systemColorScheme === 'light' ? 'light' : 'dark';
    }
    return themeSetting;
  }, [themeSetting, systemColorScheme]);

  // Generate semantic tokens based on current theme
  const tokens = useMemo(() => createSemanticTokens(theme), [theme]);

  const setThemeSetting = useCallback((setting: ThemeSetting) => {
    setThemeSettingState(setting);
    // Storage will be handled by the settings feature
  }, []);

  const value = useMemo<ThemeContextValue>(() => ({
    theme,
    themeSetting,
    tokens,
    setThemeSetting,
    isDark: theme === 'dark',
  }), [theme, themeSetting, tokens, setThemeSetting]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

// ═══════════════════════════════════════════════════════════════════
// HOOKS
// ═══════════════════════════════════════════════════════════════════

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

export function useThemeTokens(): SemanticTokens {
  const { tokens } = useTheme();
  return tokens;
}

export function useThemeColors() {
  const { tokens } = useTheme();
  return tokens.colors;
}
