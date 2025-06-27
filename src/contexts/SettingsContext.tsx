import type { FC, ReactNode } from "react";
import { createContext, useEffect, useState } from "react";
import { THEMES } from "../constants";
import { useTranslation } from "react-i18next";

interface Settings {
  compact?: boolean;
  direction?: "ltr" | "rtl";
  language?: string;
  responsiveFontSizes?: boolean;
  roundedCorners?: boolean;
  theme?: string;
  isSoundOn?: boolean;
}

export interface SettingsContextValue {
  settings: Settings;
  saveSettings: (update: Settings) => void;
}

interface SettingsProviderProps {
  children?: ReactNode;
}

const initialSettings: Settings = {
  compact: true,
  direction: "ltr",
  language: "br",
  responsiveFontSizes: true,
  roundedCorners: true,
  theme: THEMES.LIGHT,
  isSoundOn: true,
};

export const restoreSettings = (): Settings | null => {
  let settings = null;

  try {
    const storedData: string | null = window.localStorage.getItem("settings");

    if (storedData) {
      settings = JSON.parse(storedData);
    } else {
      settings = {
        compact: true,
        direction: "ltr",
        language: "br",
        responsiveFontSizes: true,
        roundedCorners: true,
        theme: THEMES.DARK,
        isSoundOn: true,

        // @todo, validar com as configs do usuario
        // theme: window.matchMedia('(prefers-color-scheme: light)').matches
        //   ? THEMES.LIGHT
        //   : THEMES.DARK
      };
    }
  } catch (err) {
    console.error(err);
    // If stored data is not a strigified JSON this will fail,
    // that's why we catch the error
  }

  return settings;
};

export const storeSettings = (settings: Settings): void => {
  window.localStorage.setItem("settings", JSON.stringify(settings));
};

const SettingsContext = createContext<SettingsContextValue>({
  settings: initialSettings,
  saveSettings: () => {},
});

export const SettingsProvider: FC<SettingsProviderProps> = (props) => {
  const { i18n } = useTranslation();
  const { children } = props;
  const [settings, setSettings] = useState<Settings>(initialSettings);

  useEffect(() => {
    const restoredSettings = restoreSettings();
    if (restoredSettings) {
      saveSettings(restoredSettings);
    }
  }, []);

  const saveSettings = (updatedSettings: Settings): void => {
    setSettings(updatedSettings);
    storeSettings(updatedSettings);
  };

  useEffect(() => {
    if (settings.language) {
      i18n.changeLanguage(settings.language)
    }
  }, [settings.language])

  return (
    <SettingsContext.Provider
      value={{
        settings,
        saveSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const SettingsConsumer = SettingsContext.Consumer;

export default SettingsContext;
