import { Close, Mail } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Backdrop,
  Box,
  Button,
  Chip,
  CircularProgress,
  FormControl,
  IconButton,
  Link,
  MenuItem,
  Modal,
  Paper,
  Select,
  SelectChangeEvent,
  Stack,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { DataGrid, GridColDef, GridExpandMoreIcon } from "@mui/x-data-grid";
import { ptBR } from "@mui/x-data-grid/locales";
import { DatePicker } from "@mui/x-date-pickers";
import { format, subDays } from "date-fns";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { BsClockHistory } from "react-icons/bs";
import { FaCalendarAlt } from "react-icons/fa";
import { IoMdCloseCircle } from "react-icons/io";
import CustomDataGridToolBar from "src/components/CustomDataGridToolBar";
import Logo from "src/components/Logo";
import ReloadIconButton from "src/components/ReloadIconButton";
import TextCopy from "src/components/TextCopy";
import TitleWithCircleIcon from "src/components/TitleWithCircleIcon";
import labelsColors from "src/theme/labelsColors";
import { PaginationMetadata } from "src/types/common";
import { Withdrawal } from "src/types/withdrawal";
import formatCurrencyBRL from "src/utils/formatCurrencyBRL";
import { notifyError } from "src/utils/toast";
import { apiGet } from "../../../services/apiService";

const style = {
  p: 2,
  background: "#070f14",
  color: "#EEE",
  borderRadius: "8px",
  width: "100%",
  "& .MuiPaper-root": {
    background: "transparent",
  },

  "& .MuiInputBase-root": {
    backgroundColor: "#0c151a",
  },
  "& fieldset": {
    border: "none",
    outline: "none",
  },
  "& .MuiDataGrid-root": {
    border: "none",
    fontSize: "0.875rem",
  },
  ".MuiDataGrid-topContainer::after": {
    background: "transparent",
  },
  "& .MuiDataGrid-columnHeader--moving": {
    background: "transparent !important",
  },
  ".MuiDataGrid-footerContainer": {
    borderColor: "#11181d",
  },
  "& .MuiDataGrid-row:hover": {
    backgroundColor: "#09141a",
  },
  "& .MuiDataGrid-cell": {
    color: "#CCC",
    display: "flex",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    borderColor: "rgb(26, 26, 26)",
    border: "none",
    outline: "none !important",
  },
  "& .MuiDataGrid-columnHeaders, & .MuiDataGrid-columnHeader": {
    backgroundColor: "#0f181e",
    border: "none",
  },
  "& .btn_date_wrapper": {
    display: "flex",
    gap: "0.5rem",
    height: "51px",
    background: "#0c151a",
  },
  "& .MuiDataGrid-withBorderColor": {
    border: "none",
  },
  "& .MuiDataGrid-scrollbar.MuiDataGrid-scrollbar--horizontal": {
    backgroundColor: "#FFF",
    height: 8,
    "&::-webkit-scrollbar": {
      width: 4,
    },
    "&::-webkit-scrollbar-track": {
      backgroundColor: "transparent",
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "transparent",
    },
  },
};

const ACCOUNT_LIST = ["Conta de Trade", "Conta de Cripto"];

const STATUS_LIST = [
  "all_statuses",
  "APPROVED",
  "COMPLETE",
  "IN_PROCESS",
  "CANCELED",
];

const INIT_FILTER_DATA = {
  withdrawalStatus: STATUS_LIST[0],
  dateFrom: subDays(new Date(), 30),
  dateTo: new Date(),
};

const INIT_METADATA: PaginationMetadata = {
  numberOfElements: 0,
  totalElements: 0,
  totalPages: 0,
};

interface WithdrawListTableProps {
  reloadFlag: boolean;
}

const DepositListTable = ({ reloadFlag }: WithdrawListTableProps) => {
  const { t } = useTranslation("dashboard");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [openReceiptModal, setOpenReceiptModal] = useState(false);
  const [messageModal, setMessageModal] = useState("");
  const [showDatePickers, setShowDatePickers] = useState(false);

  const [loadingWithdraw, setLoadingWithdraw] = useState(false);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [accountType, setAccountType] = useState("Conta de Trade");
  const [activeFiltersData, setActiveFiltersData] = useState(INIT_FILTER_DATA);
  const [metadata, setMetadata] = useState<PaginationMetadata>(INIT_METADATA);
  const [sortModel, setSortModel] = useState([
    { field: "createdAt", sort: "DESC" },
  ]);

  const dataGridColumns: GridColDef[] = [
    {
      field: "gatewayTransactionId",
      headerName: t("pix_transaction_id"),
      flex: isMobile ? undefined : 1,
      width: isMobile ? 125 : undefined,
      renderCell: (params) => (
        <TextCopy
          text={{ id: String(params.id), value: params.value as string }}
        />
      ),
    },
    {
      field: "createdAt",
      headerName: t("date"),
      flex: isMobile ? undefined : 1,
      width: isMobile ? 100 : undefined,
      renderCell: (params) => {
        if (!params.value) return "";

        const formattedDate = format(new Date(params.value), "dd/MM/yyyy");
        const formattedTime = format(new Date(params.value), "HH:mm:ss");

        return (
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span>{formattedDate + " " + formattedTime}</span>
          </div>
        );
      },
    },
    // {
    //   field: "amount",
    //   headerName: t("value"),
    //   flex: isMobile ? undefined : 1,
    //   width: isMobile ? 150 : undefined,
    //   valueFormatter: (value) =>
    //     value != null ? `$ ${numeral(value).format("0,0.00")}` : "",
    // },
    {
      field: "brlAmount",
      headerName: t("amount"),
      flex: isMobile ? undefined : 1,
      width: isMobile ? 150 : undefined,
      valueGetter: (value, row) => {
        const brlAmount = row.gatewayCustomData?.internalData?.brlAmount;
        return formatCurrencyBRL(brlAmount);
      },
    },
    // {
    //   field: "conversionRate",
    //   headerName: t("conversion_rate"),
    //   flex: isMobile ? undefined : 1,
    //   width: isMobile ? 150 : undefined,
    //   valueGetter: (value, row) => {
    //     const conversionRate =
    //       row.gatewayCustomData?.internalData?.conversionRate;
    //     return conversionRate ? `${conversionRate.toFixed(2)}%` : "N/A";
    //   },
    // },
    {
      field: "gatewayTransactionType",
      headerName: t("type"),
      flex: isMobile ? undefined : 1,
      width: isMobile ? 100 : undefined,
      renderCell: (params) => (
        <span
          style={{
            fontWeight: 500,
            color:
              params.value === "PIX"
                ? "#00A667"
                : params.value === "CRYPTO"
                ? "#ffb92e"
                : "transparent",
          }}
        >
          {params.value}
        </span>
      ),
    },
    {
      field: "pixKey",
      headerName: t("pixKey"),
      flex: isMobile ? undefined : 1,
      width: isMobile ? 150 : undefined,
      valueGetter: (value, row) =>
        row.gatewayCustomData?.internalData?.pixKey || "N/A",
    },
    {
      field: "status",
      headerName: "Status",
      flex: isMobile ? undefined : 1,
      width: isMobile ? 150 : undefined,
      renderCell: (params) => (
        <Chip
          label={t(String(params.value).toLowerCase())}
          sx={{
            ...labelsColors[params.value],
            fontWeight: 400,
            fontSize: 14,
          }}
        />
      ),
    },
    {
      field: "gatewayCustomData",
      headerName: t("proof"),
      flex: isMobile ? undefined : 1,
      width: isMobile ? 150 : undefined,
      renderCell: (params) => {
        const item = params.row;
        const internalData = item.gatewayCustomData?.internalData;

        const blockchainTxid = internalData?.blockchainTxid;
        const blockchainTxidLink = internalData?.blockchainTxidLink;

        return (
          <Tooltip title={blockchainTxid || t("pending")}>
            <Typography
              color="textSecondary"
              variant="subtitle2"
              sx={{
                fontSize: isMobile ? 7 : 14,
              }}
            >
              {item.status !== "CANCELED" && (
                <>
                  {blockchainTxid ? (
                    <Link href={blockchainTxidLink} target="_blank">
                      {`${blockchainTxid.slice(0, 10)}...`}
                    </Link>
                  ) : (
                    t("pending")
                  )}
                </>
              )}
              {item.status === "CANCELED" && (
                <Link
                  href="#"
                  onClick={() => showMessageModal(item.rejectionMessage)}
                >
                  Ver nota
                </Link>
              )}
            </Typography>
          </Tooltip>
        );
      },
    },
  ];

  const getWithdrawals = async (page = 0) => {
    setLoadingWithdraw(true);
    try {
      const query = formatQueryParams();
      const response = await apiGet(
        `/bank/withdrawals?${query}`,
        undefined,
        accountType === "Conta de Cripto"
      );
      const { data, numberOfElements, totalElements, totalPages } = response;
      setMetadata({ numberOfElements, totalElements, totalPages });
      setWithdrawals(data);
      setLoadingWithdraw(false);
    } catch (err) {
      notifyError("Erro ao carregar lista de saques");
      setLoadingWithdraw(false);
      console.error(err);
    }
  };

  const formatQueryParams = () => {
    let query = "";

    const { withdrawalStatus, dateFrom, dateTo } = activeFiltersData;

    query =
      query +
      `&withdrawalStatus=${
        withdrawalStatus === "all_statuses"
          ? "APPROVED, COMPLETE, IN_PROCESS, CANCELED"
          : withdrawalStatus
      }`;

    query = query + `&from=${format(dateFrom, "yyyy-MM-dd")}`;
    query = query + `&to=${format(dateTo, "yyyy-MM-dd")}`;
    query = query + `&size=${pageSize}`;
    query = query + `&page=${page}`;

    if (sortModel.length !== 0) {
      query =
        query +
        `&sortAttributeName=${
          sortModel[0].field
        }&sortMode=${sortModel[0].sort.toUpperCase()}`;
    } else {
      query = query + `&sortAttributeName=createdAt&sortMode=DESC`;
    }

    return query;
  };

  const changeSelect = (
    event: SelectChangeEvent<typeof activeFiltersData.withdrawalStatus>
  ) => {
    const { name, value } = event.target;

    setActiveFiltersData({
      ...activeFiltersData,
      [name]: value,
    });
  };

  const handleShowDatePickers = () => {
    setShowDatePickers(!showDatePickers);
  };

  const showMessageModal = (message: string) => {
    setMessageModal(message);
    setOpenReceiptModal(true);
  };

  const closeMessageModal = () => {
    setMessageModal("");
    setOpenReceiptModal(false);
  };

  const handleChangeDate = (date: Date | null, name: "dateFrom" | "dateTo") => {
    setActiveFiltersData((prev) => ({
      ...prev,
      [name]: date,
    }));
  };

  useEffect(() => {
    getWithdrawals();
  }, [activeFiltersData, page, pageSize, sortModel, reloadFlag, accountType]);

  return (
    <>
      <Box sx={style}>
        <Accordion elevation={0}>
          <AccordionSummary expandIcon={<GridExpandMoreIcon />}>
            <TitleWithCircleIcon
              label={t("history")}
              fontSize={18}
              icon={<BsClockHistory size={24} />}
              circleSize={40}
            />
          </AccordionSummary>
          <AccordionDetails>
            <Box>
              <Backdrop
                sx={{
                  color: "#fff",
                  alignItems: "center",
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                  justifyContent: "center",
                  zIndex: (theme) => theme.zIndex.drawer + 1,
                }}
                open={loadingWithdraw}
              >
                <Logo />
                <CircularProgress color="inherit" sx={{ mt: 4 }} />
              </Backdrop>

              <Stack
                direction={isMobile ? "column" : "row"}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "0.5rem",
                  width: isMobile ? "100%" : "initial",
                }}
                spacing={2}
              >
                <Box>
                  <Typography
                    sx={{
                      fontSize: "1.25rem",
                      fontWeight: 500,
                      color: "#EEE",
                    }}
                  >
                    {t("withdrawal_history")}
                  </Typography>
                  {withdrawals.length > 0 && (
                    <Typography
                      color="textPrimary"
                      variant="body1"
                      pt={1}
                      fontFamily="Inter"
                      sx={{ color: "#677985" }}
                    >
                      {`Total de saques: ${metadata.totalElements}`}
                    </Typography>
                  )}
                </Box>

                <Stack
                  direction={"row"}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "0.5rem",
                    width: isMobile ? "100%" : "initial",
                    flexDirection: isMobile ? "column" : "row",
                  }}
                  spacing={2}
                >
                  <FormControl
                    fullWidth
                    sx={{
                      minWidth: 120,
                      maxWidth: isMobile ? "100%" : 200,
                      pt: isMobile && 1,
                    }}
                  >
                    <Select
                      labelId="select-account"
                      id="select-account"
                      name="account"
                      value={accountType}
                      onChange={(e) => setAccountType(e.target.value)}
                    >
                      {ACCOUNT_LIST.map((account) => (
                        <MenuItem key={account} value={account}>
                          {account}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl
                    fullWidth
                    sx={{
                      minWidth: 120,
                      maxWidth: isMobile ? "100%" : 200,
                      pt: isMobile && 1,
                    }}
                  >
                    <Select
                      labelId="select-coin"
                      id="select-statuse"
                      name="withdrawalStatus"
                      value={activeFiltersData.withdrawalStatus}
                      onChange={changeSelect}
                    >
                      {STATUS_LIST.map((status) => (
                        <MenuItem key={status} value={status}>
                          {t(status.toLowerCase())}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  {!isMobile && !showDatePickers && (
                    <Button
                      onClick={handleShowDatePickers}
                      className="btn_date_wrapper"
                      sx={{
                        width: isMobile ? "100%" : "160px",
                        padding: isMobile ? "1rem 0" : "initial",
                      }}
                    >
                      <FaCalendarAlt size={20} />
                      <Typography variant="body1">Data</Typography>
                    </Button>
                  )}

                  {showDatePickers || isMobile ? (
                    <Box
                      sx={{
                        display: "flex",
                        gap: "1rem",
                        position: "relative",
                        margin: isMobile && "0.5rem 0 0 !important",
                        flexDirection: isMobile ? "column" : "row",
                      }}
                    >
                      {!isMobile && (
                        <IoMdCloseCircle
                          size={20}
                          onClick={handleShowDatePickers}
                          style={{
                            color: "#1af8a7",
                            position: "absolute",
                            right: 0,
                            top: -24,
                            cursor: "pointer",
                          }}
                        />
                      )}
                      <FormControl fullWidth sx={{ minWidth: 120, margin: 0 }}>
                        <DatePicker
                          label={t("from")}
                          format="dd/MM/yyyy"
                          value={INIT_FILTER_DATA.dateFrom}
                          onChange={(value) =>
                            handleChangeDate(value, "dateFrom")
                          }
                        />
                      </FormControl>
                      <FormControl fullWidth sx={{ minWidth: 120, margin: 0 }}>
                        <DatePicker
                          label={t("until")}
                          format="dd/MM/yyyy"
                          value={INIT_FILTER_DATA.dateTo}
                          onChange={(value) =>
                            handleChangeDate(value, "dateTo")
                          }
                        />
                      </FormControl>
                    </Box>
                  ) : null}
                  {!isMobile && (
                    <ReloadIconButton
                      loading={loadingWithdraw}
                      fetchFunction={getWithdrawals}
                    />
                  )}
                </Stack>
              </Stack>
              <DataGrid
                localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
                slots={{ toolbar: CustomDataGridToolBar }}
                rows={withdrawals}
                columns={dataGridColumns}
                rowCount={metadata.totalElements}
                initialState={{
                  pagination: {
                    paginationModel: { page: 0, pageSize: 5 },
                  },
                }}
                paginationModel={{ page: page, pageSize: pageSize }}
                pageSizeOptions={[5, 10, 25, 50]}
                paginationMode="server"
                onPaginationModelChange={(newModel) => {
                  setPage(newModel.page);
                  setPageSize(newModel.pageSize);
                }}
                pagination
                onSortModelChange={(model) => {
                  if (model.length > 0) {
                    setSortModel([...model]);
                    setPage(0);
                  }
                }}
                sortingOrder={["desc", "asc"]}
                isRowSelectable={() => false}
                slotProps={{
                  toolbar: {
                    sx: {
                      "@media screen and (max-width: 600px)": {
                        display: "grid",
                        gridTemplateColumns: "repeat(2, 1fr)",
                        width: "100%",

                        "& .MuiButtonBase-root": {
                          width: "auto !important",
                        },
                      },
                    },
                  },
                  filterPanel: {
                    sx: {
                      "& .MuiDataGrid-filterForm": {
                        flexDirection: "column",
                        gap: 2,
                      },
                      "& .MuiDataGrid-filterFormDeleteIcon": {
                        width: "max-content",
                        alignSelf: "flex-end",
                        margin: 0,
                      },
                      "& .MuiFormControl-root": {
                        width: "auto",
                      },
                    },
                  },
                  pagination: {
                    SelectProps: {
                      MenuProps: {
                        anchorOrigin: {
                          vertical: "top",
                          horizontal: "center",
                        },
                        transformOrigin: {
                          vertical: "bottom",
                          horizontal: "center",
                        },
                      },
                    },
                  },
                }}
              />
            </Box>
          </AccordionDetails>
        </Accordion>
      </Box>

      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={openReceiptModal}
        onClose={closeMessageModal}
      >
        <Paper sx={{ p: 3, minWidth: 250 }}>
          <Stack direction={"column"} spacing={2}>
            <Stack
              direction={"row"}
              alignItems={"center"}
              justifyContent={"space-between"}
            >
              <Typography
                fontSize={isMobile ? "0.6rem" : "1rem"}
                fontWeight="bold"
                textAlign={"center"}
              >
                {t("return_note")}
              </Typography>
              <IconButton
                aria-label="close"
                onClick={closeMessageModal}
                color="error"
                sx={{
                  color: (theme) => theme.palette.error[500],
                }}
              >
                <Close />
              </IconButton>
            </Stack>
            <Stack direction={"column"} spacing={2}>
              <Typography>{messageModal}</Typography>
            </Stack>
            <Stack
              direction={"row"}
              justifyContent="space-between"
              spacing={2}
              pt={3}
            >
              <Logo
                sx={{
                  mt: 0.5,
                  height: 18,
                  width: 80,
                }}
              />
              <Stack direction="row" spacing={1}>
                <IconButton
                  color="primary"
                  aria-label="email"
                  href="mailto:support@ebinex.global"
                >
                  <Mail fontSize="small" />
                </IconButton>
              </Stack>
            </Stack>
          </Stack>
        </Paper>
      </Modal>
    </>
  );
};

export default DepositListTable;
