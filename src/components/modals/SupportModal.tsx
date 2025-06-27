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
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  border: "1px rgba(255, 255, 255, 0.2) solid",
  width: "calc(100% - 32px)",
  margin: "auto",
  maxWidth: 550,
  padding: "12px",
});

function SupportModal() {
  const { t } = useTranslation("dashboard");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { layout, setModalSupport } = useContext(LayoutContext);

  const openJivoChat = () => {
    window.jivo_api.open();
  };

  return (
    <Modal
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
      open={layout.modalSupport}
      onClose={() => setModalSupport(false)}
      sx={{ overflow: "auto" }}
    >
      <PaperStyled>
        <Stack direction="column" spacing={2}>
          <IconButton
            aria-label="close"
            onClick={() => setModalSupport(false)}
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
              fontSize={isMobile ? "1.2rem" : "1.5rem"}
              fontWeight="bold"
              textAlign={"center"}
            >
              Suporte Ebinex
            </Typography>
            <Typography
              fontSize={"1rem"}
              fontWeight="bold"
              textAlign={"center"}
            >
              Ajude-nos a melhorar!
            </Typography>
            <Typography align={"justify"} fontWeight={300}>
              <span style={{ fontWeight: "bold" }}>
                Valorizamos sua experiência
              </span>{" "}
              em nossa plataforma e agradecemos qualquer feedback que possa nos
              ajudar a nos tornar a melhor corretora do mercado.
            </Typography>
            <Typography align={"justify"} fontWeight={300}>
              Se você encontrar algum bug ou erro, por favor, entre em contato
              conosco imediatamente.
            </Typography>
            <Typography align={"justify"} fontWeight={300}>
              Além disso, estamos sempre abertos a receber sugestões e críticas
              construtivas sobre nossos serviços. Sua opinião é fundamental para
              aprimorar a experiência de nossos usuários.
            </Typography>
            <Typography align={"justify"} fontWeight={300}>
              Para entrar em contato, faleconosco via Telegram:{" "}
              <Link
                color="textPrimary"
                underline="none"
                variant="body1"
                sx={{ color: "#00dc98" }}
                href="https://t.me/EbinexbrBot"
              >
                https://t.me/EbinexbrBot
              </Link>{" "}
              ou clique{" "}
              <Link
                color="textPrimary"
                underline="none"
                variant="body1"
                sx={{ color: "#00dc98" }}
                onClick={openJivoChat}
                href="#"
              >
                aqui
              </Link>{" "}
              para falar conosco via chat
            </Typography>

            <Typography align={"justify"} fontWeight={300}>
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
                href="mailto:help@ebinex.global"
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

export default SupportModal;
