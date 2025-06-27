import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Button,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Logo from "src/components/Logo";
import { ReactNode } from "react";

interface CtaSessionProps {
  title: ReactNode;
  ctaLabel: string;
}

const style = {
  background: "#030B10",
  padding: "3rem",
  position: "relative",
  overflow: "hidden",
  margin: "3rem 0",
  borderRadius: "16px",

  "& .light_green": {
    width: "180px",
    height: "50px",
    position: "absolute",
    bottom: "-42px",
    left: "160px",
    background:
      "radial-gradient(circle, rgb(0 255 170 / 40%) 80%, rgb(101 255 191) 50%)",
    filter: "blur(46px)",
  },
};
const CtaSession = ({ title, ctaLabel }: CtaSessionProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box sx={style}>
      <Stack spacing={2}>
        <Box
          sx={{
            display: "flex",
            justifyContent: isMobile ? "center" : "flex-start",
          }}
        >
          <Logo sx={{ width: 120 }} />
        </Box>
        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent={{ xs: "center", md: "space-between" }}
          alignItems="center"
          spacing={{ xs: 2, md: 0 }}
        >
          <Typography
            variant="h3"
            fontSize={{ xs: 16, md: 32 }}
            fontWeight={isMobile ? 500 : 600}
            textAlign={isMobile ? "center" : "left"}
          >
            {title}
          </Typography>
          <Button
            variant="contained"
            size="large"
            sx={{ borderRadius: "8px" }}
            component={RouterLink}
            to="/login"
          >
            {ctaLabel}
          </Button>
        </Stack>
      </Stack>
      <Box component="span" className="light_green"></Box>
    </Box>
  );
};

export default CtaSession;
