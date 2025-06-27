import {
  Accordion,
  AccordionSummary,
  Box,
  Skeleton,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import { format } from "date-fns";
import gsap from "gsap";
import { orderBy } from "lodash";
import { FC, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { AiOutlineFileSearch } from "react-icons/ai";
import OptionBull from "src/components/icons/OptionBull";
import OptionSell from "src/components/icons/OptionSell";
import RetractionBull from "src/components/icons/RetractionBull";
import RetractionSell from "src/components/icons/RetractionSell";
import { getLastBar } from "src/components/TVChartContainerV2/streaming";
import { SYMBOL_IMAGES } from "src/constants";
import CountdownContextV2 from "src/contexts/v2/CountdownContext";
import TradingViewContextV2 from "src/contexts/v2/TradingViewContext";
import useApiData from "src/hooks/useApiData";
import useParameters from "src/swr/use-parameters";
import labelsColors from "src/theme/labelsColors";
import { getResulteOnLive } from "src/utils/getResultOnLine";
import { scrollStyle } from ".";

const ACTIVE_FRAME_SECONDS = {
  M1: 60,
  M5: 300,
  M15: 900,
};

export default function LiveOrders() {
  const { t } = useTranslation("dashboard");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [expandedAccordion, setExpandedAccordion] = useState<string | false>(
    "panel1"
  );

  const { loading } = useParameters();
  const { selectedSymbol } = useContext(TradingViewContextV2);
  const { userLiveOperations, selectedCandle } = useApiData();
  const resolution = selectedCandle.replace('M', '')

  const lastDailyBar = getLastBar(selectedSymbol, resolution);

  const handleChangeAccordion =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpandedAccordion(newExpanded ? panel : false);
    };


  return (
    <>
      {Object.keys(userLiveOperations).length === 0 ? (
        <Stack
          flex={1}
          flexDirection={"column"}
          p={1}
          alignItems={"center"}
          justifyContent={"center"}
          spacing={1}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#00C38126",
              borderRadius: "50%",
              width: 52,
              height: 52,
            }}
          >
            <AiOutlineFileSearch color="#00B474" size={27} />
          </Box>
          <Typography fontWeight={500} fontSize={14} color="#EFEFEF">
            {t("not_order_open")}
          </Typography>
          <Typography
            color="#919eab"
            variant="body1"
            px={1.4}
            textAlign={"center"}
          >
            {t("no_operations")}
          </Typography>
        </Stack>
      ) : (
        <Box sx={scrollStyle}>
          {orderBy(
            Object.values(userLiveOperations),
            [(item) => new Date(item.createdAt)],
            ["desc"]
          ).map((item) => (
            <OrderAccordion
              key={item.id}
              item={item}
              expandedAccordion={expandedAccordion}
              handleChangeAccordion={handleChangeAccordion}
              loading={loading}
              lastDailyBar={lastDailyBar}
            />
          ))}
        </Box>
      )}
    </>
  );
}

interface OrderAccordionProps {
  item: any;
  expandedAccordion: string | false;
  handleChangeAccordion: (
    panel: string
  ) => (event: React.SyntheticEvent, newExpanded: boolean) => void;
  loading: boolean;
  lastDailyBar: any;
}

const OrderAccordion: FC<OrderAccordionProps> = ({
  item,
  expandedAccordion,
  handleChangeAccordion,
  loading,
  lastDailyBar,
}) => {
  const { count, count1m, syncServerTimeWithNowDate } =
    useContext(CountdownContextV2);

  const isNewOptionsTab = item.binaryOrderType === "OPTION";
  const countValue = isNewOptionsTab ? count : count1m;

  const payout = useMemo(() => {
    return 100 - item.feeRate;
  }, [item]);

  return (
    <Accordion
      expanded={expandedAccordion === item.id}
      onChange={handleChangeAccordion(item.id)}
      elevation={0}
      sx={{
        "& .MuiAccordionSummary-content": {
          display: "flex",
          justifyContent: "space-between",
        },
        "& .MuiAccordionSummary-root": {
          paddingLeft: 0,
          bgcolor: "transparent",
          background: "transparent",
          height: "64px",
          border: `0`,
          borderBottom: `1px solid #0d1b24`,
          "&:last-of-type": {
            border: 0,
          },
          position: "relative",
        },
        background: "transparent",
        "&::before": {
          display: "none",
        },
      }}
    >
      <AccordionSummary
        aria-controls="panel1d-content"
        id="panel1d-header"
        sx={{
          pointerEvents: "none",
          "& .MuiAccordionSummary-expandIconWrapper": {
            display: "none",
          },
          "& .info": {
            display: "flex",
            alignItems: "center",
            flex: 1,

            "@media screen and (max-width: 1200px)": {
              flex: 2,
            },
          },
          "& .profit": {
            display: "flex",
            flex: 0.75,
            justifyContent: "flex-start",
            alignItems: "center",
            gap: "0.25rem",
            "@media screen and (max-width: 1200px)": {
              flex: 0.25,
            },
          },
        }}
      >
        <Box sx={{ width: "100%" }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              my: '12px'
            }}
          >
            <div className="info">
              {/* @ts-ignore */}
              <img width={40} src={SYMBOL_IMAGES[item.symbol].image} alt="" />

              <div>
                <Typography color={"#EEE"} fontSize={13}>
                  {item.symbol}
                </Typography>
                <Typography variant="body1" fontSize={13} color={"#797979"}>
                  {format(new Date(item.candleStartTime), "HH:mm")} /{" "}
                  {item.binaryOrderType === "OPTION"
                    ? item.candleTimeFrame
                    : format(new Date(item.candleEndTime), "HH:mm")}
                </Typography>
              </div>
            </div>
            <div className="profit">
              {item.direction.toUpperCase() === "BULL" ? (
                item.binaryOrderType === "OPTION" ? (
                  <OptionBull />
                ) : (
                  <RetractionBull />
                )
              ) : item.binaryOrderType === "OPTION" ? (
                <OptionSell />
              ) : (
                <RetractionSell />
              )}
              <>
                {loading ? (
                  <Skeleton />
                ) : (
                  <OrderResult
                    order={item}
                    payout={payout}
                    lastDailyBar={lastDailyBar}
                    countValue={countValue}
                  />
                )}
              </>
            </div>
          </Box>
          <ProgressBar
            candleStartTime={item.candleStartTime}
            candleEndTime={item.candleEndTime}
            candleTimeframe={item.candleTimeFrame}
            status={item.status}
            syncServerTimeWithNowDate={syncServerTimeWithNowDate}
          />
        </Box>
      </AccordionSummary>
    </Accordion>
  );
};

interface OrderResultProps {
  order: any;
  payout: number;
  lastDailyBar: any;
  countValue: number
}

const OrderResult: FC<OrderResultProps> = ({ countValue, order, payout, lastDailyBar }) => {
  const { t } = useTranslation("dashboard");

  const [result, setResult] = useState({
    color: "",
    simbol: "",
    result: "",
    status: "",
  });

  useEffect(() => {
    const updatedResult = getResulteOnLive({
      order,
      payout,
      lastDailyBar,
    });
    setResult(updatedResult);
  }, [order, payout, lastDailyBar, countValue]);

  return (
    <Box>
      <Typography color={result.color} variant="subtitle1">
        {`${result.simbol}${result.result}`}
      </Typography>
      <Typography
        variant="body1"
        {...(result.status === "OPEN"
          ? { color: "#FFF" }
          : { color: labelsColors.PENDING.color })}
      >
        {t(result.status.toLocaleLowerCase())}
      </Typography>
    </Box>
  );
};
interface ProgressBarProps {
  candleStartTime: string;
  candleEndTime: string;
  candleTimeframe: "M1" | "M5" | "M15";
  status: string;
  syncServerTimeWithNowDate: () => number;
}

const ProgressBar: FC<ProgressBarProps> = ({
  candleStartTime,
  candleEndTime,
  candleTimeframe,
  status,
  syncServerTimeWithNowDate,
}) => {
  const [progressPercentage, setProgressPercentage] = useState(100);
  const progressBarRef = useRef(null);

  useEffect(() => {
    const updateProgress = () => {
      const startTime = new Date(candleStartTime);
      startTime.setSeconds(0, 0);
      const endTime = new Date(candleEndTime).getTime();

      const now = syncServerTimeWithNowDate();

      const totalDuration = endTime - startTime.getTime();
      let elapsedTime = now - startTime.getTime();

      if (status === "PENDING") {
        const timeFrameInMs = {
          M1: 1 * 60 * 1000,
          M5: 5 * 60 * 1000,
          M15: 15 * 60 * 1000,
        }[candleTimeframe];

        elapsedTime = timeFrameInMs + elapsedTime;
      }

      const progress = Math.max(
        ((totalDuration - elapsedTime) / totalDuration) * 100,
        0
      );

      setProgressPercentage(progress);
    };

    updateProgress();

    const interval = setInterval(updateProgress, 1000);

    return () => clearInterval(interval);
  }, [candleStartTime, candleEndTime, status]);

  useEffect(() => {
    if (progressBarRef.current) {
      gsap.to(progressBarRef.current, {
        width: `${progressPercentage}%`,
        duration: 1,
        ease: "linear",
      });
    }
  }, [progressPercentage]);

  const progressBar = {
    position: "absolute",
    right: 0,
    width: `${progressPercentage}%`,
    height: "4px",
    backgroundColor: status === "PENDING" ? "#D89611" : "#00DB97",
    transition: "width 1s linear",
    borderRadius: "16px",
  };

  const progressBarBackground = {
    position: "absolute",
    right: 0,
    width: "100%",
    height: "4px",
    backgroundColor: "#121f27",
    borderRadius: "16px",
  };

  return (
    <Box sx={{ width: "100%", position: "relative", marginTop: "8px" }}>
      <Box sx={progressBarBackground} />
      <Box ref={progressBarRef} sx={progressBar} />
    </Box>
  );
};
