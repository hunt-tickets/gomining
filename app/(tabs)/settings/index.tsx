import React from 'react';
import { View, ScrollView, StyleSheet, Pressable } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/theme';
import { Text, Icon, Spacer } from '@/components/atoms';
import { Card } from '@/components/molecules';
import { useLanguage } from '@/contexts';
import { useTranslation } from 'react-i18next';
import { SUPPORTED_LANGUAGES } from '@/i18n';

// ═══════════════════════════════════════════════════════════════════
// SETTINGS ITEM COMPONENT
// ═══════════════════════════════════════════════════════════════════

interface SettingsItemProps {
  icon: React.ComponentProps<typeof Icon>['name'];
  title: string;
  subtitle?: string;
  value?: string;
  onPress: () => void;
  danger?: boolean;
}

function SettingsItem({
  icon,
  title,
  subtitle,
  value,
  onPress,
  danger = false,
}: SettingsItemProps) {
  const { tokens } = useTheme();

  return (
    <Pressable
      style={[
        styles.settingsItem,
        { borderBottomColor: tokens.colors.border.muted },
      ]}
      onPress={onPress}
    >
      <View
        style={[
          styles.settingsIcon,
          {
            backgroundColor: danger
              ? tokens.colors.semantic.errorMuted
              : tokens.colors.background.tertiary,
          },
        ]}
      >
        <Icon name={icon} size={20} color={danger ? 'error' : 'secondary'} />
      </View>

      <View style={styles.settingsContent}>
        <Text
          variant="body"
          color={danger ? 'error' : 'primary'}
        >
          {title}
        </Text>
        {subtitle && (
          <Text variant="caption" color="muted">
            {subtitle}
          </Text>
        )}
      </View>

      {value && (
        <Text variant="bodySmall" color="muted">
          {value}
        </Text>
      )}

      <Icon name="chevron-forward" size={20} color="muted" />
    </Pressable>
  );
}

// ═══════════════════════════════════════════════════════════════════
// PROFILE CARD COMPONENT
// ═══════════════════════════════════════════════════════════════════

function ProfileCard() {
  const { tokens } = useTheme();

  return (
    <Card padding="lg" onPress={() => router.push('/settings/profile')}>
      <View style={styles.profileRow}>
        <View
          style={[
            styles.avatar,
            { backgroundColor: tokens.colors.brand.primaryMuted },
          ]}
        >
          <Text style={{ fontSize: 32 }}>⛏️</Text>
        </View>

        <View style={styles.profileInfo}>
          <Text variant="h4">CryptoMiner2024</Text>
          <Text variant="caption" color="muted">
            crypto@example.com
          </Text>
          <Text variant="caption" color="brand">
            Goal: $10,000/year
          </Text>
        </View>

        <Icon name="chevron-forward" size={24} color="muted" />
      </View>
    </Card>
  );
}

// ═══════════════════════════════════════════════════════════════════
// MAIN SCREEN
// ═══════════════════════════════════════════════════════════════════

export default function SettingsScreen() {
  const { tokens, themeSetting } = useTheme();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const { language } = useLanguage();

  const getThemeLabel = () => {
    switch (themeSetting) {
      case 'dark':
        return t('settings.themeDark');
      case 'light':
        return t('settings.themeLight');
      case 'system':
        return t('settings.themeSystem');
    }
  };

  const getLanguageLabel = () => {
    const langInfo = SUPPORTED_LANGUAGES.find(l => l.code === language);
    return langInfo?.nativeName || language;
  };

  return (
    <View style={[styles.container, { backgroundColor: tokens.colors.background.primary }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 100 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Text variant="h2">{t('settings.title')}</Text>

        <Spacer size={6} />

        {/* Profile */}
        <Text variant="label" color="muted">{t('settings.profile')}</Text>
        <Spacer size={3} />
        <ProfileCard />

        <Spacer size={6} />

        {/* Appearance */}
        <Text variant="label" color="muted">{t('settings.appearance')}</Text>
        <Spacer size={3} />
        <Card padding="none">
          <SettingsItem
            icon="contrast-outline"
            title={t('settings.theme')}
            value={getThemeLabel()}
            onPress={() => router.push('/settings/appearance')}
          />
          <SettingsItem
            icon="language-outline"
            title={t('settings.language')}
            value={getLanguageLabel()}
            onPress={() => router.push('/settings/language')}
          />
          <SettingsItem
            icon="speedometer-outline"
            title={t('settings.reduceAnimations')}
            value="Off"
            onPress={() => {}}
          />
        </Card>

        <Spacer size={6} />

        {/* Mining Defaults */}
        <Text variant="label" color="muted">{t('settings.miningDefaults')}</Text>
        <Spacer size={3} />
        <Card padding="none">
          <SettingsItem
            icon="flash-outline"
            title={t('settings.electricityCost')}
            value="$0.06/kWh"
            onPress={() => {}}
          />
          <SettingsItem
            icon="hardware-chip-outline"
            title={t('settings.defaultEfficiency')}
            value="35 W/TH"
            onPress={() => {}}
          />
          <SettingsItem
            icon="cash-outline"
            title={t('settings.displayCurrency')}
            value="USD"
            onPress={() => {}}
          />
        </Card>

        <Spacer size={6} />

        {/* Data & Privacy */}
        <Text variant="label" color="muted">{t('settings.dataPrivacy')}</Text>
        <Spacer size={3} />
        <Card padding="none">
          <SettingsItem
            icon="download-outline"
            title={t('settings.exportData')}
            subtitle={t('settings.exportDescription')}
            onPress={() => {}}
          />
          <SettingsItem
            icon="cloud-upload-outline"
            title={t('settings.importData')}
            subtitle={t('settings.importDescription')}
            onPress={() => {}}
          />
          <SettingsItem
            icon="trash-outline"
            title={t('settings.clearData')}
            subtitle={t('settings.clearDescription')}
            onPress={() => {}}
            danger
          />
        </Card>

        <Spacer size={6} />

        {/* About */}
        <Text variant="label" color="muted">{t('settings.about')}</Text>
        <Spacer size={3} />
        <Card padding="none">
          <SettingsItem
            icon="information-circle-outline"
            title={t('settings.version')}
            value="1.0.0"
            onPress={() => router.push('/settings/about')}
          />
          <SettingsItem
            icon="star-outline"
            title={t('settings.rateApp')}
            onPress={() => {}}
          />
          <SettingsItem
            icon="share-outline"
            title={t('settings.share')}
            onPress={() => {}}
          />
          <SettingsItem
            icon="document-text-outline"
            title={t('settings.privacy')}
            onPress={() => {}}
          />
          <SettingsItem
            icon="shield-outline"
            title={t('settings.terms')}
            onPress={() => {}}
          />
        </Card>

        <Spacer size={8} />

        <Text variant="caption" color="muted" align="center">
          {t('settings.madeWith')}
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
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInfo: {
    flex: 1,
    gap: 2,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
    borderBottomWidth: 1,
  },
  settingsIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsContent: {
    flex: 1,
    gap: 2,
  },
});
