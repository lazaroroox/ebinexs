import {
  Box,
  Grid,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { BiSolidBadgeCheck } from "react-icons/bi";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { HiMiniPuzzlePiece } from "react-icons/hi2";
import { MdSecurity } from "react-icons/md";
import ebinexLogo from "src/assets/images/home/footer/OnlyLogo.png";
import heroImage from "src/assets/images/home/footer/quemsomos_image.png";
import Container from "src/components/shared/Container";
import TitleWithCircleIcon from "src/components/TitleWithCircleIcon";
import CtaSession from "./CtaSession";

const WhoWeAre = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { t } = useTranslation("who_we_are");

  const OUR_VALUES = [
    {
      id: 1,
      icon: <MdSecurity size={32} />,
      title: t("our_values.integrity.title"),
      description: t("our_values.integrity.description"),
    },
    {
      id: 2,
      icon: <FaMagnifyingGlass size={24} />,
      title: t("our_values.customer_focus.title"),
      description: t("our_values.customer_focus.description"),
    },
    {
      id: 3,
      icon: <BiSolidBadgeCheck size={36} />,
      title: t("our_values.competence.title"),
      description: t("our_values.competence.description"),
    },
    {
      id: 4,
      icon: <HiMiniPuzzlePiece size={32} />,
      title: t("our_values.teamwork.title"),
      description: t("our_values.teamwork.description"),
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
      background: "#030B10",
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
    <Box sx={style}>
      <Container>
        <Grid container>
          <Grid
            className="left_hero"
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
            size={{ sm: 12, md: 6 }}
          >
            <Stack
              direction="row"
              alignItems={"center"}
              justifyContent={{ xs: "center", md: "flex-start" }}
              gap={2}
              pt={{ xs: 8, md: 0 }}
              pb={{ xs: 2, md: 0 }}
            >
              <Box className="logo_box">
                <img src={ebinexLogo} width={56} alt="Logo da Ebinex" />
              </Box>
              <Typography variant="h4">{t("title")}</Typography>
            </Stack>
            <Stack spacing={2} pt={2} color="#80909a">
              <Typography variant="body1">{t("description_1")}</Typography>
              <Typography variant="body1">{t("description_2")}</Typography>
            </Stack>
          </Grid>
          <Grid size={{ md: 1 }} />
          <Grid size={{ sm: 12, md: 5 }}>
            <Box className="logo_box" pt={{ xs: 4, md: 0 }}>
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
            {t("our_values.title")}
          </Typography>
          <Grid
            container
            sx={{ justifyContent: "space-between" }}
            gap={{ xs: 2, md: 0 }}
          >
            {OUR_VALUES.map((item) => (
              <Grid
                key={item.id}
                size={{ sm: 12, md: 2.85 }}
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

      <Container>
        <CtaSession
          title={isMobile ? t("cta.mobile_title") : t("cta.desktop_title")}
          ctaLabel={t("cta.cta_label")}
        />
      </Container>
    </Box>
  );
};

export default WhoWeAre;
