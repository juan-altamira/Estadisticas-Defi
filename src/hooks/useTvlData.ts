import { useQuery } from '@tanstack/react-query';
import { fetchTvlData } from '@/services/api';

export const useTvlData = () => {
  return useQuery({
    queryKey: ['tvlData'],
    queryFn: fetchTvlData,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });
};
