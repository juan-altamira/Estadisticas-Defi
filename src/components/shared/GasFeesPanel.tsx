import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Blockchain } from '@/services/api';
import { cn } from '@/lib/utils';
import { Flame, Zap, Turtle, Loader2, AlertCircle } from 'lucide-react';
import { useGasFees } from '@/hooks/useGasFees';
import { Skeleton } from '@/components/ui/skeleton';

const blockchains: Blockchain[] = ['Ethereum', 'BNBChain', 'Base', 'Polygon', 'Arbitrum', 'Optimism', 'Solana', 'Tron'];

const GasFeesPanel = () => {
  const { t } = useTranslation();
  const [selectedChain, setSelectedChain] = useState<Blockchain>('Ethereum');
  const { data: fees, isLoading, error } = useGasFees(selectedChain);

  // Default values in case of loading or error
  const defaultFees = { slow: 0, normal: 0, fast: 0 };
  const displayFees = fees || defaultFees;

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t('gas_fees')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4">
            <div className="flex flex-row md:flex-col gap-2 overflow-x-auto pb-2 md:pb-0 md:overflow-x-visible">
              {blockchains.map((chain) => (
                <Skeleton key={chain} className="h-10 w-24 rounded-md" />
              ))}
            </div>
            <div className="flex-grow grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-secondary p-4 rounded-lg flex flex-col items-center space-y-2">
                  <Skeleton className="h-6 w-6 rounded-full" />
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-3 w-12" />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t('gas_fees')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 space-y-4 text-muted-foreground">
            <AlertCircle className="w-12 h-12 text-destructive" />
            <p>{t('error_loading_data')}</p>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
            >
              {t('retry')}
            </button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{t('gas_fees')}</CardTitle>
          <div className="flex items-center text-sm text-muted-foreground">
            <Loader2 className="mr-2 h-3 w-3 animate-spin" />
            <span>{t('updating')}...</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-8">
          {/* Blockchain Selector */}
          <div className="flex flex-row md:flex-col gap-2 overflow-x-auto pb-2 md:pb-0 md:overflow-x-visible">
            {blockchains.map((chain) => (
              <button
                key={chain}
                onClick={() => setSelectedChain(chain)}
                className={cn(
                  'px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                  selectedChain === chain
                    ? 'bg-primary text-primary-foreground shadow'
                    : 'bg-secondary text-secondary-foreground hover:bg-muted/80',
                  'disabled:opacity-50 disabled:pointer-events-none'
                )}
                disabled={isLoading}
              >
                {chain}
              </button>
            ))}
          </div>

          {/* Gas Fees Display */}
          <div className="flex-grow grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-secondary p-4 rounded-lg flex flex-col items-center transition-all hover:shadow-md">
              <Turtle className="w-6 h-6 mb-2 text-green-500" />
              <span className="text-sm font-bold">{t('slow')}</span>
              <span className="text-lg font-mono">${displayFees.slow.toFixed(2)}</span>
              <span className="text-xs text-muted-foreground">~3m</span>
            </div>
            <div className="bg-secondary p-4 rounded-lg flex flex-col items-center transition-all hover:shadow-md">
              <Zap className="w-6 h-6 mb-2 text-yellow-500" />
              <span className="text-sm font-bold">{t('normal')}</span>
              <span className="text-lg font-mono">${displayFees.normal.toFixed(2)}</span>
              <span className="text-xs text-muted-foreground">~1m</span>
            </div>
            <div className="bg-secondary p-4 rounded-lg flex flex-col items-center transition-all hover:shadow-md">
              <Flame className="w-6 h-6 mb-2 text-red-500" />
              <span className="text-sm font-bold">{t('fast')}</span>
              <span className="text-lg font-mono">${displayFees.fast.toFixed(2)}</span>
              <span className="text-xs text-muted-foreground">~15s</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GasFeesPanel;
