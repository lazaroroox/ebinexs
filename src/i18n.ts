import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./locale/en.json";
import es from "./locale/es.json";
import pt_BR from "./locale/pt_BR.json";

export const resources = {
  en,
  es,
  br: pt_BR,
};

export function isLocale(tested) {
  return Object.keys(resources).some((locale) => locale === tested);
}

const getInitialLocale = () => {
  const localSetting = localStorage.getItem("locale");
  if (localSetting && isLocale(localSetting)) {
    return localSetting;
  }

  const [browserSetting] = navigator.language.split("-");
  if (isLocale(browserSetting)) {
    return browserSetting;
  }

  return "br";
};

i18n.use(initReactI18next).init({
  resources,
  lng: getInitialLocale(),
  fallbackLng: "es",
  interpolation: {
    escapeValue: false,
  },
});
