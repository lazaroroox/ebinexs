import { Box, useMediaQuery, useTheme } from "@mui/material";
import { FC, useCallback, useContext, useEffect, useState } from "react";

import CountdownContextV2 from "src/contexts/v2/CountdownContext";
import useParameters from "src/swr/use-parameters";
import useSound from "use-sound";

import { useStompClient } from "react-stomp-hooks";

import { Stack } from "@mui/system";
import orderClick from "src/assets/audio/notifications/mixkit-cool-interface-click-tone-2568.wav";
import {
  EntityId,
  ILineDataSourceApi,
} from "src/charting_library/charting_library";
import { PlaceOrderPayout } from "src/components/trade/forms/PlaceOrderPayout";
import { getLastBar } from "src/components/TVChartContainerV2/streaming";
import AccountContext from "src/contexts/AccountContext";
import TradingViewContextV2 from "src/contexts/v2/TradingViewContext";
import useApiData from "src/hooks/useApiData";
import useOrderBook from "src/hooks/useOrderBook";
import useAvailableSymbols from "src/swr/use-available-symbols";
import { CandleBucket } from "src/types/candle";
import { getResulteOnLive } from "src/utils/getResultOnLine";
import { isValidOrder } from "src/utils/isValidOrder";
import { separateSymbolAndMode } from "src/utils/separateSymbolAndMode";
import { useLocalStorage } from "usehooks-ts";
import MarketClosedCard from "./MarketClosedCard";
import { PlaceOrderButtons } from "./PlaceOrderButtons";
import { PlaceOrderTime } from "./PlaceOrderTime";

const modesOrder = ["OPTION", "RETRACTION_ENDTIME"];

const PlaceOrderForm: FC = () => {
  const stompClient = useStompClient();

  const { parameters, mutate } = useParameters();
  let localStorageAmount = localStorage.getItem("localStorageAmount");
  const [amount, setAmount] = useState<string>(
    localStorageAmount ? localStorageAmount : "1"
  );
  const [balance, setBalance] = useState(0);
  const [playOrderClick] = useSound(orderClick);
  const { bookRed, bookGreen } = useOrderBook();
  const [purchase, setPurchase] = useState(0);
  const [sale, setSale] = useState(0);
  const [afterFirstRender, setAfterFirstRender] = useState(false);

  const [defaultCandleTimeFrame] = useLocalStorage(
    "defaultCandleTimeFrame",
    "M1"
  );

  const {
    payout,
    user,
    operationMode,
    updateOperationMode,
    selectedCandle,
    selectedDatatime,
    userBalance,
    setOrderValue,
    handleUserOrdersEvent,
    handleRemoveLiveOperationsOrder,
    userLiveOperations,
    updatePayout,
  } = useApiData();
  const { activeAccount } = useContext(AccountContext);

  const {
    tvWidget,
    selectedSymbol,
    ordersOpened,
    ordersPending,
    removeOrderOpenedById,
    updateSymbol,
    checkTvWidgetChartIsActive,
    updateHeaderMenuSymbols,
    headerMenuSymbols,
  } = useContext(TradingViewContextV2);
  const {
    countValue,
    timeFormat,
    setSelectedTimeFrame,
    syncServerTimeWithNowDate,
  } = useContext(CountdownContextV2);

  const resolution = selectedCandle.replace("M", "");
  const lastBar = getLastBar(selectedSymbol, resolution);
  const { symbols, selectedSymbolData } = useAvailableSymbols();

  const [candleBuckets, setCandleBuckets] = useState<CandleBucket[] | null>(
    null
  );
  const [activeMinute, setActiveMinute] = useState<CandleBucket | null>(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const isFeatureTest = true;

  useEffect(() => {
    if (user && !isFeatureTest) {
      updateOperationMode("OPTION");
    }
  }, [user, isFeatureTest]);

  useEffect(() => {
    if (ordersOpened.length > 0 || ordersPending.length > 0) {
      // Atualizar apenas as ordens abertas
      ordersOpened.forEach((order) => {
        const invalidOpenOrder = !isValidOrder(
          order.order,
          syncServerTimeWithNowDate
        );

        if (invalidOpenOrder) {
          if (order.orderTradingView) {
            removeTradingviewOrder(
              order.orderId,
              order.orderTradingViewId,
              order.symbol
            );
          }
        } else {
          updateOrderResultOpened({
            order: order.order,
            orderTradingView: order.orderTradingView,
            totalOrderValue: order.totalOrderValue,
          });
        }
      });

      // Atualizar apenas as ordens pendentes
      ordersPending.forEach((order) => {
        const invalidPendingOrder = !isValidOrder(
          order.order,
          syncServerTimeWithNowDate
        );

        if (invalidPendingOrder) {
          if (order.orderTradingView) {
            removeTradingviewOrder(
              order.orderId,
              order.orderTradingViewId,
              order.symbol
            );
          }
        } else {
          updateOrderResultOpened({
            order: order.order,
            orderTradingView: order.orderTradingView,
            totalOrderValue: order.order.accept,
            isPending: true,
          });
        }
      });
    }
  }, [timeFormat, ordersOpened, ordersPending, parameters]);

  useEffect(() => {
    Object.keys(userLiveOperations).forEach((key) => {
      const order = userLiveOperations[key];
      const invalidPendingOrder = !isValidOrder(
        order,
        syncServerTimeWithNowDate
      );
      if (invalidPendingOrder) {
        handleRemoveLiveOperationsOrder(key);
      }
    });
  }, [timeFormat, userLiveOperations]);

  // Função de atualização otimizada
  const updateOrderResultOpened = useCallback(
    ({
      order,
      orderTradingView,
      totalOrderValue = 0,
      isPending = false,
    }: {
      order: any;
      orderTradingView: ILineDataSourceApi;
      totalOrderValue: number;
      isPending?: boolean;
    }) => {
      // Cálculo centralizado de estimateIncome
      const isNewOptions = order.binaryOrderType === "OPTION";
      const amount = totalOrderValue || 0;
      let estimateIncome = parseFloat((amount * (payout / 100)).toFixed(3));

      // Obter as cores e o símbolo baseado no resultado da função getResulteOnLive
      const { color, simbol } = getResulteOnLive({
        order,
        payout,
        lastDailyBar: lastBar,
      });

      // Formatação do resultado
      const numericResult = estimateIncome.toFixed(2);

      const orderProperties = orderTradingView.getProperties();

      // Adicionar try-catch para proteger contra tentativas de acessar um orderTradingView removido
      try {
        // Verificar se `orderTradingView` ainda existe antes de tentar acessá-lo
        if (
          orderProperties &&
          typeof orderTradingView.setProperties === "function"
        ) {
          const orderPropertyText = orderProperties.text;

          const newTimeFormat = isNewOptions
            ? timeFormat
            : calculateCountdown(order.candleEndTime);

          const [price] = orderPropertyText.split(" | ");

          let newText: string = "";

          if (isPending) {
            newText = `${price} | ${newTimeFormat}`;
          } else {
            const cleanedIncomeOrder = numericResult
              .replace(/[+\-$]/g, "")
              ?.trim();
            const cleanedPriceOrder = String(totalOrderValue)
              .replace(/[+\-$]/g, "")
              .trim();

            if (isNewOptions) {
              switch (simbol) {
                case "+": {
                  newText = `${simbol} $${cleanedIncomeOrder} | ${newTimeFormat}`;
                  break;
                }
                case "-": {
                  newText = `${simbol} $${cleanedPriceOrder} | ${newTimeFormat}`;
                  break;
                }
                default:
                  break;
              }
            }

            if (!isNewOptions) {
              const cleanedOrderPrice = order.price.toFixed(2);
              switch (simbol) {
                case "+": {
                  newText = `$ ${cleanedOrderPrice} | ${simbol} $${cleanedIncomeOrder} | ${newTimeFormat}`;
                  break;
                }
                case "-": {
                  newText = `$ ${cleanedOrderPrice} | ${simbol} $${cleanedPriceOrder} | ${newTimeFormat}`;
                  break;
                }
                default:
                  break;
              }
            }
          }

          if (!!newText.length && orderPropertyText !== newText.trim()) {
            orderTradingView.setProperties({
              text: newText,
              ...(orderProperties.backgroundColor !== color && {
                overrides: {
                  backgroundColor: color,
                  borderColor: color,
                },
              }),
            });
          }
        }
      } catch (error) {
        console.error("Erro ao atualizar a ordem:", error);
      }
    },
    [timeFormat, selectedSymbolData, payout]
  );

  const calculateCountdown = (timestamp: number): string => {
    const now = syncServerTimeWithNowDate();
    const distance = timestamp - now;

    if (distance < 0) {
      return "Ordem finalizada";
    } else {
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);
      return `${minutes.toString().padStart(2, "0")}:${seconds
        .toString()
        .padStart(2, "0")}`;
    }
  };

  const removeTradingviewOrder = async (
    orderId: string,
    orderTradingViewId: EntityId,
    orderSymbol?: string
  ) => {
    try {
      const chartActived = await checkTvWidgetChartIsActive();
      const currentSymbol = chartActived.symbol();

      if (currentSymbol === orderSymbol) {
        chartActived.removeEntity(orderTradingViewId);
      }
      removeOrderOpenedById(orderId);
    } catch (error) {
      console.error("Erro ao remover a ordem:", error);
    }
  };

  useEffect(() => {
    setBalance(userBalance);
  }, [setBalance, setAmount, userBalance]);

  useEffect(() => {
    const totalPurchase = bookGreen.reduce((acc, curr) => acc + curr.invest, 0);
    const totalSale = bookRed.reduce((acc, curr) => acc + curr.invest, 0);

    if (totalPurchase || totalSale) {
      const totalInvest = totalPurchase + totalSale;

      const purchasePercent = (totalPurchase / totalInvest) * 100;
      const salePercent = (totalSale / totalInvest) * 100;

      setPurchase(purchasePercent);
      setSale(salePercent);
    } else {
      setPurchase(50);
      setSale(50);
    }
  }, [bookGreen, bookRed]);

  function pickNext(
    symbols: any[],
    currentSymbol: string,
    currentMode: string
  ) {
    const storedSymbolSet = new Set((headerMenuSymbols || []).map((s) => s));
    const n = symbols.length;
    const idx = symbols.findIndex((s) => s.symbol === currentSymbol);
    const start = idx >= 0 ? (idx + 1) % n : 0;

    const modesToCheck = [
      currentMode,
      ...modesOrder.filter((m) => m !== currentMode),
    ];

    const findSymbol = (mode: string, filterStored: boolean) => {
      for (let i = 0; i < n; i++) {
        const coin = symbols[(start + i) % n];
        const cfg = coin.configModes[mode];

        if (
          coin.marketStatus === "OPEN" &&
          cfg?.status === "ACTIVE" &&
          (!filterStored || storedSymbolSet.has(coin.symbol))
        ) {
          return {
            ...coin,
            mode,
          };
        }
      }
      return null;
    };

    let result = findSymbol(currentMode, true);
    if (result) return result;

    result = findSymbol(currentMode, false);
    if (result) return result;

    for (const mode of modesToCheck.slice(1)) {
      result = findSymbol(mode, true);
      if (result) return result;
    }

    for (const mode of modesToCheck.slice(1)) {
      result = findSymbol(mode, false);
      if (result) return result;
    }

    return null;
  }

  const updateMenuSymbols = (newSymbolToAdd: string) => {
    let updatedHeaderMenuSymbols = headerMenuSymbols.filter((menuSym) => {
      const verifySelectedSymbol =
        menuSym !== `${selectedSymbol}-${operationMode}`;
      const { menuOperationMode, menuSymbol } = separateSymbolAndMode(menuSym);
      const isActiveMode = symbols.some(
        (symbol) =>
          symbol.symbol === menuSymbol &&
          symbol.configModes[menuOperationMode].status === "ACTIVE"
      );

      return verifySelectedSymbol && isActiveMode;
    });

    if (!updatedHeaderMenuSymbols.some((sym) => sym === newSymbolToAdd)) {
      updatedHeaderMenuSymbols.push(newSymbolToAdd);
    }

    return updatedHeaderMenuSymbols;
  };

  useEffect(() => {
    if (!selectedSymbol || symbols.length === 0) {
      return;
    }

    let selectedData = headerMenuSymbols.find((symbol) =>
      symbol.includes(`${selectedSymbol}-${operationMode}`)
    );

    if (!selectedData) {
      selectedData = `${selectedSymbol}-${operationMode}`;
    }

    if (
      !selectedSymbolData ||
      !headerMenuSymbols.some((sym) => sym === selectedData)
    )
      return;

    const { menuOperationMode } = separateSymbolAndMode(selectedData);

    const cfg = selectedSymbolData.configModes[menuOperationMode];
    if (cfg?.status === "ACTIVE") {
      updatePayout(cfg.payout);
      return;
    }

    const next = pickNext(symbols, selectedSymbol, menuOperationMode);

    console.log("next ->", next);

    if (next) {
      const nextHeaderMenuSymbol = `${next.symbol}-${next.mode}`;
      if (next.symbol !== selectedSymbol || next.mode !== operationMode) {
        const updatedHeaderMenuSymbols =
          updateMenuSymbols(nextHeaderMenuSymbol);

        updateHeaderMenuSymbols(updatedHeaderMenuSymbols);
        updateSymbol(next.symbol);
      }
      if (next.mode !== operationMode) {
        updateOperationMode(next.mode as any);
      }

      updatePayout(next.payout);

      const updatedSymbols = headerMenuSymbols.filter(
        (item) => item !== selectedSymbol
      );

      localStorage.setItem(
        "selectedMenuSymbols",
        JSON.stringify(updatedSymbols)
      );
    } else {
      console.warn("Não achei nenhuma moeda ativa nos modos configurados.");
      // const nextSymbol = `BTCUSDT-${operationMode}`;
      // updateHeaderMenuSymbols([...headerMenuSymbols, nextSymbol]);

      // updateSymbol("BTCUSDT");
      // updateOperationMode("OPTION");
    }
  }, [
    symbols,
    selectedSymbolData,
    operationMode,
    selectedSymbol,
    headerMenuSymbols,
  ]);

  async function refetchParameters() {
    await mutate();
    let candleTimeframes = [];

    // Valores padrão caso parameters não contenha dados válidos
    const defaultTimeframes = [
      {
        label: "1 min",
        value: "M1",
        valueChart: 1,
      },
      {
        label: "5 min",
        value: "M5",
        valueChart: 5,
      },
      {
        label: "15 min",
        value: "M15",
        valueChart: 15,
      },
    ];

    try {
      if (parameters?.CANDLE_TIME_FRAMES?.value) {
        const parsedValue = JSON.parse(parameters.CANDLE_TIME_FRAMES.value);

        if (Array.isArray(parsedValue) && parsedValue.length > 0) {
          candleTimeframes = parsedValue;
        } else {
          candleTimeframes = defaultTimeframes;
        }
      } else {
        candleTimeframes = defaultTimeframes;
      }
    } catch (error) {
      console.error("Erro ao parsear CANDLE_TIME_FRAMES:", error);
      candleTimeframes = defaultTimeframes;
    }

    const currentCandleTimeframe = candleTimeframes.find(
      (candle) => candle.value === defaultCandleTimeFrame
    );

    setActiveMinute(currentCandleTimeframe || candleTimeframes[0]);
    setSelectedTimeFrame(currentCandleTimeframe || candleTimeframes[0]);
    setCandleBuckets(candleTimeframes);
  }

  useEffect(() => {
    if (!!parameters && !candleBuckets?.length) {
      const candleTimeframes = JSON.parse(parameters?.CANDLE_TIME_FRAMES.value);

      const currentCandleTimeframe = candleTimeframes.find(
        (candle) => candle.value === defaultCandleTimeFrame
      );

      setActiveMinute(currentCandleTimeframe || candleTimeframes[0]);
      setSelectedTimeFrame(currentCandleTimeframe || candleTimeframes[0]);
      setCandleBuckets(candleTimeframes);
    } else if (!parameters || !candleBuckets) {
      setTimeout(() => {
        refetchParameters();
      }, 500);
    }
  }, [parameters, candleBuckets]);

  return (
    <Box
      sx={{
        bgcolor: isMobile ? "transparent" : "#040c11",
        borderRadius: 2,
        px: isMobile ? 0 : 2,
        py: isMobile ? 0 : 1,
      }}
      className="ordens-section"
    >
      {selectedSymbolData.marketStatus === "CLOSED" ? (
        <MarketClosedCard selectedSymbolData={selectedSymbolData} />
      ) : (
        <Stack direction="column" gap={{ xs: 1, md: 2 }}>
          <PlaceOrderTime
            activeMinute={activeMinute}
            amount={amount}
            balance={balance}
            candleBuckets={candleBuckets}
            onActiveMinute={setActiveMinute}
            onChangeAmount={setAmount}
            onChangeOrderValue={setOrderValue}
            payout={payout}
            selectedSymbol={selectedSymbol}
          />

          <PlaceOrderPayout amount={amount} payout={payout} />

          <PlaceOrderButtons
            amount={amount}
            balance={balance}
            accountId={activeAccount?.id}
            asset={parameters?.DEFAULT_COIN?.value.toUpperCase()}
            candleEndTime={selectedDatatime}
            candleTimeFrame={selectedCandle}
            resolution={tvWidget?.activeChart()?.resolution()}
            countValue={countValue}
            operationMode={operationMode}
            purchase={purchase}
            sale={sale}
            selectedSymbol={selectedSymbol}
            selectedSymbolMarketStatus={selectedSymbolData.marketStatus}
          />
        </Stack>
      )}
    </Box>
  );
};

export default PlaceOrderForm;
