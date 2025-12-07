/**
 * Farm & Miner Types
 */

export interface MinerDiscounts {
  tokenDays: number; // Days of GOMINING token coverage (0-400)
  vipLevel: number; // VIP level (0-20)
  dailyClicks: number; // Consecutive daily clicks (0-10)
}

export interface Miner {
  id: string;
  name: string;
  hashrate: number; // TH/s
  efficiency: number; // W/TH
  discounts: MinerDiscounts;
  createdAt: string;
  updatedAt: string;
}

export interface MinerWithStats extends Miner {
  dailyProfitBTC: number;
  dailyProfitUSD: number;
  totalDiscountPercent: number;
}

export interface Farm {
  miners: Miner[];
  totalHashrate: number;
  totalDailyProfitUSD: number;
  totalDailyProfitBTC: number;
}

export type CreateMinerInput = Omit<Miner, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateMinerInput = Partial<Omit<Miner, 'id' | 'createdAt' | 'updatedAt'>>;
