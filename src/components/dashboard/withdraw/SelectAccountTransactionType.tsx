import { Stack, Typography, useMediaQuery, useTheme } from "@mui/material";
import numeral from "numeral";
import { useTranslation } from "react-i18next";
import { BiSolidWallet } from "react-icons/bi";
import { IoIosArrowDown } from "react-icons/io";
import { MdCandlestickChart } from "react-icons/md";
import TitleWithCircleIcon from "src/components/TitleWithCircleIcon";
import useAccountsBalance from "src/swr/use-accounts-balance";

const style = {
  marginTop: "0 !important",
  padding: "0.5rem 0",
  "& .choice_account_buttom": {
    width: "100%",
    minWidth: "100px",
    justifyContent: "space-between",
    border: "1px solid #111e26",
    padding: "0.5rem 1rem",
    borderRadius: "16px",
    background: "#0a141b",
    cursor: "pointer",
    "&:hover": {
      background: "#0c1820",
    },
  },
};

const SelectAccountTransactionType = ({
  selectedAccountType,
  setOpenModal,
  label,
  balanceComplete,
}) => {
  const { t } = useTranslation("dashboard");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const { data: accountsBalance } = useAccountsBalance();

  const accountTypeOptions = {
    TRADING: {
      label: t("choose_account_modal.accounts.trading.label"),
      icon: <MdCandlestickChart size={24} />,
      totalInUsdt: balanceComplete?.availableForWithdrawal,
    },
    SPOT: {
      label: t("choose_account_modal.accounts.spot.label"),
      icon: <BiSolidWallet size={24} />,
      totalInUsdt: accountsBalance?.SPOT?.totalInUsdt,
    },
  };
  const selectedOption = accountTypeOptions[selectedAccountType];

  return (
    <Stack direction={"column"} spacing={1} sx={style}>
      <Typography fontSize={isMobile ? "0.75rem" : "1rem"}>{label}</Typography>
      <Stack
        direction={"row"}
        alignItems="center"
        className="choice_account_buttom"
        onClick={() => setOpenModal(true)}
      >
        {selectedOption && (
          <TitleWithCircleIcon
            label={selectedOption.label}
            description={`$${numeral(selectedOption.totalInUsdt).format(
              "0,0.00"
            )} USDT`}
            descriptionColor="#80909a"
            icon={selectedOption.icon}
            circleSize={40}
          />
        )}
        <IoIosArrowDown size={20} color={"#FFF"} />
      </Stack>
    </Stack>
  );
};

export default SelectAccountTransactionType;
