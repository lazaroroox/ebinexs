import {
  Box,
  Button,
  FormControl,
  MenuItem,
  Select,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import numeral from "numeral";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import useBalanceComplete from "src/swr/use-balance-complete";
import useParameters from "src/swr/use-parameters";
import useUser from "src/swr/use-user";
import { notifyError, notifySuccess } from "src/utils/toast";
import { dispatch } from "use-bus";
import * as Yup from "yup";
import { apiGet, apiPost } from "../../../services/apiService";
import NumberFormatCustom from "../../NumberFormat";
import PendingBonusesConfirmModal from "./PendingBonusesConfirmModal";
import WithdrawConfirmModal from "./WithdrawConfirmModal";

interface WithdrawCriptoFormProps {
  balance: number;
  handleCancel: () => void;
}

const networks = [
  {
    value: "ERC20",
    label: "ERC20",
  },
  {
    value: "TRC20",
    label: "TRC20",
  },
  {
    value: "BEP20",
    label: "BEP20",
  },
];

function WithdrawCriptoForm({
  balance,
  handleCancel,
}: WithdrawCriptoFormProps) {
  const { t } = useTranslation("dashboard");
  const { user } = useUser();
  const { parameters, loading } = useParameters();
  const { balanceComplete } = useBalanceComplete();
  const [receiveAmount, setReceiveAmount] = useState(0);
  const [transactionFee, setTransactionFee] = useState(0);
  const [minimumAmount, setMinimumAmount] = useState(10);
  const [enableSubmit, setEnableSubmit] = useState(false);
  const [errorLimit, setError] = useState("");
  const [withdrawalAddress, setWithdrawalAddress] = useState([]);
  const [code, setCode] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [pendingBonusesModal, setPendingBonusesModal] = useState(false);

  const formit = useFormik({
    initialValues: {
      withdrawalAddressId:
        withdrawalAddress.length > 0 ? withdrawalAddress[0].id : null,
      network:
        withdrawalAddress.length > 0 ? withdrawalAddress[0].network : null,
      amount: "",
      submit: null,
    },
    validationSchema: Yup.object().shape({
      withdrawalAddressId: Yup.string()
        .max(255)
        .required(t("enter_wallet_address")),
      amount: Yup.number()
        .min(
          minimumAmount,
          t("minimum_withdrawal_amount_warning", { minimumAmount })
        )
        .transform((value) => (isNaN(value) ? undefined : value))
        .nullable()
        .required(t("enter_withdrawal_amount")),
    }),
    onSubmit: async (
      values,
      { resetForm, setErrors, setStatus, setSubmitting }
    ): Promise<void> => {
      try {
        setModalOpen(false);
        await apiPost("bank/withdrawals", {
          asset: parameters?.DEFAULT_COIN?.value,
          withdrawalAddressId: values.withdrawalAddressId,
          amount: parseFloat(values.amount),
          validationCode: code,
        });

        resetForm();
        setStatus({ success: true });
        setSubmitting(false);
        notifySuccess(t("withdrawal_request_received_successfully"));

        // reload withdrawals
        dispatch("@WITHDRAWALS/LOAD");
        return window.location.reload();
      } catch (err) {
        setModalOpen(false);
        setStatus({ success: false });
        setErrors({ submit: err });
        notifyError(t("invalid_code"));
        setSubmitting(false);
      }
    },
  });

  const requestCodeForWithdrawals = async () => {
    try {
      if (!user?.using2fa) {
        await apiPost("bank/withdrawals/requestCode", {});
      }
      setModalOpen(true);
    } catch (err) {
      console.log("err", err);
    }
  };

  const CalculateIncome = () => {
    const values: any = formit.values;
    useEffect(() => {
      if (values.amount) {
        const outcome =
          Number(values.amount) -
          Number(values.amount * (transactionFee / 100));
        setReceiveAmount(outcome);

        if (minimumAmount > outcome) {
          setEnableSubmit(false);
          if (formit.values.network === "ERC20") {
            setError(t("minimum_value_portfolio_type_TRC20_BEP20"));
          }
          return;
        }
        if (balance >= outcome && outcome > 0) {
          setError("");
          setEnableSubmit(true);
          return;
        }
        setError(t("surplus_withdrawal"));
        setEnableSubmit(false);
      }
    }, [formit.values]);
    return null;
  };

  useEffect(() => {
    // apenas pra bypass nos setters
    setReceiveAmount(0);
    setTransactionFee(0);
    setMinimumAmount(10);
    requestWithdrawalAddress();
  }, [setReceiveAmount, setTransactionFee]);

  useEffect(() => {
    if (withdrawalAddress.length > 0) {
      if (withdrawalAddress[0].network) {
        setMinimumAmount(50);
      } else {
        setMinimumAmount(10);
      }
      formit.handleChange({
        target: {
          name: "withdrawalAddressId",
          value: withdrawalAddress[0].id,
        },
      });
      formit.handleChange({
        target: {
          name: "network",
          value: withdrawalAddress[0].network,
        },
      });
    }
  }, [withdrawalAddress]);

  const requestWithdrawalAddress = async () => {
    try {
      const address = await apiGet(
        "/users/withdrawalAddress/whitelist?filterValidOnly=true"
      );
      setWithdrawalAddress(address);
    } catch (error) {
      console.log();
    }
  };

  const handleMaxValue = () => {
    formit.handleChange({
      target: {
        name: "amount",
        value: balance,
      },
    });
  };

  const BoxStyle = {
    color: "#EEE",
    "& fieldset": {
      border: "none",
    },
  };

  return (
    <Box sx={BoxStyle}>
      <Stack direction={"column"}>
        <Box sx={{ p: 2 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: ["column", "row"],
              gap: 2,
              mb: 2,
            }}
          >
            <FormControl fullWidth sx={{ mr: 1 }}>
              <Typography sx={{ mb: 1, fontSize: 12, fontWeight: 600 }}>
                {t("portfolio_address")}
              </Typography>
              <Select
                labelId="select-coin"
                id="select-coin"
                name="withdrawalAddressId"
                value={formit.values.withdrawalAddressId}
                onChange={(e) => {
                  const withdrawal = withdrawalAddress.find(
                    (w) => w.id === e.target.value
                  );

                  if (withdrawal.network === "ERC20") {
                    setMinimumAmount(50);
                  } else {
                    setMinimumAmount(10);
                  }

                  formit.handleChange(e);
                  formit.handleChange({
                    target: {
                      name: "network",
                      value: withdrawal.network,
                    },
                  });
                  formit.handleChange({
                    target: {
                      name: "amount",
                      value: "",
                    },
                  });
                  setError("Informe o valor do saque");
                }}
              >
                {withdrawalAddress.map((item) => (
                  <MenuItem key={item.id} value={item.id}>
                    {t(item.address)}
                  </MenuItem>
                ))}
              </Select>
              {/* {formit.values.withdrawalAddressId === null && (
                <FormHelperText sx={{ color: "red" }}>
                  Para realizar o saque você precisa cadastrar sua Wallet na aba
                  segurança
                </FormHelperText>
              )} */}
            </FormControl>
            <FormControl fullWidth sx={{ maxWidth: ["auto", 100] }}>
              <Typography sx={{ mb: 1, fontSize: 12 }}>
                {t("network")}
              </Typography>
              <Select
                id="select-network"
                name="network"
                value={formit.values.network}
                onChange={(e) => formit.handleChange(e)}
                disabled={true}
              >
                {networks.map((item) => (
                  <MenuItem key={item.value} value={item.value}>
                    {t(item.value)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <Typography pb={1} sx={{ fontWeight: 600 }}>
            Valor
          </Typography>
          <TextField
            error={
              Boolean(formit.touched.amount && formit.errors.amount) ||
              Boolean(errorLimit)
            }
            fullWidth
            helperText={
              (formit.touched.amount && formit.errors.amount) || errorLimit
            }
            name="amount"
            onBlur={formit.handleBlur}
            onChange={formit.handleChange}
            required
            value={formit.values.amount}
            variant="outlined"
            placeholder="0"
            InputProps={{
              inputComponent: NumberFormatCustom,
              endAdornment: (
                <Button variant="text" onClick={handleMaxValue}>
                  <Typography>{t("max")}</Typography>
                </Button>
              ),
            }}
          />
        </Box>
      </Stack>
      <Box sx={{ p: 2 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          sx={{
            borderBottom: "1px solid #0b161d",
            marginBottom: "0.75rem",
            paddingBottom: "0.5rem",
          }}
        >
          <Typography sx={{ mb: 1 }} fontWeight={500} fontSize={14}>
            {t("minimum_withdrawal_amount")}
          </Typography>
          <Typography color="textPrimary" variant="body2">
            {numeral(minimumAmount).format("0.00")}{" "}
            {loading ? (
              <Skeleton />
            ) : (
              parameters?.DEFAULT_COIN?.value.toUpperCase()
            )}
          </Typography>
        </Stack>
        <Stack direction="row" justifyContent="space-between">
          <Typography sx={{ mb: 1 }} fontWeight={500} fontSize={14}>
            {t("amount_to_be_received")}
          </Typography>
          <Typography color="textPrimary" variant="body2">
            {numeral(receiveAmount).format("0.00")}{" "}
            {loading ? (
              <Skeleton />
            ) : (
              parameters?.DEFAULT_COIN?.value.toUpperCase()
            )}
          </Typography>
        </Stack>
      </Box>

      <CalculateIncome />

      <Box sx={{ p: 2 }}>
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
            Voltar
          </Button>
          <Button
            size="large"
            color="primary"
            disabled={
              formit.isSubmitting ||
              !enableSubmit ||
              formit.values.withdrawalAddressId === null
            }
            variant="contained"
            onClick={(e: any) => {
              if (balanceComplete?.pendingCompletionBonuses.length > 0) {
                setPendingBonusesModal(true);
                return;
              }
              requestCodeForWithdrawals();
            }}
            fullWidth
          >
            {t("request_withdrawal")}
          </Button>
        </Stack>
      </Box>

      <WithdrawConfirmModal
        value={code}
        onChange={setCode}
        onConfirm={(e: any) => formit.handleSubmit(e)}
        open={modalOpen}
        onClose={setModalOpen}
      />
      <PendingBonusesConfirmModal
        onConfirm={() => {
          setPendingBonusesModal(false);
          requestCodeForWithdrawals();
        }}
        open={pendingBonusesModal}
        onClose={setPendingBonusesModal}
      />
    </Box>
  );
}

export default WithdrawCriptoForm;
