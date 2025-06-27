import {
  Box,
  Button,
  Link,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import numeral from "numeral";
import "numeral/locales/pt-br";
import { useTranslation } from "react-i18next";
import {
  CgArrowBottomLeft,
  CgArrowsExchangeAltV,
  CgArrowTopRight,
} from "react-icons/cg";
import { IoWallet } from "react-icons/io5";
import { MdCandlestickChart } from "react-icons/md";
import { useNavigate } from "react-router";
import { CircleIconProgress } from "src/components/CircleIconProgress";
import SensitiveInfo from "src/components/SensitiveInfo";
import TitleWithCircleIcon from "src/components/TitleWithCircleIcon";
import useAccountsBalance from "src/swr/use-accounts-balance";

const buttonLinks = [
  {
    id: 1,
    labelKey: "deposit",
    link: "/dashboard/profile/deposit",
    icon: <CgArrowBottomLeft size={18} />,
  },
  {
    id: 2,
    labelKey: "withdraw",
    link: "/dashboard/profile/to_withdraw",
    icon: <CgArrowTopRight size={18} />,
  },
];

const style = {
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
  border: "1px solid #164736",
  padding: "1.75rem 1.5rem",
  background: "#070f14",
  color: "#EEE",
  borderRadius: "8px",

  "& .rounded_button": {
    background: "#10181d",
    color: "#01db97",
    borderRadius: "24px",
    padding: "4px 8px",
    cursor: "pointer",
    transition: "transform 0.2s ease-in-out",
    "&:hover": {
      background: "#101b21",
      transform: "translateY(-4px)",
    },
  },
  "& .account_type_card": {
    width: "100%",
    background: "#0b1419",
    borderRadius: "24px",
    padding: "2rem",
  },
};

numeral.locale("pt-br");

const AccountsDataAccordion = () => {
  const { t } = useTranslation("accounts_data_accordion");
  const navigate = useNavigate();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const { data: accountsBalance } = useAccountsBalance();

  const spotValue = accountsBalance?.SPOT.totalInUsdt || 0;
  const tradingValue = accountsBalance?.TRADING.totalInUsdt || 0;
  const total = spotValue + tradingValue;

  const spotPercentage = total > 0 ? (spotValue / total) * 100 : 0;
  const tradingPercentage = total > 0 ? (tradingValue / total) * 100 : 0;

  const typeAccountOptions = [
    {
      id: 1,
      labelKey: "trade_account",
      icon: <MdCandlestickChart size={26} color="#01db97" />,
      value: accountsBalance?.TRADING.totalInUsdt,
      progress: tradingPercentage,
    },
    {
      id: 2,
      labelKey: "crypto_account",
      icon: <IoWallet size={26} color="#01db97" />,
      value: accountsBalance?.SPOT.totalInUsdt,
      progress: spotPercentage,
    },
  ];

  return (
    <Box sx={style}>
      <Stack
        gap={2}
        direction={{ xs: "column", md: "row" }}
        justifyContent="space-between"
      >
        <TitleWithCircleIcon
          label={t("account_balance")}
          fontSize={18}
          icon={<IoWallet size={24} />}
          circleSize={42}
        />

        <Stack direction="row" gap={isMobile ? 1 : 2}>
          {buttonLinks.map((item) => (
            <Button
              className="rounded_button"
              onClick={() => navigate(item.link)}
              key={item.id}
              sx={{
                ...(isMobile && {
                  width: "100%",
                  justifyContent: "center",
                }),
              }}
            >
              <TitleWithCircleIcon
                icon={item.icon}
                label={t(item.labelKey)}
                circleSize={isMobile ? 16 : 32}
                bgColor="#1c252b"
                fontSize={isMobile ? 12 : 14}
                sx={{
                  paddingLeft: item.id === 1 && isMobile ? "8px" : "initial",
                  "& .flex_center": {
                    marginRight: "4px",
                  },
                }}
              />
            </Button>
          ))}
          <Link
            className="rounded_button"
            href="/exchange/portfolio?transfer"
            sx={{
              textDecoration: "none",
              ...(isMobile && {
                width: "100%",
                justifyContent: "center",
              }),
            }}
          >
            <TitleWithCircleIcon
              icon={<CgArrowsExchangeAltV size={isMobile ? 16 : 20} />}
              label={t("transfer")}
              circleSize={isMobile ? 16 : 32}
              bgColor="#1c252b"
              fontSize={isMobile ? 12 : 14}
              sx={{
                "& .flex_center": { marginRight: "4px", marginTop: "1px" },
              }}
            />
          </Link>
        </Stack>
      </Stack>

      <Stack spacing={2} direction={{ xs: "column", sm: "row" }}>
        {typeAccountOptions.map((item) => (
          <Stack
            spacing={2}
            direction="row"
            className="account_type_card"
            key={item.id}
          >
            <CircleIconProgress
              icon={item.icon}
              progress={item.progress}
              thickness={3}
            />
            <Stack direction="column">
              <Typography variant="body1" color="#677d8a">
                {t(item.labelKey)}
              </Typography>
              <Typography variant="h5">
                <SensitiveInfo
                  text={`$${numeral(item.value).format("0,0.00")}`}
                />
              </Typography>
            </Stack>
          </Stack>
        ))}
      </Stack>
    </Box>
  );
};

export default AccountsDataAccordion;
