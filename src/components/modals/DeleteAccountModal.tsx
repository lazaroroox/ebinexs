import { Close } from "@mui/icons-material";
import {
  Box,
  Button,
  IconButton,
  Modal,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme
} from "@mui/material";
import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { TbTrashXFilled } from "react-icons/tb";
import { useNavigate } from "react-router";
import avisoIcon from "src/assets/images/aviso.svg";
import AccountContext from "src/contexts/AccountContext";
import LayoutContext from "src/contexts/LayoutContext";
import useAuth from "src/hooks/useAuth";
import { apiDelete } from "src/services/apiService";
import useUser from "src/swr/use-user";
import { notifyError, notifySuccess } from "src/utils/toast";
import TitleWithCircleIcon from "../TitleWithCircleIcon";

const style = {
  "& .modal_content": {
    color: "#EEE",
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    maxWidth: 450,
    width: "80%",
    border: "1px solid #0b151a",
    background: "#03090c",
    padding: "2rem",
    borderRadius: "12px",
  },
  "& .password_rules": {
    padding: "1rem 0",
    display: "flex",
    gap: "0.5rem",
    flexDirection: "column",
    "& .rule": {
      display: "flex",
      gap: "0.5rem",
    },
  },
  "& .MuiInputBase-root": {
    borderRadius: "8px",
    padding: "0 1.5rem 0 0.5rem",
  },
  "& fieldset": {
    border: "none",
    outline: "none",
  },
  "& .advice": {
    padding: "1rem",
    borderRadius: "16px",
    background: "#081517",
    border: "1px solid #01db97",
  },
  "& .password_changed": {
    padding: "1rem",
    display: "flex",
    flexDirection: "column",
    gap: "2rem",
    "& .MuiBox-root": {
      alignItems: "center",
      textAlign: "center",
    },
  },
};

function DeleteAccountModal() {
  const { t } = useTranslation("dashboard");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const { logout } = useAuth();
  const { user } = useUser();
  const navigate = useNavigate();
  const { layout, setModalDeleteAccountModal } = useContext(LayoutContext);
  const { activeAccount } = useContext(AccountContext);

  const [reason, setReason] = useState("");
  const [code, setCode] = useState("");
  const [textPattern, setTextPattern] = useState("");
  const [step, setStep] = useState(1);

  const handleDeleteAccount = async () => {
    try {
      await apiDelete(
        `/users?validationCode=${code}&deletionReason=${reason}`,
        {}
      );
      setModalDeleteAccountModal(false);
      notifySuccess("Conta deletada com sucesso");
      await logout();
      navigate("/");
    } catch (error) {
      setModalDeleteAccountModal(false);
      notifyError("Falha ao tentar deletar conta");
      console.log(error);
    }
  };

  const handleNextStep = () => {
    switch (step) {
      case 1:
        setStep(2);
        break;
      case 2:
        setStep(3);
        break;
      case 3:
        handleDeleteAccount();
        break;
    }
  };

  const handleCloseModal = () => {
    setStep(1);
    setCode("");
    setTextPattern("");
    setModalDeleteAccountModal(false);
  };

  return (
    <Modal
      open={layout.modalDeleteAccount}
      onClose={handleCloseModal}
      sx={style}
    >
      <Box sx={{ minWidth: isMobile ? "80%" : null }} className="modal_content">
        <Stack direction={"column"} spacing={2}>
          <Box
            sx={{ borderBottom: "1px solid #0b151a", paddingBottom: "0.75rem" }}
          >
            <IconButton
              aria-label="close"
              onClick={handleCloseModal}
              sx={{
                position: "absolute",
                right: 8,
                top: 8,
                color: "#606f79",
                "&:hover": {
                  color: "#FFF",
                  background: "transparent",
                },
              }}
            >
              <Close />
            </IconButton>
            <TitleWithCircleIcon
              circleSize={40}
              fontSize={18}
              icon={<TbTrashXFilled size={24} />}
              label={t("delete_account")}
            />
          </Box>

          {step === 1 && (
            <>
              <Typography fontSize={14} fontWeight="400" color="#EEE">
                {t("delete_reason")}
              </Typography>
              <TextField
                id="reason"
                multiline
                rows={4}
                value={reason}
                variant="outlined"
                sx={{
                  "& .MuiInputBase-input": {
                    padding: "1rem 0.5rem",
                  },
                }}
                onChange={(e) => setReason(e.target.value)}
                placeholder={t("enter_the_reason_for_deletion")}
              />
            </>
          )}

          {step === 2 && (
            <Stack direction={"column"} spacing={2} textAlign={"center"}>
              <Box sx={{ display: "flex", justifyContent: "center", pt: 4 }}>
                <img
                  src={avisoIcon}
                  className="aviso_image"
                  alt="exclamation-icon"
                />
              </Box>
              <Box py={3}>
                <Typography variant="h6" fontWeight="500" color="#EEE">
                  {t("delete_account")}
                </Typography>
                <Typography fontSize={16} color="#7f8b92">
                  Aviso: isso excluirá permanentemente sua conta e todos os seus
                  dados da Ebinex.
                </Typography>
              </Box>
            </Stack>
          )}

          {step === 3 && (
            <>
              <Typography>
                Enviamos um código de 6 dígitos para o seu e-mail: <br />
                {user?.email}
              </Typography>

              <Typography>
                Para verificar, digite{" "}
                <span style={{ color: "#ff2873" }}>
                  confirmar exclusão da conta
                </span>{" "}
                abaixo.
              </Typography>
              <TextField
                type="text"
                name="verification"
                id="verification"
                required
                autoFocus={false}
                autoComplete="off"
                value={textPattern}
                onChange={(e) => setTextPattern(e.target.value)}
                fullWidth
                variant="outlined"
                placeholder="Digite a frase de verificação"
              />
              <TextField
                id="code"
                name="code"
                placeholder="Digite o código de 6 dígitos"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                fullWidth
                type="text"
                variant="outlined"
              />
            </>
          )}

          <Stack direction={"row"} justifyContent="space-between" spacing={2}>
            <Button
              variant="outlined"
              size="large"
              fullWidth
              sx={{
                color: "#4a4a4a",
                border: "1px solid #4a4a4a",
                "&:hover": {
                  color: "#CCC",
                  border: "1px solid #CCC",
                  background: "transparent",
                },
              }}
              onClick={handleCloseModal}
            >
              {t("cancel")}
            </Button>
            <Button
              variant="contained"
              size="large"
              fullWidth
              sx={
                step === 3
                  ? {
                      backgroundColor: "#FF025C",
                      "&:hover": {
                        backgroundColor: "#de004e",
                      },
                    }
                  : {}
              }
              onClick={handleNextStep}
              disabled={
                step === 3 &&
                (textPattern !== "confirmar exclusão da conta" ||
                  code.length !== 6)
              }
            >
              {t("confirm")}
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Modal>
  );
}

export default DeleteAccountModal;
