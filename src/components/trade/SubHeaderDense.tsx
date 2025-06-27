import { Box, Stack, Typography } from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import type { FC } from "react";

import numeral from "numeral";

import useApiData from "../../hooks/useApiData";
// import useApiData from '../../hooks/useApiData';
import { useTranslation } from "react-i18next";
import useAvailableSymbols from "src/swr/use-available-symbols";
import MenuSelectSymbol from "../menus/MenuSelectSymbol";
import SelectSymbolSkeleton from "../skeleton/SelectSymbolSkeleton";

const icons = {
  Btc: "/static/icons/btc-usdt.png",
};

const TitleStyled = styled(Typography)(({ theme }) => ({
  fontFamily: theme.typography.fontFamily,
  fontWeight: theme.typography.fontWeightLight,
  letterSpacing: 0.5,
  color: theme.palette.text.secondary,
}));

const PriceStyled = styled(Typography)(({ theme }) => ({
  fontFamily: theme.typography.fontFamily,
  fontWeight: theme.typography.fontWeightMedium,
  textWrap: "nowrap",
  letterSpacing: 0.5,
  color: theme.palette.primary.contrastText,
  display: "flex",
  alignItems: "center",
  gap: "5px",
  height: "150%",
  "& img": {
    width: "20px",
  },
}));

const SubHeaderDense: FC = () => {
  const { t } = useTranslation("dashboard");

  const { getSelectedTickerBook } = useApiData();
  const { loading: loadingSymbols } = useAvailableSymbols();

  const theme = useTheme();

  const ticker = getSelectedTickerBook();

  numeral.locale("en");

  return (
    <Stack
      direction="row"
      flex={1}
      gap={1.5}
      px={1}
      alignItems="center"
      position="relative"
    >
      {loadingSymbols ? <SelectSymbolSkeleton /> : <MenuSelectSymbol />}

      <Box>
        <TitleStyled fontSize=".75rem">24h {t("volume")}</TitleStyled>
        <PriceStyled fontSize=".75rem">
          {`${numeral(ticker?.volume.volume).format("$ 0,0.00")}`}
        </PriceStyled>
      </Box>
    </Stack>
  );
};

export default SubHeaderDense;
