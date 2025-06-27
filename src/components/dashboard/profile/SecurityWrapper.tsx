import { Box, Grid, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { BsExclamationCircleFill } from "react-icons/bs";
import { FaCircleCheck } from "react-icons/fa6";
import TitleWithCircleIcon from "src/components/TitleWithCircleIcon";
import useUser from "src/swr/use-user";
import { is2FAandKYCverified } from "src/utils/is2FAandKYCActive";
import DeleteAccount from "./DeleteAccount";
import PasswordChangeForm from "./PasswordChangeForm";
import SecurityForm from "./SecurityForm";
import SecurityVerification from "./SecurityVerification";
import VerificationKYC from "./VerificationKYC";
import WhitelistWallets from "./WhitelistWallets";

const security_box_style = {
  textAlign: "center",
  background: "#070f14",
  padding: "3rem 1.5rem",
  borderRadius: "16px",
  "& .MuiBox-root": {
    alignItems: "center",
  },
};

const style = {
  background: "#070f14",
  padding: "2rem",
  borderRadius: "16px",

  "& .title": {
    color: "#EEE",
    fontWeight: 500,
    fontSize: "1rem",
    paddingBottom: "1rem",
    marginBottom: "2rem",
    borderBottom: "1px solid #111d22",
  },
  "& .advanced_security": {
    display: "flex",
    flexDirection: "column",
    gap: "2rem",
  },
};
const SecurityWrapper = () => {
  const { t } = useTranslation("dashboard");
  const { t: tSecurity } = useTranslation("security_verification");

  const { user } = useUser();

  const RenderAccountSecureBox = () => {
    return is2FAandKYCverified(user?.using2fa, user?.verified) ? (
      <TitleWithCircleIcon
        label={tSecurity("account_safe.label")}
        fontSize={16}
        fontWeight="500"
        description={tSecurity("account_safe.description")}
        flexDirection="column"
        descriptionColor="#7f8b92"
        circleSize={70}
        icon={<FaCircleCheck size={44} />}
      />
    ) : (
      <TitleWithCircleIcon
        label={tSecurity("account_at_risk.label")}
        fontSize={16}
        fontWeight="500"
        description={tSecurity("account_at_risk.description")}
        flexDirection="column"
        descriptionColor="#7f8b92"
        circleSize={70}
        bgColor="#2a0714"
        icon={<BsExclamationCircleFill color="#ff0059" size={44} />}
      />
    );
  };

  return (
    <Grid
      container
      spacing={2}
      sx={{
        mt: 1,
        justifyContent: "center",
      }}
    >
      <Grid size={{ xs: 12, md: 3.5 }}>
        <Box sx={security_box_style}>
          <RenderAccountSecureBox />
        </Box>
      </Grid>

      <Grid size={{ xs: 12, md: 8.5 }}>
        <SecurityVerification />
        <WhitelistWallets />
        <Box sx={style}>
          <Typography className="title">{t("advanced_security")}</Typography>
          <Box className="advanced_security">
            <SecurityForm />
            <VerificationKYC />
            <PasswordChangeForm />
            <DeleteAccount />
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default SecurityWrapper;
