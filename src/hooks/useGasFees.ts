import { useQuery } from '@tanstack/react-query';
import { Blockchain, getGasFeesData } from '@/services/api';

export const useGasFees = (chain: Blockchain) => {
  return useQuery({
    queryKey: ['gasFees', chain],
    queryFn: async () => {
      const fees = await getGasFeesData();
      return fees[chain];
    },
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 30 * 1000, // 30 seconds
  });
};
