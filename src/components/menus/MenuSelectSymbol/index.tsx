import { useMediaQuery } from "@mui/material";
import Button from "@mui/material/Button";
import { useTheme } from "@mui/material/styles";
import { useContext, useEffect, useRef, useState } from "react";
import { DraggableSymbols } from "src/components/menus/DraggableSymbols";
import { DropdownSelectListAllSymbols } from "src/components/menus/MenuSelectSymbol/DropdownSelectListAllSymbols";
import LayoutContext from "src/contexts/LayoutContext";
import { useSymbolMenu } from "src/contexts/SymbolMenuContext";
import TradingViewContextV2 from "src/contexts/v2/TradingViewContext";
import useApiData from "src/hooks/useApiData";
import Plus from "src/icons/Plus";
import useAvailableSymbols from "src/swr/use-available-symbols";
import { OperationsMode } from "src/types/symbol";
import { updateCurrentChartAnalysis } from "src/utils";
import { separateSymbolAndMode } from "src/utils/separateSymbolAndMode";
import { notifyError } from "src/utils/toast";

export default function MenuSelectSymbol() {
  const theme = useTheme();
  const isScreen380 = useMediaQuery("(max-width:380px)");
  const isScreen500 = useMediaQuery("(max-width:500px)");
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const ignoreCloseRef = useRef(false);

  const { symbols } = useAvailableSymbols();

  const { handleChartLoadingState } = useContext(LayoutContext);
  const {
    selectedSymbol,
    updateSymbol,
    removeOrdersBySymbol,
    updateHeaderMenuSymbols,
    headerMenuSymbols,
    isOpenToolbar,
  } = useContext(TradingViewContextV2);
  const { updateUserLiveOperations, operationMode, updateOperationMode } =
    useApiData();

  const { anchorEl, handleOpen, handleClose } = useSymbolMenu();

  const [activeSymbol, setActiveSymbol] = useState<string>();

  useEffect(() => {
    const symbolActiveMenuHeader = `${selectedSymbol}-${operationMode}`;
    if (
      !headerMenuSymbols.some(
        (menuSymbol) => menuSymbol === symbolActiveMenuHeader
      )
    ) {
      updateHeaderMenuSymbols([...headerMenuSymbols, symbolActiveMenuHeader]);
    }
    setActiveSymbol(symbolActiveMenuHeader);
  }, [selectedSymbol]);

  const handleSwitchSymbol = (symbolMenuHeader: string) => {
    try {
      handleChartLoadingState(true);

      const { menuOperationMode, menuSymbol } =
        separateSymbolAndMode(symbolMenuHeader);

      const symbolExists = headerMenuSymbols.some(
        (symbol) => symbol === symbolMenuHeader
      );

      if (!symbolExists) {
        const updatedSymbols = updateSelectedSymbols(symbolMenuHeader);

        updateHeaderMenuSymbols(updatedSymbols);
      }

      if (symbolExists && symbolMenuHeader === activeSymbol) {
        return;
      }

      const updatedHeaderSymbols = updateSelectedSymbols(symbolMenuHeader);

      console.log(symbolMenuHeader, headerMenuSymbols);

      updateHeaderMenuSymbols(updatedHeaderSymbols);
      removeOrdersBySymbol(menuSymbol);

      if (
        symbols.some(
          (s) =>
            s.symbol === menuSymbol &&
            s.configModes[menuOperationMode].status !== "ACTIVE"
        )
      ) {
        return;
      }

      updateUserLiveOperations([]);

      updateCurrentChartAnalysis(menuSymbol);
      updateSymbol(menuSymbol);
      setActiveSymbol(symbolMenuHeader);

      updateOperationMode(menuOperationMode as OperationsMode);

      handleClose();
    } catch (error) {
      console.error("Failed to switch symbol", error);
      notifyError("Oops! Não foi possível efetuar a operação.");
      handleChartLoadingState(false);
    }
  };

  const updateSelectedSymbols = (symbolMenuHeader: string) => {
    const symbolExists = headerMenuSymbols.some(
      (symbol) => symbol === symbolMenuHeader
    );

    let maxLengthSelectedSymbols = 5;
    let updatedSymbols;

    if (isScreen380) {
      maxLengthSelectedSymbols = 2;
    } else if (isScreen500) {
      maxLengthSelectedSymbols = 3;
    } else if (isMobile) {
      maxLengthSelectedSymbols = 4;
    }

    if (
      symbolExists &&
      isMobile &&
      headerMenuSymbols.length > maxLengthSelectedSymbols
    ) {
      const headerMenuWithoutCurrentSymbol = headerMenuSymbols.filter(
        (symbol) => symbol !== symbolMenuHeader
      );

      if (headerMenuSymbols.length > headerMenuWithoutCurrentSymbol.length) {
        maxLengthSelectedSymbols = maxLengthSelectedSymbols - 1;
      }

      updatedSymbols = headerMenuWithoutCurrentSymbol.slice(
        0,
        maxLengthSelectedSymbols
      );

      updatedSymbols.push(symbolMenuHeader);
      return updatedSymbols;
    }

    if (symbolExists) {
      const { menuSymbol, menuOperationMode } =
        separateSymbolAndMode(symbolMenuHeader);
      const headerSymbolsActives = headerMenuSymbols.filter((symbol) => {
        if (symbolMenuHeader === symbol) {
          return symbols.some(
            (s) =>
              s.symbol === menuSymbol &&
              s.configModes[menuOperationMode].status === "ACTIVE"
          );
        }

        return true;
      });

      return headerSymbolsActives;
    }

    const activeIndex = headerMenuSymbols.findIndex(
      (symbolId) => symbolId === activeSymbol
    );

    if (activeIndex !== -1) {
      updatedSymbols = [
        ...headerMenuSymbols.slice(0, activeIndex + 1),
        symbolMenuHeader,
        ...headerMenuSymbols.slice(activeIndex + 1),
      ];
    } else {
      updatedSymbols = [...headerMenuSymbols, symbolMenuHeader];
    }

    if (updatedSymbols.length >= maxLengthSelectedSymbols) {
      const amountRemoveSymbols =
        updatedSymbols.length - maxLengthSelectedSymbols;
      updatedSymbols = updatedSymbols.slice(
        amountRemoveSymbols,
        updatedSymbols.length
      );
    }

    return updatedSymbols;
  };

  useEffect(() => {
    if (isMobile) {
      const updatedSymbols = updateSelectedSymbols(
        `${selectedSymbol}-${operationMode}`
      );
      updateHeaderMenuSymbols(updatedSymbols);
    }
  }, [isMobile]);

  const handleCloseSymbolTab = (e, removeMenuHeader: string) => {
    e.stopPropagation();

    const updatedSymbols = headerMenuSymbols.filter(
      (existMenuHeader) => existMenuHeader !== removeMenuHeader
    );

    if (removeMenuHeader === activeSymbol && updatedSymbols.length > 0) {
      updateUserLiveOperations([]);
      handleChartLoadingState(true);
      const nextActiveSymbol = getNextActiveSymbol(
        removeMenuHeader,
        updatedSymbols
      );

      updateCurrentChartAnalysis(nextActiveSymbol.menuSymbol);
      updateSymbol(nextActiveSymbol.menuSymbol);
      setActiveSymbol(
        `${nextActiveSymbol.menuSymbol}-${nextActiveSymbol.menuOperationMode}`
      );
      updateOperationMode(nextActiveSymbol.menuOperationMode);
      removeOrdersBySymbol(nextActiveSymbol.menuSymbol);
    }

    updateHeaderMenuSymbols(updatedSymbols);
  };

  const getNextActiveSymbol = (
    removedSymbolId: string,
    updatedSymbols: string[]
  ) => {
    const removedIndex = headerMenuSymbols.findIndex(
      (item) => item === removedSymbolId
    );

    const nextIndex =
      removedIndex < updatedSymbols.length ? removedIndex : removedIndex - 1;

    return separateSymbolAndMode(updatedSymbols[nextIndex]);
  };

  return (
    <>
      {headerMenuSymbols.length > 0 && (
        <DraggableSymbols
          activeSymbol={activeSymbol}
          selectedSymbols={headerMenuSymbols}
          handleSwitchSymbol={handleSwitchSymbol}
          handleCloseSymbolTab={handleCloseSymbolTab}
          handleCloseDropdown={handleClose}
          handleClickOpenList={handleOpen}
          isOpenTvToolbar={isOpenToolbar}
        />
      )}

      {!isMobile && (
        <Button
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "transparent",
            border: "1px solid #202020",
            borderRadius: "8px",
            width: "40px",
            height: "40px",
            minWidth: "0",
            ".MuiButton-root": {
              minWidth: "0",
            },
          }}
          style={{
            minWidth: "0",
          }}
          onClick={handleOpen}
        >
          <Plus />
        </Button>
      )}

      <DropdownSelectListAllSymbols
        anchorEl={anchorEl}
        handleClose={handleClose}
        activeSymbol={activeSymbol}
        handleSwitchSymbol={handleSwitchSymbol}
      />
    </>
  );
}
