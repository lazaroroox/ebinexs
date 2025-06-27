import { Box, Button, FormHelperText, Stack, TextField } from "@mui/material";
import { useFormik } from "formik";
import { FC } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import useAuth from "src/hooks/useAuth";
import * as Yup from "yup";

const errorDict = new Proxy(
  {
    UserDoesNotExistsException: "forms:password_recovery_user_does_not_exists",
  },
  {
    get(target, prop) {
      return target[prop] || prop;
    },
  }
);

const PasswordRecoveryForm: FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation(["password_recovery", "forms"]);
  const { passwordRecovery } = useAuth();

  const formik = useFormik({
    initialValues: {
      email: "",
      submit: null,
    },
    validationSchema: Yup.object().shape({
      email: Yup.string()
        .email(t("forms:validation.email.invalid"))
        .max(255, t("forms:validation.email.greaterThanLimit"))
        .required(t("forms:validation.email.required")),
    }),
    async onSubmit(values, { setErrors, setStatus, setSubmitting }) {
      try {
        await passwordRecovery(values.email);

        navigate(`/password-recovery/code?email=${values.email}`);
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
        id="email"
        label={t("email")}
        variant="outlined"
        name="email"
        error={Boolean(formik.touched.email && formik.errors.email)}
        helperText={formik.touched.email && formik.errors.email}
        onBlur={formik.handleBlur}
        onChange={formik.handleChange}
        type="email"
        value={formik.values.email}
      />
      {formik.errors.submit && (
        <Box sx={{ mt: 3 }}>
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
        {t("send")}
      </Button>
    </Stack>
  );
};

export default PasswordRecoveryForm;
