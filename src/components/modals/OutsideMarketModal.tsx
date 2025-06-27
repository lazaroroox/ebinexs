import { Close } from "@mui/icons-material";
import {
  Button,
  IconButton,
  Modal,
  Paper,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { MouseEvent, useContext } from "react";
import { useTranslation } from "react-i18next";
import { HiOutlineSignalSlash } from "react-icons/hi2";
import LayoutContext from "src/contexts/LayoutContext";
import { useSymbolMenu } from "src/contexts/SymbolMenuContext";

const PaperStyled = styled(Paper)({
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  maxWidth: 550,
  borderRadius: "12px",
  borderBottom: "2px solid #00B474",
  backdropFilter: "blur(14px)",
  background: "transparent",
  outline: 0,

  display: "flex",
  flexDirection: "column",
  gap: "1.25rem",
  alignItems: "center",
  justifyContent: "center",
  padding: "1.25rem 1rem",
});

function OutsideMarketModal() {
  const { t } = useTranslation("dashboard");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { layout, setModalOutsideMarket } = useContext(LayoutContext);

  const { handleOpen } = useSymbolMenu();

  const handleCloseModalReal = (e?: MouseEvent<HTMLElement>) => {
    setModalOutsideMarket(false, "");
    handleOpen(e);
  };

  return (
    <Modal
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
      open={layout.modalOutsideMarket}
      onClose={handleCloseModalReal}
    >
      <PaperStyled sx={{ minWidth: isMobile ? "80%" : "480px" }}>
        <IconButton
          aria-label="close"
          onClick={() => setModalOutsideMarket(false, "")}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <Close />
        </IconButton>
        <Stack
          direction="column"
          alignItems="center"
          justifyContent="center"
          gap={2}
        >
          <HiOutlineSignalSlash size={46} color="#ff025c" />

          <Typography fontWeight={700} fontSize={20}>
            {t("selected_asset_closed")}
          </Typography>
        </Stack>

        <Button
          size="large"
          color="primary"
          variant="contained"
          onClick={handleCloseModalReal}
          sx={{ borderRadius: "12px" }}
        >
          {t("explore_available_assets")}
        </Button>
      </PaperStyled>
    </Modal>
  );
}

export default OutsideMarketModal;
