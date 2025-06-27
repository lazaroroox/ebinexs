import { addMinutes, format, getUnixTime, subMinutes } from "date-fns";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import utc from "dayjs/plugin/utc";
import { db } from "../services/db";
type ActionTimeType = "addMinutes" | "subMinutes";

// Configure os plugins necessários
dayjs.extend(utc);
dayjs.extend(duration);

export const candleLiveTime = (time, type) => {
  // eslint-disable-next-line radix
  time = parseInt(time);
  const date = dayjs().utc().add(0, "milliseconds");
  const duration = dayjs.duration(time, type);
  // @ts-ignore
  return dayjs.utc(Math.ceil(+date / +duration) * +duration - duration);
};

export const timestampConvert = (time) => Math.round(time / 1000);

export const calculateCandleTime = (timeLive, minutes) => {
  const candle = candleLiveTime(minutes, "minutes").valueOf();
  // @ts-ignore
  const candleTime = candle + dayjs.duration(minutes, "minutes");
  const remainingTime = timestampConvert(candleTime - timeLive);

  if (remainingTime === 0) {
    db.cleanCandle(minutes);
  }

  return {
    candleTime,
    remainingTime,
  };
};

export const calculateCandles = (timeLive, candles) =>
  candles?.map((candles) => ({
    candle: candles.value,
    candleTime: calculateCandleTime(timeLive, candles.value),
  }));

export const convertSecondsToHours = (seconds) =>
  new Date(seconds * 1000).toISOString().substr(11, 8);

export const convertTimeToCandlePoint = (
  timestamp: number,
  action?: ActionTimeType,
  minute?: number
) => {
  let timeFormatd: Date;
  let timestampFormatd: number;
  switch (action) {
    case "addMinutes":
      timeFormatd = new Date(
        format(addMinutes(timestamp, minute), "MM/dd/yyyy HH:mm")
      );
      timestampFormatd = getUnixTime(timeFormatd);
      break;
    case "subMinutes":
      timeFormatd = new Date(
        format(subMinutes(timestamp, minute), "MM/dd/yyyy HH:mm")
      );
      timestampFormatd = getUnixTime(timeFormatd);
      break;
    default:
      timeFormatd = new Date(format(timestamp, "MM/dd/yyyy HH:mm"));
      timestampFormatd = getUnixTime(timeFormatd);
      break;
  }

  return timestampFormatd;
};
