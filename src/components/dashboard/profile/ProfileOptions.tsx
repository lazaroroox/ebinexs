import { Box, Button } from "@mui/material";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { BsExclamationCircleFill } from "react-icons/bs";
import { IoShieldCheckmark } from "react-icons/io5";
import TitleWithCircleIcon from "src/components/TitleWithCircleIcon";
import LayoutContext from "src/contexts/LayoutContext";
import useUser from "src/swr/use-user";
import { is2FAandKYCverified } from "src/utils/is2FAandKYCActive";
import AccountsDataAccordion from "./AccountsDataAccordion";

const style = {
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
  "& .MuiPaper-root": {
    background: "#070f14",
  },
  "& .protect_account_item": {
    p: "16px 24px",
    color: "#EEE",
    borderRadius: "8px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  "& .protect_account_button": {
    background: "#bc0d3a",
    height: "2.5rem",
    fontSize: "14px",
    fontWeight: "500",
    "&:hover": {
      background: "#d61243",
    },
  },
};

export default function ProfileOptions() {
  const { t } = useTranslation("profile_options");
  const { user } = useUser();
  const { setModalTwoStepVerificationModal } = useContext(LayoutContext);

  return (
    <Box sx={style}>
      <AccountsDataAccordion />
      <Box
        className="protect_account_item"
        sx={{
          background: is2FAandKYCverified(user?.using2fa, user?.verified)
            ? "#081517"
            : "#14040a",
          border: is2FAandKYCverified(user?.using2fa, user?.verified)
            ? "1px solid #01db97"
            : "1px solid #d2004b",
        }}
      >
        <TitleWithCircleIcon
          label={
            is2FAandKYCverified(user?.using2fa, user?.verified)
              ? t("account_protected")
              : t("account_at_risk")
          }
          description={
            is2FAandKYCverified(user?.using2fa, user?.verified)
              ? t("2fa_kyc_enabled")
              : !user?.using2fa
              ? t("enable_2fa")
              : t("complete_kyc")
          }
          fontSize={16}
          icon={
            is2FAandKYCverified(user?.using2fa, user?.verified) ? (
              <IoShieldCheckmark size={32} />
            ) : (
              <BsExclamationCircleFill size={32} color="#d2004b" />
            )
          }
          circleSize={40}
          color={
            is2FAandKYCverified(user?.using2fa, true) ? "#01db97" : "#d40f41"
          }
          noBgColor={true}
        />
        {!is2FAandKYCverified(user?.using2fa, true) && (
          <Button
            variant="contained"
            className="protect_account_button"
            onClick={() => setModalTwoStepVerificationModal(true)}
          >
            {t("protect_account")}
          </Button>
        )}
      </Box>
    </Box>
  );
}
