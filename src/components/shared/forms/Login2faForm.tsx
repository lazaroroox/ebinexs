import { Button, FormHelperText, Stack, TextField } from "@mui/material";
import { useFormik } from "formik";
import { FC, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router";
import useAuth from "src/hooks/useAuth";
import * as Yup from "yup";

const errorDict = new Proxy(
  {
    Invalid2faCodeException: "forms:invalid_2fa_code",
  },
  {
    get(target, prop) {
      return target[prop] || prop;
    },
  }
);

const Login2faForm: FC = () => {
  const { t } = useTranslation(["login_register", "forms"]);
  const navigate = useNavigate();
  const { state } = useLocation();
  const { login } = useAuth();
  const recaptcha: any = useRef(null);

  useEffect(() => {
    if (!state) {
      navigate("/login");
    }
  }, []);

  const formik = useFormik({
    initialValues: {
      code: "",
      submit: null,
    },
    validationSchema: Yup.object().shape({
      code: Yup.string().required(t("forms:validation.2fa_code.required")),
    }),
    async onSubmit(values, { setErrors, setStatus, setSubmitting }) {
      try {
        // const captchaCode = recaptcha?.current?.getValue();
        // if (!captchaCode) {
        //   alert(t("recaptcha_check"));
        //   return;
        // }

        await login({
          email: state.email,
          password: state.password,
          keepLoggedIn: state.keepLoggedIn,
          code2fa: values.code,
          // captchaCode,
        });

        setStatus({ success: true });
        setSubmitting(false);
      } catch (err) {
        setStatus({ success: false });
        setErrors({ submit: t(errorDict[err]) });
        setSubmitting(false);
        recaptcha?.current?.reset();
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
        label={t("2fa_code")}
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
        <FormHelperText error>
          <>{formik.errors.submit}</>
        </FormHelperText>
      )}
      {/* <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          mt: 2,
        }}
      >
        <ReCAPTCHA ref={recaptcha} sitekey={import.meta.env.VITE_SITE_KEY} />
      </Box> */}
      <Button
        type="submit"
        color="primary"
        size="large"
        variant="contained"
        disabled={formik.isSubmitting}
        sx={{ mt: 5 }}
      >
        {t("2fa_button")}
      </Button>
    </Stack>
  );
};

export default Login2faForm;
