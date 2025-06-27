import { Close } from "@mui/icons-material";
import { Box, IconButton, Modal, Paper, Typography } from "@mui/material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "80%",
  height: "80%",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

const HistoryCandlesModal = ({ open, handleClose, title, children }) => {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Paper sx={style}>
        <IconButton
          aria-label="close"
          onClick={handleClose}
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
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6" fontWeight="400">
            {title}
          </Typography>
        </Box>
        <Box sx={{ mt: 2, height: "100%" }}>{children}</Box>
      </Paper>
    </Modal>
  );
};

export default HistoryCandlesModal;
