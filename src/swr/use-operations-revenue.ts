import { apiGet } from "src/services/apiService";
import { OperationsRevenue } from "src/types/filter";
import useSWR from "swr";

export default function useOperationsRevenue({ query }: { query: string }) {
  const { data, isValidating, mutate } = useSWR<OperationsRevenue>(
    query && `/report/operationsRevenue?${query}`,
    apiGet,
    {
      dedupingInterval: 10000,
    }
  );

  return {
    data: data || ({} as OperationsRevenue),
    loading: !data,
    isValidating,
    mutate,
  };
}
