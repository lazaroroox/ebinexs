import { ThemeProvider } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { GoogleOAuthProvider } from "@react-oauth/google";
import en from "date-fns/locale/en-US";
import es from "date-fns/locale/es";
import pt from "date-fns/locale/pt-BR";
import { orderBy } from "lodash";
import type { FC } from "react";
import { useContext, useEffect } from "react";
import ReactGA from "react-ga4";
import { useIdleTimer } from "react-idle-timer";
import { useLocation, useRoutes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import { resetLastBarsCache } from "src/components/TVChartContainerV2/datafeed";
import { resetCacheBarsCallback } from "src/components/TVChartContainerV2/streaming";
import LayoutContext from "src/contexts/LayoutContext";
import TradingViewContextV2, {
  TradingViewProviderV2,
} from "src/contexts/v2/TradingViewContext";
import useApiData from "src/hooks/useApiData";
import { apiGet } from "src/services/apiService";
import useParameters from "src/swr/use-parameters";
import { Order } from "src/types/order";
import GlobalStyles from "./components/GlobalStyles";
import RTL from "./components/RTL";
import CookiesWarning from "./components/shared/CookiesWarning";
import SplashScreen from "./components/SplashScreen";
import useAuth from "./hooks/useAuth";
import useScrollReset from "./hooks/useScrollReset";
import useSettings from "./hooks/useSettings";
import "./i18n";
import routes from "./routes";
import { createTheme } from "./theme";
import { clearAllDataSaved } from "./utils/clearAllDataSaved";
import { clearDepositIntervalId } from "./utils/interval";

const locationDate = {
  br: pt,
  en: en,
  es: es,
};

ReactGA.initialize("G-P0EWS7HFEW");

const saveStorages = ["chartsState"];

const App: FC = () => {
  const content = useRoutes(routes);
  const location = useLocation();
  const { settings } = useSettings();
  const auth = useAuth();
  const { parameters } = useParameters();
  const { updateUserLiveOperations } = useApiData();
  const { selectedSymbol, checkTvWidgetChartIsActive } =
    useContext(TradingViewContextV2);
  const { handleChartLoadingState } = useContext(LayoutContext);

  useScrollReset();

  useEffect(() => {
    const defaultSymbol = localStorage.getItem("defaultSymbol");
    clearAllDataSaved(saveStorages);

    if (!defaultSymbol || defaultSymbol === "undefined") {
      localStorage.setItem("defaultSymbol", "IDXUSDT");
      window.location.reload();
    }
  }, []);

  useEffect(() => {
    clearDepositIntervalId();
  }, [location]);

  const theme = createTheme({
    direction: settings.direction,
    responsiveFontSizes: settings.responsiveFontSizes,
    roundedCorners: settings.roundedCorners,
    theme: settings.theme,
  });

  const fetchOrders = async () => {
    if (!parameters) {
      return;
    }
    try {
      const candleTimeFrames = JSON.parse(parameters.CANDLE_TIME_FRAMES.value);
      const timeFrames = candleTimeFrames.map(({ value }) => value).join(",");

      const response = await apiGet<Order[]>(
        `/orders?candleTimeFrames=${timeFrames}&symbols=${selectedSymbol}&statuses=PENDING,OPEN&page=0&size=10`
      );

      const ordersOrdered = orderBy(
        response,
        [(item) => new Date(item.createdAt)],
        ["asc"]
      );

      await updateUserLiveOperations(ordersOrdered, true);
    } catch (err) {
      console.error(err);
    }
  };

  const handleVisibilityChange = async () => {
    // await fetchOrders();

    const widgetActiveChart = await checkTvWidgetChartIsActive();

    if (
      !!widgetActiveChart &&
      typeof widgetActiveChart.setSymbol === "function"
    ) {
      resetCacheBarsCallback();
      resetLastBarsCache();

      try {
        widgetActiveChart.resetData();

        const currentSymbol = widgetActiveChart.symbol();

        widgetActiveChart.setSymbol(currentSymbol);
      } catch (error) {
        console.log("Error updating chart", error);
      } finally {
        handleChartLoadingState(false);
      }
    }
  };

  const handleRefresh = () => {
    handleChartLoadingState(true);

    handleVisibilityChange();
  };

  useIdleTimer({
    timeout: 4000 * 60,
    onIdle: () => {
      const dataLastActive = localStorage.getItem("lastActive");
      const diff = new Date().getTime() - new Date(dataLastActive).getTime();
      if (window.location.pathname === "/traderoom" && diff > 7500 * 60) {
        handleRefresh();
      }
    },
    debounce: 500,
    crossTab: true,
    syncTimers: 5000,
    onAction: (event) => {
      localStorage.setItem("lastActive", new Date().toISOString());
    },
  });

  return (
    <GoogleOAuthProvider clientId="471453746925-limqt481jpj7qnuk4j02c5bmoh6ui9ma.apps.googleusercontent.com">
      <TradingViewProviderV2>
        <LocalizationProvider
          dateAdapter={AdapterDateFns}
          adapterLocale={locationDate[settings.language]}
        >
          <ThemeProvider theme={theme}>
            <RTL direction={settings.direction}>
              <ToastContainer limit={3} />
              <CookiesWarning />
              <GlobalStyles />
              {auth.isInitialized ? content : <SplashScreen />}
              {/* <IdleModal
                openModal={openIdleModal}
                onClose={() => setOpenIdleModal(false)}
              /> */}
            </RTL>
          </ThemeProvider>
        </LocalizationProvider>
      </TradingViewProviderV2>
    </GoogleOAuthProvider>
  );
};

export default App;
