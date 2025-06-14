import { useQuery } from '@tanstack/react-query';
import { Blockchain, fetchGasFees } from '@/services/api';

export const useGasFees = (chain: Blockchain) => {
  return useQuery({
    queryKey: ['gasFees', chain],
    queryFn: () => fetchGasFees(chain),
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 30 * 1000, // Refetch every 30 seconds
  });
};
