type OrderOpenPending = {
  id: string;
  orderType: string;
  candleStartTime: number;
  direction: string;
};

export const createOpenOrderId = ({
  id,
  direction,
  candleStartTime,
  orderType,
}: OrderOpenPending) => {
  return `order-${direction}-${candleStartTime}-${orderType}-OPEN-${id}`;
};

export const createPendingOrderId = ({
  id,
  direction,
  candleStartTime,
  orderType,
}: OrderOpenPending) => {
  return `order-${direction}-${candleStartTime}-${orderType}-PENDING-${id}`;
};
