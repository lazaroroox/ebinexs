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
import { AiFillSignature } from "react-icons/ai";
import { BiSolidCoinStack } from "react-icons/bi";
import { CgTimelapse } from "react-icons/cg";
import { IoArrowDownCircle } from "react-icons/io5";
import { MdCandlestickChart } from "react-icons/md";
import { Link as RouterLink } from "react-router-dom";
import heroImage from "src/assets/images/home/footer/options_market.png";
import Container from "src/components/shared/Container";
import TitleWithCircleIcon from "src/components/TitleWithCircleIcon";
import CtaSession from "./CtaSession";

const OptionsMarket = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { t } = useTranslation("options_market");

  const GOOD_POINTS = [
    {
      id: 1,
      icon: <AiFillSignature size={32} />,
      title: t("why_trade.points.0.title"),
      description: t("why_trade.points.0.description"),
    },
    {
      id: 2,
      icon: <IoArrowDownCircle size={24} />,
      title: t("why_trade.points.1.title"),
      description: t("why_trade.points.1.description"),
    },
    {
      id: 3,
      icon: <BiSolidCoinStack size={36} />,
      title: t("why_trade.points.2.title"),
      description: t("why_trade.points.2.description"),
    },
  ];

  const style = {
    position: "relative",
    pt: { xs: 4, md: 24 },

    "& .hero_image": {
      width: "100%",
      maxWidth: "500px",
    },

    "& .why_trade_box": {
      border: "1px solid #00A667",
      borderRadius: "16px",
      padding: "2rem",
    },
    "& .why_trade_session": {
      background: "#030B10",
      margin: "4rem 0",
      textAlign: "center",
    },
    "& .our_values_session": {
      textAlign: "center",
    },
  };

  return (
    <Box sx={{ ...style, pt: isMobile ? 12 : 24 }}>
      <Container>
        <Grid container sx={{ justifyContent: "center" }}>
          <Grid
            className="left_hero"
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
            size={{ sm: 12, md: 5 }}
          >
            <Typography variant="h3">
              {t("title")}
              <br /> {t("title_2")}
            </Typography>
            <Stack spacing={2} pt={2} color="#EEE">
              <Typography variant="body1">{t("description.intro")}</Typography>
              <Typography variant="body1" color="#80909a">
                {t("description.details")}
              </Typography>
              <Button
                variant="contained"
                size="large"
                sx={{ borderRadius: "8px", width: { xs: "100%", md: "160px" } }}
                component={RouterLink}
                to="/login"
              >
                {t("cta.cta_label")}
              </Button>
            </Stack>
          </Grid>
          <Grid size={{ md: 1 }} />
          <Grid size={{ sm: 12, md: 5 }}>
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

      <Box
        className="why_trade_session"
        sx={{ padding: isMobile ? "2rem 0" : "4rem 0" }}
      >
        <Container>
          <Typography variant="h4" pb={{ xs: 4, md: 6 }}>
            {t("why_trade.title")}
          </Typography>
          <Grid container sx={{ justifyContent: "center", gap: 4 }}>
            {GOOD_POINTS.map((item) => (
              <Grid
                key={item.id}
                size={{ sm: 12, md: 3 }}
                sx={{
                  textAlign: "center",
                  display: "flex",
                  justifyContent: "center",
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
          <Grid
            container
            sx={{ justifyContent: "center", alignItems: "center" }}
          >
            <Grid size={{ sm: 12, md: 5 }}>
              <Stack spacing={2}>
                <Typography variant="h4">{t("what_is.title")}</Typography>
                <Typography variant="body1" color="#80909a">
                  {t("what_is.description.part1")}
                </Typography>
                <Typography variant="body1" color="#80909a">
                  {t("what_is.description.part2")}
                </Typography>
              </Stack>
            </Grid>

            <Grid size={{ sm: 12, md: 1 }} />
            <Grid size={{ sm: 12, md: 6 }}>
              <Stack spacing={4} pb={2} pt={isMobile ? 4 : 0}>
                <Box className="why_trade_box">
                  <TitleWithCircleIcon
                    label={t("new_options.title")}
                    description={t("new_options.description")}
                    descriptionColor="#80909a"
                    fontSize={18}
                    icon={<MdCandlestickChart size={24} />}
                    circleSize={40}
                    flexDirection="column"
                  />
                </Box>
                <Box className="why_trade_box">
                  <TitleWithCircleIcon
                    label={t("retracement.title")}
                    description={t("retracement.description")}
                    descriptionColor="#80909a"
                    fontSize={18}
                    icon={<CgTimelapse size={24} />}
                    circleSize={40}
                    flexDirection="column"
                  />
                </Box>
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Container>
        <CtaSession
          title={isMobile ? t("cta.title") : <>{t("cta.title")}</>}
          ctaLabel={t("cta.cta_label")}
        />
      </Container>
    </Box>
  );
};

export default OptionsMarket;
