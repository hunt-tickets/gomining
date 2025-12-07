/**
 * Farm & Miner Types
 */

import type { Currency } from './currency';

// ═══════════════════════════════════════════════════════════════════
// MINER TYPES
// ═══════════════════════════════════════════════════════════════════

export interface Miner {
  id: string;
  name: string;
  hashrate: number; // TH/s
  efficiency: number; // W/TH
  discountPercent: number; // Single discount field (0-29%)
  createdAt: string;
  updatedAt: string;
}

export interface MinerWithStats extends Miner {
  dailyProfitBTC: number;
  dailyProfitUSD: number;
  // Calculated from transactions
  totalInvestedUSD: number;
  totalEarnedUSD: number;
  roi: number; // Percentage
}

// ═══════════════════════════════════════════════════════════════════
// TRANSACTION TYPES
// ═══════════════════════════════════════════════════════════════════

/**
 * Daily income record - tracks daily mining rewards and costs
 */
export interface DailyIncomeRecord {
  id: string;
  minerId: string;
  date: string; // ISO date string (YYYY-MM-DD)

  // Gross income received
  grossIncome: number;
  grossIncomeCurrency: Currency;
  grossIncomeUSD: number; // Value at time of receipt

  // Electricity cost paid
  electricityCost: number;
  electricityCurrency: Currency;
  electricityCostUSD: number;

  // Service fee paid
  serviceCost: number;
  serviceCurrency: Currency;
  serviceCostUSD: number;

  // Discount applied that day
  discountPercent: number;

  // Net income (calculated: gross - electricity - service)
  netIncomeUSD: number;

  // What was done with the earnings (optional)
  reinvestment?: {
    amount: number;
    currency: Currency;
    type: 'hashrate' | 'tokens' | 'efficiency';
  };

  // Notes
  note?: string;

  createdAt: string;
}

/**
 * Investment record - tracks money put into the miner
 */
export type InvestmentType =
  | 'initial'     // Initial purchase
  | 'hashrate'    // Buying more TH/s
  | 'efficiency'  // Upgrading efficiency (W/TH)
  | 'tokens'      // Buying tokens for discounts
  | 'other';      // Other investments

export interface InvestmentRecord {
  id: string;
  minerId: string;
  date: string; // ISO date string

  type: InvestmentType;

  // Amount paid
  amount: number;
  currency: Currency;
  amountUSD: number; // Converted to USD

  // Optional: manual USD rate used
  manualRate?: number;

  // What changed (optional details)
  details?: {
    hashrateBefore?: number;
    hashrateAfter?: number;
    efficiencyBefore?: number;
    efficiencyAfter?: number;
    tokenDaysBought?: number;
  };

  note?: string;
  createdAt: string;
}

// ═══════════════════════════════════════════════════════════════════
// MINER WITH FULL DATA
// ═══════════════════════════════════════════════════════════════════

export interface MinerWithTransactions extends MinerWithStats {
  incomeRecords: DailyIncomeRecord[];
  investments: InvestmentRecord[];
}

// ═══════════════════════════════════════════════════════════════════
// FARM TYPES
// ═══════════════════════════════════════════════════════════════════

export interface Farm {
  miners: Miner[];
  totalHashrate: number;
  totalDailyProfitUSD: number;
  totalDailyProfitBTC: number;
}

// ═══════════════════════════════════════════════════════════════════
// INPUT TYPES
// ═══════════════════════════════════════════════════════════════════

export type CreateMinerInput = Omit<Miner, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateMinerInput = Partial<Omit<Miner, 'id' | 'createdAt' | 'updatedAt'>>;

export type CreateDailyIncomeInput = Omit<DailyIncomeRecord, 'id' | 'createdAt'>;
export type CreateInvestmentInput = Omit<InvestmentRecord, 'id' | 'createdAt'>;

// Re-export Currency for convenience
export type { Currency } from './currency';
