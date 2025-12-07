/**
 * Bitcoin Network API Service
 * Uses Mempool.space API (better CORS support)
 * Fallback to hardcoded values if API fails
 */

const MEMPOOL_URL = 'https://mempool.space/api';

// ═══════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════

export interface NetworkStats {
  difficulty: number;
  hashrate: number; // Estimated network hashrate in EH/s
  blockHeight: number;
}

// ═══════════════════════════════════════════════════════════════════
// API FUNCTIONS
// ═══════════════════════════════════════════════════════════════════

/**
 * Get current Bitcoin network difficulty
 * Returns difficulty in trillions (T) for easier display
 */
export async function getNetworkDifficulty(): Promise<number> {
  try {
    const response = await fetch(`${MEMPOOL_URL}/v1/mining/hashrate/3d`, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Mempool API error: ${response.status}`);
    }

    const data = await response.json();
    // Get current difficulty from the mining data
    // Difficulty is in raw format, convert to T (trillions)
    const difficulty = data.currentDifficulty || 0;
    return difficulty / 1e12; // Convert to T
  } catch (error) {
    console.error('Error fetching network difficulty:', error);
    // Return approximate current difficulty as fallback (as of late 2024)
    return 100; // ~100T
  }
}

/**
 * Get current block height
 */
export async function getBlockHeight(): Promise<number> {
  try {
    const response = await fetch(`${MEMPOOL_URL}/blocks/tip/height`, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Mempool API error: ${response.status}`);
    }

    const height = await response.text();
    return parseInt(height, 10);
  } catch (error) {
    console.error('Error fetching block height:', error);
    return 0;
  }
}

/**
 * Get estimated network hashrate (EH/s)
 */
export async function getNetworkHashrate(): Promise<number> {
  try {
    const response = await fetch(`${MEMPOOL_URL}/v1/mining/hashrate/3d`, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Mempool API error: ${response.status}`);
    }

    const data = await response.json();
    // Get current hashrate from the latest data point
    const hashrates = data.hashrates || [];
    if (hashrates.length > 0) {
      const latest = hashrates[hashrates.length - 1];
      // Hashrate is in H/s, convert to EH/s
      return latest.avgHashrate / 1e18;
    }
    return 0;
  } catch (error) {
    console.error('Error fetching network hashrate:', error);
    return 700; // Approximate current hashrate as fallback
  }
}

/**
 * Get all network stats at once
 */
export async function getNetworkStats(): Promise<NetworkStats> {
  try {
    const [diffAndHash, blockHeight] = await Promise.all([
      fetch(`${MEMPOOL_URL}/v1/mining/hashrate/3d`).then(r => r.json()),
      getBlockHeight(),
    ]);

    const hashrates = diffAndHash.hashrates || [];
    const latestHashrate = hashrates.length > 0
      ? hashrates[hashrates.length - 1].avgHashrate / 1e18
      : 700;

    return {
      difficulty: (diffAndHash.currentDifficulty || 0) / 1e12,
      hashrate: latestHashrate,
      blockHeight,
    };
  } catch (error) {
    console.error('Error fetching network stats:', error);
    return {
      difficulty: 100,
      hashrate: 700,
      blockHeight: 0,
    };
  }
}
