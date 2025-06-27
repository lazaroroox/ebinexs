import { Close } from "@mui/icons-material";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import {
  Button,
  IconButton,
  Modal,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Box } from "@mui/system";
import { useTranslation } from "react-i18next";

const style = {
  color: "#EEE",
  display: "flex",
  justifyContent: "center",
  flexDirection: "column",

  "& .modal_content": {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    maxWidth: 350,
    width: "80%",
    border: "1px solid #0b151a",
    background: "#03090c",
    padding: "2rem",
    borderRadius: "12px",
  },
  "& fieldset": {
    border: "none",
    outline: "none",
  },
};

type PendingBonusesConfirmModalProps = {
  open: boolean;
  onConfirm: (e: any) => void;
  onClose: (bool: boolean) => void;
};

function PendingBonusesConfirmModal({
  open,
  onConfirm,
  onClose,
}: PendingBonusesConfirmModalProps) {
  const { t } = useTranslation("dashboard");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Modal
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
      open={open}
      onClose={() => onClose(!open)}
      sx={style}
    >
      <Box sx={{ minWidth: isMobile ? "80%" : null }} className="modal_content">
        <Stack direction={"column"} spacing={2}>
          <IconButton
            aria-label="close"
            onClick={() => onClose(!open)}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <Close />
          </IconButton>

          <Stack direction={"row"} spacing={1}>
            <VerifiedUserIcon />
            <Typography>Atenção!</Typography>
          </Stack>
          <Stack direction={"column"} spacing={2}>
            <Typography>
              Ao solicitar o saque agora, você perderá qualquer bônus não
              liberado, pois não foram cumpridas todas as condições necessárias
              para a sua retirada.
            </Typography>
            <Typography>Você deseja continuar com o saque?</Typography>
          </Stack>
          <Stack direction={"row"} justifyContent="space-between" spacing={2}>
            <Button
              variant="contained"
              color="error"
              onClick={() => onClose(!open)}
            >
              {t("cancel")}
            </Button>
            <Button variant="contained" onClick={onConfirm}>
              {t("confirm")}
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Modal>
  );
}

export default PendingBonusesConfirmModal;
