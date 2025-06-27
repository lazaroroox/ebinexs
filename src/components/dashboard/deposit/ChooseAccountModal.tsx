import { Close } from "@mui/icons-material";
import {
  Box,
  IconButton,
  Modal,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import numeral from "numeral";
import { useTranslation } from "react-i18next";
import { BiSolidWallet } from "react-icons/bi";
import { FaRegDotCircle } from "react-icons/fa";
import { FaRegCircle } from "react-icons/fa6";
import { MdCandlestickChart } from "react-icons/md";
import TitleWithCircleIcon from "src/components/TitleWithCircleIcon";

const modalStyle = {
  "& .modal_content": {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    maxWidth: 450,
    width: "80%",
    border: "1px solid #132028",
    background: "#080c0ea8",
    padding: " 2rem",
    outline: "none",
    borderRadius: "12px",
    backdropFilter: "blur(5px)",
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

function ChooseAccountModal({
  openModal,
  handleClose,
  selectedAccountType,
  handleChangeAccountType,
  accountsBalance,
  balanceComplete,
}) {
  const { t } = useTranslation("dashboard");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const accountTypeOptions = [
    {
      type: "TRADING",
      label: t("choose_account_modal.accounts.trading.label"),
      icon: <MdCandlestickChart size={24} />,
      totalInUsdt: balanceComplete?.availableForWithdrawal,
    },
    {
      type: "SPOT",
      label: t("choose_account_modal.accounts.spot.label"),
      icon: <BiSolidWallet size={24} />,
      totalInUsdt: accountsBalance?.SPOT?.totalInUsdt,
    },
  ];

  const isSelectedAccountEqualAccountType = (accountType) => {
    return selectedAccountType === accountType;
  };

  return (
    <Modal open={openModal} onClose={() => handleClose()} sx={modalStyle}>
      <Box sx={{ minWidth: isMobile ? "80%" : null }} className="modal_content">
        <IconButton
          aria-label="close"
          onClick={() => handleClose()}
          sx={{
            position: "absolute",
            right: 8,
            top: 16,
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
          <Typography variant="h6" fontWeight="400" color="#EEE">
            {t("choose_account_modal.title")}
          </Typography>

          {accountTypeOptions.map((account) => (
            <Stack
              key={account.type}
              direction={"row"}
              alignItems="center"
              className="choice_account_buttom"
              borderColor={
                isSelectedAccountEqualAccountType(account.type)
                  ? "#01db97 !important"
                  : "#18212a"
              }
              onClick={() => handleChangeAccountType(account.type)}
            >
              <TitleWithCircleIcon
                label={account.label}
                description={`$${numeral(account.totalInUsdt).format(
                  "0,0.00"
                )} USDT`}
                descriptionColor="#80909a"
                icon={account.icon}
                circleSize={40}
              />
              {isSelectedAccountEqualAccountType(account.type) ? (
                <FaRegDotCircle size={20} color={"#1AC18C"} />
              ) : (
                <FaRegCircle size={20} color={"#1AC18C"} />
              )}
            </Stack>
          ))}
        </Stack>
      </Box>
    </Modal>
  );
}

export default ChooseAccountModal;
