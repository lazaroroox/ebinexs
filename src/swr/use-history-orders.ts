import { apiGet } from "src/services/apiService";
import { Order } from "src/types/order";
import useSWR from "swr";

export default function useHistoryOrders({
  parameters,
  pairs,
}: {
  parameters?: any;
  pairs?: any[];
}) {
  const isReady = parameters && pairs;

  const candleTimeFrames = isReady
    ? JSON.parse(parameters.CANDLE_TIME_FRAMES.value)
    : [];
  const timeFrames = candleTimeFrames.map((item) => item.value).join(",");

  const symbolsList = isReady
    ? pairs
        .map((t) => t.value.replace("/", ""))
        .filter((t) => t !== "ALL")
        .join(",")
    : "";

  const {
    data: response,
    isValidating,
    mutate,
  } = useSWR<Order[]>(
    isReady
      ? `/orders?candleTimeFrames=${timeFrames}&symbols=${symbolsList}&statuses=CANCELED,REFUNDED,WIN,LOSE&page=0&size=10`
      : null,
    apiGet
  );

  return {
    data: response || [],
    loading: isReady && !response,
    isValidating: isValidating || false,
    mutate: mutate || (() => {}),
  };
}
