import {
  Box,
  Button,
  InputLabel,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useFormik } from "formik";
import numeral from "numeral";
import { useContext, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { BiSolidWallet } from "react-icons/bi";
import { HiOutlineSwitchHorizontal } from "react-icons/hi";
import { IoIosArrowDown } from "react-icons/io";
import { IoCopy } from "react-icons/io5";
import { MdCandlestickChart } from "react-icons/md";
import TetherIcon from "src/assets/images/icons/tether.png";
import MaxPixVolumeText from "src/components/MaxPixVolumeText";
import RequireDocumentValidate from "src/components/modals/RequireDocumentValidate";
import SensitiveInfo from "src/components/SensitiveInfo";
import TitleWithCircleIcon from "src/components/TitleWithCircleIcon";
import AccountContext from "src/contexts/AccountContext";
import useApiData from "src/hooks/useApiData";
import { apiGet } from "src/services/apiService";
import useAccountsBalance from "src/swr/use-accounts-balance";
import usePixTransactionVolume from "src/swr/use-pix-transaction-volume";
import usePixTransactionVolumeNew from "src/swr/use-pix-transaction-volume-new";
import useUser from "src/swr/use-user";
import { User } from "src/types/user";
import { isValidCPF } from "src/utils/isValidCPF";
import { NumericOnlyWithFloat } from "src/utils/numericOnly";
import { notifyError } from "src/utils/toast";
import * as Yup from "yup";
import ChooseAccountModal from "./ChooseAccountModal";
import CountdownMinutes from "./CountdownMinutes";
import useBalanceComplete from "src/swr/use-balance-complete";

const style = {
  color: "#EEE",
  backgroundColor: "#070f14",
  padding: "2rem",
  borderRadius: "16px",

  "& .input_value": {
    width: "100%",
    marginBottom: "0.5rem",
    "& .MuiOutlinedInput-input": {
      padding: "1rem 0 !important",
      borderBottom: "1px solid #111e26",
    },
  },
  "& .choice_account_buttom": {
    width: "100%",
    minWidth: "100px",
    justifyContent: "space-between",
    border: "1px solid #111e26",
    padding: "0.5rem 1rem",
    borderRadius: "16px",
    background: "#0a141b",
    cursor: "pointer",
    "&:hover": {
      background: "#0c1820",
    },
  },
  "& .MuiInputBase-root": {
    background: "transparent",
  },

  "& .suggest_button": {
    color: "#EEE",
    outline: "1px solid #1f2f39",
    borderRadius: "24px",
    transition: "background 0.4s ease",
    fontWeight: "500",
    fontSize: "0.75rem",
    padding: "0.25rem 1rem",
    "&:hover": {
      outlineColor: " #1ac18c",
    },
  },

  "& .value_box_container": {
    position: "relative",
  },
  "& .switch_bullet": {
    padding: "0.5rem",
    background: "rgb(8 33 23)",
    color: "rgb(44 255 176)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%",
    position: "absolute",
    top: "42%",
    transform: "translateY(-50%)",
  },
  "& .value_box": {
    width: "100%",
    padding: "1rem 0",
    borderRadius: "16px",
    position: "relative",

    "& .error_message": {
      fontSize: "0.75rem",
      color: "#ff5959",
      position: "absolute",
      left: "50%",
      bottom: "8px",
      transform: "translateX(-50%)",
    },

    "& .image_coin": {
      position: "absolute",
      top: "50%",
      right: "16px",
      transform: "translateY(-50%)",
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
      padding: "30px 0 0",
      zIndex: "2",
    },

    "& input": {
      fontSize: "1.75rem",
      borderBottom: "1px solid #171f27",
      padding: "8px 0",
    },
  },

  "& .deposit_detail_haeder": {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    gap: "0.5rem",
    "& .time_ramaining_box": {
      color: "#FFF",
      background: "#0f1a21",
      padding: "0.5rem 1rem",
      display: "flex",
      gap: "0.5rem",
      borderRadius: "4px",
    },
  },
  "& .copy_id": {
    color: "#AAA",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    cursor: "pointer",
    background: "transparent",

    "&:hover": {
      color: "#01DB97",
      fill: "#01DB97",
    },
  },
  "& .copy_box": {
    width: "100%",
    maxWidth: "700px",
    marginTop: "1rem",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#0f1a21",
    padding: "0.5rem 1rem",
    borderRadius: "4px",

    "& svg": {
      cursor: "pointer",
      fill: "#01db97",
      transition: "transform 0.4s ease",
      "&:hover": {
        transform: "translateY(-4px)",
      },
    },
  },
  "& .qrcode_content_footer": {
    marginTop: 3,
    textAlign: "center",
    display: "flex",
    gap: "2rem",
    justifyContent: "center",

    "& .text": {
      color: "#798e9b",
      maxWidth: "400px",
      textAlign: "left",
    },
  },
};

type DepositPixFormProps = {
  depositDetail: any;
  handleCancel: () => void;
};

const INIT_USER_DATA = {
  name: "",
  cpf: "",
  amount: "",
  conversionRate: "",
};

const valuesPix = [150, 300, 500];

type selectedAccountType = "TRADING" | "SPOT";

function DepositPixForm({ depositDetail, handleCancel }: DepositPixFormProps) {
  const { user } = useUser();
  const { t } = useTranslation("dashboard");
  const { t: tMaxPix } = useTranslation("max_pix_volume_text");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [timeToSearch, setTimeToSearch] = useState<any>(0);
  const [userData, setUserData] = useState(INIT_USER_DATA);
  const [loadingQuote, setLoadingQuote] = useState(false);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [selectedAccountType, setSelectedAccountType] =
    useState<selectedAccountType>("TRADING");
  const { activeAccount } = useContext(AccountContext);

  const { brlPixVolume } = usePixTransactionVolume();
  const { handleRequestPix } = useApiData();
  const { totalVolume } = usePixTransactionVolumeNew();
  const { balanceComplete } = useBalanceComplete();

  const inputUSDTRef = useRef<HTMLInputElement>(null);

  const { data: accountsBalance } = useAccountsBalance();

  const valuesPixFiltered = isMobile ? valuesPix.slice(0, 3) : valuesPix;

  useEffect(() => {
    if (user?.address) {
      formik.handleChange({
        target: {
          name: "address",
          value: getFormatAddress(user),
        },
      });
    }
  }, [user]);

  const handleClickBuy = () => {
    if (activeAccount.environment === "TEST") {
      notifyError("Utilize a conta REAL");
    } else {
      handleRequestPix(
        formik.values,
        selectedAccountType === "SPOT" ? true : false
      );
    }
  };

  const getFormatAddress = ({ address }: User) => {
    let text = "";

    if (address) {
      if (address?.address) text = text + address?.address;
      if (address?.number) text = text + address?.number + ", ";
      if (address?.neighborhood) text = text + address?.neighborhood;
      if (address?.city) text = text + address?.city + ", ";
      if (address?.state) text = text + address?.state + " - ";
      if (address?.country) text = text + address?.country;
    }
    return text;
  };

  const formik = useFormik({
    initialValues: {
      name: user?.name || "",
      cpf: user?.cpf || "",
      brl: "",
      usdt: "",
      conversionRate: "",
      phone: null,
      address: null,
    },
    validationSchema: Yup.object().shape({
      name: Yup.string().max(255).required("Por favor, digite seu nome"),
      cpf: Yup.string()
        .required("Por favor, digite seu CPF")
        .test("is-valid-cpf", "CPF inválido", (value) => {
          if (!value) return false;
          return isValidCPF(value);
        }),
      brl: Yup.number()
        .transform((value) => (isNaN(value) ? undefined : value))
        .nullable()
        .required("Obrigatório"),
      usdt: Yup.number()
        .min(10, `O valor mínimo de depósito é 10 USDT`)
        .max(6500, `O valor máximo de depósito é 6500 USDT`)
        .transform((value) => (isNaN(value) ? undefined : value))
        .nullable()
        .required("Obrigatório"),
      conversionRate: Yup.number()
        .transform((value) => (isNaN(value) ? undefined : value))
        .nullable()
        .required("Obrigatório"),
    }),
    validate: ({ cpf }) => {
      const errors: { [x: string]: string } = {};
      if (cpf && cpf.length > 14) {
        errors.cpf = "Número de CPF inválido";
      }
      return errors;
    },
    validateOnBlur: true,
    onSubmit: async (
      values,
      { resetForm, setErrors, setStatus, setSubmitting }
    ): Promise<void> => {},
  });

  const transactionInfo = [
    {
      id: "minimun_value",
      title: t("minimum_deposit_value"),
      value: 10,
    },
    // {
    //   id: "fees",
    //   title: "Taxas:",
    //   value: formik.values.feeAmount,
    // },
    {
      id: "value_to_receive",
      title: t("value_to_receive"),
      value: formik.values.usdt,
    },
  ];

  useEffect(() => {
    getUserData();
  }, [user]);

  useEffect(() => {
    const invalidUserData = Object.entries(formik.errors).length > 0;
  }, [formik.errors, loadingQuote, brlPixVolume]);

  const getUserData = () => {
    setUserData({
      ...userData,
      name: user?.name || "",
      cpf: user?.cpf || "",
    });
  };

  const isVolumeAboveLimit = totalVolume > 125000;

  const handleSelectAmmout = (value: string, coin: string) => {
    handleChangeAmmout(value, coin);
    inputUSDTRef.current?.focus();
  };

  const handleChangeAmmout = (value: string, coin: string) => {
    setLoadingQuote(true);
    if (
      NumericOnlyWithFloat({
        target: {
          value,
        },
      })
    ) {
      formik.handleChange({
        target: {
          name: coin,
          value: value.replace(",", "."),
        },
      });

      if (timeToSearch) clearTimeout(timeToSearch);

      setTimeToSearch(
        setTimeout(() => {
          requestQuote(parseFloat(value), coin);
        }, 200)
      );
    }
  };

  const requestQuote = async (amount: number, coin: string) => {
    if (!amount || Number.isNaN(amount)) {
      return;
    }

    const data = await apiGet("/bank/conversionRate", {
      symbol: "USDTBRL",
      amount,
    });
    if (coin === "usdt") {
      const conversionFee = data.feeList.find(
        (fee) => fee.type === "CURRENCY_CONVERSION"
      );
      const conversionRateWithFee =
        data.conversionRate * (1 + conversionFee.value / 100);
      const value = amount * conversionRateWithFee;
      const convertedValue = (Math.floor(value * 100) / 100).toFixed(2);
      formik.handleChange({
        target: {
          name: "brl",
          value: convertedValue,
        },
      });
    } else {
      formik.handleChange({
        target: {
          name: "usdt",
          value: data.convertedValue,
        },
      });
    }
    formik.handleChange({
      target: {
        name: "conversionRate",
        value: data.conversionRate,
      },
    });
    setLoadingQuote(false);
  };

  const handleCopy = (e, text: string) => {
    e.stopPropagation();
    if (text) {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          setCopiedLink(text);
          setTimeout(() => {
            setCopiedLink(null);
          }, 1500);
        })
        .catch((err) => {
          throw err;
        });
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleChangeAccountType = (value: selectedAccountType) => {
    setSelectedAccountType(value);
    setOpenModal(false);
  };

  const accountTypeOptions = {
    TRADING: {
      label: t("choose_account_modal.accounts.trading.label"),
      icon: <MdCandlestickChart size={24} />,
      totalInUsdt: balanceComplete?.availableForWithdrawal,
    },
    SPOT: {
      label: t("choose_account_modal.accounts.spot.label"),
      icon: <BiSolidWallet size={24} />,
      totalInUsdt: accountsBalance?.SPOT?.totalInUsdt,
    },
  };
  const selectedOption = accountTypeOptions[selectedAccountType];

  return (
    <Box sx={style}>
      {depositDetail ? (
        <Box sx={{ display: "flex", flexDirection: "column", p: 4 }}>
          <Box className="deposit_detail_haeder">
            <Typography fontSize={"1rem"} fontWeight={400}>
              {t("deposit_pix")}
            </Typography>
            <Box className="time_ramaining_box">
              <Typography variant="body1">{t("time-remaining")}: </Typography>
              <CountdownMinutes minutes={15} />
            </Box>
          </Box>
          <Box
            sx={{ mt: 3, textAlign: "center" }}
            alignItems="center"
            alignContent="center"
            justifyContent="center"
          >
            <img
              src={`data:image/png;base64, ${depositDetail?.gatewayCustomData?.creationResponseData?.QRCode}`}
              alt="pix"
              width={256}
              height={256}
              style={{
                borderRadius: "16px",
                border: "2px solid #222d38",
                padding: "0.5rem",
              }}
            />
          </Box>
          <Typography
            sx={{ mt: 2 }}
            fontWeight={500}
            fontSize={isMobile ? 8 : 14}
            textAlign={"center"}
          >
            {t("deposit_value")}{" "}
            <span style={{ color: "#01db97" }}>
              {depositDetail?.gatewayCustomData?.creationResponseData?.amount}
            </span>{" "}
            {t("to_key")}
          </Typography>
          <Box
            sx={{
              width: "100%",
              margin: "auto",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Box className="copy_box">
              <Typography
                sx={{
                  width: "100%",
                  color: "#697582",
                  wordBreak: "break-word",
                }}
                fontWeight={400}
                fontSize={isMobile ? 8 : 16}
                color={copiedLink !== null && "#01DB97 !important"}
                variant="body2"
                textAlign="center"
                textOverflow="ellipsis"
                noWrap
              >
                {copiedLink !== null
                  ? `${t("copied")}!`
                  : depositDetail?.gatewayCustomData?.creationResponseData
                      ?.QRCodeText}
              </Typography>
              <Button
                className="copy_id"
                onClick={(e) =>
                  handleCopy(
                    e,
                    depositDetail?.gatewayCustomData?.creationResponseData
                      ?.QRCodeText
                  )
                }
              >
                <IoCopy
                  size={20}
                  onClick={() =>
                    navigator.clipboard.writeText(
                      depositDetail?.gatewayCustomData?.creationResponseData
                        ?.QRCodeText
                    )
                  }
                />
              </Button>
            </Box>
          </Box>

          <Box className="qrcode_content_footer">
            <Typography
              className="text"
              fontWeight={400}
              fontSize={isMobile ? 12 : 14}
            >
              {t("attention")}
            </Typography>
          </Box>
        </Box>
      ) : (
        <Box>
          <Stack direction={"column"} spacing={2}>
            <Stack
              direction={isMobile ? "column" : "row"}
              justifyContent={"space-between"}
              // alignItems={isMobile ? "flex-start" : "center"}
            >
              <Typography variant="h6" fontWeight={500}>
                {t("_deposit")} <span style={{ color: "#01db97" }}>PIX</span>
              </Typography>
              <MaxPixVolumeText totalVolume={totalVolume} />
            </Stack>
            {isVolumeAboveLimit && (
              <Box sx={{ marginTop: "0.5rem !important" }}>
                <Typography variant="body1" color="#fd9400">
                  {tMaxPix("above_limit_warning")}
                </Typography>
              </Box>
            )}

            <Stack className="value_box_container" alignItems="center">
              <Box className="value_box">
                <Box className="image_coin">
                  <img src="/static/icons/br_flag.svg" width={24} />
                  <Typography variant="body1">BRL</Typography>
                </Box>
                <Typography fontSize="1rem" fontWeight={500}>
                  {t("value_in_brl")}
                </Typography>
                <TextField
                  error={Boolean(formik.touched.brl && formik.errors.brl)}
                  onBlur={formik.handleBlur}
                  name="brl"
                  onChange={(e) => handleChangeAmmout(e.target.value, "brl")}
                  required
                  fullWidth
                  value={formik.values.brl}
                  variant="outlined"
                  placeholder="R$ 0.00"
                />
              </Box>

              <Box className="switch_bullet">
                <HiOutlineSwitchHorizontal size={24} />
              </Box>

              <Box className="value_box">
                <Box className="image_coin">
                  <img src={TetherIcon} width={24} />
                  <Typography fontSize="0.75rem">USDT</Typography>
                </Box>
                <Typography fontSize="1rem" fontWeight={500}>
                  {t("value_to_receive_usdt")}
                </Typography>
                <TextField
                  error={Boolean(formik.errors.usdt)}
                  onBlur={formik.handleBlur}
                  name="usdt"
                  inputRef={inputUSDTRef}
                  onChange={(e) => handleChangeAmmout(e.target.value, "usdt")}
                  variant="outlined"
                  placeholder="$ 0.00"
                  value={formik.values.usdt}
                  fullWidth
                />
                <Typography className="error_message">
                  {Boolean(
                    (formik.touched.brl || formik.touched.usdt) &&
                      formik.errors.usdt
                  ) && formik.errors.usdt}
                </Typography>
              </Box>

              {user && !user?.name && (
                <Box className="input_value">
                  <InputLabel sx={{ color: "#EEE" }}>{t("name")}</InputLabel>
                  <TextField
                    error={Boolean(formik.errors.name)}
                    onBlur={formik.handleBlur}
                    name="name"
                    onChange={(e) => formik.handleChange(e)}
                    value={formik.values.name}
                    placeholder="Preencha seu nome"
                    helperText={formik.touched.name && formik.errors.name}
                    fullWidth
                  />
                </Box>
              )}

              {user && !user?.cpf && (
                <Box className="input_value">
                  <InputLabel sx={{ color: "#EEE" }}>CPF</InputLabel>
                  <TextField
                    error={Boolean(formik.errors.cpf)}
                    onBlur={formik.handleBlur}
                    name="cpf"
                    onChange={(e) => formik.handleChange(e)}
                    value={formik.values.cpf}
                    placeholder="Preencha seu CPF"
                    helperText={formik.touched.cpf && formik.errors.cpf}
                    fullWidth
                  />
                </Box>
              )}
            </Stack>

            <Stack
              direction={isMobile ? "column" : "row"}
              justifyContent={"space-between"}
              alignItems={isMobile ? "flex-start" : "center"}
              spacing={1}
            >
              <Typography fontSize={isMobile ? "0.75rem" : "0.85rem"}>
                {t("suggestions")}
              </Typography>
              <Stack direction={"row"} spacing={1}>
                {valuesPixFiltered.map((value, index) => (
                  <Button
                    className="suggest_button"
                    onClick={() => handleSelectAmmout(value.toString(), "brl")}
                    key={index}
                  >
                    {value.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                      minimumFractionDigits: 2,
                    })}
                  </Button>
                ))}
              </Stack>
            </Stack>

            <Stack
              direction={"column"}
              spacing={1}
              sx={{
                padding: "0.5rem 0",
              }}
            >
              <Typography fontSize={isMobile ? "0.75rem" : "1rem"}>
                {t("deposit_to")}
              </Typography>
              <Stack
                direction={"row"}
                alignItems="center"
                className="choice_account_buttom"
                onClick={() => setOpenModal(true)}
              >
                {selectedOption && (
                  <TitleWithCircleIcon
                    label={selectedOption.label}
                    description={`$${numeral(selectedOption.totalInUsdt).format(
                      "0,0.00"
                    )} USDT`}
                    descriptionColor="#80909a"
                    icon={selectedOption.icon}
                    circleSize={40}
                  />
                )}
                <IoIosArrowDown size={20} color={"#FFF"} />
              </Stack>
            </Stack>

            <Stack spacing={1}>
              {transactionInfo.map((item) => (
                <Stack
                  direction={"row"}
                  justifyContent={"space-between"}
                  spacing={1}
                  key={item.id}
                  color={item.id === "value_to_receive" ? "#FFF" : "#80909a"}
                >
                  <Typography fontSize={isMobile ? "0.75rem" : "0.85rem"}>
                    {item.title}
                  </Typography>
                  <Typography fontSize={isMobile ? "0.75rem" : "0.85rem"}>
                    {item?.id === "minimun_value" ? (
                      `${item.value} USDT`
                    ) : (
                      <SensitiveInfo text={`${item.value} USDT`} />
                    )}
                  </Typography>
                </Stack>
              ))}
            </Stack>

            <Stack direction={"row"} spacing={2}>
              <Button
                variant="contained"
                onClick={handleCancel}
                fullWidth
                sx={{
                  background: "#0a141b",
                  fontSize: "14px",
                }}
              >
                {t("back")}
              </Button>
              <Button
                variant="contained"
                disabled={
                  isVolumeAboveLimit ||
                  !formik.values.usdt ||
                  !formik.values.name ||
                  !formik.values.cpf ||
                  !!formik.errors.cpf ||
                  !!formik.errors.usdt ||
                  formik.isSubmitting
                }
                onClick={() => handleClickBuy()}
                fullWidth
                sx={{
                  background: "#00A667",
                  fontSize: "14px",
                }}
              >
                {t("buy")}
              </Button>
            </Stack>
          </Stack>
        </Box>
      )}
      <RequireDocumentValidate />

      <ChooseAccountModal
        openModal={openModal}
        handleClose={handleCloseModal}
        handleChangeAccountType={handleChangeAccountType}
        selectedAccountType={selectedAccountType}
        accountsBalance={accountsBalance}
        balanceComplete={balanceComplete}
      />
    </Box>
  );
}

export default DepositPixForm;
