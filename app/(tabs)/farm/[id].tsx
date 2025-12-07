import React, { useState, useMemo } from 'react';
import { View, ScrollView, StyleSheet, Pressable, Modal, TouchableWithoutFeedback } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/theme';
import { Text, Button, Icon, Spacer, Badge } from '@/components/atoms';
import { Card, GlassCard, MetricDisplay } from '@/components/molecules';
import { useFarmContext } from '@/contexts';
import type { DailyIncomeRecord, InvestmentRecord } from '@/types';

// ═══════════════════════════════════════════════════════════════════
// ACTION MENU
// ═══════════════════════════════════════════════════════════════════

interface ActionMenuProps {
  visible: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

function ActionMenu({ visible, onClose, onEdit, onDelete }: ActionMenuProps) {
  const { tokens } = useTheme();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.menuOverlay}>
          <TouchableWithoutFeedback>
            <View style={[styles.menuContainer, { backgroundColor: tokens.colors.background.secondary }]}>
              <Pressable
                style={[styles.menuItem, { borderBottomColor: tokens.colors.border.muted }]}
                onPress={() => {
                  onClose();
                  onEdit();
                }}
              >
                <Icon name="create-outline" size={22} color="brand" />
                <Text variant="body" weight="semibold">Edit Miner</Text>
              </Pressable>

              <Pressable
                style={styles.menuItem}
                onPress={() => {
                  onClose();
                  onDelete();
                }}
              >
                <Icon name="trash-outline" size={22} color="error" />
                <Text variant="body" weight="semibold" color="error">Delete Miner</Text>
              </Pressable>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

// ═══════════════════════════════════════════════════════════════════
// TAB SELECTOR
// ═══════════════════════════════════════════════════════════════════

type TabType = 'overview' | 'income' | 'investments';

interface TabSelectorProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  incomeCount: number;
  investmentCount: number;
}

function TabSelector({ activeTab, onTabChange, incomeCount, investmentCount }: TabSelectorProps) {
  const { tokens } = useTheme();

  const tabs: { key: TabType; label: string; count?: number }[] = [
    { key: 'overview', label: 'Overview' },
    { key: 'income', label: 'Income', count: incomeCount },
    { key: 'investments', label: 'Investments', count: investmentCount },
  ];

  return (
    <View style={styles.tabContainer}>
      {tabs.map((tab) => (
        <Pressable
          key={tab.key}
          style={[
            styles.tab,
            activeTab === tab.key && { borderBottomColor: tokens.colors.brand.primary, borderBottomWidth: 2 },
          ]}
          onPress={() => onTabChange(tab.key)}
        >
          <Text
            variant="bodySmall"
            weight={activeTab === tab.key ? 'semibold' : 'regular'}
            color={activeTab === tab.key ? 'brand' : 'muted'}
          >
            {tab.label}
          </Text>
          {tab.count !== undefined && tab.count > 0 && (
            <Badge variant={activeTab === tab.key ? 'brand' : 'default'} size="sm">
              {tab.count}
            </Badge>
          )}
        </Pressable>
      ))}
    </View>
  );
}

// ═══════════════════════════════════════════════════════════════════
// OVERVIEW TAB
// ═══════════════════════════════════════════════════════════════════

interface OverviewTabProps {
  miner: NonNullable<ReturnType<typeof useFarmContext>['getMinerWithStats']>;
}

function OverviewTab({ miner }: OverviewTabProps) {
  const { tokens } = useTheme();

  return (
    <>
      {/* ROI Card */}
      <GlassCard padding="lg">
        <Text variant="label" color="muted">RETURN ON INVESTMENT</Text>
        <Spacer size={3} />
        <View style={styles.roiContainer}>
          <Text
            variant="h1"
            color={miner.roi >= 0 ? 'success' : 'error'}
          >
            {miner.roi >= 0 ? '+' : ''}{miner.roi.toFixed(1)}%
          </Text>
          <Text variant="caption" color="muted">
            {miner.roi >= 0 ? 'Profit' : 'Loss'}
          </Text>
        </View>
      </GlassCard>

      <Spacer size={4} />

      {/* Financial Summary */}
      <Card padding="lg">
        <Text variant="label" color="muted">FINANCIAL SUMMARY</Text>
        <Spacer size={4} />

        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <Text variant="caption" color="muted">Total Invested</Text>
            <Text variant="h4" color="primary">
              ${miner.totalInvestedUSD.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </Text>
          </View>
          <View style={styles.summaryItem}>
            <Text variant="caption" color="muted">Total Earned</Text>
            <Text variant="h4" color="success">
              ${miner.totalEarnedUSD.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </Text>
          </View>
        </View>

        <Spacer size={4} />
        <View style={[styles.divider, { backgroundColor: tokens.colors.border.muted }]} />
        <Spacer size={4} />

        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <Text variant="caption" color="muted">Net Profit/Loss</Text>
            <Text
              variant="h4"
              color={miner.totalEarnedUSD - miner.totalInvestedUSD >= 0 ? 'success' : 'error'}
            >
              {miner.totalEarnedUSD - miner.totalInvestedUSD >= 0 ? '+' : ''}
              ${(miner.totalEarnedUSD - miner.totalInvestedUSD).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </Text>
          </View>
          <View style={styles.summaryItem}>
            <Text variant="caption" color="muted">Daily Profit (Est.)</Text>
            <Text variant="h4" color="brand">
              ${miner.dailyProfitUSD.toFixed(2)}
            </Text>
          </View>
        </View>
      </Card>

      <Spacer size={4} />

      {/* Miner Config */}
      <Card padding="lg">
        <Text variant="label" color="muted">MINER CONFIGURATION</Text>
        <Spacer size={4} />

        <View style={styles.configGrid}>
          <View style={styles.configItem}>
            <Icon name="speedometer" size={20} color="brand" />
            <Text variant="bodySmall" color="muted">Hashrate</Text>
            <Text variant="body" weight="semibold">{miner.hashrate} TH/s</Text>
          </View>
          <View style={styles.configItem}>
            <Icon name="flash" size={20} color="brand" />
            <Text variant="bodySmall" color="muted">Efficiency</Text>
            <Text variant="body" weight="semibold">{miner.efficiency} W/TH</Text>
          </View>
          <View style={styles.configItem}>
            <Icon name="pricetag" size={20} color="brand" />
            <Text variant="bodySmall" color="muted">Discount</Text>
            <Text variant="body" weight="semibold">{miner.discountPercent.toFixed(1)}%</Text>
          </View>
        </View>
      </Card>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════
// INCOME TAB
// ═══════════════════════════════════════════════════════════════════

interface IncomeTabProps {
  records: DailyIncomeRecord[];
  minerId: string;
  onAddPress: () => void;
}

function IncomeTab({ records, minerId, onAddPress }: IncomeTabProps) {
  const { tokens } = useTheme();

  if (records.length === 0) {
    return (
      <Card padding="xl">
        <View style={styles.emptyState}>
          <Icon name="wallet-outline" size={48} color="muted" />
          <Spacer size={4} />
          <Text variant="h4" align="center">No Income Records</Text>
          <Spacer size={2} />
          <Text variant="body" color="muted" align="center">
            Start tracking your daily mining income to see your ROI.
          </Text>
          <Spacer size={4} />
          <Button variant="primary" onPress={onAddPress}>
            Add First Income
          </Button>
        </View>
      </Card>
    );
  }

  return (
    <>
      <Button
        variant="primary"
        fullWidth
        leftIcon={<Icon name="add" size={20} color="#FFFFFF" />}
        onPress={onAddPress}
      >
        Add Income Record
      </Button>

      <Spacer size={4} />

      {records.map((record) => (
        <View key={record.id}>
          <Card padding="md">
            <View style={styles.recordHeader}>
              <Text variant="bodySmall" weight="semibold">
                {new Date(record.date).toLocaleDateString()}
              </Text>
              <Badge variant={record.grossIncomeCurrency === 'BTC' ? 'brand' : 'success'}>
                {record.grossIncomeCurrency}
              </Badge>
            </View>

            <Spacer size={3} />

            <View style={styles.recordDetails}>
              <View style={styles.recordRow}>
                <Text variant="caption" color="muted">Gross Income</Text>
                <Text variant="bodySmall" color="success">
                  +${record.grossIncomeUSD.toFixed(2)}
                </Text>
              </View>
              <View style={styles.recordRow}>
                <Text variant="caption" color="muted">Electricity ({record.electricityCurrency})</Text>
                <Text variant="bodySmall" color="error">
                  -${record.electricityCostUSD.toFixed(2)}
                </Text>
              </View>
              <View style={styles.recordRow}>
                <Text variant="caption" color="muted">Service ({record.serviceCurrency})</Text>
                <Text variant="bodySmall" color="error">
                  -${record.serviceCostUSD.toFixed(2)}
                </Text>
              </View>
              <View style={styles.recordRow}>
                <Text variant="caption" color="muted">Discount</Text>
                <Text variant="bodySmall" color="brand">
                  -{record.discountPercent}%
                </Text>
              </View>
              <View style={[styles.divider, { backgroundColor: tokens.colors.border.muted }]} />
              <View style={styles.recordRow}>
                <Text variant="body" weight="semibold">Net Income</Text>
                <Text variant="body" weight="bold" color="success">
                  ${record.netIncomeUSD.toFixed(2)}
                </Text>
              </View>
            </View>

            {record.reinvestment && (
              <>
                <Spacer size={2} />
                <Badge variant="brand" size="sm">
                  Reinvested: {record.reinvestment.amount} {record.reinvestment.currency} in {record.reinvestment.type}
                </Badge>
              </>
            )}
          </Card>
          <Spacer size={3} />
        </View>
      ))}
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════
// INVESTMENTS TAB
// ═══════════════════════════════════════════════════════════════════

interface InvestmentsTabProps {
  records: InvestmentRecord[];
  minerId: string;
  onAddPress: () => void;
}

function InvestmentsTab({ records, minerId, onAddPress }: InvestmentsTabProps) {
  const { tokens } = useTheme();

  const typeLabels: Record<string, string> = {
    initial: 'Initial Purchase',
    hashrate: 'Hashrate Upgrade',
    efficiency: 'Efficiency Upgrade',
    tokens: 'Token Purchase',
  };

  const typeIcons: Record<string, string> = {
    initial: 'cart',
    hashrate: 'trending-up',
    efficiency: 'flash',
    tokens: 'diamond',
  };

  if (records.length === 0) {
    return (
      <Card padding="xl">
        <View style={styles.emptyState}>
          <Icon name="card-outline" size={48} color="muted" />
          <Spacer size={4} />
          <Text variant="h4" align="center">No Investments</Text>
          <Spacer size={2} />
          <Text variant="body" color="muted" align="center">
            Track your miner purchases and upgrades to calculate ROI.
          </Text>
          <Spacer size={4} />
          <Button variant="primary" onPress={onAddPress}>
            Add First Investment
          </Button>
        </View>
      </Card>
    );
  }

  return (
    <>
      <Button
        variant="primary"
        fullWidth
        leftIcon={<Icon name="add" size={20} color="#FFFFFF" />}
        onPress={onAddPress}
      >
        Add Investment
      </Button>

      <Spacer size={4} />

      {records.map((record) => (
        <View key={record.id}>
          <Card padding="md">
            <View style={styles.recordHeader}>
              <View style={styles.investmentType}>
                <Icon name={typeIcons[record.type] as any} size={20} color="brand" />
                <Text variant="bodySmall" weight="semibold">
                  {typeLabels[record.type]}
                </Text>
              </View>
              <Text variant="body" weight="bold" color="error">
                -${record.amountUSD.toLocaleString()}
              </Text>
            </View>

            <Spacer size={2} />

            <Text variant="caption" color="muted">
              {new Date(record.date).toLocaleDateString()}
            </Text>

            {record.details && (
              <>
                <Spacer size={2} />
                <View style={styles.detailsRow}>
                  {record.details.hashrateBefore !== undefined && (
                    <Text variant="caption" color="muted">
                      {record.details.hashrateBefore} → {record.details.hashrateAfter} TH/s
                    </Text>
                  )}
                  {record.details.efficiencyBefore !== undefined && (
                    <Text variant="caption" color="muted">
                      {record.details.efficiencyBefore} → {record.details.efficiencyAfter} W/TH
                    </Text>
                  )}
                  {record.details.tokenDaysBought !== undefined && (
                    <Text variant="caption" color="muted">
                      +{record.details.tokenDaysBought} days coverage
                    </Text>
                  )}
                </View>
              </>
            )}

            {record.note && (
              <>
                <Spacer size={2} />
                <Text variant="caption" color="muted">"{record.note}"</Text>
              </>
            )}
          </Card>
          <Spacer size={3} />
        </View>
      ))}
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════
// MAIN SCREEN
// ═══════════════════════════════════════════════════════════════════

export default function MinerDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { tokens } = useTheme();
  const insets = useSafeAreaInsets();

  const {
    getMinerWithStats,
    getIncomeRecordsForMiner,
    getInvestmentsForMiner,
    deleteMiner,
  } = useFarmContext();

  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [showMenu, setShowMenu] = useState(false);

  const miner = getMinerWithStats(id || '');
  const incomeRecords = getIncomeRecordsForMiner(id || '');
  const investments = getInvestmentsForMiner(id || '');

  const handleDelete = () => {
    if (id) {
      deleteMiner(id);
      router.back();
    }
  };

  const handleAddIncome = () => {
    router.push(`/farm/add-income?minerId=${id}`);
  };

  const handleAddInvestment = () => {
    router.push(`/farm/add-investment?minerId=${id}`);
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
          leftIcon={<Icon name="chevron-back" size={20} color="primary" />}
          onPress={() => router.back()}
        >
          Back
        </Button>
        <Pressable
          style={[styles.settingsButton, { backgroundColor: tokens.colors.background.tertiary }]}
          onPress={() => setShowMenu(true)}
        >
          <Icon name="ellipsis-vertical" size={22} color="primary" />
        </Pressable>
      </View>

      {/* Title */}
      <View style={styles.titleContainer}>
        <View style={styles.titleRow}>
          <Icon name="hardware-chip" size={28} color="brand" />
          <Text variant="h2">{miner.name}</Text>
        </View>
        <Text variant="body" color="muted">{miner.hashrate} TH/s • {miner.efficiency} W/TH</Text>
      </View>

      {/* Tabs */}
      <TabSelector
        activeTab={activeTab}
        onTabChange={setActiveTab}
        incomeCount={incomeRecords.length}
        investmentCount={investments.length}
      />

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 24 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === 'overview' && <OverviewTab miner={miner} />}
        {activeTab === 'income' && (
          <IncomeTab
            records={incomeRecords}
            minerId={id || ''}
            onAddPress={handleAddIncome}
          />
        )}
        {activeTab === 'investments' && (
          <InvestmentsTab
            records={investments}
            minerId={id || ''}
            onAddPress={handleAddInvestment}
          />
        )}
      </ScrollView>

      {/* Action Menu */}
      <ActionMenu
        visible={showMenu}
        onClose={() => setShowMenu(false)}
        onEdit={() => router.push(`/farm/edit?minerId=${id}`)}
        onDelete={handleDelete}
      />
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
    paddingHorizontal: 8,
    paddingBottom: 8,
  },
  titleContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 4,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginRight: 8,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  notFound: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  roiContainer: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryItem: {
    flex: 1,
    gap: 4,
  },
  divider: {
    height: 1,
    marginVertical: 8,
  },
  configGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  configItem: {
    alignItems: 'center',
    gap: 4,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  recordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recordDetails: {
    gap: 8,
  },
  recordRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  investmentType: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  menuContainer: {
    width: '100%',
    maxWidth: 300,
    borderRadius: 16,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
});
