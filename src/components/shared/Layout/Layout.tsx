import { Box } from "@mui/material";
import { FC, ReactNode } from "react";
import { Footer } from "src/layout/Footer";
import { Header } from "./Header";

interface LayoutProps {
  children?: ReactNode;
}

export const Layout: FC<LayoutProps> = (props) => {
  const { children } = props;

  return (
    <Box
      sx={{
        fontWeight: 400,
        minHeight: "100vh",
        color: "#fff",
        background: "#00060A",
      }}
    >
      <Header />
      {children}
      <Footer />
    </Box>
  );
};
