import {
  Box,
  Chip,
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import numeral from "numeral";
import { useContext, useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";

import {
  DataGrid,
  GridColDef,
  GridPaginationModel,
  GridRenderCellParams,
  GridSortModel,
  GridToolbar,
} from "@mui/x-data-grid";
import { ptBR } from "@mui/x-data-grid/locales";
import { MobileDatePicker } from "@mui/x-date-pickers";
import { format, subDays } from "date-fns";
import { useTranslation } from "react-i18next";
import CopyOnClick from "src/components/CopyOnClick";
import OperationsRevenue from "src/components/dashboard/operations-history/operations-revenue";
import AccountContext from "src/contexts/AccountContext";
import gtm from "src/lib/gtm";
import useOperationFilters from "src/swr/use-operation-filters";
import useOperationsHistory from "src/swr/use-operations-history";
import useOperationsStatistics from "src/swr/use-operations-statistics";
import labelsColors from "src/theme/labelsColors";
import { OrderStatusEnum } from "src/types/order";
import translate from "src/utils/translatorUtil";
import CustomDataGridToolBar from "src/components/CustomDataGridToolBar";

const INIT_ACTIVE_BALACE_FILTERS_DATA = {
  filterEnvironment: "",
  filterOperationDirections: "",
  filterSymbols: "",
  filterStatuses: "",
  dateFrom: subDays(new Date(), 10),
  dateTo: new Date(),
};

export function OrdersCenterTrade() {
  const { t } = useTranslation("dashboard");

  const { activeAccount } = useContext(AccountContext);
  const { environment, operationDirections, statuses, pairs, loading } =
    useOperationFilters();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isLess1200Width = useMediaQuery(theme.breakpoints.down("lg"));

  const [activeOperationsFiltersData, setActiveOperationsFiltersData] =
    useState(INIT_ACTIVE_BALACE_FILTERS_DATA);
  const [dateFrom, setDateFrom] = useState(
    INIT_ACTIVE_BALACE_FILTERS_DATA.dateFrom
  );
  const [dateTo, setDateTo] = useState(INIT_ACTIVE_BALACE_FILTERS_DATA.dateTo);
  const [{ page, pageSize }, setPageModel] = useState({
    page: 0,
    pageSize: 10,
  });

  const [sortModel, setSortModel] = useState<GridSortModel>([
    { field: "createdAt", sort: "desc" },
  ]);

  const [query, setQuery] = useState("");

  const {
    data: operations,
    totalElements,
    loading: loadingData,
  } = useOperationsHistory({
    query,
    page,
    pageSize,
  });

  const {
    data: statisticsData,
    loading: loadingStatistics,
  } = useOperationsStatistics({
    query,
    page: 0
  });

  const [chartPageSize, setChartPageSize] = useState(1000);

  const {
    data: allOperationsForChart,
    loading: loadingAllOperations,
  } = useOperationsHistory({
    query,
    page: 0,
    pageSize: chartPageSize
  });

  const assertivityOperations = useMemo(() => {
    const assertivityPercentage = statisticsData?.assertivity || 0;

    let accumulated = 0;
    const dataChart = (allOperationsForChart || []).map((item) => {
      accumulated += OrderStatusEnum[item.status] === "win" ? 1 : -1;

      return {
        status: item.status,
        accumulated,
      };
    });

    return {
      dataChart,
      assertivityPercentage,
    };
  }, [allOperationsForChart, statisticsData, loadingAllOperations]);

  useEffect(() => {
    gtm.push({ event: "page_view" });
  }, []);

  useEffect(() => {
    if (!loading) {
      const environmentActive = environment?.find((e) => {
        if (e.value === activeAccount?.environment) {
          return e;
        }
      });

      const _b = {
        filterEnvironment: environmentActive?.value,
        filterOperationDirections: operationDirections[0].value,
        filterStatuses: statuses[0].value,
        filterSymbols: pairs[0].value,
        dateFrom: subDays(new Date(), 10),
        dateTo: new Date(),
      };

      setActiveOperationsFiltersData(_b);
    }
  }, [loading, activeAccount]);

  const changeSelect = (event: SelectChangeEvent<string>) => {
    const { name, value } = event.target;
    setActiveOperationsFiltersData({
      ...activeOperationsFiltersData,
      [name]: value,
    });
  };

  const handleChangeDate = (date: Date, name: string) => {
    setActiveOperationsFiltersData({
      ...activeOperationsFiltersData,
      [name]: date,
    });
  };

  const fetchOperationsFilter = async () => {
    const query = formatQueryParams();
    setQuery(query);
  };

  const formatQueryParams = () => {
    let query = "";

    const {
      filterEnvironment,
      filterOperationDirections,
      filterStatuses,
      filterSymbols,
      dateFrom,
      dateTo,
    } = activeOperationsFiltersData;

    query = query + `environment=${filterEnvironment}`;

    if (filterOperationDirections === "ALL") {
      query =
        query +
        `&operationDirections=${operationDirections
          .map((t) => {
            return t.value;
          })
          .toString()}`;
    } else {
      query = query + `&operationDirections=${filterOperationDirections}`;
    }

    if (filterStatuses === "ALL") {
      query =
        query +
        `&statuses=${statuses
          .map((t) => {
            return t.value;
          })
          .toString()}`;
    } else {
      query = query + `&statuses=${filterStatuses}`;
    }

    if (filterSymbols === "ALL") {
      query =
        query +
        `&symbols=${pairs
          .map((t) => {
            return t.value.replace("/", "");
          })
          .toString()}`;
    } else {
      query = query + `&symbols=${filterSymbols.replace("/", "")}`;
    }

    query = query + `&dateFrom=${format(dateFrom, "yyyy-MM-dd")}`;
    query = query + `&dateTo=${format(dateTo, "yyyy-MM-dd")}`;

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

  useEffect(() => {
    if (operationDirections) {
      fetchOperationsFilter();
    }
  }, [activeOperationsFiltersData, pageSize, sortModel]);

  useEffect(() => {
    if (totalElements > 0) {
      setChartPageSize(Math.min(totalElements, 10000));
    }
  }, [totalElements]);

  const renderDatePickers = () => {
    return (
      <>
        <FormControl fullWidth sx={{ minWidth: 120 }}>
          <MobileDatePicker
            label={t("from")}
            format="dd/MM/yyyy"
            value={dateFrom}
            onChange={(e) => setDateFrom(e)}
            onAccept={(value) => handleChangeDate(value, "dateFrom")}
            // renderInput={(params) => <TextField {...params} />}
          />
        </FormControl>
        <FormControl fullWidth sx={{ minWidth: 120 }}>
          <MobileDatePicker
            label={t("until")}
            format="dd/MM/yyyy"
            value={dateTo}
            onChange={(e) => setDateTo(e)}
            onAccept={(value) => handleChangeDate(value, "dateTo")}
            // renderInput={(params) => <TextField {...params} />}
          />
        </FormControl>
      </>
    );
  };

  const renderSimbolsAndTimeFrames = () => {
    return (
      <>
        <FormControl fullWidth sx={{ minWidth: 120 }}>
          <Select
            labelId="select-type"
            id="select-type"
            name="filterOperationDirections"
            value={activeOperationsFiltersData.filterOperationDirections}
            onChange={changeSelect}
          >
            {operationDirections.map((item) => (
              <MenuItem key={item.value} value={item.value}>
                {t(item.label.toLowerCase())}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth sx={{ minWidth: 120 }}>
          <Select
            labelId="select-coin"
            id="select-coin"
            name="filterSymbols"
            value={activeOperationsFiltersData.filterSymbols}
            onChange={changeSelect}
          >
            {pairs
              .filter(
                (item) =>
                  item.value !== "BTCUSDC" &&
                  item.value !== "ETHUSDT_P" &&
                  item.value !== "USDTBRL"
              )
              .map((item) => (
                <MenuItem key={item.value} value={item.value}>
                  {t(item.label)}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
      </>
    );
  };

  const formatValue = (value) => {
    if (value == null) return "";

    const decimalPlaces = value.toString().split(".")[1]?.length || 0;
    let formatString = "0,0";

    if (decimalPlaces > 0) {
      formatString += ".";
      for (let i = 0; i < decimalPlaces; i++) {
        formatString += "0";
      }
    }

    return `$ ${numeral(value).format(formatString)}`;
  };

  const desktopGridColumns: GridColDef[] = [
    {
      field: "orderId",
      headerName: "ID",
      flex: isMobile ? undefined : 1,
      width: isMobile ? 150 : undefined,
      renderCell: (params: GridRenderCellParams<any, string>) => (
        <span title={params.value}>
          <CopyOnClick text={params.value} sx={{ color: "#EEE" }} onlyText />
        </span>
      ),
    },
    {
      field: "createdAt",
      headerName: t("date"),
      flex: isMobile ? undefined : 1,
      width: isMobile ? 150 : undefined,
      renderCell: (params) => {
        if (!params.value) return "";

        const formattedDate = format(new Date(params.value), "dd/MM/yyyy");
        const formattedTime = format(new Date(params.value), "HH:mm:ss");

        return (
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span>{formattedDate}</span>
            <span style={{ fontSize: "0.8rem", color: "#677985" }}>
              {formattedTime}
            </span>
          </div>
        );
      },
    },
    {
      field: "symbol",
      headerName: t("active"),
      flex: isMobile ? undefined : 1,
      width: isMobile ? 150 : undefined,
    },
    {
      field: "candleTimeFrame",
      headerName: t("time"),
      flex: isMobile ? undefined : 1,
      width: isMobile ? 150 : undefined,
    },
    {
      field: "orderDirection",
      headerName: t("prevision"),
      flex: isMobile ? undefined : 1,
      width: isMobile ? 150 : undefined,
      renderCell: (params) => (
        <Chip
          label={t(translate(params.value))}
          sx={{
            ...labelsColors[params.value],
            fontWeight: 400,
            fontSize: 14,
            my: "auto",
          }}
        />
      ),
    },
    {
      field: "candleStartTime",
      headerName: t("candle"),
      flex: isMobile ? undefined : 1,
      width: isMobile ? 150 : undefined,
      valueFormatter: (value: string) => {
        if (!value) return "";

        const formattedTimeValue = format(new Date(value), "HH:mm");
        return formattedTimeValue;
      },
    },
    {
      field: "cop",
      headerName: t("opening_price"),
      flex: isMobile ? undefined : 1.1,
      width: isMobile ? 150 : undefined,
      valueFormatter: (value: number) => formatValue(value),
    },
    {
      field: "ccp",
      headerName: t("closing_price"),
      flex: isMobile ? undefined : 1.1,
      width: isMobile ? 150 : undefined,
      valueFormatter: (value: number) => formatValue(value),
    },
    {
      field: "investment",
      headerName: t("value"),
      flex: isMobile ? undefined : 1,
      width: isMobile ? 150 : undefined,
      valueFormatter: (value: number) => formatValue(value),
    },
    {
      field: "refund",
      headerName: t("reversed"),
      flex: isMobile ? undefined : 1,
      width: isMobile ? 150 : undefined,
      valueFormatter: (value: number) => formatValue(value),
    },
    {
      field: "accept",
      headerName: t("executed"),
      flex: isMobile ? undefined : 1,
      width: isMobile ? 150 : undefined,
      valueFormatter: (value: number) => formatValue(value),
    },
    {
      field: "status",
      headerName: t("status"),
      flex: isMobile ? undefined : 1,
      width: isMobile ? 150 : undefined,
      renderCell: (params) => (
        <Chip
          label={t(translate(params.value))}
          sx={{
            ...labelsColors[params.value],
            fontWeight: 400,
            fontSize: 14,
            my: "auto",
          }}
        />
      ),
    },
    {
      field: "result",
      headerName: t("result"),
      flex: isMobile ? undefined : 1,
      width: isMobile ? 150 : undefined,
      renderCell: (params) => {
        const status = params.row.status?.toLocaleLowerCase();
        const result = params.value;
        const invest = params.row.investment;

        return (
          <Typography
            color="textPrimary"
            variant="subtitle2"
            sx={{
              fontSize: 14,
              color:
                labelsColors[params.row.status?.toLocaleUpperCase()]?.color,
              alignSelf: "center",
            }}
          >
            {status === "win"
              ? `+${numeral(result).format("$0,0.00")}`
              : status === "lose" && result > 0
              ? `-${numeral(result).format("$0,0.00")}`
              : numeral(invest).format("$0,0.00")}
          </Typography>
        );
      },
    },
  ];

  const handlePageModel = (model: GridPaginationModel) => {
    setPageModel(model);
  };

  return (
    <>
      <Helmet>
        <title>Minha conta</title>
      </Helmet>

      <Box>
        {!loading && (
          <Box
            sx={{
              background: "#070f14",
              padding: "1.5rem",
              borderRadius: "8px",
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
              "& .MuiDataGrid-toolbarContainer": {
                justifyContent: isMobile && "space-between",
                columnGap: isMobile ? "0.5rem" : "1rem",
                padding: 0,
                paddingTop: 2,
              },
              "& .MuiDataGrid-toolbarContainer button": {
                width: isMobile ? "48%" : "initial",
                fontSize: "0.875rem",
                background: "#0c151a",
                marginBottom: "1rem",
                padding: isMobile ? "1rem" : "0.5rem 1rem",
                "&:hover": {
                  outline: "2px solid #0ab575",
                },
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
                borderColor: "rgb(34, 34, 34)",
                border: "none",
              },
              "& .MuiDataGrid-cell:focus": {
                outline: " none",
              },
              "& .MuiDataGrid-columnHeaders, & .MuiDataGrid-columnHeader": {
                backgroundColor: "#0f181e",
                border: "none",
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
            }}
          >
            <Box>
              <Typography
                color="textPrimary"
                variant="h5"
                fontSize={24}
                fontWeight={500}
                pt={1.5}
              >
                {t("operations_history")}
              </Typography>
            </Box>
            <Stack
              sx={{ mt: 3, mb: isMobile ? 0 : 2, display: "flex" }}
              direction={isLess1200Width ? "column" : "row"}
              justifyContent="space-between"
              alignItems="center"
              spacing={2}
            >
              <FormControl fullWidth sx={{ minWidth: 120 }}>
                <Select
                  labelId="select-type"
                  id="select-type"
                  name="filterEnvironment"
                  value={activeOperationsFiltersData.filterEnvironment}
                  onChange={changeSelect}
                >
                  {environment.map((item) => (
                    <MenuItem key={item.value} value={item.value}>
                      {t(item.label)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {isMobile ? (
                <Stack direction="row" width="100%" spacing={2}>
                  {renderSimbolsAndTimeFrames()}
                </Stack>
              ) : (
                renderSimbolsAndTimeFrames()
              )}
              <FormControl fullWidth sx={{ minWidth: 120 }}>
                <Select
                  labelId="select-coin"
                  id="select-statuse"
                  name="filterStatuses"
                  value={activeOperationsFiltersData.filterStatuses}
                  onChange={changeSelect}
                >
                  {statuses
                    .filter((item) => item.value !== "CANCELED")
                    .map((status) => (
                      <MenuItem key={status.value} value={status.value}>
                        {t(status.label.toLowerCase())}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
              {renderDatePickers()}
            </Stack>

            <OperationsRevenue
              query={query}
              assertivityOperations={assertivityOperations}
              totalAmountOperations={totalElements}
            />

            <DataGrid
              rows={operations}
              initialState={{
                pagination: {
                  paginationModel: { page, pageSize },
                },
              }}
              columns={desktopGridColumns}
              rowCount={totalElements}
              paginationModel={{ page, pageSize }}
              pageSizeOptions={[5, 10, 25, 50]}
              onPaginationModelChange={handlePageModel}
              paginationMode="server"
              pagination
              resetPageOnSortFilter
              slots={{ toolbar: CustomDataGridToolBar }}
              localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
              onSortModelChange={(model) => {
                setSortModel(model);
              }}
              sortingOrder={["desc", "asc"]}
            />
          </Box>
        )}
      </Box>
    </>
  );
}
