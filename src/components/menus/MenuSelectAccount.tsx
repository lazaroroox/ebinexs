import { Box, Stack, Typography, useMediaQuery } from "@mui/material";
import Button from "@mui/material/Button";
import Menu, { MenuProps } from "@mui/material/Menu";
import { styled, useTheme } from "@mui/material/styles";
import numeral from "numeral";
import { MouseEvent, useContext, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useTranslation } from "react-i18next";
import {
  MdArrowDropDown,
  MdArrowDropUp,
  MdOutlineWallet,
} from "react-icons/md";
import { TbReload } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import AccountContext from "src/contexts/AccountContext";
import LayoutContext from "src/contexts/LayoutContext";
import useApiData from "src/hooks/useApiData";
import useAuth from "src/hooks/useAuth";
import { apiPost } from "src/services/apiService";
import useHistoryOrders from "src/swr/use-history-orders";
import useOperationFilters from "src/swr/use-operation-filters";
import useParameters from "src/swr/use-parameters";
import { Account } from "src/types";
import { notifyError, notifySuccess } from "src/utils/toast";
import BingoAnimation from "../BingoAnimation ";
import EyeShowSensitiveInfo from "../EyeShowSensitiveInfo";
import ChangeAccountModal from "../modals/ChangeAccountModal";
import SensitiveInfo from "../SensitiveInfo";

const StyledMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "center",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "center",
    }}
    {...props}
  />
))(() => ({
  "& .MuiList-root": {
    padding: 0,
  },
  "& .MuiPaper-root": {
    background: "rgb(1 8 12)",
    border: "2px solid #04141d",
    marginTop: 16,
    borderRadius: 12,
  },
  "& .container_RealDemo": {
    display: "flex",
    alignItems: "center",
    "&:hover": {
      background: "linear-gradient(9deg, #09141a6b, transparent)",
      cursor: "pointer",
    },

    "&:first-of-type": {
      border: "1px solid #030e14",
    },
  },
  "& .left_RealDemo": {
    display: "flex",
    gap: "1rem",
    alignItems: "center",

    "& .info_RealDemo": {
      display: "flex",
      flexDirection: "column",
    },
  },
  "& .action_button_RealDemo": {
    height: "48px",
    padding: "0 1.25rem",
    borderRadius: "8px",
    marginLeft: "auto",
  },
}));

export default function MenuSelectAccount() {
  const { t } = useTranslation("dashboard");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const { setModalAlertAccountReal, setModalAlertAccountDemo } =
    useContext(LayoutContext);
  const { handleBalanceEvent, updateUserLiveOperations } = useApiData();
  const { switchAccount, initialize } = useAuth();
  const { accounts, activeAccount, setActiveAccount, mutate } =
    useContext(AccountContext);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [openModal, setOpenModal] = useState(false);
  const [cookies] = useCookies();

  const navigate = useNavigate();

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const verifyAccouunt = {
    REAL: {
      label: "Real",
      color: "#00B474",
      description: t("trade_real_balance"),
      btn_label: t("deposit"),
      borderColor: "#01DB97",
      buttonBackground: "#01DB97",
      icon: <MdOutlineWallet size={20} style={{ marginRight: "8px" }} />,
      hoverColor: "#01DB97",
    },
    DEMO: {
      label: "Demo",
      color: "#CA1B59",
      borderColor: "#FF025C",
      hoverColor: "#FF025C",
      buttonBackground: "transparent",
      description: t("train_false_balance"),
      btn_label: t("recharge"),
      icon: (
        <TbReload size={20} style={{ marginRight: "8px" }} color="#FF025C" />
      ),
    },
  };

  const { parameters } = useParameters();
  const { pairs } = useOperationFilters();

  const { mutate: mutateOrders } = useHistoryOrders({
    parameters,
    pairs,
  });

  useEffect(() => {
    const accountId = cookies["ebinex:accountId"];
    const accountActive = accounts.find((c: any) => c.id === accountId);

    if (window.location.pathname === "/traderoom") {
      const closedModalReal = localStorage.getItem("closeModalReal");
      const closedModalDemo = localStorage.getItem("closeModalDemo");

      if (accountActive) {
        if (accountActive?.label === "DEMO") {
          if (!closedModalDemo || closedModalDemo !== "true") {
            setModalAlertAccountDemo(true);
          }
        }
        if (accountActive?.label === "REAL") {
          if (!closedModalReal || closedModalReal !== "true") {
            setModalAlertAccountReal(true);
          }
        }
      }
    }

    handleBalanceEvent({
      event: "user_balance",
      payload: {
        usdt: accountActive?.defaultCoinBalance,
      },
    });
  }, []);

  useEffect(() => {
    if (activeAccount) {
      handleBalanceEvent({
        event: "user_balance",
        payload: {
          usdt: activeAccount?.defaultCoinBalance,
        },
      });
    }
  }, [activeAccount]);

  const handleSwitchAccount = async (account: Account) => {
    try {
      updateUserLiveOperations([]);
      await switchAccount(account);
      mutate("/users/listAccounts");
      mutate("/bank/balanceComplete");
      mutateOrders();
      setActiveAccount(account);
      notifySuccess(`Conta alterada com sucesso`);
      handleClose();
      setOpenModal(true);
    } catch (error) {
      await notifyError("Oops! Não foi possível efetuar a operação.");
    }
  };

  const addTestFunds = async () => {
    if (activeAccount.defaultCoinBalance > 10000) return;

    try {
      const testAccount = accounts.find(
        (account) => account.environment === "TEST"
      );
      await apiPost(
        "/bank/addTestFunds",
        {},
        {
          accountId: testAccount.id,
        }
      );
      notifySuccess(`Adicionado saldo com sucesso`);
      await initialize();
    } catch (error) {
      await notifyError("Oops! Não foi possível efetuar a operação.");
    }
  };

  const handleClickOptionMenu = (event, environment) => {
    event.stopPropagation();
    environment === "REAL"
      ? navigate("/dashboard/profile/deposit")
      : addTestFunds();
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  return (
    <>
      <Button
        id="demo-customized-button"
        aria-controls={open ? "demo-customized-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        variant="contained"
        style={{ backgroundColor: "transparent" }}
        sx={{
          py: isMobile ? 0.5 : undefined,
          px: isMobile ? 0 : 0.5,
          height: isMobile ? 42 : "3.5rem",
        }}
        onClick={handleClick}
        className="account-selection-section"
      >
        <Stack
          direction={"column"}
          justifyContent="center"
          alignItems={"start"}
        >
          <Typography
            fontSize={12}
            color={verifyAccouunt[activeAccount.label]?.hoverColor}
            fontWeight={500}
            whiteSpace="nowrap"
            display="flex"
            alignItems="center"
          >
            {t("account")} {verifyAccouunt[activeAccount.label]?.label}
            {open ? (
              <MdArrowDropUp size="20px" />
            ) : (
              <MdArrowDropDown size="20px" />
            )}
          </Typography>
          <BingoAnimation activeAccount={activeAccount} />
        </Stack>
      </Button>
      <StyledMenu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        sx={{
          "& .MuiPaper-root": {
            right: isMobile ? "0" : "null",
            left: isMobile ? "0" : "117px",
          },
        }}
      >
        {isMobile && (
          <Box
            sx={{
              width: "100%",
              paddingTop: "1rem",
              textAlign: "right",
              paddingRight: "2rem",
              color: "#606f79",
            }}
          >
            <EyeShowSensitiveInfo size={20} />
          </Box>
        )}
        {accounts.map((account) => (
          <Box
            className="container_RealDemo"
            key={account.id}
            onClick={() => handleSwitchAccount(account)}
            sx={{
              justifyContent: isMobile && "space-between",
              padding: isMobile ? "0.5rem 1rem 1rem" : "1rem 2rem",
              gap: isMobile ? "0.5rem" : "2rem",
            }}
          >
            <Box className="left_RealDemo">
              {activeAccount?.id === account.id ? (
                <Box
                  sx={{
                    backgroundColor:
                      account.environment === "REAL" ? "#04ffaf" : "#ff2370",
                    padding: "5px",
                    borderRadius: "50%",
                    cursor: "pointer",
                    border: `8px solid ${
                      account.environment === "REAL" ? "#082f22" : "#3d0b1c"
                    }`,
                  }}
                ></Box>
              ) : (
                <Box
                  sx={{
                    backgroundColor: "transparent",
                    padding: "5px",
                    borderRadius: "50%",
                    outline: "2px solid #07161e",
                    cursor: "pointer",
                    border: `8px solid transparent}`,
                    "&:hover": {
                      outlineColor: `#0f222c}`,
                    },
                  }}
                ></Box>
              )}
              <Box className="info_RealDemo">
                <Typography
                  variant="body1"
                  fontWeight={600}
                  color={verifyAccouunt[account.label]?.color}
                >
                  {t("account")} {verifyAccouunt[account.label]?.label}
                </Typography>
                <Typography
                  variant="h6"
                  className="xkxk"
                  style={{ lineHeight: isMobile && "normal" }}
                >
                  <SensitiveInfo
                    text={`$ ${numeral(account.defaultCoinBalance).format(
                      "0,0.00"
                    )}`}
                  />
                </Typography>
                <Typography variant="body1" color={"#606f79"}>
                  {verifyAccouunt[account.label]?.description}
                </Typography>
              </Box>
            </Box>
            <Button
              className="action_button_RealDemo"
              onClick={(e) => handleClickOptionMenu(e, account.environment)}
              sx={{
                width: isMobile ? "100%" : "140px",
                maxWidth: isMobile ? "90px" : "140px",
                height: isMobile ? "45px" : "56px",
                color: "#FFFFFF",
                backgroundColor:
                  verifyAccouunt[account.label]?.buttonBackground,
                border: `1px solid ${
                  verifyAccouunt[account.label]?.borderColor
                }`,
                transition: "all 0.3s ease",
                "&:hover": {
                  backgroundColor: verifyAccouunt[account.label]?.hoverColor,

                  "svg path": {
                    color: "#FFF",
                  },
                },
              }}
            >
              {!isMobile && verifyAccouunt[account.label]?.icon}
              <Typography fontSize={12} fontWeight={500} color="#FFF">
                {verifyAccouunt[account.label]?.btn_label}
              </Typography>
            </Button>
          </Box>
        ))}
      </StyledMenu>
      <ChangeAccountModal
        openModal={openModal}
        handleClose={handleCloseModal}
      />
    </>
  );
}
