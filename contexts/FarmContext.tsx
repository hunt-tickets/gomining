/**
 * Farm Context
 * Provides shared farm state across the app
 */

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { STORAGE_KEYS, getJSON, setJSON } from '@/services/storage';
import { calculateMiningProfitability, calculateTotalDiscount } from '@/utils/calculations';
import type { Miner, CreateMinerInput, UpdateMinerInput, MinerWithStats } from '@/types';

// ═══════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════

interface FarmContextValue {
  miners: Miner[];
  minersWithStats: MinerWithStats[];
  isLoading: boolean;
  addMiner: (input: CreateMinerInput) => Miner;
  updateMiner: (id: string, updates: UpdateMinerInput) => void;
  deleteMiner: (id: string) => void;
  getMiner: (id: string) => Miner | undefined;
  setBtcData: (price: number, difficulty: number) => void;
  totalHashrate: number;
  totalDailyProfitBTC: number;
  totalDailyProfitUSD: number;
  minerCount: number;
}

const FarmContext = createContext<FarmContextValue | null>(null);

// ═══════════════════════════════════════════════════════════════════
// PROVIDER
// ═══════════════════════════════════════════════════════════════════

export function FarmProvider({ children }: { children: React.ReactNode }) {
  const [miners, setMiners] = useState<Miner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [btcPrice, setBtcPrice] = useState(0);
  const [difficulty, setDifficulty] = useState(0);

  // Load miners from storage on mount
  useEffect(() => {
    const stored = getJSON<Miner[]>(STORAGE_KEYS.MINERS, []);
    setMiners(stored);
    setIsLoading(false);
  }, []);

  // Save miners to storage whenever they change
  useEffect(() => {
    if (!isLoading) {
      setJSON(STORAGE_KEYS.MINERS, miners);
    }
  }, [miners, isLoading]);

  // Set BTC data
  const setBtcData = useCallback((price: number, diff: number) => {
    setBtcPrice(price);
    setDifficulty(diff);
  }, []);

  // Generate UUID
  const generateId = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  };

  // Add miner
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

  // Update miner
  const updateMiner = useCallback((id: string, updates: UpdateMinerInput) => {
    setMiners((prev) =>
      prev.map((miner) =>
        miner.id === id
          ? { ...miner, ...updates, updatedAt: new Date().toISOString() }
          : miner
      )
    );
  }, []);

  // Delete miner
  const deleteMiner = useCallback((id: string) => {
    setMiners((prev) => prev.filter((miner) => miner.id !== id));
  }, []);

  // Get miner by ID
  const getMiner = useCallback(
    (id: string) => miners.find((m) => m.id === id),
    [miners]
  );

  // Calculate stats for each miner
  const minersWithStats = useMemo<MinerWithStats[]>(() => {
    if (btcPrice === 0 || difficulty === 0) {
      return miners.map((miner) => ({
        ...miner,
        dailyProfitBTC: 0,
        dailyProfitUSD: 0,
        totalDiscountPercent: calculateTotalDiscount(miner.discounts),
      }));
    }

    return miners.map((miner) => {
      const result = calculateMiningProfitability(
        {
          hashrate: miner.hashrate,
          efficiency: miner.efficiency,
          difficulty,
          btcPrice,
        },
        miner.discounts
      );

      return {
        ...miner,
        dailyProfitBTC: result.netRewardBTC,
        dailyProfitUSD: result.netRewardUSD,
        totalDiscountPercent: result.discountPercent,
      };
    });
  }, [miners, btcPrice, difficulty]);

  // Farm totals
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

  const value: FarmContextValue = {
    miners,
    minersWithStats,
    isLoading,
    addMiner,
    updateMiner,
    deleteMiner,
    getMiner,
    setBtcData,
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
