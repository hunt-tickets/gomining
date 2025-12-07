/**
 * Blockchain.com API Service
 * Free API - No API key required
 * Used for Bitcoin network difficulty
 */

const BASE_URL = 'https://blockchain.info';

// ═══════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════

export interface NetworkStats {
  difficulty: number;
  hashrate: number; // Estimated network hashrate
  blockHeight: number;
}

// ═══════════════════════════════════════════════════════════════════
// API FUNCTIONS
// ═══════════════════════════════════════════════════════════════════

/**
 * Get current Bitcoin network difficulty
 */
export async function getNetworkDifficulty(): Promise<number> {
  try {
    const response = await fetch(`${BASE_URL}/q/getdifficulty`);

    if (!response.ok) {
      throw new Error(`Blockchain.info API error: ${response.status}`);
    }

    const difficulty = await response.text();
    return parseFloat(difficulty);
  } catch (error) {
    console.error('Error fetching network difficulty:', error);
    throw error;
  }
}

/**
 * Get current block height
 */
export async function getBlockHeight(): Promise<number> {
  try {
    const response = await fetch(`${BASE_URL}/q/getblockcount`);

    if (!response.ok) {
      throw new Error(`Blockchain.info API error: ${response.status}`);
    }

    const height = await response.text();
    return parseInt(height, 10);
  } catch (error) {
    console.error('Error fetching block height:', error);
    throw error;
  }
}

/**
 * Get estimated network hashrate (TH/s)
 */
export async function getNetworkHashrate(): Promise<number> {
  try {
    const response = await fetch(`${BASE_URL}/q/hashrate`);

    if (!response.ok) {
      throw new Error(`Blockchain.info API error: ${response.status}`);
    }

    const hashrate = await response.text();
    // API returns in GH/s, convert to TH/s
    return parseFloat(hashrate) / 1000;
  } catch (error) {
    console.error('Error fetching network hashrate:', error);
    throw error;
  }
}

/**
 * Get all network stats at once
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
