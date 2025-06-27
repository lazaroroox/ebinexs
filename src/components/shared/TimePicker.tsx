"use client";

import TextField from "@mui/material/TextField";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { ptBR } from "date-fns/locale";

import { Typography, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import { FaCircleMinus, FaCirclePlus } from "react-icons/fa6";
import { InputAdornmentIcon } from "src/components/InputAdornmentIcon";
import { FiMinus } from "react-icons/fi";
import { BsPlus } from "react-icons/bs";

const styles = {
  textInterval: {
    position: "absolute",
    left: "50%",
    bottom: "-8px",
    translate: "-50%",
    padding: "0 0.75rem",
    background: "#040c11",
    color: "#4A4A4A",
    fontSize: "0.625rem",
    whiteSpace: "nowrap",
  } as React.CSSProperties,
};

interface TimePickerProps {
  value: string;
  decrementMinutes: () => void;
  incrementMinutes: () => void;
}

export default function TimePicker({
  decrementMinutes,
  incrementMinutes,
  value,
}: TimePickerProps) {
  const { t } = useTranslation("dashboard");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
      <TextField
        size={isMobile ? "small" : "medium"}
        sx={{
          "& .MuiFormLabel-root": {
            fontSize: isMobile ? ".75rem" : "1rem",
          },

          "& .MuiInputBase-root": {
            padding: isMobile ? "0 0.5rem" : "0 .75rem",
          },
          "& .MuiInputBase-root input": {
            fontSize: isMobile ? ".875rem" : "1.25rem",
            padding: isMobile ? "8.5px 0" : "0.850rem 0",
          },
          "& .MuiIconButton-root:hover": {
            background: "transparent",
          },
        }}
        value={value}
        label={t("time")}
        fullWidth
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornmentIcon icon={FiMinus} onClick={decrementMinutes} />
            ),
            endAdornment: (
              <InputAdornmentIcon
                onClick={incrementMinutes}
                position="end"
                icon={BsPlus}
              />
            ),
            readOnly: true,
          },
        }}
        aria-readonly={true}
      />
      <Typography color="#919eab" variant="caption" style={styles.textInterval}>
        {t("interval")}: 0 - 59 m
      </Typography>
    </LocalizationProvider>
  );
}
