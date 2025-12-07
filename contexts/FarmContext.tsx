/**
 * Farm Context
 * Provides shared farm state across the app
 */

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { STORAGE_KEYS, getJSON, setJSON } from '@/services/storage';
import { calculateMiningProfitability, calculateTotalDiscount } from '@/utils/calculations';
import type {
  Miner,
  CreateMinerInput,
  UpdateMinerInput,
  MinerWithStats,
  DailyIncomeRecord,
  InvestmentRecord,
  CreateDailyIncomeInput,
  CreateInvestmentInput,
} from '@/types';

// ═══════════════════════════════════════════════════════════════════
// STORAGE KEYS
// ═══════════════════════════════════════════════════════════════════

const INCOME_RECORDS_KEY = 'farm.incomeRecords';
const INVESTMENTS_KEY = 'farm.investments';

// ═══════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════

interface FarmContextValue {
  // Miners
  miners: Miner[];
  minersWithStats: MinerWithStats[];
  isLoading: boolean;
  addMiner: (input: CreateMinerInput) => Miner;
  updateMiner: (id: string, updates: UpdateMinerInput) => void;
  deleteMiner: (id: string) => void;
  getMiner: (id: string) => Miner | undefined;
  getMinerWithStats: (id: string) => MinerWithStats | undefined;

  // Transactions
  incomeRecords: DailyIncomeRecord[];
  investments: InvestmentRecord[];
  addIncomeRecord: (input: CreateDailyIncomeInput) => DailyIncomeRecord;
  addInvestment: (input: CreateInvestmentInput) => InvestmentRecord;
  deleteIncomeRecord: (id: string) => void;
  deleteInvestment: (id: string) => void;
  getIncomeRecordsForMiner: (minerId: string) => DailyIncomeRecord[];
  getInvestmentsForMiner: (minerId: string) => InvestmentRecord[];

  // BTC Data
  setBtcData: (price: number, difficulty: number) => void;
  btcPrice: number;

  // Farm totals
  totalHashrate: number;
  totalDailyProfitBTC: number;
  totalDailyProfitUSD: number;
  minerCount: number;
}

const FarmContext = createContext<FarmContextValue | null>(null);

// ═══════════════════════════════════════════════════════════════════
// HELPER: Generate UUID
// ═══════════════════════════════════════════════════════════════════

const generateId = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

// ═══════════════════════════════════════════════════════════════════
// PROVIDER
// ═══════════════════════════════════════════════════════════════════

export function FarmProvider({ children }: { children: React.ReactNode }) {
  const [miners, setMiners] = useState<Miner[]>([]);
  const [incomeRecords, setIncomeRecords] = useState<DailyIncomeRecord[]>([]);
  const [investments, setInvestments] = useState<InvestmentRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [btcPrice, setBtcPrice] = useState(0);
  const [difficulty, setDifficulty] = useState(0);

  // ═══════════════════════════════════════════════════════════════════
  // LOAD DATA FROM STORAGE
  // ═══════════════════════════════════════════════════════════════════

  useEffect(() => {
    const storedMiners = getJSON<Miner[]>(STORAGE_KEYS.MINERS, []);
    const storedIncome = getJSON<DailyIncomeRecord[]>(INCOME_RECORDS_KEY, []);
    const storedInvestments = getJSON<InvestmentRecord[]>(INVESTMENTS_KEY, []);

    setMiners(storedMiners);
    setIncomeRecords(storedIncome);
    setInvestments(storedInvestments);
    setIsLoading(false);
  }, []);

  // ═══════════════════════════════════════════════════════════════════
  // SAVE DATA TO STORAGE
  // ═══════════════════════════════════════════════════════════════════

  useEffect(() => {
    if (!isLoading) {
      setJSON(STORAGE_KEYS.MINERS, miners);
    }
  }, [miners, isLoading]);

  useEffect(() => {
    if (!isLoading) {
      setJSON(INCOME_RECORDS_KEY, incomeRecords);
    }
  }, [incomeRecords, isLoading]);

  useEffect(() => {
    if (!isLoading) {
      setJSON(INVESTMENTS_KEY, investments);
    }
  }, [investments, isLoading]);

  // ═══════════════════════════════════════════════════════════════════
  // BTC DATA
  // ═══════════════════════════════════════════════════════════════════

  const setBtcData = useCallback((price: number, diff: number) => {
    setBtcPrice(price);
    setDifficulty(diff);
  }, []);

  // ═══════════════════════════════════════════════════════════════════
  // MINER FUNCTIONS
  // ═══════════════════════════════════════════════════════════════════

  const addMiner = useCallback((input: CreateMinerInput) => {
    const now = new Date().toISOString();
    const newMiner: Miner = {
      ...input,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    };
    setMiners((prev) => [...prev, newMiner]);
    return newMiner;
  }, []);

  const updateMiner = useCallback((id: string, updates: UpdateMinerInput) => {
    setMiners((prev) =>
      prev.map((miner) =>
        miner.id === id
          ? { ...miner, ...updates, updatedAt: new Date().toISOString() }
          : miner
      )
    );
  }, []);

  const deleteMiner = useCallback((id: string) => {
    setMiners((prev) => prev.filter((miner) => miner.id !== id));
    // Also delete related transactions
    setIncomeRecords((prev) => prev.filter((r) => r.minerId !== id));
    setInvestments((prev) => prev.filter((i) => i.minerId !== id));
  }, []);

  const getMiner = useCallback(
    (id: string) => miners.find((m) => m.id === id),
    [miners]
  );

  // ═══════════════════════════════════════════════════════════════════
  // TRANSACTION FUNCTIONS
  // ═══════════════════════════════════════════════════════════════════

  const addIncomeRecord = useCallback((input: CreateDailyIncomeInput) => {
    const newRecord: DailyIncomeRecord = {
      ...input,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    setIncomeRecords((prev) => [...prev, newRecord]);
    return newRecord;
  }, []);

  const addInvestment = useCallback((input: CreateInvestmentInput) => {
    const newInvestment: InvestmentRecord = {
      ...input,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    setInvestments((prev) => [...prev, newInvestment]);
    return newInvestment;
  }, []);

  const deleteIncomeRecord = useCallback((id: string) => {
    setIncomeRecords((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const deleteInvestment = useCallback((id: string) => {
    setInvestments((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const getIncomeRecordsForMiner = useCallback(
    (minerId: string) =>
      incomeRecords
        .filter((r) => r.minerId === minerId)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [incomeRecords]
  );

  const getInvestmentsForMiner = useCallback(
    (minerId: string) =>
      investments
        .filter((i) => i.minerId === minerId)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [investments]
  );

  // ═══════════════════════════════════════════════════════════════════
  // CALCULATE MINER STATS WITH ROI
  // ═══════════════════════════════════════════════════════════════════

  const minersWithStats = useMemo<MinerWithStats[]>(() => {
    return miners.map((miner) => {
      // Calculate daily profit
      let dailyProfitBTC = 0;
      let dailyProfitUSD = 0;

      if (btcPrice > 0 && difficulty > 0) {
        const result = calculateMiningProfitability(
          {
            hashrate: miner.hashrate,
            efficiency: miner.efficiency,
            difficulty,
            btcPrice,
          },
          miner.discounts
        );
        dailyProfitBTC = result.netRewardBTC;
        dailyProfitUSD = result.netRewardUSD;
      }

      // Calculate total invested for this miner
      const minerInvestments = investments.filter((i) => i.minerId === miner.id);
      const totalInvestedUSD = minerInvestments.reduce((sum, i) => sum + i.amountUSD, 0);

      // Calculate total earned for this miner
      const minerIncome = incomeRecords.filter((r) => r.minerId === miner.id);
      const totalEarnedUSD = minerIncome.reduce((sum, r) => sum + r.netIncomeUSD, 0);

      // Calculate ROI
      const roi = totalInvestedUSD > 0
        ? ((totalEarnedUSD - totalInvestedUSD) / totalInvestedUSD) * 100
        : 0;

      return {
        ...miner,
        dailyProfitBTC,
        dailyProfitUSD,
        totalDiscountPercent: calculateTotalDiscount(miner.discounts),
        totalInvestedUSD,
        totalEarnedUSD,
        roi,
      };
    });
  }, [miners, btcPrice, difficulty, investments, incomeRecords]);

  const getMinerWithStats = useCallback(
    (id: string) => minersWithStats.find((m) => m.id === id),
    [minersWithStats]
  );

  // ═══════════════════════════════════════════════════════════════════
  // FARM TOTALS
  // ═══════════════════════════════════════════════════════════════════

  const farmTotals = useMemo(() => {
    return minersWithStats.reduce(
      (acc, miner) => ({
        totalHashrate: acc.totalHashrate + miner.hashrate,
        totalDailyProfitBTC: acc.totalDailyProfitBTC + miner.dailyProfitBTC,
        totalDailyProfitUSD: acc.totalDailyProfitUSD + miner.dailyProfitUSD,
      }),
      { totalHashrate: 0, totalDailyProfitBTC: 0, totalDailyProfitUSD: 0 }
    );
  }, [minersWithStats]);

  // ═══════════════════════════════════════════════════════════════════
  // CONTEXT VALUE
  // ═══════════════════════════════════════════════════════════════════

  const value: FarmContextValue = {
    // Miners
    miners,
    minersWithStats,
    isLoading,
    addMiner,
    updateMiner,
    deleteMiner,
    getMiner,
    getMinerWithStats,

    // Transactions
    incomeRecords,
    investments,
    addIncomeRecord,
    addInvestment,
    deleteIncomeRecord,
    deleteInvestment,
    getIncomeRecordsForMiner,
    getInvestmentsForMiner,

    // BTC Data
    setBtcData,
    btcPrice,

    // Totals
    ...farmTotals,
    minerCount: miners.length,
  };

  return <FarmContext.Provider value={value}>{children}</FarmContext.Provider>;
}

// ═══════════════════════════════════════════════════════════════════
// HOOK
// ═══════════════════════════════════════════════════════════════════

export function useFarmContext() {
  const context = useContext(FarmContext);
  if (!context) {
    throw new Error('useFarmContext must be used within a FarmProvider');
  }
  return context;
}
