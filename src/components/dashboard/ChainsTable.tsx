import { useTranslation } from 'react-i18next';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';

interface ChainData {
  name: string;
  protocols: number;
  activeAddresses: string;
  change1d: string;
  change7d: string;
  change1m: string;
  defiTvl: string;
  bridgedTvl: string;
  stables: string;
  volume24h: string;
  fees24h: string;
}

const chainsData: ChainData[] = [
  {
    name: 'Ethereum',
    protocols: 1391,
    activeAddresses: '464,630',
    change1d: '-3.53%',
    change7d: '+5.04%',
    change1m: '+2.28%',
    defiTvl: '$67.74b',
    bridgedTvl: '$403.36b',
    stables: '$127.06b',
    volume24h: '$1.83b',
    fees24h: '$1.17m'
  },
  {
    name: 'Solana',
    protocols: 232,
    activeAddresses: '3.3m',
    change1d: '-1.71%',
    change7d: '+0.61%',
    change1m: '-4.13%',
    defiTvl: '$8.8b',
    bridgedTvl: '$0',
    stables: '$10.91b',
    volume24h: '$2.05b',
    fees24h: '$1.32m'
  },
  {
    name: 'Bitcoin',
    protocols: 61,
    activeAddresses: '795,709',
    change1d: '-0.68%',
    change7d: '-0.41%',
    change1m: '+0.99%',
    defiTvl: '$6.42b',
    bridgedTvl: '$0',
    stables: '$3.03m',
    volume24h: '$484.8m',
    fees24h: ''
  },
  {
    name: 'BNB Chain',
    protocols: 904,
    activeAddresses: '2.42m',
    change1d: '-0.60%',
    change7d: '+0.73%',
    change1m: '-1.31%',
    defiTvl: '$6.12b',
    bridgedTvl: '$15.85b',
    stables: '$10.53b',
    volume24h: '$6.42b',
    fees24h: '$313.8k'
  },
  {
    name: 'Tron',
    protocols: 35,
    activeAddresses: '2.53m',
    change1d: '< 0.0001%',
    change7d: '+3.17%',
    change1m: '+1.11%',
    defiTvl: '$5.09b',
    bridgedTvl: '$86.29b',
    stables: '$81.18b',
    volume24h: '$43.75m',
    fees24h: '$2.08m'
  },
  {
    name: 'Base',
    protocols: 553,
    activeAddresses: '1.14m',
    change1d: '-0.81%',
    change7d: '+2.89%',
    change1m: '+4.07%',
    defiTvl: '$3.57b',
    bridgedTvl: '$15.84b',
    stables: '$4.19b',
    volume24h: '$863.2m',
    fees24h: '$80.62k'
  },
  {
    name: 'Arbitrum',
    protocols: 817,
    activeAddresses: '420,586',
    change1d: '-2.12%',
    change7d: '-1.83%',
    change1m: '-3.02%',
    defiTvl: '$2.5b',
    bridgedTvl: '$13.68b',
    stables: '$3.48b',
    volume24h: '$372m',
    fees24h: '$12.64k'
  },
  {
    name: 'Sui',
    protocols: 70,
    activeAddresses: '0',
    change1d: '-0.72%',
    change7d: '+7.10%',
    change1m: '-4.32%',
    defiTvl: '$1.86b',
    bridgedTvl: '$1.98b',
    stables: '$1.1b',
    volume24h: '$306.8m',
    fees24h: '$25.42k'
  },
  {
    name: 'Avalanche',
    protocols: 452,
    activeAddresses: '40,884',
    change1d: '+2.78%',
    change7d: '-1.71%',
    change1m: '-4.92%',
    defiTvl: '$1.5b',
    bridgedTvl: '$6.38b',
    stables: '$1.67b',
    volume24h: '$86.65m',
    fees24h: '$7.65k'
  },
  {
    name: 'Polygon',
    protocols: 621,
    activeAddresses: '670,280',
    change1d: '-0.51%',
    change7d: 'N/A',
    change1m: '+5.32%',
    defiTvl: '$1.07b',
    bridgedTvl: '$5.43b',
    stables: '$2.55b',
    volume24h: '$459.4m',
    fees24h: '$6.25k'
  },
  {
    name: 'Aptos',
    protocols: 63,
    activeAddresses: '0',
    change1d: '-0.67%',
    change7d: '-2.84%',
    change1m: '-11.45%',
    defiTvl: '$980.9m',
    bridgedTvl: '$504.4m',
    stables: '$1.31b',
    volume24h: '$168m',
    fees24h: '$1.9k'
  },
  {
    name: 'Unichain',
    protocols: 39,
    activeAddresses: '0',
    change1d: '-2.44%',
    change7d: '-1.70%',
    change1m: '+11.76%',
    defiTvl: '$856.8m',
    bridgedTvl: '$873.5m',
    stables: '$438m',
    volume24h: '$282.8m',
    fees24h: '$10.05k'
  },
  {
    name: 'Berachain',
    protocols: 77,
    activeAddresses: '0',
    change1d: '-4.68%',
    change7d: '+4.42%',
    change1m: '-35.04%',
    defiTvl: '$701.3m',
    bridgedTvl: '$845.9m',
    stables: '$159.5m',
    volume24h: '$11.82m',
    fees24h: '$129'
  },
  {
    name: 'Sei',
    protocols: 51,
    activeAddresses: '0',
    change1d: '-0.11%',
    change7d: '+6.10%',
    change1m: '+27.11%',
    defiTvl: '$645.4m',
    bridgedTvl: 'N/A',
    stables: '$292.2m',
    volume24h: '$36.63m',
    fees24h: '$634'
  }
];

export default function ChainsTable() {
  const { t } = useTranslation();
  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead className="w-[60px]">#</TableHead>
            <TableHead>Chain</TableHead>
            <TableHead>{t('blockchain_metrics.protocols')}</TableHead>
            <TableHead>{t('blockchain_metrics.active_addresses')}</TableHead>
            <TableHead>{t('blockchain_metrics.change_1d')}</TableHead>
            <TableHead>{t('blockchain_metrics.change_7d')}</TableHead>
            <TableHead>{t('blockchain_metrics.change_1m')}</TableHead>
            <TableHead>{t('blockchain_metrics.defi_tvl')}</TableHead>
            <TableHead>{t('blockchain_metrics.bridged_tvl')}</TableHead>
            <TableHead>{t('blockchain_metrics.stables')}</TableHead>
            <TableHead>{t('blockchain_metrics.volume_24h')}</TableHead>
            <TableHead>{t('blockchain_metrics.fees_24h')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {chainsData.map((chain, index) => (
            <TableRow key={chain.name}>
              <TableCell className="font-medium">{index + 1}</TableCell>
              <TableCell className="font-medium">{chain.name}</TableCell>
              <TableCell>{chain.protocols.toLocaleString()}</TableCell>
              <TableCell>{chain.activeAddresses}</TableCell>
              <TableCell className={cn(
                'font-medium',
                chain.change1d.startsWith('-') ? 'text-red-500' : 
                chain.change1d.startsWith('+') ? 'text-green-500' : 'text-foreground'
              )}>
                {chain.change1d}
              </TableCell>
              <TableCell className={cn(
                'font-medium',
                chain.change7d.startsWith('-') ? 'text-red-500' : 
                chain.change7d.startsWith('+') ? 'text-green-500' : 'text-foreground'
              )}>
                {chain.change7d}
              </TableCell>
              <TableCell className={cn(
                'font-medium',
                chain.change1m.startsWith('-') ? 'text-red-500' : 
                chain.change1m.startsWith('+') ? 'text-green-500' : 'text-foreground'
              )}>
                {chain.change1m}
              </TableCell>
              <TableCell className="font-medium">{chain.defiTvl}</TableCell>
              <TableCell>{chain.bridgedTvl}</TableCell>
              <TableCell>{chain.stables}</TableCell>
              <TableCell>{chain.volume24h}</TableCell>
              <TableCell>{chain.fees24h}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
