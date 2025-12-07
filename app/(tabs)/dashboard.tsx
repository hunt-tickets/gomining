import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/theme';
import { Text, Icon, Spacer, Badge } from '@/components/atoms';
import { Card, GlassCard, MetricDisplay, Alert } from '@/components/molecules';

// ═══════════════════════════════════════════════════════════════════
// MOCK DATA
// ═══════════════════════════════════════════════════════════════════

const mockData = {
  btcPrice: 94250,
  btcChange: 2.3,
  difficulty: 149.3,
  difficultyChange: 1.2,
  dailyProfit: 9.71,
  totalHashrate: 450,
};

const mockScenarios = [
  { name: 'Hold BTC', profit6m: 1750, profit12m: 3500 },
  { name: 'Reinvest TH', profit6m: 2100, profit12m: 5200, best: true },
  { name: 'Reinvest GMT', profit6m: 1900, profit12m: 4100 },
  { name: 'Hybrid 50/50', profit6m: 1950, profit12m: 4400 },
];

// ═══════════════════════════════════════════════════════════════════
// LIVE METRICS COMPONENT
// ═══════════════════════════════════════════════════════════════════

function LiveMetrics() {
  const { tokens } = useTheme();

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
          value={mockData.btcPrice}
          format="currency"
          trend="up"
          trendValue={mockData.btcChange}
          size="md"
        />
        <MetricDisplay
          label="Difficulty"
          value={mockData.difficulty}
          format="number"
          suffix="T"
          trend="up"
          trendValue={mockData.difficultyChange}
          size="md"
        />
      </View>

      <Spacer size={4} />

      <View style={styles.yourMetrics}>
        <MetricDisplay
          label="Your Daily Profit"
          value={mockData.dailyProfit}
          format="currency"
          size="lg"
        />
        <Text variant="caption" color="muted">
          ≈ ₿{(mockData.dailyProfit / mockData.btcPrice).toFixed(8)}
        </Text>
      </View>
    </GlassCard>
  );
}

// ═══════════════════════════════════════════════════════════════════
// SCENARIO COMPARISON COMPONENT
// ═══════════════════════════════════════════════════════════════════

function ScenarioComparison() {
  const { tokens } = useTheme();

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

      {mockScenarios.map((scenario, index) => (
        <View
          key={scenario.name}
          style={[
            styles.tableRow,
            index !== mockScenarios.length - 1 && {
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
            ${scenario.profit6m.toLocaleString()}
          </Text>
          <Text
            variant="body"
            weight={scenario.best ? 'bold' : 'regular'}
            color={scenario.best ? 'brand' : 'primary'}
            style={styles.tableCol3}
          >
            ${scenario.profit12m.toLocaleString()}
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
            Monitor your mining performance
          </Text>
        </View>

        <Spacer size={6} />

        {/* Alert */}
        <Alert
          variant="info"
          title="Difficulty Adjustment"
          message="Bitcoin difficulty increased 5.2% this epoch. Your estimated daily profit may be affected."
          action={{
            label: 'View Details',
            onPress: () => console.log('View details'),
          }}
        />

        <Spacer size={4} />

        {/* Live Metrics */}
        <LiveMetrics />

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
              Projection chart will be displayed here
            </Text>
          </View>
        </Card>

        <Spacer size={4} />

        {/* Scenario Comparison */}
        <ScenarioComparison />
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
});
