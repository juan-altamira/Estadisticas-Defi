// This is a mock API service. In a real application, you would fetch this data from a backend.

export type Blockchain = 'Ethereum' | 'BNBChain' | 'Base' | 'Polygon' | 'Arbitrum' | 'Optimism' | 'Bitcoin' | 'Solana' | 'Tron';

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
  "Optimism": "Optimism",
  "Solana": "Solana",
  "Tron": "Tron",
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
    Optimism: { slow: 0.03, normal: 0.05, fast: 0.08 },
    Solana: { slow: 0.001, normal: 0.002, fast: 0.003 },
    Tron: { slow: 0.1, normal: 0.15, fast: 0.2 },
    Bitcoin: { slow: 1.5, normal: 2.5, fast: 4.0 },
  };

  return mockData[chain] || { slow: 0, normal: 0, fast: 0 };
};

/**
 * Fetches Daily Transactions.
 * NOTE: This is a mock implementation.
 */
export const fetchDailyTransactions = async () => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Return mock data
  return [
    { date: '2023-01-01', Ethereum: 4000, BNBChain: 2400, Polygon: 1800, Arbitrum: 1200 },
    { date: '2023-01-02', Ethereum: 3000, BNBChain: 1398, Polygon: 2210, Arbitrum: 1500 },
    { date: '2023-01-03', Ethereum: 2000, BNBChain: 9800, Polygon: 2290, Arbitrum: 2000 },
    { date: '2023-01-04', Ethereum: 2780, BNBChain: 3908, Polygon: 2000, Arbitrum: 2100 },
    { date: '2023-01-05', Ethereum: 1890, BNBChain: 4800, Polygon: 2181, Arbitrum: 2500 },
    { date: '2023-01-06', Ethereum: 2390, BNBChain: 3800, Polygon: 2500, Arbitrum: 2800 },
    { date: '2023-01-07', Ethereum: 3490, BNBChain: 4300, Polygon: 2100, Arbitrum: 2200 },
  ];
};

// Export mock data for backward compatibility
export const dailyTransactions = await fetchDailyTransactions();
export const tvlData = await fetchTvlData();
export const gasFeesData: Record<Blockchain, GasFee> = {
  Ethereum: await fetchGasFees('Ethereum'),
  BNBChain: await fetchGasFees('BNBChain'),
  Base: await fetchGasFees('Base'),
  Polygon: await fetchGasFees('Polygon'),
  Arbitrum: await fetchGasFees('Arbitrum'),
  Optimism: await fetchGasFees('Optimism'),
  Bitcoin: await fetchGasFees('Bitcoin'),
  Solana: await fetchGasFees('Solana'),
  Tron: await fetchGasFees('Tron'),
};
