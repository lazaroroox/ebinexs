import { Close } from "@mui/icons-material";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { format, isBefore, parse } from "date-fns";
import { useFormik } from "formik";
import React, { forwardRef, useContext } from "react";
import { useTranslation } from "react-i18next";
import { IMaskInput } from "react-imask";
import DDISelect from "src/components/selects/DDISelect";
import NationalitySelect from "src/components/selects/NationalitySelect";
import LayoutContext from "src/contexts/LayoutContext";
import useAuth from "src/hooks/useAuth";
import { apiPut } from "src/services/apiService";
import useUser from "src/swr/use-user";
import { formatCellphone } from "src/utils/formatters";
import { isValidCPF } from "src/utils/isValidCPF";
import { notifyError, notifySuccess } from "src/utils/toast";
import { mutate } from "swr";
import * as Yup from "yup";

interface CustomProps {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
}

const InputDateCustom = React.forwardRef<HTMLElement, CustomProps>(
  function TextMaskCustom(props, ref) {
    const { onChange, ...other } = props;
    return (
      <IMaskInput
        {...other}
        mask="00/00/0000"
        definitions={{
          "#": /[1-9]/,
        }}
        inputRef={ref}
        onAccept={(value: any) =>
          onChange({ target: { name: props.name, value } })
        }
        overwrite
      />
    );
  }
);

interface CustomCpfProps {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
}

const InputCpfCustom = forwardRef<HTMLElement, CustomCpfProps>(
  function TextMaskCustom(props, ref) {
    const { onChange, ...other } = props;
    return (
      <IMaskInput
        {...other}
        mask="000.000.000-00"
        definitions={{
          "#": /[1-9]/,
        }}
        inputRef={ref}
        onAccept={(value: any) =>
          onChange({ target: { name: props.name, value } })
        }
        overwrite
      />
    );
  }
);

const style = {
  color: "#EEE",
  display: "flex",
  justifyContent: "center",
  flexDirection: "column",

  "& .modal_content": {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    maxWidth: 900,
    width: "80%",
    border: "1px solid #0b151a",
    background: "#03090c",
    padding: "2rem",
    borderRadius: "12px",
  },
  "& fieldset": {
    border: "none",
    outline: "none",
  },
};

function PersonalDataModal({ openModal, handleCloseModal }) {
  const { initialize } = useAuth();
  const { user } = useUser();
  const { t } = useTranslation("dashboard");
  const { layout, setAccountValidate } = useContext(LayoutContext);
  const [year, month, day] = user?.birthDate?.split("T")[0].split("-") || [];

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const formik = useFormik({
    initialValues: {
      email: user?.email || "",
      name: user?.name || "",
      phonePrefix: user?.phonePrefix || "",
      phone: user?.phone || "",
      telegram: user?.telegram || "",
      whatsapp: user?.whatsapp || "",
      cpf: user?.cpf || "",
      birthDate: user?.birthDate ? `${day}/${month}/${year}` : "",
      nationality: user?.nationality || "",
      documentType: user?.documentType ?? "RG",
      documentValue: user?.documentValue || "",
      submit: null,
    },
    validationSchema: Yup.object().shape({
      name: Yup.string().max(255).required("Por favor, digite seu nome"),
      phonePrefix: Yup.string().max(5).required("DDI obrigado"),
      phone: Yup.string()
        .max(255)
        .required("O número de celular é obrigatório"),
      telegram: Yup.string().max(255),
      whatsapp: Yup.string().max(255),
      cpf: Yup.string()
        .required("Por favor, digite seu CPF")
        .test("is-valid-cpf", "CPF inválido", (value) => {
          if (!value) return false;
          return isValidCPF(value);
        }),
      birthDate: Yup.string()
        .required("Data de nascimento obrigatória")
        .test("is-18-or-older", "Você deve ter 18 anos ou mais", (value) => {
          const birthDate = parse(value, "dd/MM/yyyy", new Date());
          const today = new Date();
          const eighteenYearsAgo = new Date(
            today.getFullYear() - 18,
            today.getMonth(),
            today.getDate()
          );
          return isBefore(birthDate, eighteenYearsAgo);
        }),
      nationality: Yup.string()
        .max(255)
        .required("Selecione sua nacionalidade"),
      documentValue: Yup.string()
        .max(255)
        .required("Digite o número do documento"),
    }),
    validateOnBlur: true,
    onSubmit: async (
      values,
      { setErrors, setStatus, setSubmitting }
    ): Promise<void> => {
      try {
        const { birthDate, cpf, phone, ...restValues } = values;
        const d = birthDate.split("/");
        await apiPut("users", {
          ...restValues,
          phone: phone.replace(/\D/g, ""),
          cpf: cpf.replace(/\D/g, ""),
          birthDate: format(
            new Date(`${d[1]}/${d[0]}/${d[2]} 00:00:00`),
            "yyyy-MM-dd"
          ),
        });
        initialize();
        mutate("/users");
        notifySuccess("Dados alterados com sucesso");
        handleCloseModal();
      } catch (err) {
        console.log("err", err);
        setStatus({ success: false });
        setErrors({ submit: err });
        notifyError("Falha ao salvar dados");
        setSubmitting(false);
      }
    },
  });

  const handleSaveAccountForm = () => {
    formik.handleSubmit();
    if (layout.accountValidation.started) {
      setAccountValidate({ activeForm: "address" });
    }
  };

  return (
    <Modal open={openModal} onClose={handleCloseModal} sx={style}>
      <Box sx={{ minWidth: isMobile ? "80%" : null }} className="modal_content">
        <Stack spacing={2} sx={{ mb: 2 }}>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="h6" fontWeight={500}>
              {t("personal_data")}
            </Typography>
            <IconButton
              aria-label="close"
              onClick={handleCloseModal}
              sx={{
                position: "absolute",
                right: 8,
                top: 8,
                color: "#606f79",
                "&:hover": {
                  color: "#FFF",
                  background: "transparent",
                },
              }}
            >
              <Close />
            </IconButton>
          </Stack>
          <Grid
            container
            spacing={2}
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            sx={{ overflowY: "auto", maxHeight: "60vh" }}
          >
            <Grid size={{ xs: 12, sm: 6 }}>
              <InputLabel sx={{ mb: 1 }}>{t("your_complete_name")}</InputLabel>
              <TextField
                name="name"
                fullWidth
                type="text"
                value={formik.values.name}
                onChange={(e) => formik.handleChange(e)}
                error={Boolean(formik.touched.name && formik.errors.name)}
                onBlur={formik.handleBlur}
                helperText={formik.touched.name && formik.errors.name}
                variant="outlined"
                required={true}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <InputLabel sx={{ mb: 1 }}>{t("email")}</InputLabel>
              <TextField
                name="email"
                fullWidth
                type="text"
                value={formik.values.email}
                onChange={(e) => formik.handleChange(e)}
                disabled={true}
                variant="outlined"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 3 }}>
              <InputLabel sx={{ mb: 1 }}>{t("nationality")}</InputLabel>
              <FormControl fullWidth>
                <NationalitySelect
                  value={formik.values.nationality}
                  onChange={(event) =>
                    formik.handleChange({
                      target: {
                        name: "nationality",
                        value: event?.label,
                      },
                    })
                  }
                  onBlue={formik.handleBlur}
                />
                {Boolean(
                  formik.touched.nationality && formik.errors.nationality
                ) && (
                  <FormHelperText sx={{ color: "#f44336" }}>
                    {formik.touched.nationality && formik.errors.nationality}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 3 }}>
              <InputLabel sx={{ mb: 1 }}>CPF</InputLabel>
              <TextField
                name="cpf"
                fullWidth
                type="text"
                value={formik.values.cpf}
                onChange={(e) => formik.handleChange(e)}
                error={Boolean(formik.touched.cpf && formik.errors.cpf)}
                InputProps={{
                  inputComponent: InputCpfCustom as any,
                }}
                onBlur={formik.handleBlur}
                helperText={formik.touched.cpf && formik.errors.cpf}
                variant="outlined"
                required={true}
                disabled={!!user?.cpf}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 3 }}>
              <InputLabel sx={{ mb: 1 }}>{t("documentType")}</InputLabel>
              <FormControl fullWidth>
                <Select
                  name="documentType"
                  value={formik.values.documentType}
                  onChange={(e) => formik.handleChange(e)}
                  fullWidth
                >
                  {["RG", "CNH", "RNE", "PASSPORT"].map((item) => (
                    <MenuItem key={item} value={item}>
                      {t(item)}
                    </MenuItem>
                  ))}
                </Select>
                {Boolean(
                  formik.touched.documentType && formik.errors.documentType
                ) && (
                  <FormHelperText>
                    {formik.touched.documentType && formik.errors.documentType}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 3 }}>
              <InputLabel sx={{ mb: 1 }}>{t("document_value")}</InputLabel>
              <TextField
                name="documentValue"
                fullWidth
                type="text"
                value={formik.values.documentValue}
                onChange={(e) => formik.handleChange(e)}
                error={Boolean(
                  formik.touched.documentValue && formik.errors.documentValue
                )}
                onBlur={formik.handleBlur}
                helperText={
                  formik.touched.documentValue && formik.errors.documentValue
                }
                variant="outlined"
                required={true}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 3 }}>
              <InputLabel sx={{ mb: 1 }}>DDI</InputLabel>
              <DDISelect
                value={formik.values.phonePrefix}
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
                formik.touched.phonePrefix && formik.errors.phonePrefix
              ) && (
                <FormHelperText sx={{ color: "#f44336" }}>
                  {formik.touched.phonePrefix && formik.errors.phonePrefix}
                </FormHelperText>
              )}
            </Grid>
            <Grid size={{ xs: 12, sm: 3 }}>
              <InputLabel sx={{ mb: 1 }}>{t("phone")}</InputLabel>
              <TextField
                name="phone"
                placeholder="(11) 99999-9999"
                fullWidth
                type="text"
                value={formatCellphone(formik.values.phone)}
                onChange={(e) => {
                  const rawValue = e.target.value.replace(/\D/g, ""); // Remove máscara
                  formik.setFieldValue("phone", rawValue); // Armazena limpo
                }}
                error={Boolean(formik.touched.phone && formik.errors.phone)}
                onBlur={formik.handleBlur}
                helperText={formik.touched.phone && formik.errors.phone}
                variant="outlined"
                required
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <InputLabel sx={{ mb: 1 }}>{t("birthDate")}</InputLabel>
              <FormControl fullWidth>
                <TextField
                  name="birthDate"
                  value={formik.values.birthDate}
                  onChange={(e) => formik.handleChange(e)}
                  InputProps={{
                    inputComponent: InputDateCustom as any,
                  }}
                  error={Boolean(
                    formik.touched.birthDate && formik.errors.birthDate
                  )}
                  onBlur={formik.handleBlur}
                  required={true}
                />
                {Boolean(
                  formik.touched.birthDate && formik.errors.birthDate
                ) && (
                  <FormHelperText sx={{ color: "#f44336" }}>
                    {formik.touched.birthDate && formik.errors.birthDate}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <InputLabel sx={{ mb: 1 }}>Telegram</InputLabel>
              <FormControl fullWidth>
                <TextField
                  name="telegram"
                  value={formik.values.telegram}
                  onChange={(e) => formik.handleChange(e)}
                  error={Boolean(
                    formik.touched.telegram && formik.errors.telegram
                  )}
                  onBlur={formik.handleBlur}
                />
                {Boolean(formik.touched.telegram && formik.errors.telegram) && (
                  <FormHelperText sx={{ color: "#f44336" }}>
                    {formik.touched.telegram && formik.errors.telegram}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <InputLabel sx={{ mb: 1 }}>Whatsapp</InputLabel>
              <FormControl fullWidth>
                <TextField
                  name="whatsapp"
                  value={formik.values.whatsapp}
                  onChange={(e) => {
                    const previousValue = e.target.value.replace(/\D/g, "");
                    const formattedValue = formatCellphone(previousValue);

                    e.target.value = formattedValue;

                    formik.handleChange(e);
                  }}
                  error={Boolean(
                    formik.touched.whatsapp && formik.errors.whatsapp
                  )}
                  onBlur={formik.handleBlur}
                />
                {Boolean(formik.touched.whatsapp && formik.errors.whatsapp) && (
                  <FormHelperText sx={{ color: "#f44336" }}>
                    {formik.touched.whatsapp && formik.errors.whatsapp}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
          </Grid>
          <Button
            variant="contained"
            size="large"
            disabled={formik.errors && Object.entries(formik.errors).length > 0}
            onClick={() => handleSaveAccountForm()}
          >
            {layout.accountValidation.started ? "Próxmo" : t("save")}
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
}

export default PersonalDataModal;
