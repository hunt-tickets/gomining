/**
 * Bitcoin Network API Service
 * Uses multiple free APIs without API keys
 * Fallback chain: Mempool.space -> Blockchain.info -> Blockchair
 */

// ═══════════════════════════════════════════════════════════════════
// API ENDPOINTS (All free, no API keys required)
// ═══════════════════════════════════════════════════════════════════

const MEMPOOL_URL = 'https://mempool.space/api';
const BLOCKCHAIN_INFO_URL = 'https://blockchain.info';
const BLOCKCHAIR_URL = 'https://api.blockchair.com/bitcoin';

// ═══════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════

export interface NetworkStats {
  difficulty: number;
  hashrate: number; // Estimated network hashrate in EH/s
  blockHeight: number;
}

// ═══════════════════════════════════════════════════════════════════
// INDIVIDUAL API FETCHERS
// ═══════════════════════════════════════════════════════════════════

/**
 * Fetch difficulty from Mempool.space
 */
async function fetchDifficultyFromMempool(): Promise<number> {
  const response = await fetch(`${MEMPOOL_URL}/v1/mining/hashrate/3d`, {
    headers: { 'Accept': 'application/json' },
  });

  if (!response.ok) {
    throw new Error(`Mempool API error: ${response.status}`);
  }

  const data = await response.json();
  const difficulty = data.currentDifficulty || 0;
  return difficulty / 1e12; // Convert to T (trillions)
}

/**
 * Fetch difficulty from Blockchain.info
 */
async function fetchDifficultyFromBlockchainInfo(): Promise<number> {
  const response = await fetch(`${BLOCKCHAIN_INFO_URL}/q/getdifficulty`);

  if (!response.ok) {
    throw new Error(`Blockchain.info API error: ${response.status}`);
  }

  const difficulty = await response.text();
  return parseFloat(difficulty) / 1e12; // Convert to T
}

/**
 * Fetch difficulty from Blockchair
 */
async function fetchDifficultyFromBlockchair(): Promise<number> {
  const response = await fetch(`${BLOCKCHAIR_URL}/stats`);

  if (!response.ok) {
    throw new Error(`Blockchair API error: ${response.status}`);
  }

  const data = await response.json();
  const difficulty = data.data?.difficulty || 0;
  return difficulty / 1e12; // Convert to T
}

// ═══════════════════════════════════════════════════════════════════
// MAIN API FUNCTIONS WITH FALLBACKS
// ═══════════════════════════════════════════════════════════════════

/**
 * Get current Bitcoin network difficulty with automatic fallback
 * Returns difficulty in trillions (T) for easier display
 */
export async function getNetworkDifficulty(): Promise<number> {
  const sources = [
    { name: 'Mempool.space', fn: fetchDifficultyFromMempool },
    { name: 'Blockchain.info', fn: fetchDifficultyFromBlockchainInfo },
    { name: 'Blockchair', fn: fetchDifficultyFromBlockchair },
  ];

  for (const source of sources) {
    try {
      const result = await source.fn();
      if (result > 0) {
        console.log(`[Network API] Successfully fetched difficulty from ${source.name}: ${result.toFixed(2)}T`);
        return result;
      }
    } catch (error) {
      console.warn(`[Network API] ${source.name} failed:`, error);
      continue;
    }
  }

  // All APIs failed, return approximate current difficulty as fallback
  console.error('[Network API] All difficulty sources failed, using fallback');
  return 100; // ~100T as of late 2024
}

/**
 * Get current block height with automatic fallback
 */
export async function getBlockHeight(): Promise<number> {
  // Try Mempool.space first
  try {
    const response = await fetch(`${MEMPOOL_URL}/blocks/tip/height`, {
      headers: { 'Accept': 'application/json' },
    });

    if (response.ok) {
      const height = await response.text();
      const parsed = parseInt(height, 10);
      if (parsed > 0) {
        console.log(`[Network API] Block height from Mempool.space: ${parsed}`);
        return parsed;
      }
    }
  } catch (error) {
    console.warn('[Network API] Mempool.space block height failed:', error);
  }

  // Try Blockchain.info
  try {
    const response = await fetch(`${BLOCKCHAIN_INFO_URL}/q/getblockcount`);

    if (response.ok) {
      const height = await response.text();
      const parsed = parseInt(height, 10);
      if (parsed > 0) {
        console.log(`[Network API] Block height from Blockchain.info: ${parsed}`);
        return parsed;
      }
    }
  } catch (error) {
    console.warn('[Network API] Blockchain.info block height failed:', error);
  }

  // Try Blockchair
  try {
    const response = await fetch(`${BLOCKCHAIR_URL}/stats`);

    if (response.ok) {
      const data = await response.json();
      const height = data.data?.blocks || 0;
      if (height > 0) {
        console.log(`[Network API] Block height from Blockchair: ${height}`);
        return height;
      }
    }
  } catch (error) {
    console.warn('[Network API] Blockchair block height failed:', error);
  }

  return 0;
}

/**
 * Get estimated network hashrate (EH/s) with automatic fallback
 */
export async function getNetworkHashrate(): Promise<number> {
  // Try Mempool.space first
  try {
    const response = await fetch(`${MEMPOOL_URL}/v1/mining/hashrate/3d`, {
      headers: { 'Accept': 'application/json' },
    });

    if (response.ok) {
      const data = await response.json();
      const hashrates = data.hashrates || [];
      if (hashrates.length > 0) {
        const latest = hashrates[hashrates.length - 1];
        const hashrate = latest.avgHashrate / 1e18; // Convert to EH/s
        console.log(`[Network API] Hashrate from Mempool.space: ${hashrate.toFixed(2)} EH/s`);
        return hashrate;
      }
    }
  } catch (error) {
    console.warn('[Network API] Mempool.space hashrate failed:', error);
  }

  // Try Blockchain.info
  try {
    const response = await fetch(`${BLOCKCHAIN_INFO_URL}/q/hashrate`);

    if (response.ok) {
      const hashrate = await response.text();
      const parsed = parseFloat(hashrate) / 1e9; // Convert to EH/s (blockchain.info returns GH/s)
      if (parsed > 0) {
        console.log(`[Network API] Hashrate from Blockchain.info: ${parsed.toFixed(2)} EH/s`);
        return parsed;
      }
    }
  } catch (error) {
    console.warn('[Network API] Blockchain.info hashrate failed:', error);
  }

  // Return approximate current hashrate as fallback
  console.error('[Network API] All hashrate sources failed, using fallback');
  return 700; // ~700 EH/s as of late 2024
}

/**
 * Get all network stats at once with automatic fallbacks
 */
export async function getNetworkStats(): Promise<NetworkStats> {
  const [difficulty, hashrate, blockHeight] = await Promise.all([
    getNetworkDifficulty(),
    getNetworkHashrate(),
    getBlockHeight(),
  ]);

  return {
    difficulty,
    hashrate,
    blockHeight,
  };
}
