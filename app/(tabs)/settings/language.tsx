import React from 'react';
import { View, ScrollView, StyleSheet, Pressable } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/theme';
import { Text, Icon, Spacer } from '@/components/atoms';
import { Card } from '@/components/molecules';
import { useLanguage } from '@/contexts';
import { useTranslation } from 'react-i18next';
import type { SupportedLanguage } from '@/i18n';

// ═══════════════════════════════════════════════════════════════════
// LANGUAGE ITEM
// ═══════════════════════════════════════════════════════════════════

interface LanguageItemProps {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  isSelected: boolean;
  onSelect: () => void;
}

function LanguageItem({ code, name, nativeName, isSelected, onSelect }: LanguageItemProps) {
  const { tokens } = useTheme();

  return (
    <Pressable
      style={[
        styles.languageItem,
        { borderBottomColor: tokens.colors.border.muted },
        isSelected && { backgroundColor: tokens.colors.brand.primaryMuted },
      ]}
      onPress={onSelect}
    >
      <View style={styles.languageInfo}>
        <Text variant="body" weight={isSelected ? 'bold' : 'regular'}>
          {nativeName}
        </Text>
        <Text variant="caption" color="muted">
          {name}
        </Text>
      </View>
      {isSelected && (
        <Icon name="checkmark-circle" size={24} color="brand" />
      )}
    </Pressable>
  );
}

// ═══════════════════════════════════════════════════════════════════
// MAIN SCREEN
// ═══════════════════════════════════════════════════════════════════

export default function LanguageScreen() {
  const { tokens } = useTheme();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const { language, setLanguage, supportedLanguages } = useLanguage();

  const handleSelectLanguage = (code: SupportedLanguage) => {
    setLanguage(code);
    // Go back after selection
    router.back();
  };

  return (
    <View style={[styles.container, { backgroundColor: tokens.colors.background.primary }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Icon name="chevron-back" size={24} color="primary" />
        </Pressable>
        <Text variant="h3">{t('languages.selectLanguage')}</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 24 }]}
        showsVerticalScrollIndicator={false}
      >
        <Text variant="caption" color="muted" style={styles.hint}>
          {t('languages.auto')}
        </Text>
        <Spacer size={3} />

        <Card padding="none">
          {supportedLanguages.map((lang, index) => (
            <LanguageItem
              key={lang.code}
              code={lang.code}
              name={lang.name}
              nativeName={lang.nativeName}
              isSelected={language === lang.code}
              onSelect={() => handleSelectLanguage(lang.code)}
            />
          ))}
        </Card>

        <Spacer size={4} />

        <Text variant="caption" color="muted" align="center">
          {language === 'ar' && 'RTL support enabled for Arabic'}
        </Text>
      </ScrollView>
    </View>
  );
}

// ═══════════════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════════════

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
  },
  hint: {
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  languageInfo: {
    gap: 2,
  },
});
