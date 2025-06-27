import {
  Box,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Typography,
} from "@mui/material";
import { MouseEvent } from "react";
import { useTranslation } from "react-i18next";
import { AiOutlineFileSearch } from "react-icons/ai";
import { BiStar } from "react-icons/bi";
import { FaBolt } from "react-icons/fa";
import { IoIosStarOutline, IoMdStar } from "react-icons/io";
import PusingDot from "src/components/custom/lottie/PusingDot";
import TitleWithCircleIcon from "src/components/TitleWithCircleIcon";
import { symbols } from "src/constants";
import { OperationsMode, SymbolSelected } from "src/types/symbol";

interface TableOpenSymbolsProps {
  handleRequestSort: (orderBy: string) => void;
  handleSwitchSymbol: (symbol: string) => void;
  handleFavorite: (symbol: string, favorite: boolean) => void;
  isMobile: boolean;
  showFavorites: boolean;
  openedSymbols: SymbolSelected[];
  operationMode: OperationsMode;
  order: "asc" | "desc";
  orderBy: string;
  availableSymbols: SymbolSelected[];
}

export function TableOpenSymbols({
  handleRequestSort,
  handleSwitchSymbol,
  handleFavorite,
  order,
  orderBy,
  openedSymbols,
  isMobile,
  operationMode,
  showFavorites,
  availableSymbols,
}: TableOpenSymbolsProps) {
  const { t } = useTranslation("dashboard");

  const onChangeSymbolSelected = (symbol: SymbolSelected) => {
    const symbolId = `${symbol.symbol}-${operationMode}`;

    handleSwitchSymbol(symbolId);
  };

  const onChangeFavorite = (
    evt: MouseEvent<HTMLButtonElement>,
    symbolInfo: SymbolSelected
  ) => {
    evt.stopPropagation();
    handleFavorite(symbolInfo.symbol, !symbolInfo.favorite);
  };

  const getPayout = (item) => {
    const optionPayout = item.configModes[operationMode]?.payout || 0;
    return optionPayout;
  };

  const sortedRows = openedSymbols.sort((a, b) => {
    if (orderBy === "profit") {
      const profitA = getPayout(a);
      const profitB = getPayout(b);
      if (order === "asc") {
        return profitA - profitB;
      } else {
        return profitB - profitA;
      }
    } else if (orderBy === "changes") {
      if (order === "asc") {
        return a.hrs24PercentualChange - b.hrs24PercentualChange;
      } else {
        return b.hrs24PercentualChange - a.hrs24PercentualChange;
      }
    } else if (orderBy === "symbol") {
      if (order === "asc") {
        return a.symbol.localeCompare(b.symbol);
      } else {
        return b.symbol.localeCompare(a.symbol);
      }
    }

    const indexA = availableSymbols.findIndex(
      (symbol) => symbol.symbol === a.symbol
    );
    const indexB = availableSymbols.findIndex(
      (symbol) => symbol.symbol === b.symbol
    );
    return indexA - indexB;
  });

  return (
    <TableContainer sx={{ height: "100%" }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <TableSortLabel
                active={orderBy === "symbol"}
                direction={orderBy === "symbol" ? order : "asc"}
                onClick={() => handleRequestSort("symbol")}
              >
                {t("asset")}
              </TableSortLabel>
            </TableCell>

            <TableCell>
              <TableSortLabel
                active={orderBy === "changes"}
                direction={orderBy === "changes" ? order : "asc"}
                onClick={() => handleRequestSort("changes")}
              >
                {t("changes-24h")}
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={orderBy === "profit"}
                direction={orderBy === "profit" ? order : "asc"}
                onClick={() => handleRequestSort("profit")}
              >
                {t("profit")}
              </TableSortLabel>
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {openedSymbols.length > 0 ? (
            openedSymbols.map((item) => (
              <TableRow
                key={item.symbol}
                className="symbols-table-row"
                onClick={() => onChangeSymbolSelected(item)}
              >
                <TableCell>
                  {symbols.find((s) => s.name === item.symbol) && (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "flex-start",
                        flexDirection: "row",
                        justifyContent: isMobile
                          ? "flex-start"
                          : "space-between",
                        alignIitems: "center",
                        position: "relative",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          fontSize: isMobile ? 12 : 14,
                          fontWeight: 700,
                          color: "#EFEFEF",
                        }}
                      >
                        <PusingDot
                          isMarketOpen={item.marketStatus === "OPEN"}
                        />
                        <img
                          src={
                            symbols.find((s) => s.name === item.symbol)?.image
                          }
                          style={{
                            width: 40,
                            height: 40,
                          }}
                          alt={`${new Date().getTime()}-image`}
                        />
                        {item.symbolLabel}
                      </Box>
                    </Box>
                  )}
                </TableCell>

                <TableCell>
                  <Typography
                    fontSize={14}
                    fontWeight={700}
                    color="#00B474"
                    variant="caption"
                    ml={1}
                  >
                    {item.hrs24PercentualChange > 0 && "+"}
                    {item.hrs24PercentualChange}%
                  </Typography>
                </TableCell>
                <TableCell className="lucro-cell">
                  <Typography
                    component="span"
                    sx={{
                      fontSize: 14,
                      fontWeight: 600,
                      ...(getPayout(item) > 92
                        ? {
                            backgroundColor: "#01DB9721",
                            border: "1px solid #154737",
                            color: "#01DB97",
                          }
                        : {
                            ml: 1.1,
                          }),
                    }}
                  >
                    {getPayout(item) > 92 && (
                      <FaBolt
                        size={10}
                        color="#46d3a7"
                        style={{ marginRight: 2 }}
                      />
                    )}
                    {getPayout(item)}%
                  </Typography>
                </TableCell>
                <TableCell>
                  <IconButton
                    onClick={(evt) => onChangeFavorite(evt, item)}
                    sx={{ left: "50%", transform: "translateX(-50%)" }}
                  >
                    {item.favorite ? (
                      <IoMdStar size={24} color="#46d3a7" />
                    ) : (
                      <IoIosStarOutline size={24} color="#414754" />
                    )}
                  </IconButton>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={4}
                align="center"
                height={300}
                sx={{ "& .MuiBox-root": { alignItems: "center" } }}
              >
                <TitleWithCircleIcon
                  label={
                    showFavorites
                      ? t("Nenhum ativo favorito")
                      : t("Nenhum ativo disponível")
                  }
                  description={
                    showFavorites
                      ? "Não há ativos para os filtros selecionados"
                      : "Não há ativos disponíveis no momento."
                  }
                  descriptionColor="#7f8b92"
                  flexDirection="column"
                  fontSize={16}
                  fontWeight="400"
                  icon={
                    showFavorites ? (
                      <BiStar size={40} />
                    ) : (
                      <AiOutlineFileSearch size={40} />
                    )
                  }
                  circleSize={70}
                />
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
