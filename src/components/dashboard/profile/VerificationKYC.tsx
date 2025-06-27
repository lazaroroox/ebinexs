import {
  Box,
  Button,
  Dialog,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import SumsubWebSdk from "@sumsub/websdk-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { HiIdentification } from "react-icons/hi2";
import TitleWithCircleIcon from "src/components/TitleWithCircleIcon";
import useAuth from "src/hooks/useAuth";
import { apiGet, apiPost } from "src/services/apiService";
import useUser from "src/swr/use-user";
import { notifyError, notifySuccess } from "src/utils/toast";

export default function VerificationKYC() {
  const { t } = useTranslation("dashboard");
  const { initialize } = useAuth();
  const { user, mutate } = useUser();
  const theme = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [openKycDialog, setOpenKycDialog] = useState(false);
  const [accessToken, setAccessToken] = useState(null);

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isMobile900 = useMediaQuery(theme.breakpoints.down("md"));

  // const handleDisable2fa = async () => {
  //   try {
  //     await apiPost("users/disable2fa", {});
  //     await initialize();
  //     notifySuccess("Verificação em duas etapas desativada com sucesso", {
  //       time: 5000,
  //     });
  //     mutate();
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const getAccessToken = async () => {
    try {
      const response = await apiGet("/kyc/sumsub/applicants/access-token");
      return response?.token || response;
    } catch (error) {
      console.error("Error fetching access token:", error);
      notifyError(t("identity_verification_failed"));
      throw error;
    }
  };

  const accessTokenExpirationHandler = async () => {
    try {
      const newToken = await getAccessToken();
      return newToken;
    } catch (error) {
      console.error("Error renewing access token:", error);
      setOpenKycDialog(false);
      setIsLoading(false);
      notifyError(t("identity_verification_expired"));
      return null;
    }
  };

  const isCreateDateDifferentFromToday = (createDate: string) => {
    if (!createDate) return false;
    
    const today = new Date();
    const createdDate = new Date(createDate);
    
    const todayDateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const createdDateOnly = new Date(createdDate.getFullYear(), createdDate.getMonth(), createdDate.getDate());
    
    return todayDateOnly.getTime() !== createdDateOnly.getTime();
  };

  const revalidateUser = async () => {
    try {
      await apiPost("/kyc/sumsub/applicants/revalidate", {});
      console.log("Usuário revalidado com sucesso");
    } catch (error) {
      console.error("Erro ao revalidar usuário:", error);
    }
  };

  const checkAndRevalidateUser = async (payload: any) => {
    const { reprocessing, createDate } = payload;
    
    if (reprocessing === true || isCreateDateDifferentFromToday(createDate)) {
      console.log("Condições para revalidação atendidas:", { reprocessing, createDate });
      await revalidateUser();
    }
  };

  const messageHandler = (type, payload) => {
    console.log("Sumsub WebSDK Message:", type, payload);

    // Verificação concluída com sucesso
    if (
      (type === "idCheck.applicantStatus" ||
        type === "idCheck.onApplicantStatusChanged" ||
        type === "applicantReviewed") &&
      payload.reviewStatus === "completed" &&
      payload.reviewResult?.reviewAnswer === "GREEN"
    ) {
      checkAndRevalidateUser(payload);
      
      notifySuccess("Verificação de identidade concluída com sucesso!", {
        time: 5000,
      });
      setOpenKycDialog(false);
      mutate();
      return;
    }

    // Quando o widget estiver pronto
    if (type === "idCheck.onReady") {
      setIsLoading(false);
      return;
    }

    // Tratamento para aplicante em espera (onHold)
    if (
      type === "applicantOnHold" &&
      payload.reviewStatus === "onHold" &&
      payload.reviewResult?.reviewAnswer === "RED"
    ) {
      handleRejectionMessages(payload);
      return;
    }

    // Tratamento para revisão rejeitada
    if (
      (type === "applicantReviewed" || type === "idCheck.applicantStatus") &&
      payload.reviewStatus === "completed" &&
      payload.reviewResult?.reviewAnswer === "RED"
    ) {
      handleRejectionMessages(payload);
      return;
    }
  };

  // Função auxiliar para tratar mensagens de rejeição com base nos rótulos
  const handleRejectionMessages = (payload) => {
    const { rejectLabels = [], buttonIds = [] } = payload.reviewResult || {};

    // Verificar se há problemas com fotos
    if (rejectLabels.includes("UNSATISFACTORY_PHOTOS")) {
      if (buttonIds.includes("badPhoto_dataNotVisible")) {
        notifyError(
          "As informações do seu documento não estão visíveis. Por favor, tire novas fotos com melhor iluminação e certifique-se que todos os dados estejam legíveis.",
          { time: 10000 }
        );
      } else if (buttonIds.includes("badPhoto_screenshot")) {
        notifyError(
          "Não é permitido usar capturas de tela. Por favor, tire fotos diretamente do documento original.",
          { time: 10000 }
        );
      } else {
        notifyError(
          "As fotos enviadas não atendem aos requisitos. Por favor, tire novas fotos com melhor qualidade.",
          { time: 10000 }
        );
      }
      return;
    }

    // Verificar se há problemas com documentos
    if (rejectLabels.includes("DOCUMENT_PAGE_MISSING")) {
      notifyError(
        "Está faltando alguma página do documento. Por favor, envie todas as páginas necessárias.",
        { time: 10000 }
      );
      return;
    }

    if (rejectLabels.includes("SCREENSHOTS")) {
      notifyError(
        "Não é permitido usar capturas de tela. Por favor, tire fotos diretamente do documento original.",
        { time: 10000 }
      );
      return;
    }

    // Mensagem genérica para outros casos de rejeição
    notifyError(
      "Sua verificação não foi aprovada. Por favor, tente novamente seguindo as instruções.",
      { time: 5000 }
    );
  };

  const errorHandler = (error) => {
    console.error("Sumsub WebSDK Error:", error);
    notifyError(t("identity_verification_error"));
    setIsLoading(false);
  };

  const launchSumsub = async () => {
    setIsLoading(true);

    try {
      const token = await getAccessToken();
      setAccessToken(token);
      setOpenKycDialog(true);
    } catch (error) {
      console.error("Error starting verification:", error);
      setIsLoading(false);
      notifyError(t("identity_verification_failed"));
    }
  };

  const handleCloseKycDialog = () => {
    setOpenKycDialog(false);
    setAccessToken(null);
  };

  const config = {
    lang: "pt",
    uiConf: {
      customCssStr: `
        :root {
          --black: #000000;
          --grey: #F5F5F5;
          --grey-darker: #B2B2B2;
          --border-color: #DBDBDB;
        }
        
        p {
          color: var(--black);
          font-size: 16px;
          line-height: 24px;
        }
        
        section {
          margin: 40px auto;
        }
        
        input {
          color: var(--black);
          font-weight: 600;
          outline: none;
        }
        
        section.content {
          background-color: var(--grey);
          color: var(--black);
          padding: 40px 40px 16px;
          box-shadow: none;
          border-radius: 6px;
        }
        
        button.submit,
        button.back {
          text-transform: capitalize;
          border-radius: 6px;
          height: 48px;
          padding: 0 30px;
          font-size: 16px;
          background-image: none !important;
          transform: none !important;
          box-shadow: none !important;
          transition: all 0.2s linear;
        }
        
        button.submit {
          min-width: 132px;
          background: none;
          background-color: var(--black);
        }
        
        .round-icon {
          background-color: var(--black) !important;
          background-image: none !important;
        }
      `,
    },
  };

  const options = {
    addViewportTag: false,
    adaptIframeHeight: true,
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
            label={t("identity_verification")}
            description={t("identity_verification_description")}
            descriptionColor="#7f8b92"
            fontSize={14}
            fontWeight="400"
            icon={<HiIdentification size={24} />}
            circleSize={40}
          />
        </Box>
        {!user?.verified ? (
          <Button
            variant="contained"
            onClick={launchSumsub}
            disabled={isLoading}
            sx={{ width: isMobile900 ? "100%" : "auto", minWidth: "100px" }}
          >
            <Typography variant="body1">
              {isLoading ? t("loading") : t("enable")}
            </Typography>
          </Button>
        ) : (
          <Button
            variant="contained"
            disabled={true}
            sx={{
              width: isMobile900 ? "100%" : "auto",
              minWidth: "100px",
              background: "#4b4b4b5e !important",
            }}
          >
            <Typography variant="body1" ml={1} color="#FFF">
              {t("enabled")}
            </Typography>
          </Button>
        )}
      </Stack>

      <Dialog
        open={openKycDialog}
        onClose={handleCloseKycDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            height: "80vh",
            maxHeight: "700px",
            position: "relative",
          },
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 10,
            right: 10,
            zIndex: 1000,
            backgroundColor: "rgba(255,255,255,0.7)",
            borderRadius: "50%",
            width: 36,
            height: 36,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
          onClick={handleCloseKycDialog}
        >
          <Typography>✕</Typography>
        </Box>

        {accessToken && (
          <Box sx={{ width: "100%", height: "100%" }}>
            <SumsubWebSdk
              accessToken={accessToken}
              expirationHandler={accessTokenExpirationHandler}
              config={config}
              options={options}
              onMessage={messageHandler}
              onError={errorHandler}
            />
          </Box>
        )}
      </Dialog>
    </>
  );
}
