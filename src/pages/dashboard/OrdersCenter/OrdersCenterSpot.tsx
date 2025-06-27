import { Box, Stack, Typography, useTheme } from "@mui/material";
import { useMediaQuery } from "@mui/system";
import {
  DataGrid,
  GridColDef,
  GridPaginationModel,
  GridSortModel,
  GridToolbar,
} from "@mui/x-data-grid";
import { ptBR } from "@mui/x-data-grid/locales";
import { format } from "date-fns";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { BiLogoBitcoin } from "react-icons/bi";
import TitleWithCircleIcon from "src/components/TitleWithCircleIcon";
import useConversionHistory from "src/swr/use-conversion-history";

export function OrdersCenterSpot() {
  const { t } = useTranslation("dashboard");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [{ page, pageSize }, setPageModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [sortModel, setSortModel] = useState<GridSortModel>([
    { field: "createdAt", sort: "desc" },
  ]);

  const {
    data: conversions,
    mutate,
    loading: loadingConversions,
    totalElements,
  } = useConversionHistory({
    page,
    pageSize,
    query: `status=FILLED&sortAttributeName=${
      sortModel[0]?.field
    }&sortMode=${sortModel[0]?.sort.toUpperCase()}&size=${pageSize}`,
  });

  const handlePageModel = (model: GridPaginationModel) => {
    setPageModel(model);
  };

  const desktopGridColumns: GridColDef[] = [
    {
      field: "createdAt",
      headerName: t("conversion_date"),
      flex: isMobile ? undefined : 1,
      width: isMobile ? 150 : undefined,
      renderCell: (params) => {
        if (!params.value) return "";

        const formattedDate = format(new Date(params.value), "dd/MM/yyyy");
        const formattedTime = format(new Date(params.value), "HH:mm:ss");

        return (
          <Stack direction={{ xs: "column", sm: "row" }} gap={1}>
            <span>{formattedDate}</span>
            <span>{formattedTime}</span>
          </Stack>
        );
      },
    },
    {
      field: "amountFrom",
      headerName: t("converted"),
      flex: isMobile ? undefined : 1,
      width: isMobile ? 150 : undefined,
      renderCell: ({ row }) => {
        const isBull = row.direction === "BULL";
        const symbolName = row.symbol.replace("USDT", "");
        const value = row.amountFrom;

        return (
          <Stack direction="row" alignItems="center" gap={1}>
            {isBull ? (
              <img
                src={`https://ebinex-public.s3.sa-east-1.amazonaws.com/USDT.svg`}
                alt=""
                width={28}
                height={28}
              />
            ) : (
              <img
                src={`https://ebinex-public.s3.sa-east-1.amazonaws.com/${symbolName}.svg`}
                alt=""
                width={28}
                height={28}
              />
            )}
            <Typography>{value}</Typography>
          </Stack>
        );
      },
    },
    {
      field: "amountTo",
      headerName: t("received"),
      flex: isMobile ? undefined : 1,
      width: isMobile ? 150 : undefined,
      renderCell: ({ row }) => {
        const isBear = row.direction === "BEAR";
        const symbolName = row.symbol.replace("USDT", "");
        const value = row.amountTo;
        return (
          <Stack direction="row" alignItems="center" gap={1}>
            {isBear ? (
              <img
                src={`https://ebinex-public.s3.sa-east-1.amazonaws.com/USDT.svg`}
                alt=""
                width={28}
                height={28}
              />
            ) : (
              <img
                src={`https://ebinex-public.s3.sa-east-1.amazonaws.com/${symbolName}.svg`}
                alt=""
                width={28}
                height={28}
              />
            )}
            <Typography>{value}</Typography>
          </Stack>
        );
      },
    },
    // {
    //   field: "orderDirection",
    //   headerName: t("fees"),
    //   flex: isMobile ? undefined : 1,
    //   width: isMobile ? 150 : undefined,
    //   renderCell: (params) => (
    //     <Chip
    //       label={"Taxa de corretagem zero"}
    //       sx={{
    //         color: "#00B474",
    //         backgroundColor: "rgba(0, 195, 129, 0.15)",
    //         fontWeight: 400,
    //         fontSize: 14,
    //         my: "auto",
    //       }}
    //     />
    //   ),
    // },
    {
      field: "status",
      headerName: t("status"),
      flex: isMobile ? undefined : 1,
      width: isMobile ? 150 : undefined,
      renderCell: (params) => (
        <Typography
          sx={{
            fontSize: 14,
            color: "#EFEFEF",
            alignSelf: "center",
          }}
        >
          {params.value === "FILLED" ? "Sucesso" : "Pendente"}
        </Typography>
      ),
    },
    {
      field: "absoluteFee",
      headerName: t("conversion_fee"),
      flex: isMobile ? undefined : 1,
      width: isMobile ? 150 : undefined,
      renderCell: (params) => {
        const value = params.value;

        // Verifica se o valor é um número e o formata para evitar notação científica
        const formattedValue =
          typeof value === "number"
            ? value.toFixed(8).replace(/\.?0+$/, "")
            : value;

        return (
          <Typography
            color="textPrimary"
            variant="subtitle2"
            sx={{
              fontSize: 14,
              color: "#EFEFEF",
              alignSelf: "center",
            }}
          >
            {formattedValue}
          </Typography>
        );
      },
    },
  ];

  return (
    <Stack flex={1} direction="column" gap={2.75}>
      <TitleWithCircleIcon
        icon={<BiLogoBitcoin size={24} />}
        circleSize={44}
        label="Ordens Spot"
        fontSize={20}
        fontWeight={500}
      />
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
          "& .MuiDataGrid-columnSeparator": {
            display: "none",
          },
          "& .MuiDataGrid-row": {
            border: "none",
            borderTop: "1px solid",
            borderColor: "rgb(34, 34, 34)",
            padding: "1rem 0",
          },
          "& .MuiDataGrid-cell": {
            color: "#EFEFEF",
            display: "flex",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            border: "none !important",
          },
          "& .MuiDataGrid-cell:focus": {
            outline: " none",
          },
          "& .MuiDataGrid-columnHeaders, & .MuiDataGrid-columnHeader": {
            backgroundColor: "#070f14",
            border: "none !important",
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
        <DataGrid
          rows={conversions}
          columns={desktopGridColumns}
          paginationModel={{ page, pageSize }}
          pageSizeOptions={[5, 10, 25, 50]}
          onPaginationModelChange={handlePageModel}
          paginationMode="server"
          pagination
          localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
          density="compact"
          slots={{ toolbar: TitleWithGridToolbar }}
          getRowHeight={() => "auto"}
          disableDensitySelector
          onSortModelChange={(model) => {
            setSortModel(model);
          }}
          sortingOrder={["desc", "asc"]}
          rowCount={totalElements}
        />
      </Box>
    </Stack>
  );
}

function TitleWithGridToolbar() {
  const { t } = useTranslation("dashboard");
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Typography variant="h6" fontWeight={600} fontSize={16} color="#EFEFEF">
        {t("conversion_history")}
      </Typography>
      <Box sx={{ flexGrow: 1 }} /> <GridToolbar />
    </Box>
  );
}
