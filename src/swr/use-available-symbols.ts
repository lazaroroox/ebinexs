import { useContext, useEffect, useMemo, useRef, useState } from "react";
import LayoutContext from "src/contexts/LayoutContext";
import TradingViewContextV2 from "src/contexts/v2/TradingViewContext";
import { apiGet } from "src/services/apiService";
import { SymbolSelected } from "src/types/symbol";
import useSWR from "swr";
import useFavoritesSymbols from "./use-favorites-symbols";

const SYMBOL_IMAGES = {
  BTCUSDT: {
    image:
      "https://ebinex-public.s3.sa-east-1.amazonaws.com/simbols/BTCUSDT.png",
  },
  ETHUSDT: {
    image:
      "https://ebinex-public.s3.sa-east-1.amazonaws.com/simbols/ETHUSDT.png",
  },
  SOLUSDT: {
    image:
      "https://ebinex-public.s3.sa-east-1.amazonaws.com/simbols/SOLUSDT.png",
  },
  XRPUSDT: {
    image:
      "https://ebinex-public.s3.sa-east-1.amazonaws.com/simbols/XRPUSDT.png",
  },
  ADAUSDT: {
    image:
      "https://ebinex-public.s3.sa-east-1.amazonaws.com/simbols/ADAUSDT.png",
  },
  EURUSD: {
    image:
      "https://ebinex-public.s3.sa-east-1.amazonaws.com/simbols/EURUSD.png",
  },
  GBPUSD: {
    image:
      "https://ebinex-public.s3.sa-east-1.amazonaws.com/simbols/GBPUSD.png",
  },
  USDJPY: {
    image:
      "https://ebinex-public.s3.sa-east-1.amazonaws.com/simbols/USDJPY.png",
  },
  USDCHF: {
    image:
      "https://ebinex-public.s3.sa-east-1.amazonaws.com/simbols/USDCHF.png",
  },
  IDXUSDT: {
    image: "https://ebinex-public.s3.sa-east-1.amazonaws.com/simbols/IDX.png",
  },
  MEMXUSDT: {
    image:
      "https://ebinex-public.s3.sa-east-1.amazonaws.com/simbols/MEMXUSDT.png",
  },
  TRUMPUSDT: {
    image:
      "https://ebinex-public.s3.sa-east-1.amazonaws.com/simbols/TRUMPUSDT.png",
  },
};

interface AvailableSymbolsDto {
  symbols: SymbolSelected[];
  selectedSymbolData: SymbolSelected;
  loading: boolean;
  isValidating: boolean;
  mutate: () => Promise<void>;
}

export default function useAvailableSymbols(): AvailableSymbolsDto {
  const { data, isValidating, mutate } = useSWR<any>(
    "/orders/availableSymbols",
    apiGet,
    {
      dedupingInterval: 10000,
    }
  );

  const { favoritesSymbols } = useFavoritesSymbols();

  const { setModalOutsideMarket, layout } = useContext(LayoutContext);
  const { selectedSymbol } = useContext(TradingViewContextV2);

  const [localStorageChecked, setLocalStorageChecked] = useState(false);

  const [triedToOpenModal, setTriedToOpenModal] = useState(false);

  const previousSelectedSymbol = useRef(selectedSymbol);

  const symbols: SymbolSelected[] = useMemo(() => {
    if (Array.isArray(data)) {
      return data.map((item) => ({
        ...item,
        favorite:
          Array.isArray(favoritesSymbols) &&
          favoritesSymbols.some(
            (fav) => fav.symbol === item.symbol && fav.favorite
          ),
        image: SYMBOL_IMAGES[item.symbol]?.image || "",
      }));
    }
    return [];
  }, [data, favoritesSymbols]);

  const selectedSymbolData: SymbolSelected = useMemo(() => {
    return (
      symbols.find((item) => selectedSymbol.includes(item.symbol)) || {
        symbol: "BTCUSDT",
        symbolType: "CRYPTO",
        symbolLabel: "BTC/USDT",
        marketStatus: "OPEN",
        openMarketTime: null,
        closeMarketTime: null,
        favorite: false,
        configModes: {
          OPTION: { orderType: "OPTION", payout: 90, status: "ACTIVE" },
          RETRACTION_ENDTIME: {
            orderType: "OPTION",
            payout: 90,
            status: "ACTIVE",
          },
        },
        payout: 90.0,
        hrs24PercentualChange: 0,
        image: SYMBOL_IMAGES["BTCUSDT"].image,
      }
    );
  }, [symbols, selectedSymbol]);

  useEffect(() => {
    if (
      previousSelectedSymbol.current !== selectedSymbol &&
      selectedSymbolData &&
      selectedSymbolData.marketStatus !== "OPEN" &&
      !layout.modalOutsideMarket
    ) {
      setTriedToOpenModal(true);

      setTimeout(() => {
        setModalOutsideMarket(
          true,
          `O gráfico do índice ${selectedSymbolData.symbol} está fechado no momento.`
        );
      }, 0);
    } else if (
      layout.modalOutsideMarket &&
      selectedSymbolData.marketStatus === "OPEN"
    ) {
      setModalOutsideMarket(false, "");
    }

    return () => {
      previousSelectedSymbol.current = selectedSymbol;
    };
  }, [symbols, selectedSymbol, selectedSymbolData.marketStatus]);

  const updateLocalStorageSymbols = (validSymbols) => {
    localStorage.setItem("selectedMenuSymbols", JSON.stringify(validSymbols));
    if (validSymbols.length > 0) {
      const defaultSymbol = validSymbols.find((s) => s.symbol === "IDXUSDT")
        ? "IDXUSDT"
        : "BTCUSDT";
      localStorage.setItem("defaultSymbol", defaultSymbol);
    }
  };

  useEffect(() => {
    const storedSymbols = localStorage.getItem("selectedMenuSymbols");
    const defaultSymbol = localStorage
      .getItem("defaultSymbol")
      ?.replaceAll('"', "");
    if (storedSymbols && symbols.length > 0) {
      const parsedSymbols = JSON.parse(storedSymbols);
      const validSymbols = parsedSymbols.filter((item) =>
        symbols.some((symbol) => symbol.symbol === item.symbol)
      );

      if (
        validSymbols.length > 0 &&
        validSymbols.length !== parsedSymbols.length
      ) {
        updateLocalStorageSymbols(validSymbols);
      } else if (
        validSymbols.length > 0 &&
        !validSymbols.some((s) => s.symbol === defaultSymbol)
      ) {
        const newDefaultSymbol = validSymbols.find(
          (s) => s.symbol === "IDXUSDT"
        )
          ? "IDXUSDT"
          : "BTCUSDT";
        localStorage.setItem("defaultSymbol", JSON.stringify(newDefaultSymbol));
      }
    }
    setLocalStorageChecked(true);
  }, [symbols]);

  return {
    symbols,
    selectedSymbolData,
    loading: !data || !localStorageChecked,
    isValidating,
    mutate,
  };
}
