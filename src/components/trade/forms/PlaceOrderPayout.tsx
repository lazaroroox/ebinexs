import {
  Box,
  Grid,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import formatCurrency from "src/utils/formatCurrency";

interface PlaceOrderPayoutProps {
  amount: string;
  payout: number;
}

export function PlaceOrderPayout({ amount, payout }: PlaceOrderPayoutProps) {
  const { t } = useTranslation("dashboard");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const income = useMemo(() => {
    const numericAmount = parseFloat(amount);
    const estimateIncome = numericAmount * (payout / 100);
    return parseFloat(estimateIncome.toFixed(3));
  }, [amount, payout]);

  const payoutWithSymbol = useMemo(() => {
    if (payout > 0) {
      return `+${payout}%`;
    }

    return `-${payout}%`;
  }, [payout]);

  if (isMobile) {
    return (
      <Grid size={12}>
        <Stack
          direction="row"
          justifyContent="center"
          position="relative"
          borderRadius={2.25}
          height="fit-content"
        >
          <Stack
            direction="row"
            justifyContent="center"
            alignItems="center"
            gap={1}
            flex={1}
          >
            <Typography
              color="#EFEFEF"
              variant="caption"
              fontSize={14}
              fontWeight={600}
              lineHeight="20px"
            >
              {t("revenue")}
            </Typography>
            <Typography
              color="#00B474"
              variant="caption"
              fontSize={14}
              fontWeight={600}
              lineHeight="24px"
            >
              {formatCurrency(income)}
            </Typography>
          </Stack>
          <Stack
            direction="row"
            justifyContent="center"
            alignItems="center"
            gap={1}
            flex={1}
          >
            <Typography
              color="#EFEFEF"
              variant="caption"
              fontSize={14}
              fontWeight={600}
              lineHeight="20px"
            >
              Lucro
            </Typography>
            <Box borderRadius={30} bgcolor="#00B474" px={0.5} py={0.25}>
              <Typography
                color="#FFFFFF"
                variant="caption"
                fontSize={13}
                fontWeight={600}
              >
                {payoutWithSymbol}
              </Typography>
            </Box>
          </Stack>
        </Stack>
      </Grid>
    );
  }

  return (
    <Grid size={isMobile ? 12 : 6}>
      <Stack
        direction="row"
        justifyContent="center"
        position="relative"
        border="1px solid #00B474"
        borderRadius={2.25}
        height="fit-content"
        py={1.5}
      >
        <Box
          position="absolute"
          top={9}
          right={9}
          borderRadius={30}
          bgcolor="#00B474"
          px={0.75}
          py={0.25}
        >
          <Typography
            color="#FFFFFF"
            variant="caption"
            fontSize={13}
            fontWeight={600}
          >
            {payoutWithSymbol}
          </Typography>
        </Box>
        <Stack direction="column" justifyContent="center" alignItems="center">
          <Typography
            color="#EFEFEF"
            variant="caption"
            fontSize={12}
            fontWeight={600}
            lineHeight="20px"
          >
            {t("revenue")}
          </Typography>
          <Typography
            color="#00B474"
            variant="caption"
            fontSize={24}
            fontWeight={600}
            lineHeight="24px"
          >
            {`+${formatCurrency(income)}`}
          </Typography>
        </Stack>
      </Stack>
    </Grid>
  );
}
