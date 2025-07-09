import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { Card } from '@/components/ui/card';
import LanguageSwitcher from "@/components/shared/LanguageSwitcher";
import ThemeToggle from "@/components/shared/ThemeToggle";
import DailyTransactionsChart from "@/components/shared/DailyTransactionsChart";
import DistributionCharts from "@/components/dashboard/DistributionCharts";
import ProtocolsTable from "@/components/dashboard/ProtocolsTable";
import TvlEvolutionChart from "@/components/shared/TvlEvolutionChart";
import { useDefi } from "@/contexts/DefiContext";
import { tvlBreakdownMay2025 } from "@/constants/tvlBreakdown";

const DashboardPage = () => {
  const { t } = useTranslation();
  const { refreshData, isLoading } = useDefi();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      await refreshData();
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">{t('dashboard.title')}</h1>
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            disabled={isLoading || isRefreshing}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            {t('common.refresh')}
          </Button>
          <LanguageSwitcher />
        </div>
      </header>

      <main className="space-y-8">
        {/* TVL Evolution Chart */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-6">{t('dashboard.tvl_evolution')}</h2>
          <div className="h-[600px]">
            <TvlEvolutionChart />
          </div>
          
          {/* TVL Breakdown as of May 2025 */}
          <div className="mt-8">
            <h3 className="text-lg font-medium mb-4">{t('dashboard.tvl_breakdown')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tvlBreakdownMay2025.map(({ language, tvl, color }) => (
                <div key={language} className="flex items-center p-3 bg-gray-900/50 rounded-lg">
                  <div 
                    className="w-4 h-4 rounded-full mr-3" 
                    style={{ backgroundColor: color }}
                  />
                  <div className="flex-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-300">{language}</span>
                      <span className="font-medium">${tvl.value.toFixed(2)}B</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-1.5 mt-1">
                      <div 
                        className="h-1.5 rounded-full" 
                        style={{
                          width: `${(tvl.value / 200) * 100}%`,
                          backgroundColor: color,
                          maxWidth: '100%'
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Top Row - Full Width */}
        <Card className="p-6">
          <DailyTransactionsChart />
        </Card>

        {/* Middle Row - Distribution Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">{t('dashboard.tvl_by_category')}</h2>
            <div className="h-80">
              <DistributionCharts type="category" />
            </div>
          </Card>
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">{t('dashboard.tvl_by_chain')}</h2>
            <div className="h-80">
              <DistributionCharts type="chain" />
            </div>
          </Card>
        </div>

        {/* Bottom Row - Protocols Table */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">{t('dashboard.top_protocols')}</h2>
          </div>
          <ProtocolsTable />
        </Card>
      </main>

      <footer className="fixed bottom-4 left-4">
        <ThemeToggle />
      </footer>
    </div>
  );
};

export default DashboardPage;
