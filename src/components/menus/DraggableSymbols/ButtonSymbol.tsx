import { useSortable } from "@dnd-kit/react/sortable";
import { Box, Button, Stack, useMediaQuery, useTheme } from "@mui/material";
import {
  PointerEvent,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from "react";
import { IoMdClose } from "react-icons/io";
import { MdKeyboardArrowDown } from "react-icons/md";

import DefaultCoinChart from "src/components/custom/coins/DefaultCoinChart";
import LayoutContext from "src/contexts/LayoutContext";
import useAvailableSymbols from "src/swr/use-available-symbols";
import { separateSymbolAndMode } from "src/utils/separateSymbolAndMode";

export function ButtonSymbol({
  amountSelectedSymbols,
  activeSymbol,
  handleSwitchSymbol,
  handleClickOpenList,
  handleCloseSymbolTab,
  id,
  index,
  className,
  canvasWidth,
}) {
  const { symbols } = useAvailableSymbols();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isTablet = useMediaQuery(theme.breakpoints.down("lg"));

  const isCurrentSymbol = activeSymbol === id;

  const { layout, handleChartLoadingState, setIsPopUpOpen } =
    useContext(LayoutContext);

  const { ref, isDragging } = useSortable({
    id,
    index,
    transition: {
      duration: 100,
      easing: "cubic-bezier(0.25, 1, 0.5, 1)",
    },
  });

  const currentSymbolInfo = useMemo(() => {
    const { menuOperationMode, menuSymbol } = separateSymbolAndMode(id);

    const foundSymbol = symbols.find((symbol) => symbol.symbol === menuSymbol);

    return {
      ...foundSymbol,
      menuOperationMode,
    };
  }, [id, symbols]);

  const handleCloseClick = (e) => {
    stopPropagationEvent(e);
    handleCloseSymbolTab(e, id);
  };

  const stopPropagationEvent = (e: PointerEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  const handlePointerDown = (e) => {
    if (e.target.closest('[data-close-button="true"]')) {
      return;
    }
  };

  const handlePointerUp = (e) => {
    e.stopPropagation();
    if (e.target.closest('[data-close-button="true"]')) {
      return;
    }

    if (!isDragging) {
      if ((e.target as HTMLElement).closest('[data-close-button="true"]')) {
        return;
      }

      if (!isCurrentSymbol) {
        handleChartLoadingState(true);
        handleSwitchSymbol(id);
      }
    }
  };

  const handleClick = (e) => {
    if (isCurrentSymbol) {
      handleClickOpenList(e);
      return;
    }

    handleSwitchSymbol(id);
    handleChartLoadingState(true);
  };

  const isChartLoading =
    layout.loadingTradingview || layout.chartButtonsDisabled;

  const isMarketOpen = currentSymbolInfo.marketStatus === "OPEN";

  const bgColor = () => {
    if (isCurrentSymbol && !isMarketOpen) return "#190812";

    if (isCurrentSymbol) return "#01160f";

    return "#0B1115";
  };

  const checkForDialog = useCallback(() => {
    let dialogFound = false;

    if (!dialogFound) {
      const iframes = document.querySelectorAll("iframe");
      for (const iframe of iframes) {
        try {
          // Acessar o contentDocument de um iframe pode gerar um erro de
          // segurança (cross-origin) se o iframe for de um domínio diferente.
          // O bloco try/catch lida com isso graciosamente.
          const iframeDoc =
            iframe.contentDocument || iframe.contentWindow?.document;
          if (
            iframeDoc &&
            (iframeDoc.querySelector('div[role="dialog"]') ||
              iframeDoc.querySelector('[data-name="rename-dialog"]'))
          ) {
            dialogFound = true;
            break;
          }
        } catch (error) {
          console.warn(
            "Não foi possível acessar o conteúdo do iframe devido à política de mesma origem (same-origin policy).",
            error
          );
        }
      }
    }

    setIsPopUpOpen(dialogFound ? dialogFound : false);
  }, []);

  useEffect(() => {
    checkForDialog();

    let iframeObservers = null;

    if (layout.chartRef === null || !isCurrentSymbol) {
      return;
    }

    try {
      const iframeDoc =
        layout.chartRef.contentDocument ||
        layout.chartRef.contentWindow?.document;
      if (iframeDoc) {
        const iframeObserver = new MutationObserver(checkForDialog);
        iframeObserver.observe(iframeDoc.body, {
          childList: true,
          subtree: true,
        });
        iframeObservers = iframeObserver;
      }
    } catch (e) {
      // Ignora iframes cross-origin
    }

    return () => {
      console.log("Limpando observers.");

      if (iframeObservers) {
        iframeObservers.disconnect();
      }
    };
  }, [layout.chartRef, isCurrentSymbol]);

  if (layout.isPopUpOpen && isCurrentSymbol) {
    return null;
  }

  return (
    <>
      <Button
        ref={ref}
        variant="contained"
        className={className}
        id="absoluteounao"
        sx={{
          width: isMobile && isCurrentSymbol ? "100%" : "max-content",
          maxWidth: "180px",
          justifyContent: "flex-start",
          position: "relative", // Necessário para posicionar o spinner
          backgroundColor: bgColor(),
          ...(isChartLoading && {
            transition: "all 0.4s",
          }),
          height: isTablet ? "3rem" : "3.2rem",
          borderRadius: "8px",
          padding: isTablet ? "0 0.25rem" : "0 0.5rem",
          ...(isCurrentSymbol && isMarketOpen
            ? {
                border: "1px solid rgb(19 149 108)",
              }
            : {}),
          ...(isCurrentSymbol && isMobile
            ? {
                position: "absolute",
                bottom: "-88px",
                left: `${canvasWidth + 12}px`,
              }
            : {}),
          // transition,
          // transform: CSS.Transform.toString(transform),
          "& .MuiButton-endIcon": {
            marginLeft: 0,
          },
        }}
        onClick={isMobile ? handleClick : undefined}
        onPointerDown={!isMobile ? handlePointerDown : undefined}
        onPointerUp={!isMobile ? handlePointerUp : undefined}
        disabled={isChartLoading}
      >
        <Stack flex={1} direction="row" justifyContent="space-between">
          <Stack
            direction="column"
            justifyContent={
              isTablet && !isCurrentSymbol ? "center" : "flex-start"
            }
            sx={{
              opacity: isChartLoading ? 0.5 : 1,
            }}
          >
            <DefaultCoinChart
              marketStatus={currentSymbolInfo.marketStatus as "OPEN" | "CLOSED"}
              name={currentSymbolInfo.symbol}
              image={currentSymbolInfo.image}
              typeSymbolInfo={
                currentSymbolInfo.symbolType.charAt(0).toUpperCase() +
                currentSymbolInfo.symbolType.slice(1).toLowerCase()
              }
              operationMode={currentSymbolInfo.menuOperationMode}
              center={isTablet && !isCurrentSymbol}
              currentSymbol={isCurrentSymbol}
              ping={isMobile && !isCurrentSymbol ? false : true}
            />
          </Stack>
          {isCurrentSymbol && isMobile && (
            <Box
              sx={{
                padding: "0.25rem 0 0 0",
              }}
            >
              <MdKeyboardArrowDown size={isMobile ? 24 : 16} />
            </Box>
          )}
          {amountSelectedSymbols > 1 &&
            (!isMobile || (isMobile && !isCurrentSymbol)) && (
              <Box
                sx={{
                  color: "#606f79",
                  alignSelf: "flex-start",
                  "&:hover": {
                    color: "#CCC",
                  },
                }}
                data-close-button="true"
                pt="0.5rem"
                pr="0.5rem"
                pl={{ xs: 0, sm: "0.25rem" }}
                onClick={handleCloseClick}
                onPointerDown={stopPropagationEvent}
                onPointerUp={stopPropagationEvent}
                onPointerCancel={stopPropagationEvent}
              >
                <IoMdClose size={14} />
              </Box>
            )}
        </Stack>
      </Button>
    </>
  );
}
