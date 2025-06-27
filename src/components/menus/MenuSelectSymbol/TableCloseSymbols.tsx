import {
  Box,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { MouseEvent } from "react";
import { IoIosStarOutline, IoMdStar } from "react-icons/io";
import PusingDot from "src/components/custom/lottie/PusingDot";
import { OperationsMode, SymbolSelected } from "src/types/symbol";

interface TableClosedSymbolsProps {
  closedSymbols: SymbolSelected[];
  handleSwitchSymbol: (symbol: string) => void;
  handleFavorite: (symbol: string, favorite: boolean) => void;
  isMobile: boolean;
  operationMode: OperationsMode;
}

export function TableClosedSymbols({
  closedSymbols,
  isMobile,
  handleSwitchSymbol,
  handleFavorite,
  operationMode,
}: TableClosedSymbolsProps) {
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

  if (!closedSymbols.length) return null;

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <Typography
                sx={{
                  color: "#808080",
                  fontSize: ".75rem",
                  fontWeight: "500",
                  borderBottom: "none",
                  padding: "0.5rem 0",
                }}
              >
                Fechado
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow></TableRow>
        </TableHead>
        <TableBody>
          {closedSymbols.map((item) => (
            <TableRow
              key={item.symbol}
              className="symbols-table-row"
              onClick={() => onChangeSymbolSelected(item)}
            >
              <TableCell>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    flexDirection: "row",
                    gap: isMobile ? "2rem" : null,
                    justifyContent: isMobile ? "flex-start" : "space-between",
                    alignIitems: "center",
                    position: "relative",
                    opacity: 0.7,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      fontSize: 14,
                      fontWeight: 700,
                      color: "#EFEFEF",
                    }}
                  >
                    <PusingDot isMarketOpen={item.marketStatus === "OPEN"} />
                    <img
                      src={item.image}
                      style={{
                        width: 40,
                        height: 40,
                        marginRight: 5,
                      }}
                      alt={`${new Date().getTime()}-image`}
                    />
                    {item.symbolLabel}
                  </Box>

                  <IconButton
                    sx={{
                      position: "absolute",
                      right: "0.875rem",
                    }}
                    onClick={(e) => onChangeFavorite(e, item)}
                  >
                    {item.favorite ? (
                      <IoMdStar size={24} color="#46d3a7" />
                    ) : (
                      <IoIosStarOutline size={24} color="#414754" />
                    )}
                  </IconButton>
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
