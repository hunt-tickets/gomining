import React, { useState, useMemo } from 'react';
import { View, ScrollView, StyleSheet, Pressable } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/theme';
import { Text, Button, Icon, Spacer, Badge } from '@/components/atoms';
import { Card, SliderInput } from '@/components/molecules';
import { useFarmContext } from '@/contexts';

// ═══════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════

type Strategy = 'hodl' | 'hashrate' | 'efficiency' | 'discount' | 'balanced';

interface SimulationResult {
  strategy: Strategy;
  name: string;
  description: string;
  projection: {
    days30: number;
    days90: number;
    days180: number;
    days365: number;
  };
  totalEarnings: number;
  growth: number;
}

// ═══════════════════════════════════════════════════════════════════
// STRATEGY SELECTOR
// ═══════════════════════════════════════════════════════════════════

interface StrategySelectorProps {
  selected: Strategy;
  onSelect: (strategy: Strategy) => void;
}

const STRATEGIES: { key: Strategy; name: string; icon: string }[] = [
  { key: 'hodl', name: 'HODL', icon: 'wallet' },
  { key: 'hashrate', name: 'Hashrate', icon: 'trending-up' },
  { key: 'efficiency', name: 'Efficiency', icon: 'flash' },
  { key: 'discount', name: 'Max Discount', icon: 'pricetag' },
  { key: 'balanced', name: 'Balanced', icon: 'git-merge' },
];

function StrategySelector({ selected, onSelect }: StrategySelectorProps) {
  const { tokens } = useTheme();

  return (
    <View style={styles.strategyGrid}>
      {STRATEGIES.map((strategy) => (
        <Pressable
          key={strategy.key}
          style={[
            styles.strategyItem,
            {
              backgroundColor: selected === strategy.key
                ? tokens.colors.brand.primary
                : tokens.colors.background.tertiary,
              borderColor: selected === strategy.key
                ? tokens.colors.brand.primary
                : tokens.colors.border.default,
            },
          ]}
          onPress={() => onSelect(strategy.key)}
        >
          <Icon
            name={strategy.icon as any}
            size={20}
            color={selected === strategy.key ? '#FFFFFF' : 'muted'}
          />
          <Text
            variant="caption"
            weight={selected === strategy.key ? 'bold' : 'regular'}
            color={selected === strategy.key ? 'inverse' : 'muted'}
          >
            {strategy.name}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

// ═══════════════════════════════════════════════════════════════════
// RESULT CARD
// ═══════════════════════════════════════════════════════════════════

interface ResultCardProps {
  result: SimulationResult;
  isBest: boolean;
}

function ResultCard({ result, isBest }: ResultCardProps) {
  const { tokens } = useTheme();

  return (
    <Card
      padding="lg"
      style={isBest ? {
        borderWidth: 2,
        borderColor: tokens.colors.brand.primary,
      } : undefined}
    >
      <View style={styles.resultHeader}>
        <View>
          <View style={styles.resultTitleRow}>
            <Text variant="h4">{result.name}</Text>
            {isBest && <Badge variant="brand" size="sm">Best</Badge>}
          </View>
          <Text variant="caption" color="muted">{result.description}</Text>
        </View>
        <View style={styles.growthBadge}>
          <Text variant="h3" color={result.growth >= 0 ? 'success' : 'error'}>
            {result.growth >= 0 ? '+' : ''}{result.growth.toFixed(0)}%
          </Text>
          <Text variant="caption" color="muted">Growth</Text>
        </View>
      </View>

      <Spacer size={4} />

      <View style={styles.projectionGrid}>
        <View style={styles.projectionItem}>
          <Text variant="caption" color="muted">30 days</Text>
          <Text variant="body" weight="semibold">
            ${result.projection.days30.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </Text>
        </View>
        <View style={styles.projectionItem}>
          <Text variant="caption" color="muted">90 days</Text>
          <Text variant="body" weight="semibold">
            ${result.projection.days90.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </Text>
        </View>
        <View style={styles.projectionItem}>
          <Text variant="caption" color="muted">180 days</Text>
          <Text variant="body" weight="semibold">
            ${result.projection.days180.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </Text>
        </View>
        <View style={styles.projectionItem}>
          <Text variant="caption" color="muted">1 year</Text>
          <Text variant="body" weight="bold" color="brand">
            ${result.projection.days365.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </Text>
        </View>
      </View>
    </Card>
  );
}

// ═══════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════

export default function SimulationResultModal() {
  const { tokens } = useTheme();
  const insets = useSafeAreaInsets();
  const { totalDailyProfitUSD, totalHashrate, minersWithStats } = useFarmContext();

  const [selectedStrategy, setSelectedStrategy] = useState<Strategy>('balanced');
  const [reinvestPercent, setReinvestPercent] = useState(50);
  const [projectionDays, setProjectionDays] = useState(365);

  // Calculate simulations based on current farm data
  const simulations = useMemo<SimulationResult[]>(() => {
    const dailyProfit = totalDailyProfitUSD || 10; // Fallback for demo
    const currentHashrate = totalHashrate || 100;

    // Get average discount from miners
    const avgDiscount = minersWithStats.length > 0
      ? minersWithStats.reduce((sum, m) => sum + m.averageDiscountPercent, 0) / minersWithStats.length
      : 10;

    const calculateProjection = (
      dailyGrowthRate: number,
      reinvestRatio: number,
    ) => {
      let accumulated = 0;
      let currentDaily = dailyProfit;

      for (let day = 1; day <= 365; day++) {
        accumulated += currentDaily * (1 - reinvestRatio);
        currentDaily *= (1 + dailyGrowthRate);
      }

      return {
        days30: dailyProfit * 30 * (1 + dailyGrowthRate * 15),
        days90: dailyProfit * 90 * (1 + dailyGrowthRate * 45),
        days180: dailyProfit * 180 * (1 + dailyGrowthRate * 90),
        days365: accumulated,
      };
    };

    const reinvestRatio = reinvestPercent / 100;

    return [
      {
        strategy: 'hodl',
        name: 'HODL Strategy',
        description: 'No reinvestment, accumulate all BTC',
        projection: calculateProjection(0, 0),
        totalEarnings: dailyProfit * 365,
        growth: 0,
      },
      {
        strategy: 'hashrate',
        name: 'Compound Hashrate',
        description: `Reinvest ${reinvestPercent}% in more TH/s`,
        projection: calculateProjection(0.001 * reinvestRatio, reinvestRatio),
        totalEarnings: dailyProfit * 365 * (1 + 0.3 * reinvestRatio),
        growth: 30 * reinvestRatio,
      },
      {
        strategy: 'efficiency',
        name: 'Boost Efficiency',
        description: `Reinvest ${reinvestPercent}% in W/TH upgrades`,
        projection: calculateProjection(0.0008 * reinvestRatio, reinvestRatio),
        totalEarnings: dailyProfit * 365 * (1 + 0.2 * reinvestRatio),
        growth: 20 * reinvestRatio,
      },
      {
        strategy: 'discount',
        name: 'Max Discount',
        description: `Buy GMT tokens to reach ${Math.min(29, avgDiscount + 10 * reinvestRatio).toFixed(0)}% discount`,
        projection: calculateProjection(0.0005 * reinvestRatio, reinvestRatio),
        totalEarnings: dailyProfit * 365 * (1 + 0.15 * reinvestRatio),
        growth: 15 * reinvestRatio,
      },
      {
        strategy: 'balanced',
        name: 'Balanced Mix',
        description: 'Split between hashrate, efficiency & discount',
        projection: calculateProjection(0.0007 * reinvestRatio, reinvestRatio),
        totalEarnings: dailyProfit * 365 * (1 + 0.25 * reinvestRatio),
        growth: 25 * reinvestRatio,
      },
    ];
  }, [totalDailyProfitUSD, totalHashrate, minersWithStats, reinvestPercent]);

  // Find the best strategy
  const bestStrategy = useMemo(() => {
    return simulations.reduce((best, current) =>
      current.totalEarnings > best.totalEarnings ? current : best
    );
  }, [simulations]);

  // Get selected simulation
  const selectedSimulation = simulations.find(s => s.strategy === selectedStrategy);

  return (
    <View style={[styles.container, { backgroundColor: tokens.colors.background.primary }]}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Text variant="h3">Strategy Simulator</Text>
        <Pressable onPress={() => router.back()}>
          <Icon name="close" size={24} color="primary" />
        </Pressable>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 24 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Current Stats */}
        <Card padding="md">
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text variant="caption" color="muted">Daily Profit</Text>
              <Text variant="body" weight="bold">${totalDailyProfitUSD.toFixed(2)}</Text>
            </View>
            <View style={styles.statItem}>
              <Text variant="caption" color="muted">Total Hashrate</Text>
              <Text variant="body" weight="bold">{totalHashrate} TH/s</Text>
            </View>
            <View style={styles.statItem}>
              <Text variant="caption" color="muted">Miners</Text>
              <Text variant="body" weight="bold">{minersWithStats.length}</Text>
            </View>
          </View>
        </Card>

        <Spacer size={4} />

        {/* Reinvest Slider */}
        <Card padding="lg">
          <SliderInput
            label="Reinvestment Rate"
            value={reinvestPercent}
            onValueChange={setReinvestPercent}
            min={0}
            max={100}
            step={5}
            unit="%"
            decimals={0}
          />
        </Card>

        <Spacer size={4} />

        {/* Strategy Selector */}
        <Text variant="label" color="muted">SELECT STRATEGY</Text>
        <Spacer size={2} />
        <StrategySelector selected={selectedStrategy} onSelect={setSelectedStrategy} />

        <Spacer size={4} />

        {/* Selected Result */}
        {selectedSimulation && (
          <ResultCard
            result={selectedSimulation}
            isBest={selectedSimulation.strategy === bestStrategy.strategy}
          />
        )}

        <Spacer size={4} />

        {/* Comparison Table */}
        <Card padding="lg">
          <Text variant="label" color="muted">ALL STRATEGIES COMPARISON</Text>
          <Spacer size={4} />

          <View style={styles.comparisonHeader}>
            <Text variant="caption" color="muted" style={styles.compCol1}>Strategy</Text>
            <Text variant="caption" color="muted" style={styles.compCol2}>1 Year</Text>
            <Text variant="caption" color="muted" style={styles.compCol3}>Growth</Text>
          </View>

          {simulations.map((sim) => (
            <Pressable
              key={sim.strategy}
              style={[
                styles.comparisonRow,
                { borderBottomColor: tokens.colors.border.muted },
                selectedStrategy === sim.strategy && {
                  backgroundColor: tokens.colors.brand.primaryMuted,
                },
              ]}
              onPress={() => setSelectedStrategy(sim.strategy)}
            >
              <View style={styles.compCol1}>
                <Text variant="bodySmall" weight={sim.strategy === bestStrategy.strategy ? 'bold' : 'regular'}>
                  {sim.name}
                </Text>
                {sim.strategy === bestStrategy.strategy && (
                  <Badge variant="brand" size="sm">Best</Badge>
                )}
              </View>
              <Text variant="body" weight="semibold" style={styles.compCol2}>
                ${sim.projection.days365.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </Text>
              <Text
                variant="body"
                color={sim.growth >= 0 ? 'success' : 'error'}
                style={styles.compCol3}
              >
                {sim.growth >= 0 ? '+' : ''}{sim.growth.toFixed(0)}%
              </Text>
            </Pressable>
          ))}
        </Card>

        <Spacer size={4} />

        <Text variant="caption" color="muted" align="center">
          * Projections are estimates based on current data and market conditions.
          Actual results may vary.
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    gap: 4,
  },
  strategyGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  strategyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  resultTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  growthBadge: {
    alignItems: 'flex-end',
  },
  projectionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  projectionItem: {
    alignItems: 'center',
    gap: 4,
  },
  comparisonHeader: {
    flexDirection: 'row',
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  comparisonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderRadius: 4,
    marginHorizontal: -8,
    paddingHorizontal: 8,
  },
  compCol1: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  compCol2: {
    flex: 1,
    textAlign: 'right',
  },
  compCol3: {
    flex: 1,
    textAlign: 'right',
  },
});
