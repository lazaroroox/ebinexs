import { Stack, Typography } from "@mui/material";
import { FC } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import PasswordRecoveryCodeForm from "../../forms/PasswordRecoveryCodeForm";

import PasswordRecoveryIcon from "src/assets/images/home/password-recovery-icon.png";

const PasswordRecoveryCode: FC = () => {
  const { t } = useTranslation("password_recovery");
  const [searchParams] = useSearchParams();

  return (
    <>
      <Stack spacing={1} alignItems="center" mb={4} textAlign={"center"}>
        <img
          src={PasswordRecoveryIcon}
          alt="Logo"
          style={{ width: 82, height: 82 }}
        />
        <Typography
          fontFamily="Inter"
          fontSize={20}
          lineHeight={1.2}
          fontWeight={700}
          pt={1}
        >
          {t("code_title")}
        </Typography>
        <Typography fontSize={14} color="#A5AAAD">
          {t("code_subtitle", {
            email: searchParams.get("email"),
          })}
        </Typography>
      </Stack>
      <PasswordRecoveryCodeForm />
    </>
  );
};

export default PasswordRecoveryCode;
