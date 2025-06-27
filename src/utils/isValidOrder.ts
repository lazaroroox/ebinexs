import { getBrokerNowTime } from "src/components/TVChartContainer/datafeed";

export const isValidOrder = (order, onServerTime?: () => number) => {
  const isNewOption = order.binaryOrderType === "OPTION";

  const brokerTime =
    typeof onServerTime === "function" ? onServerTime() : getBrokerNowTime();

  const orderTime = new Date(
    isNewOption ? order.candleStartTime : order.candleEndTime
  ).getTime();

  if (!isNewOption) {
    return orderTime > brokerTime;
  }

  const timeFrameInMs = {
    M1: 1 * 60 * 1000,
    M5: 5 * 60 * 1000,
    M15: 15 * 60 * 1000,
  }[order.candleTimeFrame];

  return brokerTime - orderTime < timeFrameInMs;
};
