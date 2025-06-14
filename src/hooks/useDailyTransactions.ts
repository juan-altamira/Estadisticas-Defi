import { useQuery } from '@tanstack/react-query';
import { getDailyTransactions } from '@/services/api';

export const useDailyTransactions = () => {
  return useQuery({
    queryKey: ['dailyTransactions'],
    queryFn: getDailyTransactions,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 5 * 60 * 1000, // 5 minutes
  });
};
