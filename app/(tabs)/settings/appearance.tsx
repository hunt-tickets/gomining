import React from 'react';
import { View, ScrollView, StyleSheet, Pressable } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme, type ThemeSetting } from '@/theme';
import { Text, Button, Icon, Spacer } from '@/components/atoms';
import { Card, SwitchInput } from '@/components/molecules';

// ═══════════════════════════════════════════════════════════════════
// THEME OPTION COMPONENT
// ═══════════════════════════════════════════════════════════════════

interface ThemeOptionProps {
  icon: React.ComponentProps<typeof Icon>['name'];
  title: string;
  description: string;
  selected: boolean;
  onPress: () => void;
}

function ThemeOption({
  icon,
  title,
  description,
  selected,
  onPress,
}: ThemeOptionProps) {
  const { tokens } = useTheme();

  return (
    <Pressable
      style={[
        styles.themeOption,
        {
          backgroundColor: selected
            ? tokens.colors.brand.primaryMuted
            : tokens.colors.background.tertiary,
          borderColor: selected
            ? tokens.colors.brand.primary
            : tokens.colors.border.default,
        },
      ]}
      onPress={onPress}
    >
      <Icon
        name={icon}
        size={28}
        color={selected ? 'brand' : 'secondary'}
      />
      <Text
        variant="body"
        weight={selected ? 'semibold' : 'regular'}
        color={selected ? 'brand' : 'primary'}
      >
        {title}
      </Text>
      <Text variant="caption" color="muted" align="center">
        {description}
      </Text>
      {selected && (
        <View
          style={[
            styles.checkmark,
            { backgroundColor: tokens.colors.brand.primary },
          ]}
        >
          <Icon name="checkmark" size={12} color="#FFFFFF" />
        </View>
      )}
    </Pressable>
  );
}

// ═══════════════════════════════════════════════════════════════════
// MAIN SCREEN
// ═══════════════════════════════════════════════════════════════════

export default function AppearanceScreen() {
  const { tokens, themeSetting, setThemeSetting } = useTheme();
  const insets = useSafeAreaInsets();

  const [reduceAnimations, setReduceAnimations] = React.useState(false);

  return (
    <View style={[styles.container, { backgroundColor: tokens.colors.background.primary }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Button
          variant="ghost"
          size="sm"
          leftIcon={<Icon name="chevron-back" size={20} color="primary" />}
          onPress={() => router.back()}
        >
          Back
        </Button>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 24 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Text variant="h2">Appearance</Text>
        <Text variant="body" color="muted">
          Customize how the app looks
        </Text>

        <Spacer size={6} />

        {/* Theme Selection */}
        <Text variant="label" color="muted">THEME</Text>
        <Spacer size={3} />

        <View style={styles.themeGrid}>
          <ThemeOption
            icon="moon"
            title="Dark"
            description="Easy on the eyes"
            selected={themeSetting === 'dark'}
            onPress={() => setThemeSetting('dark')}
          />
          <ThemeOption
            icon="sunny"
            title="Light"
            description="Bright & clean"
            selected={themeSetting === 'light'}
            onPress={() => setThemeSetting('light')}
          />
          <ThemeOption
            icon="phone-portrait-outline"
            title="System"
            description="Match device"
            selected={themeSetting === 'system'}
            onPress={() => setThemeSetting('system')}
          />
        </View>

        <Spacer size={6} />

        {/* Other Options */}
        <Text variant="label" color="muted">ACCESSIBILITY</Text>
        <Spacer size={3} />

        <Card padding="md">
          <SwitchInput
            value={reduceAnimations}
            onValueChange={setReduceAnimations}
            label="Reduce Animations"
            description="Minimize motion effects throughout the app"
            icon="speedometer-outline"
          />
        </Card>

        <Spacer size={4} />

        <Card padding="md" variant="outlined">
          <View style={styles.infoRow}>
            <Icon name="information-circle-outline" size={20} color="muted" />
            <Text variant="bodySmall" color="muted" style={{ flex: 1 }}>
              The app uses the Obsidian Mining theme with Bitcoin orange accents.
              Premium themes may be available in future updates.
            </Text>
          </View>
        </Card>
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
    justifyContent: 'flex-start',
    paddingHorizontal: 8,
    paddingBottom: 8,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
  },
  themeGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  themeOption: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
    gap: 8,
  },
  checkmark: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
});
