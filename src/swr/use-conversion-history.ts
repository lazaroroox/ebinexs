import { apiGet } from "src/services/apiService";
import { ConversionHistory } from "src/types/conversion";
import useSWR, { mutate } from "swr";

export default function useConversionHistory({
  query,
  page = 0,
  pageSize = 10,
}: {
  query: string;
  page: number;
  pageSize: number;
}) {
  const { data: response, isValidating } = useSWR<ConversionHistory>(
    query && `/exchange/order?${query}&page=${page}&size=${pageSize}`,
    (url) => apiGet(url, undefined, true),
    {
      keepPreviousData: true,
      dedupingInterval: 10000,
      onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
        if (retryCount >= 3) return;
        setTimeout(() => revalidate({ retryCount }), 2000);
      },
    }
  );

  return {
    data: response?.data,
    numberOfElements: response?.numberOfElements || 0,
    totalElements: response?.totalElements || 0,
    totalPages: response?.totalPages || 0,
    page: response?.page || 0,
    pageSize: response?.pageSize || 0,
    loading: !response?.data,
    isValidating,
    mutate,
  };
}
