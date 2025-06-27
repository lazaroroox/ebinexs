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
import { TbTrashXFilled } from "react-icons/tb";

import DeleteAccountModal from "src/components/modals/DeleteAccountModal";
import TitleWithCircleIcon from "src/components/TitleWithCircleIcon";
import LayoutContext from "src/contexts/LayoutContext";
import { apiPost } from "src/services/apiService";

export default function DeleteAccount() {
  const { t } = useTranslation("dashboard");
  const { setModalDeleteAccountModal } = useContext(LayoutContext);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isMobile900 = useMediaQuery(theme.breakpoints.down("md"));

  const handleRequestCodeDeleteAccount = async () => {
    await apiPost("/users/delete/requestCode", {});
    setModalDeleteAccountModal(true);
  };

  return (
    <>
      <Stack
        direction={isMobile ? "column" : "row"}
        spacing={2}
        justifyContent="space-between"
        alignItems="center"
      >
        <Box>
          <TitleWithCircleIcon
            label={t("delete_account")}
            description={t("delete_account_description")}
            descriptionColor="#7f8b92"
            fontSize={14}
            fontWeight="400"
            icon={<TbTrashXFilled size={26} />}
            circleSize={40}
          />
        </Box>

        <Button
          variant="contained"
          sx={{ width: isMobile900 ? "100%" : "100px" }}
          onClick={() => handleRequestCodeDeleteAccount()}
        >
          <Typography variant="body1">{t("delete")}</Typography>
        </Button>
      </Stack>
      <DeleteAccountModal />
    </>
  );
}
