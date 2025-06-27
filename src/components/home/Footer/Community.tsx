import {
  Box,
  Grid,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { CgEditBlackPoint } from "react-icons/cg";
import { FaDiscord, FaInstagram, FaTelegramPlane } from "react-icons/fa";
import Container from "src/components/shared/Container";

const Community = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { t } = useTranslation("community");

  const SOCIAL_MEDIA = [
    {
      id: 1,
      icon: <FaTelegramPlane size={36} color="#00ffae" />,
      label: t("social_media.telegram"),
    },
    {
      id: 2,
      icon: <FaInstagram size={36} color="#00ffae" />,
      label: t("social_media.instagram"),
    },
    {
      id: 3,
      icon: <FaDiscord size={36} color="#00ffae" />,
      label: t("social_media.discord"),
    },
  ];

  const style = {
    position: "relative",

    "& .social_box": {
      background: "#030B10",
      borderRadius: "16px",
      padding: "4rem 2rem",
      width: "100%",
      border: "1px solid #081c28",
    },
  };

  return (
    <Box
      sx={{
        ...style,
        height: isMobile ? "auto" : "100vh",
        pt: isMobile ? 12 : 24,
      }}
      className="flex_center"
    >
      <Container>
        <Grid container sx={{ justifyContent: "center" }}>
          <Grid
            className="left_hero"
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              textAlign: "center",
            }}
            size={{ sm: 12, md: 12 }}
          >
            <Stack spacing={4} alignItems={"center"}>
              <Typography variant="h3">{t("title")}</Typography>
              <Typography variant="body1" color="#80909a">
                {t("description")}
              </Typography>
              <Stack
                spacing={2}
                direction={isMobile ? "column" : "row"}
                justifyContent={"center"}
                pt={2}
                color="#EEE"
              >
                <Stack direction="row" spacing={2}>
                  <CgEditBlackPoint size={24} />
                  <Typography variant="body1">
                    {t("features.chat_and_learn")}
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={2}>
                  <CgEditBlackPoint size={24} />
                  <Typography variant="body1">
                    {t("features.participate_events")}
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={2}>
                  <CgEditBlackPoint size={24} />
                  <Typography variant="body1">
                    {t("features.find_answers")}
                  </Typography>
                </Stack>
              </Stack>
            </Stack>
          </Grid>

          <Grid size={{ xs: 10 }}>
            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={2}
              my={4}
              sx={{ width: "100%", justifyContent: "space-between" }}
            >
              {SOCIAL_MEDIA.map((item) => (
                <Stack
                  key={item.id}
                  direction="column"
                  justifyContent={"center"}
                  alignItems={"center"}
                  className="social_box"
                >
                  {item.icon}
                  <Typography variant="body1">{item.label}</Typography>
                </Stack>
              ))}
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Community;
