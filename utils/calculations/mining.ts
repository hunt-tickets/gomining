/**
 * Mining Calculations
 * Core formulas for GoMining profitability calculations
 */

// ═══════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════

export const MINING_CONSTANTS = {
  BLOCK_REWARD: 3.125, // BTC per block (post-halving 2024)
  BLOCKS_PER_DAY: 144, // Average blocks mined per day
  SECONDS_PER_DAY: 86400,
  DEFAULT_ELECTRICITY_COST: 0.06, // $/kWh
  DEFAULT_SERVICE_FEE_PERCENT: 0.05, // 5% service fee
} as const;

// ═══════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════

export interface MiningCalculationParams {
  hashrate: number; // TH/s
  efficiency: number; // W/TH
  difficulty: number; // Network difficulty
  btcPrice: number; // USD
  electricityCost?: number; // $/kWh
}

export interface DiscountParams {
  tokenDays: number; // Days of fee coverage (0-400)
  vipLevel: number; // VIP level (0-20)
  dailyClicks: number; // Consecutive daily clicks (0-10)
}

export interface MiningResult {
  grossRewardBTC: number;
  grossRewardUSD: number;
  electricityCostBTC: number;
  electricityCostUSD: number;
  serviceCostBTC: number;
  serviceCostUSD: number;
  totalCostBTC: number;
  totalCostUSD: number;
  netRewardBTC: number;
  netRewardUSD: number;
  discountPercent: number;
}

// ═══════════════════════════════════════════════════════════════════
// CORE CALCULATIONS
// ═══════════════════════════════════════════════════════════════════

/**
 * Calculate daily BTC reward based on hashrate and network difficulty
 * Formula: (Hashrate × 86400 × Block_Reward) / (Difficulty × 2^32)
 */
export function calculateDailyBTCReward(
  hashrateTH: number,
  difficulty: number
): number {
  const hashrateH = hashrateTH * 1e12; // Convert TH/s to H/s
  const dailyReward =
    (hashrateH * MINING_CONSTANTS.SECONDS_PER_DAY * MINING_CONSTANTS.BLOCK_REWARD) /
    (difficulty * Math.pow(2, 32));
  return dailyReward;
}

/**
 * Calculate electricity cost in BTC
 * Formula: (kWh_cost × 24 × efficiency × hashrate) / (1000 × BTC_price)
 */
export function calculateElectricityCost(
  hashrateTH: number,
  efficiencyWTH: number,
  electricityCostKWh: number,
  btcPrice: number
): number {
  const dailyKWh = (efficiencyWTH * hashrateTH * 24) / 1000;
  const dailyCostUSD = dailyKWh * electricityCostKWh;
  const dailyCostBTC = dailyCostUSD / btcPrice;
  return dailyCostBTC;
}

/**
 * Calculate total discount percentage from all sources
 */
export function calculateTotalDiscount(params: DiscountParams): number {
  // Token discount: 0% (0-17 days) to 20% (360+ days)
  // Approximately 1% per 18 days
  const tokenDiscount = Math.min(20, Math.floor(params.tokenDays / 18));

  // VIP discount: 0.3% per level, max 6% at level 20
  const vipDiscount = params.vipLevel * 0.3;

  // Daily click discount: 0.3% per day, max 3% at 10 days
  const dailyDiscount = Math.min(10, params.dailyClicks) * 0.3;

  return tokenDiscount + vipDiscount + dailyDiscount;
}

/**
 * Calculate complete mining profitability
 */
export function calculateMiningProfitability(
  params: MiningCalculationParams,
  discounts?: DiscountParams
): MiningResult {
  const {
    hashrate,
    efficiency,
    difficulty,
    btcPrice,
    electricityCost = MINING_CONSTANTS.DEFAULT_ELECTRICITY_COST,
  } = params;

  // Calculate gross reward
  const grossRewardBTC = calculateDailyBTCReward(hashrate, difficulty);
  const grossRewardUSD = grossRewardBTC * btcPrice;

  // Calculate electricity cost
  const electricityCostBTC = calculateElectricityCost(
    hashrate,
    efficiency,
    electricityCost,
    btcPrice
  );
  const electricityCostUSD = electricityCostBTC * btcPrice;

  // Calculate service fee (percentage of gross reward)
  const serviceCostBTC = grossRewardBTC * MINING_CONSTANTS.DEFAULT_SERVICE_FEE_PERCENT;
  const serviceCostUSD = serviceCostBTC * btcPrice;

  // Calculate total costs before discount
  let totalCostBTC = electricityCostBTC + serviceCostBTC;
  let totalCostUSD = electricityCostUSD + serviceCostUSD;

  // Apply discounts if provided
  let discountPercent = 0;
  if (discounts) {
    discountPercent = calculateTotalDiscount(discounts);
    const discountMultiplier = 1 - discountPercent / 100;
    totalCostBTC *= discountMultiplier;
    totalCostUSD *= discountMultiplier;
  }

  // Calculate net reward
  const netRewardBTC = grossRewardBTC - totalCostBTC;
  const netRewardUSD = grossRewardUSD - totalCostUSD;

  return {
    grossRewardBTC,
    grossRewardUSD,
    electricityCostBTC,
    electricityCostUSD,
    serviceCostBTC,
    serviceCostUSD,
    totalCostBTC,
    totalCostUSD,
    netRewardBTC,
    netRewardUSD,
    discountPercent,
  };
}

// ═══════════════════════════════════════════════════════════════════
// PROJECTION CALCULATIONS
// ═══════════════════════════════════════════════════════════════════

export interface ProjectionParams {
  dailyNetBTC: number;
  btcPrice: number;
  months: number;
  btcPriceChangePercent?: number; // Expected monthly change
  difficultyChangePercent?: number; // Expected monthly change
}

export interface ProjectionResult {
  month: number;
  accumulatedBTC: number;
  accumulatedUSD: number;
  btcPrice: number;
  monthlyBTC: number;
  monthlyUSD: number;
}

/**
 * Calculate earnings projection over time
 */
export function calculateProjection(params: ProjectionParams): ProjectionResult[] {
  const {
    dailyNetBTC,
    btcPrice,
    months,
    btcPriceChangePercent = 0,
    difficultyChangePercent = 0,
  } = params;

  const results: ProjectionResult[] = [];
  let currentBTCPrice = btcPrice;
  let currentDailyBTC = dailyNetBTC;
  let accumulatedBTC = 0;

  for (let month = 1; month <= months; month++) {
    // Apply monthly changes
    currentBTCPrice *= 1 + btcPriceChangePercent / 100;
    currentDailyBTC *= 1 - difficultyChangePercent / 100; // Difficulty up = reward down

    const monthlyBTC = currentDailyBTC * 30;
    accumulatedBTC += monthlyBTC;

    results.push({
      month,
      accumulatedBTC,
      accumulatedUSD: accumulatedBTC * currentBTCPrice,
      btcPrice: currentBTCPrice,
      monthlyBTC,
      monthlyUSD: monthlyBTC * currentBTCPrice,
    });
  }

  return results;
}

/**
 * Calculate ROI and breakeven
 */
export function calculateROI(
  initialInvestment: number,
  monthlyNetUSD: number
): { roiPercent: number; breakevenMonths: number } {
  const yearlyNet = monthlyNetUSD * 12;
  const roiPercent = (yearlyNet / initialInvestment) * 100;
  const breakevenMonths = initialInvestment / monthlyNetUSD;

  return {
    roiPercent,
    breakevenMonths,
  };
}
