import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Pressable } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/theme';
import { Text, Button, Icon, Spacer } from '@/components/atoms';
import { Card, TextInput, SliderInput, CurrencyPicker } from '@/components/molecules';
import { useFarmContext } from '@/contexts';
import type { Currency } from '@/types';

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
  const [grossIncomeCurrency, setGrossIncomeCurrency] = useState<Currency>('BTC');
  const [useManualGrossRate, setUseManualGrossRate] = useState(false);
  const [manualGrossRate, setManualGrossRate] = useState('');

  // Electricity
  const [electricityCost, setElectricityCost] = useState('');
  const [electricityCurrency, setElectricityCurrency] = useState<Currency>('BTC');
  const [useManualElectricityRate, setUseManualElectricityRate] = useState(false);
  const [manualElectricityRate, setManualElectricityRate] = useState('');

  // Service
  const [serviceCost, setServiceCost] = useState('');
  const [serviceCurrency, setServiceCurrency] = useState<Currency>('BTC');
  const [useManualServiceRate, setUseManualServiceRate] = useState(false);
  const [manualServiceRate, setManualServiceRate] = useState('');

  // Discount
  const [discountPercent, setDiscountPercent] = useState(0);

  // Reinvestment
  const [didReinvest, setDidReinvest] = useState(false);
  const [reinvestAmount, setReinvestAmount] = useState('');
  const [reinvestCurrency, setReinvestCurrency] = useState<Currency>('BTC');
  const [reinvestType, setReinvestType] = useState<'hashrate' | 'tokens' | 'efficiency'>('hashrate');

  // Note
  const [note, setNote] = useState('');

  // Price estimates for currencies (in production, fetch from API)
  const getDefaultRate = (currency: Currency): number => {
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
    return rates[currency] || 1;
  };

  // Calculate USD values with manual rate option
  const calculateUSD = (amount: string, currency: Currency, manualRate?: string): number => {
    const num = parseFloat(amount) || 0;
    const rate = manualRate ? parseFloat(manualRate) : getDefaultRate(currency);
    return num * rate;
  };

  const handleSave = () => {
    if (!minerId || !grossIncome) return;

    const grossIncomeNum = parseFloat(grossIncome) || 0;
    const electricityCostNum = parseFloat(electricityCost) || 0;
    const serviceCostNum = parseFloat(serviceCost) || 0;

    const grossIncomeUSD = calculateUSD(
      grossIncome,
      grossIncomeCurrency,
      useManualGrossRate ? manualGrossRate : undefined
    );
    const electricityCostUSD = calculateUSD(
      electricityCost,
      electricityCurrency,
      useManualElectricityRate ? manualElectricityRate : undefined
    );
    const serviceCostUSD = calculateUSD(
      serviceCost,
      serviceCurrency,
      useManualServiceRate ? manualServiceRate : undefined
    );

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
            <CurrencyPicker
              value={grossIncomeCurrency}
              onChange={setGrossIncomeCurrency}
              label="Currency"
            />
          </View>

          <Spacer size={3} />

          <Pressable
            style={styles.toggleRow}
            onPress={() => setUseManualGrossRate(!useManualGrossRate)}
          >
            <Text variant="caption" color="muted">Use manual price</Text>
            <Icon
              name={useManualGrossRate ? 'checkbox' : 'square-outline'}
              size={20}
              color={useManualGrossRate ? 'brand' : 'muted'}
            />
          </Pressable>

          {useManualGrossRate && (
            <>
              <Spacer size={2} />
              <TextInput
                value={manualGrossRate}
                onChangeText={setManualGrossRate}
                label="USD Rate"
                placeholder={`1 ${grossIncomeCurrency} = ? USD`}
                keyboardType="decimal-pad"
              />
            </>
          )}
        </Card>

        <Spacer size={4} />

        {/* Costs */}
        <Card padding="lg">
          <Text variant="label" color="muted">ELECTRICITY COST</Text>
          <Spacer size={4} />

          <View style={styles.amountRow}>
            <View style={styles.amountInput}>
              <TextInput
                value={electricityCost}
                onChangeText={setElectricityCost}
                label="Amount"
                placeholder="0.00000000"
                keyboardType="decimal-pad"
              />
            </View>
            <CurrencyPicker
              value={electricityCurrency}
              onChange={setElectricityCurrency}
              label="Paid in"
            />
          </View>

          <Spacer size={3} />

          <Pressable
            style={styles.toggleRow}
            onPress={() => setUseManualElectricityRate(!useManualElectricityRate)}
          >
            <Text variant="caption" color="muted">Use manual price</Text>
            <Icon
              name={useManualElectricityRate ? 'checkbox' : 'square-outline'}
              size={20}
              color={useManualElectricityRate ? 'brand' : 'muted'}
            />
          </Pressable>

          {useManualElectricityRate && (
            <>
              <Spacer size={2} />
              <TextInput
                value={manualElectricityRate}
                onChangeText={setManualElectricityRate}
                label="USD Rate"
                placeholder={`1 ${electricityCurrency} = ? USD`}
                keyboardType="decimal-pad"
              />
            </>
          )}
        </Card>

        <Spacer size={4} />

        {/* Service Cost */}
        <Card padding="lg">
          <Text variant="label" color="muted">SERVICE FEE</Text>
          <Spacer size={4} />

          <View style={styles.amountRow}>
            <View style={styles.amountInput}>
              <TextInput
                value={serviceCost}
                onChangeText={setServiceCost}
                label="Amount"
                placeholder="0.00000000"
                keyboardType="decimal-pad"
              />
            </View>
            <CurrencyPicker
              value={serviceCurrency}
              onChange={setServiceCurrency}
              label="Paid in"
            />
          </View>

          <Spacer size={3} />

          <Pressable
            style={styles.toggleRow}
            onPress={() => setUseManualServiceRate(!useManualServiceRate)}
          >
            <Text variant="caption" color="muted">Use manual price</Text>
            <Icon
              name={useManualServiceRate ? 'checkbox' : 'square-outline'}
              size={20}
              color={useManualServiceRate ? 'brand' : 'muted'}
            />
          </Pressable>

          {useManualServiceRate && (
            <>
              <Spacer size={2} />
              <TextInput
                value={manualServiceRate}
                onChangeText={setManualServiceRate}
                label="USD Rate"
                placeholder={`1 ${serviceCurrency} = ? USD`}
                keyboardType="decimal-pad"
              />
            </>
          )}
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
                <CurrencyPicker
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
