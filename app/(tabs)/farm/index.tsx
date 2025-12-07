import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/theme';
import { Text, Button, Icon, Spacer, Badge } from '@/components/atoms';
import { Card, GlassCard, MetricDisplay } from '@/components/molecules';
import { useFarmContext } from '@/contexts';
import type { MinerWithStats } from '@/types';

// ═══════════════════════════════════════════════════════════════════
// EMPTY STATE COMPONENT
// ═══════════════════════════════════════════════════════════════════

function EmptyFarmState({ onAddMiner }: { onAddMiner: () => void }) {
  const { tokens } = useTheme();

  return (
    <View style={styles.emptyState}>
      <Card variant="elevated" padding="xl">
        <View style={styles.emptyContent}>
          <View style={[styles.iconCircle, { backgroundColor: tokens.colors.brand.primary + '20' }]}>
            <Icon name="hardware-chip" size={48} color="brand" />
          </View>

          <Spacer size={6} />

          <Text variant="h3" align="center">
            Start Your Mining Farm
          </Text>

          <Spacer size={2} />

          <Text variant="body" color="muted" align="center">
            Add your first GoMining miner to track hashrate, calculate profits, and optimize your investment strategy.
          </Text>

          <Spacer size={6} />

          <Button
            variant="primary"
            size="lg"
            fullWidth
            leftIcon={<Icon name="add" size={20} color="#FFFFFF" />}
            onPress={onAddMiner}
          >
            Add Your First Miner
          </Button>

          <Spacer size={4} />

          <View style={styles.featureList}>
            <View style={styles.featureItem}>
              <Icon name="checkmark-circle" size={16} color="success" />
              <Text variant="bodySmall" color="muted">Real-time profit calculations</Text>
            </View>
            <View style={styles.featureItem}>
              <Icon name="checkmark-circle" size={16} color="success" />
              <Text variant="bodySmall" color="muted">Track discount multipliers</Text>
            </View>
            <View style={styles.featureItem}>
              <Icon name="checkmark-circle" size={16} color="success" />
              <Text variant="bodySmall" color="muted">AI-powered investment advice</Text>
            </View>
          </View>
        </View>
      </Card>
    </View>
  );
}

// ═══════════════════════════════════════════════════════════════════
// MINER CARD COMPONENT
// ═══════════════════════════════════════════════════════════════════

interface MinerCardProps {
  miner: MinerWithStats;
  onPress: () => void;
}

function MinerCard({ miner, onPress }: MinerCardProps) {
  const { tokens } = useTheme();

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
            ${miner.dailyProfitUSD.toFixed(2)}
          </Text>
        </View>
      </View>

      {miner.discountPercent > 0 && (
        <>
          <Spacer size={3} />
          <Badge variant="success">-{miner.discountPercent.toFixed(0)}% Discount</Badge>
        </>
      )}
    </GlassCard>
  );
}

// ═══════════════════════════════════════════════════════════════════
// FARM SUMMARY COMPONENT
// ═══════════════════════════════════════════════════════════════════

interface FarmSummaryProps {
  miners: MinerWithStats[];
}

function FarmSummary({ miners }: FarmSummaryProps) {
  const { tokens } = useTheme();

  const totalHashrate = miners.reduce((sum, m) => sum + m.hashrate, 0);
  const totalDailyProfit = miners.reduce((sum, m) => sum + m.dailyProfitUSD, 0);

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
  const { minersWithStats, isLoading } = useFarmContext();

  const handleMinerPress = (id: string) => {
    router.push(`/farm/${id}`);
  };

  const handleAddMiner = () => {
    router.push('/farm/add');
  };

  const hasMiners = minersWithStats.length > 0;

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
            {hasMiners ? `${minersWithStats.length} miner${minersWithStats.length > 1 ? 's' : ''} active` : 'Get started below'}
          </Text>
        </View>

        <Spacer size={6} />

        {!hasMiners ? (
          <EmptyFarmState onAddMiner={handleAddMiner} />
        ) : (
          <>
            {/* Farm Summary */}
            <FarmSummary miners={minersWithStats} />

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
              {minersWithStats.map((miner) => (
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
                <Button
                  variant="primary"
                  fullWidth
                  onPress={() => router.push('/modals/simulation-result')}
                >
                  Run Simulation
                </Button>
              </View>
            </Card>
          </>
        )}
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
  emptyState: {
    flex: 1,
  },
  emptyContent: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureList: {
    gap: 12,
    alignSelf: 'stretch',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});
