import { Grid, Typography } from "@mui/material";
import type { FC } from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { BiMoneyWithdraw } from "react-icons/bi";
import { HiReceiptPercent } from "react-icons/hi2";
import { MdSecurity } from "react-icons/md";
import MethodPaymentCard from "src/components/MethodPaymentCard";
import StepsFilledWithMessage from "src/components/StepsFilledWithMessage";
import useBalanceComplete from "src/swr/use-balance-complete";
import { BalanceComplete } from "src/types/bank";
import { DEPOSIT_METHOD_BUTTON_LIST } from "src/utils/constants";
import { WithdrawCriptoForm, WithdrawListTable } from ".";
import GoodPointsSection from "../deposit/GoodPointsDeposit";
import WithdrawPixForm from "./WithdrawPixForm";

interface WithdrawScreenWrapperProps {
  balanceComplete?: BalanceComplete;
}

const styledBox = {
  "& .styled_box": {
    color: "#EEE",
    marginBottom: "2rem",
    borderRadius: "8px",
  },
  "& fieldset": {
    border: "none",
  },
  "& .Mui-disabled": {
    backgroundColor: "#0d151a !important",
    cursor: "not-allowed",
  },
  "& .MuiInputBase-root": {
    backgroundColor: "#0a141b",
  },
  "& .step_wrapper": {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    "& .step": {
      position: "relative",
      display: "flex",
      alignItems: "center",
      paddingLeft: "2rem",
      gap: "1rem",
      "& .green_step_bullet": {
        borderRadius: "50%",
        minWidth: "16px",
        height: "16px",
        transition: "background 1s ease",
        position: "relative",
      },
    },
    "& .divider": {
      width: "1px",
      background: "#0f1920",
      height: "40px",
      position: "absolute",
      top: "83%",
      left: "39px",
      transform: "translateY(-50%)",
      transition: "background 1s ease",
    },
  },
  "& .deposit_box": {
    background: "linear-gradient(317deg, #0a181c85, transparent)",
    height: "12rem",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    "&:hover": {
      outline: "2px solid #0ab575",
    },
  },
  "& .deposit_success_wrapper": {
    paddingTop: "6rem",
    "& .download_button": {
      background: "transparent",
      margin: "1rem 0",
      fontSize: "1rem",
      color: "#EEE",
      paddingLeft: 0,
      border: "1px solid #151b23",
      padding: " 0.5rem 2rem",
      "&:hover": {
        color: "#0ab575",
        borderColor: " #0ab575",
        background: "transparent",
      },
    },
  },
  "& .continue_button": {
    padding: " 0.5rem 2rem",
    fontSize: "0.875rem",
  },
  "& .icon": {
    position: "relative",
    "& .light_green": {
      width: "130px",
      height: "100px",
      position: "absolute",
      background:
        "radial-gradient(circle, rgb(0 255 170 / 54%) 80%, rgb(101 255 191) 50%)",
      filter: "blur(100px)",
    },
  },
};

const WithdrawScreenWrapper: FC<WithdrawScreenWrapperProps> = () => {
  const { t } = useTranslation("to_withdraw_page");
  const { balanceComplete } = useBalanceComplete();
  const [reloadWithdrawals, setReloadWithdrawals] = useState(false);
  const [activeStep, setActiveStep] = useState({ index: 0, type: null });

  const triggerReload = () => {
    setReloadWithdrawals((prev) => !prev);
  };

  const handleChooseMethod = (method: string) => {
    switch (method) {
      case "pix":
        setActiveStep({ index: 1, type: "pix" });
        break;
      case "cripto":
        setActiveStep({ index: 1, type: "cripto" });
        break;
      default:
        setActiveStep({ index: 0, type: null });
    }
  };

  const handleCancel = () => {
    setActiveStep({ index: 0, type: null });
  };

  const cardsMock = [
    {
      id: 1,
      label: t("withdraw_screen_wrapper.cards.method.label"),
      description: t("withdraw_screen_wrapper.cards.method.description"),
      icon: <BiMoneyWithdraw size={28} />,
    },
    {
      id: 2,
      label: t("withdraw_screen_wrapper.cards.security.label"),
      description: t("withdraw_screen_wrapper.cards.security.description"),
      icon: <MdSecurity size={28} />,
    },
    {
      id: 3,
      label: t("withdraw_screen_wrapper.cards.best_rate.label"),
      description: t("withdraw_screen_wrapper.cards.best_rate.description"),
      icon: <HiReceiptPercent size={28} />,
    },
  ];

  const steps = [
    {
      index: 0,
      label: t("withdraw_screen_wrapper.steps.0.label"),
      description: t("withdraw_screen_wrapper.steps.0.description"),
    },
    {
      index: 1,
      label: t("withdraw_screen_wrapper.steps.1.label"),
      description: t("withdraw_screen_wrapper.steps.1.description"),
    },
    {
      index: 2,
      label: t("withdraw_screen_wrapper.steps.2.label"),
      description: t("withdraw_screen_wrapper.steps.2.description"),
    },
  ];

  return (
    <Grid container spacing={2} sx={styledBox} justifyContent={"space-between"}>
      {activeStep.index === 0 ? (
        <Grid size={{ xs: 12, md: 8 }}>
          <Typography fontSize={"1rem"} py={3} fontWeight={400} color={"#EEE"}>
            {t("withdraw_screen_wrapper.choose_method")}
          </Typography>
          <Grid
            container
            spacing={4}
            columns={{ xs: 1, sm: 8, md: 12 }}
            sx={{ mt: 2 }}
          >
            {DEPOSIT_METHOD_BUTTON_LIST.map((item) => (
              <Grid
                size={{ xs: 2, sm: 12, md: 6 }}
                key={item.id}
                sx={{
                  opacity: item.id === "crypto" ? "0.4" : "initial",
                  pointerEvents: item.id === "crypto" ? "none" : "initial",
                }}
              >
                <MethodPaymentCard
                  methodItem={item}
                  onClickFn={() => handleChooseMethod(item.id)}
                />
              </Grid>
            ))}
          </Grid>
        </Grid>
      ) : (
        <Grid size={{ xs: 12, md: 5 }}>
          {activeStep.type === "pix" ? (
            <WithdrawPixForm
              balance={balanceComplete?.availableForWithdrawal || 0}
              handleCancel={handleCancel}
              onWithdrawSuccess={triggerReload}
            />
          ) : (
            <WithdrawCriptoForm
              balance={balanceComplete?.availableForWithdrawal || 0}
              handleCancel={handleCancel}
            />
          )}
        </Grid>
      )}

      <Grid size={{ xs: 12, md: 4 }} mt={4}>
        <StepsFilledWithMessage activeStep={activeStep} steps={steps} />
      </Grid>
      <GoodPointsSection cardsMock={cardsMock} title={t("withdraw_screen_wrapper.title")} />
      <WithdrawListTable reloadFlag={reloadWithdrawals} />
    </Grid>
  );
};

export default WithdrawScreenWrapper;
