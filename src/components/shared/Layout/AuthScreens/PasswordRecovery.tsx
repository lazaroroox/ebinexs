import { FC } from "react";
import { useTranslation } from "react-i18next";
import { Stack, Typography } from "@mui/material";
import PasswordRecoveryForm from "../../forms/PasswordRecoveryForm";

const PasswordRecovery: FC = () => {
  const { t } = useTranslation("password_recovery");

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
      <PasswordRecoveryForm />
    </>
  );
};

export default PasswordRecovery;
