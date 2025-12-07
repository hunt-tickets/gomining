/**
 * Currency Types and Data
 */

// ═══════════════════════════════════════════════════════════════════
// CURRENCY TYPE
// ═══════════════════════════════════════════════════════════════════

export type Currency =
  // Crypto
  | 'BTC'
  | 'ETH'
  | 'USDT'
  | 'USDC'
  | 'GMT'    // GoMining
  | 'SOL'
  | 'BNB'
  | 'XRP'
  | 'ADA'
  | 'DOGE'
  | 'LTC'
  | 'BCH'
  // Fiat
  | 'USD'
  | 'EUR'
  | 'GBP'
  | 'MXN'
  | 'BRL'
  | 'ARS'
  | 'COP';

// ═══════════════════════════════════════════════════════════════════
// CURRENCY DATA
// ═══════════════════════════════════════════════════════════════════

export interface CurrencyInfo {
  code: Currency;
  name: string;
  symbol: string;
  type: 'crypto' | 'fiat';
  icon?: string;
  logoUrl?: string;
  coingeckoId?: string; // For fetching prices
}

// Logo URLs from reliable CDNs
const CRYPTO_LOGO_BASE = 'https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color';
const FLAG_LOGO_BASE = 'https://flagcdn.com/w80';

export const CURRENCIES: CurrencyInfo[] = [
  // Crypto
  {
    code: 'BTC',
    name: 'Bitcoin',
    symbol: '₿',
    type: 'crypto',
    logoUrl: `${CRYPTO_LOGO_BASE}/btc.png`,
    coingeckoId: 'bitcoin',
  },
  {
    code: 'ETH',
    name: 'Ethereum',
    symbol: 'Ξ',
    type: 'crypto',
    logoUrl: `${CRYPTO_LOGO_BASE}/eth.png`,
    coingeckoId: 'ethereum',
  },
  {
    code: 'USDT',
    name: 'Tether',
    symbol: '$',
    type: 'crypto',
    logoUrl: `${CRYPTO_LOGO_BASE}/usdt.png`,
    coingeckoId: 'tether',
  },
  {
    code: 'USDC',
    name: 'USD Coin',
    symbol: '$',
    type: 'crypto',
    logoUrl: `${CRYPTO_LOGO_BASE}/usdc.png`,
    coingeckoId: 'usd-coin',
  },
  {
    code: 'GMT',
    name: 'GoMining Token',
    symbol: 'GMT',
    type: 'crypto',
    logoUrl: 'https://assets.coingecko.com/coins/images/23846/small/GoMining_Token.png',
    coingeckoId: 'gomining-token',
  },
  {
    code: 'SOL',
    name: 'Solana',
    symbol: '◎',
    type: 'crypto',
    logoUrl: `${CRYPTO_LOGO_BASE}/sol.png`,
    coingeckoId: 'solana',
  },
  {
    code: 'BNB',
    name: 'BNB',
    symbol: 'BNB',
    type: 'crypto',
    logoUrl: `${CRYPTO_LOGO_BASE}/bnb.png`,
    coingeckoId: 'binancecoin',
  },
  {
    code: 'XRP',
    name: 'XRP',
    symbol: 'XRP',
    type: 'crypto',
    logoUrl: `${CRYPTO_LOGO_BASE}/xrp.png`,
    coingeckoId: 'ripple',
  },
  {
    code: 'ADA',
    name: 'Cardano',
    symbol: '₳',
    type: 'crypto',
    logoUrl: `${CRYPTO_LOGO_BASE}/ada.png`,
    coingeckoId: 'cardano',
  },
  {
    code: 'DOGE',
    name: 'Dogecoin',
    symbol: 'Ð',
    type: 'crypto',
    logoUrl: `${CRYPTO_LOGO_BASE}/doge.png`,
    coingeckoId: 'dogecoin',
  },
  {
    code: 'LTC',
    name: 'Litecoin',
    symbol: 'Ł',
    type: 'crypto',
    logoUrl: `${CRYPTO_LOGO_BASE}/ltc.png`,
    coingeckoId: 'litecoin',
  },
  {
    code: 'BCH',
    name: 'Bitcoin Cash',
    symbol: 'BCH',
    type: 'crypto',
    logoUrl: `${CRYPTO_LOGO_BASE}/bch.png`,
    coingeckoId: 'bitcoin-cash',
  },
  // Fiat - using flag icons
  {
    code: 'USD',
    name: 'US Dollar',
    symbol: '$',
    type: 'fiat',
    logoUrl: `${FLAG_LOGO_BASE}/us.png`,
  },
  {
    code: 'EUR',
    name: 'Euro',
    symbol: '€',
    type: 'fiat',
    logoUrl: `${FLAG_LOGO_BASE}/eu.png`,
  },
  {
    code: 'GBP',
    name: 'British Pound',
    symbol: '£',
    type: 'fiat',
    logoUrl: `${FLAG_LOGO_BASE}/gb.png`,
  },
  {
    code: 'MXN',
    name: 'Mexican Peso',
    symbol: '$',
    type: 'fiat',
    logoUrl: `${FLAG_LOGO_BASE}/mx.png`,
  },
  {
    code: 'BRL',
    name: 'Brazilian Real',
    symbol: 'R$',
    type: 'fiat',
    logoUrl: `${FLAG_LOGO_BASE}/br.png`,
  },
  {
    code: 'ARS',
    name: 'Argentine Peso',
    symbol: '$',
    type: 'fiat',
    logoUrl: `${FLAG_LOGO_BASE}/ar.png`,
  },
  {
    code: 'COP',
    name: 'Colombian Peso',
    symbol: '$',
    type: 'fiat',
    logoUrl: `${FLAG_LOGO_BASE}/co.png`,
  },
];

export const getCurrencyInfo = (code: Currency): CurrencyInfo | undefined => {
  return CURRENCIES.find(c => c.code === code);
};

export const getCryptoCurrencies = (): CurrencyInfo[] => {
  return CURRENCIES.filter(c => c.type === 'crypto');
};

export const getFiatCurrencies = (): CurrencyInfo[] => {
  return CURRENCIES.filter(c => c.type === 'fiat');
};
