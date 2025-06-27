import {
  AppBar,
  Box,
  Button,
  Stack,
  Toolbar,
  useMediaQuery,
} from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { MdOutlineWallet } from "react-icons/md";
import {
  Link as RouterLink,
  useLocation,
  useSearchParams,
} from "react-router-dom";
import mobileLogoImage from "src/assets/images/x.svg";
import NavigationHeaderMenu from "src/components/NavigationHeaderMenu";
import SubHeaderDense from "src/components/trade/SubHeaderDense";
import AccountContext from "src/contexts/AccountContext";
import LayoutContext from "src/contexts/LayoutContext";
import useAuth from "src/hooks/useAuth";
import AccountMenu from "./dashboard/AccountMenu/index";
import EyeShowSensitiveInfo from "./EyeShowSensitiveInfo";
import Logo from "./Logo";
import MenuSelectAccount from "./menus/MenuSelectAccount";
import MenuTimezone from "./menus/MenuTimezone";
import SelectAccountSkeleton from "./skeleton/SelectAccountSkeleton";

const MobileLogo = styled("img")({
  height: 20,
  // marginRight: 10,
});

const IconsStyle = {
  cursor: "pointer",
  "&:hover": {
    color: "#CCC",
  },
};

const HeaderDashboard = ({ props }) => {
  const { t } = useTranslation(["dashboard", "home"]);
  const auth = useAuth();
  const { accounts, activeAccount } = useContext(AccountContext);
  const location = useLocation();
  const { setActiveTab } = useContext(LayoutContext);
  const [searchParams] = useSearchParams();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const tab = searchParams.get("tab");

  const isPathnameTraderoom = location.pathname === "/traderoom";

  return (
    <AppBar
      sx={{
        background: isMobile ? "#050b0e" : "#00060A",
        px: isMobile ? 0 : 2,
        boxShadow: "none",
        borderBottom: "1px solid #010e16",
        top: 0,
        right: 0,
        left: 0,
        "& .MuiToolbar-root ": {
          px: ".75rem !important",
        },
      }}
      position="fixed"
    >
      <Toolbar
        variant="dense"
        disableGutters={true}
        sx={{
          display: "flex",
          justifyContent: "space-between",
          flexDirection: "row",

          minHeight: isMobile ? 60 : 80,
          ...(isMobile && { px: 2.5 }),
        }}
      >
        {isMobile && (
          <RouterLink
            to={`${auth.isAuthenticated ? "/traderoom" : "/"}`}
            onClick={() => setActiveTab("dashboard")}
            style={{
              display: "flex",
              height: "100%",
              alignItems: "center",
            }}
          >
            <MobileLogo
              src={mobileLogoImage}
              style={{
                marginRight: location.pathname !== "/traderoom" ? 0 : 10,
              }}
              alt=""
            />
          </RouterLink>
        )}

        {!isMobile && (
          <RouterLink
            to={`${auth.isAuthenticated ? "/traderoom" : "/"}`}
            onClick={() => {
              if (auth.isAuthenticated) {
                window.location.href = "/traderoom";
              } else {
                window.location.href = "/";
              }
              setActiveTab("dashboard");
            }}
            style={{ marginRight: "1rem" }}
          >
            <Logo />
          </RouterLink>
        )}

        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          width={isMobile ? "initial" : "100%"}
        >
          {!isMobile && isPathnameTraderoom && <SubHeaderDense />}
          <Stack
            direction={isMobile ? "row-reverse" : "row"}
            justifyContent={"space-between"}
            gap={2}
            flex={1}
          >
            {!isPathnameTraderoom && (
              <Box
                style={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                }}
                flex={!isMobile ? 1 : undefined}
              >
                <NavigationHeaderMenu />
              </Box>
            )}
            <Stack
              direction={"row"}
              gap={2}
              justifyContent={"center"}
              alignItems="center"
              alignSelf="center"
              sx={{
                justifyContent: "flex-end",
                marginLeft: "auto",
                ...(isMobile && {
                  gap: "0.25rem",
                }),
              }}
            >
              {!isMobile && <MenuTimezone />}
              {!isMobile && (
                <Box sx={IconsStyle}>
                  <EyeShowSensitiveInfo size={20} color="#808080" />
                </Box>
              )}
              <Box
                sx={{
                  marginLeft: "0 !important",
                  minWidth: "initial",
                }}
              >
                {accounts.length > 0 && activeAccount ? (
                  <MenuSelectAccount />
                ) : (
                  <SelectAccountSkeleton />
                )}
              </Box>

              {tab !== "deposit" && (
                <Button
                  component={RouterLink}
                  size="large"
                  variant="contained"
                  to="/dashboard/profile/deposit"
                  style={{ marginLeft: "0" }}
                  sx={{
                    marginLeft: "0",

                    background: "#00B474",
                    px: "0.5rem",
                    py: "0.125rem",
                    borderRadius: "6px",

                    "&:hover": {
                      background: "#01DB97",
                    },

                    "@media screen and (max-width: 600px)": {
                      minWidth: 50,
                      width: "max-content",
                      px: 0,
                      py: 0,
                    },

                    "@media screen and (max-width: 380px)": {
                      minWidth: 40,
                    },

                    fontSize: 13,
                    lineHeight: "24px",
                    fontWeight: 700,

                    "& .MuiButton-startIcon": {
                      marginRight: 0,
                      marginLeft: 0,
                    },
                  }}
                  startIcon={<MdOutlineWallet size={20} />}
                >
                  {!isMobile && t("deposit")}
                </Button>
              )}

              <AccountMenu />
            </Stack>
          </Stack>
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default HeaderDashboard;
