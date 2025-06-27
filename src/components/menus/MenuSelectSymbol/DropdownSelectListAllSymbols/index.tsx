import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  Menu,
  MenuProps,
  Stack,
  styled,
  Tab,
  Tabs,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { useMediaQuery } from "@mui/system";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { isMobile } from "react-device-detect";
import { useTranslation } from "react-i18next";
import { BiSearch } from "react-icons/bi";
import { CgTimelapse } from "react-icons/cg";
import {
  IoIosArrowDown,
  IoIosStarOutline,
  IoMdClose,
  IoMdStar,
} from "react-icons/io";
import { MdCandlestickChart } from "react-icons/md";
import { favoriteSymbol } from "src/lib/api/users";
import useAvailableSymbols from "src/swr/use-available-symbols";
import useFavoritesSymbols from "src/swr/use-favorites-symbols";
import { OperationsMode, SymbolType } from "src/types/symbol";
import { separateSymbolAndMode } from "src/utils/separateSymbolAndMode";
import { notifyError } from "src/utils/toast";
import { TableClosedSymbols } from "../TableCloseSymbols";
import { TableOpenSymbols } from "../TableOpenSymbols";
import { ToggleButtons } from "./ToggleButtons";

const StyledMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    marginThreshold={0}
    {...props}
  />
))(() => ({
  top: isMobile ? "8px" : "24px",
  "& .search-input ": {
    marginBottom: "1rem",

    "& .MuiInputBase-root": {
      height: "42px",
      borderRadius: "8px",
    },

    "& fieldset": {
      border: "none",
    },
  },
  "& .content": {
    display: "flex",
    height: isMobile ? "100vh" : "auto",
    flexDirection: isMobile ? "column" : "row",
  },
  "& .MuiPopover-root": {
    top: "60px !important",
  },
  "& .MuiList-root": {
    padding: 0,
    height: "100%",
    background: "rgb(1 8 13 / 95%)",
  },
  "& .MuiPaper-root": {
    width: "900px",
    position: "absolute",
    borderRadius: "16px",
    border: "2px solid rgb(4, 15, 20)",
    background: "transparent",
    backdropFilter: "blur(10px)",
    top: "60px !important",
    bottom: "auto !important",
    left: "10px !important",
    maxHeight: "100vh !important",

    "@media screen and (max-width: 900px)": {
      width: "100%",
      height: "100%",
      maxWidth: "calc(100% - 8px)",
      left: "4px !important",
      top: "48px !important",
    },
  },

  "& .header_top": {
    cursor: "pointer",
    color: "#26363d",
    zIndex: 20,
    position: "absolute",
    right: "1rem",
    top: "1rem",

    marginBottom: "1.25rem",

    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",

    "@media screen and (max-width: 600px)": {
      right: "1rem",
      left: "1rem",
    },

    "&:hover": {
      fill: "#FFF",
    },
  },

  "& .btn-close": {
    position: "relative",
    right: "auto",
  },
  "& .left-side": {
    padding: isMobile ? "0.5rem" : "1rem",
    backgroundColor: "rgb(4 15 20 / 94%)",
  },
  "& ul.assets-options": {
    listStyle: "none",
    padding: 0,
    display: isMobile ? "flex" : "block",
    alignItems: isMobile ? "center" : null,
    justifyContent: isMobile ? "center" : null,
  },
  "& ul.assets-options .option": {
    padding: isMobile ? "0.5rem" : "1rem 1.5rem",
    display: "flex",
    alignItems: "center",
    gap: isMobile ? "0.5rem" : "1rem",
    fontSize: isMobile ? "0.875rem" : "1rem",
    cursor: "pointer",
    borderRadius: "8px",
    marginBottom: "0.5rem",

    "&:hover, &.active": {
      backgroundColor: "#319676",
    },

    "&:hover svg, &.active svg": {
      fill: "#FFF",
    },
  },
  "& ul.assets-options .option svg": {
    fill: "#fff",
  },
  "& .right-side": {
    width: isMobile ? "100%" : "650px",
    padding: isMobile ? "1rem" : "2rem",
    background: "rgb(1 8 13 / 95%)",
    height: "100%",
  },
  ".top-content": {
    height: "42px",
    marginTop: "3.5rem",
  },
  "& .right-side .top-content": {
    display: "flex",
    flexDirection: "column",
  },
  "& .MuiTextField-root": {
    background: "transparent",
  },
  "& .right-side .body-content": {
    "& th": {
      color: "#808080",
      fontSize: ".75rem",
      fontWeight: "500",
      borderBottom: "none",
      padding: "0.5rem 0",
    },
    "& tr td": {
      marginBottom: "4px",
      borderBottom: "1px solid #0a141a",
      padding: "0.5rem 0",
    },
    "& tr.symbols-table-row:hover": {
      cursor: "pointer",
      color: "#FFF",
      backgroundColor: "#030e12",
    },
    "& tr:last-child td": {
      borderBottom: "none",
    },
    "& td.lucro-cell span": {
      padding: "0.2rem 0.4rem",
      borderRadius: "6px",
      fontWidth: "900",
    },
    "& td.favorite-cell svg": {
      cursor: "pointer",
    },
    "& .close_symbol_tab": {
      cursor: "pointer",
      position: "absolute",
      right: "8px",
    },
  },
}));

const titleTranslate = {
  OPTION: "Novas opções",
  RETRACTION_ENDTIME: "Retração",
  FOREX: "Forex",
  CRYPTO: "Cripto",
};

interface LeftSideMenuType {
  icon: ReactNode;
  title: OperationsMode;
  modes: Array<{ title: "FOREX" | "CRYPTO" }>;
}

const leftSideMenu: Array<LeftSideMenuType> = [
  {
    icon: <MdCandlestickChart color="#01DB97" size={24} />,
    title: "OPTION",
    modes: [
      {
        title: "FOREX",
      },
      {
        title: "CRYPTO",
      },
    ],
  },
  {
    icon: <CgTimelapse color="#01DB97" size={24} />,
    title: "RETRACTION_ENDTIME",
    modes: [
      {
        title: "FOREX",
      },
      {
        title: "CRYPTO",
      },
    ],
  },
];

interface OptionsFilterSymbolsType {
  operationMode: "" | OperationsMode;
  symbolType: "" | SymbolType;
  filterFavorite: "all" | "favorites";
}

interface Props {
  anchorEl: HTMLElement;
  handleClose: () => void;
  activeSymbol: any;
  handleSwitchSymbol: any;
}

export function DropdownSelectListAllSymbols({
  activeSymbol,
  anchorEl,
  handleClose,
  handleSwitchSymbol,
}: Props) {
  const { t } = useTranslation("dashboard");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const { mutate: mutateFavoritesSymbols } = useFavoritesSymbols();

  const { selectedSymbolData, symbols: availableSymbols } =
    useAvailableSymbols();

  const open = Boolean(anchorEl);

  const [{ order, orderBy }, setTableOrdering] = useState<{
    order: "asc" | "desc";
    orderBy: string;
  }>({
    order: "asc",
    orderBy: "default",
  });

  const [searchText, setSearchText] = useState("");

  const [
    { operationMode, symbolType, filterFavorite },
    setOptionsFilterSymbols,
  ] = useState<OptionsFilterSymbolsType>({
    operationMode: "OPTION",
    symbolType: "CRYPTO",
    filterFavorite: "all",
  });

  const handleRequestSort = (property: string) => {
    const isAsc = orderBy === property && order === "asc";
    setTableOrdering({
      order: isAsc ? "desc" : "asc",
      orderBy: property,
    });
  };

  const handleSearch = (event) => {
    setSearchText(event.target.value.toLowerCase());
  };

  const onChangeFiltersSymbols = (
    typeFilters: keyof OptionsFilterSymbolsType,
    newFilter: "all" | "favorites" | OperationsMode | SymbolType
  ) => {
    setOptionsFilterSymbols((prev) => ({
      ...prev,
      [typeFilters]: newFilter,
    }));
  };

  const filteredSymbols = useMemo(() => {
    if (!operationMode || !symbolType) {
      return {
        openedSymbols: [],
        closedSymbols: [],
      };
    }

    const lowerCaseSearchText = searchText.toLowerCase();

    const symbolsActived = availableSymbols.filter((symbol) => {
      const config = symbol.configModes[operationMode];

      return config.status === "ACTIVE";
    });

    const symbols = symbolsActived.filter((symbol) => {
      const symbolBySearch = symbol.symbol
        .toLowerCase()
        .includes(lowerCaseSearchText);

      if (filterFavorite === "favorites") {
        return (
          symbol.symbolType === symbolType && symbol.favorite && symbolBySearch
        );
      }

      return symbol.symbolType === symbolType && symbolBySearch;
    });

    return {
      closedSymbols: symbols.filter(
        (symbol) => symbol.marketStatus === "CLOSED"
      ),
      openedSymbols: symbols.filter((symbol) => symbol.marketStatus === "OPEN"),
      amountSymbols: symbols.length,
    };
  }, [searchText, availableSymbols, operationMode, symbolType, filterFavorite]);

  const onClose = () => {
    setSearchText("");
    handleClose();
  };

  const handleFavorite = async (symbol: string, favorite: boolean) => {
    try {
      await favoriteSymbol(symbol, favorite);
      mutateFavoritesSymbols();
    } catch (error) {
      notifyError("Oops! Não foi possível efetuar a operação.");
    }
  };

  const isFilterFavorite = filterFavorite === "favorites";

  const listItensToggleFavorite = [
    {
      label: "Todos",
      onClick: () => onChangeFiltersSymbols("filterFavorite", "all"),
      isSelected: !isFilterFavorite,
    },
    {
      label: "Favoritos",
      onClick: () => onChangeFiltersSymbols("filterFavorite", "favorites"),
      isSelected: isFilterFavorite,
    },
  ];

  const isOptionOperationMode = operationMode === "OPTION";

  const listItensToggleOperationMode = [
    {
      label: (
        <>
          <MdCandlestickChart
            size={20}
            color={isOptionOperationMode ? "#FFF" : "#00FFA3"}
          />
          <Typography fontSize={14} fontWeight={600}>
            {titleTranslate["OPTION"]}
          </Typography>
        </>
      ),
      onClick: () => onChangeFiltersSymbols("operationMode", "OPTION"),
      isSelected: isOptionOperationMode,
    },
    {
      label: (
        <>
          <CgTimelapse
            size={20}
            color={!isOptionOperationMode ? "#FFF" : "#00FFA3"}
          />
          <Typography fontSize={14} fontWeight={600}>
            {titleTranslate["RETRACTION_ENDTIME"]}
          </Typography>
        </>
      ),
      onClick: () =>
        onChangeFiltersSymbols("operationMode", "RETRACTION_ENDTIME"),
      isSelected: operationMode === "RETRACTION_ENDTIME",
    },
  ];

  useEffect(() => {
    if (activeSymbol) {
      const { menuOperationMode } = separateSymbolAndMode(activeSymbol);
      setOptionsFilterSymbols({
        filterFavorite: "all",
        symbolType: selectedSymbolData.symbolType,
        operationMode: menuOperationMode,
      });
    }
  }, [activeSymbol, selectedSymbolData]);

  return (
    <StyledMenu anchorEl={anchorEl} open={open} onClose={onClose}>
      <Stack direction="row" className="header_top">
        {isMobile && <ToggleButtons listItens={listItensToggleOperationMode} />}
        <IoMdClose className="btn-close" size={24} onClick={onClose} />
      </Stack>
      <Stack direction="row">
        {!isMobile && (
          <Stack id="left_side" direction="column" width={240}>
            <Box px={1.75} py={2}>
              <Typography fontSize={16} fontWeight={600} color="#EFEFEF">
                Mercados
              </Typography>
            </Box>
            <Stack direction="column">
              {leftSideMenu.map((menu) => {
                const isActiveMenu = operationMode === menu.title;

                return (
                  <Stack direction="column" key={menu.title}>
                    <Stack
                      direction="row"
                      alignItems="center"
                      gap={2}
                      pr={2}
                      onClick={() =>
                        onChangeFiltersSymbols("operationMode", menu.title)
                      }
                      sx={{ cursor: "pointer" }}
                    >
                      <Box
                        width={4}
                        height="100%"
                        sx={{
                          background: isActiveMenu ? "#00B474" : "transparent",
                          transition: "all 0.4s",
                        }}
                      />
                      <Stack
                        direction="row"
                        alignItems="center"
                        gap={1}
                        flex={1}
                        py={2}
                      >
                        {menu.icon}
                        <Typography
                          fontSize={13}
                          fontWeight={600}
                          noWrap={true}
                        >
                          {titleTranslate[menu.title]}
                        </Typography>
                      </Stack>
                      <IoIosArrowDown
                        style={{
                          rotate: `${isActiveMenu ? 180 : 0}deg`,
                          transition: "rotate 0.4s",
                        }}
                      />
                    </Stack>
                    {menu.modes.map((mode) => (
                      <Box
                        key={mode.title}
                        px={2.5}
                        py={0.5}
                        sx={{
                          maxHeight: isActiveMenu ? "200px" : 0,
                          overflow: "hidden",
                          transition: "max-height 0.4s",
                        }}
                      >
                        <Typography
                          component={Button}
                          sx={{
                            background: "transparent",
                            color: "#808080",
                            transition: "all 0.4s",
                            "&:not(:disabled):hover": {
                              color: "#FFFFFF",
                            },
                            "&:disabled": {
                              color: "#FFFFFF",
                            },
                          }}
                          fontSize={14}
                          fontWeight={600}
                          textTransform="capitalize"
                          disabled={symbolType === mode.title}
                          onClick={() =>
                            onChangeFiltersSymbols("symbolType", mode.title)
                          }
                        >
                          {titleTranslate[mode.title]}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                );
              })}
            </Stack>
          </Stack>
        )}
        <Stack gap={3} className="right-side">
          <div className="top-content">
            <TextField
              variant="outlined"
              placeholder={t("search-asset")}
              value={searchText}
              onChange={handleSearch}
              className="search-input"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <BiSearch size={16} color="#CCCCCC" />
                    </InputAdornment>
                  ),
                },
              }}
            />
          </div>
          <Stack gap={3} className="body-content">
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              borderBottom={isMobile && "1px solid #15181A"}
            >
              {isMobile && (
                <>
                  <Tabs value={symbolType}>
                    <Tab
                      label="Cripto"
                      value="CRYPTO"
                      onClick={() =>
                        onChangeFiltersSymbols("symbolType", "CRYPTO")
                      }
                    />
                    <Tab
                      label="Forex"
                      value="FOREX"
                      onClick={() =>
                        onChangeFiltersSymbols("symbolType", "FOREX")
                      }
                    />
                    <Tab
                      value=""
                      sx={{ width: 0, minWidth: "unset", padding: 0 }}
                    />
                  </Tabs>

                  <IconButton
                    onClick={() =>
                      onChangeFiltersSymbols(
                        "filterFavorite",
                        isFilterFavorite ? "all" : "favorites"
                      )
                    }
                  >
                    {isFilterFavorite ? (
                      <IoMdStar size={24} color="#46d3a7" />
                    ) : (
                      <IoIosStarOutline size={24} color="#414754" />
                    )}
                  </IconButton>
                </>
              )}
              {!isMobile && (
                <>
                  <ToggleButtons listItens={listItensToggleFavorite} />

                  {filteredSymbols.amountSymbols > 0 && (
                    <Typography fontSize={14} fontWeight={500} color="#686868">
                      {filteredSymbols.amountSymbols} ativos no total
                    </Typography>
                  )}
                </>
              )}
            </Stack>
            <TableOpenSymbols
              availableSymbols={availableSymbols}
              handleRequestSort={handleRequestSort}
              handleSwitchSymbol={handleSwitchSymbol}
              openedSymbols={filteredSymbols.openedSymbols}
              order={order}
              orderBy={orderBy}
              isMobile={isMobile}
              operationMode={operationMode as OperationsMode}
              showFavorites={filterFavorite === "favorites"}
              handleFavorite={handleFavorite}
            />

            <TableClosedSymbols
              closedSymbols={filteredSymbols.closedSymbols}
              isMobile={isMobile}
              handleSwitchSymbol={handleSwitchSymbol}
              handleFavorite={handleFavorite}
              operationMode={operationMode as OperationsMode}
            />
          </Stack>
        </Stack>
      </Stack>
    </StyledMenu>
  );
}
