import styled from "@emotion/styled";
import { Stack, Tab, Tabs, Typography } from "@mui/material";
import { FC } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import LoginForm from "../../forms/LoginForm";
import RegisterForm from "../../forms/RegisterForm";

const AuthTab = styled(Tab)({
  width: "50%",
  fontSize: 14,
  fontWeight: 400,
  textTransform: "capitalize",
  backgroundColor: "#0f1921",
});

export type AuthTab = "login" | "register";

interface LoginFormsProps {
  currentTab: AuthTab;
}

function a11yProps(index: number) {
  return {
    id: `auth-tab-${index}`,
    "aria-controls": `auth-tab-panel-${index}`,
  };
}

export const LoginForms: FC<LoginFormsProps> = (props) => {
  const { currentTab } = props;
  const { t } = useTranslation("login_register");
  const navigate = useNavigate();

  return (
    <>
      <Stack spacing={1}>
        <Typography
          fontFamily="Inter"
          fontSize={20}
          lineHeight={1.2}
          fontWeight={700}
        >
          {t("form_title")}
        </Typography>
        <Typography fontSize={14} color="#A5AAAD">
          {t("form_subtitle")}
        </Typography>
      </Stack>
      <Tabs
        value={currentTab}
        onChange={(_, newValue) => navigate(`/${newValue}`)}
        aria-label="auth panel tabs"
      >
        <AuthTab label={t("tabs.login")} value="login" {...a11yProps(0)} />
        <AuthTab
          label={t("tabs.register")}
          value="register"
          {...a11yProps(1)}
        />
      </Tabs>
      {currentTab === "login" && <LoginForm />}
      {currentTab === "register" && <RegisterForm />}
    </>
  );
};
