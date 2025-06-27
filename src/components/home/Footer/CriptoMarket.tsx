import {
  Box,
  Button,
  Grid,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { FaMousePointer } from "react-icons/fa";
import { FaTriangleExclamation } from "react-icons/fa6";
import { MdCandlestickChart, MdWatchLater } from "react-icons/md";
import { RiForbid2Fill } from "react-icons/ri";
import { Link as RouterLink } from "react-router-dom";
import heroImage from "src/assets/images/home/footer/cripto_market_img.png";
import Container from "src/components/shared/Container";
import TitleWithCircleIcon from "src/components/TitleWithCircleIcon";
import CtaSession from "./CtaSession";

const CriptoMarket = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { t } = useTranslation("cripto_market");

  const GOOD_POINTS = [
    {
      id: 1,
      icon: <RiForbid2Fill size={32} />,
      title: t("good_points.title_1"),
      description: t("good_points.description_1"),
    },
    {
      id: 2,
      icon: <FaTriangleExclamation size={24} />,
      title: t("good_points.title_2"),
      description: t("good_points.description_2"),
    },
    {
      id: 3,
      icon: <MdCandlestickChart size={36} />,
      title: t("good_points.title_3"),
      description: t("good_points.description_3"),
    },
    {
      id: 4,
      icon: <FaMousePointer size={28} />,
      title: t("good_points.title_4"),
      description: t("good_points.description_4"),
    },
    {
      id: 5,
      icon: <MdWatchLater size={32} />,
      title: t("good_points.title_5"),
      description: t("good_points.description_5"),
    },
  ];

  const style = {
    position: "relative",
    pt: { xs: 4, md: 24 },

    "& .hero_image": {
      width: "100%",
      maxWidth: "420px",
    },

    "& .good_points_session": {
      background: "#141719b3",
      padding: "2rem 0",
      margin: "4rem 0",
      textAlign: "center",
    },
    "& .our_values_session": {
      textAlign: "center",
    },
    "& .our_values_grid": {
      background: "#030B10",
      padding: "2rem 0.5rem",
    },
  };

  return (
    <Box sx={{ ...style, pt: isMobile ? 12 : 24 }}>
      <Container>
        <Grid
          container
          sx={{ justifyContent: "center", gap: isMobile ? 2 : 0 }}
        >
          <Grid
            className="left_hero"
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
            size={{ sm: 12, md: 4 }}
          >
            <Typography variant="h4">{t("title")}</Typography>
            <Stack spacing={2} pt={2} color="#80909a">
              <Typography variant="body1">{t("description")}</Typography>
              <Button
                variant="contained"
                size="large"
                sx={{
                  borderRadius: "8px",
                  width: { xs: "100%", md: "160px" },
                }}
                component={RouterLink}
                to="/login"
              >
                {t("cta.cta_label")}
              </Button>
            </Stack>
          </Grid>
          <Grid size={{ md: 2 }} />
          <Grid size={{ sm: 12, md: 4 }}>
            <Box className="logo_box">
              <img
                src={heroImage}
                className="hero_image"
                alt={t("hero_image_alt")}
              />
            </Box>
          </Grid>
        </Grid>
      </Container>

      <Box className="our_values_session">
        <Container>
          <Typography variant="h5" pt={{ xs: 4, md: 10 }} pb={{ xs: 4, md: 4 }}>
            {t("why_trade.title")}
          </Typography>
          <Grid
            container
            sx={{ justifyContent: "center", gap: isMobile ? 2 : 4 }}
          >
            {GOOD_POINTS.map((item) => (
              <Grid
                key={item.id}
                size={{ sm: 12, md: 3 }}
                className="our_values_grid"
                sx={{
                  textAlign: "center",
                  display: "flex",
                  justifyContent: "center",
                  borderRadius: "16px",
                  "& .box_wrapper": {
                    alignItems: "center",
                    margin: 0,
                  },
                }}
              >
                <TitleWithCircleIcon
                  label={item.title}
                  description={item.description}
                  descriptionColor="#80909a"
                  flexDirection="column"
                  icon={item.icon}
                  circleSize={56}
                />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <Box className="available_tripto_session">
        <Container>
          <Grid container sx={{ justifyContent: "center" }}>
            <Typography
              variant="h5"
              pt={{ xs: 4, md: 10 }}
              pb={{ xs: 4, md: 4 }}
            >
              {t("available.title")}
            </Typography>

            <Grid size={{ sm: 12, md: 2 }} />

            <Grid size={{ sm: 12, md: 8 }}>
              <Stack spacing={1} pb={2}>
                <Typography variant="body1">
                  {t("available.major.title")}
                </Typography>
                <Typography variant="body1" color="#80909a">
                  {t("available.major.description")}
                </Typography>
              </Stack>

              <Stack spacing={1}>
                <Typography variant="body1">
                  {t("available.altcoins.title")}
                </Typography>
                <Typography variant="body1" color="#80909a">
                  {t("available.altcoins.description")}
                </Typography>
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Container>
        <CtaSession
          title={<>{t("cta.title")}</>}
          ctaLabel={t("cta.cta_label")}
        />
      </Container>
    </Box>
  );
};

export default CriptoMarket;
