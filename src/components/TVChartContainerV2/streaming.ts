import { gsap } from "gsap";
import allSymbols from "../../assets/data/allSymbols.json";

import { setupVisibilityChangeHandler } from "src/utils/timeChangeVisibility";

const channelToSubscription = new Map();

export function getLastBar(symbol, resolution?) {
  const subscriptionItem = channelToSubscription.get(`${symbol}-${resolution}`);

  if (
    typeof subscriptionItem === "undefined" ||
    !subscriptionItem.lastDailyBar
  ) {
    return {
      time: 0,
      open: 0,
      high: 0,
      low: 0,
      close: 0,
      volume: 0,
    };
  }
  return subscriptionItem.lastDailyBar;
}

function getMinutes(timestamp) {
  return new Date(timestamp).getMinutes();
}

function getNextDailyBarTime(timestamp) {
  const date = new Date(timestamp);

  const nextDayTimestamp = timestamp - 60 * 60 * 1000;

  const startDayTimestamp = new Date(nextDayTimestamp).setUTCHours(0, 0, 0, 0);

  const nextDailyIsBetterDay =
    new Date(nextDayTimestamp).getUTCDate() >= date.getUTCDate();

  if (nextDailyIsBetterDay) {
    return startDayTimestamp;
  } else {
    return undefined;
  }
}

export function candleUpgradeOnStream(data, symbol, resolution) {
  if (document.visibilityState === "visible") {
    candleUpgradeAnimation(data, symbol, resolution);
  } else {
    candleUpgradePreviousOnStream(data, symbol, resolution);
  }
}

function timestampIsStartOfDay(timestamp) {
  const date = new Date(timestamp);
  return (
    date.getUTCHours() === 0 &&
    date.getUTCSeconds() === 0 &&
    date.getUTCMinutes() === 0
  );
}

export function candleUpgradePreviousOnStream(data, symbol, resolution) {
  const { t, p, v } = data;

  const tradePrice = parseFloat(p);
  const tradeTime = parseInt(t);
  const tradeVolume = parseFloat(v);

  if (isNaN(tradePrice) || isNaN(tradeTime)) {
    return;
  }

  const subscriptionItem = channelToSubscription.get(`${symbol}-${resolution}`);

  if (subscriptionItem === undefined) {
    return;
  }

  const lastDailyBar = getLastBar(symbol, resolution);
  const tradeTimeMinutes = getMinutes(tradeTime);

  const nextDailyBarTime = getNextDailyBarTime(tradeTime);

  const currentSymbol = allSymbols.filter(
    (s) => s.full_name === symbol || s.ticker === symbol
  )[0];

  const symbolIsCrypto = currentSymbol?.type === "crypto";

  let bar;

  if (lastDailyBar?.open === 0 || nextDailyBarTime > tradeTime) {
    bar = {
      time: resolution === "1D" ? nextDailyBarTime : tradeTime,
      open: tradePrice,
      high: tradePrice,
      low: tradePrice,
      close: tradePrice,
      ...(symbolIsCrypto ? { volume: tradeVolume } : {}),
    };
  } else if (
    tradeTimeMinutes !==
      (lastDailyBar?.time ? getMinutes(lastDailyBar.time) : 0) &&
    resolution !== "1D"
  ) {
    bar = {
      time: tradeTime,
      open: tradePrice,
      high: tradePrice,
      low: tradePrice,
      close: tradePrice,
      ...(symbolIsCrypto ? { volume: tradeVolume } : {}),
    };
  } else {
    bar = {
      ...lastDailyBar,
      high: Math.max(lastDailyBar.high, tradePrice),
      low: Math.min(lastDailyBar.low, tradePrice),
      close: tradePrice,
      ...(symbolIsCrypto
        ? { volume: (lastDailyBar.volume || 0) + tradeVolume }
        : {}),
    };
  }

  subscriptionItem.lastDailyBar = bar;

  subscriptionItem.handlers.forEach((handler) => handler.callback(bar));
}

export function candleUpgradeAnimation(data, symbol, resolution) {
  const { t, p, v } = data;
  const tradePrice = parseFloat(p);
  const tradeTime = parseInt(t);
  const tradeVolume = parseFloat(v);

  if (isNaN(tradePrice) || isNaN(tradeTime)) return;

  const subscriptionItem = channelToSubscription.get(`${symbol}-${resolution}`);

  if (!subscriptionItem) return;

  const lastDailyBar = getLastBar(symbol, resolution);
  const tradeTimeMinutes = getMinutes(tradeTime);
  const nextDailyBarTime = getNextDailyBarTime(tradeTime);

  const currentSymbol = allSymbols.filter(
    (s) => s.full_name === symbol || s.ticker === symbol
  )[0];

  const symbolIsCrypto = currentSymbol?.type === "crypto";

  let bar;

  if (lastDailyBar?.open === 0 && resolution === "1D") {
    bar = {
      time: nextDailyBarTime,
      open: tradePrice,
      high: tradePrice,
      low: tradePrice,
      close: tradePrice,
      ...(symbolIsCrypto ? { volume: tradeVolume } : {}),
    };
    subscriptionItem.lastDailyBar = bar;
    subscriptionItem.handlers.forEach((handler) => handler.callback(bar));
    return;
  }

  if (
    resolution !== "1D" &&
    tradeTimeMinutes !==
      (lastDailyBar?.time ? getMinutes(lastDailyBar.time) : 0)
  ) {
    const newBar = {
      time: tradeTime,
      open: tradePrice,
      high: tradePrice,
      low: tradePrice,
      close: tradePrice,
      ...(symbolIsCrypto ? { volume: tradeVolume } : {}),
    };
    subscriptionItem.lastDailyBar = newBar;
    subscriptionItem.handlers.forEach((handler) => handler.callback(newBar));
    return;
  }

  // Se for atualização do mesmo candle, inicie animação.
  const targetBar = {
    ...lastDailyBar,
    high: Math.max(lastDailyBar.high, tradePrice),
    low: Math.min(lastDailyBar.low, tradePrice),
    close: tradePrice,
    ...(symbolIsCrypto
      ? { volume: (lastDailyBar.volume || 0) + tradeVolume }
      : {}),
  };

  // Cancela animação anterior (se houver).
  if (subscriptionItem.gsapAnimation) {
    subscriptionItem.gsapAnimation.kill();
  }

  // Define o estado inicial da animação.
  const initialBar = { ...lastDailyBar };
  const duration = 0.25; // 0.25 segundos -> 250 ms

  subscriptionItem.gsapAnimation = gsap.to(initialBar, {
    duration,
    high: targetBar.high,
    low: targetBar.low,
    close: targetBar.close,
    ease: "power2.out",
    onUpdate: () => {
      subscriptionItem.lastDailyBar = initialBar;
      subscriptionItem.handlers.forEach((handler) =>
        handler.callback(initialBar)
      );
    },
    onComplete: () => {
      subscriptionItem.lastDailyBar = targetBar;
      subscriptionItem.handlers.forEach((handler) =>
        handler.callback(targetBar)
      );
      subscriptionItem.gsapAnimation = null;
    },
  });
}

export function subscribeOnStream(
  symbolInfo,
  resolution,
  onRealtimeCallback,
  subscriberUID,
  onResetCacheNeededCallback,
  lastDailyBar
) {
  console.log("subscribeOnStream", {
    symbolInfo,
    resolution,
    subscriberUID,
  });
  currentResolutionChart = resolution;
  const channelString = `${symbolInfo.full_name}-${resolution}`;
  const handler = {
    id: subscriberUID,
    callback: onRealtimeCallback,
  };
  let subscriptionItem = channelToSubscription.get(channelString);
  if (subscriptionItem) {
    subscriptionItem.handlers.push(handler);
    return;
  }
  subscriptionItem = {
    subscriberUID,
    resolution,
    lastDailyBar,
    handlers: [handler],
  };

  channelToSubscription.set(channelString, subscriptionItem);

  resetCacheBarsCallback = onResetCacheNeededCallback;

  const cleanupVisibilityHandler = setupVisibilityChangeHandler(
    onResetCacheNeededCallback
  );

  return () => {
    cleanupVisibilityHandler();
  };
}

export function unsubscribeOnStream(subscriberUID) {
  for (const channelString of channelToSubscription.keys()) {
    const subscriptionItem = channelToSubscription.get(channelString);
    const handlerIndex = subscriptionItem.handlers.findIndex(
      (handler) => handler.id === subscriberUID
    );

    if (handlerIndex !== -1) {
      subscriptionItem.handlers.splice(handlerIndex, 1);

      if (subscriptionItem.handlers.length === 0) {
        channelToSubscription.delete(channelString);
        break;
      }
    }
  }
}

export let currentResolutionChart = null;
export let resetCacheBarsCallback = null;
