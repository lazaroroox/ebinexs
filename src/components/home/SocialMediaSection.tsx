import { Box, Button, Stack, useMediaQuery, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";
import { FaTelegram } from "react-icons/fa";
import { FiExternalLink } from "react-icons/fi";
import { RiInstagramFill } from "react-icons/ri";
import TitleWithCircleIcon from "src/components/TitleWithCircleIcon";

const SocialMediaSection = () => {
  const { t } = useTranslation("social_media_section");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Stack spacing={2} mt={2} className="right_card">
      <Box className="contact_header">
        <TitleWithCircleIcon
          icon={<FiExternalLink color="#01DB97" size={isMobile ? 24 : 28} />}
          circleSize={40}
          fontWeight="500"
          fontSize={isMobile ? 16 : 20}
          label={t("social_media_title")}
          noBgColor
        />
      </Box>
      <Button
        variant="contained"
        className="social_button flex_center"
        href="https://www.instagram.com/ebinex.br/"
        target="_blank"
        fullWidth
        size="large"
        disableElevation
      >
        <TitleWithCircleIcon
          label={t("instagram")}
          icon={<RiInstagramFill size={24} />}
          circleSize={36}
          bgColor="#0b362a"
        />
      </Button>
      <Button
        variant="contained"
        className="social_button flex_center"
        href="https://t.me/ebinexofficial"
        target="_blank"
        fullWidth
        size="large"
        disableElevation
      >
        <TitleWithCircleIcon
          label={t("telegram")}
          icon={<FaTelegram size={24} />}
          circleSize={36}
          bgColor="#0b362a"
        />
      </Button>
    </Stack>
  );
};

export default SocialMediaSection;
