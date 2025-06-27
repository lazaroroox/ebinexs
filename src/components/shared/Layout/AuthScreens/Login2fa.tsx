import { FC } from "react";
import Login2faForm from "../../forms/Login2faForm";
import { Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

const Login2fa: FC = () => {
  const { t } = useTranslation("login_register");

  return (
    <>
      <Stack spacing={1}>
        <Typography
          fontFamily="Inter"
          fontSize={20}
          lineHeight={1.2}
          fontWeight={700}
        >
          {t("2fa_title")}
        </Typography>
        <Typography fontSize={14} color="#A5AAAD">
          {t("2fa_subtitle")}
        </Typography>
      </Stack>
      <Login2faForm />
    </>
  );
};

export default Login2fa;
