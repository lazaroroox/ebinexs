import { orderBy } from "lodash";
import {
  createContext,
  FC,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from "react";
import { FaBolt } from "react-icons/fa";
import { VscError } from "react-icons/vsc";
import { useNavigate } from "react-router";
import orderLoseSound from "src/assets/audio/notifications/bottle-205353.mp3";
import orderWinSound from "src/assets/audio/notifications/new-notification-7-210334.mp3";
import { getBrokerNowTime } from "src/components/TVChartContainer/datafeed";
import LayoutContext from "src/contexts/LayoutContext";
import SettingsContext from "src/contexts/SettingsContext";
import CountdownContextV2 from "src/contexts/v2/CountdownContext";
import TradingViewContextV2 from "src/contexts/v2/TradingViewContext";
import { apiPost } from "src/services/apiService";
import useUser from "src/swr/use-user";
import { Candle, Ticker, VolumeBook } from "src/types/candle";
import { RequestPix } from "src/types/deposit";
import { Order } from "src/types/order";
import { User } from "src/types/user";
import formatCurrency from "src/utils/formatCurrency";
import { getUpdatedTimestamp } from "src/utils/getUpdatedTimestamp";
import { isValidOrder } from "src/utils/isValidOrder";
import { notifyError, notifySuccess } from "src/utils/toast";
import useSound from "use-sound";
import { useLocalStorage } from "usehooks-ts";

export type IOperationMode = "RETRACTION_ENDTIME" | "OPTION";

export type ChangeOperationModeAction = {
  type: "CHANGE_OPERATION_MODE";
  payload: {
    operationMode: IOperationMode;
  };
};

export type ChangeTimeframeAction = {
  type: "CHANGE_TIMEFRAME";
  payload: {
    selectedCandle: string;
  };
};

export type ChangeTimeAction = {
  type: "CHANGE_DATATIME";
  payload: {
    selectedDatatime: any;
  };
};

export type UpdateCandlesAction = {
  type: "UPDATE_CANDLES";
  payload: {
    candles: Candle[];
  };
};

export type UpdateUserBalanceAction = {
  type: "UPDATE_USER_BALANCE";
  payload: {
    userBalance: number;
  };
};

export type UpdateLiveOperationsAction = {
  type: "UPDATE_USER_LIVE_OPERATIONS";
  payload: {
    userLiveOperations: { [key: string]: Order };
  };
};

export type RemoveLiveOperationsOrder = {
  type: "REMOVE_LIVE_OPERATIONS_ORDER";
  payload: {
    orderId: string;
  };
};

export type UpdateUserOrdersAction = {
  type: "UPDATE_USER_ORDERS";
  payload: {
    userOrders: Order[];
  };
};

export type UpdateChartOrdersAction = {
  type: "UPDATE_CHART_ORDERS";
  payload: {
    chartOrders: any[];
  };
};

export type UpdateTickerBookAction = {
  type: "UPDATE_TICKERBOOK_ACTION";
  payload: {
    candleTimeFrame: string;
    ticker: Ticker;
  };
};

export type UpdateServerTimeAction = {
  type: "UPDATE_SERVER_TIME";
  payload: {
    serverTime: number;
  };
};

export type UpdateUserBookAction = {
  type: "UPDATE_USER_BOOK";
};

export type SetOrderValueAction = {
  type: "SET_ORDER_VALUE";
  payload: {
    orderValue: number;
  };
};

export type SetFeeAction = {
  type: "SET_PAYOUT";
  payload: {
    payout: number;
  };
};

export type Action =
  | ChangeOperationModeAction
  | ChangeTimeframeAction
  | ChangeTimeAction
  | UpdateCandlesAction
  | UpdateUserBalanceAction
  | UpdateTickerBookAction
  | UpdateUserBookAction
  | UpdateServerTimeAction
  | UpdateLiveOperationsAction
  | RemoveLiveOperationsOrder
  | UpdateUserOrdersAction
  | UpdateChartOrdersAction
  | SetOrderValueAction
  | SetFeeAction;

interface State {
  user: User;
  operationMode: IOperationMode;
  selectedCandle: string | "M1"; // Default timeframe
  selectedDatatime: number;
  orderValue: number;
  candles: Candle[];
  userBalance: number;
  userLiveOperations: { [key: string]: Order };
  userOrders: Order[];
  chartOrders: any[];
  volumeBook: VolumeBook;
  tickerBook: { candleTimeFrame: string; ticker: Ticker }[];
  serverTime: number;
  payout: number;
}

interface ApiProviderV2Props {
  children: ReactNode;
}

const handlers: Record<string, (state: State, action: Action) => State> = {
  CHANGE_OPERATION_MODE: (
    state: State,
    action: ChangeOperationModeAction
  ): State => {
    const { operationMode } = action.payload;
    return {
      ...state,
      operationMode,
    };
  },

  CHANGE_TIMEFRAME: (state: State, action: ChangeTimeframeAction): State => {
    const { selectedCandle } = action.payload;
    return {
      ...state,
      selectedCandle,
    };
  },

  CHANGE_DATATIME: (state: State, action: ChangeTimeAction): State => {
    const { selectedDatatime } = action.payload;
    return {
      ...state,
      selectedDatatime,
    };
  },

  UPDATE_CANDLES: (state: State, action: UpdateCandlesAction): State => {
    const { candles } = action.payload;
    return {
      ...state,
      candles,
    };
  },

  UPDATE_USER_BALANCE: (
    state: State,
    action: UpdateUserBalanceAction
  ): State => {
    const { userBalance } = action.payload;
    return {
      ...state,
      userBalance,
    };
  },

  UPDATE_USER_ORDERS: (state: State, action: UpdateUserOrdersAction): State => {
    const { userOrders } = action.payload;

    return {
      ...state,
      userOrders,
    };
  },

  UPDATE_USER_LIVE_OPERATIONS: (
    state: State,
    action: UpdateLiveOperationsAction
  ): State => {
    const { userLiveOperations } = action.payload;

    return {
      ...state,
      userLiveOperations,
    };
  },

  REMOVE_LIVE_OPERATIONS_ORDER: (
    state: State,
    action: RemoveLiveOperationsOrder
  ): State => {
    const { orderId } = action.payload;
    const newOrders = { ...state.userLiveOperations };
    delete newOrders[orderId];
    return {
      ...state,
      userLiveOperations: newOrders,
    };
  },

  UPDATE_CHART_ORDERS: (
    state: State,
    action: UpdateChartOrdersAction
  ): State => {
    const { chartOrders } = action.payload;
    return {
      ...state,
      chartOrders,
    };
  },

  UPDATE_TICKERBOOK_ACTION: (
    state: State,
    action: UpdateTickerBookAction
  ): State => {
    const { candleTimeFrame, ticker } = action.payload;
    let tickerBookRemovingCurrentTimeFrame: any[] = state.tickerBook?.filter(
      (it) => it.candleTimeFrame !== candleTimeFrame
    );
    if (!tickerBookRemovingCurrentTimeFrame) {
      tickerBookRemovingCurrentTimeFrame = [];
    }
    return {
      ...state,
      tickerBook: [
        ...tickerBookRemovingCurrentTimeFrame,
        { candleTimeFrame, ticker },
      ],
    };
  },

  UPDATE_SERVER_TIME: (
    state: State,
    action: UpdateServerTimeAction
  ): State => ({
    ...state,
    serverTime: action.payload.serverTime,
  }),

  SET_ORDER_VALUE: (state: State, action: SetOrderValueAction): State => ({
    ...state,
    orderValue: action.payload.orderValue,
  }),
  SET_PAYOUT: (state: State, action: SetFeeAction): State => ({
    ...state,
    payout: action.payload.payout,
  }),
};

const reducer = (state: State, action: Action): State =>
  handlers[action.type] ? handlers[action.type](state, action) : state;

const extractCandleTimeFrameFromPayload = (data) =>
  data.payload.candleTimeFrame;

const initialState: State = {
  user: null,
  operationMode:
    (JSON.parse(
      localStorage.getItem("defaultOperationMode")
    ) as IOperationMode) || "OPTION",
  selectedCandle: "M1",
  selectedDatatime: getUpdatedTimestamp(new Date(getBrokerNowTime()), 1),
  orderValue: 1,
  candles: [],
  userBalance: 0,
  userLiveOperations: {},
  userOrders: [],
  chartOrders: [],
  volumeBook: null,
  tickerBook: null,
  serverTime: null,
  payout: 90,
  // tickerBook: [],
  // ticker: []
};

interface ApiContextValue extends State {
  updateTimeframe: (timeframe: string) => Promise<void>;
  updateDatatime: (timestamp: any) => Promise<void>;
  updateCandles: (candles: Candle[]) => Promise<void>;
  updateUserBalance: (balance: number) => Promise<void>;
  updateUserOrders: (orders: Order[]) => Promise<void>;
  updateUserLiveOperations: (
    orders: Order[],
    addOrdersToChart?: boolean
  ) => Promise<void>;
  addUserLiveOperatons: (order: Order) => Promise<void>;
  updateTickerBook: (candleTimeFrame: string, ticker: Ticker) => Promise<void>;
  getSelectedTickerBook: () => Ticker;
  updateServerTime: (serverTime: number) => void;
  updateOperationMode: (operationModeName: IOperationMode) => void;
  handleBalanceEvent: (data: any) => void;
  handleUserOrdersEvent: (data: any, addOrders?: boolean) => void;
  handleTicker: (data: any) => void;
  handleCandleClose: (data: any) => void;
  handleWinLose: (data: any, isCurrentChart?: boolean) => void;
  handleServerTime: (data: any) => void;
  handleRequestPix: (
    requestPix: RequestPix,
    needSpotAccountId?: boolean
  ) => Promise<void>;
  setOrderValue: (orderValue: number) => void;
  handleSingleUserOrder: (data: any) => void;
  handleRemoveLiveOperationsOrder: (orderId: string) => void;
  updatePayout: (payout: number) => void;
}

const ApiContext = createContext<ApiContextValue>({
  ...initialState,
  updateTimeframe: () => Promise.resolve(),
  updateDatatime: () => Promise.resolve(),
  updateCandles: () => Promise.resolve(),
  updateUserBalance: () => Promise.resolve(),
  updateUserOrders: () => Promise.resolve(),
  updateUserLiveOperations: () => Promise.resolve(),
  addUserLiveOperatons: () => Promise.resolve(),
  updateTickerBook: () => Promise.resolve(),
  // updateUserBook: () => Promise.resolve(),
  updateOperationMode: () => null,
  getSelectedTickerBook: () => null,
  updateServerTime: () => null,
  handleBalanceEvent: () => null,
  handleUserOrdersEvent: () => null,
  handleTicker: () => null,
  handleCandleClose: () => null,
  handleWinLose: () => null,
  handleServerTime: () => null,
  handleRequestPix: () => null,
  setOrderValue: () => null,
  handleSingleUserOrder: () => null,
  handleRemoveLiveOperationsOrder: () => null,
  updatePayout: () => null,
});

export const ApiProviderV2: FC<{ children: ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const [playOrderWin] = useSound(orderWinSound);
  const [playOrderLose] = useSound(orderLoseSound);

  const [state, dispatch] = useReducer(reducer, initialState);

  const { syncServerTimeWithNowDate } = useContext(CountdownContextV2);

  const { addChartOrders, winLoseChartOrder } =
    useContext(TradingViewContextV2);
  const { setModalRequireDocumentValidate, handleChartLoadingState } =
    useContext(LayoutContext);
  const { settings } = useContext(SettingsContext);
  const [defaultOperationMode, setDefaultOperationMode] = useLocalStorage(
    "defaultOperationMode",
    "OPTION"
  );
  const [defaultCandleTimeFrame, setDefaultCandleTimeFrame] = useLocalStorage(
    "defaultCandleTimeFrame",
    "M1"
  );

  const [defaultSymbol] = useLocalStorage("defaultSymbol", "IDXUSDT");

  const { user } = useUser();

  let logTimeoutId;

  const updateOperationMode = (operationModeName: IOperationMode): void => {
    setDefaultOperationMode(operationModeName);
    dispatch({
      type: "CHANGE_OPERATION_MODE",
      payload: {
        operationMode: operationModeName,
      },
    });
  };

  const updateTimeframe = async (timeframe: string): Promise<void> => {
    setDefaultCandleTimeFrame(timeframe);
    dispatch({
      type: "CHANGE_TIMEFRAME",
      payload: {
        selectedCandle: timeframe,
      },
    });
  };

  const updateDatatime = async (timestamp: number): Promise<void> => {
    dispatch({
      type: "CHANGE_DATATIME",
      payload: {
        selectedDatatime: timestamp,
      },
    });
  };

  const updateCandles = async (candles: Candle[]): Promise<void> => {
    dispatch({
      type: "UPDATE_CANDLES",
      payload: {
        candles,
      },
    });
  };

  const updateUserBalance = async (balance: number): Promise<void> => {
    dispatch({
      type: "UPDATE_USER_BALANCE",
      payload: {
        userBalance: balance,
      },
    });
  };

  const updateTickerBook = async (
    candleTimeFrame: string,
    ticker: Ticker
  ): Promise<void> => {
    dispatch({
      type: "UPDATE_TICKERBOOK_ACTION",
      payload: {
        candleTimeFrame,
        ticker,
      },
    });
  };

  const updateServerTime = (serverTime) => {
    dispatch({
      type: "UPDATE_SERVER_TIME",
      payload: {
        serverTime,
      },
    });
  };

  const updateUserBook = async (): Promise<void> => {
    dispatch({
      type: "UPDATE_USER_BOOK",
    });
  };

  const getSelectedTickerBook = (): Ticker => {
    const selectedTicker = state.tickerBook?.find(
      (it) => it.candleTimeFrame === state.selectedCandle
    );
    if (selectedTicker !== undefined) {
      return selectedTicker.ticker;
    }
    return {
      volume: {
        green: 0,
        red: 0,
      },
      book: {
        green: 0,
        red: 0,
        volume: 0,
      },
    };
  };

  const handleBalanceEvent = (data) => {
    const balanceEvent = "user_balance";
    if (data.event === balanceEvent) {
      updateUserBalance(data.payload.usdt);
    }

    const ordersEvent = "user_orders";
    if (data.event === ordersEvent) {
      updateUserBook();
    }
  };

  const handleUserOrdersEvent = async (data, addOrders = true) => {
    const ordersEvent = "user_orders";

    if (data.event === ordersEvent) {
      const filtersInvalidOrders = (orders) =>
        orders.filter(
          (order) => !isValidOrder(order, syncServerTimeWithNowDate)
        );

      const invalidOpenOrders = filtersInvalidOrders(data.payload.open);

      const invalidPendingOrders = filtersInvalidOrders(data.payload.pending);

      // Se houver ordens inválidas, configurar um timeout para registrar o log
      if (invalidOpenOrders.length > 0 || invalidPendingOrders.length > 0) {
        logTimeoutId = setTimeout(() => {
          console.warn(
            "Received invalid orders that should have been finalized:",
            {
              invalidOpenOrders,
              invalidPendingOrders,
            }
          );
        }, 5000); // Aguardar 5 segundos antes de registrar o log
      }

      const filterValidOrders = (orders) =>
        orders.filter((order) =>
          isValidOrder(order, syncServerTimeWithNowDate)
        );

      const validOpenOrders = filterValidOrders(data.payload.open);
      const validPendingOrders = filterValidOrders(data.payload.pending);

      if (
        (validOpenOrders.length > 0 || validPendingOrders.length > 0) &&
        logTimeoutId
      ) {
        clearTimeout(logTimeoutId);
        logTimeoutId = null;
      }

      const ordersPendingAndOpen = orderBy(
        validPendingOrders.concat(validOpenOrders),
        [(item) => new Date(item.createdAt)],
        ["asc"]
      );

      await updateUserLiveOperations(ordersPendingAndOpen, addOrders);
    }
  };

  const updateUserLiveOperations = async (
    orders: Order[],
    addOrdersToChart = true
  ): Promise<void> => {
    let ordersForTheChart = orders.reduce((acc, o) => {
      if (acc.some((order) => order.id === o.id)) {
        return acc;
      }

      if (o.binaryOrderType === "OPTION") {
        if (
          o.symbol === defaultSymbol &&
          o.candleTimeFrame === defaultCandleTimeFrame
        ) {
          acc.push(o);
        }
      } else if (o.symbol === defaultSymbol) {
        acc.push(o);
      }

      return acc;
    }, [] as Order[]);

    // if (ordersForTheChart.every((newOrders) => !!state.userLiveOperations[newOrders.id])) {
    //   return;
    // }

    if (addOrdersToChart) {
      const validOrders = ordersForTheChart.filter((order) =>
        isValidOrder(order, syncServerTimeWithNowDate) && (!state.userLiveOperations[order.id] || state.userLiveOperations[order.id].status !== order.status)
      );

      const updatedUserLiveOperations = ordersForTheChart.reduce(
        (acc, order) => {
          acc = state.userLiveOperations;
          const ordersEntries = Object.entries(state.userLiveOperations);

          ordersEntries.forEach(([id, savedOrder]) => {
            if (
              order.binaryOrderType === "OPTION" &&
              savedOrder.candleTimeFrame !== state.selectedCandle
            ) {
              delete acc[id];
            }
          });

          if (
            order.binaryOrderType === "OPTION" &&
            order.candleTimeFrame === state.selectedCandle
          ) {
            acc[order.id] = order;
          }

          if (order.binaryOrderType === "RETRACTION_ENDTIME") {
            acc[order.id] = order;
          }
          return acc;
        },
        {}
      );

      await addChartOrders(validOrders, defaultCandleTimeFrame);

      dispatch({
        type: "UPDATE_USER_LIVE_OPERATIONS",
        payload: {
          userLiveOperations: updatedUserLiveOperations,
        },
      });

      setTimeout(() => {
        handleChartLoadingState(false);
      }, 500);
    } else {
      setTimeout(() => {
        handleChartLoadingState(false);
      }, 300);
      dispatch({
        type: "UPDATE_USER_LIVE_OPERATIONS",
        payload: {
          userLiveOperations: {},
        },
      });
    }
  };

  const addUserLiveOperatons = async (order: Order): Promise<void> => {
    const orders = state.userLiveOperations;
    orders[order.id] = order;

    const ordersOrdered = orderBy(
      Object.values(orders),
      [(item) => new Date(item.createdAt)],
      ["asc"]
    );

    await updateUserLiveOperations(ordersOrdered);
  };

  const handleRemoveLiveOperationsOrder = (orderId: string) => {
    dispatch({
      type: "REMOVE_LIVE_OPERATIONS_ORDER",
      payload: {
        orderId,
      },
    });
  };

  const updateUserOrders = async (orders: Order[]): Promise<void> => {
    dispatch({
      type: "UPDATE_USER_ORDERS",
      payload: {
        userOrders: orders,
      },
    });
  };

  const handleTicker = (data) => {
    if (
      data.event === "ticker" &&
      state.selectedCandle === extractCandleTimeFrameFromPayload(data)
    ) {
      const tickerData = data.payload;
      updateTickerBook(state.selectedCandle, {
        volume: {
          green: tickerData.volume.green24,
          red: tickerData.volume.red24,
          volume: tickerData.volume.volume24,
        },
        book: {
          green: tickerData.book.green,
          red: tickerData.book.red,
        },
      });
    }
  };

  const handleCandleClose = (data) => {
    if (data.event.startsWith("candle_close")) {
      const candleNumber = extractCandleTimeFrameFromPayload(data);

      if (candleNumber === state.selectedCandle) {
        if (state.tickerBook) {
          const tickerbook = state.tickerBook.filter(
            (it) => it.candleTimeFrame === candleNumber
          )?.[0];

          updateTickerBook(state.selectedCandle, {
            volume: {
              green: tickerbook?.ticker.volume.green || 0,
              red: tickerbook?.ticker.volume.red || 0,
              volume: tickerbook?.ticker.volume.volume || 0,
            },
            book: {
              green: 0,
              red: 0,
            },
          });
        }
      }
    }
  };

  const handleWinLose = (data, isCurrentChart?: boolean) => {
    const loseOrderEvent = `lose_order`;
    const winOrderEvent = `win_order`;
    const { value, ordersIds } = data.payload;

    const removeOrderFromLiveOperations = (orderIds) => {
      const ordersIdsSet = new Set(orderIds);
      const newOrders = Object.fromEntries(
        Object.entries(state.userLiveOperations).filter(
          ([key]) => !ordersIdsSet.has(key)
        )
      );

      dispatch({
        type: "UPDATE_USER_LIVE_OPERATIONS",
        payload: {
          userLiveOperations: newOrders,
        },
      });
    };

    const handleOrderResult = (result, type) => {
      const textResult = `Resultado: ${
        type === "win" ? "Lucro +" : "Perda -"
      } ${formatCurrency(value)}`;

      winLoseChartOrder(result, type);

      type === "win"
        ? notifySuccess(
            textResult,
            undefined,
            <FaBolt color="#00B474" size={20} />
          )
        : notifyError(
            textResult,
            undefined,
            <VscError color="#FF025C" size={23} />
          );

      if (settings.isSoundOn) {
        type === "win" ? playOrderWin() : playOrderLose();
      }

      if (isCurrentChart) {
        removeOrderFromLiveOperations(ordersIds);
      }
    };

    if (data.event === loseOrderEvent) {
      handleOrderResult(data.payload, "lose");
    }

    if (data.event === winOrderEvent) {
      handleOrderResult(data.payload, "win");
    }
  };

  const handleServerTime = (data) => {
    const event = "server_time";
    if (data.event === event) {
      updateServerTime(data.payload.serverNowDate);
    }
  };

  const handleSingleUserOrder = async (data) => {
    const order = data.payload;
    if (["WIN", "LOSE"].includes(order.status)) return;

    const orders = { ...state.userLiveOperations };

    console.log("Context", { order });

    if (order.status === "REFUNDED") {
      delete orders[order.id];
    } else {
      orders[order.id] = order;
    }

    const ordersOrdered = orderBy(
      Object.values(orders),
      [(item) => new Date(item.createdAt)],
      ["asc"]
    );

    await updateUserLiveOperations(ordersOrdered);
  };

  const handleRequestPix = async (
    requestPix: RequestPix,
    needSpotAccountId?: boolean
  ) => {
    try {
      const cpf = requestPix.cpf.replace(/\D/g, "");

      const amount = requestPix.brl;

      delete requestPix.usdt;
      delete requestPix.brl;

      const data = await apiPost(
        "bank/deposits/nox/pix",
        {
          ...requestPix,
          amount,
          cpf,
        },
        undefined,
        needSpotAccountId
      );

      navigate(
        `/dashboard/profile/deposit?depositId=${data.id}&gatewayTransactionType=pix`
      );
    } catch (error) {
      console.log("error", error);
      if (error === "UserMustBeVerifiedBeforeAskingForDepositException") {
        setModalRequireDocumentValidate(true);
      }
    }
  };

  const setOrderValue = (orderValue: number) => {
    dispatch({
      type: "SET_ORDER_VALUE",
      payload: {
        orderValue,
      },
    });
  };

  const updatePayout = (payout: number) => {
    dispatch({
      type: "SET_PAYOUT",
      payload: {
        payout,
      },
    });
  };

  const memoizedUpdateTimeframe = useCallback(() => {
    updateTimeframe(defaultCandleTimeFrame);
  }, [defaultCandleTimeFrame]);

  const memoizedUpdateOperationMode = useCallback(() => {
    updateOperationMode(defaultOperationMode as IOperationMode);
  }, [defaultOperationMode]);

  useEffect(() => {
    memoizedUpdateTimeframe();
    memoizedUpdateOperationMode();
  }, [memoizedUpdateTimeframe, memoizedUpdateOperationMode]);

  return (
    <ApiContext.Provider
      value={{
        ...state,
        user,
        updateOperationMode,
        updateTimeframe,
        updateDatatime,
        updateCandles,
        updateUserBalance,
        updateTickerBook,
        updateUserOrders,
        updateUserLiveOperations,
        addUserLiveOperatons,
        getSelectedTickerBook,
        updateServerTime,
        handleBalanceEvent,
        handleUserOrdersEvent,
        handleTicker,
        handleCandleClose,
        handleWinLose,
        handleServerTime,
        handleRequestPix,
        setOrderValue,
        handleSingleUserOrder,
        handleRemoveLiveOperationsOrder,
        updatePayout,
      }}
    >
      {children}
    </ApiContext.Provider>
  );
};

export default ApiContext;
