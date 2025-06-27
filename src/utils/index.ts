import { format, parseISO } from "date-fns";
import { Cookies } from "react-cookie";

export const checkActiveAccountActive = (accounts: any) => {
  const authCookies = new Cookies(null, {
    domain: import.meta.env.VITE_DOMAIN_AUTH,
    path: "/",
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
  });

  const accountsRegular = accounts.filter(
    (item: any) => item.environment !== "GLOBAL"
  );
  const accountId = authCookies.get("ebinex:accountId");
  const firstAccountRegular = accountsRegular[0];

  if (!localStorage.getItem("ebinexFirstLogin")) {
    const accountDemo = accountsRegular.find(
      (c: any) => c.environment === "TEST"
    );
    localStorage.setItem("ebinexFirstLogin", "true");
    localStorage.setItem("environment", `"${accountDemo.environment}"`);

    return {
      accountId: accountDemo.id,
      activeAccount: accountDemo,
    };
  }

  const accountActive = accounts.find((c: any) => c.id === accountId);

  if (!accountActive) {
    localStorage.setItem("environment", `"${firstAccountRegular.environment}"`);

    return {
      accountId: firstAccountRegular.id,
      activeAccount: firstAccountRegular,
    };
  } else {
    localStorage.setItem("environment", `"${accountActive.environment}"`);

    return {
      accountId,
      activeAccount: accountActive,
    };
  }
};

export const dateFormatMonthAndYear = (date: any) => {
  const parsedDate = parseISO(date);
  return format(parsedDate, "MMM, yyyy");
};

export const correctSymbol = (symbol: string): string => {
  if (symbol === "EBX/USDT") {
    return "IDX/USDT";
  }
  if (symbol === "EBXUSDT") {
    return "IDXUSDT";
  }
  return symbol;
};

const updateChartsStateSymbol = (defaultSymbol: string) => {
  const storedChartsState = localStorage.getItem("chartsState");
  const chartsState = storedChartsState ? JSON.parse(storedChartsState) : [];

  const updatedChartsState = chartsState.map((chart) => {
    if (chart.symbol.replace("/", "") !== defaultSymbol) {
      let parsedContent;
      try {
        parsedContent = JSON.parse(chart.content);
      } catch (error) {
        console.error("Failed to parse chart content", error);
        return chart;
      }

      // Update the symbol in the parsed content
      parsedContent.symbol = defaultSymbol;
      if (parsedContent.charts) {
        parsedContent.charts.forEach((chartItem) => {
          if (chartItem.symbol) {
            chartItem.symbol = defaultSymbol;
          }
        });
      }

      return {
        ...chart,
        symbol: defaultSymbol,
        content: JSON.stringify(parsedContent),
      };
    }
    return chart;
  });

  localStorage.setItem("chartsState", JSON.stringify(updatedChartsState));
};

export const updateCurrentChartAnalysis = (defaultSymbol: string) => {
  const storedData = localStorage.getItem("currentChartAnalysis");
  const parsedData = storedData ? JSON.parse(storedData) : {};
  const { symbol } = parsedData;

  if (symbol) {
    const selectedSymbol = symbol.replace("/", "");
    if (defaultSymbol !== selectedSymbol) {
      localStorage.setItem(
        "currentChartAnalysis",
        JSON.stringify({
          ...parsedData,
          symbol: defaultSymbol,
        })
      );
      updateChartsStateSymbol(defaultSymbol);
    }
  } else {
    console.log("No symbol found in currentChartAnalysis");
  }
};

export const normalizeText = (text) =>
  text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[.,!?]/g, "")
    .toLowerCase();
