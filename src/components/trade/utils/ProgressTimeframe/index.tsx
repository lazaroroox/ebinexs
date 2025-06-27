import { Box, Button, Stack, Typography, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useMemo, useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import Countdown from "src/components/widgets/inputs/Countdown";
import { symbolsInfo } from "src/constants";
import { SelectTimeFrameNewOptions } from "./SelectTimeFrameNewOptions";
import { SelectTimeFrameRetraction } from "./SelectTimeFrameRetraction";

export function ProgressTimeframe({
  activeMinute,
  candleBuckets,
  countValue,
  handleShowInputTimeRetraction,
  isNewOptionsTab,
  onActiveMinute,
  payout,
  selectedSymbol,
  showInputTimeRetraction,
  timeOrderRetraction,
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));

  const [showSelectTimeframe, setShowSelectTimeframe] = useState(false);

  const ACTIVE_FRAME_SECONDS = {
    M1: 60,
    M5: 300,
    M15: 900,
  };

  const progressPercentage = Math.min(
    countValue /
      (isNewOptionsTab ? ACTIVE_FRAME_SECONDS[activeMinute?.value] : 60) /
      10,
    100
  );

  const progressBar = {
    position: "absolute",
    right: 0,
    width: `${progressPercentage}%`,
    height: isMobile ? "4px" : "4px",
    backgroundColor:
      countValue < (isNewOptionsTab ? 7000 : 4000) ? "#FF5382" : "#00DB97",
    transition: "width 1s linear",
    borderRadius: "16px",
  };

  const progressBarBackground = {
    position: "absolute",
    right: 0,
    width: "100%",
    height: isMobile ? "4px" : "4px",
    backgroundColor: "#121f27",
    borderRadius: "16px",
  };

  const symbolData = useMemo(() => {
    const indexSymbol = symbolsInfo.findIndex((s) => s.name === selectedSymbol);

    if (indexSymbol < 0) {
      return symbolsInfo[0];
    }
    return symbolsInfo[indexSymbol];
  }, [selectedSymbol]);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: isMobile ? "flex-start" : "flex-end",
          flexDirection: "column",
          alignItems: "end",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            height: "32px",
          }}
        >
          {showSelectTimeframe ? (
            <Stack direction="row" alignItems="center" gap={1}>
              <Button
                sx={{
                  width: "max-width",
                  minWidth: "unset",
                  padding: 0,
                  borderRadius: "50%",
                  "&:hover": {
                    opacity: 0.75,
                    transition: "opacity 0.4s ease",
                  },
                }}
              >
                <IoIosArrowBack
                  color="#EFEFEF"
                  size={10}
                  onClick={() => setShowSelectTimeframe(false)}
                />
              </Button>

              <Typography fontWeight={700} fontSize={14} color="#EFEFEF">
                Timeframe
              </Typography>
            </Stack>
          ) : (
            <Stack direction="row" alignItems="center">
              <img width={32} src={symbolData.image} alt="" />
              <Typography sx={{ color: "#fff", fontWeight: 700 }} fontSize={14}>
                {symbolData.symbol}
              </Typography>
            </Stack>
          )}

          {!isNewOptionsTab && (
            <SelectTimeFrameRetraction
              handleChangeShowInput={() =>
                handleShowInputTimeRetraction((prev) => !prev)
              }
              isShowInput={showInputTimeRetraction}
              timeOrderRetraction={timeOrderRetraction}
            />
          )}

          {isNewOptionsTab && (
            <SelectTimeFrameNewOptions
              activeMinute={activeMinute}
              candleBuckets={candleBuckets}
              onActiveMinute={onActiveMinute}
              onShowSelectTimeframe={setShowSelectTimeframe}
              showSelectTimeframe={showSelectTimeframe}
            />
          )}
        </Box>

        <Box sx={{ width: "100%", position: "relative" }}>
          <Box sx={progressBarBackground} />
          <Box sx={progressBar} />
        </Box>
        <Countdown />
      </Box>
    </>
  );
}
