import { Close } from "@mui/icons-material";
import {
  Box,
  Button,
  Divider,
  IconButton,
  Modal,
  Paper,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import { FaNoteSticky } from "react-icons/fa6";

const PaperStyled = styled(Paper)({
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  maxWidth: 450,
  width: "80%",
  border: "1px solid #031118",
  background: "#000406e8",
  padding: " 2rem",
  outline: "none",
  borderRadius: "12px",
  backdropFilter: "blur(12px)",
});

const modalStyle = {
  "& .modal_content": {
    justifyContent: "space-evenly",
    alignItems: "center",
    gap: "1.25rem",
  },
};

export const scrollStyle = {
  maxHeight: "430px",
  marginLeft: "8px",
  overflow: "auto",
  paddingBottom: "16px",
  " &::-webkit-scrollbar": {
    width: "4px",
  },
  "&::-webkit-scrollbar-track": {
    background: "#1c1c1c",
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: "#01DB97",
    borderRadius: "20px",
    border: "none",
  },
};

const note_versao = "v2.0.1";

const notes = [
  {
    title: "Novidades",
    content: [
      "A Ebinex tem o prazer de anunciar o lançamento de duas novas funcionalidades projetadas para aprimorar sua experiência de negociação e investimento em criptomoedas:",
    ],
  },
  {
    title: "Ebinex Exchange:",
    content: [
      "Apresentamos a Ebinex Exchange, uma plataforma de negociação de criptomoedas completa e intuitiva. Desenvolvida com foco na segurança e eficiência, a Ebinex Exchange oferece um ambiente robusto para você comprar, vender e negociar uma ampla variedade de ativos digitais de onde estiver. Acesse a Ebinex Exchange de forma fácil e rápida clicando na sua foto de perfil dentro do aplicativo. Explore novos mercados e oportunidades de investimento com a confiança que só a Ebinex oferece.",
    ],
  },
  {
    title: "Melhorias",
    content: [
      "Continuamos comprometidos em otimizar a sua experiência na Ebinex. Nesta atualização, implementamos diversas melhorias focadas em usabilidade, performance e segurança:",
    ],
  },
  {
    title: "Nova Interface da Traderoom:",
    content: [
      "A interface da traderoom foi completamente redesenhada para proporcionar uma experiência de negociação mais fluida e eficiente. Desfrute de um layout aprimorado, com informações mais claras e acessíveis, além de otimizações significativas de performance para garantir uma execução rápida e sem interrupções de suas ordens.",
    ],
  },
  {
    title: "Nova Interface de Minha Conta, Saque, Depósito e Segurança:",
    content: [
      "As seções de gerenciamento da sua conta foram reformuladas para oferecer maior clareza e facilidade de uso. As interfaces de Minha Conta, Saque, Depósito e Segurança foram unificadas e modernizadas, tornando a navegação mais intuitiva e o gerenciamento dos seus fundos e dados pessoais mais simples e seguro.",
    ],
  },
  {
    title: "Implementação de KYC (Know Your Customer:",
    content: [
      "Para reforçar a segurança da nossa plataforma e cumprir as regulamentações vigentes, implementamos o processo de KYC (Conheça Seu Cliente). Este procedimento de verificação de identidade contribui para um ambiente de negociação mais seguro e confiável para todos os usuários da Ebinex. ",
    ],
  },
];
function ReleaseNotesModal({ onClose }: any) {
  const { t } = useTranslation("dashboard");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Modal
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
      open={true}
      sx={modalStyle}
    >
      <PaperStyled sx={{ minWidth: isMobile ? "80%" : null }}>
        <IconButton
          aria-label="close"
          onClick={onClose}
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
        <Stack direction="column" spacing={2}>
          <Box sx={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <FaNoteSticky color="#01DB97" size={28} />
            <Typography variant="h6" fontWeight="400">
              Notas de Atualização Ebinex
            </Typography>
          </Box>

          <Box sx={scrollStyle}>
            {notes.map((note, index) => (
              <Box key={`${note.title}-${index}`}>
                <Box sx={{ width: "100%" }}>
                  <Typography
                    variant="body2"
                    gap={0.5}
                    sx={{ fontWeight: 500, fontSize: 14, mb: 1 }}
                  >
                    <span style={{ color: "#00B474" }}>●</span> {note.title}
                  </Typography>
                  <Divider />
                </Box>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{
                    padding: "1rem 0",
                    borderBottom: "1px solid #031118",
                    marginBottom: "1rem",
                    "*::-webkit-scrollbar": {
                      width: "0.4em",
                    },
                    "*::-webkit-scrollbar-track": {
                      "-webkit-box-shadow":
                        "inset 0 0 6px rgba(10, 222, 59, 0)",
                    },
                    "*::-webkit-scrollbar-thumb": {
                      backgroundColor: "rgba(0,0,0,.1)",
                      outline: "1px solid slategrey",
                    },
                  }}
                >
                  <Stack>
                    {note.content.map((item, index) => (
                      <Stack
                        direction={"row"}
                        spacing={1}
                        sx={{ color: "#888888" }}
                        key={item}
                      >
                        <span style={{ fontSize: 8, paddingTop: 4 }}>●</span>
                        <Typography
                          key={index}
                          variant="body2"
                          sx={{
                            fontSize: 14,
                            fontWeight: 300,
                          }}
                        >
                          {item}
                        </Typography>
                      </Stack>
                    ))}
                  </Stack>
                </Stack>
              </Box>
            ))}
            <Box sx={{ height: "1rem" }} />
            <Typography
              variant="body2"
              sx={{
                fontSize: 14,
                fontWeight: 300,
              }}
            >
              Agradecemos a sua colaboração neste importante passo para a
              segurança da nossa comunidade.
            </Typography>
          </Box>
          <Box>
            <Typography
              variant="body2"
              sx={{
                color: "#01DB97",
                fontWeight: 300,
                fontSize: 14,
                textAlign: "end",
                mb: 2,
              }}
            >
              {note_versao}
            </Typography>
            <Button
              size="large"
              color="primary"
              variant="contained"
              onClick={onClose}
              fullWidth
            >
              Ok
            </Button>
          </Box>
        </Stack>
      </PaperStyled>
    </Modal>
  );
}

export default ReleaseNotesModal;
