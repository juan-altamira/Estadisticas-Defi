import { useQuery } from '@tanstack/react-query';
import { getTvlData } from '@/services/api';

export const useTvlData = () => {
  return useQuery({
    queryKey: ['tvlData'],
    queryFn: getTvlData,
    staleTime: 24 * 60 * 60 * 1000, // 24 horas
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false
  });
};
