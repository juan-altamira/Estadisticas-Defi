import DailyTransactionsChart from "@/components/shared/DailyTransactionsChart";
import GasFeesPanel from "@/components/shared/GasFeesPanel";
import LanguageSwitcher from "@/components/shared/LanguageSwitcher";
import ThemeToggle from "@/components/shared/ThemeToggle";
import TvlDistributionChart from "@/components/shared/TvlDistributionChart";

const DashboardPage = () => {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <header className="flex justify-end items-center mb-8">
        <LanguageSwitcher />
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Top Row - Full Width on Large Screens */}
        <div className="lg:col-span-3">
          <DailyTransactionsChart />
        </div>

        {/* Bottom Row - Two Columns */}
        <div className="lg:col-span-2">
          <GasFeesPanel />
        </div>
        <div>
          <TvlDistributionChart />
        </div>
      </main>

      <footer className="fixed bottom-4 left-4">
        <ThemeToggle />
      </footer>
    </div>
  );
};

export default DashboardPage;
