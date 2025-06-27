import {
  CheckCircle,
  Close,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  InputLabel,
  Modal,
  OutlinedInput,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Formik } from "formik";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { BiCheck } from "react-icons/bi";
import { BsExclamationDiamondFill } from "react-icons/bs";
import { FaCircleExclamation } from "react-icons/fa6";
import TitleWithCircleIcon from "src/components/TitleWithCircleIcon";
import useIsMountedRef from "src/hooks/useIsMountedRef";
import { apiPost } from "src/services/apiService";
import { notifyError, notifySuccess } from "src/utils/toast";
import * as Yup from "yup";

const style = {
  "& .modal_content": {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    maxWidth: 450,
    width: "80%",
    border: "1px solid #0b151a",
    background: "#03090c",
    padding: "2rem",
    borderRadius: "12px",
  },
  "& .password_rules": {
    padding: "1rem 0",
    display: "flex",
    gap: "0.5rem",
    flexDirection: "column",
    "& .rule": {
      display: "flex",
      gap: "0.5rem",
    },
  },
  "& .MuiInputBase-root": {
    borderRadius: "12px",
    padding: "0 1.5rem 0 0.5rem",
  },
  "& fieldset": {
    border: "none",
    outline: "none",
  },
  "& .advice": {
    padding: "1rem",
    borderRadius: "16px",
    background: "#081517",
    border: "1px solid #01db97",
  },
  "& .password_changed": {
    padding: "1rem",
    display: "flex",
    flexDirection: "column",
    gap: "2rem",
    "& .MuiBox-root": {
      alignItems: "center",
      textAlign: "center",
    },
  },
};

function ChangePasswordModal({ openModal, handleClose }) {
  const { t } = useTranslation("dashboard");

  const [showPassword, setShowPassword] = useState(false);
  const [hasMinLength, setHasMinLength] = useState(false);
  const [hasUppercase, setHasUppercase] = useState(false);
  const [hasLowercase, setHasLowercase] = useState(false);
  const [hasNumber, setHasNumber] = useState(false);
  const [hasPasswordChanged, setHasPasswordChanged] = useState<
    true | false | null
  >(null);

  const isMountedRef = useIsMountedRef();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const validatePassword = (password) => {
    setHasMinLength(password.length >= 6);
    setHasUppercase(/[A-Z]/.test(password));
    setHasLowercase(/[a-z]/.test(password));
    setHasNumber(/[0-9]/.test(password));
  };

  useEffect(() => {
    setHasMinLength(false);
    setHasUppercase(false);
    setHasLowercase(false);
    setHasNumber(false);
  }, [hasPasswordChanged]);

  const validationSchema = Yup.object().shape({
    oldPassword: Yup.string()
      .min(6, t("atleast_6_characters"))
      .max(255)
      .required(t("oldPassword")),
    newPassword: Yup.string()
      .min(6, t("atleast_6_characters"))
      .matches(/[A-Z]/, t("one_uppercase"))
      .matches(/[a-z]/, t("one_lowercase"))
      .matches(/[0-9]/, t("one_number"))
      .required(t("newPassword")),
    newPasswordConfirmation: Yup.string()
      .oneOf([Yup.ref("newPassword"), null], t("password_mismatch"))
      .required(t("newPasswordConfirmation")),
  });

  const MessageChangedPassword = () => {
    return (
      <Box className="password_changed">
        {hasPasswordChanged && (
          <>
            <TitleWithCircleIcon
              fontSize={24}
              flexDirection="column"
              icon={<BiCheck size={40} color="#01db97" />}
              circleSize={56}
              label={t("password_changed_success")}
              description={t("password_changed_success_description")}
              descriptionColor="#7f8b92"
            />
            <Button
              variant="contained"
              fullWidth
              size="large"
              onClick={confirmModal}
            >
              {t("confirm")}
            </Button>
          </>
        )}

        {!hasPasswordChanged && (
          <>
            <TitleWithCircleIcon
              bgColor="#2a0714"
              fontSize={24}
              flexDirection="column"
              icon={<BsExclamationDiamondFill color="#d2004b" size={36} />}
              circleSize={56}
              label={t("password_changed_error")}
              description={t("password_changed_error_description")}
              descriptionColor="#7f8b92"
            />
            <Button
              variant="contained"
              fullWidth
              size="large"
              onClick={() => setHasPasswordChanged(null)}
            >
              {t("confirm")}
            </Button>
          </>
        )}
      </Box>
    );
  };

  const confirmModal = () => {
    setHasPasswordChanged(null);
    handleClose();
  };

  return (
    <Modal open={openModal} onClose={() => handleClose()} sx={style}>
      <Box sx={{ minWidth: isMobile ? "80%" : null }} className="modal_content">
        <IconButton
          aria-label="close"
          onClick={() => handleClose()}
          sx={{
            position: "absolute",
            right: 8,
            top: 16,
            color: "#606f79",
            "&:hover": {
              color: "#FFF",
              background: "transparent",
            },
          }}
        >
          <Close />
        </IconButton>
        <Stack direction="column" spacing={2}>
          <Typography
            variant="h6"
            fontWeight="400"
            color="#EEE"
            borderBottom="1px solid #0f161a"
            paddingBottom={1}
          >
            {t("reset_password")}
          </Typography>

          {hasPasswordChanged !== null ? (
            <MessageChangedPassword />
          ) : (
            <>
              <Box className="advice">
                <TitleWithCircleIcon
                  noBgColor
                  circleSize={40}
                  fontSize={12}
                  icon={<FaCircleExclamation size={32} />}
                  label={t("password_change_warning")}
                />
              </Box>
              <Stack
                direction={"column"}
                justifyContent="space-between"
                spacing={4}
                sx={{ mb: 2 }}
              >
                <Formik
                  initialValues={{
                    oldPassword: "",
                    newPassword: "",
                    newPasswordConfirmation: "",
                    submit: null,
                  }}
                  validationSchema={validationSchema}
                  onSubmit={async (
                    values,
                    { setStatus, setSubmitting, resetForm }
                  ): Promise<void> => {
                    try {
                      await apiPost("users/change-password", {
                        oldPassword: values.oldPassword,
                        newPassword: values.newPassword,
                      });
                      notifySuccess(t("password_changed_success"));
                      resetForm();
                      if (isMountedRef.current) {
                        setStatus({ success: true });
                        setSubmitting(false);
                      }
                      setHasPasswordChanged(true);
                    } catch (err) {
                      if (err === "OldPasswordNotMatchingException") {
                        notifyError(t("invalidOldPassword"));
                      }
                      setHasPasswordChanged(false);
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
                    isValid,
                    values,
                  }) => (
                    <>
                      <Stack
                        direction={"column"}
                        justifyContent="space-between"
                        spacing={1}
                        width="100%"
                      >
                        <InputLabel sx={{ color: "#EEE" }}>
                          {t("oldPassword")}
                        </InputLabel>
                        <OutlinedInput
                          id="login-oldPassword"
                          placeholder={t("oldPassword")}
                          name="oldPassword"
                          type={showPassword ? "text" : "password"}
                          error={Boolean(
                            touched.oldPassword && errors.oldPassword
                          )}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.oldPassword}
                          endAdornment={
                            <InputAdornment position="end">
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={() => setShowPassword(!showPassword)}
                                edge="end"
                              >
                                {showPassword ? (
                                  <VisibilityOff />
                                ) : (
                                  <Visibility />
                                )}
                              </IconButton>
                            </InputAdornment>
                          }
                        />
                        <InputLabel sx={{ color: "#EEE" }}>
                          {t("newPassword")}
                        </InputLabel>
                        <OutlinedInput
                          name="newPassword"
                          placeholder={t("newPassword")}
                          type={showPassword ? "text" : "password"}
                          error={Boolean(
                            touched.newPassword && errors.newPassword
                          )}
                          onBlur={handleBlur}
                          onChange={(e) => {
                            handleChange(e);
                            validatePassword(e.target.value);
                          }}
                          value={values.newPassword}
                          endAdornment={
                            <InputAdornment position="end">
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={() => setShowPassword(!showPassword)}
                                edge="end"
                              >
                                {showPassword ? (
                                  <VisibilityOff />
                                ) : (
                                  <Visibility />
                                )}
                              </IconButton>
                            </InputAdornment>
                          }
                        />

                        <Box className="password_rules">
                          <Box
                            className="rule"
                            sx={{ color: hasMinLength ? "#3CBA93" : "#798E9B" }}
                          >
                            <CheckCircle />
                            <Typography fontSize={14}>
                              {t("atleast_6_characters")}
                            </Typography>
                          </Box>
                          <Box
                            className="rule"
                            sx={{ color: hasUppercase ? "#3CBA93" : "#798E9B" }}
                          >
                            <CheckCircle />
                            <Typography fontSize={14}>
                              {t("one_uppercase")}
                            </Typography>
                          </Box>
                          <Box
                            className="rule"
                            sx={{ color: hasLowercase ? "#3CBA93" : "#798E9B" }}
                          >
                            <CheckCircle />
                            <Typography fontSize={14}>
                              {t("one_lowercase")}
                            </Typography>
                          </Box>
                          <Box
                            className="rule"
                            sx={{ color: hasNumber ? "#3CBA93" : "#798E9B" }}
                          >
                            <CheckCircle />
                            <Typography fontSize={14}>
                              {t("one_number")}
                            </Typography>
                          </Box>
                        </Box>

                        <InputLabel sx={{ color: "#EEE" }}>
                          {t("newPasswordConfirmation")}
                        </InputLabel>
                        <OutlinedInput
                          name="newPasswordConfirmation"
                          placeholder={t("newPasswordConfirmation")}
                          type={showPassword ? "text" : "password"}
                          error={Boolean(
                            touched.newPasswordConfirmation &&
                              errors.newPasswordConfirmation
                          )}
                          onBlur={handleBlur}
                          onChange={(e) => {
                            handleChange(e);
                            validatePassword(e.target.value);
                          }}
                          value={values.newPasswordConfirmation}
                          endAdornment={
                            <InputAdornment position="end">
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={() => setShowPassword(!showPassword)}
                                edge="end"
                              >
                                {showPassword ? (
                                  <VisibilityOff />
                                ) : (
                                  <Visibility />
                                )}
                              </IconButton>
                            </InputAdornment>
                          }
                        />
                      </Stack>
                      <Box>
                        <Button
                          color="primary"
                          size="large"
                          variant="contained"
                          fullWidth
                          onClick={(e: any) => handleSubmit(e)}
                          disabled={isSubmitting || !isValid}
                        >
                          {t("confirm")}
                        </Button>
                      </Box>
                    </>
                  )}
                </Formik>
              </Stack>
            </>
          )}
        </Stack>
      </Box>
    </Modal>
  );
}

export default ChangePasswordModal;
