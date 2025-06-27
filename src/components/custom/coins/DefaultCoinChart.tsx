import { Box, Stack, Typography, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import PusingDot from "../lottie/PusingDot";
import { OperationsMode } from "src/types/symbol";
import { CgTimelapse } from "react-icons/cg";
import { MdCandlestickChart } from "react-icons/md";

type DefaultCoinChartProps = {
  name: string;
  image: string;
  ping?: boolean;
  center?: boolean;
  currentSymbol?: boolean;
  marketStatus?: "OPEN" | "CLOSED";
  typeSymbolInfo?: string;
  operationMode: OperationsMode;
};

const OPERATION_MODES = {
  RETRACTION_ENDTIME: "RETRACTION_ENDTIME",
  OPTION: "OPTION",
};

const getOperationModeIcon = (mode, color = "#CCCCCC") => {
  switch (mode) {
    case OPERATION_MODES.RETRACTION_ENDTIME:
      return <CgTimelapse color={color} size={12} />;
    case OPERATION_MODES.OPTION:
      return <MdCandlestickChart color={color} size={14} />;
    default:
      return null;
  }
};

export default function DefaultCoinChart({
  name,
  image,
  ping,
  center,
  currentSymbol,
  marketStatus,
  typeSymbolInfo,
  operationMode,
}: DefaultCoinChartProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const isMarketOpen = marketStatus === "OPEN";

  const marketCloseColor = !isMarketOpen ? "#FF025C" : undefined;

  const iconMode = getOperationModeIcon(operationMode, marketCloseColor);

  return (
    <Stack
      direction="row"
      spacing={1}
      sx={{
        alignItems: "center",
        alignSelf: "center",
        justifyContent: center ? "center" : "flex-start",
      }}
    >
      <img
        src={image}
        style={{ width: 40, height: 40 }}
        alt={name}
      />

      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-start",
          justifyContent: "flex-start",
          marginLeft: "0 !important",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          {(!isMobile || currentSymbol) && (
            <Typography
              color="#EFEFEF"
              fontSize={14}
              fontWeight={800}
              whiteSpace="nowrap"
              overflow="hidden"
              textOverflow="ellipsis"
            >
              {name}
            </Typography>
          )}

          <Stack direction="row" alignItems="center" gap={0.5}>
            {iconMode}

            <Typography
              color="#CCCCCC"
              textOverflow="ellipsis"
              textAlign="left"
              textTransform="capitalize"
              fontSize={12}
              fontWeight={500}
            >
              {typeSymbolInfo}
            </Typography>
          </Stack>
        </Box>

        {ping && (
          <Box width={20} height={20}>
            <PusingDot isMarketOpen={isMarketOpen} />
          </Box>
        )}
      </Box>
    </Stack>
  );
}
