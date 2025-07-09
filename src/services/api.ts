// This is a mock API service. In a real application, you would fetch this data from a backend.

export type Blockchain = 'Ethereum' | 'BNBChain' | 'Polygon' | 'Arbitrum' | 'Base' | 'Solana';

export interface GasFee {
  slow: number;
  normal: number;
  fast: number;
}

// A map of chain names used by DeFi Llama to their display names
const DEFILAMA_CHAIN_MAP: { [key: string]: string } = {
  "Ethereum": "Ethereum",
  "BNB": "BNBChain",
  "Base": "Base",
  "Polygon": "Polygon",
  "Arbitrum": "Arbitrum",
  "Solana": "Solana"
};

// Helper function to format TVL values
const formatTvlValue = (value: number): number => {
  // Convert to billions for better readability
  return value / 1e9;
};

/**
 * Fetches Total Value Locked (TVL) data from DeFi Llama.
 */
export const fetchTvlData = async (): Promise<{name: string, value: number}[]> => {
  try {
    const response = await fetch('https://api.llama.fi/chains');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    
    if (!Array.isArray(data)) {
      throw new Error('Invalid data format from API');
    }
    
    console.log('Raw TVL data from API:', data);
    
    // Filter and map to our desired format
    const formattedData = data
      .filter((chain: any) => {
        const isValid = chain.name && DEFILAMA_CHAIN_MAP[chain.name] && chain.tvl !== undefined;
        if (!isValid) {
          console.log('Skipping chain:', chain.name, 'Reason: Missing name, TVL, or not in our mapping');
        }
        return isValid;
      })
      .map((chain: any) => {
        const formattedValue = formatTvlValue(chain.tvl);
        console.log(`Chain: ${chain.name}, Raw TVL: ${chain.tvl}, Formatted: ${formattedValue}`);
        return {
          name: DEFILAMA_CHAIN_MAP[chain.name],
          value: formattedValue,
          rawValue: chain.tvl // Keep raw value for reference
        };
      })
      .sort((a, b) => b.value - a.value); // Sort by value descending
    
    if (formattedData.length === 0) {
      throw new Error('No valid chain data found after filtering');
    }
    
    return formattedData;
  } catch (error) {
    console.error('Error fetching TVL data:', error);
    // Return mock data as fallback with realistic values in billions
    const mockData = [
      { name: 'Ethereum', value: 40.5, rawValue: 40500000000 },
      { name: 'BNBChain', value: 15.2, rawValue: 15200000000 },
      { name: 'Polygon', value: 8.7, rawValue: 8700000000 },
      { name: 'Arbitrum', value: 6.3, rawValue: 6300000000 },
      { name: 'Optimism', value: 4.1, rawValue: 4100000000 },
    ];
    console.log('Using mock TVL data:', mockData);
    return mockData;
  }
};

/**
 * Fetches Gas Fees from Moralis.
 * NOTE: This is a simplified mock. The real Moralis API for gas is more complex
 * and requires converting Gwei to USD via a price feed.
 */
export const fetchGasFees = async (chain: Blockchain): Promise<GasFee> => {
  console.log(`Fetching gas fees for ${chain}...`);
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));

  // Mock data as the actual API is complex.
  const mockData: Record<Blockchain, GasFee> = {
    Ethereum: { slow: 5.21, normal: 6.54, fast: 8.91 },
    BNBChain: { slow: 0.05, normal: 0.07, fast: 0.10 },
    Base: { slow: 0.02, normal: 0.03, fast: 0.05 },
    Polygon: { slow: 0.01, normal: 0.02, fast: 0.03 },
    Arbitrum: { slow: 0.04, normal: 0.06, fast: 0.09 },
    Solana: { slow: 0.001, normal: 0.002, fast: 0.003 }
  };

  return mockData[chain] || { slow: 0, normal: 0, fast: 0 };
};

type TimeRange = '1m' | '6m' | '1y';

/**
 * Fetches Daily Transactions.
 * @param range Time range for the data (1m, 6m, 1y)
 */
export const fetchDailyTransactions = async (range: TimeRange = '1m') => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Base data for 1 month (30 days)
  const baseData = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    return {
      date: date.toISOString().split('T')[0],
      Ethereum: Math.floor(2000 + Math.random() * 5000),
      BNBChain: Math.floor(1000 + Math.random() * 3000),
      Polygon: Math.floor(500 + Math.random() * 2500),
      Arbitrum: Math.floor(300 + Math.random() * 2000),
      Base: Math.floor(400 + Math.random() * 1800),  // Added Base
      Solana: Math.floor(600 + Math.random() * 2200), // Added Solana
    };
  });

  if (range === '1m') {
    return baseData;
  }

  // For 6 months, we'll show weekly data
  if (range === '6m') {
    return Array.from({ length: 26 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - ((25 - i) * 7));
      return {
        date: date.toISOString().split('T')[0],
        Ethereum: Math.floor(2000 + Math.random() * 5000),
        BNBChain: Math.floor(1000 + Math.random() * 3000),
        Polygon: Math.floor(500 + Math.random() * 2500),
        Arbitrum: Math.floor(300 + Math.random() * 2000),
        Base: Math.floor(400 + Math.random() * 1800),  // Added Base
        Solana: Math.floor(600 + Math.random() * 2200), // Added Solana
      };
    });
  }

  // For 1 year, we'll show monthly data
  return Array.from({ length: 12 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (11 - i));
    return {
      date: date.toISOString().split('T')[0],
      Ethereum: Math.floor(2000 + Math.random() * 5000),
      BNBChain: Math.floor(1000 + Math.random() * 3000),
      Polygon: Math.floor(500 + Math.random() * 2500),
      Arbitrum: Math.floor(300 + Math.random() * 2000),
      Base: Math.floor(400 + Math.random() * 1800),  // Added Base
      Solana: Math.floor(600 + Math.random() * 2200), // Added Solana
    };
  });
};

// Export functions to get data instead of direct values
export const getDailyTransactions = fetchDailyTransactions;
export const getTvlData = fetchTvlData;

export const getGasFeesData = async (): Promise<Record<Blockchain, GasFee>> => {
  return {
    Ethereum: await fetchGasFees("Ethereum"),
    BNBChain: await fetchGasFees("BNBChain"),
    Base: await fetchGasFees("Base"),
    Polygon: await fetchGasFees("Polygon"),
    Arbitrum: await fetchGasFees("Arbitrum"),
    Solana: await fetchGasFees("Solana")
  };
};

// For backward compatibility (deprecated)
export const dailyTransactions = getDailyTransactions();
export const tvlData = getTvlData();
export const gasFeesData = getGasFeesData();
