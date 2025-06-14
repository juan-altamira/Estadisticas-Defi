import { useQuery } from '@tanstack/react-query';
import { getTvlData } from '@/services/api';

export const useTvlData = () => {
  return useQuery({
    queryKey: ['tvlData'],
    queryFn: getTvlData,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 5 * 60 * 1000, // 5 minutes
  });
};
