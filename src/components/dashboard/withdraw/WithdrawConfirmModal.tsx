import { Close } from "@mui/icons-material";
import {
  Box,
  Button,
  IconButton,
  Modal,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { IoShieldCheckmark } from "react-icons/io5";
import useUser from "src/swr/use-user";

const style = {
  width: "100%",
  maxWidth: 350,
  color: "#FFF",
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  border: "1px solid #01db97",
  background: "#06101285",
  padding: " 2rem",
  outline: "none",
  borderRadius: "12px",
  backdropFilter: "blur(7px)",

  "& .title": {
    fontSize: "1.25rem",
    fontWeight: "500",
  },
  "& .confirm_button": {
    background: "#00bc81",
    transition: "transform 0.4s ease-in-out",

    "&:disabled": {
      color: "#CCC",
      background: "#3d3d3d",
    },
    "&:hover": {
      transform: "translateY(-2px)",
    },
  },
};
type WithdrawConfirmModalProps = {
  open: boolean;
  value: string;
  onChange: (code: string) => void;
  onConfirm: (e: any) => void;
  onClose: (bool: boolean) => void;
};

function WithdrawConfirmModal({
  open,
  value,
  onChange,
  onConfirm,
  onClose,
}: WithdrawConfirmModalProps) {
  const { t } = useTranslation("dashboard");
  const { user } = useUser();

  return (
    <Modal
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
      open={open}
    >
      <Box sx={style}>
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
            <IoShieldCheckmark size={32} color="#01db97" />

            <Typography className="title">Autenticação</Typography>
          </Stack>
          <Typography fontSize={16} pb={2}>
            {user?.using2fa
              ? "Por favor, insira o código de 6 dígitos gerado pelo seu aplicativo autenticador."
              : "Por favor, insira o código de 6 dígitos enviado para o seu e-mail."}
          </Typography>
          <TextField
            id="code"
            name="code"
            label={t("Código")}
            placeholder={"Digite o código de 6 dígitos"}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            fullWidth
            type="text"
            variant="outlined"
          />
          <Stack spacing={1}>
            <Button
              disabled={value === ""}
              className="confirm_button"
              variant="contained"
              fullWidth
              size="large"
              onClick={onConfirm}
            >
              {value === "" ? "Preencha o código" : t("confirm")}
            </Button>
            <Button
              variant="text"
              fullWidth
              size="large"
              onClick={() => onClose(!open)}
              sx={{ color: "#AAA" }}
            >
              {t("cancel")}
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Modal>
  );
}

export default WithdrawConfirmModal;
