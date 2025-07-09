import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';
import { useDailyTransactions } from '@/hooks/useDailyTransactions';
import { DateRangeSelector } from '../dashboard/DateRangeSelector';
import { getGasFeesData, Blockchain } from '@/services/api';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

// This interface is no longer needed as we're using the one from the API

type GasFees = {
  [key in Blockchain]?: {
    slow: number;
    normal: number;
    fast: number;
  };
};

type TimeRange = '1m' | '6m' | '1y';

const DailyTransactionsChart = () => {
  const { t } = useTranslation();
  const [selectedRange, setSelectedRange] = useState<TimeRange>('1m');
  const [gasFees, setGasFees] = useState<GasFees | null>(null);
  const [isLoadingFees, setIsLoadingFees] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [enabledChains, setEnabledChains] = useState<Record<Blockchain, boolean>>({
    'Ethereum': true,
    'BNBChain': true,
    'Polygon': true,
    'Arbitrum': true,
    'Base': true,
    'Solana': true
  });
  
  const { data: transactionsData, isLoading, error, refetch } = useDailyTransactions(selectedRange);
  
  // Filter transactions data based on enabled chains
  const filteredTransactionsData = useCallback(() => {
    if (!transactionsData) return [];
    
    return transactionsData.map(day => {
      const filteredDay: Record<string, unknown> = { date: day.date };
      
      // Get all chain keys from the day's data
      Object.keys(day).forEach(key => {
        if (key === 'date') return;
        const chainKey = key as Blockchain;
        if (enabledChains[chainKey]) {
          filteredDay[chainKey] = day[chainKey as keyof typeof day];
        }
      });
      
      return filteredDay;
    });
  }, [transactionsData, enabledChains]);
  
  // Toggle chain visibility - memoized with useCallback
  const toggleChain = useCallback((chain: Blockchain) => {
    setEnabledChains(prev => ({
      ...prev,
      [chain]: !prev[chain]
    }));
  }, []); // Empty dependency array as we don't use any external values

  // Load gas fees
  const loadGasFees = useCallback(async () => {
    try {
      setIsLoadingFees(true);
      const data = await getGasFeesData();
      setGasFees(data);
    } catch (error) {
      console.error(t('error_loading_fees'), error);
    } finally {
      setIsLoadingFees(false);
    }
  }, [t]);

  // Initial load
  useEffect(() => {
    loadGasFees();
  }, []);

  // Handle refresh
  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    refetch().finally(() => {
      setIsRefreshing(false);
    });
  }, [refetch]);

  // Update the selected date range
  const handleRangeChange = (range: TimeRange) => {
    setSelectedRange(range);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t('daily_transactions')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-[350px] w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error || !transactionsData || transactionsData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t('daily_transactions')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            {t('error_loading_data')}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Get all available chain names from the first data point (excluding 'date' key)
  const allChainNames: Blockchain[] = Object.keys(enabledChains) as Blockchain[];
  
  // Modern color palette with better contrast and visual appeal
  const colors = [
    '#3b82f6', // Ethereum blue
    '#f59e0b', // BNB orange
    '#8b5cf6', // Polygon purple
    '#10b981', // Arbitrum green
    '#6366f1', // Base indigo
    '#14b8a6', // Solana teal
  ];
  
  // Enhanced chain data with better icons and colors
  const chainData: Record<Blockchain, { icon: string; color: string }> = {
    'Ethereum': { icon: 'Ξ', color: colors[0] },
    'BNBChain': { icon: '🅱️', color: colors[1] },
    'Polygon': { icon: '⬡', color: colors[2] },
    'Arbitrum': { icon: '⏩', color: colors[3] },
    'Base': { icon: '🅱️', color: colors[4] },
    'Solana': { icon: '◎', color: colors[5] },
  };
  
  // Helper function to safely get chain data with type safety
  const getChainData = (chain: string) => {
    const safeChain = chain as Blockchain;
    return chainData[safeChain] || { icon: '⛓️', color: '#888' };
  };

  return (
    <div className="space-y-6">
      {/* Enhanced Chart Card */}
      <Card className="overflow-hidden bg-gradient-to-br from-card to-card/80 shadow-lg">
        <CardHeader className="relative p-6 pb-2 border-b border-border/50">
          <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" />
          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Network Activity</p>
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                  {t('daily_transactions')}
                </CardTitle>
              </div>
              <div className="flex items-center space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="h-9 w-9 p-0 rounded-lg border-border/50 hover:border-primary/50 transition-all duration-200"
                >
                  <RefreshCw className={cn("h-4 w-4", isRefreshing ? "animate-spin" : "")} />
                  <span className="sr-only">{t('refresh')}</span>
                </Button>
                <DateRangeSelector 
                  selectedRange={selectedRange} 
                  onRangeChange={handleRangeChange}
                />
              </div>
            </div>
            
            {/* Enhanced Chain Toggle Buttons */}
            <div className="flex flex-wrap gap-2 pt-4 -mx-1">
              {allChainNames
                .filter(chain => {
                  // Only include chains that exist in enabledChains
                  return Object.prototype.hasOwnProperty.call(enabledChains, chain);
                })
                .map((chain) => {
                  const chainInfo = getChainData(chain);
                  const isEnabled = enabledChains[chain];
                  return (
                    <Button
                      key={chain}
                      type="button"
                      variant={isEnabled ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleChain(chain)}
                      className={cn(
                        "h-8 px-3 text-xs font-medium rounded-lg transition-all duration-200",
                        isEnabled 
                          ? "shadow-sm border-transparent text-white" 
                          : "border-border/50 hover:border-primary/50 bg-transparent hover:bg-accent/50"
                      )}
                      style={isEnabled ? { 
                        backgroundColor: chainInfo.color,
                        borderColor: 'transparent',
                        boxShadow: `0 2px 12px -2px ${chainInfo.color}40`
                      } : {}}
                    >
                      <span className="mr-1.5">{chainInfo.icon}</span>
                      {chain}
                    </Button>
                  );
                })}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="h-[400px] relative">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-card/30 pointer-events-none z-10" />
            <div style={{ height: '100%', padding: '0 16px 16px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart 
                  data={filteredTransactionsData()}
                  margin={{ top: 20, right: 20, left: 0, bottom: 60 }}
                >
                <defs>
                  {allChainNames.map((chain: Blockchain, index: number) => {
                    const chainColor = colors[index % colors.length];
                    return (
                      <linearGradient 
                        key={`gradient-${chain}`} 
                        id={`gradient-${chain}`} 
                        x1="0" 
                        y1="0" 
                        x2="0" 
                        y2="1"
                      >
                        <stop offset="0%" stopColor={chainColor} stopOpacity={0.2} />
                        <stop offset="50%" stopColor={chainColor} stopOpacity={0.1} />
                        <stop offset="100%" stopColor={chainColor} stopOpacity={0.05} />
                      </linearGradient>
                    );
                  })}
                </defs>
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke="hsl(var(--muted) / 0.3)"
                  vertical={false}
                  strokeWidth={0.5}
                />
                <XAxis 
                  dataKey="date" 
                  tick={{ 
                    fill: 'hsl(var(--muted-foreground) / 0.8)',
                    fontSize: '0.7rem',
                    fontWeight: 500,
                  }}
                  axisLine={{ stroke: 'hsl(var(--border) / 0.5)', strokeWidth: 0.5 }}
                  tickLine={false}
                  padding={{ left: 10, right: 10 }}
                  height={50}
                  tickMargin={8}
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                  }}
                />
                <YAxis 
                  tick={{ 
                    fill: 'hsl(var(--muted-foreground) / 0.8)',
                    fontSize: '0.7rem',
                    fontWeight: 500,
                  }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={v => v >= 1000000 
                    ? `${(v/1000000).toFixed(1)}M` 
                    : v >= 1000 
                      ? `${(v/1000).toFixed(0)}K` 
                      : v}
                  width={50}
                  tickCount={5}
                />
                <Tooltip 
                  contentStyle={{
                    background: 'hsl(var(--popover))',
            border: '1px solid hsl(var(--border) / 0.5)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            borderRadius: '12px',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
            padding: '12px 16px',
            transition: 'all 0.2s ease'
                  }}
                  labelFormatter={value => {
                    const date = new Date(value);
                    const formattedDate = date.toLocaleDateString('en-US', { 
                      weekday: 'short', 
                      month: 'short', 
                      day: 'numeric',
                      year: 'numeric'
                    });
                    return (
                      <div className="text-xs font-medium text-muted-foreground mb-2">
                        {formattedDate}
                      </div>
                    );
                  }}
                  formatter={(value: number, name: string) => {
                    const chainName = name as Blockchain;
                    const chainInfo = getChainData(chainName);
                    return [
                      <div key={`tooltip-${name}`} className="flex items-center justify-between gap-4 py-1">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-2.5 h-2.5 rounded-full flex-shrink-0 flex items-center justify-center"
                            style={{ 
                              backgroundColor: `${chainInfo.color}20`,
                              border: `1.5px solid ${chainInfo.color}`
                            }}
                          >
                            <div 
                              className="w-1 h-1 rounded-full"
                              style={{ backgroundColor: chainInfo.color }}
                            />
                          </div>
                          <span className="font-medium text-sm">{name}</span>
                        </div>
                        <span 
                          className="font-mono text-sm font-semibold px-2 py-0.5 rounded-md whitespace-nowrap"
                          style={{ 
                            backgroundColor: `${chainInfo.color}10`,
                            color: chainInfo.color
                          }}
                        >
                          {Number(value).toLocaleString('en-US', { 
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                            useGrouping: true
                          })}
                        </span>
                      </div>
                    ];
                  }}
                />
                <Legend 
                  content={({ payload }) => (
                    <div className="flex flex-wrap justify-center gap-4 mt-4">
                      {payload?.map((entry) => (
                        <div 
                          key={`legend-${entry.value}`}
                          className="flex items-center gap-1.5 text-xs"
                          style={{ color: entry.color }}
                        >
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: entry.color }}
                          />
                          {entry.value}
                        </div>
                      ))}
                    </div>
                  )}
                />
                {allChainNames.map((chain, index) => (
                  <Line
                    key={chain}
                    type="monotone"
                    dataKey={chain}
                    stroke={colors[index % colors.length]}
                    strokeWidth={2.5}
                    dot={false}
                    activeDot={{
                      r: 5,
                      strokeWidth: 2,
                      stroke: '#fff',
                      fill: colors[index % colors.length],
                      style: {
                        filter: `drop-shadow(0 0 6px ${colors[index % colors.length]}80)`
                      }
                    }}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{
                      filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.1))'
                    }}
                  />
                ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transaction Fees Panel */}
      <Card className="overflow-hidden">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold">
              {t('transaction_fees', 'Transaction Fees by Network')}
            </CardTitle>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={loadGasFees}
              disabled={isLoadingFees}
              className="h-8 text-xs"
            >
              {isLoadingFees ? (
                <RefreshCw className="mr-1 h-3 w-3 animate-spin" />
              ) : (
                <RefreshCw className="mr-1 h-3 w-3" />
              )}
              {t('refresh')}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoadingFees ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-24 w-full rounded-lg" />
              ))}
            </div>
          ) : gasFees ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(gasFees).map(([chain, fees]) => (
                <div 
                  key={chain}
                  className="border rounded-lg p-4 hover:bg-accent/30 transition-all duration-200 hover:shadow-sm"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">{getChainData(chain).icon}</span>
                    <h3 className="font-medium">{chain}</h3>
                    <div 
                      className="ml-auto h-2 w-2 rounded-full" 
                      style={{ backgroundColor: getChainData(chain).color }}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground text-xs">{t('speed.slow')}</span>
                        <span className="font-mono font-medium">${fees.slow.toFixed(3)}</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full" 
                          style={{ 
                            width: '30%',
                            backgroundColor: getChainData(chain).color,
                            opacity: 0.7
                          }}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground text-xs">{t('speed.normal')}</span>
                        <span className="font-mono font-medium">${fees.normal.toFixed(3)}</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full" 
                          style={{ 
                            width: '60%',
                            backgroundColor: getChainData(chain).color,
                            opacity: 0.85
                          }}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground text-xs">{t('speed.fast')}</span>
                        <span className="font-mono font-medium">${fees.fast.toFixed(3)}</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full" 
                          style={{ 
                            width: '100%',
                            backgroundColor: getChainData(chain).color
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              {t('error_loading_fees', 'Failed to load transaction fees')}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DailyTransactionsChart;
