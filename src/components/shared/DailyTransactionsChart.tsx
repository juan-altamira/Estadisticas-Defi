import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';
import { useDailyTransactions } from '@/hooks/useDailyTransactions';

const DailyTransactionsChart = () => {
  const { t } = useTranslation();
  const { data: transactionsData, isLoading, error } = useDailyTransactions();

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

  // Get all chain names from the first data point (excluding 'date' key)
  const chainNames = Object.keys(transactionsData[0] || {}).filter(key => key !== 'date');
  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F', '#FFBB28'];

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('daily_transactions')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div style={{ width: '100%', height: 400 }}>
          <ResponsiveContainer>
            <LineChart data={transactionsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
              <XAxis 
                dataKey="date" 
                tick={{ fill: 'hsl(var(--foreground))' }}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
                }}
              />
              <YAxis 
                tick={{ fill: 'hsl(var(--foreground))' }}
                tickFormatter={(value) => {
                  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
                  if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
                  return value;
                }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--popover))',
                  borderColor: 'hsl(var(--border))',
                  borderRadius: 'var(--radius)'
                }}
                labelFormatter={(value) => {
                  return new Date(value).toLocaleDateString(undefined, { 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric' 
                  });
                }}
                formatter={(value: number) => [
                  value.toLocaleString(),
                  'Transactions'
                ]}
              />
              <Legend />
              {chainNames.map((chain, index) => (
                <Line 
                  key={chain}
                  type="monotone" 
                  dataKey={chain} 
                  stroke={colors[index % colors.length]} 
                  dot={false}
                  activeDot={{ r: 6 }}
                  strokeWidth={2}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default DailyTransactionsChart;
