import numeral from "numeral";
import { FaCircle } from "react-icons/fa";
import { Stack, Typography, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import InformationIcon from "./InformationIcon";

const BonusWithdrawalText = ({ balanceComplete }: { balanceComplete: any }) => {
  const theme = useTheme();
  const { t } = useTranslation("max_pix_volume_text");

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Stack
      direction={isMobile ? "column" : "row"}
      justifyContent="space-between"
    >
      <Stack direction="row" alignItems="center" spacing={0.5}>
        <FaCircle size={8} color="#01db97" />
        <Typography
          variant="body1"
          sx={{
            display: "flex",
            fontSize: 12,
            alignItems: "center",
            color: "#FFF",
            gap: "0.25rem",
            justifyContent: "flex-end",
          }}
        >
          {t("available_withdrawal")}:
          <span style={{ color: "#01db97", fontWeight: 500 }}>
            ${numeral(balanceComplete?.availableForWithdrawal).format("0,0.00")}
          </span>
        </Typography>
      </Stack>
      {balanceComplete?.pendingCompletionBonuses.length > 0 && (
        <Stack direction="row" alignItems="center" spacing={0.5}>
          <FaCircle size={8} color="#fd9400" />
          <Typography
            variant="body1"
            sx={{
              display: "flex",
              fontSize: 12,
              alignItems: "center",
              color: "#FFF",
              gap: "0.25rem",
              justifyContent: "flex-end",
            }}
          >
            {t("bonus")}:
            <span style={{ color: "#fd9400", fontWeight: 500 }}>
              $
              {numeral(
                balanceComplete?.pendingCompletionBonuses[0]?.bonusAmount
              ).format("0,0.00")}
            </span>
          </Typography>

          <InformationIcon
            text={`Você precisa operar $${balanceComplete?.pendingCompletionBonuses[0]?.pendingVolume} para liberar o saque do bônus ($${balanceComplete?.pendingCompletionBonuses[0]?.bonusAmount}) da campanha.`}
          />
        </Stack>
      )}
    </Stack>
  );
};

export default BonusWithdrawalText;
