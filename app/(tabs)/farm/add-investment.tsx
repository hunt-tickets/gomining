import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Pressable } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/theme';
import { Text, Button, Icon, Spacer } from '@/components/atoms';
import { Card, TextInput, SliderInput } from '@/components/molecules';
import { useFarmContext } from '@/contexts';
import type { InvestmentType } from '@/types';

// ═══════════════════════════════════════════════════════════════════
// INVESTMENT TYPE SELECTOR
// ═══════════════════════════════════════════════════════════════════

interface TypeSelectorProps {
  value: InvestmentType;
  onChange: (type: InvestmentType) => void;
}

function TypeSelector({ value, onChange }: TypeSelectorProps) {
  const { tokens } = useTheme();

  const types: { key: InvestmentType; label: string; icon: string; description: string }[] = [
    { key: 'initial', label: 'Initial Purchase', icon: 'cart', description: 'First miner purchase' },
    { key: 'hashrate', label: 'Hashrate Upgrade', icon: 'trending-up', description: 'Buying more TH/s' },
    { key: 'efficiency', label: 'Efficiency Upgrade', icon: 'flash', description: 'Improving W/TH' },
    { key: 'tokens', label: 'Token Purchase', icon: 'diamond', description: 'GMT for discounts' },
  ];

  return (
    <View style={styles.typeSelector}>
      {types.map((type) => (
        <Pressable
          key={type.key}
          style={[
            styles.typeOption,
            value === type.key && {
              backgroundColor: tokens.colors.brand.primaryMuted,
              borderColor: tokens.colors.brand.primary,
            },
            { borderColor: tokens.colors.border.default },
          ]}
          onPress={() => onChange(type.key)}
        >
          <Icon
            name={type.icon as any}
            size={24}
            color={value === type.key ? 'brand' : 'muted'}
          />
          <View style={styles.typeText}>
            <Text
              variant="bodySmall"
              weight="semibold"
              color={value === type.key ? 'brand' : 'primary'}
            >
              {type.label}
            </Text>
            <Text variant="caption" color="muted">{type.description}</Text>
          </View>
        </Pressable>
      ))}
    </View>
  );
}

// ═══════════════════════════════════════════════════════════════════
// MAIN SCREEN
// ═══════════════════════════════════════════════════════════════════

export default function AddInvestmentScreen() {
  const { minerId } = useLocalSearchParams<{ minerId: string }>();
  const { tokens } = useTheme();
  const insets = useSafeAreaInsets();
  const { addInvestment, getMiner, updateMiner } = useFarmContext();

  const miner = getMiner(minerId || '');

  // Form state
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [type, setType] = useState<InvestmentType>('initial');
  const [amountUSD, setAmountUSD] = useState('');
  const [note, setNote] = useState('');

  // Details based on type
  const [hashrateBefore, setHashrateBefore] = useState(miner?.hashrate || 0);
  const [hashrateAfter, setHashrateAfter] = useState(miner?.hashrate || 0);
  const [efficiencyBefore, setEfficiencyBefore] = useState(miner?.efficiency || 35);
  const [efficiencyAfter, setEfficiencyAfter] = useState(miner?.efficiency || 35);
  const [tokenDaysBought, setTokenDaysBought] = useState(0);

  const handleSave = () => {
    if (!minerId || !amountUSD) return;

    const details: any = {};

    if (type === 'hashrate') {
      details.hashrateBefore = hashrateBefore;
      details.hashrateAfter = hashrateAfter;
      // Update miner hashrate
      if (miner && hashrateAfter !== miner.hashrate) {
        updateMiner(minerId, { hashrate: hashrateAfter });
      }
    } else if (type === 'efficiency') {
      details.efficiencyBefore = efficiencyBefore;
      details.efficiencyAfter = efficiencyAfter;
      // Update miner efficiency
      if (miner && efficiencyAfter !== miner.efficiency) {
        updateMiner(minerId, { efficiency: efficiencyAfter });
      }
    } else if (type === 'tokens') {
      details.tokenDaysBought = tokenDaysBought;
      // Update miner token days
      if (miner) {
        updateMiner(minerId, {
          discounts: {
            ...miner.discounts,
            tokenDays: miner.discounts.tokenDays + tokenDaysBought,
          },
        });
      }
    }

    addInvestment({
      minerId,
      date,
      type,
      amountUSD: parseFloat(amountUSD) || 0,
      details: Object.keys(details).length > 0 ? details : undefined,
      note: note || undefined,
    });

    router.back();
  };

  if (!miner) {
    return (
      <View style={[styles.container, { backgroundColor: tokens.colors.background.primary }]}>
        <Text variant="h3">Miner not found</Text>
      </View>
    );
  }

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
        <Text variant="h2">Add Investment</Text>
        <Text variant="body" color="muted">Track investment in {miner.name}</Text>

        <Spacer size={6} />

        {/* Date */}
        <Card padding="lg">
          <TextInput
            value={date}
            onChangeText={setDate}
            label="Date"
            placeholder="YYYY-MM-DD"
            leftIcon="calendar-outline"
          />
        </Card>

        <Spacer size={4} />

        {/* Investment Type */}
        <Card padding="lg">
          <Text variant="label" color="muted">INVESTMENT TYPE</Text>
          <Spacer size={4} />
          <TypeSelector value={type} onChange={setType} />
        </Card>

        <Spacer size={4} />

        {/* Amount */}
        <Card padding="lg">
          <TextInput
            value={amountUSD}
            onChangeText={setAmountUSD}
            label="Amount (USD)"
            placeholder="0.00"
            keyboardType="decimal-pad"
            leftIcon="cash-outline"
          />
        </Card>

        <Spacer size={4} />

        {/* Type-specific details */}
        {type === 'hashrate' && (
          <Card padding="lg">
            <Text variant="label" color="muted">HASHRATE CHANGE</Text>
            <Spacer size={4} />

            <SliderInput
              label="Before"
              value={hashrateBefore}
              onValueChange={setHashrateBefore}
              min={1}
              max={5000}
              step={1}
              valueFormatter={(v) => `${v} TH/s`}
            />

            <Spacer size={6} />

            <SliderInput
              label="After"
              value={hashrateAfter}
              onValueChange={setHashrateAfter}
              min={1}
              max={5000}
              step={1}
              valueFormatter={(v) => `${v} TH/s`}
            />

            <Spacer size={4} />
            <View style={styles.changeIndicator}>
              <Icon name="arrow-up" size={16} color="success" />
              <Text variant="body" color="success">
                +{hashrateAfter - hashrateBefore} TH/s
              </Text>
            </View>
          </Card>
        )}

        {type === 'efficiency' && (
          <Card padding="lg">
            <Text variant="label" color="muted">EFFICIENCY CHANGE</Text>
            <Spacer size={4} />

            <SliderInput
              label="Before"
              value={efficiencyBefore}
              onValueChange={setEfficiencyBefore}
              min={15}
              max={50}
              step={1}
              valueFormatter={(v) => `${v} W/TH`}
            />

            <Spacer size={6} />

            <SliderInput
              label="After"
              value={efficiencyAfter}
              onValueChange={setEfficiencyAfter}
              min={15}
              max={50}
              step={1}
              valueFormatter={(v) => `${v} W/TH`}
            />

            <Spacer size={4} />
            <View style={styles.changeIndicator}>
              <Icon name="arrow-down" size={16} color="success" />
              <Text variant="body" color="success">
                -{efficiencyBefore - efficiencyAfter} W/TH (better)
              </Text>
            </View>
          </Card>
        )}

        {type === 'tokens' && (
          <Card padding="lg">
            <Text variant="label" color="muted">TOKEN COVERAGE</Text>
            <Spacer size={4} />

            <SliderInput
              label="Days Purchased"
              value={tokenDaysBought}
              onValueChange={setTokenDaysBought}
              min={0}
              max={400}
              step={10}
              valueFormatter={(v) => `${v} days`}
            />

            <Spacer size={4} />
            <Text variant="caption" color="muted">
              Current coverage: {miner.discounts.tokenDays} days
            </Text>
            <Text variant="caption" color="brand">
              After purchase: {miner.discounts.tokenDays + tokenDaysBought} days
            </Text>
          </Card>
        )}

        <Spacer size={4} />

        {/* Note */}
        <Card padding="lg">
          <TextInput
            value={note}
            onChangeText={setNote}
            label="Note (Optional)"
            placeholder="Any additional notes..."
            multiline
          />
        </Card>

        <Spacer size={6} />

        <Button
          variant="primary"
          fullWidth
          disabled={!amountUSD}
          onPress={handleSave}
        >
          Save Investment
        </Button>
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
  typeSelector: {
    gap: 12,
  },
  typeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  typeText: {
    flex: 1,
    gap: 2,
  },
  changeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    borderRadius: 8,
  },
});
