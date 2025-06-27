import { Box, Grid, Stack, useMediaQuery, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";
import { AiFillSecurityScan } from "react-icons/ai";
import {
  BsExclamationCircleFill
} from "react-icons/bs";
import { FaCircleCheck } from "react-icons/fa6";
import { Check2FAandKYCToChangeColor } from "src/components/Check2FAandKYCToChangeColor";
import TitleWithCircleIcon from "src/components/TitleWithCircleIcon";
import useUser from "src/swr/use-user";
import { is2FAandKYCverified } from "src/utils/is2FAandKYCActive";

const style = {
  p: 4,
  background: "#070f14",
  color: "#EEE",
  borderRadius: "16px",
  "& .warning_box": {
    padding: "1rem",
    marginTop: "1rem",
    borderRadius: "12px",
  },
  "& .title": {
    color: "#EEE",
    fontWeight: 500,
    fontSize: "1rem",
    paddingBottom: "1rem",
    marginBottom: "2rem",
    borderBottom: "1px solid #111d22",
  },
};

const SecurityVerification = () => {
  const { t } = useTranslation("security_verification");
  const { user } = useUser();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const RenderAccountSecureBox = () => {
    return is2FAandKYCverified(user?.using2fa, user?.verified) ? (
      <TitleWithCircleIcon
        label={t("account_safe.label")}
        fontSize={16}
        fontWeight="500"
        noBgColor
        description={t("account_safe.details")}
        descriptionColor="#BBB"
        circleSize={40}
        icon={<FaCircleCheck size={32} />}
      />
    ) : (
      <TitleWithCircleIcon
        label={t("account_at_risk.label")}
        fontSize={16}
        fontWeight="500"
        noBgColor
        description={
          !user?.using2fa
            ? t("account_at_risk.details_2fa")
            : t("account_at_risk.details_kyc")
        }
        descriptionColor="#BBB"
        circleSize={40}
        bgColor="#2a0714"
        icon={<BsExclamationCircleFill color="#ff0059" size={32} />}
      />
    );
  };

  return (
    <Grid size={{ xs: 12 }}>
      <Box sx={style}>
        <Stack
          direction={isMobile ? "column" : "row"}
          justifyContent={"space-between"}
          spacing={2}
          borderBottom={"1px solid #111d22"}
          pb={2}
        >
          <TitleWithCircleIcon
            label={t("title")}
            fontSize={16}
            circleSize={48}
            icon={<AiFillSecurityScan size={28} />}
          />
          <Box className="flex_center" gap={2}>
            <Check2FAandKYCToChangeColor
              label={t("2fa_label")}
              isUsingWhat={user?.using2fa}
            />
            <Check2FAandKYCToChangeColor
              label={t("kyc_label")}
              isUsingWhat={user?.verified}
            />
          </Box>
        </Stack>
        <Box
          className="warning_box"
          sx={{
            background: is2FAandKYCverified(user?.using2fa, user?.verified)
              ? "#081517"
              : "#14040a",
            border: is2FAandKYCverified(user?.using2fa, user?.verified)
              ? "1px solid #01db97"
              : "1px solid #d2004b",
          }}
        >
          <RenderAccountSecureBox />
        </Box>
      </Box>
    </Grid>
  );
};

export default SecurityVerification;
