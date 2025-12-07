import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Pressable } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/theme';
import { Text, Button, Icon, Spacer } from '@/components/atoms';
import { Card, TextInput, SliderInput, CurrencyPicker, DatePicker } from '@/components/molecules';
import { useFarmContext } from '@/contexts';
import type { InvestmentType, Currency } from '@/types';

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
  const { addInvestment, getMiner, updateMiner, btcPrice } = useFarmContext();

  const miner = getMiner(minerId || '');

  // Form state
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [type, setType] = useState<InvestmentType>('initial');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState<Currency>('USD');
  const [note, setNote] = useState('');

  // Details based on type
  const [hashrateBefore, setHashrateBefore] = useState(miner?.hashrate || 0);
  const [hashrateAfter, setHashrateAfter] = useState(miner?.hashrate || 0);
  const [efficiencyBefore, setEfficiencyBefore] = useState(miner?.efficiency || 35);
  const [efficiencyAfter, setEfficiencyAfter] = useState(miner?.efficiency || 35);
  const [tokenDaysBought, setTokenDaysBought] = useState(0);

  // Price estimates for currencies (in production, fetch from API)
  const getDefaultRate = (curr: Currency): number => {
    const rates: Partial<Record<Currency, number>> = {
      BTC: btcPrice || 100000,
      ETH: 3500,
      USDT: 1,
      USDC: 1,
      GMT: 0.5,
      SOL: 200,
      BNB: 600,
      XRP: 2,
      ADA: 1,
      DOGE: 0.4,
      LTC: 100,
      BCH: 450,
      USD: 1,
      EUR: 1.08,
      GBP: 1.27,
      MXN: 0.058,
      BRL: 0.20,
      ARS: 0.001,
      COP: 0.00024,
    };
    return rates[curr] || 1;
  };

  // Calculate USD value
  const calculateUSD = (): number => {
    const num = parseFloat(amount) || 0;
    const rate = getDefaultRate(currency);
    return num * rate;
  };

  const handleSave = () => {
    if (!minerId || !amount) return;

    const amountNum = parseFloat(amount) || 0;
    const amountUSD = calculateUSD();
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
      // Note: discount percentage should be updated manually by user
    }

    addInvestment({
      minerId,
      date,
      type,
      amount: amountNum,
      currency,
      amountUSD,
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
          <DatePicker
            value={date}
            onChange={setDate}
            label="Date"
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
          <Text variant="label" color="muted">INVESTMENT AMOUNT</Text>
          <Spacer size={4} />

          <View style={styles.amountRow}>
            <View style={styles.amountInput}>
              <TextInput
                value={amount}
                onChangeText={setAmount}
                label="Amount"
                placeholder="0.00"
                keyboardType="decimal-pad"
              />
            </View>
            <CurrencyPicker
              value={currency}
              onChange={setCurrency}
              label="Currency"
            />
          </View>

          {amount && (
            <>
              <Spacer size={3} />
              <Text variant="caption" color="muted">
                Estimated USD value: ${calculateUSD().toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </Text>
            </>
          )}
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
              min={0.1}
              max={5000}
              step={0.1}
              unit="TH/s"
              decimals={1}
            />

            <Spacer size={6} />

            <SliderInput
              label="After"
              value={hashrateAfter}
              onValueChange={setHashrateAfter}
              min={0.1}
              max={5000}
              step={0.1}
              unit="TH/s"
              decimals={1}
            />

            <Spacer size={4} />
            <View style={styles.changeIndicator}>
              <Icon name="arrow-up" size={16} color="success" />
              <Text variant="body" color="success">
                +{(hashrateAfter - hashrateBefore).toFixed(1)} TH/s
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
              min={10}
              max={60}
              step={0.1}
              unit="W/TH"
              decimals={1}
            />

            <Spacer size={6} />

            <SliderInput
              label="After"
              value={efficiencyAfter}
              onValueChange={setEfficiencyAfter}
              min={10}
              max={60}
              step={0.1}
              unit="W/TH"
              decimals={1}
            />

            <Spacer size={4} />
            <View style={styles.changeIndicator}>
              <Icon name="arrow-down" size={16} color="success" />
              <Text variant="body" color="success">
                -{(efficiencyBefore - efficiencyAfter).toFixed(1)} W/TH (better)
              </Text>
            </View>
          </Card>
        )}

        {type === 'tokens' && (
          <Card padding="lg">
            <Text variant="label" color="muted">TOKEN PURCHASE</Text>
            <Spacer size={4} />

            <SliderInput
              label="Days Purchased"
              value={tokenDaysBought}
              onValueChange={setTokenDaysBought}
              min={0}
              max={400}
              step={1}
              unit="days"
              decimals={0}
            />

            <Spacer size={4} />
            <Text variant="caption" color="muted">
              Remember to update your miner's discount percentage after purchasing tokens.
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
          disabled={!amount}
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
  amountRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-end',
  },
  amountInput: {
    flex: 1,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
