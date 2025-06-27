import "animate.css/animate.min.css";
import "nprogress/nprogress.css";
import "react-perfect-scrollbar/dist/css/styles.css";
import "react-quill/dist/quill.snow.css";
import "react-toastify/dist/ReactToastify.css";
import "./assets/css/index.css";
// import './__mocks__';
import { StyledEngineProvider } from "@mui/material/styles";
import { StrictMode } from "react";
import { CookiesProvider } from "react-cookie";
import ReactDOM from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./contexts/JWTContext";
import { LayoutProvider } from "./contexts/LayoutContext";
import { SettingsProvider } from "./contexts/SettingsContext";
import reportWebVitals from "./reportWebVitals";
import * as serviceWorker from "./serviceWorker";
import "./style/global.css";

import * as Sentry from "@sentry/react";
import Bluebird from "bluebird";
import { SymbolMenuProvider } from "./contexts/SymbolMenuContext";
import { TestModeProvider } from "./contexts/TestModeContext";

Bluebird.config({
  warnings: {
    wForgottenReturn: false,
  },
  longStackTraces: true,
  cancellation: true,
  monitoring: true,
});

Bluebird.onPossiblyUnhandledRejection((error) => {
  console.error("Unhandled Rejection Detected:", error);
  captureErrorWithContext(error);
});

// Substitui a implementação padrão de Promises pelo Bluebird
window.Promise = Bluebird as any;

const getLocalStorageContext = () => {
  try {
    const context = {};

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        try {
          const value = localStorage.getItem(key);
          if (value) {
            try {
              context[key] = JSON.parse(value);
            } catch {
              context[key] = value;
            }
          }
        } catch (e) {
          console.warn(`Erro ao acessar localStorage para a chave ${key}:`, e);
          context[key] = "[Error: Não foi possível acessar este item]";
        }
      }
    }

    return context;
  } catch (e) {
    console.warn("Erro ao acessar localStorage:", e);
    return { error: "Não foi possível acessar o localStorage" };
  }
};

const captureErrorWithContext = (error) => {
  const localStorageContext = getLocalStorageContext();

  Sentry.withScope((scope) => {
    scope.setContext("localStorage", localStorageContext);
    scope.setContext("browser", {
      userAgent: navigator.userAgent,
      language: navigator.language,
      screenSize: `${window.screen.width}x${window.screen.height}`,
      viewportSize: `${window.innerWidth}x${window.innerHeight}`,
      timestamp: new Date().toISOString(),
    });
    Sentry.captureException(error);
  });
};

const originalOnError = window.onerror;
window.onerror = function (message, source, lineno, colno, error) {
  captureErrorWithContext(error || message);

  if (typeof originalOnError === "function") {
    return originalOnError.apply(this, arguments);
  }

  return false;
};

const originalOnUnhandledRejection = window.onunhandledrejection;
window.onunhandledrejection = function (event) {
  captureErrorWithContext(event.reason);

  if (typeof originalOnUnhandledRejection === "function") {
    return originalOnUnhandledRejection.apply(this, arguments);
  }
};

Sentry.init({
  dsn: "https://c9187922aa919a4b5259c0ab9c628b5b@o4507940454596608.ingest.us.sentry.io/4509271381508096",
  integrations: [
    Sentry.browserTracingIntegration(),
    // Desativando a integração de browser profiling
    // Sentry.browserProfilingIntegration(),
    Sentry.replayIntegration(),
  ],
  // Adiciona o contexto do localStorage diretamente no initialScope
  initialScope: (scope) => {
    scope.setContext("localStorage", getLocalStorageContext());
    scope.setContext("browser", {
      userAgent: navigator.userAgent,
      language: navigator.language,
      screenSize: `${window.screen.width}x${window.screen.height}`,
      viewportSize: `${window.innerWidth}x${window.innerHeight}`,
      timestamp: new Date().toISOString(),
    });

    return scope;
  },
  // Tracing
  tracesSampleRate: 1.0, //  Capture 100% of the transactions
  // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
  tracePropagationTargets: [
    "localhost",
    /^https:\/\/api\.ebinex\.com/,
    /^https:\/\/api-testnet\.ebinex\.com/,
  ],
  // Set profilesSampleRate to 1.0 to profile every transaction.
  // Since profilesSampleRate is relative to tracesSampleRate,
  // the final profiling rate can be computed as tracesSampleRate * profilesSampleRate
  // For example, a tracesSampleRate of 0.5 and profilesSampleRate of 0.5 would
  // results in 25% of transactions being profiled (0.5*0.5=0.25)
  profilesSampleRate: 1.0,
  // Session Replay
  replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
});

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <StrictMode>
    <HelmetProvider>
      <CookiesProvider>
        <TestModeProvider>
          <StyledEngineProvider injectFirst>
            <SettingsProvider>
              <LayoutProvider>
                <BrowserRouter>
                  <AuthProvider>
                    <SymbolMenuProvider>
                      <App />
                    </SymbolMenuProvider>
                  </AuthProvider>
                </BrowserRouter>
              </LayoutProvider>
            </SettingsProvider>
          </StyledEngineProvider>
        </TestModeProvider>
      </CookiesProvider>
    </HelmetProvider>
  </StrictMode>
);

// If you want to enable client cache, register instead.
serviceWorker.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
