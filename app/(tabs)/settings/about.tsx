import React from 'react';
import { View, ScrollView, StyleSheet, Linking } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/theme';
import { Text, Button, Icon, Spacer } from '@/components/atoms';
import { Card } from '@/components/molecules';

// ═══════════════════════════════════════════════════════════════════
// MAIN SCREEN
// ═══════════════════════════════════════════════════════════════════

export default function AboutScreen() {
  const { tokens } = useTheme();
  const insets = useSafeAreaInsets();

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
        {/* App Logo & Name */}
        <View style={styles.logoSection}>
          <View
            style={[
              styles.logoContainer,
              { backgroundColor: tokens.colors.brand.primaryMuted },
            ]}
          >
            <Text style={{ fontSize: 48 }}>⛏️</Text>
          </View>
          <Spacer size={4} />
          <Text variant="h2" align="center">GoMining Calculator</Text>
          <Text variant="body" color="muted" align="center">
            Version 1.0.0
          </Text>
        </View>

        <Spacer size={6} />

        {/* Description */}
        <Card padding="lg">
          <Text variant="body" color="secondary">
            GoMining Calculator helps you track and optimize your Bitcoin mining
            investments. Calculate profits, compare strategies, and get AI-powered
            insights to maximize your returns.
          </Text>
        </Card>

        <Spacer size={4} />

        {/* Features */}
        <Card padding="lg">
          <Text variant="label" color="muted">FEATURES</Text>
          <Spacer size={3} />

          <View style={styles.featureList}>
            <View style={styles.featureItem}>
              <Icon name="checkmark-circle" size={20} color="success" />
              <Text variant="body">Real-time BTC & difficulty tracking</Text>
            </View>
            <View style={styles.featureItem}>
              <Icon name="checkmark-circle" size={20} color="success" />
              <Text variant="body">Multiple miner management</Text>
            </View>
            <View style={styles.featureItem}>
              <Icon name="checkmark-circle" size={20} color="success" />
              <Text variant="body">Strategy simulation engine</Text>
            </View>
            <View style={styles.featureItem}>
              <Icon name="checkmark-circle" size={20} color="success" />
              <Text variant="body">AI-powered investment advisor</Text>
            </View>
            <View style={styles.featureItem}>
              <Icon name="checkmark-circle" size={20} color="success" />
              <Text variant="body">100% local data storage</Text>
            </View>
          </View>
        </Card>

        <Spacer size={4} />

        {/* Tech Stack */}
        <Card padding="lg">
          <Text variant="label" color="muted">BUILT WITH</Text>
          <Spacer size={3} />

          <View style={styles.techStack}>
            <View style={styles.techItem}>
              <Text variant="bodySmall" color="muted">Framework</Text>
              <Text variant="body">Expo SDK 54</Text>
            </View>
            <View style={styles.techItem}>
              <Text variant="bodySmall" color="muted">AI</Text>
              <Text variant="body">Google Gemini</Text>
            </View>
            <View style={styles.techItem}>
              <Text variant="bodySmall" color="muted">Price Data</Text>
              <Text variant="body">CoinGecko</Text>
            </View>
            <View style={styles.techItem}>
              <Text variant="bodySmall" color="muted">Difficulty</Text>
              <Text variant="body">Blockchain.com</Text>
            </View>
          </View>
        </Card>

        <Spacer size={6} />

        {/* Links */}
        <View style={styles.linksSection}>
          <Button
            variant="secondary"
            fullWidth
            leftIcon={<Icon name="logo-github" size={20} color="primary" />}
            onPress={() => Linking.openURL('https://github.com')}
          >
            View on GitHub
          </Button>

          <Spacer size={3} />

          <Button
            variant="ghost"
            fullWidth
            leftIcon={<Icon name="mail-outline" size={20} color="brand" />}
            onPress={() => Linking.openURL('mailto:support@example.com')}
          >
            Contact Support
          </Button>
        </View>

        <Spacer size={8} />

        {/* Footer */}
        <Text variant="caption" color="muted" align="center">
          © 2024 GoMining Calculator
        </Text>
        <Spacer size={1} />
        <Text variant="caption" color="muted" align="center">
          Made with ₿ and ❤️
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
  logoSection: {
    alignItems: 'center',
  },
  logoContainer: {
    width: 96,
    height: 96,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureList: {
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  techStack: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  techItem: {
    width: '45%',
    gap: 2,
  },
  linksSection: {
    gap: 0,
  },
});
