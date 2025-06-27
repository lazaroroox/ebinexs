import {
  Box,
  Button,
  Modal,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";

const modalStyle = {
  "& .modal_content": {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    maxWidth: 700,
    textAlign: "center",
    width: "80%",
    border: "1px solid #132028",
    background: "#090e12e0",
    padding: " 3rem",
    borderRadius: "12px",
    backdropFilter: "blur(5px)",
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  "& .choice_account_buttom": {
    justifyContent: "space-between",
    background: "#090f12",
    borderRadius: "16px",
    padding: "1rem",
    border: "1px solid rgb(24 33 42)",
    cursor: "pointer",
    "&:hover": {
      background: "#060c0f",
    },
  },
};

function ModalMessageWIthIcon({
  openModal,
  handleClose,
  title,
  description,
  icon,
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Modal open={openModal} onClose={() => handleClose()} sx={modalStyle}>
      <Box
        sx={{
          minWidth: isMobile ? "80%" : null,
          padding: isMobile ? "initial" : "4rem 2rem",
        }}
        className="modal_content"
      >
        <Box className="icon_box">{icon}</Box>
        <Typography color="#EEE" variant="h5" fontWeight={500}>
          {title}
        </Typography>
        <Typography fontSize={16} color="#CCC">
          {description}
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={() => handleClose()}
          fullWidth
        >
          Continuar
        </Button>
      </Box>
    </Modal>
  );
}

export default ModalMessageWIthIcon;
