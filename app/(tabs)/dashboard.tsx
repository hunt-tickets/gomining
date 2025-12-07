import React from 'react';
import { View, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/theme';
import { Text, Icon, Spacer, Badge } from '@/components/atoms';
import { Card, GlassCard, MetricDisplay, Alert } from '@/components/molecules';
import { useBitcoinData } from '@/hooks/useBitcoinData';
import { useFarm } from '@/hooks/useFarm';

// ═══════════════════════════════════════════════════════════════════
// EMPTY STATE COMPONENT
// ═══════════════════════════════════════════════════════════════════

function EmptyDashboardState() {
  const { tokens } = useTheme();

  return (
    <Card variant="elevated" padding="xl">
      <View style={styles.emptyContent}>
        <View style={[styles.iconCircle, { backgroundColor: tokens.colors.brand.primaryMuted }]}>
          <Icon name="stats-chart" size={48} color="brand" />
        </View>
        <Spacer size={6} />
        <Text variant="h3" align="center">No Data Yet</Text>
        <Spacer size={2} />
        <Text variant="body" color="muted" align="center">
          Add miners to your farm to see live metrics and projections here.
        </Text>
      </View>
    </Card>
  );
}

// ═══════════════════════════════════════════════════════════════════
// LIVE METRICS COMPONENT
// ═══════════════════════════════════════════════════════════════════

interface LiveMetricsProps {
  btcPrice: number;
  btcChange: number;
  difficulty: number;
  dailyProfit: number;
  isLoading: boolean;
}

function LiveMetrics({ btcPrice, btcChange, difficulty, dailyProfit, isLoading }: LiveMetricsProps) {
  const { tokens } = useTheme();

  if (isLoading) {
    return (
      <GlassCard padding="lg">
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={tokens.colors.brand.primary} />
          <Spacer size={2} />
          <Text variant="body" color="muted">Loading live data...</Text>
        </View>
      </GlassCard>
    );
  }

  return (
    <GlassCard padding="lg">
      <View style={styles.metricsHeader}>
        <Text variant="label" color="muted">LIVE METRICS</Text>
        <View style={styles.liveIndicator}>
          <View style={[styles.liveDot, { backgroundColor: tokens.colors.semantic.success }]} />
          <Text variant="caption" color="success">Live</Text>
        </View>
      </View>

      <Spacer size={4} />

      <View style={styles.metricsGrid}>
        <MetricDisplay
          label="BTC Price"
          value={btcPrice}
          format="currency"
          trend={btcChange >= 0 ? 'up' : 'down'}
          trendValue={Math.abs(btcChange)}
          size="md"
        />
        <MetricDisplay
          label="Difficulty"
          value={difficulty}
          format="number"
          suffix="T"
          size="md"
        />
      </View>

      <Spacer size={4} />

      <View style={styles.yourMetrics}>
        <MetricDisplay
          label="Your Daily Profit"
          value={dailyProfit}
          format="currency"
          size="lg"
        />
        {btcPrice > 0 && (
          <Text variant="caption" color="muted">
            ≈ ₿{(dailyProfit / btcPrice).toFixed(8)}
          </Text>
        )}
      </View>
    </GlassCard>
  );
}

// ═══════════════════════════════════════════════════════════════════
// SCENARIO COMPARISON COMPONENT
// ═══════════════════════════════════════════════════════════════════

interface ScenarioComparisonProps {
  dailyProfit: number;
}

function ScenarioComparison({ dailyProfit }: ScenarioComparisonProps) {
  const { tokens } = useTheme();

  // Generate scenarios based on current daily profit
  const scenarios = [
    {
      name: 'Hold BTC',
      profit6m: dailyProfit * 180,
      profit12m: dailyProfit * 365,
    },
    {
      name: 'Reinvest TH',
      profit6m: dailyProfit * 180 * 1.2, // Assume 20% growth
      profit12m: dailyProfit * 365 * 1.5, // Assume 50% growth
      best: true,
    },
    {
      name: 'Reinvest GMT',
      profit6m: dailyProfit * 180 * 1.1,
      profit12m: dailyProfit * 365 * 1.2,
    },
    {
      name: 'Hybrid 50/50',
      profit6m: dailyProfit * 180 * 1.15,
      profit12m: dailyProfit * 365 * 1.35,
    },
  ];

  return (
    <Card padding="lg">
      <Text variant="label" color="muted">STRATEGY COMPARISON</Text>
      <Spacer size={4} />

      <View style={styles.tableHeader}>
        <Text variant="caption" color="muted" style={styles.tableCol1}>Strategy</Text>
        <Text variant="caption" color="muted" style={styles.tableCol2}>6 months</Text>
        <Text variant="caption" color="muted" style={styles.tableCol3}>12 months</Text>
      </View>

      <Spacer size={2} />

      {scenarios.map((scenario, index) => (
        <View
          key={scenario.name}
          style={[
            styles.tableRow,
            index !== scenarios.length - 1 && {
              borderBottomWidth: 1,
              borderBottomColor: tokens.colors.border.muted,
            },
          ]}
        >
          <View style={[styles.tableCol1, styles.strategyCell]}>
            <Text variant="bodySmall" weight="medium">{scenario.name}</Text>
            {scenario.best && <Badge variant="brand" size="sm">Best</Badge>}
          </View>
          <Text variant="body" style={styles.tableCol2}>
            ${scenario.profit6m.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </Text>
          <Text
            variant="body"
            weight={scenario.best ? 'bold' : 'regular'}
            color={scenario.best ? 'brand' : 'primary'}
            style={styles.tableCol3}
          >
            ${scenario.profit12m.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </Text>
        </View>
      ))}
    </Card>
  );
}

// ═══════════════════════════════════════════════════════════════════
// MAIN SCREEN
// ═══════════════════════════════════════════════════════════════════

export default function DashboardScreen() {
  const { tokens } = useTheme();
  const insets = useSafeAreaInsets();

  // Get live Bitcoin data
  const { price, priceChange24h, difficulty, isLoading: btcLoading, error } = useBitcoinData();

  // Get farm data with live prices
  const { totalDailyProfitUSD, totalHashrate, minerCount } = useFarm(price, difficulty * 1e12);

  const hasMiners = minerCount > 0;

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
          <Text variant="h2">Dashboard</Text>
          <Text variant="body" color="muted">
            {hasMiners
              ? `Monitoring ${minerCount} miner${minerCount > 1 ? 's' : ''} • ${totalHashrate} TH/s`
              : 'Monitor your mining performance'}
          </Text>
        </View>

        <Spacer size={6} />

        {!hasMiners ? (
          <EmptyDashboardState />
        ) : (
          <>
            {/* Error Alert */}
            {error && (
              <>
                <Alert
                  variant="warning"
                  title="API Connection Issue"
                  message={error}
                />
                <Spacer size={4} />
              </>
            )}

            {/* Live Metrics */}
            <LiveMetrics
              btcPrice={price}
              btcChange={priceChange24h}
              difficulty={difficulty}
              dailyProfit={totalDailyProfitUSD}
              isLoading={btcLoading}
            />

            <Spacer size={4} />

            {/* Projection Chart Placeholder */}
            <Card padding="lg">
              <View style={styles.sectionHeader}>
                <Text variant="label" color="muted">PROJECTION</Text>
                <View style={styles.periodSelector}>
                  <Text variant="caption" color="brand">1M</Text>
                  <Text variant="caption" color="muted">3M</Text>
                  <Text variant="caption" color="muted">1Y</Text>
                </View>
              </View>
              <Spacer size={4} />

              {/* Chart placeholder */}
              <View style={styles.chartPlaceholder}>
                <Icon name="stats-chart" size={48} color="muted" />
                <Spacer size={2} />
                <Text variant="bodySmall" color="muted">
                  Projection chart coming soon
                </Text>
              </View>
            </Card>

            <Spacer size={4} />

            {/* Scenario Comparison */}
            <ScenarioComparison dailyProfit={totalDailyProfitUSD} />
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
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
  },
  metricsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  metricsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  yourMetrics: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
    gap: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  periodSelector: {
    flexDirection: 'row',
    gap: 16,
  },
  chartPlaceholder: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderRadius: 12,
  },
  tableHeader: {
    flexDirection: 'row',
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    alignItems: 'center',
  },
  tableCol1: {
    flex: 2,
  },
  tableCol2: {
    flex: 1,
    textAlign: 'right',
  },
  tableCol3: {
    flex: 1,
    textAlign: 'right',
  },
  strategyCell: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  emptyContent: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
