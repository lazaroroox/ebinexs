import { apiGet } from "src/services/apiService";
import { OperationsHistoryProps } from "src/types/order";
import useSWR, { mutate } from "swr";
import { format, subDays } from "date-fns";

export default function useOperationsHistory({
  query,
  page = 0,
  pageSize,
}: {
  query: string;
  page: number;
  pageSize: number;
}) {
  const swrKey = query
    ? `/report/operations?${query}&page=${page}&size=${pageSize}`
    : `/report/operations?dateFrom=${format(
        subDays(new Date(), 10),
        "yyyy-MM-dd"
      )}&dateTo=${format(
        new Date(),
        "yyyy-MM-dd"
      )}&page=${page}&size=${pageSize}`;

  const { data: response, isValidating } = useSWR<OperationsHistoryProps>(
    swrKey,
    apiGet,
    {
      keepPreviousData: true,
      dedupingInterval: 10000,
      onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
        if (retryCount >= 3) return;
        setTimeout(() => revalidate({ retryCount }), 2000);
      },
    }
  );

  // O datagrid do material só aceita o primeiro campo como "id"
  const mappedData =
    response?.data.map((operation) => ({
      ...operation,
      id: operation.orderId,
    })) || [];

  return {
    data: mappedData,
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
