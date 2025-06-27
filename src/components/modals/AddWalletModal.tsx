import { Close } from "@mui/icons-material";
import {
  Box,
  Button,
  IconButton,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { ChangeEvent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { AiOutlinePlus } from "react-icons/ai";
import {
  RiCheckboxBlankCircleFill,
  RiCheckboxBlankCircleLine,
} from "react-icons/ri";
import { apiPost } from "src/services/apiService";
import { DEPOSIT_METHOD_BUTTON_LIST } from "src/utils/constants";
import { isValidCPF } from "src/utils/isValidCPF";
import { notifyError, notifySuccess } from "src/utils/toast";
import TitleWithCircleIcon from "../TitleWithCircleIcon";
import { formatCellphone, formatCnpj, formatCpf } from "src/utils/formatters";

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
  "& .transaction_type_row": {
    background: "#070f14",
    justifyContent: "space-between",
    alignItems: "center",
    height: "56px",
    padding: "0 1rem",
    borderRadius: "12px",
    cursor: "pointer",
    "&:hover": {
      background: "#071117",
    },
  },
};

const keyTypeMock = [
  { id: 1, value: "EMAIL", label: "Email" },
  { id: 2, value: "CPF", label: "CPF" },
  { id: 3, value: "CNPJ", label: "CNPJ" },
  { id: 4, value: "PHONE", label: "Celular" },
  { id: 5, value: "RANDOM", label: "Chave Aleatória" },
];

interface AddWalletModalProps {
  openNewWalletModal: boolean;
  handleCloseModal: () => void;
  getWallets: () => void;
}

function AddWalletModal({
  openNewWalletModal,
  handleCloseModal,
  getWallets,
}: AddWalletModalProps) {
  const { t } = useTranslation("dashboard");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [step, setStep] = useState(1);
  const [walletType, setWalletType] = useState<"pix" | "crypto">("pix");
  const [pixKeyType, setPixKeyType] = useState("EMAIL");
  const [pixKey, setPixKey] = useState("");
  const [pixKeyError, setPixKeyError] = useState("");
  const [asset, setAsset] = useState("USDT");
  const [network, setNetwork] = useState("ERC20");
  const [address, setAddress] = useState("");

  const handleChangeWalletType = (type: "pix" | "crypto") => {
    setWalletType(type);
  };

  const handleClean = () => {
    setPixKey("");
    setPixKeyType("EMAIL");
    setPixKeyError("");
    setAsset("USDT");
    setNetwork("ERC20");
  };

  const handleNextStep = () => {
    switch (step) {
      case 1:
        setStep(2);
        break;
      case 2:
        handleSubmitForm();
        break;
    }
  };

  const handleSubmitForm = async () => {
    const cleanPixKey = ["CPF", "CNPJ", "PHONE"].includes(pixKeyType)
      ? pixKey.replace(/\D/g, "")
      : pixKey;

    if (pixKeyType === "CPF" && !isValidCPF(cleanPixKey)) {
      setPixKeyError("CPF inválido");
      return;
    }

    let newData = {
      ...(walletType === "pix"
        ? { pixKeyType: pixKeyType, pixKey: cleanPixKey }
        : { asset: asset, network: network, address: address }),
    };

    try {
      await apiPost("users/withdrawalAddress/whitelist", newData);
      notifySuccess(t("add_wallet_success"));
      if (getWallets) {
        await getWallets();
      }
    } catch (error) {
      if (error === "WithdrawalAddressAlreadyRegisteredForThisUserException") {
        notifyError("Tipo de wallet já cadastrado");
        return;
      }
      notifyError("Por favor, digite um endereço para a carteira");
      throw error;
    }

    setAddress("");
    setPixKey("");
    setNetwork("");
    setPixKeyType("CPF");
    setWalletType("pix");
    closeModal();
  };

  const closeModal = () => {
    setStep(1);
    handleClean();
    handleCloseModal();
  };

  const handleChangePixKeyType = (e: SelectChangeEvent) => {
    setPixKeyType(e.target.value as string);
  };

  const handleChangeAsset = (e: SelectChangeEvent) => {
    setAsset(e.target.value as string);
  };

  const handleChangeNetwork = (e: SelectChangeEvent) => {
    setNetwork(e.target.value as string);
  };

  const handleChangeAddress = (e: ChangeEvent<HTMLInputElement>) => {
    setAddress(e.target.value);
  };

  const handleChangePixKey = (e: ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    const numeric = input.replace(/\D/g, "");

    if (pixKeyType === "CPF") {
      setPixKey(formatCpf(numeric.slice(0, 11)));
    } else if (pixKeyType === "CNPJ") {
      setPixKey(formatCnpj(numeric.slice(0, 14)));
    } else if (pixKeyType === "PHONE") {
      setPixKey(formatCellphone(numeric));
    } else {
      setPixKey(input);
    }

    setPixKeyError("");
  };

  return (
    <Modal open={openNewWalletModal} onClose={closeModal} sx={style}>
      <Box sx={{ minWidth: isMobile ? "80%" : null }} className="modal_content">
        <Stack direction={"column"} spacing={2}>
          <Box
            sx={{ borderBottom: "1px solid #0b151a", paddingBottom: "0.75rem" }}
          >
            <IconButton
              aria-label="close"
              onClick={closeModal}
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
              icon={<AiOutlinePlus size={24} />}
              label={t("add_new_wallet")}
            />
          </Box>

          {step === 1 && (
            <>
              <Typography fontSize={14} fontWeight="400" color="#EEE">
                {t("type_choose")}:
              </Typography>

              <Stack spacing={1}>
                {DEPOSIT_METHOD_BUTTON_LIST.map((item) => (
                  <Stack
                    key={item.id}
                    direction="row"
                    className="transaction_type_row"
                    onClick={() =>
                      handleChangeWalletType(item.id as "pix" | "crypto")
                    }
                  >
                    <Stack direction="row" alignItems="center">
                      <Box>
                        <img
                          src={item.imageSrc}
                          className="transaction_icon"
                          width={item.id === "pix" ? 32 : 48}
                        />
                      </Box>
                      <Typography
                        fontSize={14}
                        fontWeight="400"
                        color="#EEE"
                        ml={item.id === "pix" ? 1 : 0}
                      >
                        {t(item.title)}
                      </Typography>
                    </Stack>

                    {walletType === item.id ? (
                      <RiCheckboxBlankCircleFill size={16} color="#01db97" />
                    ) : (
                      <RiCheckboxBlankCircleLine size={16} />
                    )}
                  </Stack>
                ))}
              </Stack>
            </>
          )}

          {step === 2 &&
            (walletType === "pix" ? (
              <>
                <Stack spacing={1}>
                  <InputLabel id="type">{t("type")}</InputLabel>
                  <Select
                    labelId="type"
                    value={pixKeyType}
                    onChange={handleChangePixKeyType}
                  >
                    {keyTypeMock.map((key) => (
                      <MenuItem key={key.id} value={key.value}>
                        {key.label}
                      </MenuItem>
                    ))}
                  </Select>
                </Stack>

                <Stack spacing={1}>
                  <InputLabel>{t("pixKey")}</InputLabel>
                  <TextField
                    fullWidth
                    value={pixKey}
                    onChange={handleChangePixKey}
                    error={!!pixKeyError}
                    helperText={pixKeyError}
                    inputProps={{
                      inputMode: ["CPF", "CNPJ", "PHONE"].includes(pixKeyType)
                        ? "numeric"
                        : "text",

                      maxLength:
                        pixKeyType === "CPF"
                          ? 14
                          : pixKeyType === "CNPJ"
                          ? 18
                          : pixKeyType === "TELEFONE"
                          ? 15
                          : undefined,
                    }}
                  />
                </Stack>
              </>
            ) : (
              <>
                <Stack spacing={1}>
                  <InputLabel id="asset">{t("asset")}</InputLabel>
                  <Select
                    labelId="asset"
                    value={asset}
                    label="Asset"
                    onChange={handleChangeAsset}
                  >
                    <MenuItem value={"USDT"}>USDT</MenuItem>
                  </Select>
                </Stack>

                <Stack spacing={1}>
                  <InputLabel id="network">{t("network")}</InputLabel>
                  <Select
                    labelId="network"
                    value={network}
                    onChange={handleChangeNetwork}
                  >
                    <MenuItem value={"ERC20"}>ERC20</MenuItem>
                    <MenuItem value={"TRC20"}>TRC20</MenuItem>
                    <MenuItem value={"BEP20"}>BEP20</MenuItem>
                  </Select>
                </Stack>

                <Stack spacing={1}>
                  <InputLabel id="network">{t("address")}</InputLabel>
                  <TextField
                    fullWidth
                    value={address}
                    onChange={handleChangeAddress}
                  />
                </Stack>
              </>
            ))}

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
          >
            {t("confirm")}
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
}

export default AddWalletModal;
