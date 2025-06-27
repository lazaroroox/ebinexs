import { Box, Typography, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import usePixTransactionVolumeNew from "src/swr/use-pix-transaction-volume-new";
import formatCurrencyBRL from "src/utils/formatCurrencyBRL";
import InformationIcon from "./InformationIcon";

const MaxPixVolumeText = ({
  children,
  totalVolume,
}: {
  children?: ReactNode;
  totalVolume: number;
}) => {
  const theme = useTheme();
  const { t } = useTranslation("max_pix_volume_text");

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        flexDirection: isMobile ? "column" : "row",
      }}
    >
      {children}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
        }}
      >
        <Typography
          variant="body2"
          sx={{
            display: "flex",
            alignItems: "center",
            color: "#AAA",
            gap: "0.25rem",
            justifyContent: "flex-end",
          }}
        >
          {t("monthly_volume")}
          <Box
            component={"span"}
            sx={{
              color: totalVolume > 125000 ? "#fd9400" : "#FFF",
              margin: 0,
            }}
          >
            {`${formatCurrencyBRL(totalVolume)}`}
          </Box>
          <span>/</span>
          {t("max_limit")}
          <InformationIcon text={t("info_text")} />
        </Typography>
      </Box>
    </Box>
  );
};

export default MaxPixVolumeText;
