import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Box,
  Checkbox,
  FormControl,
  FormHelperText,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import { addMonths } from "date-fns";
import { useFormik } from "formik";
import { FC, useEffect, useRef, useState } from "react";
import { useCookies } from "react-cookie";
import ReCAPTCHA from "react-google-recaptcha";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import DDISelect from "src/components/selects/DDISelect";
import { useTestMode } from "src/contexts/TestModeContext";
import useAuth from "src/hooks/useAuth";
import useQuery from "src/hooks/useQuery";
import gtm from "src/lib/gtm";
import { apiPost } from "src/services/apiService";
import { formatCellphone } from "src/utils/formatters";
import * as Yup from "yup";

const errorDict = new Proxy(
  {
    UserAlreadyExistsException: "forms:user_already_exists",
  },
  {
    get(target, prop) {
      return target[prop] || prop;
    },
  }
);

const blockedDomains = ["uorak.com", "example.com"];

const RegisterForm: FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { t } = useTranslation(["login_register", "forms"]);
  const { register, login } = useAuth();
  const [cookies, setCookie, removeCookie] = useCookies(["linkId"]);
  const navigate = useNavigate();
  const recaptcha: any = useRef(null);
  const [linkId, setLinkId] = useState<string | null>(null);
  const [confirmAge, setConfirmAge] = useState(true);

  const query = useQuery();

  const { isTestMode } = useTestMode();

  useEffect(() => {
    const linkIdFromUrl = query.get("linkId");

    gtm.push({ event: "page_view" });

    // Facebook Pixel
    const script = document.createElement("script");
    script.innerHTML = `
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', '1801013410854104'); 
    fbq('track', 'PageView');
  `;
    document.head.appendChild(script);

    if (linkIdFromUrl) {
      const expires = addMonths(new Date(), 1);
      setLinkId(linkIdFromUrl);
      setCookie("linkId", linkIdFromUrl, { path: "/", expires });
      apiPost("/partner/linkClick", {}, { linkId: linkIdFromUrl });
    } else if (cookies.linkId) {
      setLinkId(cookies.linkId);
    }
  }, []);

  const formik = useFormik({
    validationSchema: Yup.object().shape({
      name: Yup.string().required(t("forms:validation.name.required")),
      email: Yup.string()
        .email(t("forms:validation.email.invalid"))
        .max(255, t("forms:validation.email.greaterThanLimit"))
        .required(t("forms:validation.email.required"))
        .test(
          "is-not-blocked-domain",
          t("forms:validation.email.blockedDomain"),
          (value) => {
            if (!value) return true;
            const domain = value.split("@")[1];
            return !blockedDomains.includes(domain);
          }
        ),
      phone: Yup.string()
        .min(8, t("forms:validation.phone.lessThanMinimum"))
        .required(t("forms:validation.phone.required")),
      phonePrefix: Yup.string().required(
        t("forms:validation.phonePrefix.required")
      ),
      password: Yup.string()
        .min(7, t("forms:validation.password.lessThanMinimum"))
        .max(255, t("forms:validation.password.greaterThanLimit"))
        .required(t("forms:validation.new_password.required")),
      passwordConfirmation: Yup.string().oneOf(
        [Yup.ref("password"), null],
        t("forms:validation.password.mismatched")
      ),
      linkId: Yup.string(),
    }),
    initialValues: {
      name: "",
      email: "",
      password: "",
      phonePrefix: "55",
      phone: "",
      passwordConfirmation: "",
      submit: null,
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

        await register({
          name: values.name,
          email: values.email,
          phonePrefix: values.phonePrefix,
          phone: values.phone,
          password: values.password,
          linkId,
        });
        await login({
          email: values.email,
          password: values.password,
          captchaCode,
        });
        setStatus({ success: true });
        setSubmitting(false);
      } catch (err) {
        if (err === "User has ON_HOLD status.") {
          navigate("/authentication/waiting_list", {
            state: {
              email: values.email,
            },
          });
        }

        if (err === "UserNotActiveException") {
          navigate("/email-confirmation", {
            state: {
              email: values.email,
              password: values.password,
              captchaCode: recaptcha?.current?.getValue(),
            },
          });
        }

        setStatus({ success: false });
        setErrors({
          submit: t(errorDict[err]),
        });
        setSubmitting(false);
        recaptcha?.current?.reset();
      }
    },
  });

  console.log("formik.errors", formik.errors);

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  return (
    <>
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
          id="name"
          label={t("name")}
          variant="outlined"
          name="name"
          error={Boolean(formik.touched.name && formik.errors.name)}
          helperText={formik.touched.name && formik.errors.name}
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          type="name"
          value={formik.values.name}
        />
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
        <FormControl>
          <InputLabel htmlFor="register-password">{t("password")}</InputLabel>
          <OutlinedInput
            id="register-password"
            type={showPassword ? "text" : "password"}
            error={Boolean(formik.touched.password && formik.errors.password)}
            label={t("password")}
            name="password"
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
          />
          {Boolean(formik.touched.password && formik.errors.password) && (
            <FormHelperText error>{formik.errors.password}</FormHelperText>
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
        <Stack direction="row" gap={2} alignItems="flex-start">
          <Stack width={120}>
            <DDISelect
              value={formik.values.phonePrefix}
              initialValue={{
                code: "BR",
                label: "Brasil",
                phone: "55",
                suggested: false,
              }}
              error={Boolean(
                formik.touched.phonePrefix || formik.errors.phonePrefix
              )}
              onChange={(event) =>
                formik.handleChange({
                  target: {
                    name: "phonePrefix",
                    value: event?.phone,
                  },
                })
              }
              onBlur={formik.handleBlur}
            />
            {Boolean(
              formik.touched.phonePrefix || formik.errors.phonePrefix
            ) && (
              <FormHelperText error>
                {formik.touched.phonePrefix ?? formik.errors.phonePrefix}
              </FormHelperText>
            )}
          </Stack>
          <Stack flex={1.5}>
            <TextField
              name="phone"
              placeholder="Número de telefone"
              value={formik.values.phone}
              onChange={(e) => {
                if (formik.values.phonePrefix === "55") {
                  const previousValue = e.target.value.replace(/\D/g, "");
                  const formattedValue = formatCellphone(previousValue);
                  e.target.value = formattedValue;
                } else {
                  e.target.value = e.target.value.replace(/\D/g, "");
                }
                formik.handleChange(e);
              }}
              error={Boolean(formik.touched.phone && formik.errors.phone)}
              onBlur={formik.handleBlur}
              helperText={formik.touched.phone && formik.errors.phone}
              required={true}
            />
          </Stack>
        </Stack>
        {formik.errors.submit && (
          <Box sx={{ mt: 1 }}>
            <FormHelperText error>
              <>{formik.errors.submit}</>
            </FormHelperText>
          </Box>
        )}
        <Box
          sx={{ cursor: "pointer" }}
          onClick={() => setConfirmAge(!confirmAge)}
        >
          <Stack direction={"row"} spacing={1} alignItems="center">
            <Checkbox checked={confirmAge} />
            <Typography color="textSecondary" variant="body2">
              {t("by_clicking_register")}
            </Typography>
          </Stack>
        </Box>
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
          variant="contained"
          disabled={formik.isSubmitting}
          sx={{ mt: 5 }}
        >
          {t("open_free_account")}
        </Button>
      </Stack>
    </>
  );
};

export default RegisterForm;
