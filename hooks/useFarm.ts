/**
 * Farm Management Hook
 * CRUD operations for miners with local storage persistence
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { storage, STORAGE_KEYS, getJSON, setJSON } from '@/services/storage';
import { calculateMiningProfitability, calculateTotalDiscount } from '@/utils/calculations';
import type { Miner, CreateMinerInput, UpdateMinerInput, MinerWithStats } from '@/types';

// ═══════════════════════════════════════════════════════════════════
// HOOK
// ═══════════════════════════════════════════════════════════════════

export function useFarm(btcPrice: number = 0, difficulty: number = 0) {
  const [miners, setMiners] = useState<Miner[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  // Add miner
  const addMiner = useCallback((input: CreateMinerInput) => {
    const now = new Date().toISOString();
    const newMiner: Miner = {
      ...input,
      id: uuidv4(),
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

  return {
    miners,
    minersWithStats,
    isLoading,
    addMiner,
    updateMiner,
    deleteMiner,
    getMiner,
    ...farmTotals,
    minerCount: miners.length,
  };
}
