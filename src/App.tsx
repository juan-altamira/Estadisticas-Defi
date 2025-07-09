import { Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { ErrorBoundary } from 'react-error-boundary';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import DashboardPage from "./pages/DashboardPage";

// Error fallback component
function ErrorFallback({ error, resetErrorBoundary }: { error: Error, resetErrorBoundary: () => void }) {
  const { t } = useTranslation();
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Alert variant="destructive" className="max-w-md">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>{t('common.error')}</AlertTitle>
        <AlertDescription className="mb-4">
          {error.message || t('common.something_went_wrong')}
        </AlertDescription>
        <Button variant="outline" onClick={resetErrorBoundary}>
          {t('common.retry')}
        </Button>
      </Alert>
    </div>
  );
}

// Loading component
function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse flex flex-col items-center space-y-4">
        <div className="h-12 w-12 rounded-full bg-muted"></div>
        <p className="text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}

function App() {
  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      <ErrorBoundary 
        FallbackComponent={ErrorFallback}
        onError={(error) => console.error('Error caught by error boundary:', error)}
      >
        <Suspense fallback={<LoadingFallback />}>
          <DashboardPage />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}

export default App;
