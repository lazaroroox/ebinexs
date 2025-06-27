import { toInteger } from "lodash";
import allSymbols from "../../assets/data/allSymbols.json";
import { apiGet } from "../../services/apiService";
import { subscribeOnStream, unsubscribeOnStream } from "./streaming";

const lastBarsCache = new Map();
const errorStateCache = new Set();

const configurationData = {
  supports_marks: true,
  supports_timescale_marks: true,
  supports_time: true,
  supported_resolutions: ["1", "5", "15", "30", "1h", "1D"],
  exchanges: [
    { value: "Binance", name: "Binance", desc: "Binance" },
    { value: "FOREXCOM", name: "FOREXCOM", desc: "FOREXCOM" },
  ],
  symbols_types: [
    { name: "Crypto", value: "crypto" },
    { name: "Forex", value: "forex" },
  ],
};

export let callbackUpdateServerTime = null;

let brokerVersusClientClockTimestampDiff = 0;
let brokerTimestampSaved = 0;

export function resetLastBarsCache() {
  lastBarsCache.clear();
}

export function resetErrorState(symbol, resolution) {
  const key = `${symbol}.${resolution}`;
  const wasInErrorState = errorStateCache.has(key);

  if (wasInErrorState) {
    errorStateCache.delete(key);
  }
  return wasInErrorState;
}

// Novo: Função para resetar todos os estados de erro
export function resetAllErrorStates() {
  const errorStates = Array.from(errorStateCache);

  errorStateCache.clear();
  return errorStates;
}

export function getLatencyServerTime() {
  return brokerVersusClientClockTimestampDiff;
}

export function getBrokerTimestamp() {
  return brokerTimestampSaved;
}

export function getBrokerNowTime() {
  return new Date().getTime() - brokerVersusClientClockTimestampDiff;
}

async function getAllSymbols() {
  return allSymbols;
}

export default {
  onReady: async (callback) => {
    setTimeout(() => callback(configurationData));
  },

  searchSymbols: async (
    userInput,
    exchange,
    symbolType,
    onResultReadyCallback
  ) => {
    const symbols = await getAllSymbols();
    const newSymbols = symbols.filter((symbol) => {
      const isExchangeValid = exchange === "" || symbol.exchange === exchange;
      const isFullSymbolContainsInput =
        symbol.full_name.toLowerCase().indexOf(userInput.toLowerCase()) !== -1;
      return isExchangeValid && isFullSymbolContainsInput;
    });
    onResultReadyCallback(newSymbols);
  },

  resolveSymbol: async (
    symbolName,
    onSymbolResolvedCallback,
    onResolveErrorCallback,
    extension
  ) => {
    const symbols = await getAllSymbols();
    const symbolItem = symbols.find(({ ticker }) => ticker === symbolName);
    if (!symbolItem) {
      onResolveErrorCallback("cannot resolve symbol");
      return;
    }

    const symbolInfo = {
      ticker: symbolItem.ticker,
      name: symbolItem.symbol,
      description: symbolItem.description,
      type: symbolItem.type,
      session: symbolItem.session,
      timezone: symbolItem.timezone,
      exchange: symbolItem.exchange,
      listed_exchange: symbolItem.exchange,
      minmov: symbolItem.minmov,
      minmovement2: symbolItem.minmove2,
      pricescale: symbolItem.pricescale,
      has_empty_bars: symbolItem.has_empty_bars,
      has_intraday: true,
      has_daily: true,
      visible_plots_set: "ohlcv",
      volume_precision: symbolItem.volume_precision,
      has_weekly_and_monthly: false,
      supported_resolutions: configurationData.supported_resolutions,
      data_status: "streaming",
    };

    onSymbolResolvedCallback(symbolInfo);
  },

  getBars: async (
    symbolInfo,
    resolution,
    periodParams,
    onHistoryCallback,
    onErrorCallback
  ) => {
    const { from, to, firstDataRequest, countBack } = periodParams;
    let { description, type: symbolType } = symbolInfo;
    description = description.replace("/", "");

    const startTime = from * 1000;
    const endTime = to * 1000;

    const pairKey = `${symbolInfo.ticker || symbolInfo.name}.${resolution}`;

    try {
      let interval = resolution.toLowerCase();

      if (!isNaN(interval)) {
        interval =
          parseInt(interval) >= 60 ? `H${interval / 60}` : `M${interval}`;
      }

      let data = await apiGet(
        `dataProvider/aggregatedTrades?symbol=${description}&candleTimeFrame=${interval}&from=${startTime}&to=${endTime}&limit=1000`
      );
      if ((data.Response && data.Response === "Error")) {
        onHistoryCallback([], { noData: true });
        return;
      }

      if (data.length === 0) {
        onHistoryCallback([], { noData: false })
        return;
      }

      const symbolIsCrypto = symbolType === "crypto";

      const bars = data
        .map((bar) => ({
          time: bar.t,
          close: parseFloat(bar.c),
          open: parseFloat(bar.o),
          high: parseFloat(bar.h),
          low: parseFloat(bar.l),
          ...(symbolIsCrypto ? { volume: parseFloat(bar.v) } : {}),
        }))
        .sort((a, b) => a.time - b.time);

      if (bars.length < countBack && description === "EURUSD") {
        const lastBar = bars[bars.length - 1];
        for (let i = bars.length; i < countBack; ++i) {
          const newBar = {
            close: lastBar.close,
            high: lastBar.close,
            isBarClosed: true,
            isLastBar: false,
            low: lastBar.close,
            open: lastBar.close,
            time: lastBar.time - (i + 1) * 60 * 1000,
            ...(symbolIsCrypto ? { volume: lastBar.volume } : {}),
          };
          bars.unshift(newBar);
        }
      }

      if (firstDataRequest) {
        lastBarsCache.set(`${symbolInfo.full_name}.${resolution}`, {
          ...bars[bars.length - 1],
        });
      }

      errorStateCache.delete(pairKey);

      onHistoryCallback(bars, { noData: false });
    } catch (error) {
      errorStateCache.add(pairKey);
      onErrorCallback(error);
    }
  },

  subscribeBars: (
    symbolInfo,
    resolution,
    onRealtimeCallback,
    subscriberUID,
    onResetCacheNeededCallback
  ) => {
    const verifyNewBar = (newBar) => {
      const lastBar = lastBarsCache.get(
        `${symbolInfo.full_name}.${resolution}`
      );

      if (!lastBar || (lastBar && newBar.time >= lastBar.time)) {
        onRealtimeCallback(newBar);
        lastBarsCache.set(`${symbolInfo.full_name}.${resolution}`, newBar);
      }

      if (lastBar && newBar.time < lastBar.time) {
        onRealtimeCallback(lastBar);
      }
    };

    subscribeOnStream(
      symbolInfo,
      resolution,
      verifyNewBar,
      subscriberUID,
      onResetCacheNeededCallback,
      lastBarsCache.get(`${symbolInfo.full_name}.${resolution}`)
    );
  },

  unsubscribeBars: (subscriberUID) => {
    unsubscribeOnStream(subscriberUID);
  },

  getServerTime: async (callback) => {
    const start = new Date().getTime();
    const symbol = localStorage.getItem("defaultSymbol").replaceAll('"', "");
    const brokerTimestamp = await apiGet(
      `/orders/getBrokerTimestamp?symbol=${symbol}`
    );

    const end = new Date().getTime();
    const requestTime = end - start;
    const nowTime = brokerTimestamp + toInteger(requestTime / 2);

    brokerTimestampSaved = brokerTimestamp;

    brokerVersusClientClockTimestampDiff = new Date().getTime() - nowTime;

    const timeFix = 0;

    callback((nowTime + timeFix) / 1000);

    callbackUpdateServerTime = callback;
  },

  resetErrorState,
  resetAllErrorStates,
};
