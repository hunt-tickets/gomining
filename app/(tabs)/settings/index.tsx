import React from 'react';
import { View, ScrollView, StyleSheet, Pressable } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/theme';
import { Text, Icon, Spacer } from '@/components/atoms';
import { Card } from '@/components/molecules';

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

  const getThemeLabel = () => {
    switch (themeSetting) {
      case 'dark':
        return 'Dark';
      case 'light':
        return 'Light';
      case 'system':
        return 'System';
    }
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
        <Text variant="h2">Settings</Text>

        <Spacer size={6} />

        {/* Profile */}
        <Text variant="label" color="muted">PROFILE</Text>
        <Spacer size={3} />
        <ProfileCard />

        <Spacer size={6} />

        {/* Appearance */}
        <Text variant="label" color="muted">APPEARANCE</Text>
        <Spacer size={3} />
        <Card padding="none">
          <SettingsItem
            icon="contrast-outline"
            title="Theme"
            value={getThemeLabel()}
            onPress={() => router.push('/settings/appearance')}
          />
          <SettingsItem
            icon="speedometer-outline"
            title="Reduce Animations"
            value="Off"
            onPress={() => {}}
          />
        </Card>

        <Spacer size={6} />

        {/* Mining Defaults */}
        <Text variant="label" color="muted">MINING DEFAULTS</Text>
        <Spacer size={3} />
        <Card padding="none">
          <SettingsItem
            icon="flash-outline"
            title="Electricity Cost"
            value="$0.06/kWh"
            onPress={() => {}}
          />
          <SettingsItem
            icon="hardware-chip-outline"
            title="Default Efficiency"
            value="35 W/TH"
            onPress={() => {}}
          />
          <SettingsItem
            icon="cash-outline"
            title="Display Currency"
            value="USD"
            onPress={() => {}}
          />
        </Card>

        <Spacer size={6} />

        {/* Data & Privacy */}
        <Text variant="label" color="muted">DATA & PRIVACY</Text>
        <Spacer size={3} />
        <Card padding="none">
          <SettingsItem
            icon="download-outline"
            title="Export My Data"
            subtitle="Download all your data as JSON"
            onPress={() => {}}
          />
          <SettingsItem
            icon="cloud-upload-outline"
            title="Import Data"
            subtitle="Restore from a backup"
            onPress={() => {}}
          />
          <SettingsItem
            icon="trash-outline"
            title="Clear All Data"
            subtitle="This action cannot be undone"
            onPress={() => {}}
            danger
          />
        </Card>

        <Spacer size={6} />

        {/* About */}
        <Text variant="label" color="muted">ABOUT</Text>
        <Spacer size={3} />
        <Card padding="none">
          <SettingsItem
            icon="information-circle-outline"
            title="Version"
            value="1.0.0"
            onPress={() => router.push('/settings/about')}
          />
          <SettingsItem
            icon="star-outline"
            title="Rate GoMining Calculator"
            onPress={() => {}}
          />
          <SettingsItem
            icon="share-outline"
            title="Share with Friends"
            onPress={() => {}}
          />
          <SettingsItem
            icon="document-text-outline"
            title="Privacy Policy"
            onPress={() => {}}
          />
          <SettingsItem
            icon="shield-outline"
            title="Terms of Service"
            onPress={() => {}}
          />
        </Card>

        <Spacer size={8} />

        <Text variant="caption" color="muted" align="center">
          Made with ₿ by GoMining Calculator
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
