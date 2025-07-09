import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, Label } from 'recharts';
import { FIXED_TVL_DATA } from '@/constants/tvlData';

// Format value to billions with 2 decimal places
const formatBillion = (value: number) => {
  return `$${value.toFixed(2)}B`;
};

// Modern color palette with better contrast and visual appeal
const COLORS = [
  '#6366F1', // Indigo-500
  '#10B981', // Emerald-500
  '#F59E0B', // Amber-500
  '#EF4444', // Red-500
  '#8B5CF6', // Violet-500
  '#EC4899', // Pink-500
  '#06B6D4', // Cyan-500
  '#F97316', // Orange-500
];

// Gradient colors for the chart arcs
const GRADIENT_COLORS = [
  ['#818CF8', '#4F46E5'], // Indigo gradient
  ['#34D399', '#10B981'], // Emerald gradient
  ['#FBBF24', '#F59E0B'], // Amber gradient
  ['#F87171', '#EF4444'], // Red gradient
  ['#A78BFA', '#8B5CF6'], // Violet gradient
  ['#F472B6', '#EC4899'], // Pink gradient
  ['#22D3EE', '#06B6D4'], // Cyan gradient
  ['#FB923C', '#F97316'], // Orange gradient
];

// Enhanced Custom tooltip with better styling
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const total = payload.reduce((sum: number, item: any) => sum + item.value, 0);
    const percentage = ((data.value / total) * 100).toFixed(1);
    
    return (
      <div className="bg-white/90 dark:bg-gray-900/95 backdrop-blur-sm p-4 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-700/50">
        <div className="flex items-center gap-3 mb-2">
          <div 
            className="w-3 h-3 rounded-full" 
            style={{ backgroundColor: payload[0].color }}
          />
          <h3 className="font-semibold text-gray-900 dark:text-white">{data.name}</h3>
        </div>
        <div className="space-y-1">
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {formatBillion(data.value)}
          </p>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">{percentage}% of total</span>
            <span className="font-medium px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200">
              {data.symbol || ''}
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

const TvlDistributionChart = () => {
  // Use fixed data for the chart
  const tvlData = FIXED_TVL_DATA;
  
  // Calculate total TVL
  const totalTvl = tvlData.reduce((sum, item) => sum + item.value, 0);
  const isLoading = false;
  const error = null;

  if (error) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Error loading data</CardTitle>
          <p className="text-sm text-muted-foreground">
            Please try again later
          </p>
        </CardHeader>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Loading...</CardTitle>
          <p className="text-sm text-muted-foreground">Loading data...</p>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[300px]">
          <div className="animate-pulse flex flex-col items-center">
            <div className="w-32 h-32 rounded-full bg-muted mb-4"></div>
            <div className="h-4 bg-muted rounded w-3/4"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !tvlData || tvlData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>TVL Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-red-500 mb-2">Error loading data</p>
            <p className="text-sm">Trying to reconnect...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 overflow-hidden relative group border-0 shadow-xl">
      {/* Decorative elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-200/50 via-transparent to-transparent dark:from-gray-800/20 dark:via-transparent dark:to-transparent" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSg0NSkiPjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiNmZmZmZmYwMiIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNwYXR0ZXJuKSIgb3BhY2l0eT0iMC4wMiIvPjwvc3ZnPg==')]" />
      <div className="absolute -right-32 -top-32 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl" />
      
      <CardHeader className="relative z-10 pb-4 pt-6 px-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">Total Value Locked</p>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              {formatBillion(totalTvl)}
            </CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-medium text-muted-foreground">
              Live
            </span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="relative z-10 pt-0 px-6 pb-6">
        <div className="w-full h-[320px] md:h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <defs>
                {tvlData.map((_, index) => (
                  <linearGradient 
                    key={`gradient-${index}`}
                    id={`gradient-${index}`}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor={GRADIENT_COLORS[index % GRADIENT_COLORS.length]?.[0] || COLORS[index % COLORS.length]} />
                    <stop offset="100%" stopColor={GRADIENT_COLORS[index % GRADIENT_COLORS.length]?.[1] || COLORS[index % COLORS.length]} />
                  </linearGradient>
                ))}
              </defs>
              
              <Pie
                data={tvlData}
                cx="50%"
                cy="50%"
                innerRadius="60%"
                outerRadius="90%"
                paddingAngle={0}
                dataKey="value"
                nameKey="name"
                animationBegin={0}
                animationDuration={1000}
                animationEasing="ease-out"
                label={false}
                labelLine={false}
                isAnimationActive={true}
                stroke="none"
              >
                {tvlData.map((_, index) => (
                  <Cell 
                    key={`cell-${index}`}
                    fill={`url(#gradient-${index % GRADIENT_COLORS.length})`}
                    stroke="none"
                    strokeWidth={0}
                    style={{
                      filter: 'drop-shadow(0px 4px 8px rgba(0, 0, 0, 0.1))',
                      transition: 'all 0.3s ease',
                      shapeRendering: 'crispEdges',
                      outline: 'none',
                    }}
                  />
                ))}
                
                <Label
                  value="TVL"
                  position="center"
                  className="text-sm font-medium fill-muted-foreground"
                />
              </Pie>
              
              <Tooltip 
                content={<CustomTooltip />}
                wrapperStyle={{
                  zIndex: 1000,
                }}
              />
              
              <Legend 
                content={<></>}
                layout="vertical"
                verticalAlign="middle"
                align="right"
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
      
      {/* Status */}
      <div className="absolute bottom-6 right-6 flex items-center gap-2">
        <div className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse"></div>
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400 tracking-wide">
          UPDATED {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
        </span>
      </div>
    </Card>
  );
};

export default TvlDistributionChart;
