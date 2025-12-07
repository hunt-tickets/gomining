/**
 * CurrencyPicker Component
 * Searchable dropdown for selecting currencies
 */

import React, { useState, useMemo } from 'react';
import {
  View,
  Modal,
  Pressable,
  TextInput,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/theme';
import { Text, Icon, Spacer } from '@/components/atoms';
import { CURRENCIES, getCurrencyInfo } from '@/types/currency';
import type { Currency, CurrencyInfo } from '@/types/currency';

// ═══════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════

export interface CurrencyPickerProps {
  value: Currency;
  onChange: (currency: Currency) => void;
  label?: string;
  filterType?: 'all' | 'crypto' | 'fiat';
}

// ═══════════════════════════════════════════════════════════════════
// CURRENCY ITEM
// ═══════════════════════════════════════════════════════════════════

interface CurrencyItemProps {
  currency: CurrencyInfo;
  isSelected: boolean;
  onPress: () => void;
}

function CurrencyItem({ currency, isSelected, onPress }: CurrencyItemProps) {
  const { tokens } = useTheme();

  return (
    <Pressable
      style={[
        styles.currencyItem,
        isSelected && { backgroundColor: tokens.colors.brand.primaryMuted },
        { borderBottomColor: tokens.colors.border.muted },
      ]}
      onPress={onPress}
    >
      <View style={styles.currencyInfo}>
        <View
          style={[
            styles.currencyIcon,
            { backgroundColor: currency.type === 'crypto' ? tokens.colors.brand.primaryMuted : tokens.colors.semantic.infoMuted },
          ]}
        >
          <Text variant="bodySmall" weight="bold" color={currency.type === 'crypto' ? 'brand' : 'primary'}>
            {currency.symbol}
          </Text>
        </View>
        <View>
          <Text variant="body" weight="semibold">{currency.code}</Text>
          <Text variant="caption" color="muted">{currency.name}</Text>
        </View>
      </View>
      {isSelected && (
        <Icon name="checkmark-circle" size={24} color="brand" />
      )}
    </Pressable>
  );
}

// ═══════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════

export function CurrencyPicker({ value, onChange, label, filterType = 'all' }: CurrencyPickerProps) {
  const { tokens } = useTheme();
  const insets = useSafeAreaInsets();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');

  const selectedCurrency = getCurrencyInfo(value);

  const filteredCurrencies = useMemo(() => {
    let currencies = CURRENCIES;

    // Filter by type
    if (filterType === 'crypto') {
      currencies = currencies.filter(c => c.type === 'crypto');
    } else if (filterType === 'fiat') {
      currencies = currencies.filter(c => c.type === 'fiat');
    }

    // Filter by search
    if (search.trim()) {
      const searchLower = search.toLowerCase();
      currencies = currencies.filter(
        c =>
          c.code.toLowerCase().includes(searchLower) ||
          c.name.toLowerCase().includes(searchLower)
      );
    }

    // Sort: crypto first, then by code
    return currencies.sort((a, b) => {
      if (a.type !== b.type) {
        return a.type === 'crypto' ? -1 : 1;
      }
      return a.code.localeCompare(b.code);
    });
  }, [search, filterType]);

  const handleSelect = (currency: CurrencyInfo) => {
    onChange(currency.code);
    setIsOpen(false);
    setSearch('');
  };

  return (
    <>
      {/* Trigger Button */}
      <View style={styles.container}>
        {label && (
          <>
            <Text variant="caption" color="muted">{label}</Text>
            <Spacer size={1} />
          </>
        )}
        <Pressable
          style={[
            styles.trigger,
            {
              backgroundColor: tokens.colors.background.tertiary,
              borderColor: tokens.colors.border.default,
            },
          ]}
          onPress={() => setIsOpen(true)}
        >
          <View style={styles.triggerContent}>
            <View
              style={[
                styles.triggerIcon,
                { backgroundColor: tokens.colors.brand.primaryMuted },
              ]}
            >
              <Text variant="caption" weight="bold" color="brand">
                {selectedCurrency?.symbol || value}
              </Text>
            </View>
            <Text variant="body" weight="semibold">{value}</Text>
          </View>
          <Icon name="chevron-down" size={20} color="muted" />
        </Pressable>
      </View>

      {/* Modal */}
      <Modal
        visible={isOpen}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setIsOpen(false)}
      >
        <KeyboardAvoidingView
          style={[styles.modal, { backgroundColor: tokens.colors.background.primary }]}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          {/* Header */}
          <View style={[styles.modalHeader, { paddingTop: insets.top + 16 }]}>
            <Text variant="h3">Select Currency</Text>
            <Pressable onPress={() => setIsOpen(false)}>
              <Icon name="close" size={24} color="primary" />
            </Pressable>
          </View>

          {/* Search */}
          <View style={[styles.searchContainer, { borderBottomColor: tokens.colors.border.muted }]}>
            <View
              style={[
                styles.searchInput,
                { backgroundColor: tokens.colors.background.tertiary },
              ]}
            >
              <Icon name="search" size={20} color="muted" />
              <TextInput
                style={[styles.searchTextInput, { color: tokens.colors.text.primary }]}
                placeholder="Search currencies..."
                placeholderTextColor={tokens.colors.text.muted}
                value={search}
                onChangeText={setSearch}
                autoCapitalize="characters"
                autoCorrect={false}
              />
              {search.length > 0 && (
                <Pressable onPress={() => setSearch('')}>
                  <Icon name="close-circle" size={20} color="muted" />
                </Pressable>
              )}
            </View>
          </View>

          {/* Currency List */}
          <FlatList
            data={filteredCurrencies}
            keyExtractor={(item) => item.code}
            renderItem={({ item }) => (
              <CurrencyItem
                currency={item}
                isSelected={item.code === value}
                onPress={() => handleSelect(item)}
              />
            )}
            contentContainerStyle={{ paddingBottom: insets.bottom + 16 }}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Text variant="body" color="muted">No currencies found</Text>
              </View>
            }
            ItemSeparatorComponent={() => <View style={{ height: 1 }} />}
          />
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════════════

const styles = StyleSheet.create({
  container: {},
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
  },
  triggerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  triggerIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modal: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  searchInput: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
  },
  searchTextInput: {
    flex: 1,
    fontSize: 16,
    padding: 0,
  },
  currencyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  currencyInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  currencyIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyState: {
    padding: 32,
    alignItems: 'center',
  },
});
