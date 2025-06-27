import { FC } from "react";
import { useTranslation } from "react-i18next";
import { Stack, Typography } from "@mui/material";
import ResetPasswordForm from "../../forms/ResetPasswordForm";

const ResetPassword: FC = () => {
  const { t } = useTranslation("reset_password");

  return (
    <>
      <Stack spacing={1}>
        <Typography
          fontFamily="Inter"
          fontSize={20}
          lineHeight={1.2}
          fontWeight={700}
        >
          {t("title")}
        </Typography>
        <Typography fontSize={14} color="#A5AAAD">
          {t("subtitle")}
        </Typography>
      </Stack>
      <ResetPasswordForm />
    </>
  );
};

export default ResetPassword;
