/**
 * Bitcoin Data Hook
 * Fetches and caches BTC price and network difficulty
 */

import { useState, useEffect, useCallback } from 'react';
import { getBitcoinPrice, type BitcoinPrice } from '@/services/api/coingecko';
import { getNetworkDifficulty } from '@/services/api/blockchain';
import { storage, STORAGE_KEYS, getJSON, setJSON } from '@/services/storage';

// ═══════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════

export interface BitcoinData {
  price: number;
  priceChange24h: number;
  difficulty: number;
  lastUpdated: Date | null;
  isLoading: boolean;
  error: string | null;
}

interface CachedData {
  price: number;
  priceChange24h: number;
  difficulty: number;
  timestamp: number;
}

// ═══════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const REFRESH_INTERVAL = 60 * 1000; // 1 minute

// ═══════════════════════════════════════════════════════════════════
// HOOK
// ═══════════════════════════════════════════════════════════════════

export function useBitcoinData() {
  const [data, setData] = useState<BitcoinData>({
    price: 0,
    priceChange24h: 0,
    difficulty: 0,
    lastUpdated: null,
    isLoading: true,
    error: null,
  });

  const fetchData = useCallback(async (useCache = true) => {
    // Check cache first
    if (useCache) {
      const cached = getJSON<CachedData | null>(STORAGE_KEYS.BTC_PRICE_CACHE, null);
      if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        setData({
          price: cached.price,
          priceChange24h: cached.priceChange24h,
          difficulty: cached.difficulty,
          lastUpdated: new Date(cached.timestamp),
          isLoading: false,
          error: null,
        });
        return;
      }
    }

    setData((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const [priceData, difficulty] = await Promise.all([
        getBitcoinPrice(),
        getNetworkDifficulty(),
      ]);

      const newData: CachedData = {
        price: priceData.usd,
        priceChange24h: priceData.usd_24h_change,
        difficulty,
        timestamp: Date.now(),
      };

      // Cache the data
      setJSON(STORAGE_KEYS.BTC_PRICE_CACHE, newData);

      setData({
        price: newData.price,
        priceChange24h: newData.priceChange24h,
        difficulty: newData.difficulty,
        lastUpdated: new Date(newData.timestamp),
        isLoading: false,
        error: null,
      });
    } catch (error) {
      setData((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch data',
      }));
    }
  }, []);

  const refresh = useCallback(() => {
    fetchData(false);
  }, [fetchData]);

  // Initial fetch and periodic refresh
  useEffect(() => {
    fetchData();

    const interval = setInterval(() => {
      fetchData(false);
    }, REFRESH_INTERVAL);

    return () => clearInterval(interval);
  }, [fetchData]);

  return {
    ...data,
    refresh,
  };
}
