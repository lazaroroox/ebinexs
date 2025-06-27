import type { AppBarProps } from "@mui/material";
import { AppBar } from "@mui/material";
import { styled } from "@mui/material/styles";
import PropTypes from "prop-types";
import { FC } from "react";
import HeaderDashboard from "../HeaderDashboard";
import BetaDepositInfoModal from "../modals/BetaDepositInfoModal";
import ModalManager from "../modals/ModalManager";
import OutsideMarketModal from "../modals/OutsideMarketModal";
import SupportModal from "../modals/SupportModal";

interface DashboardNavbarProps extends AppBarProps {
  onSidebarMobileOpen?: () => void;
}

const DashboardNavbarRoot = styled(AppBar)(({ theme }) => ({
  ...(theme.palette.mode === "light" && {
    backgroundColor: theme.palette.primary.main,
    boxShadow: "none",
    color: theme.palette.primary.contrastText,
  }),
  ...(theme.palette.mode === "dark" && {
    backgroundColor: theme.palette.background.default,
    borderBottom: `1px solid ${theme.palette.divider}`,
    boxShadow: "none",
  }),
  zIndex: theme.zIndex.drawer + 100,
}));

const DashboardNavbar: FC<DashboardNavbarProps> = (props) => {
  const { onSidebarMobileOpen, ...other } = props;

  return (
    <>
      <HeaderDashboard props={other} />
      <ModalManager />
      <SupportModal />
      <BetaDepositInfoModal />
      {/* <AlertAccountRealModal />
      <AlertAccountDemoModal />
      <AlertWellcomeModal /> */}
      {/* <ForexWarning /> */}
      <OutsideMarketModal />
    </>
  );
};

DashboardNavbar.propTypes = {
  onSidebarMobileOpen: PropTypes.func,
};

export default DashboardNavbar;
