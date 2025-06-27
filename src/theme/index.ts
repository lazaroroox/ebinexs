import type { Direction, ThemeOptions } from "@mui/material";
import {
  createTheme as createMuiTheme,
  responsiveFontSizes,
} from "@mui/material";
import type {} from "@mui/x-date-pickers/themeAugmentation";
import merge from "lodash/merge";

import { THEMES } from "../constants";
import { darkShadows, lightShadows } from "./shadows";

import { Theme } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface DefaultTheme extends Theme {}
}

interface ThemeConfig {
  direction?: Direction;
  responsiveFontSizes?: boolean;
  roundedCorners?: boolean;
  theme?: string;
}

const baseOptions: ThemeOptions = {
  direction: "ltr",
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1440,
      xl: 1536,
      // "2xl": 1920,
    },
  },
  components: {
    MuiList: {
      styleOverrides: {
        root: {
          padding: 0,
          background: "#070f14",
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: "#051014",
          outline: "1px solid  #0b1721",
          fontSize: 12,
          lineHeight: 1.5,
          padding: 8,
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        fallback: {
          height: "75%",
          width: "75%",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        sizeLarge: {
          paddingLeft: 24,
          paddingRight: 24,
          fontSize: 14,
          height: 48,
        },
        text: {
          color: "white",
        },
        root: {
          textTransform: "none",
        },
      },
    },
    MuiCardHeader: {
      defaultProps: {
        titleTypographyProps: {
          variant: "h6",
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 3,
          overflow: "hidden",
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          minWidth: "auto",
          marginRight: "16px",
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(255, 255, 255, 0.04)",
        },
      },
    },
    // MuiIconButton: {
    //   styleOverrides: {
    //     root: {
    //       ":hover": {
    //         backgroundColor: "rgba(255, 255, 255, 0.75)",
    //       },
    //     },
    //   },
    // },
  },
  typography: {
    fontSize: 11.5,
    button: {
      fontWeight: 600,
    },
    fontFamily: "Inter",
    // fontFamily:
    //   '-apple-system, BlinkMacSystemFont, Inter, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"',
    h1: {
      fontWeight: 600,
      fontSize: "3.5rem",
    },
    h2: {
      fontWeight: 600,
      fontSize: "3rem",
    },
    h3: {
      fontWeight: 600,
      fontSize: "2.25rem",
    },
    h4: {
      fontWeight: 600,
      fontSize: "2rem",
    },
    h5: {
      fontWeight: 600,
      fontSize: "1.5rem",
    },
    h6: {
      fontWeight: 600,
      fontSize: "1.125rem",
    },
    overline: {
      fontWeight: 600,
    },
  },
};

const themesOptions: Record<string, ThemeOptions> = {
  [THEMES.LIGHT]: {
    components: {
      MuiInputBase: {
        styleOverrides: {
          input: {
            "&::placeholder": {
              opacity: 0.86,
              color: "#42526e",
            },
          },
        },
      },
    },
    palette: {
      action: {
        active: "#6b778c",
      },
      background: {
        default: "#f4f5f7",
        paper: "#ffffff",
      },
      error: {
        contrastText: "#ffffff",
        main: "#FE025C",
      },
      mode: "light",
      primary: {
        contrastText: "#ffffff",
        main: "#5664d2",
      },
      success: {
        contrastText: "#ffffff",
        main: "#4caf50",
      },
      text: {
        primary: "#172b4d",
        secondary: "#989C9F",
      },
      warning: {
        contrastText: "#ffffff",
        main: "#ff9800",
      },
    },
    shadows: lightShadows,
  },
  [THEMES.DARK]: {
    components: {
      MuiTableCell: {
        styleOverrides: {
          root: {
            borderBottom: "1px solid rgba(145, 158, 171, 0.24)",
          },
        },
      },
    },
    palette: {
      background: {
        default: "#00060A",
        paper: "#00060A",
      },
      divider: "rgba(145, 158, 171, 0.24)",
      error: {
        contrastText: "#ffffff",
        main: "#FE025C",
      },
      mode: "dark",
      primary: {
        contrastText: "#ffffff",
        main: "#00A667",
      },
      success: {
        contrastText: "#ffffff",
        main: "#4caf50",
      },
      text: {
        primary: "#ffffff",
        secondary: "#919eab",
      },
      warning: {
        contrastText: "#ffffff",
        main: "#ff9800",
      },
    },
    shadows: darkShadows,
  },
  [THEMES.NATURE]: {
    components: {
      MuiTableCell: {
        styleOverrides: {
          root: {
            borderBottom: "1px solid rgba(145, 158, 171, 0.24)",
          },
        },
      },
    },
    palette: {
      background: {
        default: "##1E1E1E",
        paper: "#0A1014",
      },
      divider: "rgba(145, 158, 171, 0.24)",
      error: {
        contrastText: "#ffffff",
        main: "#FE025C",
      },
      mode: "dark",
      primary: {
        contrastText: "#ffffff",
        main: "#01ab56",
      },
      success: {
        contrastText: "#ffffff",
        main: "#4caf50",
      },
      text: {
        primary: "#ffffff",
        secondary: "#919eab",
      },
      warning: {
        contrastText: "#ffffff",
        main: "#ff9800",
      },
    },
    shadows: darkShadows,
  },
};

export const createTheme = (config: ThemeConfig = {}): Theme => {
  let themeOptions = themesOptions[config.theme];

  if (!themeOptions) {
    console.warn(new Error(`The theme ${config.theme} is not valid`));
    themeOptions = themesOptions[THEMES.LIGHT];
  }

  let theme = createMuiTheme(
    merge(
      {},
      baseOptions,
      themeOptions,
      {
        ...(config.roundedCorners && {
          shape: {
            // borderRadius: 16
          },
        }),
      },
      {
        direction: config.direction,
      }
    )
  );

  if (config.responsiveFontSizes) {
    theme = responsiveFontSizes(theme);
  }

  return theme;
};
