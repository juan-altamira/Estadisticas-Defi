import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, Label } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';
import { useTvlData } from '@/hooks/useTvlData';

// Color palette for the chart
const COLORS = [
  '#4F46E5', // Indigo-600
  '#10B981', // Emerald-500
  '#F59E0B', // Amber-500
  '#EF4444', // Red-500
  '#8B5CF6', // Violet-500
  '#EC4899', // Pink-500
  '#06B6D4', // Cyan-500
  '#F97316', // Orange-500
];

// Format value to billions with 2 decimal places
const formatBillion = (value: number) => {
  return `$${value.toFixed(2)}B`;
};

// Custom tooltip component
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
        <p className="font-medium">{data.name}</p>
        <p className="text-sm">TVL: {formatBillion(data.value)}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {((data.value / payload.reduce((sum: number, item: any) => sum + item.value, 0)) * 100).toFixed(1)}% of total
        </p>
      </div>
    );
  }
  return null;
};

// Custom legend formatter
const renderColorfulLegendText = (value: string, entry: any) => {
  const { color } = entry;
  return (
    <span style={{ color }} className="text-sm">
      {value}
    </span>
  );
};

const TvlDistributionChart = () => {
  const { t } = useTranslation();
  const { data: tvlData, isLoading, error } = useTvlData();

  // Calculate total TVL for the subtitle
  const totalTvl = tvlData?.reduce((sum, item) => sum + (item.value || 0), 0) || 0;

  if (isLoading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>{t('tvl_distribution')}</CardTitle>
          <p className="text-sm text-muted-foreground">
            {t('loading')}...
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-6 w-1/3" />
          <div className="flex items-center justify-center h-64">
            <Skeleton className="h-48 w-48 rounded-full" />
          </div>
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-4 w-20" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !tvlData || tvlData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t('tvl_distribution')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-red-500 mb-2">{t('error_loading_data')}</p>
            <p className="text-sm">{t('trying_to_reconnect')}...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{t('tvl_distribution')}</CardTitle>
        <p className="text-sm text-muted-foreground">
          {t('total_value_locked')}: {formatBillion(totalTvl)}
        </p>
      </CardHeader>
      <CardContent>
        <div className="w-full h-[300px] md:h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={tvlData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) => {
                  if (percent < 0.05) return null; // Hide small labels
                  return `${name}: ${(percent * 100).toFixed(0)}%`;
                }}
                labelLine={false}
              >
                {tvlData.map((_, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]} 
                    stroke="#fff"
                    strokeWidth={1}
                  />
                ))}
                <Label
                  value="TVL"
                  position="center"
                  className="text-sm font-medium text-center"
                />
              </Pie>
              <Tooltip 
                content={<CustomTooltip />}
                wrapperStyle={{
                  zIndex: 1000,
                }}
              />
              <Legend 
                layout="horizontal"
                verticalAlign="bottom"
                align="center"
                wrapperStyle={{
                  paddingTop: '20px',
                }}
                formatter={renderColorfulLegendText}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default TvlDistributionChart;
