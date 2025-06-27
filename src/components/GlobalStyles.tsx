import { GlobalStyles as GlobalStyle } from "@mui/material";
import type { FC } from "react";

const GlobalStyles: FC = () => {
  return (
    <GlobalStyle
      styles={{
        "*": {
          boxSizing: "border-box",
          margin: 0,
          padding: 0,
        },
        html: {
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale",
          height: "100%",
          width: "100%",
          scrollBehavior: "smooth",
          fontFamily: "'Inter', sans-serif !important",
          fontDisplay: "swap",
        },
        body: {
          height: "100%",
          width: "100%",
          fontFamily: "'Inter', sans-serif !important",
          fontDisplay: "swap",
          background: "#00060A",
        },
        "#root": {
          height: "100%",
          width: "100%",
        },
        a: {
          color: "white",
        },
      }}
    />
  );
};

export default GlobalStyles;
