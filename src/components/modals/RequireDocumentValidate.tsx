import { Close } from "@mui/icons-material";
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
import { styled } from "@mui/material/styles";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import LayoutContext from "src/contexts/LayoutContext";

const PaperStyled = styled(Paper)({
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  maxWidth: 650,
  border: "1px rgba(255, 255, 255, 0.2) solid",
});

function RequireDocumentValidate() {
  const { t } = useTranslation("dashboard");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const { layout, setModalRequireDocumentValidate } = useContext(LayoutContext);

  const handleToNavigateProfile = () => {
    setModalRequireDocumentValidate(false);
    navigate("/dashboard/profile");
  };

  return (
    <Modal
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
      open={layout.modalRequireDocumentValidate}
      onClose={() => setModalRequireDocumentValidate(false)}
      sx={{ bgcolor: "#000000cf" }}
    >
      <PaperStyled sx={{ p: 3, width: isMobile ? "80%" : null }}>
        <Stack direction={"column"} spacing={2}>
          <IconButton
            aria-label="close"
            onClick={() => setModalRequireDocumentValidate(false)}
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
            Para seguir com o PIX, faça a validação da sua conta!
          </Typography>

          <Button
            color="primary"
            component={Link}
            fullWidth
            sx={{ mt: 2, textDecoration: "underline" }}
            href="/dashboard/profile"
            variant="contained"
          >
            Validar minha conta
          </Button>
        </Stack>
      </PaperStyled>
    </Modal>
  );
}

export default RequireDocumentValidate;
