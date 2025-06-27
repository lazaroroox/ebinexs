import {
  Box,
  Button,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { IoMdKey } from "react-icons/io";
import TitleWithCircleIcon from "src/components/TitleWithCircleIcon";
import LayoutContext from "src/contexts/LayoutContext";
import useAuth from "src/hooks/useAuth";
import { apiPost } from "src/services/apiService";
import useUser from "src/swr/use-user";
import { notifySuccess } from "src/utils/toast";

export default function SecurityForm() {
  const { t } = useTranslation("dashboard");
  const { initialize } = useAuth();
  const { user, mutate } = useUser();
  const theme = useTheme();
  const { setModalTwoStepVerificationModal } = useContext(LayoutContext);

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isMobile900 = useMediaQuery(theme.breakpoints.down("md"));

  const handleDisable2fa = async () => {
    try {
      await apiPost("users/disable2fa", {});
      await initialize();
      notifySuccess(t("two_factor_authentication_disabled_success"));
      mutate();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Stack
      direction={isMobile ? "column" : "row"}
      justifyContent="space-between"
      alignItems="center"
      spacing={2}
    >
      <Box>
        <TitleWithCircleIcon
          label={t("two_factor_authentication")}
          description={t("two_factor_authentication_description")}
          descriptionColor="#7f8b92"
          fontSize={14}
          fontWeight="400"
          icon={<IoMdKey size={28} />}
          circleSize={40}
        />
      </Box>
      {!user?.using2fa ? (
        <Button
          variant="contained"
          onClick={() => setModalTwoStepVerificationModal(true)}
          sx={{ width: isMobile900 ? "100%" : "100px" }}
        >
          <Typography variant="body1">{t("enable")}</Typography>
        </Button>
      ) : (
        <Button
          variant="outlined"
          onClick={handleDisable2fa}
          sx={{
            width: isMobile900 ? "100%" : "100px",
            backgroundColor: "#ff025c",
            borderColor: "#ff025c",
            color: "#FFF",
            padding: "0.5rem 1.5rem",
            "&:hover": {
              backgroundColor: "#c60045",
            },
          }}
        >
          <Typography variant="body1">{t("disable")}</Typography>
        </Button>
      )}
    </Stack>
  );
}
