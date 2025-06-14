import { useQuery } from '@tanstack/react-query';
import { fetchDailyTransactions } from '@/services/api';

export const useDailyTransactions = () => {
  return useQuery({
    queryKey: ['dailyTransactions'],
    queryFn: fetchDailyTransactions,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });
};
