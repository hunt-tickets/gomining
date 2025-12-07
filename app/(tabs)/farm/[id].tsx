import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/theme';
import { Text, Button, Icon, Spacer } from '@/components/atoms';
import { Card, SliderInput } from '@/components/molecules';

// ═══════════════════════════════════════════════════════════════════
// MINER DETAIL SCREEN
// ═══════════════════════════════════════════════════════════════════

export default function MinerDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { tokens } = useTheme();
  const insets = useSafeAreaInsets();

  // TODO: Fetch miner data from storage based on ID
  const miner = {
    id,
    name: 'Main Rig',
    hashrate: 100,
    efficiency: 25,
    dailyProfit: 1.74,
    discounts: { token: 15, vip: 3, daily: 2 },
  };

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
        <Button
          variant="ghost"
          size="sm"
          leftIcon={<Icon name="trash-outline" size={20} color="error" />}
          onPress={() => {
            // TODO: Delete miner
            router.back();
          }}
        >
          Delete
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
        <Text variant="h2">{miner.name}</Text>
        <Text variant="body" color="muted">Miner Configuration</Text>

        <Spacer size={6} />

        <Card padding="lg">
          <Text variant="label" color="muted">PERFORMANCE</Text>
          <Spacer size={4} />

          <SliderInput
            label="Hashrate (TH/s)"
            value={miner.hashrate}
            onValueChange={(val) => console.log(val)}
            min={1}
            max={5000}
            step={1}
            valueFormatter={(v) => `${v} TH/s`}
          />

          <Spacer size={6} />

          <SliderInput
            label="Efficiency (W/TH)"
            value={miner.efficiency}
            onValueChange={(val) => console.log(val)}
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
            label="Token Days Coverage"
            value={miner.discounts.token * 18}
            onValueChange={(val) => console.log(val)}
            min={0}
            max={400}
            step={1}
            valueFormatter={(v) => `${v} days (${Math.floor(v / 18)}%)`}
          />

          <Spacer size={6} />

          <SliderInput
            label="VIP Level"
            value={Math.round(miner.discounts.vip / 0.3)}
            onValueChange={(val) => console.log(val)}
            min={0}
            max={20}
            step={1}
            valueFormatter={(v) => `Level ${v} (${(v * 0.3).toFixed(1)}%)`}
          />

          <Spacer size={6} />

          <SliderInput
            label="Daily Clicks"
            value={Math.round(miner.discounts.daily / 0.3)}
            onValueChange={(val) => console.log(val)}
            min={0}
            max={10}
            step={1}
            valueFormatter={(v) => `${v} clicks (${(v * 0.3).toFixed(1)}%)`}
          />
        </Card>

        <Spacer size={6} />

        <Button variant="primary" fullWidth>
          Save Changes
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
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingBottom: 8,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
  },
});
