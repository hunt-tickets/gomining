/**
 * Crypto Price API Service
 * Uses multiple free APIs without API keys
 * Fallback chain: Binance -> Blockchain.info -> Kraken -> CoinCap
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
// API ENDPOINTS (All free, no API keys required)
// ═══════════════════════════════════════════════════════════════════

const BINANCE_URL = 'https://api.binance.com/api/v3';
const BLOCKCHAIN_INFO_URL = 'https://blockchain.info';
const KRAKEN_URL = 'https://api.kraken.com/0/public';
const COINCAP_URL = 'https://api.coincap.io/v2';
const COINGECKO_URL = 'https://api.coingecko.com/api/v3';

// ═══════════════════════════════════════════════════════════════════
// INDIVIDUAL API FETCHERS
// ═══════════════════════════════════════════════════════════════════

/**
 * Fetch from Binance (most reliable, best uptime)
 */
async function fetchFromBinance(): Promise<BitcoinPrice> {
  const [tickerRes, ticker24hRes] = await Promise.all([
    fetch(`${BINANCE_URL}/ticker/price?symbol=BTCUSDT`),
    fetch(`${BINANCE_URL}/ticker/24hr?symbol=BTCUSDT`),
  ]);

  if (!tickerRes.ok || !ticker24hRes.ok) {
    throw new Error('Binance API error');
  }

  const ticker = await tickerRes.json();
  const ticker24h = await ticker24hRes.json();

  return {
    usd: parseFloat(ticker.price),
    usd_24h_change: parseFloat(ticker24h.priceChangePercent),
    usd_24h_vol: parseFloat(ticker24h.volume) * parseFloat(ticker.price),
    usd_market_cap: 0, // Binance doesn't provide this
    last_updated_at: Date.now(),
  };
}

/**
 * Fetch from Blockchain.info
 */
async function fetchFromBlockchainInfo(): Promise<BitcoinPrice> {
  const response = await fetch(`${BLOCKCHAIN_INFO_URL}/ticker`);

  if (!response.ok) {
    throw new Error('Blockchain.info API error');
  }

  const data = await response.json();
  const usdData = data.USD;

  return {
    usd: usdData.last,
    usd_24h_change: ((usdData.last - usdData.sell) / usdData.sell) * 100,
    usd_24h_vol: 0,
    usd_market_cap: 0,
    last_updated_at: Date.now(),
  };
}

/**
 * Fetch from Kraken
 */
async function fetchFromKraken(): Promise<BitcoinPrice> {
  const response = await fetch(`${KRAKEN_URL}/Ticker?pair=XBTUSD`);

  if (!response.ok) {
    throw new Error('Kraken API error');
  }

  const data = await response.json();

  if (data.error && data.error.length > 0) {
    throw new Error(data.error[0]);
  }

  const ticker = data.result.XXBTZUSD;

  return {
    usd: parseFloat(ticker.c[0]), // Last trade closed price
    usd_24h_change: ((parseFloat(ticker.c[0]) - parseFloat(ticker.o)) / parseFloat(ticker.o)) * 100,
    usd_24h_vol: parseFloat(ticker.v[1]) * parseFloat(ticker.c[0]), // 24h volume
    usd_market_cap: 0,
    last_updated_at: Date.now(),
  };
}

/**
 * Fetch from CoinCap
 */
async function fetchFromCoinCap(): Promise<BitcoinPrice> {
  const response = await fetch(`${COINCAP_URL}/assets/bitcoin`, {
    headers: { 'Accept': 'application/json' },
  });

  if (!response.ok) {
    throw new Error('CoinCap API error');
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
}

/**
 * Fetch from CoinGecko (rate limited but comprehensive)
 */
async function fetchFromCoinGecko(): Promise<BitcoinPrice> {
  const response = await fetch(
    `${COINGECKO_URL}/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true&include_market_cap=true`
  );

  if (!response.ok) {
    throw new Error('CoinGecko API error');
  }

  const data = await response.json();
  const btc = data.bitcoin;

  return {
    usd: btc.usd,
    usd_24h_change: btc.usd_24h_change || 0,
    usd_24h_vol: btc.usd_24h_vol || 0,
    usd_market_cap: btc.usd_market_cap || 0,
    last_updated_at: Date.now(),
  };
}

// ═══════════════════════════════════════════════════════════════════
// MAIN API FUNCTIONS WITH FALLBACKS
// ═══════════════════════════════════════════════════════════════════

/**
 * Get current Bitcoin price with automatic fallback
 * Tries multiple APIs in order until one succeeds
 */
export async function getBitcoinPrice(): Promise<BitcoinPrice> {
  const sources = [
    { name: 'Binance', fn: fetchFromBinance },
    { name: 'Kraken', fn: fetchFromKraken },
    { name: 'Blockchain.info', fn: fetchFromBlockchainInfo },
    { name: 'CoinCap', fn: fetchFromCoinCap },
    { name: 'CoinGecko', fn: fetchFromCoinGecko },
  ];

  for (const source of sources) {
    try {
      const result = await source.fn();
      if (result.usd > 0) {
        console.log(`[Price API] Successfully fetched from ${source.name}: $${result.usd.toFixed(2)}`);
        return result;
      }
    } catch (error) {
      console.warn(`[Price API] ${source.name} failed:`, error);
      continue;
    }
  }

  // All APIs failed, return zero values
  console.error('[Price API] All price sources failed');
  return {
    usd: 0,
    usd_24h_change: 0,
    usd_24h_vol: 0,
    usd_market_cap: 0,
    last_updated_at: Date.now(),
  };
}

/**
 * Get Bitcoin price history
 */
export async function getBitcoinPriceHistory(days: number = 30): Promise<PriceHistory> {
  // Try CoinCap first (better CORS)
  try {
    const interval = days <= 1 ? 'm15' : days <= 7 ? 'h1' : 'd1';
    const end = Date.now();
    const start = end - days * 24 * 60 * 60 * 1000;

    const response = await fetch(
      `${COINCAP_URL}/assets/bitcoin/history?interval=${interval}&start=${start}&end=${end}`,
      { headers: { 'Accept': 'application/json' } }
    );

    if (response.ok) {
      const result = await response.json();
      const prices: [number, number][] = result.data.map((item: any) => [
        item.time,
        parseFloat(item.priceUsd),
      ]);

      return { prices, market_caps: [], total_volumes: [] };
    }
  } catch (error) {
    console.warn('[Price API] CoinCap history failed:', error);
  }

  // Fallback to CoinGecko
  try {
    const response = await fetch(
      `${COINGECKO_URL}/coins/bitcoin/market_chart?vs_currency=usd&days=${days}`
    );

    if (response.ok) {
      const data = await response.json();
      return {
        prices: data.prices || [],
        market_caps: data.market_caps || [],
        total_volumes: data.total_volumes || [],
      };
    }
  } catch (error) {
    console.warn('[Price API] CoinGecko history failed:', error);
  }

  return { prices: [], market_caps: [], total_volumes: [] };
}

/**
 * Get price for any cryptocurrency by symbol
 * Supports: BTC, ETH, USDT, USDC, etc.
 */
export async function getCryptoPrice(symbol: string): Promise<number> {
  const upperSymbol = symbol.toUpperCase();

  // Handle stablecoins
  if (['USDT', 'USDC', 'DAI', 'BUSD'].includes(upperSymbol)) {
    return 1.0;
  }

  // Try Binance first
  try {
    const pair = `${upperSymbol}USDT`;
    const response = await fetch(`${BINANCE_URL}/ticker/price?symbol=${pair}`);
    if (response.ok) {
      const data = await response.json();
      return parseFloat(data.price);
    }
  } catch (error) {
    console.warn(`[Price API] Binance failed for ${symbol}:`, error);
  }

  // Try CoinCap
  try {
    const coinId = symbol.toLowerCase();
    const response = await fetch(`${COINCAP_URL}/assets/${coinId}`);
    if (response.ok) {
      const result = await response.json();
      return parseFloat(result.data.priceUsd);
    }
  } catch (error) {
    console.warn(`[Price API] CoinCap failed for ${symbol}:`, error);
  }

  return 0;
}

/**
 * Get GOMINING token price
 */
export async function getGominingPrice(): Promise<{ usd: number; usd_24h_change: number } | null> {
  // Try Binance (GOMINING is listed as GOMINING)
  try {
    const response = await fetch(`${BINANCE_URL}/ticker/24hr?symbol=GOMININGUSDT`);
    if (response.ok) {
      const data = await response.json();
      return {
        usd: parseFloat(data.lastPrice),
        usd_24h_change: parseFloat(data.priceChangePercent),
      };
    }
  } catch (error) {
    console.warn('[Price API] Binance GOMINING failed:', error);
  }

  // Try CoinCap search
  try {
    const response = await fetch(`${COINCAP_URL}/assets?search=gomining`);
    if (response.ok) {
      const result = await response.json();
      const token = result.data.find(
        (t: any) => t.symbol.toLowerCase() === 'gmt' || t.name.toLowerCase().includes('gomining')
      );
      if (token) {
        return {
          usd: parseFloat(token.priceUsd),
          usd_24h_change: parseFloat(token.changePercent24Hr),
        };
      }
    }
  } catch (error) {
    console.warn('[Price API] CoinCap GOMINING failed:', error);
  }

  return null;
}
