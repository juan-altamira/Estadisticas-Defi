import { useTranslation } from 'react-i18next';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { useDefi } from '@/contexts/DefiContext';
import { ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: 2,
    minimumFractionDigits: 2
  }).format(value);
};

export default function ProtocolsTable() {
  const { t } = useTranslation();
  const { protocols, isLoading } = useDefi();

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (!protocols || protocols.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        {t('common.no_data_available')}
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('common.rank')}</TableHead>
            <TableHead>{t('common.name')}</TableHead>
            <TableHead className="text-right">{t('common.tvl')}</TableHead>
            <TableHead className="text-right">{t('common.change_24h')}</TableHead>
            <TableHead>{t('common.chains')}</TableHead>
            <TableHead>{t('common.category')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {protocols.map((protocol: any, index: number) => (
            <TableRow key={protocol.id || index}>
              <TableCell className="font-medium">{index + 1}</TableCell>
              <TableCell className="font-medium flex items-center space-x-2">
                {protocol.logo && (
                  <img 
                    src={protocol.logo} 
                    alt={protocol.name} 
                    className="h-6 w-6 rounded-full"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                )}
                <span>{protocol.name}</span>
              </TableCell>
              <TableCell className="text-right">
                {formatCurrency(protocol.tvl || 0)}
              </TableCell>
              <TableCell 
                className={cn(
                  'text-right font-medium',
                  (protocol.change24h || 0) > 0 ? 'text-green-600' : 
                  (protocol.change24h || 0) < 0 ? 'text-red-600' : 'text-foreground'
                )}
              >
                <div className="flex items-center justify-end">
                  {(protocol.change24h || 0) > 0 ? (
                    <ArrowUp className="h-4 w-4 mr-1" />
                  ) : (protocol.change24h || 0) < 0 ? (
                    <ArrowDown className="h-4 w-4 mr-1" />
                  ) : (
                    <Minus className="h-4 w-4 mr-1" />
                  )}
                  {Math.abs(protocol.change24h || 0).toFixed(2)}%
                </div>
              </TableCell>
              <TableCell>
                <div className="flex -space-x-2">
                  {protocol.chains?.slice(0, 3).map((chain: string, i: number) => (
                    <div 
                      key={i}
                      className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-xs font-medium"
                      title={chain}
                    >
                      {chain.substring(0, 2).toUpperCase()}
                    </div>
                  ))}
                  {protocol.chains?.length > 3 && (
                    <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-xs">
                      +{protocol.chains.length - 3}
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <span className="px-2 py-1 bg-muted rounded-full text-xs">
                  {protocol.category}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
