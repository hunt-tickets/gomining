import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/theme';
import { Text, Button, Icon, Spacer } from '@/components/atoms';
import { Card, TextInput, SliderInput } from '@/components/molecules';

// ═══════════════════════════════════════════════════════════════════
// ADD MINER SCREEN
// ═══════════════════════════════════════════════════════════════════

export default function AddMinerScreen() {
  const { tokens } = useTheme();
  const insets = useSafeAreaInsets();

  const [name, setName] = useState('');
  const [hashrate, setHashrate] = useState(100);
  const [efficiency, setEfficiency] = useState(35);

  const handleSave = () => {
    // TODO: Save miner to storage
    console.log({ name, hashrate, efficiency });
    router.back();
  };

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
        <Text variant="h2">Add Miner</Text>
        <Text variant="body" color="muted">Configure your new virtual miner</Text>

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

        <Card padding="md" variant="outlined">
          <View style={styles.infoRow}>
            <Icon name="information-circle-outline" size={20} color="muted" />
            <Text variant="bodySmall" color="muted" style={{ flex: 1 }}>
              You can adjust discounts after creating the miner. The efficiency
              can be upgraded from 35 W/TH down to 15 W/TH.
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
          Create Miner
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
  infoRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
});
