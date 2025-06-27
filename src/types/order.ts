import { AssetEnum } from "../enums/assetEnum";

export enum OrderStatusEnum {
  OPEN = "open",
  PENDING = "pending",
  WIN = "win",
  LOSE = "lose",
  REFUNDED = "refunded",
  CANCELED = "canceled",
}

export enum OrderDirectionEnum {
  BEAR = "bear",
  BULL = "bull",
}

export interface OrderKey {
  createdAt: Date | number;
  contextId: string;
}

export interface Order extends OrderKey {
  id: string;
  orderId: string;
  userEmail: string;
  userId: string;
  symbol: string;
  binaryOrderType: string;
  candleStartTime: number;
  candleEndTime: number;
  candleTimeFrame: string;
  createdAtBrokerTime: number;
  direction: OrderDirectionEnum;
  orderDirection: string;
  date: string;
  invest: number;
  investment: number;
  feeRate: number;
  fees: number;
  refund: number;
  accept: number;
  profit: number;
  status: OrderStatusEnum;
  asset: AssetEnum;
  price: number;
  result: number;
  ccp: null | number;
  cop: null | number;
  image: string;
  orderType: string;
}

export interface OperationsHistoryProps {
  data: Order[];
  numberOfElements: number;
  page: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
}

export interface OrderBookItem {
  id: string;
  userId: string;
  invest: number;
  createdAt?: number;
}
