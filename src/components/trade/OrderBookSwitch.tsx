import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import { CircularProgress, Stack, Typography } from "@mui/material";
import numeral from "numeral";
import useOrderBook from "src/hooks/useOrderBook";

export default function OrderBookSwitch({
  isLoading,
}: {
  isLoading?: boolean;
}) {
  const { bookRed, bookGreen } = useOrderBook();

  const totalRed = bookRed.reduce((acc, item) => acc + item.invest, 0);
  const totalGreen = bookGreen.reduce((acc, item) => acc + item.invest, 0);

  return (
    <Stack
      direction="row"
      justifyContent="center"
      alignItems="center"
      sx={{
        px: 2,
        backgroundColor: "#060f14",
        padding: "0.5rem 0",
        gap: "0.5rem",
      }}
    >
      {isLoading ? (
        <CircularProgress color="primary" size={24} />
      ) : (
        <>
          <Typography
            align="center"
            fontWeight={400}
            fontSize={14}
            display={"flex"}
            alignItems={"center"}
            gap={0.5}
            color={"#00DB97"}
          >
            {numeral(totalGreen).format("$0,0.00")} <TrendingUpIcon />
          </Typography>
          <Typography variant="subtitle1" fontWeight={600} color="#475760">
            VS
          </Typography>
          <Typography
            align="center"
            fontWeight={400}
            fontSize={14}
            display={"flex"}
            alignItems={"center"}
            gap={0.5}
            color={"#ff2370"}
          >
            {numeral(totalRed).format("$0,0.00")} <TrendingDownIcon />
          </Typography>
        </>
      )}
    </Stack>
  );
}
