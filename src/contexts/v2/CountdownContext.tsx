import {
  FC,
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { getLatencyServerTime } from "src/components/TVChartContainerV2/datafeed";
import useApiData from "src/hooks/useApiData";
import TradingViewContextV2 from "./TradingViewContext";
import LayoutContext from "../LayoutContext";

interface CountdownProviderProps {
  children: ReactNode;
}

const INTERVAL_MAP = {
  M1: 1,
  M5: 5,
  M15: 15,
} as const;

interface CountdownContextV2Value {
  selectedTimeFrame: any;
  setSelectedTimeFrame: (timeFrame: any) => void;
  timeFormat: string;
  timeFormat1m: string;
  count: number;
  count1m: number;
  countValue: number;
  timeMinuteChart: number;
  refreshClock: (timeStamp: number) => void;
  saveServerTimeAndLatencyRef: (
    latency: number,
    timestampServer: number
  ) => void;
  latencyServerTime: number;
  serverTime: number;
  syncServerTimeWithNowDate: () => number;
}

const CountdownContextV2 = createContext<CountdownContextV2Value>({
  selectedTimeFrame: null,
  setSelectedTimeFrame: () => null,
  timeFormat: "",
  timeFormat1m: "",
  count: 0,
  count1m: 0,
  countValue: 0,
  timeMinuteChart: 0,
  refreshClock: (timeStamp: number) => {},
  saveServerTimeAndLatencyRef: (latency: number, timestampServer: number) => {},
  latencyServerTime: 0,
  serverTime: 0,
  syncServerTimeWithNowDate: () => null,
});

export const useCountdownContext = () => {
  const context = useContext(CountdownContextV2);
  if (context === undefined) {
    throw new Error(
      "useCountdownContext must be used within a CountdownProvider"
    );
  }
  return context;
};

export const CountdownProvider: FC<CountdownProviderProps> = (props) => {
  const { children } = props;

  const { operationMode } = useApiData();

  const { handleChartLoadingState } = useContext(LayoutContext)

  const isNewOptionsTab = operationMode === "OPTION";

  const [selectedTimeFrame, setSelectedTimeFrame] = useState(null);
  const [newOptionsTime, setNewOptionsTime] = useState({
    count: 0,
    timeFormat: "",
  });
  const [refractionTime, setRefractionTime] = useState({
    count1m: 0,
    timeFormat1m: "",
  });

  const [receiveValueByWS, setReceiveValueByWS] = useState(false);

  const animationRef = useRef(null);
  const latencyServerTimeWithDateNow = useRef(0);
  const serverTimeRef = useRef(0);
  const selectedTimeFrameRef = useRef(selectedTimeFrame);
  const timeMinuteChart = useRef(0);

  const calculateNextInterval = useCallback(() => {
    const minutes =
      (selectedTimeFrameRef.current?.value &&
        INTERVAL_MAP[selectedTimeFrameRef.current.value]) ||
      1;
      handleChartLoadingState(false)
    return minutes * 60 * 1000;
  }, [selectedTimeFrame]);

  const saveServerTimeAndLatencyRef = (latency, serverTime) => {
    setReceiveValueByWS(true);

    latencyServerTimeWithDateNow.current = latency;
    serverTimeRef.current = serverTime;
  };

  function syncServerTimeWithNowDate() {
    return Date.now() - latencyServerTimeWithDateNow.current;
  }

  const refreshClock = useCallback(() => {
    if (!selectedTimeFrame) {
      cancelAnimationFrame(animationRef.current);
      return;
    }

    if (!receiveValueByWS) {
      const newServerTimeDifference = getLatencyServerTime();

      latencyServerTimeWithDateNow.current = newServerTimeDifference;
    }

    const currentTimeMinuteChart = syncServerTimeWithNowDate();

    timeMinuteChart.current = latencyServerTimeWithDateNow.current;

    const intervalMs = calculateNextInterval();

    const remainingMs = intervalMs - (currentTimeMinuteChart % intervalMs);

    if (remainingMs < 0) {
      setNewOptionsTime({
        count: intervalMs,
        timeFormat: formatTime(intervalMs),
      });
    } else {
      setNewOptionsTime((prev) => ({
        count: remainingMs,
        timeFormat: formatTime(remainingMs),
      }));
    }

    const adjustedMs = 60000 - (currentTimeMinuteChart % 60000);

    setRefractionTime((prev) => ({
      count1m: adjustedMs,
      timeFormat1m: formatTime(adjustedMs),
    }));
  }, [selectedTimeFrame, calculateNextInterval]);

  const formatTime = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);

    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  useEffect(() => {
    const interval = setInterval(refreshClock, 1000);
    return () => clearInterval(interval);
  }, [refreshClock]);

  // Memoização de valores derivados
  const countValue = useMemo(
    () => (isNewOptionsTab ? newOptionsTime.count : refractionTime.count1m),
    [isNewOptionsTab, newOptionsTime.count, refractionTime.count1m]
  );

  // Memoização do contexto para evitar re-renders desnecessários
  const contextValue = useMemo(
    () => ({
      ...newOptionsTime,
      ...refractionTime,
      countValue,
      selectedTimeFrame,
      setSelectedTimeFrame,
      animationRef,
      refreshClock,
      saveServerTimeAndLatencyRef,
      timeMinuteChart: timeMinuteChart.current,
      latencyServerTime: latencyServerTimeWithDateNow.current,
      serverTime: serverTimeRef.current,
      syncServerTimeWithNowDate,
    }),
    [newOptionsTime, refractionTime, countValue, selectedTimeFrame]
  );

  useEffect(() => {
    selectedTimeFrameRef.current = selectedTimeFrame;
  }, [selectedTimeFrame]);

  return (
    <CountdownContextV2.Provider value={contextValue}>
      {children}
    </CountdownContextV2.Provider>
  );
};

export default CountdownContextV2;
