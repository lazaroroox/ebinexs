import { Close, Mail } from "@mui/icons-material";
import {
    IconButton,
    Link,
    Modal,
    Paper,
    Stack,
    Typography,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import LayoutContext from "src/contexts/LayoutContext";
import Logo from "../Logo";

const PaperStyled = styled(Paper)({
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  maxWidth: 550,
  border: "1px rgba(255, 255, 255, 0.2) solid",
});

function BetaDepositInfoModal() {
  const { t } = useTranslation("dashboard");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { layout, setModalBetaDepositInfo } = useContext(LayoutContext);

  return (
    <Modal
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
      open={layout.modalBetaDepositInfoModal}
      onClose={() => setModalBetaDepositInfo(false)}
    >
      <PaperStyled sx={{ p: 3 }}>
        <Stack direction="column" spacing={2}>
          <IconButton
            aria-label="close"
            onClick={() => setModalBetaDepositInfo(false)}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <Close />
          </IconButton>

          <Stack direction={"column"} spacing={2}>
            <Typography
              fontSize={isMobile ? "0.8rem" : "1rem"}
              fontWeight="bold"
              textAlign={"center"}
            >
              Teste Beta em Andamento!
            </Typography>
            <Typography fontSize={isMobile ? "0.6rem" : "0.8rem"}>
              Nossa plataforma está em fase de teste beta e, por enquanto, a
              função de depósito e saque está desabilitada. Estamos focando em
              fornecer uma experiência de trading perfeita aos usuários
              escolhidos, por meio de nossa conta demo na dashboard.
            </Typography>
            <Typography fontSize={isMobile ? "0.6rem" : "0.8rem"}>
              Agradecemos a sua paciência e compreensão neste período de teste e
              estamos trabalhando arduamente para tornar nossa plataforma a
              melhor opção para traders de todos os níveis de habilidade.
            </Typography>
            <Typography fontSize={isMobile ? "0.6rem" : "0.8rem"}>
              Fique de olho em nossas atualizações para obter mais informações
              sobre as próximas etapas. Obrigado por escolher a nossa plataforma
              para suas negociações!
            </Typography>
            <Typography fontSize={isMobile ? "0.6rem" : "0.8rem"}>
              Para entrar em contato, envie um e-mail para{" "}
              <Link
                color="textPrimary"
                underline="none"
                variant="body1"
                sx={{ color: "#00dc98" }}
                href="mailto:support@ebinex.global"
              >
                support@ebinex.global
              </Link>
            </Typography>
            <Typography fontSize={isMobile ? "0.6rem" : "0.8rem"}>
              Muito obrigado por sua ajuda e, mais uma vez, seja bem-vindo à
              revolução.
            </Typography>
          </Stack>
          <Stack
            direction={"row"}
            justifyContent="space-between"
            spacing={2}
            pt={3}
          >
            <Logo
              sx={{
                mt: 0.5,
                height: 25,
                width: 104,
              }}
            />
            <Stack direction="row" spacing={1}>
              <IconButton
                color="primary"
                aria-label="email"
                href="mailto:support@ebinex.global"
              >
                <Mail />
              </IconButton>
            </Stack>
          </Stack>
        </Stack>
      </PaperStyled>
    </Modal>
  );
}

export default BetaDepositInfoModal;
