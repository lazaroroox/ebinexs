import { Box } from "@mui/material";
import { Suspense, lazy } from "react";
import { Cookies } from "react-cookie";
import { Outlet, type RouteObject } from "react-router";
import { StompSessionProvider } from "react-stomp-hooks";
import DashboardLayoutTraderoom from "src/components/dashboard/DashboardLayoutTraderoom";
import DepositScreenWrapper from "src/components/dashboard/deposit/DepositScreenWrapper";
import SecurityWrapper from "src/components/dashboard/profile/SecurityWrapper";
import WithdrawScreenWrapper from "src/components/dashboard/withdraw/WithdrawScreenWrapper";
import SupportPage from "src/components/home/SupportPage";
import { CountdownProvider } from "src/contexts/v2/CountdownContext";
import { OrdersCenterSpot } from "src/pages/dashboard/OrdersCenter/OrdersCenterSpot";
import { OrdersCenterTrade } from "src/pages/dashboard/OrdersCenter/OrdersCenterTrade";
import { ProfilePage } from "src/pages/dashboard/Profile/page";
import { ResolutionString } from "./charting_library/charting_library";
import AuthGuard from "./components/AuthGuard";
import CountdownGuard from "./components/CountdownGuard";
import GuestGuard from "./components/GuestGuard";
import LoadingScreen from "./components/LoadingScreen";
import DashboardLayout from "./components/dashboard/DashboardLayout";
import Community from "./components/home/Footer/Community";
import CriptoMarket from "./components/home/Footer/CriptoMarket";
import OptionsMarket from "./components/home/Footer/OptionsMarket";
import WhoWeAre from "./components/home/Footer/WhoWeAre";
import WhyChoooseUs from "./components/home/Footer/WhyChoooseUs";
import Layout from "./components/shared/Layout";
import OperationsTab from "./components/trade/OperationsTab";
import TradeOrder from "./components/trade/TradeOrder";
import { OrderBookProvider } from "./contexts/OrderBookContext";
import DepositPayment from "./pages/dashboard/DepositPayment";

const Loadable = (Component) => (props) =>
  (
    <Suspense fallback={<LoadingScreen />}>
      <Component {...props} />
    </Suspense>
  );

// Browse pages

// Authentication pages

const Login = Loadable(lazy(() => import("./pages/authentication/Login")));
const PasswordRecovery = Loadable(
  lazy(() => import("./pages/authentication/PasswordRecovery"))
);
const PasswordReset = Loadable(
  lazy(() => import("./pages/authentication/PasswordReset"))
);
const Register = Loadable(
  lazy(() => import("./pages/authentication/Register"))
);
const VerifyCode = Loadable(
  lazy(() => import("./pages/authentication/VerifyCode"))
);

const WaitingList = Loadable(
  lazy(() => import("./pages/authentication/WaitingList"))
);

// Dashboard pages
const Profile = Loadable(lazy(() => import("./pages/dashboard/Profile")));
const Deposit = Loadable(lazy(() => import("./pages/dashboard/Deposit")));
const OverviewV2 = Loadable(
  lazy(() => import("./pages/dashboard/v2/Overview"))
);
const BalanceHistory = Loadable(
  lazy(() => import("./pages/dashboard/BalanceHistory"))
);
const OperationsHistory = Loadable(
  lazy(() => import("./pages/dashboard/OperationsHistory"))
);

// Error pages
const AuthorizationRequired = Loadable(
  lazy(() => import("./pages/AuthorizationRequired"))
);
const NotFound = Loadable(lazy(() => import("./pages/NotFound")));
const ServerError = Loadable(lazy(() => import("./pages/ServerError")));

// Other pages
const Home = Loadable(lazy(() => import("./pages/Home")));

const TraderoomProviders = Loadable(lazy(() => import("./components/TraderoomProviders")))


const routes: RouteObject[] = [
  {
    path: "authentication",
    children: [
      {
        path: "login",
        element: (
          <GuestGuard>
            <Login />
          </GuestGuard>
        ),
      },
      // {
      //   path: "login-unguarded",
      //   element: <Login />,
      // },
      {
        path: "password-recovery",
        element: <PasswordRecovery />,
      },
      {
        path: "password-reset",
        element: <PasswordReset />,
      },
      {
        path: "register",
        element: (
          <GuestGuard>
            <Register />
          </GuestGuard>
        ),
      },
      {
        path: "register-unguarded",
        element: <Register />,
      },
      {
        path: "verify-code",
        element: <VerifyCode />,
      },
      {
        path: "waiting_list",
        element: <WaitingList />,
      },
    ],
  },
  {
    path: "traderoom",
    element: <TraderoomProviders />,
    children: [
      {
        path: "",
        element: (
          <OrderBookProvider>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                flex: 1,
              }}
            >
              <OverviewV2 />
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                maxWidth: "320px",
                height: "100%",
                // maxHeight: "calc(100vh - 80px)",
                overflow: "scroll",
                gap: 1.5,
                px: 2,
                pb: 2.5,
                pt: 1,
                flex: 1,
                "@media (max-width: 1200px)": {
                  overflow: "initial",
                  flexDirection: "column",
                  maxWidth: "initial",
                  padding: "0 1rem",
                },
              }}
            >
              <CountdownProvider>
                <TradeOrder />
                <OperationsTab />
              </CountdownProvider>
            </Box>
          </OrderBookProvider>
        ),
      },
    ],
  },
  {
    path: "dashboard",
    element: (
      <CountdownGuard>
        <AuthGuard>
          <DashboardLayout />
        </AuthGuard>
      </CountdownGuard>
    ),
    children: [
      {
        path: "",
        element: <NotFound />,
      },
      {
        path: "profile",
        element: <Profile />,
        children: [
          {
            path: "",
            element: <ProfilePage />,
          },
          {
            path: "to_withdraw",
            element: <WithdrawScreenWrapper />,
          },
          {
            path: "deposit",
            element: <DepositScreenWrapper />,
          },
          {
            path: "security",
            element: <SecurityWrapper />,
          },
          { path: "support", element: <SupportPage /> },
          { path: "orders_center_trade", element: <OrdersCenterTrade /> },
          { path: "orders_center_spot", element: <OrdersCenterSpot /> },
        ],
      },
      {
        path: "deposit",
        element: <Deposit />,
      },
      {
        path: "deposit/:wallitId",
        element: <DepositPayment />,
      },
      {
        path: "history/balance",
        element: <BalanceHistory />,
      },
    ],
  },
  {
    path: "*",
    element: <Outlet />,
    children: [
      ...[
        "",
        "login",
        "register",
        "password-recovery",
        "password-recovery/code",
        "registration-success",
        "email-confirmation",
        "2fa",
        "reset-password",
      ].map((page) => ({
        path: page,
        element: (
          <GuestGuard>
            <Home />
          </GuestGuard>
        ),
      })),
      {
        path: "who-we-are",
        element: (
          <Layout>
            <WhoWeAre />
          </Layout>
        ),
      },
      {
        path: "options-market",
        element: (
          <Layout>
            <OptionsMarket />
          </Layout>
        ),
      },
      {
        path: "cripto-market",
        element: (
          <Layout>
            <CriptoMarket />
          </Layout>
        ),
      },
      {
        path: "community",
        element: (
          <Layout>
            <Community />
          </Layout>
        ),
      },
      {
        path: "why-choose-us",
        element: (
          <Layout>
            <WhyChoooseUs />
          </Layout>
        ),
      },
      // {
      //   path: "",
      //   element: (
      //     <CountdownGuard>
      //       <GuestGuard>
      //         <Login />
      //       </GuestGuard>
      //     </CountdownGuard>
      //   ),
      // },
      // {
      //   path: "login",
      //   element: (
      //     <CountdownGuard>
      //       <GuestGuard>
      //         <Login />
      //       </GuestGuard>
      //     </CountdownGuard>
      //   ),
      // },
      // {
      //   path: "register",
      //   element: (
      //     <CountdownGuard>
      //       <GuestGuard>
      //         <Register />
      //       </GuestGuard>
      //     </CountdownGuard>
      //   ),
      // },
      // {
      //   path: "confirmation-email",
      //   element: (
      //     <CountdownGuard>
      //       <GuestGuard>
      //         <ConfirmationEmailCode />
      //       </GuestGuard>
      //     </CountdownGuard>
      //   ),
      // },
      // {
      //   path: "confirmation-2f-code",
      //   element: (
      //     <CountdownGuard>
      //       <GuestGuard>
      //         <Confirmation2FCode />
      //       </GuestGuard>
      //     </CountdownGuard>
      //   ),
      // },
      // {
      //   path: "verify-code",
      //   element: (
      //     <CountdownGuard>
      //       <GuestGuard>
      //         <VerifyCode />
      //       </GuestGuard>
      //     </CountdownGuard>
      //   ),
      // },
      // {
      //   path: "password-recovery",
      //   element: (
      //     <CountdownGuard>
      //       <PasswordRecovery />
      //     </CountdownGuard>
      //   ),
      // },
      // {
      //   path: "password-reset",
      //   element: (
      //     <CountdownGuard>
      //       <PasswordReset />
      //     </CountdownGuard>
      //   ),
      // },
      // {
      //   path: "change-password",
      //   element: (
      //     <CountdownGuard>
      //       <ChangePassword />
      //     </CountdownGuard>
      //   ),
      // },

      // {
      //   path: "about_us",
      //   element: <AboutUs />,
      // },
      {
        path: "401",
        element: (
          <CountdownGuard>
            <AuthorizationRequired />
          </CountdownGuard>
        ),
      },
      {
        path: "404",
        element: (
          <CountdownGuard>
            <NotFound />
          </CountdownGuard>
        ),
      },
      {
        path: "500",
        element: (
          <CountdownGuard>
            <ServerError />
          </CountdownGuard>
        ),
      },
      {
        path: "*",
        element: (
          <CountdownGuard>
            <NotFound />
          </CountdownGuard>
        ),
      },
    ],
  },
];

export default routes;
