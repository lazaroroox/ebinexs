import { MenuItem, Select, Typography } from "@mui/material";
import type { FC } from "react";
import { useContext, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import SettingsContext from "src/contexts/SettingsContext";

const languageOptions = {
  br: {
    icon: "/static/icons/pt_flag.png",
    label: "Português",
  },
  en: {
    icon: "/static/icons/uk_flag.svg",
    label: "English",
  },
  es: {
    icon: "/static/icons/es_flag.svg",
    label: "Español",
  },
};

const SelectLanguage: FC = () => {
  const { settings, saveSettings } = useContext(SettingsContext);
  

  const handleChangeLanguage = (language: string): void => {
    saveSettings({
      ...settings,
      language,
    });
  };

  const selectedOption = languageOptions[settings.language];

  return (
    <>
      <Select
        value={selectedOption.label}
        labelId="idioma"
        id="idioma"
        label="Idioma"
      >
        {Object.keys(languageOptions).map((language) => (
          <MenuItem
            onClick={() => handleChangeLanguage(language)}
            key={language}
            value={languageOptions[language].label}
          >
            <Typography
              color="textPrimary"
              variant="body1"
              sx={{ display: "flex", alignItems: "center" }}
            >
              <img
                alt={languageOptions[language].label}
                src={languageOptions[language].icon}
                style={{ width: 20, height: 20, marginRight: 10 }}
              />
              {languageOptions[language].label}
            </Typography>
          </MenuItem>
        ))}
      </Select>
    </>
  );
};

export default SelectLanguage;
