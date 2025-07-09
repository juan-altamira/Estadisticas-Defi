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
    Ethereum: { slow: 0.17, normal: 0.31, fast: 0.49 },
    BNBChain: { slow: 0.0014, normal: 0.0015, fast: 0.0023 },
    Polygon: { slow: 0.00012, normal: 0.00013, fast: 0.00014 },
    Base: { slow: 0.00067, normal: 0.0017, fast: 0.0037 },
    Arbitrum: { slow: 0.0007, normal: 0.00081, fast: 0.001 },
    Solana: { slow: 0.003, normal: 0.005, fast: 0.01 }
  };

  return mockData[chain] || { slow: 0, normal: 0, fast: 0 };
};

type TimeRange = '1m' | '6m' | '1y';

/**
 * Fetches Daily Transactions.
 * @param range Time range for the data (1m, 6m, 1y)
 */
// Cache para los 365 días de datos generados una vez
let _cachedYearlyTxData: any[] | null = null;

export async function fetchDailyTransactions(_range: TimeRange = '1m') {
  // Si ya tenemos los datos generados, usamos el cache
  if (!_cachedYearlyTxData) {
    // Generar datos de transacciones diarias simuladas para cada blockchain
    const now = new Date();
    const oneYearAgo = new Date(now);
    oneYearAgo.setFullYear(now.getFullYear() - 1);
    
    const days = Math.ceil((now.getTime() - oneYearAgo.getTime()) / (1000 * 60 * 60 * 24));
    
    // Valores base para cada blockchain
    const baseValues = {
      'Ethereum': 1000000,
      'BNBChain': 3000000,
      'Polygon': 2000000,
      'Arbitrum': 1000000,
      'Base': 2000000,
      'Solana': 10000000
    };
    
    const data = [];
    
    // Generar datos para cada día
    for (let i = 0; i < days; i++) {
      const date = new Date(oneYearAgo);
      date.setDate(date.getDate() + i);
      
      const dayData: Record<string, any> = {
        date: date.toISOString().split('T')[0]
      };
      
      // Generar datos para cada blockchain
      Object.entries(baseValues).forEach(([chain, baseValue]) => {
        // Variación aleatoria suave basada en el día y la cadena
        const volatility = 0.1;
        const seed = i * chain.length; // Semilla única para cada cadena y día
        const random = Math.sin(seed) * 10000;
        const randomValue = random - Math.floor(random); // Número pseudoaleatorio entre 0 y 1
        
        // Aplicar tendencia alcista con pequeñas variaciones diarias
        const trend = 1 + (i / days) * 2; // Tendencias alcistas más pronunciadas
        const dailyChange = (randomValue * 2 - 1) * volatility;
        
        // Calcular el valor final con tendencia y ruido
        const value = Math.round(baseValue * trend * (1 + dailyChange));
        
        dayData[chain] = value;
      });
      
      data.push(dayData);
    }
    
    _cachedYearlyTxData = data;
  }
  
  // Filtrar datos según el rango solicitado
  let filteredData = [..._cachedYearlyTxData];
  
  if (_range === '1m') {
    filteredData = _cachedYearlyTxData.slice(-30);
  } else if (_range === '6m') {
    filteredData = _cachedYearlyTxData.slice(-180);
  }
  
  return filteredData;
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
