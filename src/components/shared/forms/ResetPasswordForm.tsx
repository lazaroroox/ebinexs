import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
} from "@mui/material";
import { useFormik } from "formik";
import { FC, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { useSearchParams } from "react-router-dom";
import useAuth from "src/hooks/useAuth";
import { notifySuccess } from "src/utils/toast";
import * as Yup from "yup";

const errorDict = new Proxy(
  {
    InvalidConfirmationEmailCodeException:
      "forms:invalid_confirmation_email_code",
  },
  {
    get(target, prop) {
      return target[prop] || prop;
    },
  }
);

const ResetPasswordForm: FC = () => {
  const { t } = useTranslation(["reset_password", "forms"]);
  const [showPassword, setShowPassword] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { passwordReset } = useAuth();

  const formik = useFormik({
    initialValues: {
      newPassword: "",
      passwordConfirmation: "",
      submit: null,
    },
    validationSchema: Yup.object().shape({
      newPassword: Yup.string()
        .min(7, t("forms:validation.password.lessThanMinimum"))
        .max(255, t("forms:validation.password.greaterThanLimit"))
        .required(t("forms:validation.password.required")),
      passwordConfirmation: Yup.string().oneOf(
        [Yup.ref("newPassword"), null],
        t("forms:validation.password.mismatched")
      ),
    }),
    async onSubmit(values, { setErrors, setStatus, setSubmitting }) {
      try {
        await passwordReset(
          searchParams.get("email"),
          searchParams.get("code"),
          values.newPassword
        );

        notifySuccess("change_password_success");

        navigate("/login");
      } catch (err) {
        setStatus({ success: false });
        setErrors({ submit: t(errorDict[err]) });
        setSubmitting(false);
      }
    },
  });

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  return (
    <Stack
      component="form"
      role="tabpanel"
      aria-labelledby="simple-tab-register"
      spacing={2}
      noValidate
      autoComplete="off"
      onSubmit={formik.handleSubmit}
    >
      <FormControl>
        <InputLabel htmlFor="register-password">{t("new_password")}</InputLabel>
        <OutlinedInput
          id="new-password"
          type={showPassword ? "text" : "password"}
          error={Boolean(
            formik.touched.newPassword && formik.errors.newPassword
          )}
          label={t("new_password")}
          name="newPassword"
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          value={formik.values.newPassword}
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
        />
        {Boolean(formik.touched.newPassword && formik.errors.newPassword) && (
          <FormHelperText error>{formik.errors.newPassword}</FormHelperText>
        )}
      </FormControl>
      <FormControl>
        <InputLabel htmlFor="register-confirm-password">
          {t("confirm_password")}
        </InputLabel>
        <OutlinedInput
          id="register-confirm-password"
          type={showPassword ? "text" : "password"}
          error={Boolean(
            formik.touched.passwordConfirmation &&
              formik.errors.passwordConfirmation
          )}
          label={t("confirm_password")}
          name="passwordConfirmation"
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          value={formik.values.passwordConfirmation}
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
        />
        {Boolean(
          formik.touched.passwordConfirmation &&
            formik.errors.passwordConfirmation
        ) && (
          <FormHelperText error>
            {formik.errors.passwordConfirmation}
          </FormHelperText>
        )}
      </FormControl>
      {formik.errors.submit && (
        <Box sx={{ mt: 1 }}>
          <FormHelperText error>
            <>{formik.errors.submit}</>
          </FormHelperText>
        </Box>
      )}
      <Button
        type="submit"
        color="primary"
        size="large"
        variant="contained"
        disabled={formik.isSubmitting}
        sx={{ mt: 5 }}
      >
        {t("change_password")}
      </Button>
    </Stack>
  );
};

export default ResetPasswordForm;
