import {
  Box,
  Button,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useFormik } from "formik";
import numeral from "numeral";
import { FC, useContext, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { CgTimelapse } from "react-icons/cg";
import { useNavigate } from "react-router";
import TetherIcon from "src/assets/images/icons/tether.png";
import MaxPixVolumeText from "src/components/MaxPixVolumeText";
import AddWalletModal from "src/components/modals/AddWalletModal";
import SensitiveInfo from "src/components/SensitiveInfo";
import AccountContext from "src/contexts/AccountContext";
import { apiGet, apiPost } from "src/services/apiService";
import useAccountsBalance from "src/swr/use-accounts-balance";
import useBalanceComplete from "src/swr/use-balance-complete";
import useParameters from "src/swr/use-parameters";
import usePixTransactionVolumeNew from "src/swr/use-pix-transaction-volume-new";
import useUser from "src/swr/use-user";
import { notifyError, notifySuccess } from "src/utils/toast";
import * as Yup from "yup";
import ChooseAccountModal from "../deposit/ChooseAccountModal";
import ModalMessageWIthIcon from "./ModalMessageWIthIcon";
import PendingBonusesConfirmModal from "./PendingBonusesConfirmModal";
import SelectAccountTransactionType from "./SelectAccountTransactionType";
import WithdrawConfirmModal from "./WithdrawConfirmModal";
import BonusWithdrawalText from "src/components/BonusWithdrawalText";

const style = {
  color: "#EEE",
  backgroundColor: "#070f14",
  padding: "2rem",
  borderRadius: "16px",

  "& .select_key_box": {
    marginTop: "0 !important",
  },
  "& input:-webkit-autofill": {
    WebkitBoxShadow: "0 0 0 100px transparent inset",
    transition: "background-color 5000s ease-in-out 0s",
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

  "& .value_box": {
    width: "100%",
    paddingTop: "1rem",
    borderRadius: "16px",
    position: "relative",

    "& .MuiInputBase-root": {
      background: "transparent",
    },

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
  "& .MuiList-root": {
    padding: "0 !important",
  },
};

interface WithdrawPixFormProps {
  balance: number;
  handleCancel: () => void;
  onWithdrawSuccess: () => void;
}

type selectedAccountType = "TRADING" | "SPOT";

type ParterWalletsType = {
  id: string;
  asset: string;
  network: string;
  address: string;
  pixKeyType: string;
  transactionType: string;
  pixKey: string;
  availableFrom: string;
};

const WithdrawPixForm: FC<WithdrawPixFormProps> = (props) => {
  const { handleCancel, onWithdrawSuccess } = props;
  const { t } = useTranslation(["dashboard", "forms"]);
  const { t: tMaxPix } = useTranslation("max_pix_volume_text");
  const { user } = useUser();
  const { parameters } = useParameters();
  const { balanceComplete } = useBalanceComplete();
  const [enableSubmit, setEnableSubmit] = useState(false);
  const [validationCode, setValidationCode] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [pendingBonusesModal, setPendingBonusesModal] = useState(false);
  const [convertedAmount, setConvertedAmount] = useState("-");
  const [valueDebounceTimer, setValueDebounceTimer] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [openMessageModal, setOpenMessageModal] = useState(false);
  const [selectedAccountType, setSelectedAccountType] =
    useState<selectedAccountType>("TRADING");
  const [userWallets, setUserWallets] = useState<ParterWalletsType[]>([]);
  const [withdrawalId, setWithdrawalId] = useState("");
  const [openNewWalletModal, setOpenNewWalletModal] = useState(false);
  const { activeAccount } = useContext(AccountContext);

  const minimumAmount = 20;
  const maximumAmount = 6500;
  const transactionFee = 0;

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { totalVolume } = usePixTransactionVolumeNew();

  const { data: accountsBalance, mutate } = useAccountsBalance();

  const balance = useMemo(() => {
    if (selectedAccountType === "TRADING") {
      return accountsBalance?.TRADING?.totalInUsdt;
    } else if (selectedAccountType === "SPOT") {
      return accountsBalance?.SPOT?.totalInUsdt;
    }
    return 0;
  }, [accountsBalance, selectedAccountType]);

  const navigate = useNavigate();

  const flagScore = user?.userFlags?.find((flag) => flag.key === "SCORE");

  const userScore =
    typeof flagScore?.value === "string" ? parseFloat(flagScore.value) : 0;

  const scoreGreaterZero = userScore > 0;
  const canWithdraw =
    user?.verified === true ||
    scoreGreaterZero === true ||
    String(activeAccount?.environment) === "REAL";

  const convertCurrency = async (amount) => {
    if (!amount || Number.isNaN(amount)) {
      return;
    }

    return await apiGet("/bank/conversionRate", {
      symbol: "BRLUSDT",
      amount,
    });
  };

  const formik = useFormik({
    initialValues: {
      amount: "",
      submit: null,
    },
    validationSchema: Yup.object().shape({
      amount: Yup.number()
        .min(
          minimumAmount,
          t("minimum_withdrawal_amount_warning", { minimumAmount })
        )
        .max(
          maximumAmount,
          t("maximum_withdrawal_amount_warning", { maximumAmount })
        )
        .transform((value) => (isNaN(value) ? undefined : value))
        .nullable()
        .required(t("enter_withdrawal_amount")),
    }),
    validateOnBlur: true,
    async onSubmit(values, { resetForm, setErrors, setStatus, setSubmitting }) {
      try {
        const isSpotAccountIdNeeded =
          selectedAccountType === "SPOT" ? true : false;

        await apiPost(
          "bank/withdrawals",
          {
            asset: parameters?.DEFAULT_COIN?.value,
            amount: parseFloat(values.amount),
            validationCode,
            withdrawalAddressId: withdrawalId,
          },
          undefined,
          isSpotAccountIdNeeded
        );

        resetForm();
        setStatus({ success: true });
        notifySuccess(t("withdrawal_request_received_successfully"));
        setOpenMessageModal(true);
        setConvertedAmount("-");
        if (onWithdrawSuccess) onWithdrawSuccess();
      } catch (err) {
        setStatus({ success: false });
        setErrors({ submit: err });
        notifyError(t("invalid_code"));
      } finally {
        setSubmitting(false);
        setModalOpen(false);
        setValidationCode("");
      }
    },
  });

  const CalculateIncome = () => {
    const { amount } = formik.values;

    useEffect(() => {
      if (!amount) return;

      if (
        Number(amount) < minimumAmount ||
        Number(amount) > maximumAmount ||
        withdrawalId === ""
      ) {
        setEnableSubmit(false);
        return;
      }

      const outcome = calculateOutcome(Number(amount), transactionFee);

      if (isWithdrawalValid(outcome, balance)) {
        setEnableSubmit(true);
      } else {
        setEnableSubmit(false);
      }

      if (String(activeAccount?.environment) !== "REAL") {
        setEnableSubmit(false);
      }
    }, [amount, selectedAccountType, activeAccount]);

    const calculateOutcome = (amount: number, fee: number) => {
      return Number(amount) - Number(amount * (fee / 100));
    };

    const isWithdrawalValid = (outcome: number, balance: number) => {
      return balance >= outcome && outcome > 0;
    };

    return null;
  };

  const handleSelectQuantityAmount = async (
    quantityOption: "MIN" | "50%" | "MAX"
  ) => {
    let quantity = 0;

    switch (quantityOption) {
      case "MIN":
        quantity = 20;
        break;
      case "50%":
        quantity = balanceComplete?.availableForWithdrawal / 2;
        break;
      case "MAX":
        quantity =
          balanceComplete?.availableForWithdrawal > 6500
            ? 6500
            : balanceComplete?.availableForWithdrawal;
        break;
    }

    const converted = await convertCurrency(quantity);

    formik.setValues({
      ...formik.values,
      amount: quantity.toString(),
    });

    setConvertedAmount(converted.convertedValue);
  };

  const requestCodeForWithdrawals = async (e) => {
    if (e) {
      e.preventDefault();
    }

    try {
      if (!user?.using2fa) {
        await apiPost("bank/withdrawals/requestCode", {});
      }
      setModalOpen(true);
    } catch (err) {
      console.log("err", err);
    }
  };

  const transactionInfo = [
    {
      title: "minimum_amount",
      value: minimumAmount,
    },
    {
      title: "amount_to_be_received",
      value: convertedAmount,
    },
  ];

  const handleCloseMessageModal = () => {
    setOpenMessageModal(false);
  };

  const handleChangeAccountType = (value: selectedAccountType) => {
    setSelectedAccountType(value);
    setOpenModal(false);
  };

  const getWallets = async () => {
    try {
      const wallets = await apiGet(
        "/users/withdrawalAddress/whitelist?filterValidOnly=false"
      );

      if (wallets) {
        const onlyPixWallets = wallets.filter(
          (wallet) => wallet.transactionType === "PIX"
        );
        setUserWallets(onlyPixWallets);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCloseModal = () => {
    setOpenNewWalletModal(false);
  };

  const isVolumeAboveLimit = totalVolume > 125000;

  useEffect(() => {
    getWallets();
  }, []);

  return (
    <>
      <Box sx={style}>
        <Stack
          component="form"
          direction={"column"}
          onSubmit={(e) => {
            if (balanceComplete?.pendingCompletionBonuses.length > 0) {
              e.preventDefault();
              setPendingBonusesModal(true);
              return;
            }
            requestCodeForWithdrawals(e);
          }}
        >
          <Box>
            <Stack direction={"column"} spacing={2}>
              <Stack
                direction={isMobile ? "column" : "row"}
                justifyContent={"space-between"}
                alignItems={"flex-start"}
              >
                <Box>
                  <Typography variant="h6" fontWeight={500}>
                    {t("withdraw_for")}{" "}
                    <span style={{ color: "#01db97" }}>PIX</span>
                  </Typography>
                </Box>
                <Stack
                  spacing={1.5}
                  direction={"column"}
                  alignItems={isMobile ? "flex-start" : "flex-end"}
                  pt="2px"
                >
                  <MaxPixVolumeText totalVolume={totalVolume} />

                  <Stack direction={"row"} spacing={1}>
                    {["MIN", "50%", "MAX"].map((quantityOption: any) => (
                      <Button
                        key={quantityOption}
                        className="suggest_button"
                        onClick={() =>
                          handleSelectQuantityAmount(quantityOption)
                        }
                      >
                        {quantityOption}
                      </Button>
                    ))}
                  </Stack>
                </Stack>
              </Stack>
              {isVolumeAboveLimit && (
                <Box sx={{ marginTop: "0.5rem !important" }}>
                  <Typography variant="body1" color="#fd9400">
                    {tMaxPix("above_limit_warning")}
                  </Typography>
                </Box>
              )}

              <Stack mt={"0 !important"}>
                <Box className="value_box">
                  <Box className="image_coin">
                    <img src={TetherIcon} alt="" width={24} />
                    <Typography variant="body1">USDT</Typography>
                  </Box>
                  <Typography fontSize="1rem" fontWeight={500}>
                    {t("value")}
                  </Typography>

                  <TextField
                    fullWidth
                    name="amount"
                    onBlur={(e) => {
                      formik.handleBlur(e);
                    }}
                    onChange={(e) => {
                      formik.handleChange(e);

                      if (valueDebounceTimer) clearTimeout(valueDebounceTimer);

                      if (isNaN(Number(e.target.value))) {
                        setConvertedAmount("-");
                        return;
                      }

                      setValueDebounceTimer(
                        setTimeout(async () => {
                          const converted = await convertCurrency(
                            e.target.value
                          );
                          setConvertedAmount(converted.convertedValue);
                        }, 300)
                      );
                    }}
                    value={formik.values.amount}
                    variant="outlined"
                    placeholder="$ 0.00"
                    inputProps={{
                      maxLength: 25,
                    }}
                    sx={{ mb: 2 }}
                  />
                  <Typography className="error_message">
                    {Boolean(formik.touched.amount || formik.errors.amount) &&
                      formik.errors.amount}
                  </Typography>
                </Box>
                <BonusWithdrawalText balanceComplete={balanceComplete} />
              </Stack>

              <Stack spacing={1} my={"0.5rem !important"}>
                <Stack
                  direction={"row"}
                  alignItems={"center"}
                  justifyContent={"space-between"}
                  spacing={1}
                >
                  <InputLabel id="wallet">{t("wallet")}</InputLabel>
                </Stack>

                {userWallets?.length === 0 ? (
                  <Stack
                    direction={"row"}
                    alignItems={"center"}
                    justifyContent={"space-between"}
                    spacing={1}
                    sx={{
                      padding: "0.5rem 1rem",
                      background: "#0a141b",
                      borderBottom: "1px solid #03121b",
                      borderRadius: "12px",
                      "&:hover": {
                        background: "#0a141b",
                      },
                    }}
                  >
                    <Typography variant="body1">
                      {t("there_is_no_registered_wallet")}
                    </Typography>
                    <Button
                      variant="text"
                      sx={{ color: "#01db97", fontSize: 12 }}
                      onClick={() => setOpenNewWalletModal(true)}
                    >
                      {t("to_add")}
                    </Button>
                  </Stack>
                ) : (
                  <Select
                    labelId="wallet"
                    value={withdrawalId ? withdrawalId : "DEFAULT"}
                    sx={{
                      mb: 2,
                    }}
                    onChange={(e) => setWithdrawalId(e.target.value)}
                  >
                    <MenuItem value="DEFAULT" disabled sx={{ display: "none" }}>
                      {t("select_wallet")}
                    </MenuItem>

                    {userWallets.map((p) => (
                      <MenuItem
                        key={p.id}
                        value={p.id}
                        sx={{
                          padding: "1rem",
                          borderBottom: "1px solid #03121b",
                          "&:hover": {
                            background: "#0a141b",
                          },
                        }}
                      >
                        {p.transactionType === "PIX" ? (
                          <>
                            <span
                              style={{
                                color: "#0EC98C",
                                fontWeight: 500,
                                paddingRight: 4,
                              }}
                            >
                              {p.transactionType}
                            </span>{" "}
                            - {t(p.pixKeyType)} - {p.pixKey}
                          </>
                        ) : (
                          <>
                            <span
                              style={{
                                color: "#FCC111",
                                fontWeight: 500,
                                paddingRight: 4,
                              }}
                            >
                              {p.transactionType}
                            </span>{" "}
                            - {p.asset} - {p.network} - {p.address}
                          </>
                        )}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              </Stack>

              <SelectAccountTransactionType
                label={t("withdraw_from_which_account")}
                setOpenModal={setOpenModal}
                selectedAccountType={selectedAccountType}
                balanceComplete={balanceComplete}
              />

              {String(activeAccount?.environment) === "TEST" && (
                <Typography
                  variant="body2"
                  sx={{
                    color: "#ffb74d",
                    background: "#261c00",
                    padding: "0.75rem 1rem",
                    borderRadius: "8px",
                    fontWeight: 500,
                  }}
                >
                  {t("demo_account_warning")}
                </Typography>
              )}

              <Stack spacing={1}>
                {transactionInfo.map((item) => (
                  <Stack
                    direction={"row"}
                    justifyContent={"space-between"}
                    spacing={1}
                    key={item.title}
                    color={
                      item.title === "amount_to_be_received"
                        ? "#FFF"
                        : "#80909a"
                    }
                  >
                    <Typography fontSize={isMobile ? "0.75rem" : "0.85rem"}>
                      {`${t(item.title)} `}
                    </Typography>
                    <Typography fontSize={isMobile ? "0.75rem" : "0.85rem"}>
                      {item.title === "minimum_amount" ? (
                        <SensitiveInfo
                          text={`${numeral(item.value).format("0,0.00")} USDT`}
                        />
                      ) : (
                        <SensitiveInfo
                          text={`R$ ${numeral(item.value).format("0,0.00")}`}
                        />
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
                {/* Comentado temporariamente para permitir saques sem validação de KYC */}
                {/* canWithdraw ? ( */}
                <Button
                  variant="contained"
                  disabled={
                    formik.isSubmitting || !enableSubmit || isVolumeAboveLimit
                  }
                  fullWidth
                  type="submit"
                  sx={{
                    background: "#00A667",
                    fontSize: "14px",
                  }}
                >
                  {t("request_withdrawal")}
                </Button>
                {/* ) : (
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() => navigate("/dashboard/profile/security")}
                    sx={{
                      background: "#00A667",
                      fontSize: "14px",
                    }}
                  >
                    Validar KYC
                  </Button>
                ) */}
              </Stack>
            </Stack>
          </Box>
        </Stack>
        <CalculateIncome />
      </Box>

      <ChooseAccountModal
        openModal={openModal}
        handleClose={() => setOpenModal(false)}
        handleChangeAccountType={handleChangeAccountType}
        selectedAccountType={selectedAccountType}
        accountsBalance={accountsBalance}
        balanceComplete={balanceComplete}
      />

      <WithdrawConfirmModal
        value={validationCode}
        onChange={setValidationCode}
        onConfirm={(e: any) => formik.handleSubmit(e)}
        open={modalOpen}
        onClose={setModalOpen}
      />
      <PendingBonusesConfirmModal
        onConfirm={() => {
          setPendingBonusesModal(false);
          requestCodeForWithdrawals(null);
        }}
        open={pendingBonusesModal}
        onClose={setPendingBonusesModal}
      />

      <ModalMessageWIthIcon
        openModal={openMessageModal}
        handleClose={handleCloseMessageModal}
        icon={<CgTimelapse size={40} color="#01db97" />}
        title="Aguardando Aprovação"
        description="Sua solicitação de saque está sendo analisada. As análises podem demorar até 12 horas. Você pode ver o status da sua solicitação na página de histórico de saques."
      />

      <AddWalletModal
        openNewWalletModal={openNewWalletModal}
        handleCloseModal={handleCloseModal}
        getWallets={getWallets}
      />
    </>
  );
};

export default WithdrawPixForm;
