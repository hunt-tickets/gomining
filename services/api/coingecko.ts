/**
 * CoinGecko API Service
 * Free API - No API key required
 * Rate limit: 10-30 calls/minute for free tier
 */

const BASE_URL = 'https://api.coingecko.com/api/v3';

// ═══════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════

export interface BitcoinPrice {
  usd: number;
  usd_24h_change: number;
  usd_24h_vol: number;
  usd_market_cap: number;
  last_updated_at: number;
}

export interface PriceHistory {
  prices: [number, number][]; // [timestamp, price]
  market_caps: [number, number][];
  total_volumes: [number, number][];
}

// ═══════════════════════════════════════════════════════════════════
// API FUNCTIONS
// ═══════════════════════════════════════════════════════════════════

/**
 * Get current Bitcoin price with 24h change
 */
export async function getBitcoinPrice(): Promise<BitcoinPrice> {
  try {
    const response = await fetch(
      `${BASE_URL}/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true&include_market_cap=true&include_last_updated_at=true`
    );

    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status}`);
    }

    const data = await response.json();
    return {
      usd: data.bitcoin.usd,
      usd_24h_change: data.bitcoin.usd_24h_change,
      usd_24h_vol: data.bitcoin.usd_24h_vol,
      usd_market_cap: data.bitcoin.usd_market_cap,
      last_updated_at: data.bitcoin.last_updated_at,
    };
  } catch (error) {
    console.error('Error fetching Bitcoin price:', error);
    throw error;
  }
}

/**
 * Get Bitcoin price history
 * @param days Number of days of history (1, 7, 30, 90, 365)
 */
export async function getBitcoinPriceHistory(days: number = 30): Promise<PriceHistory> {
  try {
    const response = await fetch(
      `${BASE_URL}/coins/bitcoin/market_chart?vs_currency=usd&days=${days}`
    );

    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching price history:', error);
    throw error;
  }
}

/**
 * Get GOMINING token price (if available)
 */
export async function getGominingPrice(): Promise<{ usd: number; usd_24h_change: number } | null> {
  try {
    const response = await fetch(
      `${BASE_URL}/simple/price?ids=gomining&vs_currencies=usd&include_24hr_change=true`
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    if (!data.gomining) {
      return null;
    }

    return {
      usd: data.gomining.usd,
      usd_24h_change: data.gomining.usd_24h_change,
    };
  } catch (error) {
    console.error('Error fetching GOMINING price:', error);
    return null;
  }
}
