import { useQuery } from '@tanstack/react-query';
import { getDailyTransactions } from '@/services/api';

type TimeRange = '1m' | '6m' | '1y';

export const useDailyTransactions = (range: TimeRange = '1m') => {
  return useQuery({
    queryKey: ['dailyTransactions', range],
    queryFn: () => getDailyTransactions(range),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 5 * 60 * 1000, // 5 minutes
  });
};
