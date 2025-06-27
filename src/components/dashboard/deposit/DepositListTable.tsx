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
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { DataGrid, GridColDef, GridExpandMoreIcon } from "@mui/x-data-grid";
import { ptBR } from "@mui/x-data-grid/locales";
import { DatePicker } from "@mui/x-date-pickers";
import { format, subDays } from "date-fns";
import numeral from "numeral";
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
import useQuery from "src/hooks/useQuery";
import { apiGet } from "src/services/apiService";
import labelsColors from "src/theme/labelsColors";
import { PaginationMetadata } from "src/types/common";
import { Deposit } from "src/types/deposit";
import { notifyError } from "src/utils/toast";

const style = {
  p: 2,
  background: "#070f14",
  color: "#EEE",
  borderRadius: "8px",
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
  "& .MuiDataGrid-main": {
    padding: {
      xs: "1rem 0",
      md: "initial",
    },
  },
  "& .MuiDataGrid-cell:focus": {
    outline: " none",
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
  ".MuiDataGrid-filterForm": {
    display: "flex",
    flexDirection: "column",
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

const STATUS_LIST = ["all_statuses", "CONFIRMED", "PENDING", "EXPIRED"];

const INIT_FILTER_DATA = {
  depositStatus: STATUS_LIST[0],
  dateFrom: subDays(new Date(), 30),
  dateTo: new Date(),
};

const INIT_METADATA: PaginationMetadata = {
  numberOfElements: 0,
  totalElements: 0,
  totalPages: 0,
};

const DepositListTable = () => {
  const { t } = useTranslation("dashboard");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const query = useQuery();
  const depositId = query.get("depositId");
  const status = query.get("status");
  const [showDatePickers, setShowDatePickers] = useState(false);

  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [loadingDeposits, setLoadingDeposits] = useState(false);
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
    {
      field: "amount",
      headerName: t("value"),
      flex: isMobile ? undefined : 1,
      width: isMobile ? 120 : undefined,
      valueFormatter: (params) =>
        params != null ? `$ ${numeral(params).format("0,0.00")}` : "",
    },
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
      field: "status",
      headerName: "Status",
      flex: isMobile ? undefined : 1,
      width: isMobile ? 150 : undefined,
      renderCell: (params) => (
        <Box>
          <Chip
            label={t(String(params.value).toLowerCase())}
            sx={{
              ...labelsColors[params.value],
              fontWeight: 400,
              fontSize: 14,
            }}
          />
        </Box>
      ),
    },
  ];

  const getDeposits = async (page = 0) => {
    setLoadingDeposits(true);
    try {
      const query = formatQueryParams();
      const response = await apiGet(
        `/bank/deposits?${query}&gatewayTransactionTypes=PIX,CRYPTO`,
        undefined,
        accountType === "Conta de Cripto"
      );
      const { data, numberOfElements, totalElements, totalPages } = response;
      setMetadata({ numberOfElements, totalElements, totalPages });
      setDeposits(data);
      setLoadingDeposits(false);
    } catch (err) {
      notifyError("Erro ao carregar lista de depósitos");
      setLoadingDeposits(false);
      console.error(err);
    }
  };

  const formatQueryParams = () => {
    let query = "";

    const { depositStatus, dateFrom, dateTo } = activeFiltersData;

    query =
      query +
      `&depositStatuses=${
        depositStatus === "all_statuses"
          ? "CONFIRMED,PENDING,EXPIRED"
          : depositStatus
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

  const changeSelect = (event: SelectChangeEvent<string>) => {
    const { name, value } = event.target;
    setActiveFiltersData({
      ...activeFiltersData,
      [name]: value,
    });
  };

  const handleShowDatePickers = () => {
    setShowDatePickers(!showDatePickers);
  };

  const handleChangeDate = (date: Date | null, name: "dateFrom" | "dateTo") => {
    setActiveFiltersData((prev) => ({
      ...prev,
      [name]: date,
    }));
  };

  useEffect(() => {
    getDeposits();
  }, [
    activeFiltersData,
    depositId,
    status,
    page,
    pageSize,
    sortModel,
    accountType,
  ]);

  return (
    <>
      <Box sx={style}>
        <Accordion elevation={0}>
          <AccordionSummary expandIcon={<GridExpandMoreIcon />}>
            <TitleWithCircleIcon
              label={t("history")}
              fontSize={18}
              icon={<BsClockHistory />}
              circleSize={32}
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
                open={loadingDeposits}
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
                    {t("deposit_history")}
                  </Typography>
                  {deposits.length > 0 && (
                    <Typography
                      color="textPrimary"
                      variant="body1"
                      pt={1}
                      fontFamily="Inter"
                      sx={{ color: "#677985" }}
                    >
                      {`Total de depósitos: ${metadata?.totalElements}`}
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
                      marginLeft: isMobile ? "0 !important" : "initial",
                      maxWidth: isMobile ? "100%" : 200,
                      pt: isMobile ? 1 : undefined,
                    }}
                  >
                    <Select
                      labelId="select-coin"
                      id="select-statuse"
                      name="depositStatus"
                      value={activeFiltersData.depositStatus}
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
                        margin: isMobile ? "0.5rem 0 0 !important" : 0,
                        flexDirection: ["column", "row"],
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
                          value={activeFiltersData.dateFrom}
                          onChange={(value) =>
                            handleChangeDate(value, "dateFrom")
                          }
                        />
                      </FormControl>
                      <FormControl fullWidth sx={{ minWidth: 120, margin: 0 }}>
                        <DatePicker
                          label={t("until")}
                          format="dd/MM/yyyy"
                          value={activeFiltersData.dateTo}
                          onChange={(value) =>
                            handleChangeDate(value, "dateTo")
                          }
                        />
                      </FormControl>
                    </Box>
                  ) : null}

                  {!isMobile && (
                    <ReloadIconButton
                      loading={loadingDeposits}
                      fetchFunction={getDeposits}
                    />
                  )}
                </Stack>
              </Stack>

              <DataGrid
                localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
                slots={{ toolbar: CustomDataGridToolBar }}
                rows={deposits}
                columns={dataGridColumns}
                rowCount={metadata?.totalElements}
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
    </>
  );
};

export default DepositListTable;
