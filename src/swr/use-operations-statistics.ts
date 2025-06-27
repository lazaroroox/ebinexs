import { apiGet } from "src/services/apiService";
import { OperationsStatisticsData } from "src/types/filter";
import useSWR, { mutate } from "swr";

export default function useOperationsStatistics({
  query,
  page = 0,
}: {
  query: string;
  page: number;
}) {
  const { data, isValidating } = useSWR<OperationsStatisticsData>(
    query && `/report/operationsStatistics?${query}&page=${page}`,
    apiGet,
    {
      dedupingInterval: 10000,
    }
  );

  return {
    data: data || ({} as OperationsStatisticsData),
    loading: !data,
    isValidating,
    mutate,
  };
}
