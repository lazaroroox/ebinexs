import {
    Box,
    Button,
    Stack,
    Typography,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { BiSupport } from "react-icons/bi";
import { HiOutlineMail } from "react-icons/hi";
import { MdEmail } from "react-icons/md";
import TitleWithCircleIcon from "src/components/TitleWithCircleIcon";
import CopyOnClick from "../CopyOnClick";

const ContactSection = () => {
  const { t } = useTranslation("contact_section");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Stack spacing={2} className="right_card">
      <Box className="contact_header">
        <TitleWithCircleIcon
          icon={<BiSupport color="#01DB97" size={isMobile ? 24 : 28} />}
          circleSize={40}
          fontWeight="500"
          fontSize={isMobile ? 16 : 20}
          label={t("support_title")}
          noBgColor
        />
      </Box>
      <Box pt={1}>
        <Typography variant="body1" color={"#AAA"}>
          {t("support_description")}
        </Typography>
        <Typography
          variant="body1"
          color="#EEE"
          sx={{ display: "flex", gap: 1, pt: 1 }}
        >
          <HiOutlineMail size={20} color="01db97" />
          <CopyOnClick
            text={"support@ebinex.global"}
            sx={{ color: "#EEE" }}
            onlyText
          />
        </Typography>
      </Box>
      <Button
        variant="contained"
        className="email_button flex_center"
        onClick={() =>
          (window.location.href =
            "mailto:support@ebinex.global?subject=Assunto&body=Corpo do email")
        }
        fullWidth
        size="large"
      >
        <MdEmail size={24} />
        <Typography variant="body1" ml={1}>
          {t("send_email")}
        </Typography>
      </Button>
    </Stack>
  );
};

export default ContactSection;
