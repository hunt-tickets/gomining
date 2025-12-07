import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/theme';
import { Text, Button, Icon, Spacer } from '@/components/atoms';
import { Card, TextInput, SliderInput } from '@/components/molecules';
import { useFarmContext } from '@/contexts';

// ═══════════════════════════════════════════════════════════════════
// EDIT MINER SCREEN
// ═══════════════════════════════════════════════════════════════════

export default function EditMinerScreen() {
  const { minerId } = useLocalSearchParams<{ minerId: string }>();
  const { tokens } = useTheme();
  const insets = useSafeAreaInsets();
  const { getMiner, updateMiner } = useFarmContext();

  const miner = getMiner(minerId || '');

  const [name, setName] = useState('');
  const [hashrate, setHashrate] = useState(100);
  const [efficiency, setEfficiency] = useState(35);
  const [discountPercent, setDiscountPercent] = useState(0);

  // Load miner data on mount
  useEffect(() => {
    if (miner) {
      setName(miner.name);
      setHashrate(miner.hashrate);
      setEfficiency(miner.efficiency);
      setDiscountPercent(miner.discountPercent);
    }
  }, [miner]);

  const handleSave = () => {
    if (!name.trim() || !minerId) return;

    updateMiner(minerId, {
      name: name.trim(),
      hashrate,
      efficiency,
      discountPercent,
    });

    router.back();
  };

  if (!miner) {
    return (
      <View style={[styles.container, { backgroundColor: tokens.colors.background.primary }]}>
        <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<Icon name="chevron-back" size={20} color="primary" />}
            onPress={() => router.back()}
          >
            Back
          </Button>
        </View>
        <View style={styles.notFound}>
          <Text variant="h3">Miner not found</Text>
        </View>
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
        <Text variant="h2">Edit Miner</Text>
        <Text variant="body" color="muted">Update {miner.name} configuration</Text>

        <Spacer size={6} />

        <Card padding="lg">
          <TextInput
            value={name}
            onChangeText={setName}
            label="Miner Name"
            placeholder="e.g., Main Rig"
            leftIcon="hardware-chip-outline"
          />
        </Card>

        <Spacer size={4} />

        <Card padding="lg">
          <Text variant="label" color="muted">PERFORMANCE</Text>
          <Spacer size={4} />

          <SliderInput
            label="Hashrate (TH/s)"
            value={hashrate}
            onValueChange={setHashrate}
            min={1}
            max={5000}
            step={1}
            valueFormatter={(v) => `${v} TH/s`}
          />

          <Spacer size={6} />

          <SliderInput
            label="Efficiency (W/TH)"
            value={efficiency}
            onValueChange={setEfficiency}
            min={15}
            max={50}
            step={1}
            valueFormatter={(v) => `${v} W/TH`}
          />
        </Card>

        <Spacer size={4} />

        <Card padding="lg">
          <SliderInput
            label="Total Discount"
            value={discountPercent}
            onValueChange={setDiscountPercent}
            min={0}
            max={29}
            step={0.5}
            valueFormatter={(v) => v === 0 ? 'No discount' : `${v.toFixed(1)}%`}
          />
        </Card>

        <Spacer size={4} />

        <Card padding="md" variant="outlined">
          <View style={styles.infoRow}>
            <Icon name="information-circle-outline" size={20} color="muted" />
            <Text variant="bodySmall" color="muted" style={{ flex: 1 }}>
              Update your discount percentage when your token coverage, VIP level, or other bonuses change.
            </Text>
          </View>
        </Card>

        <Spacer size={6} />

        <Button
          variant="primary"
          fullWidth
          disabled={!name.trim()}
          onPress={handleSave}
        >
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
  notFound: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
});
