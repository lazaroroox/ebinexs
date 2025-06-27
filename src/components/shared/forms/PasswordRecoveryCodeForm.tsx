import { Box, Button, FormHelperText, Stack, TextField } from "@mui/material";
import { useFormik } from "formik";
import { FC } from "react";
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

const PasswordRecoveryCodeForm: FC = () => {
  const { t } = useTranslation(["password_recovery", "forms"]);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { verifyPasswordCode } = useAuth();

  const formik = useFormik({
    initialValues: {
      code: "",
      submit: null,
    },
    validationSchema: Yup.object().shape({
      code: Yup.string().required(
        t("forms:validation.recovery_password_code.required")
      ),
    }),
    async onSubmit(values, { setErrors, setStatus, setSubmitting }) {
      try {
        const email = searchParams.get("email");

        await verifyPasswordCode(email, values.code);

        notifySuccess(t("forms:code_verified_success"));

        navigate(`/reset-password?email=${email}&code=${values.code}`);
      } catch (err) {
        setStatus({ success: false });
        setErrors({ submit: t(errorDict[err]) });
        setSubmitting(false);
      }
    },
  });

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
      <TextField
        id="code"
        label={t("code")}
        variant="outlined"
        name="code"
        error={Boolean(formik.touched.code && formik.errors.code)}
        helperText={formik.touched.code && formik.errors.code}
        onBlur={formik.handleBlur}
        onChange={formik.handleChange}
        type="text"
        value={formik.values.code}
      />
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
        {t("confirm")}
      </Button>
    </Stack>
  );
};

export default PasswordRecoveryCodeForm;
