// MarketClosedCard.tsx
import { Box, Button, Stack, Typography } from "@mui/material";
import LinearProgress from "@mui/material/LinearProgress";
import allSymbols from "src/assets/data/allSymbols.json";
import PusingDot from "src/components/custom/lottie/PusingDot";
import { useSymbolMenu } from "src/contexts/SymbolMenuContext";
import useApiData from "src/hooks/useApiData";
import { useMarketTimer } from "src/hooks/useMarketTimer";
import { SymbolSelected } from "src/types/symbol";

interface Props {
  selectedSymbolData: SymbolSelected;
}

export default function MarketClosedCard({ selectedSymbolData }: Props) {
  const symbolItem = allSymbols.find(
    ({ ticker }) => ticker === selectedSymbolData.symbol
  );

  const { handleOpen } = useSymbolMenu();

  const { closedUntil, opensIn, progress } = useMarketTimer(
    symbolItem.session_template,
    symbolItem.timezone
  );

  const { operationMode } = useApiData();

  const { symbol, symbolType, image } = selectedSymbolData;

  const mode =
    operationMode === "RETRACTION_ENDTIME" ? "Retração" : "Novas opções";
  return (
    <Stack direction="column" gap={2} p={2} color="#FFFFFF" borderRadius={2}>
      <Stack direction="row" alignItems="center">
        <img src={image} width={40} height={40} alt="" />

        <Stack>
          <Stack direction="row" alignItems="center" gap={1}>
            <Typography fontWeight={800} fontSize={13} color="#EFEFEF">
              {symbol}
            </Typography>

            <Box width={20} height={20}>
              <PusingDot isMarketOpen={false} />
            </Box>
          </Stack>
          <Stack direction="row" gap={0.5}>
            <Typography fontWeight={500} fontSize={12} color="#CCCCCC">
              {symbolType}
            </Typography>
            <Typography
              component="span"
              color="#868686"
              fontSize={10}
              fontWeight={500}
            >
              •
            </Typography>
            <Typography component="span" color="#808080">
              {mode}
            </Typography>
          </Stack>
        </Stack>
      </Stack>

      <Typography
        fontWeight={700}
        fontSize={22}
        lineHeight="29px"
        letterSpacing="1px"
      >
        O mercado de {symbolType.toLowerCase()} está fechado até {closedUntil}
      </Typography>

      <Stack direction="column" gap={1}>
        <Stack direction="row" justifyContent="space-between">
          <Typography fontWeight={600} fontSize={14}>
            Abre em:
          </Typography>
          <Typography fontWeight={600} fontSize={14}>
            {opensIn}
          </Typography>
        </Stack>
        <LinearProgress
          variant="determinate"
          value={progress < 0 ? 100 : progress}
          sx={{
            [`& .MuiLinearProgress-root`]: {
              backgroundColor: "#00B474 !important",
            },
            transform: "scaleX(-1)",
          }}
        />
      </Stack>

      <Typography fontWeight={400} fontSize={15} mb={2}>
        Você pode explorar ativos disponíveis enquanto isso.
      </Typography>

      <Button
        fullWidth
        variant="contained"
        sx={{
          textTransform: "none",
          fontWeight: 600,
          bgcolor: "#00B474",
          "&:hover": { bgcolor: "#00A268" },
        }}
        onClick={handleOpen}
      >
        Explorar
      </Button>
    </Stack>
  );
}
