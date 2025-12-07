import React from 'react';
import { View, ScrollView, StyleSheet, Pressable } from 'react-native';
import { Link, router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/theme';
import { Text, Button, Icon, Spacer, Badge } from '@/components/atoms';
import { Card, GlassCard, MetricDisplay } from '@/components/molecules';

// ═══════════════════════════════════════════════════════════════════
// MOCK DATA (Will be replaced with real data from storage)
// ═══════════════════════════════════════════════════════════════════

const mockMiners = [
  {
    id: '1',
    name: 'Main Rig',
    hashrate: 100,
    efficiency: 25,
    dailyProfit: 1.74,
    discounts: { token: 15, vip: 3, daily: 2 },
  },
  {
    id: '2',
    name: 'Secondary',
    hashrate: 200,
    efficiency: 20,
    dailyProfit: 4.12,
    discounts: { token: 10, vip: 2, daily: 3 },
  },
  {
    id: '3',
    name: 'Efficient One',
    hashrate: 150,
    efficiency: 15,
    dailyProfit: 3.85,
    discounts: { token: 20, vip: 6, daily: 3 },
  },
];

// ═══════════════════════════════════════════════════════════════════
// MINER CARD COMPONENT
// ═══════════════════════════════════════════════════════════════════

interface MinerCardProps {
  miner: typeof mockMiners[0];
  onPress: () => void;
}

function MinerCard({ miner, onPress }: MinerCardProps) {
  const { tokens } = useTheme();
  const totalDiscount = miner.discounts.token + miner.discounts.vip + miner.discounts.daily;

  return (
    <GlassCard onPress={onPress} padding="md">
      <View style={styles.minerHeader}>
        <View style={styles.minerTitleRow}>
          <Icon name="hardware-chip" size={20} color="brand" />
          <Text variant="h4">{miner.name}</Text>
        </View>
        <Icon name="chevron-forward" size={20} color="muted" />
      </View>

      <Spacer size={3} />

      <View style={styles.minerMetrics}>
        <View style={styles.metricItem}>
          <Text variant="caption" color="muted">Hashrate</Text>
          <Text variant="body" weight="semibold">{miner.hashrate} TH/s</Text>
        </View>
        <View style={styles.metricItem}>
          <Text variant="caption" color="muted">Efficiency</Text>
          <Text variant="body" weight="semibold">{miner.efficiency} W/TH</Text>
        </View>
        <View style={styles.metricItem}>
          <Text variant="caption" color="muted">Daily Profit</Text>
          <Text variant="body" weight="semibold" color="success">
            ${miner.dailyProfit.toFixed(2)}
          </Text>
        </View>
      </View>

      {totalDiscount > 0 && (
        <>
          <Spacer size={3} />
          <Badge variant="success">-{totalDiscount}% Discounts</Badge>
        </>
      )}
    </GlassCard>
  );
}

// ═══════════════════════════════════════════════════════════════════
// FARM SUMMARY COMPONENT
// ═══════════════════════════════════════════════════════════════════

function FarmSummary() {
  const { tokens } = useTheme();

  const totalHashrate = mockMiners.reduce((sum, m) => sum + m.hashrate, 0);
  const totalDailyProfit = mockMiners.reduce((sum, m) => sum + m.dailyProfit, 0);

  return (
    <Card variant="elevated" padding="lg">
      <Text variant="label" color="muted">TOTAL FARM</Text>
      <Spacer size={3} />

      <View style={styles.summaryMetrics}>
        <MetricDisplay
          label="Total Hashrate"
          value={totalHashrate}
          format="hashrate"
          size="lg"
        />
        <MetricDisplay
          label="Daily Profit"
          value={totalDailyProfit}
          format="currency"
          size="lg"
          trend="up"
          trendValue={2.3}
        />
      </View>

      <Spacer size={4} />

      <View style={styles.projectionRow}>
        <View style={styles.projectionItem}>
          <Text variant="caption" color="muted">Monthly</Text>
          <Text variant="h4" color="brand">${(totalDailyProfit * 30).toFixed(2)}</Text>
        </View>
        <View style={styles.projectionItem}>
          <Text variant="caption" color="muted">Yearly</Text>
          <Text variant="h4" color="brand">${(totalDailyProfit * 365).toFixed(2)}</Text>
        </View>
      </View>
    </Card>
  );
}

// ═══════════════════════════════════════════════════════════════════
// MAIN SCREEN
// ═══════════════════════════════════════════════════════════════════

export default function FarmScreen() {
  const { tokens } = useTheme();
  const insets = useSafeAreaInsets();

  const handleMinerPress = (id: string) => {
    router.push(`/farm/${id}`);
  };

  const handleAddMiner = () => {
    router.push('/farm/add');
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
        <View style={styles.header}>
          <Text variant="h2">My Farm</Text>
          <Text variant="body" color="muted">
            {mockMiners.length} miners active
          </Text>
        </View>

        <Spacer size={6} />

        {/* Farm Summary */}
        <FarmSummary />

        <Spacer size={6} />

        {/* Miners List */}
        <View style={styles.sectionHeader}>
          <Text variant="h4">Miners</Text>
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<Icon name="add" size={18} color="brand" />}
            onPress={handleAddMiner}
          >
            Add
          </Button>
        </View>

        <Spacer size={3} />

        <View style={styles.minersList}>
          {mockMiners.map((miner) => (
            <MinerCard
              key={miner.id}
              miner={miner}
              onPress={() => handleMinerPress(miner.id)}
            />
          ))}
        </View>

        <Spacer size={6} />

        {/* Strategy Simulator CTA */}
        <Card variant="outlined" padding="lg">
          <View style={styles.ctaContent}>
            <Icon name="sparkles" size={32} color="brand" />
            <Spacer size={3} />
            <Text variant="h4" align="center">Strategy Simulator</Text>
            <Spacer size={1} />
            <Text variant="bodySmall" color="muted" align="center">
              Compare reinvestment strategies and project your earnings
            </Text>
            <Spacer size={4} />
            <Button variant="primary" fullWidth>
              Run Simulation
            </Button>
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
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
  },
  header: {
    gap: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  projectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  projectionItem: {
    alignItems: 'center',
    gap: 4,
  },
  minersList: {
    gap: 12,
  },
  minerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  minerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  minerMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metricItem: {
    gap: 2,
  },
  ctaContent: {
    alignItems: 'center',
  },
});
