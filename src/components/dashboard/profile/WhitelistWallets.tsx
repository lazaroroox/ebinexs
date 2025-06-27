import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { GridExpandMoreIcon } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaRegTrashAlt } from "react-icons/fa";
import { IoWalletSharp } from "react-icons/io5";
import AddWalletModal from "src/components/modals/AddWalletModal";
import TitleWithCircleIcon from "src/components/TitleWithCircleIcon";
import { apiDelete, apiGet } from "src/services/apiService";
import { notifySuccess } from "src/utils/toast";

const style = {
  p: 2,
  background: "#070f14",
  color: "#EEE",
  borderRadius: "16px",
  margin: "1rem 0",
  "& .MuiAccordionSummary-content": {
    justifyContent: "space-between",
    alignItems: "center",
  },
  "& .add_wallet_button": {
    display: "none",
  },
  "& .Mui-expanded .add_wallet_button": {
    display: "block",
    marginRight: "1rem",
    padding: "0.5rem 1.5rem",
  },
  "&::before": {
    display: "none",
  },
  "& .content": {
    fontSize: "4rem",
    paddingTop: "2rem",
    color: "#798e9b",
    display: "flex",
    alignItems: "center",
    gap: "1rem",
  },
  "& .MuiTableRow-hover": {
    "&:hover": {
      background: "#091216 !important",
    },
  },
  "& .MuiInputBase-input": {
    backgroundColor: "#0f181e",
  },
  "& .MuiTableRow-head": {
    backgroundColor: "#0f181e",
  },
  "& .MuiTableBody-root": {
    backgroundColor: "#070f14",
    border: "none",
  },
  "& .MuiTableCell-root": {
    border: "none",
  },
  "& .delete_icon": {
    color: "#02fe9d",
  },
};

const columns = ["type", "address", "action"];

export default function WhitelistWallets() {
  const { t } = useTranslation("dashboard");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [withdrawalAddress, setWithdrawalAddress] = useState([]);
  const [openNewWalletModal, setOpenNewWalletModal] = useState(false);

  useEffect(() => {
    getWallets();
  }, []);

  const getWallets = async () => {
    try {
      const address = await apiGet(
        "/users/withdrawalAddress/whitelist?filterValidOnly=false"
      );
      setWithdrawalAddress(address);
    } catch (error) {
      console.log();
    }
  };

  const removeWallet = async (id: string) => {
    try {
      await apiDelete(
        `/users/withdrawalAddress/whitelist?withdrawalAddressId=${id}`,
        {}
      );
      notifySuccess(t("remove_wallet_success"));
      getWallets();
    } catch (error) {
      console.log();
    }
  };

  const handleCloseModal = () => {
    setOpenNewWalletModal(false);
  };

  const handleOpenModal = (e: any) => {
    e.stopPropagation();
    setOpenNewWalletModal(true);
  };

  return (
    <>
      <Accordion elevation={0} sx={style}>
        <AccordionSummary expandIcon={<GridExpandMoreIcon />}>
          <Stack
            direction={isMobile ? "column" : "row"}
            alignItems="center"
            justifyContent="space-between"
            spacing={2}
            width={"100%"}
          >
            <TitleWithCircleIcon
              label={t("wallets")}
              fontSize={16}
              description={t("registered_wallets_for_withdrawals")}
              descriptionColor="#7f8b92"
              icon={<IoWalletSharp size={20} />}
              circleSize={32}
            />
            <Button
              className="add_wallet_button"
              variant="contained"
              onClick={handleOpenModal}
              sx={{ width: isMobile ? "100%" : "auto" }}
            >
              <Typography>{t("to_add")}</Typography>
            </Button>
          </Stack>
        </AccordionSummary>
        <AccordionDetails>
          <TableContainer
            component={Paper}
            sx={{
              display: "flex",
              maxHeight: "auto",
              width: "100%%",
              boxShadow: "none",
            }}
          >
            <Table sx={{ width: 1 }}>
              <TableHead sx={{ backgroundColor: "#f4f4f414" }}>
                <TableRow>
                  {columns.map((item) => (
                    <TableCell key={item}>
                      <Typography
                        color="textSecondary"
                        variant="subtitle1"
                        sx={{
                          fontSize: isMobile ? 12 : 14,
                          color: "#EEE",
                          fontWeight: 500,
                        }}
                      >
                        {t(item)}
                      </Typography>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody
                sx={{
                  backgroundColor: "#ffffff0a",
                }}
              >
                {withdrawalAddress.length ? (
                  withdrawalAddress.map((item, index) => (
                    <TableRow
                      hover
                      key={index}
                      sx={{
                        fontSize: isMobile ? 12 : 14,
                        color: "#EEE",
                        fontWeight: 500,
                      }}
                    >
                      <TableCell>
                        <Typography
                          color="textSecondary"
                          variant="subtitle2"
                          sx={{
                            fontSize: isMobile ? 12 : 14,
                          }}
                        >
                          {item.transactionType}
                          {item.transactionType === "CRYPTO" &&
                            ` (${item.network})`}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          color="textSecondary"
                          variant="subtitle2"
                          sx={{
                            fontSize: isMobile ? 12 : 14,
                          }}
                        >
                          {item.transactionType === "PIX"
                            ? item.pixKey
                            : item.address}
                        </Typography>
                      </TableCell>
                      <TableCell
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Button onClick={() => removeWallet(item.id)}>
                          <FaRegTrashAlt className="delete_icon" size={16} />
                          <Typography
                            variant="body1"
                            color="textSecondary"
                            sx={{ ml: 1 }}
                          >
                            {t("delete")}
                          </Typography>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell rowSpan={1} colSpan={6}>
                      <Box sx={{ my: 1, textAlign: "center" }}>
                        <Typography variant="body1" color="textSecondary">
                          {t("there_is_no_registered_wallet")}
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </AccordionDetails>
      </Accordion>

      <AddWalletModal
        openNewWalletModal={openNewWalletModal}
        handleCloseModal={handleCloseModal}
        getWallets={getWallets}
      />
    </>
  );
}
