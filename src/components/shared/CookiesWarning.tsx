import { Box, Button, Container, Link, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function CookiesWarning() {
  const { t } = useTranslation("cookies");
  const [cookiesAccepted, setCookiesAccepted] = useState<boolean | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const hasAccepted = localStorage.getItem("cookiesAccepted") === "true";
    setCookiesAccepted(hasAccepted);
  }, []);

  if (!mounted || cookiesAccepted) {
    return null;
  }

  const handleAccept = () => {
    localStorage.setItem("cookiesAccepted", "true");
    setCookiesAccepted(true);
  };

  const handleReject = () => {
    localStorage.setItem("cookiesAccepted", "true");
    setCookiesAccepted(true);
  };

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        bgcolor: "black",
        color: "white",
        py: 3,
        px: 2,
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
          {t("title")}
        </Typography>

        <Typography variant="body2" sx={{ mb: 2 }}>
          {t("description")}
        </Typography>

        <Typography variant="body2" sx={{ mb: 3 }}>
          {t("details")}{" "}
          <Link
            href="/politica-de-cookies"
            color="primary.light"
            underline="hover"
          >
            {t("policy")}
          </Link>
          .
        </Typography>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          justifyContent="flex-end"
          sx={{ mt: 2 }}
        >
          <Button
            data-test-id={"accept-cookies-button"}
            variant="contained"
            color="primary"
            onClick={handleAccept}
            sx={{
              bgcolor: "white",
              color: "black",
              borderRadius: 50,
              px: 4,
              "&:hover": {
                bgcolor: "grey.200",
              },
            }}
          >
            {t("accept")}
          </Button>

          <Button
            data-test-id={"reject-cookies-button"}
            variant="outlined"
            color="inherit"
            onClick={handleReject}
            sx={{
              borderColor: "white",
              borderRadius: 50,
              px: 4,
              "&:hover": {
                borderColor: "white",
                bgcolor: "rgba(255, 255, 255, 0.1)",
              },
            }}
          >
            {t("reject")}
          </Button>
        </Stack>
      </Container>
    </Box>
  );
}
