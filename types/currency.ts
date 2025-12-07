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
  coingeckoId?: string; // For fetching prices
}

export const CURRENCIES: CurrencyInfo[] = [
  // Crypto
  { code: 'BTC', name: 'Bitcoin', symbol: '₿', type: 'crypto', coingeckoId: 'bitcoin' },
  { code: 'ETH', name: 'Ethereum', symbol: 'Ξ', type: 'crypto', coingeckoId: 'ethereum' },
  { code: 'USDT', name: 'Tether', symbol: '$', type: 'crypto', coingeckoId: 'tether' },
  { code: 'USDC', name: 'USD Coin', symbol: '$', type: 'crypto', coingeckoId: 'usd-coin' },
  { code: 'GMT', name: 'GoMining Token', symbol: 'GMT', type: 'crypto', coingeckoId: 'gomining-token' },
  { code: 'SOL', name: 'Solana', symbol: '◎', type: 'crypto', coingeckoId: 'solana' },
  { code: 'BNB', name: 'BNB', symbol: 'BNB', type: 'crypto', coingeckoId: 'binancecoin' },
  { code: 'XRP', name: 'XRP', symbol: 'XRP', type: 'crypto', coingeckoId: 'ripple' },
  { code: 'ADA', name: 'Cardano', symbol: '₳', type: 'crypto', coingeckoId: 'cardano' },
  { code: 'DOGE', name: 'Dogecoin', symbol: 'Ð', type: 'crypto', coingeckoId: 'dogecoin' },
  { code: 'LTC', name: 'Litecoin', symbol: 'Ł', type: 'crypto', coingeckoId: 'litecoin' },
  { code: 'BCH', name: 'Bitcoin Cash', symbol: 'BCH', type: 'crypto', coingeckoId: 'bitcoin-cash' },
  // Fiat
  { code: 'USD', name: 'US Dollar', symbol: '$', type: 'fiat' },
  { code: 'EUR', name: 'Euro', symbol: '€', type: 'fiat' },
  { code: 'GBP', name: 'British Pound', symbol: '£', type: 'fiat' },
  { code: 'MXN', name: 'Mexican Peso', symbol: '$', type: 'fiat' },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', type: 'fiat' },
  { code: 'ARS', name: 'Argentine Peso', symbol: '$', type: 'fiat' },
  { code: 'COP', name: 'Colombian Peso', symbol: '$', type: 'fiat' },
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
