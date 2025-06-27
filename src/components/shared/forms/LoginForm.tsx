import Button from "@mui/material/Button";
import { useFormik } from "formik";
import { FC, useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { Link as RouterLink } from "react-router-dom";
import * as Yup from "yup";

import styled from "@emotion/styled";
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
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import useAuth from "../../../hooks/useAuth";
import { useTestMode } from "src/contexts/TestModeContext";

const SocialIcon = styled("img")(() => ({
  width: 24,
}));

const errorDict = new Proxy(
  {
    BusinessException: "forms:user_does_not_exists",
    UserNotActiveException: "forms:user_not_active",
  },
  {
    get(target, prop) {
      return target[prop] || prop;
    },
  }
);

const LoginForm: FC = () => {
  const { t } = useTranslation(["login_register", "forms"]);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth() as any;
  const navigate = useNavigate();
  const recaptcha: any = useRef(null);

  const { isTestMode } = useTestMode();

  const formik = useFormik({
    validationSchema: Yup.object().shape({
      email: Yup.string()
        .email(t("forms:validation.email.invalid"))
        .max(255, t("forms:validation.email.greaterThanLimit"))
        .required(t("forms:validation.email.required")),
      password: Yup.string()
        .max(255, t("forms:validation.password.greaterThanLimit"))
        .required(t("forms:validation.password.required")),
    }),
    initialValues: {
      email: "",
      password: "",
      submit: null,
      keepLoggedIn: false,
    },
    async onSubmit(values, { setErrors, setStatus, setSubmitting }) {
      try {
        const captchaCode = isTestMode
          ? "TEST_MODE"
          : recaptcha?.current?.getValue();
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

        setStatus({ success: true });
        setSubmitting(false);
      } catch (err) {
        if (err === "Invalid2faCodeException") {
          navigate("/2fa", {
            state: {
              email: values.email,
              password: values.password,
              keepLoggedIn: values.keepLoggedIn,
            },
          });
        } else if (err === "User has ON_HOLD status.") {
          navigate("/authentication/waiting_list", {
            state: {
              email: values.email,
            },
          });
        } else {
          setStatus({ success: false });
          setErrors({ submit: t(errorDict[err]) });
          setSubmitting(false);
          recaptcha?.current?.reset();
        }
      }
    },
  });

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  return (
    <>
      <Stack
        component="form"
        role="tabpanel"
        aria-labelledby="simple-tab-login"
        spacing={2}
        noValidate
        onSubmit={formik.handleSubmit}
      >
        <Typography variant="body1" fontSize={16}>
          {t("welcome_back")}
        </Typography>
        <TextField
          id="email"
          label={t("email")}
          fullWidth
          error={Boolean(formik.touched.email && formik.errors.email)}
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          type="email"
          value={formik.values.email}
          helperText={formik.touched.email && formik.errors.email}
          variant="outlined"
        />
        <FormControl>
          <InputLabel htmlFor="login-password">{t("password")}</InputLabel>
          <OutlinedInput
            id="login-password"
            name="password"
            type={showPassword ? "text" : "password"}
            error={Boolean(formik.touched.password && formik.errors.password)}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.password}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label={t("password")}
          />
        </FormControl>
        {formik.errors.submit && (
          <Box sx={{ mt: 3 }}>
            <FormHelperText error>
              <>{formik.errors.submit}</>
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
            label={
              <Typography fontSize={14} color="#A5AAAD">
                {t("stay_logged_in")}
              </Typography>
            }
            checked={formik.values.keepLoggedIn}
            name="keepLoggedIn"
            onChange={formik.handleChange}
          />
          <Link
            color="#A5AAAD"
            component={RouterLink}
            sx={{ mt: 1 }}
            to="/password-recovery"
            variant="body2"
            underline="hover"
            fontSize={14}
          >
            {t("forgot_password")}
          </Link>
        </Stack>
        {!isTestMode && (
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
              theme="dark"
              sitekey={import.meta.env.VITE_SITE_KEY}
            />
          </Box>
        )}
        <Button
          type="submit"
          color="primary"
          size="large"
          disabled={formik.isSubmitting}
          variant="contained"
          sx={{ mt: 5 }}
        >
          {t("log_in")}
        </Button>
      </Stack>
      {/* <SocialLoginButtonts /> */}
      <Stack direction="row" spacing={1} alignItems="center">
        <Typography variant="body1" fontSize={14} sx={{ mt: 2 }}>
          {t("still_dont_have_an_account")}{" "}
        </Typography>
        <Button
          type="submit"
          color="primary"
          variant="text"
          to="/register"
          component={RouterLink}
          sx={{ fontSize: 14, p: 0, color: "#38ffa5" }}
        >
          {t("register")}
        </Button>
      </Stack>
    </>
  );
};

export default LoginForm;
