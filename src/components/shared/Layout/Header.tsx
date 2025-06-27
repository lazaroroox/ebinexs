import {
  Box,
  Button,
  Link,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useTranslation } from "react-i18next";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import LandingMenu from "src/components/home/components/LandingMenu";
import Logo from "src/components/Logo";
import AuthAside from "./AuthAside";
import { useTestMode } from "src/contexts/TestModeContext";

export const Header = () => {
  const { t } = useTranslation(["langs", "home", "menu"]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isTablet = useMediaQuery(theme.breakpoints.down("lg"));
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);

  const { createTestId } = useTestMode();

  const [cookies] = useCookies();

  const token = cookies["ebinex:accessToken"];

  const style = {
    position: "sticky",
    zIndex: 2,
    width: "100%",
    "& .cta_buttons_box button": {
      borderRadius: "32px",
      minWidth: "120px",

      "&.login_btn": {
        color: "#EEE",
        border: "1px solid #EEE",
        "&:hover": {
          border: "0",
          background: "#00A667",
        },
      },
    },
    "& .link": {
      mr: "auto",
      display: "flex",
      textDecoration: "none",
    },
    "& .logo_text": {
      fontSize: "0.9rem",
      paddingTop: "2px",
      fontStyle: "italic",
    },
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <Box
      sx={{
        ...style,
        padding: isMobile ? "0 1rem" : isTablet ? "0" : "0 4rem",
        top: isScrolled ? 24 : isMobile ? "1rem" : "2.5rem",
        display: "flex",
        justifyContent: "center",
        transition: "all 0.3s ease-in-out",
      }}
    >
      <AuthAside onClose={() => navigate("/")} />

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          maxWidth: isScrolled ? 1440 : 1790,
          transition: "all 0.3s ease-in-out",
          zIndex: 9,
          background: isScrolled ? "#141719b3" : "transparent",
          backdropFilter: "blur(2px)",
          borderRadius: "40px",
          padding: "0.5rem 2.5rem",

          ...(isTablet && {
            padding: "0.5rem 1rem",
          }),
        }}
      >
        <Box>
          <Link component={RouterLink} to="/" className="link" sx={{}}>
            <Logo sx={{ height: 24 }} />
            <Typography variant="body1" className="logo_text" sx={{ ml: 1 }}>
              | <span style={{ fontWeight: 700, fontSize: "1rem" }}> 02 </span>{" "}
              anos
            </Typography>
          </Link>
        </Box>

        <Box
          sx={{
            background: isScrolled ? "transparent" : "#1a1e20",
            borderRadius: "32px",
            transition: "background 0.5s ease-in-out",
          }}
        >
          <LandingMenu />
        </Box>

        {!isMobile && (
          <Box className="cta_buttons_box">
            <Stack direction="row" spacing={{ xs: 2 }}>
              <Button
                {...createTestId("login-header-button")}
                variant="outlined"
                size={isMobile ? "medium" : "large"}
                className="login_btn"
                onClick={() => {
                  navigate(token ? "/traderoom" : "/login");
                }}
              >
                {t(token ? "Dashboard" : "home:login")}
              </Button>
              {!token && (
                <Button
                  {...createTestId("register-header-button")}
                  variant="contained"
                  size={isMobile ? "medium" : "large"}
                  onClick={() => {
                    navigate("/register");
                  }}
                >
                  {t("home:register")}
                </Button>
              )}
            </Stack>
          </Box>
        )}
      </Box>
    </Box>
  );
};
