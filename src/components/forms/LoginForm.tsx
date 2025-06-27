import Button from "@mui/material/Button";
import { Formik } from "formik";
import * as React from "react";
import { Link as RouterLink } from "react-router-dom";
import * as Yup from "yup";

import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  InputAdornment,
  InputLabel,
  Link,
  OutlinedInput,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import LayoutContext from "src/contexts/LayoutContext";
import useAuth from "../../hooks/useAuth";
import useIsMountedRef from "../../hooks/useIsMountedRef";

const formValidate = Yup.object().shape({
  email: Yup.string()
    .email("O endereço de e-mail é inválido.")
    .max(255)
    .required("E-mail obrigatório"),
  password: Yup.string().max(255).required("Senha obrigatória"),
});

type LoginFormProps = {
  mode?: string;
  showForgetPassword?: boolean;
};

export default function LoginForm({
  mode,
  showForgetPassword,
}: LoginFormProps) {
  const isMountedRef = useIsMountedRef();
  const { t } = useTranslation("login_register");
  const { layout, setActiveDrawer } = React.useContext(LayoutContext);
  const { login } = useAuth() as any;
  const navigate = useNavigate();
  const recaptcha: any = useRef(null);

  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  return (
    <Formik
      initialValues={{
        email: "",
        password: "",
        submit: null,
        keepLoggedIn: false,
      }}
      validationSchema={formValidate}
      onSubmit={async (
        values,
        { setErrors, setStatus, setSubmitting }
      ): Promise<void> => {
        try {
          const captchaCode = recaptcha?.current?.getValue();
          if (!captchaCode) {
            alert(t("recaptcha_check"));
            return;
          }
          await login({
            email: values.email,
            password: values.password,
            keepLoggedIn: values.keepLoggedIn,
            captchaCode,
          });
          if (isMountedRef.current) {
            setStatus({ success: true });
            setSubmitting(false);
          }
        } catch (err) {
          console.error(err);

          const pathname = window.location.pathname;

          if (err === "Invalid2faCodeException") {
            if (pathname === "/") {
              navigate("/confirmation-2f-code", {
                state: {
                  email: values.email,
                  password: values.password,
                },
              });
              setActiveDrawer("twoStepVerification");
            } else {
              navigate("/2fa", {
                state: {
                  email: values.email,
                  password: values.password,
                },
              });
            }
          }
          if (err === "User has ON_HOLD status.") {
            navigate("/authentication/waiting_list", {
              state: {
                email: values.email,
              },
            });
          }

          if (err === "UserNotActiveException") {
            setStatus({ success: false });
            setErrors({
              submit:
                "Seu usuário ainda não está ativo, clique em recuperar sua senha para ativar o usuário.",
            });
            setSubmitting(false);
          } else {
            if (isMountedRef.current) {
              setStatus({ success: false });
              setErrors({
                submit:
                  err !== "BusinessException"
                    ? err
                    : "Usuário ou senha inválido",
              });
              setSubmitting(false);
            }
          }

          recaptcha?.current?.reset();
        }
      }}
    >
      {({
        errors,
        handleBlur,
        handleChange,
        handleSubmit,
        isSubmitting,
        touched,
        values,
      }) => (
        <Stack
          role="tabpanel"
          hidden={layout.activeTab !== "login"}
          id={`simple-tabpanel-${layout.activeTab}`}
          aria-labelledby={`simple-tab-${layout.activeTab}`}
          spacing={2}
        >
          <TextField
            id="email"
            label={t("email")}
            fullWidth
            error={Boolean(touched.email && errors.email)}
            onBlur={handleBlur}
            onChange={handleChange}
            type="email"
            value={values.email}
            helperText={touched.email && errors.email}
            variant="outlined"
          />
          <FormControl>
            <InputLabel htmlFor="login-password">{t("password")}</InputLabel>
            <OutlinedInput
              id="login-password"
              name="password"
              type={showPassword ? "text" : "password"}
              error={Boolean(touched.password && errors.password)}
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.password}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label={t("password")}
            />
          </FormControl>
          {errors.submit && (
            <Box sx={{ mt: 3 }}>
              <FormHelperText error>
                <>{errors.submit}</>
              </FormHelperText>
            </Box>
          )}
          <Stack
            direction={"row"}
            justifyContent="space-between"
            alignItems={"center"}
            spacing={2}
          >
            <FormControlLabel
              control={<Checkbox defaultChecked />}
              sx={{ color: "#A5AAAD" }}
              label={t("stay_logged_in")}
              checked={values.keepLoggedIn}
              name="keepLoggedIn"
              onChange={handleChange}
            />
            {showForgetPassword ? (
              <Link
                color="textPrimary"
                component="button"
                underline="none"
                variant="body1"
                sx={{ color: "#A5AAAD" }}
                onClick={() => setActiveDrawer("forgorPassword")}
              >
                {t("forgot_password")}
              </Link>
            ) : (
              <Link
                color="textSecondary"
                component={RouterLink}
                sx={{ mt: 1 }}
                to="/password-recovery"
                variant="body2"
              >
                Esqueceu a senha?
              </Link>
            )}
          </Stack>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              mt: 2,
            }}
          >
            <ReCAPTCHA
              ref={recaptcha}
              sitekey={import.meta.env.VITE_SITE_KEY}
            />
          </Box>
          <Button
            color="primary"
            size="large"
            disabled={isSubmitting}
            variant="contained"
            sx={{ mt: 5 }}
            onClick={(e: any) => handleSubmit(e)}
          >
            {t("log_in")}
          </Button>
          <Typography fontSize={12}>
            Para mais informações acesse o nosso Telegram Oficial no Brasil: {" "}
            <Link
              color="textPrimary"
              variant="body1"
              sx={{ fontSize: 12 }}
              href=" https://t.me/ebinexbr"
              target="_blank"
            >
              Clique aqui
            </Link>
          </Typography>
        </Stack>
      )}
    </Formik>
  );
}
