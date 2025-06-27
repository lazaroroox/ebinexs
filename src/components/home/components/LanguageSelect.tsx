import { Box, Menu, MenuItem, Typography } from "@mui/material";
import { useContext, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { GrLanguage } from "react-icons/gr";
import SettingsContext from "src/contexts/SettingsContext";

const languageOptions = {
  br: {
    icon: "/static/icons/pt_flag.png",
    label: "Português",
    description: "Idioma nativo do Brasil.",
    code: "PT",
  },
  en: {
    icon: "/static/icons/uk_flag.svg",
    label: "English",
    description: "International language.",
    code: "EN",
  },
  es: {
    icon: "/static/icons/es_flag.svg",
    label: "Español",
    description: "Idioma nativo de países hispânicos.",
    code: "ES",
  },
};

const style = {
  "& .language_icon": {
    pr: 1,
    cursor: "pointer",
    "&:hover": {
      color: "#01DB97",
    },
  },
  "& .MuiPaper-root": {
    color: "#EEE",
    background: "#040709d1",
    backdropFilter: "blur(12px)",
    border: "1px solid #0d1215",
    borderRadius: "8px",
    marginTop: "0.5rem",
  },
};

const LanguageSelect = () => {
  const anchorRef = useRef<HTMLButtonElement | null>(null);
  const { i18n } = useTranslation();
  const { settings, saveSettings } = useContext(SettingsContext);
  const [open, setOpen] = useState<boolean>(false);

  const handleOpen = (): void => {
    setOpen(true);
  };

  const handleClose = (): void => {
    setOpen(false);
  };

  const handleChangeLanguage = (language: string): void => {
    i18n.changeLanguage(language);
    saveSettings({
      ...settings,
      language,
    });
    setOpen(false);
  };

  const selectedOption = languageOptions[i18n.language] || languageOptions.en;

  return (
    <Box sx={style}>
      <Box
        onClick={handleOpen}
        ref={anchorRef}
        data-test-id={"language-select"}
        className="language_icon flex_center"
      >
        <GrLanguage size={20} />
        <Typography variant="body1" ml={1}>
          {selectedOption.code}
        </Typography>
      </Box>
      <Menu
        anchorEl={anchorRef.current}
        id="language-menu"
        open={open}
        onClose={handleClose}
        sx={{
          "& .MuiPaper-root": {
            color: "#EEE",
            background: "#040709d1",
            backdropFilter: "blur(12px)",
            border: "1px solid #0d1215",
            borderRadius: "8px",
            marginTop: "0.5rem",
          },
        }}
      >
        {Object.keys(languageOptions).map((language) => (
          <MenuItem
            onClick={() => handleChangeLanguage(language)}
            key={language}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: ".5rem",
                paddingBottom: "1rem",
                paddingLeft: "0.5rem",
                textDecoration: "none",
                transition: "transform 0.4s",
                textWrap: "auto",
                "&:hover": {
                  transform: "translateX(4px)",
                  borderLeft: "2px solid #10f8a0",
                },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <Box className="icon_circle" sx={{ width: 20, height: 20 }}>
                  <img
                    alt={languageOptions[language].label}
                    src={languageOptions[language].icon}
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />
                </Box>
                <Typography variant="subtitle1" fontSize={16}>
                  {languageOptions[language].label}
                </Typography>
              </Box>
              <Typography
                variant="body1"
                fontSize={14}
                color="#909090"
                width={300}
              >
                {languageOptions[language].description}
              </Typography>
            </Box>
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

export default LanguageSelect;
