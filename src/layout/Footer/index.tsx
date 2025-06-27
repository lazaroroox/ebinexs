"use client";
import ExpandMore from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Container,
  Link,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { FaTelegramPlane } from "react-icons/fa";
import { FaDiscord, FaInstagram, FaXTwitter } from "react-icons/fa6";
import Logo from "src/components/Logo";
import { footerMenuOptions } from "./footerMenuOptions";

export function Footer() {
  const isMobile = useMediaQuery("(max-width: 900px)");
  const { t } = useTranslation("footer");

  return (
    <Box width="100%" borderTop="1px solid #15181A">
      <Container
        component={Stack}
        maxWidth="lg"
        direction="column"
        gap={3.5}
        px={4}
        py={4}
        sx={{
          "& .MuiLink-root": {
            textDecoration: "none",
          },
        }}
      >
        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          gap={{ xs: 2, sm: 8 }}
        >
          <Stack
            direction="column"
            alignItems="center"
            justifyContent={{ xs: "space-between", md: "center" }}
            flex={{ xs: 1, sm: 0 }}
            gap={isMobile ? 2.5 : 2}
            component="header"
          >
            <Logo
              sx={{ width: isMobile ? 120 : 182, height: isMobile ? 32 : 48 }}
            />

            <Stack direction="row" gap={1.75} alignItems="center">
              <IconSocialMedia
                icon={<FaInstagram size={18} color="#E7E8E8" />}
                url="#"
                title="Instagram"
              />
              <IconSocialMedia
                icon={<FaTelegramPlane size={18} color="#E7E8E8" />}
                url="#"
                title="Telegram"
              />
              <IconSocialMedia
                icon={<FaXTwitter size={18} color="#E7E8E8" />}
                url="#"
                title="X/Twitter"
              />
              <IconSocialMedia
                icon={<FaDiscord size={18} color="#E7E8E8" />}
                url="#"
                title="Discord "
              />
            </Stack>
          </Stack>

          <Stack
            direction={{ xs: "column", md: "row" }}
            flexWrap="wrap"
            gap={{ xs: 0, md: 10 }}
          >
            {isMobile
              ? footerMenuOptions.map((menu) => (
                  <Accordion
                    sx={{ background: "transparent" }}
                    key={menu.title}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMore />}
                      sx={{
                        "& .MuiSvgIcon-root": { color: "#EFEFEF" },
                        borderTop: "1px solid #15181A",
                      }}
                    >
                      <Typography color="#DEE3E6" fontWeight={700} my={"1rem"}>
                        {t(`footer_menu.${menu.title}`)}
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        background: "transparent",
                      }}
                    >
                      {menu.subItens.map((item) => (
                        <Link
                          sx={{
                            width: "fit-content",
                            fontSize: 14,
                            color: "#808080",
                            whiteSpace: "nowrap",
                            cursor: "pointer",
                            py: "0.5rem",
                            "&:hover": {
                              color: "#DEE3E6",
                            },
                          }}
                          key={item.label}
                          href={`/${item.url}`}
                        >
                          {t(`footer_menu.${item.label}`)}
                        </Link>
                      ))}
                    </AccordionDetails>
                  </Accordion>
                ))
              : footerMenuOptions.map((menu) => (
                  <FooterMenuSingle
                    key={menu.title}
                    title={menu.title}
                    subItens={menu.subItens}
                  />
                ))}
          </Stack>
        </Stack>

        <Stack
          direction="row"
          flexWrap="wrap"
          borderTop="1px solid #15181A"
          pt={2}
          alignItems="flex-start"
          justifyContent="flex-start"
          gap={1.5}
        >
          <Typography fontSize={12} color="#989C9F">
            {t("disclaimer")}
          </Typography>
          <Typography fontSize={12} color="#989C9F">
            {t("company_info")}
          </Typography>

          <Typography padding="0.25rem 1.25rem" color="#989C9F" fontSize={12}>
            {t("contact_email")}
          </Typography>
        </Stack>

        <Stack
          direction="row"
          alignItems="center"
          justifyContent="center"
          gap={2}
        >
          <Typography fontSize={12} fontWeight={500} color="#EFEFEF">
            {t("copyright")}
          </Typography>
          <Typography
            fontSize={12}
            fontWeight={500}
            color="#EFEFEF"
            component={Link}
            href="https://ebinex-public.s3.sa-east-1.amazonaws.com/Terms+of+Use+and+Conditions+EBINEX.pdf"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t("terms_of_service")}
          </Typography>

          <Box width="0.5px" height="12px" bgcolor="#454545" />

          <Typography
            fontSize={12}
            fontWeight={500}
            color="#EFEFEF"
            component={Link}
            href="https://ebinex-public.s3.sa-east-1.amazonaws.com/Privacy+Policy_US.pdf"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t("privacy_policy")}
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}

interface FooterMenuProps {
  title: string;
  subItens: Array<{
    label: string;
    url: string;
  }>;
}

export function FooterMenuSingle({ title, subItens }: FooterMenuProps) {
  const { t } = useTranslation("footer");
  return (
    <Stack flex={1} direction="column" gap={3}>
      <Typography color="#DEE3E6" fontWeight={700}>
        {t(`footer_menu.${title}`)}
      </Typography>

      {subItens.map((item) => (
        <Link
          sx={{
            width: "fit-content",
            fontSize: 14,
            color: "#808080",
            whiteSpace: "nowrap",
            cursor: "pointer",
            "&:hover": {
              color: "#DEE3E6",
            },
          }}
          key={item.label}
          href={`/${item.url}`}
        >
          {t(`footer_menu.${item.label}`)}
        </Link>
      ))}
    </Stack>
  );
}

export function IconSocialMedia({
  icon,
  url,
  title,
}: {
  icon: ReactNode;
  url: string;
  title?: string;
}) {
  return (
    <Stack
      component="a"
      alignItems="center"
      justifyContent="center"
      borderRadius="50%"
      border="1px solid #15181A"
      padding={1}
      sx={{
        cursor: "pointer",
        "&:hover": {
          backgroundColor: "#15181A",
        },
      }}
      target="_blank"
      href={url}
      aria-label={title}
    >
      {icon}
    </Stack>
  );
}
