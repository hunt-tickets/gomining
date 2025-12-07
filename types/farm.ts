/**
 * Farm & Miner Types
 */

// ═══════════════════════════════════════════════════════════════════
// CURRENCY & PAYMENT TYPES
// ═══════════════════════════════════════════════════════════════════

export type PaymentCurrency = 'BTC' | 'GMT';

// ═══════════════════════════════════════════════════════════════════
// MINER TYPES
// ═══════════════════════════════════════════════════════════════════

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
  grossIncomeCurrency: PaymentCurrency;
  grossIncomeUSD: number; // Value at time of receipt

  // Electricity cost paid
  electricityCost: number;
  electricityCurrency: PaymentCurrency;
  electricityCostUSD: number;

  // Service fee paid
  serviceCost: number;
  serviceCurrency: PaymentCurrency;
  serviceCostUSD: number;

  // Discount applied that day
  discountPercent: number;

  // Net income (calculated: gross - electricity - service)
  netIncome: number;
  netIncomeCurrency: PaymentCurrency;
  netIncomeUSD: number;

  // What was done with the earnings (optional)
  reinvestment?: {
    amount: number;
    currency: PaymentCurrency;
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
  | 'tokens';     // Buying GMT tokens for discounts

export interface InvestmentRecord {
  id: string;
  minerId: string;
  date: string; // ISO date string

  type: InvestmentType;
  amountUSD: number;

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
