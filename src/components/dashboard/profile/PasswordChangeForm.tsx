import {
  Box,
  Button,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { BsShieldLockFill } from "react-icons/bs";
import TitleWithCircleIcon from "src/components/TitleWithCircleIcon";
import ChangePasswordModal from "./ChangePasswordModal";

export default function PasswordChangeForm() {
  const { t } = useTranslation("dashboard");
  const [openModal, setOpenModal] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isMobile900 = useMediaQuery(theme.breakpoints.down("md"));

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  return (
    <Box>
      <Stack
        direction={isMobile ? "column" : "row"}
        spacing={2}
        alignItems={"center"}
        justifyContent={"space-between"}
      >
        <TitleWithCircleIcon
          label={t("password_access")}
          description={t("password_access_description")}
          descriptionColor="#7f8b92"
          fontSize={14}
          fontWeight="400"
          icon={<BsShieldLockFill size={22} />}
          circleSize={40}
        />
        <Button
          variant="contained"
          onClick={() => setOpenModal(true)}
          sx={{ width: isMobile900 ? "100%" : "100px" }}
        >
          <Typography variant="body1">{t("change")}</Typography>
        </Button>
      </Stack>

      <ChangePasswordModal
        openModal={openModal}
        handleClose={handleCloseModal}
      />
    </Box>
  );
}
