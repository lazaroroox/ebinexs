import { Stack, Typography } from "@mui/material";
import { FC } from "react";
import ConfirmationEmailCodeForm from "src/components/forms/ConfirmationEmailCodeForm";

const EmailCodeForm: FC = () => {
  return (
    <>
      <Stack
        sx={{ width: 350 }}
        role="presentation"
        direction="column"
        spacing={2}
      >
        <Typography
          color="white"
          fontFamily={"Inter"}
          fontWeight={700}
          fontSize={16}
        >
          Código de confirmação
        </Typography>
        <Typography
          color="white"
          sx={{ color: "#A5AAAD", mt: "5px !important" }}
          fontWeight={400}
          fontSize={12}
        >
          Insira abaixo seu email de cadastro, em seguida iremos enviar para
          você um link de confirmação.
        </Typography>
      </Stack>
      <ConfirmationEmailCodeForm mode="drawer" />
    </>
  );
};

export default EmailCodeForm;
