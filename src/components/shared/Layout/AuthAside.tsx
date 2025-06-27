import styled from "@emotion/styled";
import CloseIcon from "@mui/icons-material/Close";
import { Box, Drawer, IconButton, Stack } from "@mui/material";
import { FC, useEffect } from "react";
import { Cookies } from "react-cookie";
import useQuery from "src/hooks/useQuery";
import Logo from "../../Logo";
import EmailCodeForm from "../forms/EmailCodeForm";
import Login2fa from "./AuthScreens/Login2fa";
import { AuthTab, LoginForms } from "./AuthScreens/LoginForms";
import PasswordRecovery from "./AuthScreens/PasswordRecovery";
import PasswordRecoveryCode from "./AuthScreens/PasswordRecoveryCode";
import ResetPassword from "./AuthScreens/ResetPassword";

const Container = styled("div")(() => ({
  maxWidth: 480,
  padding: 48,
}));

export type Page =
  | AuthTab
  | "registration-success"
  | "email-confirmation"
  | "password-recovery"
  | "password-recovery/code"
  | "reset-password"
  | "2fa";

interface AuthAsideProps {
  onClose: () => void;
}

const AuthAside: FC<AuthAsideProps> = (props) => {
  const { onClose } = props;
  const currentPage = window.location.pathname.replace("/", "") as Page;

  console.log("currentPage", currentPage);

  const query = useQuery();
  const token = query.get("token");
  const accountId = query.get("accountId");

  const authCookies = new Cookies(null, {
    domain: import.meta.env.VITE_DOMAIN_AUTH,
    path: "/",
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
  });

  useEffect(() => {
    if (token) {
      authCookies.set("ebinex:accessToken", token);
      authCookies.set("ebinex:accountId", accountId);
      // setTimeout(() => {
      //   window.location.reload();
      // }, 1000);
    }
  }, [token]);

  const style = {
    // background: "#030a10",
  };

  return (
    <Drawer
      open={[
        "login",
        "register",
        "2fa",
        "password-recovery",
        "password-recovery/code",
        "reset-password",
        "email-confirmation",
      ].includes(currentPage)}
      onClose={onClose}
      anchor="right"
      variant="temporary"
      sx={style}
      slotProps={{
        backdrop: {
          style: {
            background: "#030a1081",
          },
        },
      }}
      PaperProps={{
        sx: {
          width: "100%",
          maxWidth: 480,
          background: "#030a10",
          borderLeft: "2px solid #071219",
        },
      }}
    >
      <Container>
        <Stack spacing={4}>
          <Box sx={{ display: "grid", placeItems: "end" }}>
            <IconButton onClick={() => onClose()}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Box sx={{ textAlign: "center" }}>
            <Logo sx={{ height: 32, width: 140 }} />
          </Box>
          {(currentPage === "login" || currentPage === "register") && (
            <LoginForms currentTab={currentPage} />
          )}
          {currentPage === "2fa" && <Login2fa />}
          {currentPage === "password-recovery" && <PasswordRecovery />}
          {currentPage === "password-recovery/code" && <PasswordRecoveryCode />}
          {currentPage === "reset-password" && <ResetPassword />}
          {/* {currentPage === "registration-success" && <RegistrationSuccess />} */}
          {currentPage === "email-confirmation" && <EmailCodeForm />}
        </Stack>
      </Container>
    </Drawer>
  );
};

export default AuthAside;
