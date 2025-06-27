import Box from "@mui/material/Box";
import { ReactNode, useEffect, useState } from "react";
import * as Yup from "yup";

import {
  Button,
  FormHelperText,
  Link,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Formik } from "formik";
import { useLocation, useNavigate } from "react-router";
import useAuth from "src/hooks/useAuth";
import useIsMountedRef from "src/hooks/useIsMountedRef";
import { apiPost } from "src/services/apiService";
import { notifyError, notifySuccess } from "src/utils/toast";

type ConfirmationEmailCodeFormProps = {
  mode: string;
};

export default function ConfirmationEmailCodeForm({
  mode,
}: ConfirmationEmailCodeFormProps) {
  const isMountedRef = useIsMountedRef();
  const { verifyEmailCode, login } = useAuth() as any;
  const navigate = useNavigate();
  const location = useLocation();

  const [isResend, setIsResend] = useState(false);
  const [timer, setTimer] = useState(60);
  const [timeReady, setTimeReady] = useState(false);
  const [userReq, setUserReq] = useState(null);

  let interval: any;

  const otpTimer = () => {
    interval = window.setTimeout(() => {
      setTimer(timer - 1);
    });

    clearTimeout(interval);
  };

  const calculateTimer = (expiresAt = null) => {
    if (!expiresAt) {
      if (window.location.pathname === "/") {
        navigate("/");
      } else {
        navigate("/login");
      }

      return;
    }

    if (isMountedRef.current) {
      const now = new Date().getTime();
      const expireTime = new Date(expiresAt).getTime();

      const difference = (expireTime - now) / 1000;

      if (difference >= 0) {
        setTimer(Math.floor(difference));
        setTimeReady(true);
        return;
      }
      setTimer(0);
      setTimeReady(true);
    }
  };

  useEffect(() => {
    if (!timeReady) {
      return () => {};
    }

    if (isResend === false) {
      interval = window.setTimeout(() => {
        setTimer(timer - 1);
      }, 1000);
    }

    if (timer === 0) {
      setIsResend(true);
      clearTimeout(interval);
    }
    return () => {};
  }, [isResend, timer]);

  useEffect(() => {
    const userRequest = JSON.parse(localStorage.getItem("userRequest")) || null;
    if (userRequest) {
      setUserReq(userRequest);
      calculateTimer(userRequest.emailConfirmationTokenExpirationDate);
    }
  }, [setTimer, setUserReq]);

  const resendOTP = async (e) => {
    e.preventDefault();

    // @todo update location aqui pra ele pegar o estado novo.
    const { userRequest } = await apiPost("/users/user-requests/renovate", {
      id: userReq.id,
    });

    setIsResend(false);
    setUserReq(userRequest);
    calculateTimer(userRequest.emailConfirmationTokenExpirationDate);
    otpTimer();
  };
  return (
    <Formik
      initialValues={{
        email: userReq?.email || "",
        userId: userReq?.id || "",
        emailConfirmationTokenExpirationDate:
          userReq?.emailConfirmationTokenExpirationDate || null,
        code: "",
        submit: null,
      }}
      validationSchema={Yup.object().shape({
        code: Yup.string().min(6).max(6).required("Código é obrigatório"),
      })}
      onSubmit={async (
        values,
        { setErrors, setStatus, setSubmitting }
      ): Promise<void> => {
        try {
          await verifyEmailCode(userReq?.id, values.code);

          notifySuccess("Sua conta foi criada com sucesso!");

          login({
            email: location.state.email,
            password: location.state.password,
            captchaCode: location.state.captchaCode,
          });
        } catch (err) {
          console.error(err);
          if (err === "InvalidConfirmationEmailCodeException") {
            notifyError("Código inválido!");
          }
          if (isMountedRef.current) {
            setStatus({ success: false });
            setErrors({ submit: err.message });
            setSubmitting(false);
          }
        }
      }}
    >
      {({
        errors,
        handleBlur,
        handleChange,
        handleSubmit,
        isSubmitting,
        setFieldValue,
        touched,
        values,
      }): ReactNode => (
        <Stack
          role="tabpanel"
          component="form"
          spacing={2}
          noValidate
          autoComplete="off"
        >
          {!userReq?.email ? (
            <TextField
              autoFocus
              error={Boolean(touched.email && errors.email)}
              fullWidth
              helperText={
                touched.email &&
                typeof errors.email === "string" &&
                errors.email
              }
              label="E-mail"
              margin="normal"
              name="email"
              onBlur={handleBlur}
              onChange={handleChange}
              type="email"
              value={values.email}
              variant="outlined"
            />
          ) : (
            <TextField
              disabled
              fullWidth
              margin="normal"
              value={userReq.email}
              variant="outlined"
            />
          )}
          <TextField
            id="code"
            label="Código"
            variant="outlined"
            error={Boolean(touched.code && errors.code)}
            fullWidth
            helperText={touched.code && errors.code}
            margin="normal"
            name="code"
            onBlur={handleBlur}
            onChange={handleChange}
            type="code"
            value={values.code}
          />
          {Boolean(
            Array.isArray(touched.code) &&
              touched.code.length === 6 &&
              errors.code
          ) && (
            <FormHelperText error sx={{ mx: "14px" }}>
              {Array.isArray(errors.code) &&
                errors.code.find((x) => x !== undefined)}
            </FormHelperText>
          )}
          {errors.email && (
            <FormHelperText error sx={{ mx: "14px" }}>
              <>{errors.email}</>
            </FormHelperText>
          )}
          <Box sx={{ mt: 3 }}>{JSON.stringify(errors.submit)}</Box>
          {!errors.submit && (
            <Box sx={{ mt: 3 }}>
              <Typography color="textSecondary" variant="body2">
                Você pode reenviar o código em {timer} segundos.{" "}
                {isResend && (
                  <Link
                    color="textSecondary"
                    variant="body2"
                    onClick={resendOTP}
                    sx={{ cursor: "pointer" }}
                  >
                    Reenviar código
                  </Link>
                )}
              </Typography>
            </Box>
          )}
          <Button
            color="primary"
            size="large"
            disabled={isSubmitting}
            variant="contained"
            sx={{ mt: 5 }}
            onClick={(e: any) => handleSubmit(e)}
          >
            Confirmar
          </Button>
        </Stack>
      )}
    </Formik>
  );
}
