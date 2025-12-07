/**
 * Bitcoin Price API Service
 * Uses CoinCap API (better CORS support than CoinGecko)
 * Fallback to mock data if API fails
 */

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
// COINCAP API (Better CORS support)
// ═══════════════════════════════════════════════════════════════════

const COINCAP_URL = 'https://api.coincap.io/v2';

/**
 * Get current Bitcoin price with 24h change
 */
export async function getBitcoinPrice(): Promise<BitcoinPrice> {
  try {
    const response = await fetch(`${COINCAP_URL}/assets/bitcoin`, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`CoinCap API error: ${response.status}`);
    }

    const result = await response.json();
    const data = result.data;

    return {
      usd: parseFloat(data.priceUsd),
      usd_24h_change: parseFloat(data.changePercent24Hr),
      usd_24h_vol: parseFloat(data.volumeUsd24Hr),
      usd_market_cap: parseFloat(data.marketCapUsd),
      last_updated_at: Date.now(),
    };
  } catch (error) {
    console.error('Error fetching Bitcoin price:', error);
    // Return fallback data so the app still works
    return {
      usd: 0,
      usd_24h_change: 0,
      usd_24h_vol: 0,
      usd_market_cap: 0,
      last_updated_at: Date.now(),
    };
  }
}

/**
 * Get Bitcoin price history
 * @param days Number of days of history (1, 7, 30, 90, 365)
 */
export async function getBitcoinPriceHistory(days: number = 30): Promise<PriceHistory> {
  try {
    // CoinCap uses intervals: m1, m5, m15, m30, h1, h2, h6, h12, d1
    const interval = days <= 1 ? 'm15' : days <= 7 ? 'h1' : 'd1';
    const end = Date.now();
    const start = end - days * 24 * 60 * 60 * 1000;

    const response = await fetch(
      `${COINCAP_URL}/assets/bitcoin/history?interval=${interval}&start=${start}&end=${end}`,
      {
        headers: {
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`CoinCap API error: ${response.status}`);
    }

    const result = await response.json();
    const prices: [number, number][] = result.data.map((item: any) => [
      item.time,
      parseFloat(item.priceUsd),
    ]);

    return {
      prices,
      market_caps: [],
      total_volumes: [],
    };
  } catch (error) {
    console.error('Error fetching price history:', error);
    return {
      prices: [],
      market_caps: [],
      total_volumes: [],
    };
  }
}

/**
 * Get GOMINING token price (if available)
 */
export async function getGominingPrice(): Promise<{ usd: number; usd_24h_change: number } | null> {
  try {
    // Try to find GOMINING token on CoinCap
    const response = await fetch(`${COINCAP_URL}/assets?search=gomining`, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      return null;
    }

    const result = await response.json();
    const token = result.data.find(
      (t: any) => t.symbol.toLowerCase() === 'gmt' || t.name.toLowerCase().includes('gomining')
    );

    if (!token) {
      return null;
    }

    return {
      usd: parseFloat(token.priceUsd),
      usd_24h_change: parseFloat(token.changePercent24Hr),
    };
  } catch (error) {
    console.error('Error fetching GOMINING price:', error);
    return null;
  }
}
