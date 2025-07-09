import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchGasFees, fetchDailyTransactions } from '@/services/api';
import { FIXED_CHAINS_DATA } from '@/constants/tvlData';

interface Protocol {
  id: string;
  name: string;
  logo?: string;
  tvl: number;
  change24h: number;
  chains: string[];
  category: string;
}

interface Category {
  name: string;
  value: number;
}

interface ChainData {
  name: string;
  value: number;
}

interface DefiContextType {
  protocols: Protocol[];
  categories: Category[];
  chains: ChainData[];
  tvlHistory: any[];
  isLoading: boolean;
  error: Error | null;
  refreshData: () => Promise<void>;
}

const DefiContext = createContext<DefiContextType | undefined>(undefined);

// Mock data generator for protocols
const generateMockProtocols = (): Protocol[] => {
  const categories = ['DEX', 'Lending', 'Yield', 'Derivatives', 'Yield Aggregator'];
  const chains = ['Ethereum', 'BNB Chain', 'Polygon', 'Arbitrum', 'Optimism'];
  
  return Array.from({ length: 10 }, (_, i) => ({
    id: `protocol-${i + 1}`,
    name: `Protocol ${i + 1}`,
    logo: `https://cryptoicons.org/api/icon/usdt/100`,
    tvl: Math.random() * 1000000000 + 10000000, // 10M - 1B
    change24h: (Math.random() * 20) - 10, // -10% to +10%
    chains: Array.from({ length: Math.floor(Math.random() * 3) + 1 }, 
      () => chains[Math.floor(Math.random() * chains.length)]
    ),
    category: categories[Math.floor(Math.random() * categories.length)],
  })).sort((a, b) => b.tvl - a.tvl); // Sort by TVL descending
};

export function DefiProvider({ children }: { children: ReactNode }) {
  const [protocols, setProtocols] = useState<Protocol[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [chains, setChains] = useState<ChainData[]>([]);
  const [tvlHistory, setTvlHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Usar datos fijos para TVL
  const tvlData = FIXED_CHAINS_DATA;

  // Fetch gas fees for different chains (mantenemos esto si es necesario para otras funcionalidades)
  const { refetch: refetchGasFees } = useQuery({
    queryKey: ['gasFees'],
    queryFn: () => Promise.all([
      fetchGasFees('Ethereum'),
      fetchGasFees('BNBChain'),
      fetchGasFees('Polygon'),
      fetchGasFees('Arbitrum'),
    ]),
    enabled: false, // Deshabilitar por defecto
    staleTime: Infinity, // No marcar como obsoleto
  });

  // Fetch daily transactions
  const { refetch: refetchDailyTxs } = useQuery({
    queryKey: ['dailyTransactions'],
    queryFn: () => fetchDailyTransactions('1m'),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Initialize with mock data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setIsLoading(true);
        
        // Generate mock protocols
        const mockProtocols = generateMockProtocols();
        setProtocols(mockProtocols);
        
        // Generate categories from protocols
        const categoryMap = new Map<string, number>();
        mockProtocols.forEach(protocol => {
          categoryMap.set(
            protocol.category, 
            (categoryMap.get(protocol.category) || 0) + protocol.tvl
          );
        });
        
        setCategories(Array.from(categoryMap.entries()).map(([name, value]) => ({
          name,
          value: parseFloat((value / 1000000000).toFixed(2)) // Convert to billions
        })));
        
        // Generate chains data
        const chainMap = new Map<string, number>();
        mockProtocols.forEach(protocol => {
          protocol.chains.forEach(chain => {
            chainMap.set(chain, (chainMap.get(chain) || 0) + (protocol.tvl / protocol.chains.length));
          });
        });
        
        setChains(Array.from(chainMap.entries()).map(([name, value]) => ({
          name,
          value: parseFloat((value / 1000000000).toFixed(2)) // Convert to billions
        })));
        
        // Set TVL history (mock)
        setTvlHistory(Array.from({ length: 30 }, (_, i) => ({
          date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          value: 40 + Math.sin(i / 2) * 5 + Math.random() * 2 // Random walk around 40B
        })));
        
      } catch (err) {
        console.error('Error loading data:', err);
        setError(err instanceof Error ? err : new Error('Failed to load data'));
      } finally {
        setIsLoading(false);
      }
    };
    
    loadInitialData();
  }, []);
  
  // Inicializar con datos fijos
  useEffect(() => {
    // Actualizar cadenas con datos fijos
    setChains(FIXED_CHAINS_DATA);
    
    // Inicializar con datos mock
    const loadInitialData = () => {
      try {
        setIsLoading(true);
        
        // Generar protocolos mock
        const mockProtocols = generateMockProtocols();
        setProtocols(mockProtocols);
        
        // Generar categorías a partir de los protocolos
        const categoryMap = new Map<string, number>();
        mockProtocols.forEach(protocol => {
          categoryMap.set(
            protocol.category, 
            (categoryMap.get(protocol.category) || 0) + protocol.tvl
          );
        });
        
        setCategories(Array.from(categoryMap.entries()).map(([name, value]) => ({
          name,
          value: parseFloat((value / 1000000000).toFixed(2)) // Convertir a miles de millones
        })));
        
        // Establecer historial de TVL (mock)
        setTvlHistory(Array.from({ length: 30 }, (_, i) => ({
          date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          value: 40 + Math.sin(i / 2) * 5 + Math.random() * 2 // Random walk alrededor de 40B
        })));
        
      } catch (err) {
        console.error('Error loading data:', err);
        setError(err instanceof Error ? err : new Error('Failed to load data'));
      } finally {
        setIsLoading(false);
      }
    };
    
    loadInitialData();
  }, []);
  
  const refreshData = async () => {
    try {
      setIsLoading(true);
      
      // Usar datos fijos para las cadenas
      setChains(FIXED_CHAINS_DATA);
      
      // Regenerar datos mock
      const mockProtocols = generateMockProtocols();
      setProtocols(mockProtocols);
      
      // Actualizar categorías
      const categoryMap = new Map<string, number>();
      mockProtocols.forEach(protocol => {
        categoryMap.set(
          protocol.category, 
          (categoryMap.get(protocol.category) || 0) + protocol.tvl
        );
      });
      
      setCategories(Array.from(categoryMap.entries()).map(([name, value]) => ({
        name,
        value: parseFloat((value / 1000000000).toFixed(2))
      })));
      
      // Actualizar historial de TVL con un nuevo paseo aleatorio
      const lastValue = tvlHistory[tvlHistory.length - 1]?.value || 40;
      setTvlHistory(prev => [
        ...prev.slice(1), // Remove the oldest point
        {
          date: new Date().toISOString().split('T')[0],
          value: parseFloat((lastValue + (Math.random() - 0.5) * 2).toFixed(2))
        }
      ]);
      
    } catch (err) {
      console.error('Error refreshing data:', err);
      setError(err instanceof Error ? err : new Error('Failed to refresh data'));
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <DefiContext.Provider 
      value={{
        protocols,
        categories,
        chains,
        tvlHistory,
        isLoading,
        error,
        refreshData,
      }}
    >
      {children}
    </DefiContext.Provider>
  );
}

export function useDefi() {
  const context = useContext(DefiContext);
  if (context === undefined) {
    throw new Error('useDefi must be used within a DefiProvider');
  }
  return context;
}
