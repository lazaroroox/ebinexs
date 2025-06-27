import { styled } from "@mui/material/styles";
import type { FC, ReactNode } from "react";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import { AccountProvider } from "src/contexts/AccountContext";
import { ApiProviderV2 } from "src/contexts/v2/ApiContext";
import { Footer } from "src/layout/Footer";
import DashboardNavbar from "./DashboardNavbar";

interface DashboardLayoutProps {
  children?: ReactNode;
}

const DashboardLayoutRoot = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  display: "flex",
  height: "100%",
  width: "100%",
  flexDirection: "column",
  "@media screen and (min-width: 1200px)": {
    height: "100vh",
  },
}));

const DashboardLayoutContent = styled("div")({
  display: "flex",
  flex: "1 1 auto",
  width: "100%",
  marginTop: "80px",
  flexDirection: "column",

  "@media screen and (min-width: 1200px)": {
    flexDirection: "row",
  },

  "@media screen and (max-width: 900px)": {
    marginTop: "60px",
  },

  WebkitOverflowScrolling: "touch",
});

const DashboardLayout: FC<DashboardLayoutProps> = () => {
  const [isSidebarMobileOpen, setIsSidebarMobileOpen] =
    useState<boolean>(false);

  return (
    <ApiProviderV2>
      <AccountProvider>
        <DashboardLayoutRoot>
          <DashboardNavbar
            onSidebarMobileOpen={(): void => setIsSidebarMobileOpen(true)}
          />
          <DashboardLayoutContent>
            <Outlet />
          </DashboardLayoutContent>
          <Footer />
        </DashboardLayoutRoot>
      </AccountProvider>
    </ApiProviderV2>
  );
};

export default DashboardLayout;
