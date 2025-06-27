import {
  Button,
  IconButton,
  Link,
  Modal,
  Paper,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import { Close } from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import LayoutContext from "src/contexts/LayoutContext";

const PaperStyled = styled(Paper)({
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  maxWidth: 650,
  border: "1px rgba(255, 255, 255, 0.2) solid",
});

function HowToDepositPix() {
  const { t } = useTranslation("dashboard");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { layout, setModalHowToDepositPix } = useContext(LayoutContext);

  return (
    <Modal
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
      open={layout.modalHowToDepositPix}
      onClose={() => setModalHowToDepositPix(false)}
    >
      <PaperStyled sx={{ p: 3, width: isMobile ? "80%" : null }}>
        <Stack direction={"column"} spacing={2}>
          <IconButton
            aria-label="close"
            onClick={() => setModalHowToDepositPix(false)}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <Close />
          </IconButton>
          <Typography align="center" fontWeight={"bold"}>
            COMO DEPOSITAR POR PIX P2P
          </Typography>

          <Stack direction={"column"} spacing={1}>
            <Typography fontSize={isMobile ? "0.6rem" : null}>
              <span style={{ fontWeight: "bold" }}>Passo 01:</span> Clique no
              botão
              <span style={{ color: "#00A667", fontWeight: "bold" }}>
                {" "}
                COMPRAR.
              </span>
            </Typography>
            <Typography fontSize={isMobile ? "0.6rem" : null}>
              <span style={{ fontWeight: "bold" }}>Passo 02:</span> Escolha o
              ativo TETHER(USDT), cor verde
            </Typography>
            <Typography fontSize={isMobile ? "0.6rem" : null}>
              <span style={{ fontWeight: "bold" }}>Passo 03:</span> Informe o
              valor que deseja depositar (mínimo de R$100 ou $20 USDT).
            </Typography>
            <Typography fontSize={isMobile ? "0.6rem" : null}>
              <span style={{ fontWeight: "bold" }}>Passo 04:</span> Clique em
              "Comprar".
            </Typography>
            <Typography fontSize={isMobile ? "0.6rem" : null}>
              <span style={{ fontWeight: "bold" }}>Passo 05:</span> Será aberta
              uma ordem no WhatsApp do parceiro P2P. A chave pix é escrita
              automaticamente na ordem.
            </Typography>
            <Typography fontSize={isMobile ? "0.6rem" : null}>
              <span style={{ fontWeight: "bold", color: "#FF5382" }}>
                Passo 06:
              </span>{" "}
              Envie o comprovante do depósito, seu nome completo e seu e-mail da
              Ebinex.<br></br>O BRL só será aceito se seu número de whatsapp ou
              e-mail da Ebinex forem a chave PIX de sua titularidade. <br></br>
              Ex: Titular João Silva da Costa <br></br>
              telefone = chave pix de João Silva da Costa <br></br>
              e-mail = chave pix de João Silva da Costa <br></br>
              Aceitaremos o PIX apenas dessa titularidade <br></br>
              *Não aceitamos depósitos de terceiros.
            </Typography>
            <Typography fontSize={isMobile ? "0.6rem" : null}>
              <span style={{ fontWeight: "bold" }}>Passo 07:</span> Envie o
              comprovante do depósito, seu saldo aparecerá em até
              1 hora na Ebinex
            </Typography>
          </Stack>

          <Button
            color="primary"
            component={Link}
            fullWidth
            sx={{ mt: 2, textDecoration: "underline" }}
            href="https://bit.ly/p2pebinex"
            variant="contained"
            target="_blannk"
            onClick={() => setModalHowToDepositPix(false)}
          >
            COMPRAR
          </Button>
        </Stack>
      </PaperStyled>
    </Modal>
  );
}

export default HowToDepositPix;
