import { Close } from "@mui/icons-material";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  IconButton,
  Modal,
  Paper,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { AiFillDollarCircle } from "react-icons/ai";
import { FaCircleCheck } from "react-icons/fa6";
import { LiaAngleDoubleRightSolid } from "react-icons/lia";
import { RiGraduationCapFill } from "react-icons/ri";
import AccountContext from "src/contexts/AccountContext";

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
  "& .account_card": {
    width: `200px`,
    outline: `2px solid #030e14`,
    borderRadius: `8px`,
    textAlign: `center`,
    padding: "1.25rem 0",
    position: "relative",

    "&.real": {
      border: "2px solid #1ac18c",
      background: "#01160f",
    },

    "&.demo": {
      border: "2px solid #ff0156",
      background: "#0e0508",
    },

    "&.disabled": {
      opacity: "0.3",
      borderColor: " #172127",
      background: "transparent",
    },

    "& .checkIcon": {
      position: "absolute",
      top: "-24px",
      right: "-24px",
      borderRadius: "50%",
      width: "46px",
      height: "46px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
  },
};

function ChangeAccountModal({ openModal, handleClose }) {
  const { t } = useTranslation("dashboard");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { activeAccount } = useContext(AccountContext);
  const [showModal, setShowModal] = useState(true);
  const [hideAccountModal, setHideAccountModal] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      localStorage.setItem("hideAccountModal", "true");
      setHideAccountModal(true);
    } else {
      localStorage.setItem("hideAccountModal", "false");
      setHideAccountModal(false);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("hideAccountModal") === "true") {
      handleClose();
    }
  }, []);

  return (
    <Modal
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
      open={openModal}
      onClose={() => handleClose()}
      sx={modalStyle}
    >
      <PaperStyled sx={{ minWidth: isMobile ? "80%" : null }}>
        <IconButton
          aria-label="close"
          onClick={() => handleClose()}
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
          <Typography variant="h6" fontWeight="400">
            {t("account_type_changed")}
          </Typography>

          {activeAccount.label === "REAL" ? (
            <Box>
              <Box className="modal_content" sx={{ display: "flex" }}>
                <Box className="account_card demo disabled">
                  <RiGraduationCapFill size={32} color="#FF2370" />
                  <Typography variant="body1">{t("account")} Demo</Typography>
                </Box>
                <LiaAngleDoubleRightSolid size={28} color="#CCC" />
                <Box className="account_card real">
                  <AiFillDollarCircle size={32} color="#1ac18c" />
                  <Box className="checkIcon" sx={{ background: "#112921" }}>
                    <FaCircleCheck size={28} color="#1ac18c" />
                  </Box>
                  <Typography variant="body1">{t("account")} Real</Typography>
                </Box>
              </Box>
              <Typography variant="body1" pt={2} sx={{ color: "#9db6c5" }}>
                <span style={{ color: "#26f9b6" }}>{t("account")} real:</span>{" "}
                {t("real_account_message")}
              </Typography>
            </Box>
          ) : (
            <Box>
              <Box className="modal_content" sx={{ display: "flex" }}>
                <Box className="account_card real disabled">
                  <AiFillDollarCircle size={32} color="#1ac18c" />
                  <Typography variant="body1">{t("account")} Real</Typography>
                </Box>
                <LiaAngleDoubleRightSolid size={28} color="#CCC" />
                <Box className="account_card demo">
                  <RiGraduationCapFill size={32} color="#FF2370" />
                  <Box className="checkIcon" sx={{ background: "#1e0c12" }}>
                    <FaCircleCheck size={28} color="#ff2370" />
                  </Box>
                  <Typography variant="body1">{t("account")} Demo</Typography>
                </Box>
              </Box>
              <Typography variant="body1" pt={2} sx={{ color: "#9db6c5" }}>
                <span style={{ color: "#ff216f" }}>{t("account")} demo: </span>{" "}
                {t("demo_account_message")}
              </Typography>
            </Box>
          )}

          <FormGroup>
            <FormControlLabel
              sx={{ color: "#9db6c5" }}
              control={
                <Checkbox
                  checked={hideAccountModal}
                  onChange={handleChange}
                  slotProps={{ input: { "aria-label": "controlled" } }}
                />
              }
              label={t("dont_show_message_again")}
            />
          </FormGroup>

          <Button
            size="large"
            sx={{
              backgroundColor: "#00B474",
              borderRadius: "8px",
              "&:hover": { backgroundColor: "#00A268" },
            }}
            variant="contained"
            onClick={(e) => handleClose()}
            fullWidth
          >
            {t("i_understood")}
          </Button>
        </Stack>
      </PaperStyled>
    </Modal>
  );
}

export default ChangeAccountModal;
