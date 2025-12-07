import React from 'react';
import { View, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/theme';
import { Text, Button, Icon, Spacer } from '@/components/atoms';
import { Card } from '@/components/molecules';

export default function SimulationResultModal() {
  const { tokens } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { backgroundColor: tokens.colors.background.primary }]}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Text variant="h3">Simulation Result</Text>
        <Button
          variant="ghost"
          size="sm"
          onPress={() => router.back()}
        >
          <Icon name="close" size={24} color="primary" />
        </Button>
      </View>

      <View style={styles.content}>
        <Card padding="lg">
          <Text variant="body" color="muted" align="center">
            Simulation results will be displayed here.
          </Text>
        </Card>
      </View>
    </View>
  );
}

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
  content: {
    flex: 1,
    padding: 16,
  },
});
