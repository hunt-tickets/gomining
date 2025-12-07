import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Pressable } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/theme';
import { Text, Button, Icon, Spacer } from '@/components/atoms';
import { Card, TextInput, SliderInput } from '@/components/molecules';
import { useFarmContext } from '@/contexts';
import type { PaymentCurrency } from '@/types';

// ═══════════════════════════════════════════════════════════════════
// CURRENCY SELECTOR
// ═══════════════════════════════════════════════════════════════════

interface CurrencySelectorProps {
  value: PaymentCurrency;
  onChange: (currency: PaymentCurrency) => void;
  label: string;
}

function CurrencySelector({ value, onChange, label }: CurrencySelectorProps) {
  const { tokens } = useTheme();

  return (
    <View style={styles.currencySelector}>
      <Text variant="caption" color="muted">{label}</Text>
      <View style={styles.currencyButtons}>
        <Pressable
          style={[
            styles.currencyButton,
            value === 'BTC' && { backgroundColor: tokens.colors.brand.primary },
            { borderColor: tokens.colors.border.default },
          ]}
          onPress={() => onChange('BTC')}
        >
          <Text
            variant="bodySmall"
            weight="semibold"
            color={value === 'BTC' ? 'inverse' : 'muted'}
          >
            BTC
          </Text>
        </Pressable>
        <Pressable
          style={[
            styles.currencyButton,
            value === 'GMT' && { backgroundColor: tokens.colors.brand.primary },
            { borderColor: tokens.colors.border.default },
          ]}
          onPress={() => onChange('GMT')}
        >
          <Text
            variant="bodySmall"
            weight="semibold"
            color={value === 'GMT' ? 'inverse' : 'muted'}
          >
            GMT
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

// ═══════════════════════════════════════════════════════════════════
// MAIN SCREEN
// ═══════════════════════════════════════════════════════════════════

export default function AddIncomeScreen() {
  const { minerId } = useLocalSearchParams<{ minerId: string }>();
  const { tokens } = useTheme();
  const insets = useSafeAreaInsets();
  const { addIncomeRecord, getMiner, btcPrice } = useFarmContext();

  const miner = getMiner(minerId || '');

  // Form state
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  // Gross income
  const [grossIncome, setGrossIncome] = useState('');
  const [grossIncomeCurrency, setGrossIncomeCurrency] = useState<PaymentCurrency>('BTC');

  // Electricity
  const [electricityCost, setElectricityCost] = useState('');
  const [electricityCurrency, setElectricityCurrency] = useState<PaymentCurrency>('BTC');

  // Service
  const [serviceCost, setServiceCost] = useState('');
  const [serviceCurrency, setServiceCurrency] = useState<PaymentCurrency>('BTC');

  // Discount
  const [discountPercent, setDiscountPercent] = useState(0);

  // Reinvestment
  const [didReinvest, setDidReinvest] = useState(false);
  const [reinvestAmount, setReinvestAmount] = useState('');
  const [reinvestCurrency, setReinvestCurrency] = useState<PaymentCurrency>('BTC');
  const [reinvestType, setReinvestType] = useState<'hashrate' | 'tokens' | 'efficiency'>('hashrate');

  // Note
  const [note, setNote] = useState('');

  // Calculate USD values (simplified - in production you'd use historical prices)
  const calculateUSD = (amount: string, currency: PaymentCurrency): number => {
    const num = parseFloat(amount) || 0;
    if (currency === 'BTC') {
      return num * (btcPrice || 100000); // Use current BTC price or estimate
    }
    // GMT token price estimate (you'd want to fetch this)
    return num * 0.5; // Approximate GMT price
  };

  const handleSave = () => {
    if (!minerId || !grossIncome) return;

    const grossIncomeNum = parseFloat(grossIncome) || 0;
    const electricityCostNum = parseFloat(electricityCost) || 0;
    const serviceCostNum = parseFloat(serviceCost) || 0;

    const grossIncomeUSD = calculateUSD(grossIncome, grossIncomeCurrency);
    const electricityCostUSD = calculateUSD(electricityCost, electricityCurrency);
    const serviceCostUSD = calculateUSD(serviceCost, serviceCurrency);

    // Apply discount to costs
    const discountedElectricity = electricityCostUSD * (1 - discountPercent / 100);
    const discountedService = serviceCostUSD * (1 - discountPercent / 100);

    const netIncomeUSD = grossIncomeUSD - discountedElectricity - discountedService;

    addIncomeRecord({
      minerId,
      date,
      grossIncome: grossIncomeNum,
      grossIncomeCurrency,
      grossIncomeUSD,
      electricityCost: electricityCostNum,
      electricityCurrency,
      electricityCostUSD: discountedElectricity,
      serviceCost: serviceCostNum,
      serviceCurrency,
      serviceCostUSD: discountedService,
      discountPercent,
      netIncome: netIncomeUSD / (btcPrice || 100000), // Convert back to BTC for net
      netIncomeCurrency: 'BTC',
      netIncomeUSD,
      reinvestment: didReinvest
        ? {
            amount: parseFloat(reinvestAmount) || 0,
            currency: reinvestCurrency,
            type: reinvestType,
          }
        : undefined,
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
        <Text variant="h2">Add Income</Text>
        <Text variant="body" color="muted">Record daily mining income for {miner.name}</Text>

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

        {/* Gross Income */}
        <Card padding="lg">
          <Text variant="label" color="muted">GROSS INCOME</Text>
          <Spacer size={4} />

          <View style={styles.amountRow}>
            <View style={styles.amountInput}>
              <TextInput
                value={grossIncome}
                onChangeText={setGrossIncome}
                label="Amount"
                placeholder="0.00000000"
                keyboardType="decimal-pad"
              />
            </View>
            <CurrencySelector
              value={grossIncomeCurrency}
              onChange={setGrossIncomeCurrency}
              label="Currency"
            />
          </View>
        </Card>

        <Spacer size={4} />

        {/* Costs */}
        <Card padding="lg">
          <Text variant="label" color="muted">COSTS</Text>
          <Spacer size={4} />

          <View style={styles.amountRow}>
            <View style={styles.amountInput}>
              <TextInput
                value={electricityCost}
                onChangeText={setElectricityCost}
                label="Electricity"
                placeholder="0.00000000"
                keyboardType="decimal-pad"
              />
            </View>
            <CurrencySelector
              value={electricityCurrency}
              onChange={setElectricityCurrency}
              label="Paid in"
            />
          </View>

          <Spacer size={4} />

          <View style={styles.amountRow}>
            <View style={styles.amountInput}>
              <TextInput
                value={serviceCost}
                onChangeText={setServiceCost}
                label="Service Fee"
                placeholder="0.00000000"
                keyboardType="decimal-pad"
              />
            </View>
            <CurrencySelector
              value={serviceCurrency}
              onChange={setServiceCurrency}
              label="Paid in"
            />
          </View>
        </Card>

        <Spacer size={4} />

        {/* Discount */}
        <Card padding="lg">
          <SliderInput
            label="Discount Applied"
            value={discountPercent}
            onValueChange={setDiscountPercent}
            min={0}
            max={29}
            step={0.5}
            valueFormatter={(v) => `${v.toFixed(1)}%`}
          />
        </Card>

        <Spacer size={4} />

        {/* Reinvestment */}
        <Card padding="lg">
          <Pressable
            style={styles.toggleRow}
            onPress={() => setDidReinvest(!didReinvest)}
          >
            <View>
              <Text variant="body" weight="semibold">Reinvested Earnings</Text>
              <Text variant="caption" color="muted">Did you reinvest part of today's earnings?</Text>
            </View>
            <Icon
              name={didReinvest ? 'checkbox' : 'square-outline'}
              size={24}
              color={didReinvest ? 'brand' : 'muted'}
            />
          </Pressable>

          {didReinvest && (
            <>
              <Spacer size={4} />

              <View style={styles.amountRow}>
                <View style={styles.amountInput}>
                  <TextInput
                    value={reinvestAmount}
                    onChangeText={setReinvestAmount}
                    label="Amount Reinvested"
                    placeholder="0.00000000"
                    keyboardType="decimal-pad"
                  />
                </View>
                <CurrencySelector
                  value={reinvestCurrency}
                  onChange={setReinvestCurrency}
                  label="Currency"
                />
              </View>

              <Spacer size={4} />

              <Text variant="caption" color="muted">Reinvested In</Text>
              <Spacer size={2} />
              <View style={styles.reinvestTypes}>
                {(['hashrate', 'efficiency', 'tokens'] as const).map((type) => (
                  <Pressable
                    key={type}
                    style={[
                      styles.reinvestTypeButton,
                      reinvestType === type && { backgroundColor: tokens.colors.brand.primary },
                      { borderColor: tokens.colors.border.default },
                    ]}
                    onPress={() => setReinvestType(type)}
                  >
                    <Text
                      variant="bodySmall"
                      color={reinvestType === type ? 'inverse' : 'muted'}
                    >
                      {type === 'hashrate' ? 'TH/s' : type === 'efficiency' ? 'Efficiency' : 'Tokens'}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </>
          )}
        </Card>

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
          disabled={!grossIncome}
          onPress={handleSave}
        >
          Save Income Record
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
  currencySelector: {
    gap: 4,
  },
  currencyButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  currencyButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reinvestTypes: {
    flexDirection: 'row',
    gap: 8,
  },
  reinvestTypeButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
});
