import {
  Button,
  Skeleton,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Stack } from "@mui/system";
import { useContext, useMemo } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { MdCandlestickChart } from "react-icons/md";
import { ResolutionString } from "src/charting_library/charting_library";
import LayoutContext from "src/contexts/LayoutContext";
import CountdownContextV2 from "src/contexts/v2/CountdownContext";
import TradingViewContextV2 from "src/contexts/v2/TradingViewContext";
import useApiData from "src/hooks/useApiData";
import useParameters from "src/swr/use-parameters";
import { CandleBucket } from "src/types/candle";

interface SelectTimeFrameNewOptionsProps {
  showSelectTimeframe: boolean;
  onShowSelectTimeframe: (b: boolean) => void;
  candleBuckets: Array<CandleBucket>;
  onActiveMinute: (minute: CandleBucket) => void;
  activeMinute: CandleBucket;
}

export function SelectTimeFrameNewOptions({
  activeMinute,
  candleBuckets,
  onActiveMinute,
  onShowSelectTimeframe,
  showSelectTimeframe,
}: SelectTimeFrameNewOptionsProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const {
    handleChartLoadingState,
    layout: { chartButtonsDisabled },
  } = useContext(LayoutContext);
  const { removeOrdersByTimeframe, checkTvWidgetChartIsActive } =
    useContext(TradingViewContextV2);
  const { parameters } = useParameters();
  const { updateTimeframe } = useApiData();
  const { setSelectedTimeFrame } = useContext(CountdownContextV2);

  const availableTimeframes = useMemo(() => {
    if (!parameters) return;

    return JSON.parse(parameters?.CANDLE_TIME_FRAMES?.value);
  }, [parameters]);

  const handleOpenSelectTimeFrame = () => {
    onShowSelectTimeframe(true);
  };

  const handleCloseSelectTimeFrame = () => {
    onShowSelectTimeframe(false);
  };

  const handleChangeTimeFrame = async (newTimeframe: CandleBucket) => {
    if (newTimeframe.value === activeMinute.value || chartButtonsDisabled) {
      return;
    }

    handleChartLoadingState(true);
    setSelectedTimeFrame(newTimeframe);

    removeOrdersByTimeframe(newTimeframe.value);
    onActiveMinute(newTimeframe);
    await updateTimeframe(newTimeframe.value);

    const activeChart = await checkTvWidgetChartIsActive();

    if (activeChart && typeof activeChart.setResolution === "function") {
      await activeChart.setResolution(
        String(newTimeframe.valueChart) as ResolutionString
      );
    }

    handleCloseSelectTimeFrame();
  };

  return (
    <>
      {!showSelectTimeframe && (
        <Stack direction="row" alignItems="center" gap={0.25}>
          <MdCandlestickChart size={20} color="#00B474" />

          {!activeMinute ? (
            <Skeleton />
          ) : (
            <Stack
              component={Button}
              onClick={handleOpenSelectTimeFrame}
              direction="row"
              alignItems="center"
              gap={1}
            >
              <Typography fontWeight={700} fontSize={14}>
                {activeMinute.value}
              </Typography>
              <IoIosArrowDown
                style={{
                  rotate: `-90deg`,
                  transition: "rotate 0.3s ease",
                }}
                size={12}
                color="#FFFFFF"
              />
            </Stack>
          )}
        </Stack>
      )}

      {showSelectTimeframe && (
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="flex-end"
          gap={1.25}
        >
          {!candleBuckets?.length || !activeMinute ? (
            <Skeleton />
          ) : (
            candleBuckets.map((timeframe) => (
              <Typography
                component={Button}
                key={timeframe.value}
                disabled={activeMinute.value === timeframe.value}
                onClick={() => handleChangeTimeFrame(timeframe)}
                sx={{
                  minWidth: "unset",
                  width: "max-content",
                  padding: 0.25,
                  color: "#454545",
                  fontWeight: 700,
                  fontSize: 14,
                  transition: "all 0.4s ease",
                  ...(isMobile && {
                    "&:not(:disabled):active": {
                      color: "#00B474",
                    },
                  }),
                  ...(!isMobile && {
                    "&:not(:disabled):hover": {
                      color: "#00B474",
                    },
                  }),

                  "&:disabled": {
                    color: "#00B474",
                  },
                }}
              >
                {timeframe.value}
              </Typography>
            ))
          )}
        </Stack>
      )}
    </>
  );
}
