import { Box, Button, Grid, Stack, Typography } from "@mui/material";
import { Fragment, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import CheckedIcon from "src/assets/images/icons/checked.svg";
import MethodPaymentCard from "src/components/MethodPaymentCard";
import HowToDepositPix from "src/components/modals/HowToDepositPix";
import StepsFilledWithMessage from "src/components/StepsFilledWithMessage";
import LayoutContext from "src/contexts/LayoutContext";
import useQuery from "src/hooks/useQuery";
import { DEPOSIT_METHOD_BUTTON_LIST } from "src/utils/constants";
import { clearDepositIntervalId, useSetInterval } from "src/utils/interval";
import { apiGet, apiPost } from "../../../services/apiService";
import DepositCryptoForm from "./DepositCryptoForm";
import DepositPixForm from "./DepositPixForm";
import useBalanceComplete from "src/swr/use-balance-complete";

const style = {
  justifyContent: "space-between",
  "& .styled_box": {
    color: "#EEE",
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
    backgroundColor: "transprent",
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

const INIT_STEP = { index: 0, type: null };

function DepositPaymentDetails() {
  const { t } = useTranslation("deposit_page");
  const navigate = useNavigate();
  const query = useQuery();
  const { setModalHowToDepositPix, setModalRequireDocumentValidate } =
    useContext(LayoutContext);
  const [depositDetail, setDepositDetail] = useState<any>(null);

  const [activeStep, setActiveStep] = useState(INIT_STEP);
  const [modalPreviewConvertionPix, setModalPreviewConvertionPix] =
    useState(false);

  const { mutate: balanceMutate } = useBalanceComplete();

  const depositId = query.get("depositId");
  const status = query.get("status");
  const gatewayTransactionType = query.get("gatewayTransactionType");

  const steps = [
    {
      index: 0,
      label: t("steps.0.label"),
      description: t("steps.0.description"),
    },
    {
      index: 1,
      label: t("steps.1.label"),
      description: t("steps.1.description"),
    },
    {
      index: 2,
      label: t("steps.2.label"),
      description: t("steps.2.description"),
    },
    {
      index: 3,
      label: t("steps.3.label"),
      description: t("steps.3.description"),
    },
  ];

  const toogleModalPreviewConvertionPix = () => {
    setModalPreviewConvertionPix(!modalPreviewConvertionPix);
  };

  useEffect(() => {
    if (
      activeStep.index === 1 &&
      (activeStep.type === "crypto" || activeStep.type === "pix")
    ) {
      if (depositId) {
        checkDepositStatus(depositId);
        const time = status === "CONFIRMED" ? 100 : 5000;
        useSetInterval(() => checkDepositStatus(depositId), time);
      }
    } else {
      clearDepositIntervalId();
    }
  }, [activeStep, depositId]);

  useEffect(() => {
    if (depositId) {
      getDeposit(depositId);
      setActiveStep({
        index: 1,
        type: gatewayTransactionType.toLocaleLowerCase(),
      });
    }
  }, [depositId]);

  const handleGenerateWalletDeposit = async () => {
    try {
      const data = await apiPost("/bank/deposits", {});
      setDepositDetail(data.walletAddress);
      setActiveStep({
        index: 1,
        type: "crypto",
      });
      navigate(
        `/dashboard/profile/deposit?depositId=${data.depositId}&gatewayTransactionType=CRYPTO`
      );
    } catch (error) {}
  };

  const handlePaymentMethodClick = async (id: string) => {
    switch (id) {
      case "crypto":
        handleGenerateWalletDeposit();
        break;
      case "p2p":
        setModalHowToDepositPix(true);
        break;
      case "pix":
        setActiveStep({
          index: 1,
          type: "pix",
        });
        break;
      default:
        break;
    }
  };

  const handleFinish = () => {
    clearDepositIntervalId();
    setActiveStep(INIT_STEP);
    setDepositDetail(null);
    navigateToTavDepositInit();
  };

  const handleCancel = () => {
    setActiveStep(INIT_STEP);
    navigateToTavDepositInit();
    setDepositDetail(null);
    localStorage.removeItem("timeRemaining");
  };

  const handleReset = () => {
    setActiveStep(INIT_STEP);
    navigateToTavDepositInit();
    setDepositDetail(null);
  };

  const navigateToTavDepositInit = () => {
    navigate(`/dashboard/profile/deposit`);
  };

  const checkDepositStatus = async (id: string) => {
    try {
      const item = await getDeposit(id);

      if (item.status === "CONFIRMED") {
        const type = gatewayTransactionType === "pix" ? "pix" : "crypto";
        setActiveStep({
          index: 2,
          type,
        });
        clearDepositIntervalId();

        balanceMutate("/bank/balanceComplete");
        navigate(
          `/dashboard/profile/deposit?depositId=${item.id}&status=${item.status}&gatewayTransactionType=${item.gatewayTransactionType}`
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getDeposit = async (id: string) => {
    const data = await apiGet(`/bank/deposits/${id}`);
    setDepositDetail(data);

    localStorage.removeItem("timeRemaining");

    return data;
  };

  const renderPaymentComponent = (type: string) => {
    switch (type) {
      case "crypto":
        return <DepositCryptoForm depositDetail={depositDetail} />;
      case "pix":
        return (
          <DepositPixForm
            depositDetail={depositDetail}
            handleCancel={handleCancel}
          />
        );
      default:
        break;
    }
  };

  return (
    <Grid container spacing={2} sx={style}>
      <Grid size={{ xs: 12, md: activeStep.index === 0 ? 8 : 5 }}>
        {activeStep.index === 0 && (
          <Typography fontSize={"1rem"} py={3} fontWeight={400} color={"#EEE"}>
            {t("choose_method")}
          </Typography>
        )}

        <Box className="styled_box">
          <Box>
            {activeStep.index === 0 && (
              <>
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
                        pointerEvents:
                          item.id === "crypto" ? "none" : "initial",
                      }}
                    >
                      <MethodPaymentCard
                        methodItem={item}
                        onClickFn={() => handlePaymentMethodClick(item.id)}
                      />
                    </Grid>
                  ))}
                </Grid>
              </>
            )}
            {activeStep.index === 1 && renderPaymentComponent(activeStep.type)}
            {activeStep.index === 2 && (
              <Stack
                direction="column"
                justifyContent="center"
                alignItems={"center"}
                textAlign={"center"}
                spacing={2}
                sx={{ p: 5 }}
              >
                <Box className="deposit_success_wrapper">
                  <Box className="icon">
                    <span className="light_green"></span>
                    <img src={CheckedIcon} />
                  </Box>

                  {activeStep.type === "pix" ? (
                    <Box>
                      <Typography
                        sx={{ mb: 2 }}
                        variant="h5"
                        alignItems={"center"}
                      >
                        {t("success.pix.title")}
                      </Typography>
                      <Typography
                        sx={{ pt: 2, pb: 4 }}
                        fontWeight={400}
                        fontSize={14}
                        color="#9ea9a5"
                        alignItems={"center"}
                      >
                        {t("success.pix.description")}
                      </Typography>
                    </Box>
                  ) : (
                    <Box>
                      <Typography
                        sx={{ mb: 2 }}
                        variant="h5"
                        alignItems={"center"}
                      >
                        {t("success.crypto.title")}
                      </Typography>
                      <Typography
                        sx={{ mb: 2 }}
                        variant="body1"
                        alignItems={"center"}
                        color={"#52c098"}
                      >
                        {t("success.crypto.description")}
                      </Typography>
                      <Button className="download_button">
                        {t("success.crypto.download_receipt")}
                      </Button>
                    </Box>
                  )}
                </Box>

                <Button
                  variant="contained"
                  className="continue_button"
                  onClick={handleFinish}
                >
                  {t("continue_button")}
                </Button>
              </Stack>
            )}
            {activeStep.index === 0 && <Fragment></Fragment>}
          </Box>
        </Box>
        <HowToDepositPix />
      </Grid>
      <Grid size={{ xs: 12, md: 4 }} mt={4}>
        <StepsFilledWithMessage activeStep={activeStep} steps={steps} />
      </Grid>
    </Grid>
  );
}

export default DepositPaymentDetails;
