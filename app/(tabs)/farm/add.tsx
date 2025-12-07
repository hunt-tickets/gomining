import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/theme';
import { Text, Button, Icon, Spacer } from '@/components/atoms';
import { Card, TextInput, SliderInput } from '@/components/molecules';
import { useFarmContext } from '@/contexts';

// ═══════════════════════════════════════════════════════════════════
// ADD MINER SCREEN
// ═══════════════════════════════════════════════════════════════════

export default function AddMinerScreen() {
  const { tokens } = useTheme();
  const insets = useSafeAreaInsets();
  const { addMiner } = useFarmContext();

  const [name, setName] = useState('');
  const [hashrate, setHashrate] = useState(100);
  const [efficiency, setEfficiency] = useState(35);

  // Discount sliders
  const [tokenDays, setTokenDays] = useState(0);
  const [vipLevel, setVipLevel] = useState(0);
  const [dailyClicks, setDailyClicks] = useState(0);

  const handleSave = () => {
    if (!name.trim()) return;

    // Save miner to storage via hook
    addMiner({
      name: name.trim(),
      hashrate,
      efficiency,
      discounts: {
        tokenDays,
        vipLevel,
        dailyClicks,
      },
    });

    router.back();
  };

  return (
    <View style={[styles.container, { backgroundColor: tokens.colors.background.primary }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Button
          variant="ghost"
          size="sm"
          leftIcon={<Icon name="close" size={20} color="primary" />}
          onPress={() => router.back()}
        >
          Cancel
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
        <Text variant="h2">Add Miner</Text>
        <Text variant="body" color="muted">Configure your new virtual miner</Text>

        <Spacer size={6} />

        <Card padding="lg">
          <TextInput
            value={name}
            onChangeText={setName}
            label="Miner Name"
            placeholder="e.g., Main Rig"
            leftIcon="hardware-chip-outline"
          />
        </Card>

        <Spacer size={4} />

        <Card padding="lg">
          <Text variant="label" color="muted">PERFORMANCE</Text>
          <Spacer size={4} />

          <SliderInput
            label="Hashrate (TH/s)"
            value={hashrate}
            onValueChange={setHashrate}
            min={1}
            max={5000}
            step={1}
            valueFormatter={(v) => `${v} TH/s`}
          />

          <Spacer size={6} />

          <SliderInput
            label="Efficiency (W/TH)"
            value={efficiency}
            onValueChange={setEfficiency}
            min={15}
            max={50}
            step={1}
            valueFormatter={(v) => `${v} W/TH`}
          />
        </Card>

        <Spacer size={4} />

        <Card padding="lg">
          <Text variant="label" color="muted">DISCOUNTS</Text>
          <Spacer size={4} />

          <SliderInput
            label="Token Coverage (days)"
            value={tokenDays}
            onValueChange={setTokenDays}
            min={0}
            max={400}
            step={10}
            valueFormatter={(v) => v === 0 ? 'None' : `${v} days`}
          />

          <Spacer size={6} />

          <SliderInput
            label="VIP Level"
            value={vipLevel}
            onValueChange={setVipLevel}
            min={0}
            max={20}
            step={1}
            valueFormatter={(v) => v === 0 ? 'None' : `Level ${v}`}
          />

          <Spacer size={6} />

          <SliderInput
            label="Daily Clicks Streak"
            value={dailyClicks}
            onValueChange={setDailyClicks}
            min={0}
            max={10}
            step={1}
            valueFormatter={(v) => v === 0 ? 'None' : `${v} days`}
          />
        </Card>

        <Spacer size={4} />

        <Card padding="md" variant="outlined">
          <View style={styles.infoRow}>
            <Icon name="information-circle-outline" size={20} color="muted" />
            <Text variant="bodySmall" color="muted" style={{ flex: 1 }}>
              Discounts reduce your electricity and service fees. Token coverage gives up to 20%,
              VIP up to 6%, and daily clicks up to 3%.
            </Text>
          </View>
        </Card>

        <Spacer size={6} />

        <Button
          variant="primary"
          fullWidth
          disabled={!name.trim()}
          onPress={handleSave}
        >
          Create Miner
        </Button>
      </ScrollView>
    </View>
  );
}

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
  infoRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
});
