import PropTypes from "prop-types";
import {
  createContext,
  ReactNode,
  RefObject,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import type {
  EntityId,
  IChartingLibraryWidget,
  IChartWidgetApi,
  ILineDataSourceApi,
} from "src/charting_library/charting_library";
import { getLastBar } from "src/components/TVChartContainerV2/streaming";
import { correctSymbol, updateCurrentChartAnalysis } from "src/utils";
import { convertTimeToCandlePoint } from "src/utils/candle";
import { delay } from "src/utils/delay";
import formatCurrency from "src/utils/formatCurrency";
import { createOpenOrderId, createPendingOrderId } from "src/utils/order";
import { useLocalStorage } from "usehooks-ts";
import { Order, OrderStatusEnum } from "../../types/order";

type ChartOrders = { id: string; entities: EntityId[] };

type CalloutPointType = {
  startTime: number;
  endTime: number;
  priceStart: number;
  priceEnd: number;
};

type CreateCalloutOrderProps = {
  label: string;
  color: string;
  calloutPoint: CalloutPointType;
};

type GroupedOrders = {
  id: string;
  orders: Order[];
};

type WinLoseOrderType = {
  candleStartTime: number;
  candleTimeFrame: string;
  orderDirection: string;
  price: number;
  ordersIds: string[];
  symbol: string;
  value: number;
};

interface OrderItem {
  orderId: string;
  order: any;
  orderTradingView: ILineDataSourceApi;
  orderTradingViewId: EntityId;
  direction: ("buy" | "BULL") | ("sell" | "BEAR");
  timeframe: string;
  candleStartTime: number;
  totalOrderValue: number;
  symbol: string;
  status: string;
}

interface State {
  tvWidget: IChartingLibraryWidget | null;
  widgetReady: boolean;
  chartOrders: ChartOrders[];
  eventsPending: any[];
  candleTime: number;
  selectedSymbol: string;
  ordersPending: OrderItem[];
  ordersOpened: OrderItem[];
  headerMenuSymbols: string[];
}

interface BollingerBands {
  sma: number;
  upperBand: number;
  lowerBand: number;
  maxHeight: number;
}

export interface TradingViewContextValue extends State {
  setWidget: (tvWidget: IChartingLibraryWidget) => void;
  addChartOrders: (orders: Order[], currentTimeframe: string) => Promise<void>;
  setChartOrders: (chartOrders: ChartOrders[]) => void;
  removeChartOrders: (orders: GroupedOrders[]) => void;
  winLoseChartOrder: (orders: WinLoseOrderType, status: string) => void;
  removeOrdersByTimeframe: (timeframe: string) => void;
  setCandleTime: (timestamp: number) => void;
  addEventPending: (event: any) => void;
  removeEventPending: () => void;
  updateSymbol: (symbol: string) => void;
  closeAllOrders: () => void;
  removeOrderById: (orderId: string) => void;
  removeOrdersBySymbol: (symbol: string) => void;
  removeOrderOpenedById: (orderId: string) => void;
  removeOrderPendingById: (orderId: string) => void;
  removeOrderFromChartById: (orderTradingViewId: string) => void;
  checkTvWidgetChartIsActive: () => Promise<IChartWidgetApi>;
  headerMenuSymbols: string[];
  updateHeaderMenuSymbols: (newSymbols: string[]) => void;
  isOpenToolbar: boolean;
  updateIsOpenToolbar: (b: boolean) => void;
}

interface TradingViewProviderV2Props {
  children?: ReactNode;
}

const initialState: State = {
  tvWidget: null,
  widgetReady: false,
  chartOrders: [],
  eventsPending: [],
  candleTime: 0,
  selectedSymbol:
    JSON.parse(localStorage.getItem("defaultSymbol")) || "IDXUSDT",
  headerMenuSymbols: [],
  ordersPending: [],
  ordersOpened: [],
};

type Action =
  | { type: "SET_TV_WIDGET"; payload: IChartingLibraryWidget }
  | { type: "SET_CHART_ORDERS"; payload: ChartOrders[] }
  | { type: "SET_EVENTS_PENDING"; payload: any }
  | { type: "REMOVE_EVENTS_PENDING"; payload: any }
  | { type: "SET_CANDLE_TIME"; payload: number }
  | { type: "SET_SELECTED_SYMBOL"; payload: string }
  | { type: "SET_HEADER_MENU_SYMBOL"; payload: string[] }
  | { type: "ADD_ORDER_PENDING"; payload: OrderItem }
  | { type: "ADD_ORDER_OPENED"; payload: OrderItem }
  | { type: "UPDATE_ORDER_OPENED"; payload: OrderItem[] }
  | { type: "REMOVE_ORDER_BY_ID"; payload: string }
  | { type: "REMOVE_ORDER_PENDING_BY_ID"; payload: { orderId: string } }
  | { type: "REMOVE_ORDER_OPENED_BY_ID"; payload: { orderId: string } }
  | { type: "SET_COUNTDOWN_VALUE"; payload: number }
  | { type: "REMOVE_ALL_SHAPES"; payload: any };

const handlers: Record<string, (state: State, action: Action) => State> = {
  SET_TV_WIDGET: (state, action) => ({
    ...state,
    tvWidget: action.payload,
  }),
  SET_CHART_ORDERS: (state, action) => ({
    ...state,
    chartOrders: action.payload,
  }),
  SET_EVENTS_PENDING: (state, action) => ({
    ...state,
    eventsPending: [...state.eventsPending, action.payload],
  }),
  REMOVE_EVENTS_PENDING: (state) => ({
    ...state,
    eventsPending: [],
  }),
  SET_SELECTED_SYMBOL: (state, action) => ({
    ...state,
    selectedSymbol: action.payload,
  }),
  ADD_ORDER_PENDING: (state, action) => {
    if (state.ordersPending.some((o) => o.orderId === action.payload.orderId)) {
      return state;
    }

    return {
      ...state,
      ordersPending: [...state.ordersPending, action.payload],
    };
  },
  ADD_ORDER_OPENED: (state, action) => {
    if (
      state.ordersOpened.some((o) => o.order.id === action.payload.order.id)
    ) {
      return state;
    }

    return {
      ...state,
      ordersOpened: [...state.ordersOpened, action.payload],
    };
  },
  UPDATE_ORDER_OPENED: (state, action) => ({
    ...state,
    ordersOpened: action.payload,
  }),
  REMOVE_ORDER_BY_ID: (state, action) => {
    const updatedOrdersPending = state.ordersPending.filter(
      (i) => i.orderId !== action.payload
    );
    const updatedOrdersOpened = state.ordersOpened.filter(
      (i) => i.orderId !== action.payload
    );

    return {
      ...state,
      ordersPending: updatedOrdersPending,
      ordersOpened: updatedOrdersOpened,
    };
  },
  REMOVE_ORDER_OPENED_BY_ID: (state, action) => {
    const { ordersOpened } = state;

    const { orderId } = action.payload;

    if (!ordersOpened.length) {
      return state;
    }

    const updatedOrdersOpened = ordersOpened.filter(
      (i) => i.orderId !== orderId
    );

    return {
      ...state,
      ordersOpened: updatedOrdersOpened,
    };
  },
  REMOVE_ORDER_PENDING_BY_ID: (state, action) => {
    const { ordersPending } = state;

    const { orderId } = action.payload;

    const updatedOrdersPending = ordersPending.filter(
      (i) => i.orderId !== orderId
    );

    return {
      ...state,
      ordersPending: updatedOrdersPending,
    };
  },
  SET_HEADER_MENU_SYMBOL: (state, action) => {
    return {
      ...state,
      headerMenuSymbols: action.payload,
    };
  },
};

const reducer = (state: State, action: Action): State =>
  handlers[action.type] ? handlers[action.type](state, action) : state;

const TradingViewContextV2 = createContext<TradingViewContextValue>({
  ...initialState,
  setWidget: () => {},
  addChartOrders: () => null,
  setChartOrders: () => null,
  removeChartOrders: () => null,
  winLoseChartOrder: () => null,
  removeOrdersByTimeframe: () => null,
  setCandleTime: () => null,
  addEventPending: () => null,
  removeEventPending: () => null,
  updateSymbol: () => null,
  closeAllOrders: () => null,
  removeOrderById: () => null,
  removeOrdersBySymbol: () => null,
  removeOrderOpenedById: () => null,
  removeOrderPendingById: () => null,
  removeOrderFromChartById: () => null,
  checkTvWidgetChartIsActive: () => null,
  updateHeaderMenuSymbols: () => null,
  updateIsOpenToolbar: () => null,
  isOpenToolbar: false,
});

const orderLocks = new Set<string>(); // Armazenará as ordens atualmente sendo processadas

export const TradingViewProviderV2 = ({
  children,
}: TradingViewProviderV2Props) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [defaultSymbol, setDefaultSymbol] = useLocalStorage(
    "defaultSymbol",
    "IDXUSDT"
  );
  const [selectedMenuSymbols, setSelectedMenuSymbols] = useLocalStorage(
    "selectedMenuSymbols",
    []
  );

  const [isOpenToolbar, setIsOpenToolbar] = useState(false);

  const updateIsOpenToolbar = (b: boolean) => {
    setIsOpenToolbar(b);
  };

  const removeOrderFromChartById = async (orderTradingViewId: EntityId) => {
    const chartActived = await checkTvWidgetChartIsActive(0);

    if (chartActived && typeof chartActived.removeEntity === "function") {
      try {
        chartActived.removeEntity(orderTradingViewId);
      } catch (error) {
        console.log("REMOVE ERROR", error);
      }
    }
  };

  const checkTvWidgetChartIsActive = async (
    maxRetries = 5,
    delayMs = 500
  ): Promise<IChartWidgetApi> => {
    return new Promise((resolve, reject) => {
      let attempts = 0;

      const trySetResolution = () => {
        if (
          window?.tvWidget &&
          typeof window?.tvWidget?.activeChart === "function"
        ) {
          try {
            // console.log(
            //   "Tvwidget chart is active!",
            //   typeof window.tvWidget.activeChart
            // );
            const activeChart = window.tvWidget.activeChart();
            resolve(activeChart);
          } catch (error) {
            // console.error("Erro ao acessar TradingView chart:", error);
          }
        }

        attempts++;
        if (attempts < maxRetries) {
          // console.log(
          //   `TradingView widget not ready yet, retrying... (${attempts}/${maxRetries})`
          // );
          setTimeout(trySetResolution, delayMs);
        } else {
          // console.warn(
          //   "Failed to found chart active after maximum retry attempts"
          // );
        }
      };

      return trySetResolution();
    });
  };

  const processOrderSafely = (orderId: string, action: () => void) => {
    if (!orderLocks.has(orderId)) {
      orderLocks.add(orderId); // Bloquear a ordem
      action(); // Executar ação (criação/remoção)
      orderLocks.delete(orderId); // Desbloquear após a ação
    }
  };

  const removeOrdersByTimeframe = async (currentTimeframe: string) => {
    state.ordersOpened.forEach((order) => {
      if (
        order.timeframe !== currentTimeframe &&
        order.symbol === defaultSymbol
      ) {
        Promise.resolve(removeOrderOpenedById(order.orderId));
        removeOrderFromChartById(order.orderTradingViewId);
      }
    });

    state.ordersPending.forEach((order) => {
      if (
        order.timeframe !== currentTimeframe &&
        order.symbol === defaultSymbol
      ) {
        Promise.resolve(removeOrderPendingById(order.orderId));
        removeOrderFromChartById(order.orderTradingViewId);
      }
    });
  };

  const removeAllOrdersByTimeframe = async () => {
    state.ordersOpened.forEach((order) => {
      Promise.resolve(removeOrderOpenedById(order.orderId));
      removeOrderFromChartById(order.orderTradingViewId);
    });

    state.ordersPending.forEach((order) => {
      Promise.resolve(removeOrderPendingById(order.orderId));
      removeOrderFromChartById(order.orderTradingViewId);
    });
  };

  const addChartOrders = async (orders: Order[], currentTimeframe: string) => {
    // console.log({ orders });
    try {
      await delay(window.tvWidget ? 0 : 5000);

      if (orders.length === 0) {
        removeAllOrdersByTimeframe();
        return;
      }

      if (orders.some((order) => order.binaryOrderType === "OPTION")) {
        removeOrdersByTimeframe(currentTimeframe);
      }

      const groupedOrders = orders.reduce<{
        BULL: { [identifier: string]: Order[] };
        BEAR: { [identifier: string]: Order[] };
      }>(
        (acc, order) => {
          const direction = order.direction.toUpperCase();
          const identifier = `${order.candleStartTime}-${direction}`;

          if (!acc[direction]) acc[direction] = {};
          if (!acc[direction][identifier]) acc[direction][identifier] = [];

          acc[direction][identifier].push(order);

          return acc;
        },
        { BULL: {}, BEAR: {} }
      );

      processOrdersByDirection(groupedOrders.BULL, "BULL");
      processOrdersByDirection(groupedOrders.BEAR, "BEAR");
    } catch (error) {
      console.error("addChartOrders error:", error);
    }
  };

  const checkIfLastBarVisible = async (
    attempts = 0,
    fnCreateOrder?: () => Promise<void>
  ) => {
    const maxAttempts = 10;
    const mainSeries = window.tvWidget.activeChart().getSeries();
    const isVisible = mainSeries && mainSeries.isVisible();

    if (isVisible) {
      if (fnCreateOrder) {
        try {
          await fnCreateOrder();
        } catch (error) {
          setTimeout(
            () => checkIfLastBarVisible(attempts + 1, fnCreateOrder),
            250
          );
        }
      }
      return true;
    } else if (attempts < maxAttempts) {
      setTimeout(() => checkIfLastBarVisible(attempts + 1, fnCreateOrder), 250);
    } else {
      console.error("Não foi possível criar a ordem após várias tentativas.");
    }
  };

  const createOrderPending = async (
    order: Order,
    orderId: string,
    direction: "BULL" | "BEAR",
    index: number
  ) => {
    const separatedBaseUniqueId = orderId.split("-");
    const candleStartTime = separatedBaseUniqueId[2];
    const existOrder = state.ordersPending.find((i) => i.orderId === orderId);

    if (existOrder) {
      const currentTime = Date.now();
      const orderTime = new Date(order.candleStartTime).getTime();
      const timeFrameInMs = {
        M1: 1 * 60 * 1000,
        M5: 5 * 60 * 1000,
        M15: 15 * 60 * 1000,
      }[order.candleTimeFrame];

      const invalidOpenOrder = currentTime - orderTime >= timeFrameInMs;

      if (invalidOpenOrder) {
        removeOrderPendingById(existOrder.orderId);
        removeOrderFromChartById(existOrder.orderTradingViewId);
      }
      return;
    }

    const price = order.cop || order.price;
    const color = "#D89611";

    const label = `$${Math.trunc(order.invest)}`;

    const calloutPoint = calculateCalloutPoint(
      order.candleTimeFrame,
      parseInt(candleStartTime),
      price,
      direction === "BULL",
      true,
      index
    );

    if (!checkIfLastBarVisible()) {
      return;
    }

    const createAndAddOrderPending = async () => {
      const orderShapeId = await createCalloutOrder({
        label,
        color,
        calloutPoint,
      });

      const orderTradingView = window.tvWidget
        .activeChart()
        .getShapeById(orderShapeId);

      addOrderPending({
        orderId,
        order,
        orderTradingView,
        orderTradingViewId: orderShapeId,
        direction,
        timeframe: order.candleTimeFrame,
        candleStartTime: order.candleStartTime,
        totalOrderValue: order.accept ? order.accept : order.invest,
        symbol: order.symbol,
        status: "PENDING",
      });
    };

    try {
      await createAndAddOrderPending();
    } catch (error) {
      console.error(error.message);
      setTimeout(
        async () => await checkIfLastBarVisible(0, createAndAddOrderPending),
        500
      );
    }
  };

  const createOrderOpened = async (
    order: Order,
    orderId: string,
    direction: "BULL" | "BEAR",
    totalOrderValue: number
  ) => {
    const [, , candleStartTime] = orderId.split("-");

    const isBull = direction === "BULL";
    const color = isBull ? "#08C58A" : "#FF025C";
    const price = order.cop || order.price;

    const existOrder = state.ordersOpened.find((i) => i.orderId === orderId);

    if (existOrder) {
      updateOrderOpened({ ...existOrder, totalOrderValue });
      return;
    }

    const calloutPoint = calculateCalloutPoint(
      order.candleTimeFrame,
      parseInt(candleStartTime),
      price,
      isBull,
      false,
      0
    );

    if (!checkIfLastBarVisible()) {
      return;
    }

    const createAndAddOrderOpened = async () => {
      const isNewOptions = order.binaryOrderType === "OPTION";
      const labelRetraction = `$ ${order.price} | $ ${totalOrderValue.toFixed(
        0
      )} | 00:00`;
      const label = `$ ${totalOrderValue.toFixed(0)} | 00:00`;
      const orderShapeId = await createCalloutOrder({
        label: isNewOptions ? label : labelRetraction,
        color,
        calloutPoint,
      });

      const orderTradingView = window.tvWidget
        .activeChart()
        .getShapeById(orderShapeId);

      addOrderOpened({
        orderId,
        order,
        orderTradingView,
        orderTradingViewId: orderShapeId,
        direction,
        timeframe: order.candleTimeFrame,
        candleStartTime: order.candleStartTime,
        totalOrderValue,
        symbol: order.symbol,
        status: "OPEN",
      });

      if (!orderTradingView) {
        await createAndAddOrderOpened();
      }
    };

    if (!checkIfLastBarVisible()) {
      return;
    }

    try {
      await createAndAddOrderOpened();
    } catch (error) {
      console.log(error);
      setTimeout(
        async () => await checkIfLastBarVisible(0, createAndAddOrderOpened),
        500
      );
    }
  };

  const processOrdersByDirection = (
    groupedOrders: { [identifier: string]: Order[] },
    direction: "BULL" | "BEAR"
  ) => {
    Object.entries(groupedOrders).forEach(
      ([identifiers, orders]: [string, Order[]]) => {
        const firstOrder = orders[0];

        const isOpen = firstOrder.status.toUpperCase() === "OPEN";
        const isPending = firstOrder.status.toUpperCase() === "PENDING";

        if (
          (!isOpen && !isPending) ||
          firstOrder.direction.toUpperCase() !== direction
        )
          return;

        const orderType = firstOrder.binaryOrderType;
        const [candleStartTime] = identifiers.split("-");
        const baseUniqueId = `order-${direction}-${candleStartTime}-${orderType}`;

        if (isPending) {
          orders.forEach((order, index) => {
            const orderId = `${baseUniqueId}-PENDING-${order.id}`;

            processOrderSafely(orderId, () =>
              createOrderPending(
                order,
                createPendingOrderId({
                  id: order.id,
                  direction,
                  candleStartTime: Number(candleStartTime),
                  orderType: orderType,
                }),
                direction,
                index
              )
            );
          });
          return;
        }

        if (isOpen) {
          if (firstOrder.binaryOrderType === "OPTION") {
            const orderPendingId = `${baseUniqueId}-PENDING`;
            state.ordersPending
              .filter((i) => i.orderId.includes(orderPendingId))
              .forEach((orderToRemove, i) => {
                removeOrderPendingById(orderToRemove.orderId);
                removeOrderFromChartById(orderToRemove.orderTradingViewId);
              });
          }

          const totalOrderValue = orders.reduce(
            (acc, order) => acc + (order.accept || order.invest),
            0
          );

          createOrderOpened(
            firstOrder,
            createOpenOrderId({
              id: firstOrder.id,
              orderType,
              candleStartTime: Number(candleStartTime),
              direction,
            }),
            direction,
            totalOrderValue
          );
        }
      }
    );
  };

  const calculateNewValue = (
    value: number,
    bull: boolean,
    bb?: BollingerBands,
    timeFrame?: string
  ) => {
    let newValue = value;
    let offset = 0;

    if (timeFrame && bb) {
      offset = bb.maxHeight;
    }
    newValue = bull ? newValue + offset : newValue - offset;

    return newValue;
  };
  const calculateCalloutPoint = (
    timeFrame: string,
    candleStartTime: number,
    price: number,
    isBull: boolean,
    pending: boolean,
    index: number,
    bb?: BollingerBands
  ) => {
    // const priceScale = window.tvWidget.activeChart().getPriceToBarRatio();

    const priceStart = price;
    const priceEnd = calculateNewValue(priceStart, isBull, bb, timeFrame);

    let startTime = pending
      ? convertTimeToCandlePoint(candleStartTime, "subMinutes", 1)
      : candleStartTime;

    let minutes = 0;
    switch (timeFrame) {
      case "M1":
        minutes = pending ? 15 : 15;
        break;
      case "M5":
        minutes = pending ? 5 * 10 : 5 * 10;
        break;
      case "M15":
        minutes = pending ? 15 * 10 : 15 * 10;
        break;
      default:
        break;
    }

    // @TODO
    // Deslocar o endTime para a posição do último candle criado na lista do gráfico
    // Posso pegar o candle pelo Id do último candle inserido no new Set e assim tentar pegar o start time para calcular
    // const timeScale = window.tvWidget.activeChart().getTimeScale();

    const endTime = convertTimeToCandlePoint(
      candleStartTime,
      pending ? "subMinutes" : "addMinutes",
      minutes
    );

    return { startTime, endTime, priceStart, priceEnd };
  };

  const createCalloutOrder = async ({
    color,
    label,
    calloutPoint,
  }: CreateCalloutOrderProps) => {
    const order = await window.tvWidget.activeChart().createMultipointShape(
      [
        {
          time: calloutPoint.startTime,
          price: calloutPoint.priceStart,
        },
        {
          time: calloutPoint.endTime,
          price: calloutPoint.priceEnd,
        },
      ],
      {
        text: label,
        disableUndo: true,
        disableSave: true,
        disableSelection: true,
        filled: true,
        lock: true,
        shape: "callout",
        zOrder: "top",
        showInObjectsTree: true,
        overrides: {
          bold: true,
          fontsize: window.innerWidth <= 768 ? 12 : 14,
          textAlign: "center",
          backgroundColor: color,
          borderwidth: 0,
          bordercolor: "transparent",
          drawBorder: true,
          transparency: 40,
          color: "#FFFFFF",
        },
      }
    );

    return order;
  };

  const updateSymbol = async (symbol: string) => {
    setDefaultSymbol(correctSymbol(symbol));
    const windowActiveChart = await checkTvWidgetChartIsActive();
    if (typeof windowActiveChart !== "undefined") {
      windowActiveChart.resetData();
      windowActiveChart.setSymbol(symbol);
    }
    dispatch({ type: "SET_SELECTED_SYMBOL", payload: correctSymbol(symbol) });
  };

  const setWidget = (tvWidget: IChartingLibraryWidget) => {
    dispatch({ type: "SET_TV_WIDGET", payload: tvWidget });
  };

  const setChartOrders = (chartOrders: ChartOrders[]) => {
    dispatch({ type: "SET_CHART_ORDERS", payload: chartOrders });
  };

  const addEventPending = (event: any) => {
    dispatch({ type: "SET_EVENTS_PENDING", payload: event });
  };

  const removeEventPending = () => {
    dispatch({ type: "REMOVE_EVENTS_PENDING", payload: null });
  };

  const setCandleTime = (timestamp: number) => {
    dispatch({ type: "SET_CANDLE_TIME", payload: timestamp });
  };

  const addOrderPending = (order: OrderItem) => {
    dispatch({ type: "ADD_ORDER_PENDING", payload: order });
  };

  const addOrderOpened = (order: OrderItem) => {
    dispatch({ type: "ADD_ORDER_OPENED", payload: order });
  };

  const updateOrderOpened = (order: OrderItem) => {
    const { ordersOpened } = state;
    const updatedOrdersOpened = ordersOpened.map((o) =>
      o.orderId === order.orderId ? order : o
    );

    dispatch({ type: "UPDATE_ORDER_OPENED", payload: updatedOrdersOpened });
  };

  const removeOrderPendingById = (orderId: string) => {
    dispatch({ type: "REMOVE_ORDER_PENDING_BY_ID", payload: { orderId } });
  };

  const removeOrderOpenedById = (orderId: string) => {
    dispatch({ type: "REMOVE_ORDER_OPENED_BY_ID", payload: { orderId } });
  };

  const removeOrderById = (orderId: string) => {
    dispatch({ type: "REMOVE_ORDER_BY_ID", payload: orderId });
  };

  const closeAllOrders = () => {
    dispatch({ type: "SET_CHART_ORDERS", payload: [] });
  };

  const updateHeaderMenuSymbols = (newSymbols) => {
    setSelectedMenuSymbols(newSymbols);

    dispatch({ type: "SET_HEADER_MENU_SYMBOL", payload: newSymbols });
  };

  const removeChartOrders = (groupedOrders: GroupedOrders[]) => {
    const { chartOrders } = state;

    try {
      if (groupedOrders.length > 0) {
        const orderIdsToRemove = new Set(
          groupedOrders.map((order) => order.id)
        );
        const _chartOrders = chartOrders.filter(
          (order) => !orderIdsToRemove.has(order.id)
        );

        groupedOrders.forEach((orderToRemove) => {
          const chartOrder = chartOrders.find(
            (chartOrder) => chartOrder.id === orderToRemove.id
          );

          if (chartOrder) {
            removeOrderFromChartById(chartOrder.entities[0]);
          }
        });

        setChartOrders(_chartOrders);
      }
    } catch (error) {
      console.log("removeChartOrders error => ", error);
    }
  };

  const removeOrdersBySymbol = async (symbol: string) => {
    const orders = [...state.ordersPending, ...state.ordersOpened];

    const timeframe = (await checkTvWidgetChartIsActive()).resolution();

    orders.forEach((order) => {
      if (order.symbol === symbol && order.timeframe === timeframe) {
        try {
          removeOrderById(order.orderId);
        } catch (error) {
          console.log("removeOrdersBySymbol error => ", error);
        }
      }
    });
  };
  const winLoseChartOrder = async (
    order: WinLoseOrderType,
    status: Order["status"]
  ) => {
    const isWinStatus = status === OrderStatusEnum.WIN;
    const backgroundColor = isWinStatus ? "#08C58A" : "#FF025C";
    const value = formatCurrency(order.value);
    const formattedValue = isWinStatus ? `+U${value}` : `-U${value}`;
    const text = `Resultado \n${formattedValue} `;

    if (order.symbol !== defaultSymbol) return;

    const chartActived = await checkTvWidgetChartIsActive();

    const resolution = chartActived.resolution();

    const lastDailyBar = getLastBar(defaultSymbol, resolution);

    if (!lastDailyBar) {
      console.error("Não foi possível obter o valor de fechamento do candle.");
      return;
    }

    const closePrice = lastDailyBar.close;
    const closeTime = lastDailyBar.time;

    const calloutId = await window.tvWidget.activeChart().createMultipointShape(
      [
        { time: closeTime, price: closePrice },
        { time: closeTime, price: closePrice },
      ],
      {
        shape: "callout",
        text,
        lock: true,
        disableSelection: true,
        disableUndo: true,
        disableSave: true,
        zOrder: "top",
        overrides: {
          bold: true,
          fontsize: window.innerWidth <= 768 ? 12 : 14,
          textAlign: "center",
          backgroundColor,
          borderColor: backgroundColor,
          linewidth: 1,
          borderwidth: 0,
          bordercolor: "transparent",
          drawBorder: true,
          transparency: 20,
          color: "#FFFFFF",
        },
      }
    );

    window.requestAnimationFrame(() => console.log("Gráfico atualizado!"));

    setTimeout(() => {
      removeOrderFromChartById(calloutId);
    }, 3500);
  };

  useEffect(() => {
    const symbol = defaultSymbol || "IDXUSDT";
    updateSymbol(symbol);
    if (symbol === "IDXUSDT") {
      setDefaultSymbol(symbol);
    }

    updateCurrentChartAnalysis(defaultSymbol);
  }, [defaultSymbol]);

  useEffect(() => {
    if (
      selectedMenuSymbols.length &&
      state.headerMenuSymbols.every(
        (menuSymbol) =>
          !!selectedMenuSymbols.some((sym) => sym.id === menuSymbol)
      )
    ) {
      updateHeaderMenuSymbols(selectedMenuSymbols);
    }
  }, [selectedMenuSymbols]);

  return (
    <TradingViewContextV2.Provider
      value={{
        ...state,
        setWidget,
        addChartOrders,
        setChartOrders,
        removeChartOrders,
        winLoseChartOrder,
        removeOrdersByTimeframe,
        setCandleTime,
        addEventPending,
        removeEventPending,
        updateSymbol,
        closeAllOrders,
        removeOrderById,
        removeOrdersBySymbol,
        removeOrderOpenedById,
        removeOrderPendingById,
        removeOrderFromChartById,
        checkTvWidgetChartIsActive,
        updateHeaderMenuSymbols,
        isOpenToolbar,
        updateIsOpenToolbar,
      }}
    >
      {children}
    </TradingViewContextV2.Provider>
  );
};

TradingViewProviderV2.propTypes = {
  children: PropTypes.node.isRequired,
};

export const TradingViewConsumer = TradingViewContextV2.Consumer;

export default TradingViewContextV2;
